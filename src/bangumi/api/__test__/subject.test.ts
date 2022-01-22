import BangumiSubject from '../subject';
import { BangumiApiRequest } from '../../request';

jest.mock('../../request');

describe('BangumiSubject 类', () => {
    const BGMSubject = new BangumiSubject();
    const P = (<jest.Mock<BangumiApiRequest>>BangumiApiRequest).mock.instances[0];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    ///@ts-ignore
    const mockGet = <jest.Mock>P.get;

    it('getSubjectInfo(): 替换请求路径', async () => {
        mockGet.mockResolvedValue({});
        await BGMSubject.getSubjectInfo(1);

        expect(mockGet.mock.calls[0][0]).toBe('/v0/subjects/1');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});
