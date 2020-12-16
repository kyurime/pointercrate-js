import { IBaseRequest } from '../../base/request';
import { DatabasePlayer, IDatabasePlayer } from '../player';

import MinimalDemon, { IMinimalDemon } from './minimaldemon';

export interface IDemon extends IMinimalDemon {
	requirement: number;
	video?: string;
	publisher: IDatabasePlayer;
	verifier: IDatabasePlayer;
}
export default class Demon extends MinimalDemon implements IDemon {
	requirement: number;
	video?: string;
	publisher: DatabasePlayer;
	verifier: DatabasePlayer;

	constructor(
		{ id, position, name, requirement, video, publisher, verifier }: IDemon, data: IBaseRequest
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
