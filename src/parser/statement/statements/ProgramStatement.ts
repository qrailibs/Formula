import IParentStatement from "../IParentStatement";
import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export default class ProgramStatement extends IParentStatement {
	constructor(children: IStatement[]) {
		super(StatementType.Program, children);
	}

	public serialize(ctx: StatementContext): string {
		return this.children.map(child => child.serialize(ctx)).join('');
	}
}