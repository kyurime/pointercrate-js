import Builder from '../../base/builder';
import { PermissionTypes } from '../user';

import Submitter from './submitter';

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