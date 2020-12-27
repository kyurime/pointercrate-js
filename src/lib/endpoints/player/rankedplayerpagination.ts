import PointercratePagination from "../../base/pagination";

export default interface RankedPlayerListingFilters extends PointercratePagination {
	name_contains?: string;

	nation?: string;
}
