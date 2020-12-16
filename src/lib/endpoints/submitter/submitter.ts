import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';

export interface ISubmitter extends IBaseData {
	banned: boolean;
}

export default class Submitter extends BaseRequest implements ISubmitter {
	banned: boolean;

	constructor({ id, banned }: ISubmitter, data: IBaseRequest) {
		super({ id }, data);
		this.banned = banned;
	}
}
