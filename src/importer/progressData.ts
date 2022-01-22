import { CollectionStatusType, CollectionStatusTypeEnum } from '@bangumi/api/collection';
import { findDuplicate } from '@utils/index';

export class ProgressDataBox {
    private data: ProgressData[];
    constructor(data: ProgressData[]) {
        this.data = data;
    }

    getAll(): ProgressData[] {
        return this.data.slice();
    }
}

/** 
 * 合并重复的进度数据 (进度落后于其他id相同的数据)
 * 
 * */
export function mergeDuplicate(PD: ProgressDataBox) {
    const source = PD.getAll();
    
    const duplicate = findDuplicate(source, (v) => v.id + '');
    if (duplicate === null) return PD;

    const out: ProgressData[] = source
        .filter((v) => duplicate[v.id] === undefined); // 未重复项

    for (const id in duplicate) {
        const indexes = duplicate[id];
        const first = source[indexes.shift()];

        for (const index of indexes) {
            const pD = source[index];

            //优先级 dropped > collect > on_hold > do > wish
            if (pD.status) {
                const toValue = (status) => {
                    const map = {
                        [CollectionStatusTypeEnum.WISH]: 1,
                        [CollectionStatusTypeEnum.DO]: 2,
                        [CollectionStatusTypeEnum.ON_HOLD]: 3,
                        [CollectionStatusTypeEnum.COLLECT]: 4,
                        [CollectionStatusTypeEnum.DROPPED]: 5
                    };

                    return map[status];
                };

                first.status = toValue(pD.status) > toValue(first.status) 
                    ? pD.status 
                    : first.status;
            }

            if (pD.watchedEps) {
                pD.watchedEps.forEach((v) => {
                    if (!first.watchedEps.includes(v)) {
                        first.watchedEps.push(v);
                    }
                });
            }
            
            if (pD.watchedVols) {
                first.watchedVols = pD.watchedVols > first.watchedVols 
                    ? pD.watchedVols 
                    : first.watchedVols;
            }
        }
        
        out.push(first);
    }

    return new ProgressDataBox(out);
}

export function parsePDArr(data: ProgressData[]) {
    
    for (const index in data) {
        const pD = data[index];

        if (!isPD(pD)) {
            const text = `无效的 ProgressJsonData: 在位置 ${index} 检查到错误 \n`
                + `值: ${JSON.stringify(pD)}`;

            throw new TypeError(text);
        }
    }

    return new ProgressDataBox(data);
}

function isPD(pD: ProgressData) {
    function isValidStatus(status: string) {
        return status === CollectionStatusTypeEnum.WISH
            || status === CollectionStatusTypeEnum.COLLECT
            || status === CollectionStatusTypeEnum.DO
            || status === CollectionStatusTypeEnum.ON_HOLD
            || status === CollectionStatusTypeEnum.DROPPED;
    }




    const { id, status, watchedEps, watchedVols } = pD;

    if (!Number.isInteger(id) || id < 0) return false;

    if (typeof status === 'string' && !isValidStatus(status)) return false;

    if (watchedVols
        && (!Number.isInteger(watchedVols) || watchedVols <= 0)
    ) return false;

    if (watchedEps
        && (!(watchedEps instanceof Array)
                || !watchedEps.every((v) => v > 0)
        )
    ) return false;

    return true;
}


export interface ProgressData {
    id: number,
    status?: CollectionStatusType,
    watchedEps?: number[],
    watchedVols?: number
}