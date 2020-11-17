import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import { MinimalDemon } from './demon';
import Nationality from './nationality';
import { PermissionTypes } from './user';

interface IDatabasePlayer extends IBaseData {
	name: string;
	banned: boolean;
}
export class DatabasePlayer extends BaseRequest implements IDatabasePlayer {
	name: string;
	banned: boolean;

	constructor({ id, name, banned }: IDatabasePlayer, data: IBaseRequest) {
		super({ id }, data);
		this.name = name;
		this.banned = banned;
	}
}

interface IPlayer extends IDatabasePlayer {
	nationality?: Nationality;
}
export class Player extends DatabasePlayer implements IPlayer {
	nationality?: Nationality;

	constructor({ id, name, banned, nationality }: IPlayer, data: IBaseRequest) {
		super({ id, name, banned }, data);
		this.nationality = nationality;
	}
}

interface IFullPlayer extends IPlayer {
	created: MinimalDemon[];
	verified: MinimalDemon[];
	published: MinimalDemon[];
}
export class FullPlayer extends Player implements IFullPlayer {
	created: MinimalDemon[];
	verified: MinimalDemon[];
	published: MinimalDemon[];

	constructor({ id, name, banned, nationality, created, verified, published }:
		IFullPlayer, data: IBaseRequest) {
		super({ id, name, banned, nationality }, data);

		this.created = created;
		this.verified = verified;
		this.published = published;
	}
}

interface IRankedPlayer extends IBaseData {
	name: string;
	rank: number;
	score: number;
	nationality?: Nationality;
}
export class RankedPlayer extends BaseRequest implements IRankedPlayer {
	name: string;
	rank: number;
	score: number;
	nationality?: Nationality;

	constructor({ id, name, rank, score, nationality }: IRankedPlayer,
		data: IBaseRequest) {
		super({ id }, data);

		this.name = name;
		this.rank = rank;
		this.score = score;

		if (nationality) {
			this.nationality = nationality;
		}
	}
}

export default class PlayerBuilder extends Builder {
	/**
	 * gets listed form of player
	 * @param id id of player
	 */
	async from_id(id: number) {
		return this.client._get_req(Player, `v1/players/${id}`)
	}

	/**
	* this endpoint requires extended access permissions
	*/
	async list() {
		if (this.client.user &&
			PermissionTypes.ExtendedAccess in this.client.user.implied_permissions) {
			return this.client._get_req_list(Player, `v1/players/`);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}

	/**
	 * this endpoint doesn't require extended access permissions
	 * returns a different form of player
	 */
	async by_ranking() {
		return this.client._get_req_list(RankedPlayer, `v1/players/ranking/`)
	}
}