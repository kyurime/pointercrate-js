import PointercratePagination from "../../base/pagination";

export default interface DemonListingFilters extends PointercratePagination {
	name?: string,
	name_contains?: string,

	position?: number,

	requirement__gt?: number,
	requirement__lt?: number,
	requirement?: number,

	verifier_id?: number,
	verifier_name?: number,

	publisher_id?: number,
	publisher_name?: number,
}