import { IBaseRequest } from '../../base/request';
import DatabasePlayer, { IDatabasePlayer } from '../player/databaseplayer';

import MinimalDemon, { IMinimalDemon } from './minimaldemon';

export interface IDemon extends IMinimalDemon {
	requirement: number;
	video?: string;
	publisher: IDatabasePlayer;
	verifier: IDatabasePlayer;
	level_id?: number;
}
export default class Demon extends MinimalDemon implements IDemon {
	requirement: number;
	video?: string;
	publisher: DatabasePlayer;
	verifier: DatabasePlayer;
	level_id?: number;

	constructor(
		{ id, position, name, requirement, video, publisher, verifier, level_id }: IDemon,
		data: IBaseRequest
	) {
		super({ id, position, name }, data);
		this.requirement = requirement;

		this.publisher = new DatabasePlayer(publisher, { client: this.client });
		this.verifier = new DatabasePlayer(verifier, { client: this.client });

		if (video) {
			this.video = video;
		}

		if (level_id) {
			this.level_id = level_id;
		}
	}
}
