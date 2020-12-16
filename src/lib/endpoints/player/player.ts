import { IBaseRequest } from '../../base/request';
import Nationality from '../nationality';

import DatabasePlayer, { IDatabasePlayer } from './databaseplayer';

export interface IPlayer extends IDatabasePlayer {
	nationality?: Nationality;
}

export default class Player extends DatabasePlayer implements IPlayer {
	nationality?: Nationality;

	constructor({ id, name, banned, nationality }: IPlayer, data: IBaseRequest) {
		super({ id, name, banned }, data);
		this.nationality = nationality;
	}
}