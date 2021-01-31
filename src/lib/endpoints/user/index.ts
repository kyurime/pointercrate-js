import Builder from "../../base/builder";

import User from './user';
import UserListingFilters from "./userpagination";

export default class UserBuilder extends Builder {
	/**
	 * gets registered user listing
	 * requires at least moderator or listhelper
	 */
	async list(filters?: UserListingFilters) {
		return this.client._get_req_list(User, "v1/users/", filters);
	}

	/**
	 * gets registered user
	 * requires at least moderator or listhelper
	 * @param id user id of user to get
	 */
	async from_id(id: number) {
		return this.client._get_req(User, `v1/users/${id}`);
	}

	/**
 * internal delete for user
 * opt to use the ones built into user class
 * @param id user id
 * @param etag etag to identify id by
 */
	async _delete(id: number, etag: string) {
		this.client._delete_req(`v1/users/${id}`, { etag: etag });
	}

	async _edit(id: number, etag: string, parameters: {
		display_name: string,
		permissions: number
	}) {
		return this.client._post_req(User, `v1/users/${id}/`, parameters, { etag });
	}
}
