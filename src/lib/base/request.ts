export interface PointercrateRequest<T> {
	data: T;
}

export interface IBaseRequest {
	etag?: string;
}

export interface IBaseData {
	readonly id: number;
}

export default class BaseRequest implements IBaseRequest, IBaseData {
	readonly id: number;
	readonly etag?: string;

	constructor(data: IBaseData, base: IBaseRequest) {
		if (base.etag) {
			this.etag = base.etag;
		}

		this.id = data.id;
	}
}