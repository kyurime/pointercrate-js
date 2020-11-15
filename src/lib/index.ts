import axios, { AxiosInstance } from 'axios';

import DemonBuilder from './endpoints/demon';
import PlayerBuilder from './endpoints/player';

export default class PointercrateClient {
	http_instance: AxiosInstance;

	demons = new DemonBuilder(this);
	players = new PlayerBuilder(this);

	constructor(url = "https://pointercrate.com/api/") {
		this.http_instance = axios.create({
			baseURL: url
		});
	}
}