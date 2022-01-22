import fetch from 'node-fetch';
import { URL } from 'url';
import BangumiOauth2Client from '../oauth2';
import { FetchMock } from 'jest-fetch-mock';

const fetchMock = <FetchMock><unknown>fetch;

describe('BangumiOauth2Client 类', () => {
    const O2Client = new BangumiOauth2Client({
        clientId: 'test',
        clientSecret: 'test',
        redirectUri: 'https://nmslese.rip'
    });

    it('生成 oauth2授权链接', () => {
        const urlString = O2Client.genAuthUrl();
        const searchParams = (new URL(urlString)).searchParams;

        expect(searchParams.get('client_id')).toBe('test');
        expect(searchParams.get('redirect_uri')).toBe('https://nmslese.rip');
        expect(searchParams.get('response_type')).toBe('code');
    });

    it('获取 access_token', async () => {
        fetchMock.mockResponse(JSON.stringify({ access_token: 'test' }));
        const res = await O2Client.getAccessInfo('test');

        expect(fetchMock.mock.calls[0][1].body).toBe('code=test&client_id=test&client_secret=test&redirect_uri=https%3A%2F%2Fnmslese.rip&grant_type=authorization_code');
        expect(res.access_token).toBe('test');
    });

    it('获取 access_token 失败抛出错误', async () => {
        fetchMock.mockResponse(JSON.stringify({ error: 'testError' }));
        
        const received = O2Client.getAccessInfo('test');

        expect(received)
            .rejects
            .toThrow(/testError/);
    });

    beforeEach(() => {
        fetchMock.resetMocks();
    });
});