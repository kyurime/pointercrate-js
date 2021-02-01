import axios, { AxiosInstance } from 'axios';

import PointercrateError from './base/error';
import PointercratePagination from './base/pagination';
import BaseRequest, { IBaseData, IBaseRequest, PointercrateRequest } from './base/request';
import DemonBuilder from './endpoints/demon';
import PlayerBuilder from './endpoints/player';
import RecordBuilder from './endpoints/record';
import SubmitterBuilder from './endpoints/submitter';
import UserBuilder from './endpoints/user';
import User, { IUser } from './endpoints/user/user';

interface ClientSettings {
	url?: string;
}
interface UserRequest extends PointercrateRequest<IUser> {
	token: string;
}

interface RequestOptions {
	etag?: string;
	// pagination eventually
}

export interface ListMetadata {
	extended_list_size: number;
	list_size: number;
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

	url: string;

	constructor(settings?: ClientSettings) {
		this.url = settings?.url ?? "https://pointercrate.com/api/";

		this.http_instance = axios.create({
			baseURL: this.url
		});
	}

	async get_metadata() {
		const response = await this.http_instance.get<ListMetadata>("/v1/list_information/");
		return response.data;
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

			this.user = new User(response.data.data, { etag: response.headers["etag"], client: this });
			this.token = response.data.token;
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
			}
			throw error;
		}
	}

	async token_login(token: string) {
		try {
			const response = await this.http_instance.get<PointercrateRequest<IUser>>("/v1/auth/me/", {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});

			this.user = new User(response.data.data, { etag: response.headers["etag"], client: this });
			this.token = token;
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
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
	 * logs out of an account
	 */
	async logout() {
		this.token = undefined;
		this.user = undefined;
	}

	async edit_self(parameters: {
		display_name: string,
		youtube_channel: string,
		permissions: number,
	}) {
		if (!this.user) {
			throw new Error("no user logged in to edit!");
		}

		this.user = await this._patch_req(User, "/v1/auth/me/", parameters, { etag: this.user.etag });
	}

	/**
	 * returns a generated list of headers based off provided options
	 * @param options options for the request
	 */
	private _req_headers(options?: RequestOptions) {
		const headers: Record<string, string> = {};

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		if (!options) {
			return headers;
		}

		if (options.etag) {
			headers["If-Match"] = options.etag;
		}

		return headers;
	}

	/**
	 * runs a get request without any type abstraction
	 * @param url url from pointercrate to get
	 */
	async _get_req_with_headers<T>(
		url: string,
		{ options, pagination }:
		{ options?: RequestOptions, pagination?: PointercratePagination }
	) {
		const headers = this._req_headers(options);

		const params = pagination;

		try {
			const response = await this.http_instance.get<T>(url, {
				params,
				headers
			});
			return response;
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
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
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string, options?: RequestOptions) {
		const response = await this._get_req_with_headers<PointercrateRequest<U>>(url, { options });

		// some endpoints return within data field (singular or not)
		return new data_class(response.data.data, { etag: response.headers["etag"], client: this });
	}

	/**
	 * runs a get request on a pointercrate url with conversion to list class
	 * @param data_class class to convert into
	 * @param url url of pointercrate to access
	 */
	async _get_req_list<T extends BaseRequest, U extends IBaseData>(
		data_class: new (data: U, settings: IBaseRequest) => T,
		url: string,
		pagination?: PointercratePagination): Promise<T[]> {
		const response = await this._get_req_with_headers<U[]>(url, { pagination });

		const class_list = [];

		for (const data of response.data) {
			class_list.push(new data_class(data, { client: this }));
		}

		return class_list;
	}

	/**
	 * sends a patch request to pointercrate servers with auth and etag
	 * @param data_class class that url will return
	 * @param url url to post to
	 * @param data data to send to servers
	 * @param etag if-match
	 */
	async _patch_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string, data: Record<string, unknown>, options?: RequestOptions) {
		const headers = this._req_headers(options);

		try {
			const response = await this.http_instance.patch<PointercrateRequest<U>>(
				url,
				data,
				{ headers }
			);

			return new data_class(response.data.data, { etag: response.headers["etag"], client: this });
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
			}
			throw error;
		}
	}

	async _patch_req_no_resp(url: string, data: Record<string, unknown>, options?: RequestOptions) {
		const headers = this._req_headers(options);

		try {
			await this.http_instance.patch(
				url,
				data,
				{ headers }
			);

			return;
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
			}
			throw error;
		}
	}

	/**
	 * sends a post request to pointercrate servers with auth and etag
	 * @param data_class class that url will return
	 * @param url url to post to
	 * @param data data to send to servers
	 * @param etag used if editing/deleting something - if-match
	 */
	async _post_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string, data: Record<string, unknown>, options?: RequestOptions) {
		const headers = this._req_headers(options);

		try {
			const response = await this.http_instance.post<PointercrateRequest<U>>(
				url,
				data,
				{ headers }
			);

			return new data_class(response.data.data, { etag: response.headers["etag"], client: this });
		} catch (error) {
			if (error.response?.data) {
				throw new PointercrateError(error.response.data);
			}
			throw error;
		}
	}

	/**
	 * sends a delete request to a url
	 * @param url url to delete
	 * @param options options for request
	 */
	async _delete_req(url: string, options?: RequestOptions) {
		const headers = this._req_headers(options);

		await this.http_instance.delete(
				url,
				{ headers }
		);

		return;
	}
}