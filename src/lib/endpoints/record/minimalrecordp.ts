import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';
import DatabasePlayer, { IDatabasePlayer } from '../player/databaseplayer';

import RecordStatus from './recordstatus';

export interface IMinimalRecordP extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	player: IDatabasePlayer;
}
/**
 * Minimal record used in leaderboard player responses
 * Does not contain demon information
 */
export default class MinimalRecordP extends BaseRequest implements IMinimalRecordP {
	progress: number;
	video?: string;
	status: RecordStatus;
	player: DatabasePlayer;

	constructor({ id, progress, video, status, player }: IMinimalRecordP, data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.player = new DatabasePlayer(player, { client: this.client });
	}

	/**
	 * gets fully qualified form of record, including etag
	 */
	async full_record() {
		return this.client.records._get_full(this.id);
	}
}
