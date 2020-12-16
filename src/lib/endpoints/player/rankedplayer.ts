import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';
import Nationality from '../nationality';

export interface IRankedPlayer extends IBaseData {
	name: string;
	rank: number;
	score: number;
	nationality?: Nationality;
}

export default class RankedPlayer extends BaseRequest implements IRankedPlayer {
	name: string;
	rank: number;
	score: number;
	nationality?: Nationality;

	constructor(
		{
			id,
			name,
			rank,
			score,
			nationality
		}: IRankedPlayer, data: IBaseRequest) {
		super({ id }, data);

		this.name = name;
		this.rank = rank;
		this.score = score;

		if (nationality) {
			this.nationality = nationality;
		}
	}
}