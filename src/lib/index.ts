import axios, { AxiosInstance } from 'axios';

import BaseRequest, { IBaseData, IBaseRequest, PointercrateRequest } from './base/request';
import DemonBuilder from './endpoints/demon';
import Error from './endpoints/error';
import PlayerBuilder from './endpoints/player';
import RecordBuilder from './endpoints/record';
import SubmitterBuilder from './endpoints/submitter';
import UserBuilder, { IUser, User } from './endpoints/user';

interface ClientSettings {
	url?: string;
}
interface UserRequest extends PointercrateRequest<IUser> {
	token: string;
}
export default class PointercrateClient {
	http_instance: AxiosInstance;

	demons = new DemonBuilder(this);
	players = new PlayerBuilder(this);
	users = new UserBuilder(this);
	submitters = new SubmitterBuilder(this);
	records = new RecordBuilder(this);

	user?: User;
	token?: string;

	constructor(settings?: ClientSettings) {
		const url = settings?.url ?? "https://pointercrate.com/api/";

		this.http_instance = axios.create({
			baseURL: url
		});
	}

	/**
	 * logins to a user using basic auth
	 * @param username username of pointercrate user to login to
	 * @param password password of pointercrate user to login to
	 */
	async login(username: string, password: string) {
		try {
			const response = await this.http_instance.post<UserRequest>("/v1/auth/", {}, {
				auth: {
					username,
					password
				}
			});

			this.user = new User(response.data.data, { etag: response.headers["ETag"], client: this });
			this.token = response.data.token;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error;
			}
			throw error;
		}
	}

	async token_login(token: string) {
		try {
			const response = await this.http_instance.post<PointercrateRequest<IUser>>("/v1/auth/", {}, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});

			this.user =	new User(response.data.data, { etag: response.headers["ETag"], client: this });
			this.token = token;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error;
			}
			throw error;
		}
	}

	/**
	 * logins to an account in an unsafe manner
	 * this prevents ratelimiting, but means that no validation checks happen
	 * @param token token of user to authenticate as
	 */
	async token_login_unsafe(token: string) {
		this.token = token;

		// unsafe user gets max permissions
		this.user = new User({ id: -1, name: "unknown", permissions: 0xFFFF }, { etag: "unknown", client: this });
	}

	/**
	 * runs a get request without any type abstraction
	 * @param url url from pointercrate to get
	 */
	async _get_req_with_headers<T>(url: string) {
		const headers: Record<string, string> = {};

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		try {
			const response = await this.http_instance.get<T>(url, {
				headers
			});
			return response;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error;
			}
			throw error;
		}
	}

	/**
	 * runs a get request on a pointercrate url with conversion into class
	 * @param data_class class to convert into
	 * @param url url of pointercrate to access
	 */
	async _get_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string) {
		const response = await this._get_req_with_headers<PointercrateRequest<U>>(url);

		// some endpoints return within data field (singular or not)
		return new data_class(response.data.data, { etag: response.headers["ETag"], client: this });
	}

	/**
	 * runs a get request on a pointercrate url with conversion to list class
	 * @param data_class class to convert into
	 * @param url url of pointercrate to access
	 */
	async _get_req_list<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string): Promise<T[]> {
		const response = await this._get_req_with_headers<U[]>(url);

		const class_list = [];

		for (const data of response.data) {
			class_list.push(new data_class(data, { client: this }));
		}

		return class_list;
	}

	/**
	 * sends a post request to pointercrate servers with auth and etag
	 * @param data_class class that url will return
	 * @param url url to post to
	 * @param data data to send to servers
	 * @param etag used if editing/deleting something - if-match
	 */
	async _post_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string, data: Record<string, unknown>, etag?: string) {
		const headers: Record<string, string> = {};

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		if (etag) {
			headers["If-Match"] = etag;
		}

		try {
			const response = await this.http_instance.post<PointercrateRequest<U>>(
				url,
				data,
				{ headers }
			);

			return new data_class(response.data.data, { etag: response.headers["ETag"], client: this });
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error;
			}
			throw error;
		}
	}
}