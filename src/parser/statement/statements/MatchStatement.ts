import compileParams, { MatcherParams } from "../../helpers/compileParams";
import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export type SpecialMatcher = { of: string };
export type LiteralMatcher = string;
export type Matcher = SpecialMatcher | LiteralMatcher;

export default class MatchStatement implements IStatement {
	public type: StatementType = StatementType.Match;
	public values: Matcher[];
	public params: MatcherParams;

	constructor(values: Matcher[], params: MatcherParams = { optional: false }) {
		this.values = values;
		this.params = params;
	}

	private serializeOne(ctx: StatementContext, value: Matcher) {
		// Special
		if(typeof value === 'object' && 'of' in value) {
			// Constants
			switch(value.of) {
				case 'START': {
					return '^';
				}
				case 'END': {
					return '$';
				}
				case 'DIGIT': {
					return '\\d';
				}
				case 'NONDIGIT': {
					return '\\D';
				}
				case 'LETTER': {
					return '[a-zA-Z]';
				}
				case 'WORD': {
					return '\\w';
				}
				case 'NONWORD': {
					return '\\W';
				}
				case 'ANY': {
					return '.';
				}
				case 'SPACE': {
					return '\\s';
				}
			}

			// Definitions
			if(ctx.define[value.of]) {
				return ctx.define[value.of].value.serialize(ctx);
			}
		}
		// Range of characters
		else if(value.startsWith('[') && value.endsWith(']')) {
			return value;
		}
		// Literal
		else {
			return value.replace(/\-/g, '\\-').replace(/\./g, '\\.');
		}
	}

	public serialize(ctx: StatementContext): string {
		let result = null;
		
		let doPacking = this.values.length > 1 && this.values.every(value => typeof value === 'string' ? value.length > 1 : true);
		result = this.values.map(value => 
			doPacking ? '(?:' + this.serializeOne(ctx, value) + ')'
				: this.serializeOne(ctx, value)
		).join('|');

		return result !== null 
			? compileParams(result, this.params)
			: '';
	}
}