import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';

import Permissions from './permissions';

export interface IUser extends IBaseData {
	name: string;
	permissions: number;
	display_name?: string;
	youtube_channel?: string;
}

export default class User extends BaseRequest implements IUser {
	name: string;
	permissions: number;
	display_name?: string;
	youtube_channel?: string;

	constructor({ id, name, permissions, display_name, youtube_channel }: IUser,
		data: IBaseRequest) {
		super({ id }, data);
		this.name = name;
		this.permissions = permissions;

		if (display_name) {
			this.display_name = display_name;
		}

		if (youtube_channel) {
			this.youtube_channel = youtube_channel;
		}
	}

	get permissions_list() {
		const permissions_list: Permissions[] = [];

		for (const permission in Permissions) {
			// returns both the values we want and the names of each key
			if (isNaN(Number(permission))) {
				continue;
			}

			if ((this.permissions & Number(permission)) == Number(permission)) {
				permissions_list.push(Number(permission));
			}
		}

		return permissions_list;
	}

	get_permissions_list() {
		const permissions_list: Permissions[] = [];

		for (const permission in Permissions) {
			// returns both the values we want and the names of each key
			if (isNaN(Number(permission))) {
				continue;
			}

			if ((this.permissions & Number(permission)) == Number(permission)) {
				permissions_list.push(Number(permission));
			}
		}

		return permissions_list;
	}

	/**
	 * gets permissions with inheritance
	 */
	get implied_permissions() {
		const permissions_list = this.permissions_list;

		// this is how pointercrate does it (shrug)
		if (permissions_list.includes(Permissions.Administrator)) {
			permissions_list.push(Permissions.Administrator);
		}

		if (permissions_list.includes(Permissions.ListAdministrator)) {
			permissions_list.push(Permissions.ListModerator);
		}

		if (permissions_list.includes(Permissions.ListModerator)) {
			permissions_list.push(Permissions.ListHelper);
		}

		if (permissions_list.includes(Permissions.ListHelper)) {
			permissions_list.push(Permissions.ExtendedAccess);
		}

		if (permissions_list.includes(Permissions.LeaderboardAdministrator)) {
			permissions_list.push(Permissions.LeaderboardModerator);
		}

		return permissions_list;
	}

	/**
	 * deletes user
	 * be careful about using this object afterwards
	 */
	async delete() {
		if (!this.etag) {
			throw "etag is not defined for user";
		}

		this.client.users._delete(this.id, this.etag);
	}


	/**
	 * returns a user, but with etag if needed
	 */
	async get_full() {
		return this.client.users.from_id(this.id);
	}
}