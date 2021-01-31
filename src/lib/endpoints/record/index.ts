import Builder from '../../base/builder';

import FullRecord from './fullrecord';
import MinimalRecordPD from './minimalrecordpd'
import RecordListingPagination from './recordpagination';
import RecordStatus from './recordstatus';

export default class RecordBuilder extends Builder {
	/**
	 * gets a record by id
	 * extended access is needed for non approved records
	 * list helper is required to view submitter
	 * see https://pointercrate.com/documentation/records/#record-retrieval
	 * @param id record id
	 */
	async from_id(id: number) {
		return this.client._get_req(FullRecord, `v1/records/${id}`);
	}

	/**
	 * gets listing of all records
	 * extended access is needed for non approved records
	 * @see https://pointercrate.com/documentation/records/#get-records
	 * @param filters pagination filters for record listing
	 */
	async list(filters?: RecordListingPagination) {
		return this.client._get_req_list(MinimalRecordPD, `v1/records/`, filters);
	}

	/**
	 * submits a record to the pointercrate servers
	 * @param parameters parameters to submit record with
	 */
	async submit(parameters: {
		progress: number, player: string, demon: string,
		video?: string, status?: RecordStatus
	}) {
		return this.client._post_req(MinimalRecordPD, "/v1/records/", parameters);
	}

	/**
	 * internal delete for record
	 * opt to use the ones built into the record if needed
	 * @param id record id
	 * @param etag etag to identify record by
	 */
	async _delete(id: number, etag: string) {
		return this.client._delete_req(`v1/records/${id}/`, { etag: etag });
	}

	/**
	 * returns the full form of a record
	 * @param id record id
	 */
	async _get_full(id: number) {
		return this.from_id(id);
	}

	async _edit(id: number, etag: string, parameters: {
		progress?: number, video?: string, status?: RecordStatus,
		player?: string, demon?: string,
	}) {
		return this.client._patch_req(FullRecord, `v1/records/${id}/`, parameters, { etag });
	}
}
