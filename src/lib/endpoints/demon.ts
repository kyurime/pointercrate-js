import Builder from '../base/builder';

import { DatabasePlayer } from './player';
import { MinimalRecordP } from './record';

export class MinimalDemon {
	id: number;
	position: number;
	name: string;

	constructor({ id, position, name }: { id: number, position: number, name: string }) {
		this.id = id;
		this.position = position;
		this.name = name;
	}
}

export class Demon extends MinimalDemon {
	requirement: number;
	video?: string;

	constructor(
		{ id, position, name, requirement, video }:
			{ id: number, position: number, name: string, requirement: number, video?: string }
	) {
		super({ id, position, name });
		this.requirement = requirement;

		if (video) {
			this.video = video;
		}
	}
}

export class FullDemon extends Demon {
	creators: DatabasePlayer[];
	records: MinimalRecordP[];

	constructor(
		{ id, position, name, requirement, video, creators, records }:
			{
				id: number, position: number, name: string, requirement: number,
				video?: string, creators: DatabasePlayer[], records: MinimalRecordP[]
			}
	) {
		super({ id, position, name, requirement, video });
		this.creators = creators;
		this.records = records;
	}
}

export default class DemonBuilder extends Builder {
	async from_id(id: number) {
		return this.get_req<FullDemon>(`v2/demons/${id}`);
	}

	async from_position(position: number) {
		return this.get_req<FullDemon>(`v1/demons/${position}`);
	}

	async by_id() {
			return this.get_req<FullDemon[]>(`v2/demons/`);
	}

	async by_position() {
			return this.get_req<FullDemon[]>(`v1/demons/`);
	}
}