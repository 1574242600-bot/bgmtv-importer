import BangumiEpisode from '../episode';
import { BangumiApiRequest } from '../../request';

jest.mock('../../request');

describe('BangumiEpisode 类', () => {
    const BGMSubject = new BangumiEpisode();
    const P = (<jest.Mock<BangumiApiRequest>>BangumiApiRequest).mock.instances[0];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockGet = <jest.Mock>P.get;

    it('getEpisodes(): 拼接参数', async () => {
        mockGet.mockResolvedValue({});
        await BGMSubject.getEpisodes(1);

        expect(mockGet.mock.calls[0][0]).toBe('/v0/episodes?subject_id=1');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});
