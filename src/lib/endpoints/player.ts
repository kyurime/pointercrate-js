import Builder from '../base/builder';

import { MinimalDemon } from './demon';
import Nationality from './nationality';
import { PermissionTypes } from './user';

export class DatabasePlayer {
	id: number;
	name: string;
	banned: boolean;

	constructor({ id, name, banned }: { id: number, name: string, banned: boolean }) {
		this.id = id;
		this.name = name;
		this.banned = banned;
	}
}

export class Player extends DatabasePlayer {
	nationality?: Nationality;

	constructor({ id, name, banned, nationality }: { id: number, name: string, banned: boolean, nationality?: Nationality }) {
		super({ id, name, banned });
		this.nationality = nationality;
	}
}

export class FullPlayer extends Player {
	created: MinimalDemon[];
	verified: MinimalDemon[];
	published: MinimalDemon[];

	constructor({ id, name, banned, nationality, created, verified, published }:
		{
			id: number, name: string, banned: boolean, nationality?: Nationality,
			created: MinimalDemon[], verified: MinimalDemon[], published: MinimalDemon[]
		}) {
		super({ id, name, banned, nationality });

		this.created = created;
		this.verified = verified;
		this.published = published;
	}
}

export class RankedPlayer {
	id: number;
	name: string;
	rank: number;
	score: number;
	nationality?: Nationality;

	constructor({ id, name, rank, score, nationality }:
		{ id: number, name: string, rank: number, score: number,
			nationality?: Nationality }) {
		this.id = id;
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
		return this._get_req<Player>(`v1/players/${id}`)
	}

	/**
	* this endpoint requires extended access permissions
	*/
	async list() {
		if (this.client.user &&
			PermissionTypes.ExtendedAccess in this.client.user.implied_permissions) {
			return this._get_req<Player[]>(`v1/players/`);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}

	/**
	 * this endpoint doesn't require extended access permissions
	 * returns a different form of player
	 */
	async by_ranking() {
		return this._get_req<RankedPlayer[]>(`v1/players/ranking/`)
	}
}