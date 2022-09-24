import IStatement from "./IStatement";
import StatementContext from "./StatementContext";
import StatementType from "./StatementType";

abstract class IParentStatement implements IStatement {
	public type: StatementType
	public children: IStatement[]

	constructor(type: StatementType, children: IStatement[]) {
		this.type = type
		this.children = children
	}

	abstract serialize(ctx: StatementContext): string;
}

class ProgramStatement extends IParentStatement {
	constructor(children: IStatement[]) {
		super(StatementType.Program, children)
	}

	public serialize(ctx: StatementContext): string {
		return this.children.map(child => child.serialize(ctx)).join('')
	}
}

type MatcherAmount = { min: number, max?: number }
type MatcherParams = {
	optional: boolean,
	amount?: MatcherAmount
}
function compileParams(original: string, params: MatcherParams): string {
	return original
		// Amount
		+ (params.amount
			? params.amount?.max
				// Min, Max
				? `{${params.amount?.min},${params.amount?.max}}`
				// Unlimited
				: params.amount?.min ? `{${params.amount?.min}}` : '+'
			: '')
		// Optional
		+ (params.optional ? '?' : '')
}

class GroupStatement extends IParentStatement {
	public named?: string | null
	public params: MatcherParams

	constructor(children: IStatement[], params: MatcherParams, named?: string | null) {
		super(StatementType.Group, children)
		this.params = params
		this.named = named
	}

	public serialize(ctx: StatementContext): string {
		let children = this.children.map(child => child.serialize(ctx)).join('')

		let result = this.named === null
			? `(?:${children})` // Group uncaptured (named=null)
			: this.named === undefined
				? `(${children})` // Group captured (named=undefined)
				: `(?<${this.named}>${children})` // Group captured, named
		
		return compileParams(result, this.params)
	}
}

class IfElseStatement implements IStatement {
	public type: StatementType = StatementType.Condition
	public condition: IStatement[]
	public branchIf: IStatement[]
	public branchElse: IStatement[]

	constructor(condition: IStatement[], branchIf: IStatement[], branchElse: IStatement[]) {
		this.condition = condition
		this.branchIf = branchIf
		this.branchElse = branchElse
	}

	public serialize(ctx: StatementContext): string {
		let condition = this.condition.map(child => child.serialize(ctx)).join('')
		let childrenIf = this.branchIf.map(child => child.serialize(ctx)).join('')
		let childrenElse = this.branchElse.map(child => child.serialize(ctx)).join('')

		return `(?(?=${condition})(${childrenIf}${childrenElse ? ')|(' + childrenElse : ''}))`
	}
}

class DefineStatement implements IStatement {
	public type: StatementType = StatementType.Define
	public value: IStatement

	constructor(value: IStatement) {
		this.value = value
	}

	public serialize(ctx: StatementContext): string {
		return ''
	}
}

type SpecialMatcher = { of: string }
type LiteralMatcher = string
type Matcher = SpecialMatcher | LiteralMatcher

class MatchStatement implements IStatement {
	public type: StatementType = StatementType.Match
	public values: Matcher[]
	public params: MatcherParams

	constructor(values: Matcher[], params: MatcherParams = { optional: false }) {
		this.values = values
		this.params = params
	}

	private serializeOne(ctx: StatementContext, value: Matcher) {
		// Special
		if(typeof value === 'object' && 'of' in value) {
			// Constants
			switch(value.of) {
				case 'START': {
					return '^'
				}
				case 'END': {
					return '$'
				}
				case 'DIGIT': {
					return '\\d'
				}
				case 'NONDIGIT': {
					return '\\D'
				}
				case 'LETTER': {
					return '[a-zA-Z]'
				}
				case 'WORD': {
					return '\\w'
				}
				case 'NONWORD': {
					return '\\W'
				}
				case 'SPACE': {
					return '\\s'
				}
			}

			// Definitions
			if(ctx.define[value.of]) {
				return ctx.define[value.of].value.serialize(ctx)
			}
		}
		// Literal
		else {
			return value.replace('-', '\\-').replace('.', '\\.')
		}
	}

	public serialize(ctx: StatementContext): string {
		let result = null
		
		let doPacking = this.values.length > 1 && this.values.every(value => typeof value === 'string' ? value.length > 1 : true)
		result = this.values.map(value => 
			doPacking ? '(?:' + this.serializeOne(ctx, value) + ')'
				: this.serializeOne(ctx, value)
		).join('|')

		return result !== null 
			? compileParams(result, this.params)
			: ''
	}
}

export {
	ProgramStatement,
	GroupStatement,
	MatchStatement,
	IfElseStatement,
	DefineStatement
}