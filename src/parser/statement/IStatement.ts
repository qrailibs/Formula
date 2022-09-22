import StatementContext from "./StatementContext";
import StatementType from "./StatementType";

export default interface IStatement {
	type: StatementType

	serialize(ctx: StatementContext): string
}