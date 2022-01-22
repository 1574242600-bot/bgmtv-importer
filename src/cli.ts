#!/usr/bin/env node
import fs from 'fs';
import yargs from 'yargs';
import logger from './logger';
import { hideBin } from 'yargs/helpers';
import BangumiUser from '@bangumi/api/user';
import BangumImporter, * as progressData from '@importer/index';
import { ProgressData } from '@importer/progressData';

yargs(hideBin(process.argv))
    .usage('使用方法: bangumi-importer <command> [params]')
    .command('import <files...>', '导入收藏及观看进度', (yargs) => {
        return yargs
            .usage('使用方法: bangumi-importer import <files...>')
            .example('bangumi-importer import example.json', '')
            .example('bangumi-importer import 1.json 2.json', '')
            .version(false)
            .help(false);
    }, importHandler)
    .command('reimport <file>', '重新导入收藏及观看进度', (yargs) => {
        return yargs
            .usage('使用方法: bangumi-importer reimport <file>')
            .example('bangumi-importer reimport example.dump.json', '')
            .version(false)
            .help(false);
    }, reimportHandler)
    .option('token', {
        type: 'string',
        required: true,
        global: true,
        describe: 'Bangumi API Token'
    })
    .option('f', {
        type: 'boolean',
        global: true,
        describe: '强制导入。 当有条目导入失败时将不会中断整个程序'
    })
    .middleware(async ({ files, file }) => {
        const paths = files || [file];

        for (const path of <string[]>paths) {
            if (!fs.existsSync(path)) {
                logger.error(`未找到文件 ${path}`);
                process.exit(1);
            }
        }
    })
    .middleware(async (argv) => {
        const { token } = argv;

        try {
            const me = await getMeInfo(token);

            logger.info(`用户名: ${me.username}`);
            logger.info(`用户ID: ${me.id}`);

        } catch (e) {
            logger.error(e);
            logger.error('获取用户信息失败，请检查 API Token 是否正确');
            process.exit(1);
        }

        argv.BI = new BangumImporter(token);
        return argv;
    })
    .demandCommand(1, '必须指定一个命令')
    .recommendCommands()
    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .locale('zh_CN')
    .fail(false)
    .parse();




const global = {
    locked: false,
    progressData: [],
    currImportProgress: 0,
};

async function importHandler(argv: yargs.Arguments) {
    /** 读取, 解析, 合并进度数据 */
    async function handleProgressDataFiles(files: string[]) {
        const tmp: ProgressData[] = [];
        for (const path of files) {
            const data = <ProgressData[]>JSON.parse(await readFile(path));
            tmp.push(...data);
        }

        return progressData.mergeDuplicate(progressData.parsePDArr(tmp)).getAll();
    }




    const files = <string[]>argv.files;

    const pDArr = global.progressData = await handleProgressDataFiles(files);
    logger.info(`开始导入 ${pDArr.length} 条条目观看进度 (重复的条目已合并)`);

    await importPDArr(pDArr, <BangumImporter>argv.BI, !!argv.f);
}

async function reimportHandler(argv: yargs.Arguments) {
    logger.debug(argv);

    const dump: DumpData = JSON.parse(await readFile(<string>argv.file));
    const { progressData, index } = dump;
    global.progressData = progressData;
    global.currImportProgress = index;

    const pDArr = progressData.splice(index);
    logger.info(`开始导入剩余的 ${pDArr.length} 条条目观看进度`);

    await importPDArr(pDArr, <BangumImporter>argv.BI, !!argv.f);
}

async function importPDArr(pDArr: ProgressData[], BI: BangumImporter, force = false) {
    async function importPD(pD: ProgressData) {
        while (global.locked) {
            await sleep(500);
        }

        await BI.import(pD);
    }

    for (const index in pDArr) {
        global.currImportProgress = +index;

        const pD = pDArr[index];
        const { id } = pD;

        try {
            await importPD(pD);
            logger.info(`导入观看进度(条目 id:${id}) 成功  进度: ${ +index + 1}/${pDArr.length}`);
        } catch (e) {
            logger.debug(e);

            for (let i = 0; i < 3; i++) {
                logger.warn(`导入观看进度(条目 id:${id})失败，正在重试...(${i + 1}/3)`);
                await importPD(pD).catch((e) => logger.debug(e));
            }

            if (force) {
                logger.warn(`导入观看进度(条目 id:${id})失败，已忽略`);
            } else {
                logger.error(e);
                throw new Error(`导入观看进度(条目 id:${id})失败, 已中断导入`);
            }
        }
    }
}

async function dump() {
    const data: DumpData = {
        index: global.currImportProgress,
        progressData: global.progressData,
    };

    global.locked = true;
    logger.info('开始转储数据');

    const fileName = `./${(Date.now() / 1000).toFixed(0)}.bgmi.json`;
    await writeFile(fileName, JSON.stringify(data))
        .then(() => logger.info(`转储数据成功: ${fileName}`))
        .catch((e) => {
            logger.error(e);
            logger.error('Bangumi-importer: 转储数据失败');

            process.exit(1);
        });
}

process.on('SIGINT', async () => {
    //<del>如果在此期间控制台打印了一些与导入有关的信息，那不是 bug，那是特性</del>
    if (global.progressData.length > 0) { 
        logger.info('开始转储数据');
        await dump();
    }

    process.exit(0);
});

process.on('unhandledRejection', (reason) => { throw reason; });

process.on('uncaughtException', async (e) => {
    logger.error('未捕获的异常: ' + e);
    await dump();

    process.exit(1);
});




async function getMeInfo(token: string) {
    const user = new BangumiUser('', token);
    return user.getMeInfo();
}

async function readFile(path: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}

async function writeFile(path: string, data: string) {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, data, 'utf8', (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}




interface DumpData {
    index: number
    progressData: ProgressData[];
}

//这文件迟早被重写