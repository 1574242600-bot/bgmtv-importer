import fetch, { RequestInit, Response } from 'node-fetch';
import { USER_AGENT } from './define';

class BangumiRequest {
    protected origin = 'https://bgm.tv';

    constructor(origin?: string) {
        if (typeof origin === 'string') this.origin = origin;
    }

    public async fetch(path: string, init: RequestInit = {}): Promise<Response> {
        const url = this.origin + path;

        init.headers = Object.assign({}, init.headers, { 
            'User-Agent': USER_AGENT
        });

        const res = await fetch(url, init);

        if (!res.ok) {
            const info = 'BangumiRequest: 请求发生错误: \n'
            + `url: ${ url } \n`
            + `状态: ${ res.status } \n`
            + `fetch 参数: ${ JSON.stringify(init) }`;

            throw new Error(info);
        }

        return res;
    }
}

class BangumiApiRequest extends BangumiRequest {
    private accessToken: string
    private appId: string

    constructor(appId?: string, accessToken?: string, origin = 'https://api.bgm.tv') {
        super(origin);
        if (typeof appId === 'string') this.appId = appId;
        if (typeof accessToken === 'string') this.accessToken = accessToken;
    }

    protected get(path: string, init: BangumiApiRequestFetchInit = {}): Promise<Record<string, unknown>> {
        init = Object.assign({}, init, { method: 'GET' });
        return this.fetchApi(path, init);
    }

    protected post(path: string, init: BangumiApiRequestFetchInit = {}): Promise<Record<string, unknown>> {
        init = Object.assign({}, init, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        });
        
        return this.fetchApi(path, init);
    }

    private async fetchApi(path: string, init: BangumiApiRequestFetchInit = {}): Promise<Record<string, unknown>> {
        if (init.needAccess) {
            if (this.accessToken === undefined) {
                throw new ReferenceError('accessToken undefined');
            }
            path = addQueryParam(path, 'access_token', this.accessToken);
        }

        if (init.needBearer) {
            if (this.accessToken === undefined) {
                throw new ReferenceError('accessToken undefined');
            }

            init.headers = Object.assign({}, init.headers, { 
                'Authorization':  `Bearer ${ this.accessToken }`
            });
        }

        if (init.needAppId) {
            if (this.appId === undefined) {
                throw new ReferenceError('appId undefined');
            }
            path = addQueryParam(path, 'app_id', this.appId);
        }

        const res = await this.fetch(path, init);
        const result = <Record<string, unknown>>await res.json() ;
        
        //todo: 适配新api 
        if (Number.isInteger(result.code) && result.code !== 200) {
            //path = path.replace(/access_token=([0-9a-z]{40})/, 'access_token=****');
            const info = 'BangumiApiRequest: api 请求失败: \n'
            + `路径: ${ path } \n`
            + `fetch 参数: ${ JSON.stringify(init) } \n`
            + `响应: ${ JSON.stringify(result) }`;
            throw new Error(info);
        }

        return result;
    }

}

function addQueryParam(source: string, key: string, value = '') {
    const withParams = (/\?([^/])*$/g).test(source);
    return source + `${ withParams ? '&' : '?'}` + key + `=${ value }`;
}

export interface BangumiApiRequestFetchInit extends RequestInit {
    needAccess?: boolean;
    needAppId?: boolean;
    needBearer?: boolean;
}

export { BangumiRequest, BangumiApiRequest };


