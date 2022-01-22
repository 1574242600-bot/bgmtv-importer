import BangumiImporter from '../importer';
import BangumiCollecton from '../../bangumi/api/collection';
import BangumiProgress from '../../bangumi/api/progress';
import BangumiEpisode from '../../bangumi/api/episode';

jest.mock('../../bangumi/api/collection');
jest.mock('../../bangumi/api/progress');
jest.mock('../../bangumi/api/episode');

describe('SyrungeBangumi 类', () => {
    const ImporterBGM = new BangumiImporter('test');

    const C = (<jest.Mock<BangumiCollecton>>BangumiCollecton).mock.instances[0];
    const P = (<jest.Mock<BangumiProgress>>BangumiProgress).mock.instances[0];
    const E = (<jest.Mock<BangumiEpisode>>BangumiEpisode).mock.instances[0];

    const mockGetCollectionInfo = <jest.Mock>C.getCollectionInfo;
    const mockUpdateCollectionStatus = <jest.Mock>C.updateCollectionStatus;
    const mockUpdatewatchedEps = <jest.Mock>P.updateEpsStatus;
    const mockUpdateSubjectWatchedProgress = <jest.Mock>P.updateSubjectWatchedProgress;
    const mockGetEpisodes = <jest.Mock>E.getEpisodes;

    it('inject(): 未收藏时, 收藏条目并更改状态', async () => {
        mockGetCollectionInfo
            .mockRejectedValueOnce(new Error('Nothing found with that ID'))
            .mockResolvedValueOnce({ ep_status: 0, vol_status: 0 });
        
        await ImporterBGM.import({
            id: 1
        }).catch(Function.prototype);

        {
            const params = mockUpdateCollectionStatus.mock.calls[0];
            expect(params[0]).toBe(1);
            expect(params[1]).toBe('wish');
        }


        mockGetCollectionInfo
            .mockRejectedValueOnce(new Error('Nothing found with that ID'))
            .mockResolvedValueOnce({ ep_status: 1, vol_status: 0 });

        await ImporterBGM.import({
            id: 1,
            status: 'do',
            watchedEps: [1],
            watchedVols: 1
        }).catch(Function.prototype);

        {
            const params = mockUpdateCollectionStatus.mock.calls[1];
            expect(params[0]).toBe(1);
            expect(params[1]).toBe('do');
        }
    });


    it('import(): 导入观看进度', async () => {
        mockGetCollectionInfo.mockResolvedValue({
            status: {
                type: 'wish',
            },
            ep_status: 0,
            vol_status: 0
        });

        mockGetEpisodes.mockResolvedValue({
            data: [{ id: 3}, { id: 4}]
        });

        await ImporterBGM.import({
            id: 1,
            status: 'wish',
            watchedEps: [1, 2],
            watchedVols: 1
        });
        
        expect(mockUpdateCollectionStatus.mock.calls[0][1]).toBe('do');
        expect(mockUpdateCollectionStatus.mock.calls[1][1]).toBe('wish');

        expect(Array.from(mockUpdatewatchedEps.mock.calls[0][0]).join('')).toBe('34');
        expect(mockUpdateSubjectWatchedProgress.mock.calls[0][1].vols).toBe(1);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});