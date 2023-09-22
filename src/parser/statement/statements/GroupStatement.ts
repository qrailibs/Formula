import compileParams, { MatcherParams } from "../../helpers/compileParams";
import IParentStatement from "../IParentStatement";
import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export default class GroupStatement extends IParentStatement {
	public named?: string | null;
	public params: MatcherParams;

	constructor(children: IStatement[], params: MatcherParams, named?: string | null) {
		super(StatementType.Group, children);
		this.params = params;
		this.named = named;
	}

	public serialize(ctx: StatementContext): string {
		let children = this.children.map(child => child.serialize(ctx)).join('');

		let result = this.named === null
			? `(?:${children})` // Group uncaptured (named=null)
			: this.named === undefined
				? `(${children})` // Group captured (named=undefined)
				: `(?<${this.named}>${children})`; // Group captured, named
		
		return compileParams(result, this.params);
	}
}