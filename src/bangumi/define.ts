import { version, name, homepage } from '../../package.json';

export const USER_AGENT = `1574242600/${ name }/${ version } (${ homepage })`;

export const enum AuthPaths {
   OATH2_AUTHORIZATION = '/oauth/authorize',
   OATH2_TOKEN = '/oauth/access_token'
}

export const enum ApiPaths {
   USER_INFO = '/user/$user',
   USER_COllECTIONS_STATUS = '/user/$user/collections/status',
   USER_PROGRESS = '/user/$user/progress',
   USER_ME = '/v0/me',

   COllECTION_INFO = '/collection/$subject_id',
   COllECTION_ACTION = '/collection/$subject_id/$action',

   SUBJECT_INFO = '/v0/subjects/$subject_id',

   EPISODE = '/v0/episodes',

   PROGRESS_SUBJECT_WATCHED_UPDATE = '/subject/$subject_id/update/watched_eps',
   PROGRESS_EP_STATUS_UPDATE = '/ep/$ep_id/status/$status'
}