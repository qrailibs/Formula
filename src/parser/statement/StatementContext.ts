import { DefineStatement } from "./Statements"

export default class StatementContext {
	define: { [key: string]: DefineStatement }

	constructor() {
		this.define = {}
	}
}