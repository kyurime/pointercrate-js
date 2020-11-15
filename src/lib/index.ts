import axios, { AxiosInstance } from 'axios';

import DemonBuilder from './endpoints/demon';

export default class PointercrateClient {
	http_instance: AxiosInstance;

	constructor(url = "https://pointercrate.com/api/") {
		this.http_instance = axios.create({
			baseURL: url
		});
	}

	get demons() {
		return new DemonBuilder(this);
	}
}