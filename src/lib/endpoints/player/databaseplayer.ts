import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';

export interface IDatabasePlayer extends IBaseData {
	name: string;
	banned: boolean;
}

export default class DatabasePlayer extends BaseRequest implements IDatabasePlayer {
	name: string;
	banned: boolean;

	constructor({ id, name, banned }: IDatabasePlayer, data: IBaseRequest) {
		super({ id }, data);
		this.name = name;
		this.banned = banned;
	}
}
