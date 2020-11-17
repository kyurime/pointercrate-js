import Builder from "../base/builder";
import BaseRequest, { IBaseData, IBaseRequest } from '../base/request';

export enum PermissionTypes {
	ExtendedAccess = 1 << 0,
	ListHelper = 1 << 1,
	ListModerator = 1 << 2,
	ListAdministrator = 1 << 3,
	LeaderboardModerator = 1 << 4,
	LeaderboardAdministrator = 1 << 5,
	Moderator = 1 << 13,
	Administrator = 1 << 14,
	Impossible = 1 << 15,
}

interface IUser extends IBaseData {
	name: string;
	permissions: number;
	display_name?: string;
	youtube_channel?: string;
}
export class User extends BaseRequest implements IUser {
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
		const permissions_list: PermissionTypes[] = [];

		for (const permission in PermissionTypes) {
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
		const permissions_list: PermissionTypes[] = [];

		for (const permission in PermissionTypes) {
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
		if (PermissionTypes.Administrator in permissions_list) {
			permissions_list.push(PermissionTypes.Administrator);
		}

		if (PermissionTypes.ListAdministrator in permissions_list) {
			permissions_list.push(PermissionTypes.ListModerator);
		}

		if (PermissionTypes.ListModerator in permissions_list) {
			permissions_list.push(PermissionTypes.ListHelper);
		}

		if (PermissionTypes.ListHelper in permissions_list) {
			permissions_list.push(PermissionTypes.ExtendedAccess);
		}

		if (PermissionTypes.LeaderboardAdministrator in permissions_list) {
			permissions_list.push(PermissionTypes.LeaderboardModerator);
		}

		return permissions_list;
	}
}

export default class UserBuilder extends Builder {
	/**
	 * gets registered user listing
	 * requires at least moderator or listhelper
	 */
	async list() {
		// ugh dual permissions
		if (this.client.user &&
			(PermissionTypes.Moderator in this.client.user.implied_permissions ||
				PermissionTypes.ListHelper in this.client.user.implied_permissions)) {
			return this._get_req_list(User, "v1/users/");
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
			(PermissionTypes.Moderator in this.client.user.implied_permissions ||
				PermissionTypes.ListHelper in this.client.user.implied_permissions)) {
			return this._get_req(User, `v1/users/${id}`);
		} else {
			throw "User retrieval endpoint requires Moderator or ListHelper";
		}
	}
}