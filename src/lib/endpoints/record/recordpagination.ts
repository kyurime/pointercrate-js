import PointercratePagination from "../../base/pagination";

import RecordStatus from "./recordstatus";

export default interface RecordListingPagination extends PointercratePagination {
	progress__lt?: number;
	progress__gt?: number;
	progress?: number;

	demon_position__lt?: number;
	demon_position__gt?: number;
	demon_position?: number;

	status?: RecordStatus;

	player?: number;

	demon?: string;
	demon_id?: number;

	video?: string;

	submitter?: number;
}