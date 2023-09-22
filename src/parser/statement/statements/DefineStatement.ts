import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export default class DefineStatement implements IStatement {
	public type: StatementType = StatementType.Define;
	public value: IStatement;

	constructor(value: IStatement) {
		this.value = value;
	}

	public serialize(ctx: StatementContext): string {
		return '';
	}
}