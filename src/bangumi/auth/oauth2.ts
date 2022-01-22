import { AuthPaths } from '@bangumi/define';
import { BangumiRequest } from '../request';
import { URLSearchParams } from 'url';

class BangumiOauth2Client extends BangumiRequest {
    private clientConfig: BangumiOauth2ClientInit;

    constructor(clientConfig: BangumiOauth2ClientInit) {
        super();
        this.clientConfig = clientConfig;
    }

    public genAuthUrl(responseType = 'code') {
        const searchParams = new URLSearchParams({
            client_id: this.clientConfig.clientId,
            redirect_uri: this.clientConfig.redirectUri,
            response_type: responseType
        });

        return this.origin + AuthPaths.OATH2_AUTHORIZATION + `?${searchParams.toString()}`;
    }

    public async getAccessInfo(code: string, grantType = 'authorization_code'): Promise<BangumiOauth2AccessInfo> {
        const bodyParams = new URLSearchParams({
            code,
            client_id: this.clientConfig.clientId,
            client_secret: this.clientConfig.clientSecret,
            redirect_uri: this.clientConfig.redirectUri,
            grant_type: grantType
        });

        const res = await this.fetch(AuthPaths.OATH2_TOKEN,
            {
                method: 'POST',
                body: bodyParams.toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const result = await res.json();

        if ((<BangumiOauth2ErrorInfo>result).error) {
            const info = '请求 Access 失败: \n'
                + `参数: ${ bodyParams.toString() } \n`
                + `响应: ${ JSON.stringify(result) }`;

            throw new Error(info);
        }

        return <BangumiOauth2AccessInfo>result;
    }
}

export default BangumiOauth2Client;

export interface BangumiOauth2ClientInit {
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    //state?: string,
}

export interface BangumiOauth2AccessInfo {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: null,
    refresh_token: string
    user_id: number,
}

export interface BangumiOauth2ErrorInfo {
    error: string,
    error_description: string
}