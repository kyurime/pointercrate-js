import Builder from "../../base/builder";

import Permissions from './permissions';
import User from './user';

export default class UserBuilder extends Builder {
	/**
	 * gets registered user listing
	 * requires at least moderator or listhelper
	 */
	async list() {
		// ugh dual permissions
		if (this.client.user &&
			(this.client.user.implied_permissions.includes(Permissions.Moderator) ||
				this.client.user.implied_permissions.includes(Permissions.ListHelper))) {
			return this.client._get_req_list(User, "v1/users/");
		} else {
			throw "User listing endpoint requires Moderator or ListHelper";
		}
	}

	/**
	 * gets registered user
	 * requires at least moderator or listhelper
	 * @param id user id of user to get
	 */
	async from_id(id: number) {
		if (this.client.user &&
			(this.client.user.implied_permissions.includes(Permissions.Moderator) ||
				this.client.user.implied_permissions.includes(Permissions.ListHelper))) {
			return this.client._get_req(User, `v1/users/${id}`);
		} else {
			throw "User retrieval endpoint requires Moderator or ListHelper";
		}
	}

	/**
 * internal delete for user
 * opt to use the ones built into user class
 * @param id user id
 * @param etag etag to identify id by
 */
	async _delete(id: number, etag: string) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(Permissions.Administrator)) {
			this.client._delete_req(`v1/users/${id}`, { etag: etag });
		} else {
			throw "User deletion endpoint requires Administrator!";
		}
	}
}