export default interface Error {
	message: string,
	// data is unmapped due to the odd complexity of it
	code: number,
}