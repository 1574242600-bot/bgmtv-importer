import BangumiProgress from '../progress';
import { BangumiApiRequest } from '../../request';

jest.mock('../../request');

describe('BangumiSubject 类', () => {
    const BGMProgress = new BangumiProgress('test');
    const P = (<jest.Mock<BangumiApiRequest>>BangumiApiRequest).mock.instances[0];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockGet = <jest.Mock>P.get;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockPost = <jest.Mock>P.post;

    it('updateSubjectWatchedProgress(): 未给出所需参数时抛出错误', () => {
        expect(BGMProgress.updateSubjectWatchedProgress(1, {}))
            .rejects
            .toThrow('At least one parameter is required');
    });

    it('updateSubjectWatchedProgress(): 替换请求路径和使用 URLSearchParams 构造 post body', async () => {
        mockPost.mockResolvedValue({});

        await BGMProgress.updateSubjectWatchedProgress(1, { eps: 1, vols: 1});

        const param = mockPost.mock.calls[0];
        expect(param[0]).toBe('/subject/1/update/watched_eps');
        expect(param[1].body.toString()).toBe('watched_eps=1&watched_vols=1');
    });

    it('updateEpStatus(): 替换请求路径', async () => {
        mockGet.mockResolvedValue({});

        await BGMProgress.updateEpStatus(1, 'watched');

        expect(mockGet.mock.calls[0][0]).toBe('/ep/1/status/watched');
    });

    it('updateEpsStatus(): 未给出所需参数时抛出错误', () => {
        const received = BGMProgress.updateEpsStatus(new Set(), 'watched');

        expect(received)
            .rejects
            .toThrow('At least one integer is required in the set');
    });

    it('updateEpsStatus(): 替换请求路径和拼接 post body', async () => {
        mockPost.mockResolvedValue({});

        await BGMProgress.updateEpsStatus(new Set([1, 2]), 'watched');

        const param = mockPost.mock.calls[0]; 
        expect(param[0]).toBe('/ep/2/status/watched');
        expect(param[1].body).toBe('ep_id=1,2');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});