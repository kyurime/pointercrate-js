import Builder from '../../base/builder';

import Demon from './demon';
import DemonListingFilters from './demonpagination';
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
	 * @param filters pagination filters for demon listing
	 */
	async by_id(filters?: DemonListingFilters) {
		return this.client._get_req_list(Demon, `v2/demons/`, filters);
	}

	/**
	 * returns a list of all demons, sorted by position
	 * @param filters pagination filters for demon listing
	 */
	async by_position(filters?: DemonListingFilters) {
		return this.client._get_req_list(Demon, `v1/demons/`, filters);
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
		return this.client._post_req(Demon, "v1/demons/", parameters);
	}

	async _edit(id: number, etag: string, parameters:
		{
			name?: string, position?: number, video?: string, requirement?: number,
			verifier?: string, publisher?: string
		}) {
			return this.client._patch_req(FullDemon, `v2/demons/${id}/`, parameters, { etag });
		}

	async _add_creator(id: number, author_name: string) {
		return this.client._patch_req_no_resp(`v2/demons/${id}/creators`, {
				creator: author_name
			});
		}

	async _delete_creator(id: number, author_id: number) {
			return this.client._delete_req(`v2/demons/${id}/creators/${author_id}`);
		}
}
