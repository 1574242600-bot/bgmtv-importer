import BangumiUser from '../user';
import { BangumiApiRequest } from '../../request';

jest.mock('../../request');

describe('BangumiUser 类', () => {
    const BGMUser = new BangumiUser('test', 'test');
    const P = (<jest.Mock<BangumiApiRequest>>BangumiApiRequest).mock.instances[0];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockGet = <jest.Mock>P.get;

    it('getMeInfo(): 路径', async () => {
        mockGet.mockResolvedValue({});
        await BGMUser.getMeInfo();

        expect(mockGet.mock.calls[0][0]).toBe('/v0/me');
    });


    it('getUserInfo(): 替换请求路径', async () => {
        mockGet.mockResolvedValue({});
        await BGMUser.getUserInfo(1);

        expect(mockGet.mock.calls[0][0]).toBe('/user/1');
    });

    it('getUserCollectionsStatus(): 替换请求路径', async () => {
        mockGet.mockResolvedValue({});
        await BGMUser.getUserCollectionsStatus(1);

        expect(mockGet.mock.calls[0][0]).toBe('/user/1/collections/status');
    });

    it('getgetUserCollectionProgress(): 替换请求路径, 拼接 query', async () => {
        mockGet.mockResolvedValue({});
        await BGMUser.getUserCollectionProgress(1, 2);

        expect(mockGet.mock.calls[0][0]).toBe('/user/1/progress?subject_id=2');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});