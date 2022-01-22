/* eslint-disable @typescript-eslint/ban-ts-comment */
import fetch from 'node-fetch';
import { BangumiRequest, BangumiApiRequest } from '../request';
import { FetchMock } from 'jest-fetch-mock';

const fetchMock = <FetchMock><unknown>fetch;

describe('BangumiRequest 类', () => {
    const BGMRequest = new BangumiRequest();

    it('.fetch(): 拼接正确的 url', async () => {
        fetchMock.mockResponse(() => Promise.resolve({ ok: true, status: 200 }));
        await BGMRequest.fetch('/test');

        const params = fetchMock.mock.calls.pop();
        expect(params[0]).toBe('https://bgm.tv/test');
    });

    it('.fetch(): 非 2xx 时抛出异常', () => {
        fetchMock.mockResponse(() => Promise.resolve({ ok: false, status: 500 }));

        const received = BGMRequest.fetch('/test');
        
        expect(received)
            .rejects
            .toThrow(/状态: 500/);
    });

    beforeEach(() => {
        fetchMock.resetMocks();
    });
});


describe('BangumiApiRequest', () => {
    const BGMRequest = new BangumiApiRequest('test', 'token');

    it('请求 api 失败时抛出异常', () => {
        fetchMock.mockResponse(JSON.stringify({ code: 500 }));
        
        ///@ts-ignore
        expect(BGMRequest.get('/test'))
            .rejects
            .toThrow(/test/);
    });

    it('需要 access_token 或 app_id 时, 缺少参数抛出异常', () => {
        const BGMRequest = new BangumiApiRequest();

        ///@ts-ignore
        expect(BGMRequest.get('/test', { needAccess: true }))
            .rejects
            .toThrow(/accessToken undefined/);

        ///@ts-ignore
        expect(BGMRequest.get('/test', { needBearer: true }))
            .rejects
            .toThrow(/accessToken undefined/);
        
        ///@ts-ignore
        expect(BGMRequest.get('/test', { needAppId: true }))
            .rejects
            .toThrow(/appId undefined/);

    });

    it('请求 需要 access_token 或 app_id 的 api, 参数拼接正确', async () => {
        fetchMock.mockResponse('{}');
        
        ///@ts-ignore
        await BGMRequest.get('/test', { 
            needAccess: true,
            needAppId: true,
            needBearer: true
        });

        expect(fetchMock.mock.calls[0][1].headers['Authorization'])
            .toBe('Bearer token');
        expect(fetchMock.mock.calls[0][0]).toMatch('/test?access_token=token&app_id=test');
    });

    beforeEach(() => {
        fetchMock.resetMocks();
    });
});