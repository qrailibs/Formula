import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export default class TestStatement implements IStatement {
	public type: StatementType = StatementType.Test;
	public value: string;

	constructor(value: string) {
		this.value = value;
	}

	public serialize(ctx: StatementContext): string {
		return '';
	}
}