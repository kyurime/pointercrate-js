import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import { DatabasePlayer } from './player';
import { MinimalRecordP } from './record';
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
}
export class Demon extends MinimalDemon implements IDemon {
	requirement: number;
	video?: string;

	constructor(
		{ id, position, name, requirement, video }: IDemon,	data: IBaseRequest
	) {
		super({ id, position, name }, data);
		this.requirement = requirement;

		if (video) {
			this.video = video;
		}
	}
}

export interface IFullDemon extends IDemon {
	creators: DatabasePlayer[];
	records: MinimalRecordP[];
}
export class FullDemon extends Demon implements IFullDemon {
	creators: DatabasePlayer[];
	records: MinimalRecordP[];

	constructor(
		{ id, position, name, requirement, video, creators, records }: IFullDemon,
			data: IBaseRequest
	) {
		super({ id, position, name, requirement, video }, data);
		this.creators = creators;
		this.records = records;
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
		return this.client._get_req_list(FullDemon, `v2/demons/`);
	}

	/**
	 * returns a list of all demons, sorted by position
	 */
	async by_position() {
		return this.client._get_req_list(FullDemon, `v1/demons/`);
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