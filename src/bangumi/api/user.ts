import { ApiPaths } from '../define';
import { BangumiApiRequest } from '../request';
import { BGMUser } from 'bgm-types';
import { replace } from '@utils/index';

class BangumiUser extends BangumiApiRequest {
    constructor(appId?: string, accessToken?: string) {
        super(appId, accessToken);
    }
    
    //todo 修正类型
    public getMeInfo(): Promise<BGMUser.Information> {
        const path = ApiPaths.USER_ME;

        return <Promise<BGMUser.Information>><unknown>this.get(path, { needBearer: true });
    }

    public getUserInfo(user: string | number): Promise<BGMUser.Information> {
        const path = replace(ApiPaths.USER_INFO, {
            '$user': user + ''
        });

        return <Promise<BGMUser.Information>>this.get(path);
    }

    public getUserCollectionProgress(user: string | number, subjectId: number): Promise<BGMUser.CollectionProgress> {
        const path = replace(ApiPaths.USER_PROGRESS, {
            '$user': user + ''
        }) + `?subject_id=${ subjectId }`;

        return <Promise<BGMUser.CollectionProgress>><unknown>this.get(path, { needAccess: true });
    }

    public getUserCollectionsStatus(user: string | number): Promise<BGMUser.CollectionStatus> {
        const path = replace(ApiPaths.USER_COllECTIONS_STATUS, {
            '$user': user + ''
        });

        return <Promise<BGMUser.CollectionStatus>><unknown>this.get(path, { needAppId: true });
    }
}

export default BangumiUser;