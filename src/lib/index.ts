import axios, { AxiosInstance } from 'axios';

import DemonBuilder from './endpoints/demon';
import Error from './endpoints/error';
import PlayerBuilder from './endpoints/player';
import UserBuilder from './endpoints/user';
import { User } from './endpoints/user';
export default class PointercrateClient {
	http_instance: AxiosInstance;

	demons = new DemonBuilder(this);
	players = new PlayerBuilder(this);
	users = new UserBuilder(this);

	user?: User;
	token?: string;

	constructor(url = "https://pointercrate.com/api/") {
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
			const response = await this.http_instance.post("/v1/auth/", {}, {
				auth: {
					username,
					password
				}
			});

			this.user = <User>response.data.data;
			this.token = response.data.token;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error.message;
			}
			throw error;
		}
	}

	async token_login(token: string) {
		try {
			const response = await this.http_instance.post("/v1/auth/", {}, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});

			this.user = <User>response.data.data;
			this.token = token;
		} catch (error) {
			if (error.response.data) {
				const pointercrate_error = <Error>error.response.data;
				throw pointercrate_error.message;
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
		this.user = new User({ id: -1, name: "unknown", permissions: 0xFFFF});
	}
}