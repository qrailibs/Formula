import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export default class IfElseStatement implements IStatement {
	public type: StatementType = StatementType.Condition;
	public condition: IStatement[];
	public branchIf: IStatement[];
	public branchElse: IStatement[];

	constructor(condition: IStatement[], branchIf: IStatement[], branchElse: IStatement[]) {
		this.condition = condition;
		this.branchIf = branchIf;
		this.branchElse = branchElse;
	}

	public serialize(ctx: StatementContext): string {
		let condition = this.condition.map(child => child.serialize(ctx)).join('');
		let childrenIf = this.branchIf.map(child => child.serialize(ctx)).join('');
		let childrenElse = this.branchElse.map(child => child.serialize(ctx)).join('');

		return `(?(?=${condition})(${childrenIf}${childrenElse ? ')|(' + childrenElse : ''}))`;
	}
}