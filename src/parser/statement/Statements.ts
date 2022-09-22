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

class GroupStatement extends IParentStatement {
	public named?: string | null

	constructor(children: IStatement[], named?: string | null) {
		super(StatementType.Group, children)

		this.named = named
	}

	public serialize(ctx: StatementContext): string {
		let children = this.children.map(child => child.serialize(ctx)).join('')

		return this.named === null
			? `(?:${children})` // Group uncaptured (named=null)
			: this.named === undefined
				? `(${children})` // Group captured (named=undefined)
				: `(?<${this.named}>${children})` // Group captured, named
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

		return `(?(?=${condition})${childrenIf}${childrenElse ? '|' + childrenElse : ''})`
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
	public value: Matcher
	public params: MatcherParams

	constructor(value: Matcher, params: MatcherParams = { optional: false }) {
		this.value = value
		this.params = params
	}

	public serialize(ctx: StatementContext): string {
		let result = null
		// Special
		if(typeof this.value === 'object' && 'of' in this.value) {
			// Constants
			switch(this.value.of) {
				case 'START': {
					result = '^'
					break
				}
				case 'END': {
					result = '$'
					break
				}
				case 'DIGIT': {
					result = '\\d'
					break
				}
				case 'NONDIGIT': {
					result = '\\D'
					break
				}
				case 'LETTER': {
					result = '[a-zA-Z]'
					break
				}
				case 'WORD': {
					result = '\\w'
					break
				}
				case 'NONWORD': {
					result = '\\W'
					break
				}
				case 'SPACE': {
					result = '\\s'
					break
				}
			}

			// Definitions
			if(ctx.define[this.value.of]) {
				result = ctx.define[this.value.of].value.serialize(ctx)
			}
		}
		// Literal
		else {
			result = this.value.replace('-', '\\-').replace('.', '\\.')
		}

		return result !== null 
			? result
				// Amount
				+ (this.params.amount
					? this.params.amount?.max
						// Min, Max
						? `{${this.params.amount?.min},${this.params.amount?.max}}`
						// Unlimited
						: this.params.amount?.min ? `{${this.params.amount?.min}}` : '+'
					: '')
				// Optional
				+ (this.params.optional ? '?' : '')
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