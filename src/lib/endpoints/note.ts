export default class Note {
	id: number;
	content: string;
	transferred: boolean;
	author?: string;
	editors: string[];

	constructor({ id, content, transferred, author, editors }:
		{
			id: number, content: string, transferred: boolean,
			author?: string, editors: string[]
		}) {
		this.id = id;
		this.content = content;
		this.transferred = transferred;
		this.editors = editors;

		if (author) {
			this.author = author;
		}
	}
}