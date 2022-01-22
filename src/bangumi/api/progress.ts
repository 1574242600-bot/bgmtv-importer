import { ApiPaths } from '@bangumi/define';
import { BangumiApiRequest } from '@bangumi/request';
import { components as Components } from 'bgm-types/types';
import { replace } from '@utils/index';
import { URLSearchParams } from 'url';

class BangumiProgress extends BangumiApiRequest {
    constructor(accessToken: string) {
        super(undefined, accessToken);
    }

    public async updateSubjectWatchedProgress(subjectId: number, {
        eps,
        vols
    }: { eps?: number, vols?: number }) {
        if (eps === undefined && vols === undefined) {
            throw new Error('At least one parameter is required');
        }

        const path = replace(ApiPaths.PROGRESS_SUBJECT_WATCHED_UPDATE, {
            '$subject_id': subjectId + ''
        });

        const body = new URLSearchParams();
        if (Number.isInteger(eps)) body.append('watched_eps', eps + '');
        if (Number.isInteger(vols)) body.append('watched_vols', vols + '');
        
        await this.post(path, {
            body,
            needAccess: true
        });
    }

    public async updateEpStatus(epId: number, statusType: EpStatusType = 'watched') {
        const path = replace(ApiPaths.PROGRESS_EP_STATUS_UPDATE, {
            '$ep_id': epId + '',
            '$status': statusType
        });

        await this.get(path, { needAccess: true });
    }

    //需要注意的是 statusType 传入的值只要不是 drop 或者 watched，就只对在路径里的 ep 有效
    public async updateEpsStatus(epIdSet: Set<number>, statusType: EpStatusType = 'watched') {
        if (epIdSet.size === 0) throw new Error('At least one integer is required in the set');

        const epIdArr = Array.from(epIdSet);
        const lastEpId = epIdArr[ epIdArr.length - 1];

        const path = replace(ApiPaths.PROGRESS_EP_STATUS_UPDATE, {
            '$ep_id': lastEpId + '',
            '$status': statusType
        });

        await this.post(path, {
            body: `ep_id=${epIdArr.join(',')}`,
            needAccess: true
        });
    }
}

export default BangumiProgress;

export type EpStatusType = Components['schemas']['EpStatusType'];
export const enum EpStatusTypeEnum {
    WATCHED = 'watched',
    DROP = 'drop',
    QUEUE = 'queue',
    REMOVE = 'remove',
}