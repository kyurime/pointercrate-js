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

	async edit(parameters: { banned?: boolean }) {
		if (!this.etag) {
			throw new Error("etag not defined for submitter");
		}

		const new_submitter = await this.client.submitters._edit(this.id, this.etag, parameters);

		this.banned = new_submitter.banned;
	}
}
