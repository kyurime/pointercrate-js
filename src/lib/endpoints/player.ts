import Builder from './builder';
import { MinimalDemon } from './demon';
import Nationality from './nationality';

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

export default class PlayerBuilder extends Builder {
	async from_id() {
		return;
	}
}