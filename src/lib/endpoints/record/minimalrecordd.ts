import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';
import MinimalDemon, { IMinimalDemon } from '../demon/minimaldemon';

import RecordStatus from './recordstatus';

export interface IMinimalRecordD extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: IMinimalDemon;
}

/**
 * Minimal record used in FullDemon responses
 * Does not contain player information
 */
export default class MinimalRecordD extends BaseRequest implements IMinimalRecordD {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;

	constructor({ id, progress, video, status, demon }: IMinimalRecordD,
		data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = new MinimalDemon(demon, { client: this.client });
	}

	/**
	 * gets fully qualified form of record, including etag
	 */
	async full_record() {
		return this.client.records._get_full(this.id);
	}
}