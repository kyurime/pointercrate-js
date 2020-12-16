import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import MinimalDemon, { IMinimalDemon } from './demon/minimaldemon';
import Note from './note';
import DatabasePlayer, { IDatabasePlayer } from './player/databaseplayer';
import { ISubmitter, Submitter } from './submitter';
import { PermissionTypes } from './user';

export enum RecordStatus {
	Submitted = "submitted",
	Approved = "approved",
	Rejected = "rejected",
	UnderConsideration = "under consideration"
}

export interface IFullRecord extends IBaseData {
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: IMinimalDemon;
	player: IDatabasePlayer;
	submitter?: ISubmitter;
	notes?: Note[];
}

/**
 * Full form of record
 * @see https://pointercrate.com/documentation/objects/#record
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
	notes?: Note[];

	constructor({ id, progress, video, status, demon, player, notes, submitter }: IFullRecord,
		data: IBaseRequest) {
		super({ id }, data);
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = new MinimalDemon(demon, { client: this.client });
		this.player = new DatabasePlayer(player, { client: this.client });

		if (submitter) {
			this.submitter = new Submitter(submitter, { client: this.client });
		}

		this.notes = notes;
	}

	/**
	 * deletes record
	 * be careful about using this object afterwards
	 */
	async delete() {
		if (!this.etag) {
			throw "etag is not defined for record";
		}

		this.client.records._delete(this.id, this.etag);
	}
}

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
		this.demon = new MinimalDemon(demon, { client: this.client });
	}

	/**
	 * gets fully qualified form of record, including etag
	 */
	async full_record() {
		return this.client.records._get_full(this.id);
	}
}

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
		this.player = new DatabasePlayer(player, { client: this.client });
	}

	/**
	 * gets fully qualified form of record, including etag
	 */
	async full_record() {
		return this.client.records._get_full(this.id);
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
		return this.client._get_req_list(MinimalRecordPD, `v1/records/`);
	}

	async submit(parameters: {
		progress: number, player: string, demon: string,
		video?: string, status?: RecordStatus
	}) {
		if ((parameters.status) && (parameters.status != RecordStatus.Submitted) &&
			!(this.client.user &&
				this.client.user.implied_permissions.includes(PermissionTypes.ListHelper))) {
			throw "Record adding endpoint requires ListHelper if RecordStatus is not Submitted!";
		}

		return this.client._post_req(MinimalRecordPD, "/v1/records/", parameters);
	}

	/**
	 * internal delete for record
	 * opt to use the ones built into the record if needed
	 * @param id record id
	 * @param etag etag to identify record by
	 */
	async _delete(id: number, etag: string) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ListAdministrator)) {
			this.client._delete_req(`v1/records/${id}`, { etag: etag });
		} else {
			throw "Record deletion endpoint requires ListAdministrator!";
		}
	}

	/**
	 * returns the full form of a record
	 * @param id record id
	 */
	async _get_full(id: number) {
		return this.from_id(id);
	}
}