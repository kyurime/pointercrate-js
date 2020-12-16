import BaseRequest, { IBaseData, IBaseRequest } from '../../base/request';

export interface IMinimalDemon extends IBaseData {
	position: number;
	name: string;
}
export default class MinimalDemon extends BaseRequest implements IMinimalDemon {
	position: number;
	name: string;

	constructor({ id, position, name }: IMinimalDemon, data: IBaseRequest) {
		super({ id }, data);

		this.position = position;
		this.name = name;
	}
}
