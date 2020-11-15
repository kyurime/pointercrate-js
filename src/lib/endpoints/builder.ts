import PointercrateClient from '../index';

import Error from './error';

export default class Builder {
	constructor(
		public client: PointercrateClient
	) { }

	async get_req<T>(url: string) {
		// love ya strict typing
		const headers: { Authorization?: string } = {};

		if (this.client.token) {
			headers["Authorization"] = `Bearer ${this.client.token}`;
		}

		const response = await this.client.http_instance.get(url, {
			headers
		});

		if (response.data.error) {
			throw response.data as Error;
		}

		// some endpoints return within data field (singular or not)
		if (response.data.data) {
			return <T>response.data.data;
		} else {
			return <T>response.data;
		}
	}
}