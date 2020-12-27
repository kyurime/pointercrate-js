export default interface PointercratePagination {
	/**
	 * Maximum amount to be returned from request, default is 50
	 */
	limit?: number;

	/**
	 * ID of last object on previus page, default is -Infinity
	 */
	after?: number;

	/**
	 * ID of first object on next page, default is +Infinity
	 */
	before?: number;
}