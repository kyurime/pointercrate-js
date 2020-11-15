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

		try {
			const response = await this.client.http_instance.get(url, {
				headers
			});

			// some endpoints return within data field (singular or not)
			if (response.data.data) {
				return <T>response.data.data;
			} else {
				return <T>response.data;
			}
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error.message;
			}
			throw error;
		}
	}
}