import Builder from './builder';
import { PermissionTypes } from './user';

export class Submitter {
	id: number;
	banned: boolean;

	constructor({ id, banned }: { id: number, banned: boolean }) {
		this.id = id;
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
			PermissionTypes.ListModerator in this.client.user.implied_permissions) {
			return this.get_req<Submitter>(`v1/submitters/${id}`);
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
			PermissionTypes.ListAdministrator in this.client.user.implied_permissions) {
			return this.get_req<Submitter[]>(`v1/submitters/`);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}
}