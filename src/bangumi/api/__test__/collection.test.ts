import BangumiCollection from '../collection';
import { BangumiApiRequest } from '../../request';

jest.mock('../../request');

describe('BangumiCollection 类', () => {
    const BGMCollection = new BangumiCollection('test');
    const P = (<jest.Mock<BangumiApiRequest>>BangumiApiRequest).mock.instances[0];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockGet = <jest.Mock>P.get;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockPost = <jest.Mock>P.post;

    it('getCollectionInfo(): 替换请求路径', async () => {
        await BGMCollection.getCollectionInfo(1);

        expect(mockGet.mock.calls[0][0]).toMatch('/collection/1');
    });

    it('updateCollectionStatus(): 替换请求路径和拼接 post body', async () => {
        mockPost.mockResolvedValue({ 
            status: {
                type: 'wish'
            } 
        });

        await BGMCollection.updateCollectionStatus(1, 'wish');

        const param = mockPost.mock.calls[0];
        expect(param[0]).toBe('/collection/1/update');
        expect(param[1].body).toBe('status=wish');
    });

    it('updateCollectionStatus(): 更新条目收藏状态失败，抛出异常', async () => {
        mockPost.mockResolvedValue({ 
            status: {
                type: 'wish'
            } 
        });

        const received = BGMCollection.updateCollectionStatus(1, 'do');

        expect(received)
            .rejects
            .toThrow(/参数: do/);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});