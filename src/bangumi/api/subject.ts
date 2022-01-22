import { ApiPaths } from '@bangumi/define';
import { BangumiApiRequest } from '@bangumi/request';
import { replace } from '@utils/index';
import { BGMSubject } from 'bgm-types';

class BangumiSubject extends BangumiApiRequest {

    public getSubjectInfo(subjectId: number): Promise<BGMSubject.Information> {
        const path = replace(ApiPaths.SUBJECT_INFO, {
            '$subject_id': subjectId + ''
        });

        return <Promise<BGMSubject.Information>>this.get(path);
    }

}

export default BangumiSubject;