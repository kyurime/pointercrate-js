import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';

import { implied_permissions, permissions_list } from './permissions_helpers';

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
		return permissions_list(this.permissions);
	}

	/**
	 * gets permissions with inheritance
	 */
	get implied_permissions() {
		return implied_permissions(this.permissions);
	}

	/**
	 * deletes user
	 * be careful about using this object afterwards
	 */
	async delete() {
		if (!this.etag) {
			throw new Error("etag is not defined for user");
		}

		this.client.users._delete(this.id, this.etag);
	}

	async edit(parameters: {
		display_name: string,
		permissions: number,
	}) {
		if (!this.etag) {
			throw new Error("etag is not defined for user");
		}

		const new_user = await this.client.users._edit(this.id, this.etag, parameters);

		this.display_name = new_user.display_name;
		this.permissions = new_user.permissions;
	}

	/**
	 * returns a user, but with etag if needed
	 */
	async get_full() {
		return this.client.users.from_id(this.id);
	}
}