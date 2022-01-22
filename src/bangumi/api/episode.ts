import { ApiPaths } from '@bangumi/define';
import { BangumiApiRequest } from '@bangumi/request';
import { BGMEpisode } from 'bgm-types';

class BangumiEpisode extends BangumiApiRequest {

    public getEpisodes(subjectId: number): Promise<BGMEpisode.Episodes> {
        const path = ApiPaths.EPISODE + `?subject_id=${subjectId}`;

        return <Promise<BGMEpisode.Episodes>>this.get(path);
    }

}

export default BangumiEpisode;