import PointercrateClient from "..";

export interface PointercrateRequest<T> {
	data: T;
}

export interface IBaseRequest {
	etag?: string;
	client: PointercrateClient;
}

export interface IBaseData {
	readonly id: number;
}

export default class BaseRequest implements IBaseRequest, IBaseData {
	readonly id: number;
	readonly etag?: string;
	readonly client: PointercrateClient;

	constructor(data: IBaseData, base: IBaseRequest) {
		if (base.etag) {
			this.etag = base.etag;
		}

		this.client = base.client;
		this.id = data.id;
	}
}