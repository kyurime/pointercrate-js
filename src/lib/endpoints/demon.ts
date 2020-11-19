import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import { DatabasePlayer, IDatabasePlayer } from './player';
import { IMinimalRecordP, MinimalRecordP } from './record';
import { PermissionTypes } from './user';

export interface IMinimalDemon extends IBaseData {
	position: number;
	name: string;
}
export class MinimalDemon extends BaseRequest implements IMinimalDemon {
	position: number;
	name: string;

	constructor({ id, position, name }: IMinimalDemon, data: IBaseRequest) {
		super({ id }, data);

		this.position = position;
		this.name = name;
	}
}

export interface IDemon extends IMinimalDemon {
	requirement: number;
	video?: string;
	publisher: IDatabasePlayer;
	verifier: IDatabasePlayer;
}
export class Demon extends MinimalDemon implements IDemon {
	requirement: number;
	video?: string;
	publisher: DatabasePlayer;
	verifier: DatabasePlayer;

	constructor(
		{ id, position, name, requirement, video, publisher, verifier }: IDemon,	data: IBaseRequest
	) {
		super({ id, position, name }, data);
		this.requirement = requirement;

		this.publisher = new DatabasePlayer(publisher, { client: this.client });
		this.verifier = new DatabasePlayer(verifier, { client: this.client });

		if (video) {
			this.video = video;
		}
	}
}

export interface IFullDemon extends IDemon {
	creators: IDatabasePlayer[];
	records: IMinimalRecordP[];
}
export class FullDemon extends Demon implements IFullDemon {
	creators: DatabasePlayer[];
	records: MinimalRecordP[];

	constructor(
		{ id, position, name, requirement, video, publisher, verifier, creators, records }: IFullDemon,
			data: IBaseRequest
	) {
		super({ id, position, name, requirement, video, publisher, verifier }, data);

		this.creators = [];
		for (const creator of creators) {
			this.creators.push(new DatabasePlayer(creator, { client: this.client }));
		}

		this.records = [];
		for (const record of records) {
			this.records.push(new MinimalRecordP(record, { client: this.client }));
		}
	}
}

export default class DemonBuilder extends Builder {
	/**
	 * gets a demon by id (not position)
	 * @param id id of demon to get
	 */
	async from_id(id: number) {
		return this.client._get_req(FullDemon, `v2/demons/${id}`);
	}

	/**
	 * gets a demon by position (not id)
	 * @param position position of demon to get
	 */
	async from_position(position: number) {
		return this.client._get_req(FullDemon, `v1/demons/${position}`);
	}

	/**
	 * returns a list of all demons, sorted by id
	 */
	async by_id() {
		return this.client._get_req_list(Demon, `v2/demons/`);
	}

	/**
	 * returns a list of all demons, sorted by position
	 */
	async by_position() {
		return this.client._get_req_list(Demon, `v1/demons/`);
	}

	/**
	 * adds a demon to the list, returns a demon
	 * @param parameters parameters of demon to add
	 */
	async add(parameters:
		{
			name: string, position: number, requirement: number,
			verifier: string, publisher: string,
			creators: string[], video?: string
		}) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ListModerator)) {
			return this.client._post_req(Demon, "/v1/demons/", parameters);
		} else {
			throw "Demon adding endpoint requires ListModerator!";
		}
	}
}