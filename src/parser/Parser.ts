import Token from "./type/Token";
import TokenType from "./type/TokenType";

import { ProgramStatement, GroupStatement, MatchStatement, IfElseStatement, DefineStatement } from './statement/Statements';
import IStatement from "./statement/IStatement";
import StatementContext from "./statement/StatementContext";

type ParserResult = {
	program: ProgramStatement,
	context: StatementContext
}

export default class Parser {
	public static parse(tokens: Token[]): ParserResult {
		const out: IStatement[] = []
		const context: StatementContext = new StatementContext()
		let currPos: number = 0

		function next() {
			currPos++
		}
		function prev() {
			currPos--
		}

		function expect(type: TokenType) {
			let tok: Token = tokens[currPos]
			if(tok?.type === type) {
				return true
			}
			else {
				throw new Error(`Expected "${type}" token, but got: "${tok?.type}" (At line ${tok?.pos?.start.line})`)
			}
		}
		function is(type: TokenType) {
			return tokens[currPos]?.type === type
		}
		function expectNext(type: TokenType) {
			next()
			return expect(type)
		}
		function isNext(type: TokenType) {
			return tokens[currPos + 1]?.type === type
		}

		// Statements
		function parse(): IStatement | null {
			console.log('IN PARSE', currPos, tokens[currPos])
			let currToken: Token = tokens[currPos]

			// Match
			if(currToken?.type === TokenType.Match) {
				console.log('IN PARSE PARSING MATCH', currPos)
				let res = parseMatch()
				console.log('IN PARSE PARSED MATCH', res, currPos, tokens[currPos])
				return res
			}
			// Group
			else if(currToken?.type === TokenType.Group) {
				console.log('IN PARSE PARSING GROUP')
				let res = parseGroup()
				console.log('IN PARSE PARSED GROUP', res, currPos, tokens[currPos])
				return res
			}
			// If-else
			else if(currToken?.type === TokenType.If) {
				console.log('IN PARSE PARSING IF-ELSE')
				let res = parseIfElse()
				console.log('IN PARSE PARSED IF-ELSE', res, currPos, tokens[currPos])
				return res
			}
			// Define
			else if(currToken?.type === TokenType.Define) {
				console.log('IN PARSE PARSING DEFINE')
				let res = parseDefine()
				console.log('IN PARSE PARSED DEFINE', res, currPos, tokens[currPos])
				return res
			}
			else if(currToken) {
				throw new Error(`Unknown statement. Expected "match" or "group" or "if", but got: "${currToken?.type}" (At line ${currToken?.pos?.start.line})`)
			}
			return null
		}
		function parseBody(until: TokenType): IStatement[] {
			let result: IStatement[] = []

			let currToken: Token = tokens[currPos]

			console.log('PREV LOOP', currToken)
			do {
				currToken = tokens[currPos]
				if(currToken?.type === until || !currToken) {
					break
				}

				console.log('BEFORE PARSE', currToken, currPos)

				// Parse statement
				let stmt: IStatement | null = parse()
				// Add
				if(stmt) { result.push(stmt) }

				console.log('AFTER PARSE', currToken, currPos)
			} while(currToken?.type !== until || !currToken)

			if(currToken?.type !== until) {
				prev()
			}

			console.log('AFTER LOOP', tokens[currPos])

			return result
		}

		// Match
		function parseMatch(): MatchStatement | null {
			next()
			let nextToken: Token = tokens[currPos]
			let params: any = {
				optional: false
			}

			// Multiple?
			if(nextToken?.type === TokenType.Mutiple) {
				// From 1 to unlimited
				params.amount = {}

				// Next
				next()
				nextToken = tokens[currPos]
			}
			else if(nextToken?.type === TokenType.ArgStart) {
				let min = undefined
				let max = undefined

				// Next
				next()
				nextToken = tokens[currPos]

				// Minimal
				if(nextToken?.type === TokenType.LiteralNumber) {
					min = parseInt(nextToken.value)
					next()
				}
				else {
					console.error('Expected number (amount of matches), but got: ' + nextToken)
					next()
				}
				nextToken = tokens[currPos]

				// Maximal
				if(min !== undefined && nextToken?.type === TokenType.Comma) {
					next()
					nextToken = tokens[currPos]

					if(nextToken?.type === TokenType.LiteralNumber) {
						max = parseInt(nextToken.value)
						next()
					}
					else {
						console.error('Expected number (amount of max matches), but got: ' + nextToken)
						prev()
					}
				}

				// )
				if(expect(TokenType.ArgEnd)) {
					next()
					nextToken = tokens[currPos]

					params.amount = { min, max }
				}
			}

			// Optional?
			if(nextToken?.type === TokenType.Optional) {
				params.optional = true
				// Next
				next()
				nextToken = tokens[currPos]
			}

			// Special matcher
			if(nextToken?.type === TokenType.Name) {
				let stmt = new MatchStatement({ of: nextToken.value }, params)
				next()
				return stmt
			}
			// Literal matcher
			else if(nextToken?.type === TokenType.LiteralString) {
				let stmt = new MatchStatement(nextToken.value, params)
				next()
				return stmt
			}
			else {
				console.error('Invalid value after "match": ' + nextToken.value)
				return null
			}
		}
		
		// Group
		function parseGroup(): GroupStatement | null {
			next()

			// Name
			let name: string | null | undefined = undefined
			if(is(TokenType.Name)) {
				next()
				name = tokens[currPos].value
			}
			// Anonymous name
			else if(is(TokenType.Anonymous)) {
				next()
				name = null
			}

			// {
			expect(TokenType.GroupStart)
			next()

			// Body
			let body: IStatement[] = parseBody(TokenType.GroupEnd)
			let group: GroupStatement = new GroupStatement(body, name)

			// }
			expect(TokenType.GroupEnd)
			next()

			console.log('PARSED GROUP')

			return group
		}

		// If-else
		function parseIfElse(): IfElseStatement | null {
			// (
			expectNext(TokenType.ArgStart)
			next()
			
			// Condition
			let condition: IStatement[] = parseBody(TokenType.ArgEnd)
			
			// )
			expect(TokenType.ArgEnd)

			// {
			expectNext(TokenType.GroupStart)
			next()

			// Then
			let thenBranch: IStatement[] = parseBody(TokenType.GroupEnd)

			// }
			expect(TokenType.GroupEnd)
			next()

			let elseBranch: IStatement[] = []
			if(is(TokenType.Else)) {
				// {
				expectNext(TokenType.GroupStart)
				next()

				// Else
				elseBranch = parseBody(TokenType.GroupEnd)

				// }
				expect(TokenType.GroupEnd)
				next()
			}

			console.log('PARSED IF-ELSE')
			return new IfElseStatement(condition, thenBranch, elseBranch)
		}

		// Define
		function parseDefine(): DefineStatement | null {
			next()

			// Name
			let name: string | null | undefined = undefined
			if(is(TokenType.Name)) {
				name = tokens[currPos].value
				next()
			}
			else {
				throw new Error(`Unknown statement. Expected name, but got: "${tokens[currPos]?.type}" (At line ${tokens[currPos]?.pos?.start.line})`)
			}

			// Value
			let value: IStatement | null = parse()
			if(value) {
				let stmt: DefineStatement = new DefineStatement(value)

				// Add to context
				context.define[name] = stmt

				return stmt
			}

			throw new Error(`Expected value, but got: "${tokens[currPos]?.type}" (At line ${tokens[currPos]?.pos?.start.line})`)
		}

		while(currPos < tokens.length) {
			if(tokens[currPos + 1]) {
				let stmt = parse()
				if(stmt) out.push(stmt)
			}
			else {
				break
			}
		}

		return {
			program: new ProgramStatement(out),
			context
		}
	}
}