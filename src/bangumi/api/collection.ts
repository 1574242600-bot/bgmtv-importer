import { ApiPaths } from '@bangumi/define';
import { BangumiApiRequest } from '@bangumi/request';
import { BGMCollection } from 'bgm-types';
import { components as Components } from 'bgm-types/types';
import { replace } from '@utils/index';

class BangumiCollecton extends BangumiApiRequest {
    constructor(accessToken?: string) {
        super(undefined, accessToken);
    }

    public getCollectionInfo(subjectId: number): Promise<BGMCollection.Information> {
        const path = replace(ApiPaths.COllECTION_INFO, {
            '$subject_id': subjectId + ''
        });

        return <Promise<BGMCollection.Information>>this.get(path, { needAccess: true });
    }

    public async updateCollectionStatus(subjectId: number, statusType: CollectionStatusType) {
        const path = replace(ApiPaths.COllECTION_ACTION, {
            '$subject_id': subjectId + '',
            '$action': 'update'
        });

        const result = await <Promise<BGMCollection.Update>>this.post(path, {
            body: `status=${statusType}`,
            needAccess: true
        });

        if (result.status.type !== statusType) {
            const info = '更新条目收藏状态失败: \n'
                + `条目id: ${subjectId} \n`
                + `参数: ${statusType} \n`
                + `响应: ${JSON.stringify(result.status)}`;

            throw new Error(info);
        }
    }
}

export default BangumiCollecton;

export type CollectionStatusType = Components['schemas']['CollectionStatusType'];
export const enum CollectionStatusTypeEnum {
    WISH = 'wish',
    COLLECT = 'collect',
    DO = 'do',
    DROPPED = 'dropped',
    ON_HOLD = 'on_hold'
}