import Builder from '../../base/builder';
import { PermissionTypes } from '../user';

import Player from './player';
import RankedPlayer from './rankedplayer';

export default class PlayerBuilder extends Builder {
	/**
	 * gets listed form of player
	 * @param id id of player
	 */
	async from_id(id: number) {
		return this.client._get_req(Player, `v1/players/${id}`)
	}

	/**
	* this endpoint requires extended access permissions
	*/
	async list() {
		if (this.client.user &&
			this.client.user.implied_permissions.includes(PermissionTypes.ExtendedAccess)) {
			return this.client._get_req_list(Player, `v1/players/`);
		} else {
			throw "Player listing endpoint requires ExtendedAccess!";
		}
	}

	/**
	 * this endpoint doesn't require extended access permissions
	 * returns a different form of player
	 */
	async by_ranking() {
		return this.client._get_req_list(RankedPlayer, `v1/players/ranking/`)
	}
}