import Builder from '../../base/builder';
import Permissions  from '../user/permissions';

import FullRecord from './fullrecord';
import MinimalRecordPD from './minimalrecordpd'
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
	 * see https://pointercrate.com/documentation/records/#get-records
	 */
	async list() {
		return this.client._get_req_list(MinimalRecordPD, `v1/records/`);
	}

	async submit(parameters: {
		progress: number, player: string, demon: string,
		video?: string, status?: RecordStatus
	}) {
		if ((parameters.status) && (parameters.status != RecordStatus.Submitted) &&
			!(this.client.user &&
				this.client.user.implied_permissions.includes(Permissions.ListHelper))) {
			throw "Record adding endpoint requires ListHelper if RecordStatus is not Submitted!";
		}

		return this.client._post_req(MinimalRecordPD, "/v1/records/", parameters);
	}

	/**
	 * internal delete for record
	 * opt to use the ones built into the record if needed
	 * @param id record id
	 * @param etag etag to identify record by
	 */
	async _delete(id: number, etag: string) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(Permissions.ListAdministrator)) {
			this.client._delete_req(`v1/records/${id}`, { etag: etag });
		} else {
			throw "Record deletion endpoint requires ListAdministrator!";
		}
	}

	/**
	 * returns the full form of a record
	 * @param id record id
	 */
	async _get_full(id: number) {
		return this.from_id(id);
	}
}
