import { parsePDArr, ProgressData, mergeDuplicate } from '../progressData';

test('parsePDArr(): 提供无效的参数, 抛出 type 异常', () => {

    const invalidId: ProgressData[] = [
        {
            id: -1,
        }
    ];

    const received = () => parsePDArr(invalidId);
    expect(() => received())
        .toThrow('在位置 0 检查到错误');


    const invalidStatus: ProgressData[] = [
        {
            id: 1,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /// @ts-ignore
            status: 'invalid',
        }
    ];

    const received1 = () => parsePDArr(invalidStatus);
    expect(() => received1())
        .toThrow('在位置 0 检查到错误');


    const invalidWatchedEps: ProgressData[] = [
        {
            id: 1,
            watchedEps: [0]
        }
    ];

    const received2 = () => parsePDArr(invalidWatchedEps);
    expect(() => received2())
        .toThrow('在位置 0 检查到错误');


    const invalidWatchedVols: ProgressData[] = [
        {
            id: 1,
            watchedVols: -1
        }
    ];

    const received3 = () => parsePDArr(invalidWatchedVols);
    expect(() => received3())
        .toThrow('在位置 0 检查到错误');
});

test('合并重复的进度数据', () => {
    const PDArr: ProgressData[] = [
        {
            id: 1,
            status: 'collect',
            watchedEps: [1, 2]
        },
        {
            id: 1,
            status: 'on_hold',
            watchedEps: [],
            watchedVols: 2
        },
        {
            id: 1,
            status: 'do',
            watchedEps: [1],
            watchedVols: 3
        },
        {
            id: 1,
            status: 'dropped',
            watchedEps: [1],
            watchedVols: 3
        },
        {
            id: 2,
            status: 'wish',
            watchedEps: [1, 2, 3],
            watchedVols: 2
        },
        {
            id: 2,
            status: 'do',
            watchedVols: 3
        },
        {
            id: 3,
            watchedVols: 3
        }
    ];

    const received = mergeDuplicate(parsePDArr(PDArr)).getAll();
    expect(received).toMatchSnapshot();
});