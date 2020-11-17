import { PointercrateRequest } from '../base/request';

// internally pointercrate says "a JSON object" for error
/**
 * Error response
 * Data is an object of additional data
 */
export default interface Error extends PointercrateRequest<unknown> {
	message: string,
	code: number,
}