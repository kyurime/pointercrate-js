import Builder from '../../base/builder';

import Submitter from './submitter';
import SubmitterListingFilters from './submitterpagination';

export default class SubmitterBuilder extends Builder {
	/**
	 * gets submitter
	 * this endpoint requires at least list moderator permissions
	 * @param id id of submitter
	 */
	async from_id(id: number) {
		return this.client._get_req(Submitter, `v1/submitters/${id}`);
	}

	/**
	 * gets list of submitters
	 * this endpoint requires list administrator permissions
	 * @params filters Filters and pagination for submitter listing
	 */
	async list(filters?: SubmitterListingFilters) {
		return this.client._get_req_list(Submitter, `v1/submitters/`, filters);
	}
}
