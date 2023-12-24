import compileParams, { MatcherParams } from "../../helpers/compileParams";
import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export type MatchPrimitive = {
	pseudo?: "behind" | "ahead",
	type: "define" | "literal",
	value: string
}

export type MatchOperator = "or"
const Operators: Readonly<Record<MatchOperator, string>> = {
	"or": "|"
};

export default class MatchStatement implements IStatement {
	public type: StatementType = StatementType.Match;
	public operator: MatchOperator;
	public values: MatchPrimitive[];
	public params: MatcherParams;

	constructor(operator: MatchOperator, values: MatchPrimitive[], params: MatcherParams = { optional: false }) {
		this.operator = operator;
		this.values = values;
		this.params = params;
	}

	private serializeOne(ctx: StatementContext, primitive: MatchPrimitive) {
		let regexResult = '';

		// Special
		if(primitive.type === 'define') {
			// Constants
			switch(primitive.value) {
				case 'START': {
					regexResult = '^';
					break;
				}
				case 'END': {
					regexResult = '$';
					break;
				}
				case 'DIGIT': {
					regexResult = '\\d';
					break;
				}
				case 'NONDIGIT': {
					regexResult = '\\D';
					break;
				}
				case 'LETTER': {
					regexResult = '[a-zA-Z]';
					break;
				}
				case 'WORD': {
					regexResult = '\\w';
					break;
				}
				case 'NONWORD': {
					regexResult = '\\W';
					break;
				}
				case 'ANY': {
					regexResult = '.';
					break;
				}
				case 'SPACE': {
					regexResult = '\\s';
					break;
				}
			}

			// Definitions
			if(ctx.define[primitive.value]) {
				regexResult = ctx.define[primitive.value].value.serialize(ctx);
			}
			else {
				throw new Error(`Unexpected variable "${primitive.value}", there's no definition for that variable.`);
			}
		}
		// Range of characters
		else if(primitive.value.startsWith('[') && primitive.value.endsWith(']')) {
			regexResult = primitive.value;
		}
		// Literal
		else {
			regexResult = primitive.value.replace(/\-/g, '\\-').replace(/\./g, '\\.');
		}

		// Lookahead
		if(primitive.pseudo === 'ahead') {
			regexResult = `(?=${regexResult})`
		}
		// Lookbehind
		else if(primitive.pseudo === 'behind') {
			regexResult = `(?<=${regexResult})`
		}

		return regexResult;
	}

	public serialize(ctx: StatementContext): string {
		let result = null;
		
		// Should values be packed into anonymous group? (For splitting with operator)
		let doPacking = this.values.length > 1 && this.values.every(primitive => primitive.type === 'literal' ? primitive.value.length > 1 : true);

		// Concat all values and split them with operator
		result = this.values.map(value => 
			doPacking ? '(?:' + this.serializeOne(ctx, value) + ')'
				: this.serializeOne(ctx, value)
		).join(Operators[this.operator]);

		return result !== null 
			? compileParams(result, this.params)
			: '';
	}
}