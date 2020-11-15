export default class Note {
	id: number;
	record: number;
	content: string;
	transferred: boolean;
	author?: string;
	editors: string[];

	constructor({ id, record, content, transferred, author, editors }:
		{
			id: number, record: number, content: string,
			transferred: boolean, author?: string, editors: string[]
		}) {
		this.id = id;
		this.record = record;
		this.content = content;
		this.transferred = transferred;
		this.editors = editors;

		if (author) {
			this.author = author;
		}
	}
}