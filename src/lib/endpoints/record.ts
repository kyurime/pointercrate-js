import { MinimalDemon } from './demon';
import Note from './note';
import { DatabasePlayer } from './player';

enum RecordStatus {
	Submitted = "submitted",
	Approved = "approved",
	Rejected = "rejected",
	UnderConsideration = "under consideration"
}

export class FullRecord {
	id: number;
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;
	// TODO: submitter
	notes: Note[];

	constructor({ id, progress, video, status, demon, player, notes }:
		{
			id: number, progress: number, video?: string,
			status: RecordStatus, demon: MinimalDemon,
			player: DatabasePlayer, notes: Note[]
		}) {
		this.id = id;
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = demon;
		this.player = player;
		this.notes = notes;
	}
}

/**
 * Minimal record
 * contains player and demon information
 */
export class MinimalRecordPD {
	id: number;
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;
	player: DatabasePlayer;

	constructor({ id, progress, video, status, demon, player }:
		{
			id: number, progress: number, video?: string,
			status: RecordStatus, demon: MinimalDemon,
			player: DatabasePlayer
		}) {
		this.id = id;
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = demon;
		this.player = player;
	}
}

/**
 * Minimal record used in FullDemon responses
 * Does not contain player information
 */
export class MinimalRecordD {
	id: number;
	progress: number;
	video?: string;
	status: RecordStatus;
	demon: MinimalDemon;

	constructor({ id, progress, video, status, demon }:
		{
			id: number, progress: number, video?: string,
			status: RecordStatus, demon: MinimalDemon
		}) {
		this.id = id;
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.demon = demon;
	}
}

/**
 * Minimal record used in leaderboard player responses
 * Does not contain demon information
 */
export class MinimalRecordP {
	id: number;
	progress: number;
	video?: string;
	status: RecordStatus;
	player: DatabasePlayer;

	constructor({ id, progress, video, status, player }:
		{
			id: number, progress: number, video?: string,
			status: RecordStatus, player: DatabasePlayer
		}) {
		this.id = id;
		this.progress = progress;
		this.video = video;
		this.status = status;
		this.player = player;
	}
}