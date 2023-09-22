import IStatement from "./IStatement"
import StatementContext from "./StatementContext"
import StatementType from "./StatementType"

export default abstract class IParentStatement implements IStatement {
	public type: StatementType
	public children: IStatement[]

	constructor(type: StatementType, children: IStatement[]) {
		this.type = type
		this.children = children
	}

	abstract serialize(ctx: StatementContext): string;
}