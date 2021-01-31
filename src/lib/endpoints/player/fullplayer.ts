import { IBaseRequest } from '../../base/request';
import MinimalDemon, { IMinimalDemon } from '../demon/minimaldemon';

import Player, { IPlayer } from './player';

export interface IFullPlayer extends IPlayer {
	created: IMinimalDemon[];
	verified: IMinimalDemon[];
	published: IMinimalDemon[];
}

export default class FullPlayer extends Player implements IFullPlayer {
	created: MinimalDemon[];
	verified: MinimalDemon[];
	published: MinimalDemon[];

	constructor(
			{
				id,
				name,
				banned,
				nationality,
				created,
				verified,
				published
			}: IFullPlayer,
			data: IBaseRequest) {
		super({ id, name, banned, nationality }, data);

		this.created = created.map((demon) => new MinimalDemon(demon, { client: this.client }));
		this.verified = verified.map((demon) => new MinimalDemon(demon, { client: this.client }));
		this.published = published.map((demon) => new MinimalDemon(demon, { client: this.client }));
	}

	async edit(parameters: {
		name?: string, banned?: boolean, nationality?: string,
	}) {
		if (!this.etag) {
			throw new Error("etag not found for player");
		}

		return this.client.players._edit(this.id, this.etag, parameters);
	}
}