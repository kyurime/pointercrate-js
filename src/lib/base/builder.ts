import Error from '../endpoints/error';
import PointercrateClient from '../index';

import BaseRequest, { IBaseData, IBaseRequest, PointercrateRequest } from './request';

export default class Builder {
	constructor(
		public client: PointercrateClient
	) { }

	/**
	 * runs a get request without any type abstraction
	 * @param url url from pointercrate to get
	 */
	private async _get_req_with_headers<T>(url: string) {
		const headers: Record<string, string> = {};

		if (this.client.token) {
			headers["Authorization"] = `Bearer ${this.client.token}`;
		}

		try {
			const response = await this.client.http_instance.get<T>(url, {
				headers
			});
			return response;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error.message;
			}
			throw error;
		}
	}

	/**
	 * runs a get request on a pointercrate url with conversion into class
	 * @param data_class class to convert into
	 * @param url url of pointercrate to access
	 */
	protected async _get_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string) {
		const headers: Record<string, string> = {};

		if (this.client.token) {
			headers["Authorization"] = `Bearer ${this.client.token}`;
		}

		const response = await this._get_req_with_headers<PointercrateRequest<U>>(url);

		// some endpoints return within data field (singular or not)
		return new data_class(response.data.data, { etag: response.headers["ETag"] });
	}

	/**
	 * runs a get request on a pointercrate url with conversion to list class
	 * @param data_class class to convert into
	 * @param url url of pointercrate to access
	 */
	protected async _get_req_list<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string): Promise<T[]> {
		const headers: Record<string, string> = {};

		if (this.client.token) {
			headers["Authorization"] = `Bearer ${this.client.token}`;
		}

		// what the heck
		const response = await this._get_req_with_headers<U[]>(url);

		const class_list = [];

		for (const data of response.data) {
			class_list.push(new data_class(data, {}));
		}

		// some endpoints return within data field (singular or not)
		return class_list;
	}

	/**
	 * sends a post request to pointercrate servers with auth and etag
	 * @param data_class class that url will return
	 * @param url url to post to
	 * @param data data to send to servers
	 * @param etag used if editing/deleting something - if-match
	 */
	protected async _post_req<T extends BaseRequest, U extends IBaseData>
		(data_class: new (data: U, settings: IBaseRequest) => T, url: string, data: Record<string, unknown>, etag?: string) {
		const headers: Record<string, string> = {};

		if (this.client.token) {
			headers["Authorization"] = `Bearer ${this.client.token}`;
		}

		if (etag) {
			headers["If-Match"] = etag;
		}

		try {
			const response = await this.client.http_instance.post<PointercrateRequest<U>>(
				url,
				data,
				{ headers }
			);

			return new data_class(response.data.data, { etag: response.headers["ETag"] });
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error.message;
			}
			throw error;
		}

	}
}