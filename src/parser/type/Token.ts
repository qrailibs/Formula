import TokenType from "./TokenType"

type TokenPos = {
	column: number,
	line: number
}
type TokenPosMatch = {
	start: TokenPos,
	//end: TokenPos
}
export default class Token {
	public type: TokenType
	public value: string
	public pos: TokenPosMatch | null

	constructor(type: TokenType, value: string, pos: TokenPosMatch | null) {
		this.type = type
		this.value = value
		this.pos = pos
	}
}