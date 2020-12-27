import PointercratePagination from "../../base/pagination";

import Permissions from "./permissions";

export default interface UserListingFilters extends PointercratePagination {
	name?: string;
	name_contains?: string;

	display_name?: string;

	has_permissions?: Permissions;
	any_permissions?: Permissions;
}
