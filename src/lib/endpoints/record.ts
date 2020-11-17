import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import { MinimalDemon } from './demon';
import Note from './note';
import { DatabasePlayer } from './player';
import { Submitter } from './submitter';

enum RecordStatus {
	Submitted = "submitted",
	Approved = "approved",
	Rejected = "rejected",
	UnderConsideration = "under consideration"
}

interface IFullRecord extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;
	submitter?: Submitter;
	notes: Note[];
}

/**
 * Full form of record
 * See https://pointercrate.com/documentation/objects/#record
 */
export class FullRecord extends BaseRequest implements IFullRecord {
	progress: number;
	video?: string;

	/**
	 * record status
	 * access to non approved records requires ExtendedAccess permissions
	 */
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;

	/**
	 * submitter for record
	 * access to submitter requires ListHelper permissions
	 */
	submitter?: Submitter;
	notes: Note[];

	constructor({ id, progress, video, status, demon, player, notes }: IFullRecord,
		data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = demon;
		this.player = player;
		this.notes = notes;
	}
}

interface IMinimalRecordPD extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;
}

/**
 * Minimal record
 * contains player and demon information
 */
export class MinimalRecordPD extends BaseRequest implements IMinimalRecordPD {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;

	constructor({ id, progress, video, status, demon, player }:
		IMinimalRecordPD, data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = demon;
		this.player = player;
	}
}

interface IMinimalRecordD extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
}

/**
 * Minimal record used in FullDemon responses
 * Does not contain player information
 */
export class MinimalRecordD extends BaseRequest implements IMinimalRecordD {
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
		this.demon = demon;
	}
}

interface IMinimalRecordP extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	player: DatabasePlayer;
}
/**
 * Minimal record used in leaderboard player responses
 * Does not contain demon information
 */
export class MinimalRecordP extends BaseRequest implements IMinimalRecordP {
	progress: number;
	video?: string;
	status: RecordStatus;
	player: DatabasePlayer;

	constructor({ id, progress, video, status, player }: IMinimalRecordP, data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.player = player;
	}
}

export default class RecordBuilder extends Builder {
	/**
	 * gets a record by id
	 * extended access is needed for non approved records
	 * list helper is required to view submitter
	 * see https://pointercrate.com/documentation/records/#record-retrieval
	 * @param id record id
	 */
	async from_id(id: number) {
		return this.client._get_req(FullRecord, `v1/records/${id}`);
	}

	/**
	 * gets listing of all records
	 * extended access is needed for non approved records
	 * see https://pointercrate.com/documentation/records/#get-records
	 */
	async list() {
		return this.client._get_req(MinimalRecordPD, `v1/records/`);
	}
}