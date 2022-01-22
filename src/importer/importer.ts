import BangumiCollecton, { CollectionStatusTypeEnum } from '@bangumi/api/collection';
import BangumiProgress, { EpStatusTypeEnum } from '@bangumi/api/progress';
import BangumiEpisode from '@bangumi/api/episode';
import { ProgressData } from './progressData';

class BangumImporter {
    private readonly Collection: BangumiCollecton
    private readonly Progress: BangumiProgress
    private readonly Episode: BangumiEpisode;

    constructor(accessToken: string) {
        this.Collection = new BangumiCollecton(accessToken);
        this.Progress = new BangumiProgress(accessToken);
        this.Episode = new BangumiEpisode();
    }

    public async import({ id, status = 'wish', watchedEps = [], watchedVols = 0 }: ProgressData) {
        const collection = await this.getCollectionInfo(id);
        const episodes = await this.Episode.getEpisodes(id);

        // 未收藏该条目
        if (collection === null) {
            await this.Collection.updateCollectionStatus(id, status);
            return this.import({ id, watchedEps, watchedVols });
        }
        

        const updateEpsFlag = watchedEps.length > 0 
            && !this.isEpsCompleted(watchedEps, collection.ep_status) ;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /// @ts-ignore https://github.com/bangumi/api/issues/100
        const updateVolsFlag = collection.vol_status < watchedVols;

        if (updateEpsFlag) {
            const epIdSet = this.toEpIdSet(watchedEps, episodes);

            // 如果条目状态不为 "do"，则无法用 updateEpsStatus() 更新观看进度
            // updateSubjectWatchedProgress() 更新 eps 有很多“特性”，小组里有人说过，但我找不到了
            if (collection.status.type !== CollectionStatusTypeEnum.DO) {
                await this.Collection.updateCollectionStatus(id, CollectionStatusTypeEnum.DO);
            } 

            await this.Progress.updateEpsStatus(epIdSet, EpStatusTypeEnum.WATCHED);

            if (collection.status.type !== CollectionStatusTypeEnum.DO) {
                await this.Collection.updateCollectionStatus(id, status);
            }
        }

        if (updateVolsFlag) {
            await this.Progress.updateSubjectWatchedProgress(id, { vols: watchedVols });
        }
    }

    private isEpsCompleted(watchedEps: ProgressData['watchedEps'], total = 0) {
        if (watchedEps.length === 0 || total === 0) return false;

        for (let i = 1; i <= total; i++) {
            if (!watchedEps.includes(i)) {
                return false;
            }
        }

        return true;
    }

    private toEpIdSet(
        watchedEps: ProgressData['watchedEps'],
        episodes: Awaited<ReturnType<BangumiEpisode['getEpisodes']>>
    ) {
        return watchedEps
            .reduce((prev, curr) => {
                const id = episodes.data[curr - 1].id;   //** 

                prev.add(id);
                return prev;
            }, new Set<number>());
    }


    private getCollectionInfo(id: number) {
        return this.Collection.getCollectionInfo(id)
            .catch((e) => {
                return e.message.includes('Nothing found with that ID')
                    ? null
                    : Promise.reject(e);
            });
    }

}

export default BangumImporter;