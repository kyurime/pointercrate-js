import Builder from '../../base/builder';
import { PermissionTypes } from '../user';

import Demon from './demon';
import FullDemon from './fulldemon';

export default class DemonBuilder extends Builder {
	/**
	 * gets a demon by id (not position)
	 * @param id id of demon to get
	 */
	async from_id(id: number) {
		return this.client._get_req(FullDemon, `v2/demons/${id}`);
	}

	/**
	 * gets a demon by position (not id)
	 * @param position position of demon to get
	 */
	async from_position(position: number) {
		return this.client._get_req(FullDemon, `v1/demons/${position}`);
	}

	/**
	 * returns a list of all demons, sorted by id
	 */
	async by_id() {
		return this.client._get_req_list(Demon, `v2/demons/`);
	}

	/**
	 * returns a list of all demons, sorted by position
	 */
	async by_position() {
		return this.client._get_req_list(Demon, `v1/demons/`);
	}

	/**
	 * adds a demon to the list, returns a demon
	 * @param parameters parameters of demon to add
	 */
	async add(parameters:
		{
			name: string, position: number, requirement: number,
			verifier: string, publisher: string,
			creators: string[], video?: string
		}) {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ListModerator)) {
			return this.client._post_req(Demon, "/v1/demons/", parameters);
		} else {
			throw "Demon adding endpoint requires ListModerator!";
		}
	}
}