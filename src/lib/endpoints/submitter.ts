import Builder from '../base/builder';
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

import { PermissionTypes } from './user';

export interface ISubmitter extends IBaseData {
	banned: boolean;
}
export class Submitter extends BaseRequest implements ISubmitter {
	banned: boolean;

	constructor({ id, banned }: ISubmitter, data: IBaseRequest) {
		super({ id }, data);
		this.banned = banned;
	}
}

export default class SubmitterBuilder extends Builder {
	/**
	 * gets submitter
	 * this endpoint requires at least list moderator permissions
	 * @param id id of submitter
	 */
	async from_id(id: number) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ListModerator)) {
			return this.client._get_req(Submitter, `v1/submitters/${id}`);
		} else {
			throw "Submitter getting endpoint requires ListModerator!";
		}
	}

	/**
	 * gets list of submitters
	 * this endpoint requires list administrator permissions
	 */
	async list() {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ListAdministrator)) {
			return this.client._get_req(Submitter, `v1/submitters/`);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}
}