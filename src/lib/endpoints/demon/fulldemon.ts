import { IBaseRequest } from '../../base/request';
import DatabasePlayer, { IDatabasePlayer } from '../player/databaseplayer';
import MinimalRecordP, { IMinimalRecordP } from '../record/minimalrecordp';

import Demon, { IDemon } from './demon';

export interface IFullDemon extends IDemon {
	creators: IDatabasePlayer[];
	records: IMinimalRecordP[];
}

export default class FullDemon extends Demon implements IFullDemon {
	creators: DatabasePlayer[];
	records: MinimalRecordP[];

	constructor(
		{ id, position, name, requirement, video, publisher, verifier, level_id, creators, records }: IFullDemon,
		data: IBaseRequest
	) {
		super({ id, position, name, requirement, video, publisher, level_id, verifier }, data);

		this.creators = [];
		for (const creator of creators) {
			this.creators.push(new DatabasePlayer(creator, { client: this.client }));
		}

		this.records = [];
		for (const record of records) {
			this.records.push(new MinimalRecordP(record, { client: this.client }));
		}
	}

	async edit(parameters: {
		name?: string, position?: number, video?: string, requirement?: number,
		verifier?: string, publisher?: string
		}) {
		if (!this.etag) {
			throw new Error("etag is not defined for demon");
		}

		const edited_demon = await this.client.demons._edit(this.id, this.etag, parameters);

		this.name = edited_demon.name;
		this.position = edited_demon.position;
		this.video = edited_demon.video;
		this.requirement = edited_demon.requirement;
		this.verifier = edited_demon.verifier;
		this.publisher = edited_demon.publisher;
	}

	async add_creator(name: string) {
		await this.client.demons._add_creator(this.id, name);
		const this_demon = await this.client.demons.from_id(this.id);

		this.creators = this_demon.creators;
	}

	async delete_creator(creator: DatabasePlayer) {
		await this.client.demons._delete_creator(this.id, creator.id);
		const this_demon = await this.client.demons.from_id(this.id);

		this.creators = this_demon.creators;
	}
}
