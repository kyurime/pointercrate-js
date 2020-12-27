import PointercratePagination from "../../base/pagination";

export default interface PlayerListingFilters extends PointercratePagination {
	name?: string;
	name_contains?: string;

	banned?: boolean;
	nation?: string;
}
