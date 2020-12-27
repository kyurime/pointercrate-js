import Builder from '../../base/builder';
import Permissions from '../user/permissions';

import Submitter from './submitter';
import SubmitterListingFilters from './submitterpagination';

export default class SubmitterBuilder extends Builder {
	/**
	 * gets submitter
	 * this endpoint requires at least list moderator permissions
	 * @param id id of submitter
	 */
	async from_id(id: number) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(Permissions.ListModerator)) {
			return this.client._get_req(Submitter, `v1/submitters/${id}`);
		} else {
			throw "Submitter getting endpoint requires ListModerator!";
		}
	}

	/**
	 * gets list of submitters
	 * this endpoint requires list administrator permissions
	 * @params filters Filters and pagination for submitter listing
	 */
	async list(filters?: SubmitterListingFilters) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(Permissions.ListAdministrator)) {
			return this.client._get_req_list(Submitter, `v1/submitters/`, filters);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}
}
