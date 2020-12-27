import { PointercrateRequest } from './request';

// internally pointercrate says "a JSON object" for error
/**
 * Error response
 * Data is an object of additional data
 */
export interface IPointercrateError extends PointercrateRequest<unknown> {
	message: string,
	code: number,
}

export default class PointercrateError extends Error implements IPointercrateError {
	code: number;
	data: unknown;

	constructor(error: IPointercrateError) {
		super(error.message);

		this.name = "PointercrateError"
		this.code = error.code;

		this.data = error.data;
	}
}