import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';
import MinimalDemon, { IMinimalDemon } from '../demon/minimaldemon';
import DatabasePlayer, { IDatabasePlayer } from '../player/databaseplayer';

import RecordStatus from './recordstatus';

export interface IMinimalRecordPD extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: IMinimalDemon;
	player: IDatabasePlayer;
}

/**
 * Minimal record
 * contains player and demon information
 */
export default class MinimalRecordPD extends BaseRequest implements IMinimalRecordPD {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;

	constructor(
		{ id, progress, video, status, demon, player }: IMinimalRecordPD,
		data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = new MinimalDemon(demon, { client: this.client });
		this.player = new DatabasePlayer(player, { client: this.client });
	}

	/**
	 * gets fully qualified form of record, including etag
	 */
	async full_record() {
		return this.client.records._get_full(this.id);
	}
}
