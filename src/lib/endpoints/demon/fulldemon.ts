import { IBaseRequest } from '../../base/request';
import { DatabasePlayer, IDatabasePlayer } from '../player';
import { IMinimalRecordP, MinimalRecordP } from '../record';

import Demon, { IDemon } from './demon';

export interface IFullDemon extends IDemon {
	creators: IDatabasePlayer[];
	records: IMinimalRecordP[];
}

export default class FullDemon extends Demon implements IFullDemon {
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
