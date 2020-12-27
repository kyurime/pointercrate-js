import PointercratePagination from "../../base/pagination";

export default interface SubmitterListingFilters extends PointercratePagination {
	banned?: boolean;
}
