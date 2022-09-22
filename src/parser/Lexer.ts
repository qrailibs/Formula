import Token from "./type/Token";
import TokenType from "./type/TokenType";

function logLexer(state: string, char: string, pos: number, data?: any) {
	console.log(`[${state}] "${char}" at ${pos} ${data ? '(' + data + ')' : ''}`)
}

export default class Lexer {
	private static get tokens(): { [key: string]: Token } {
		return {
			'?': new Token(TokenType.Optional, '?', null),
			'+': new Token(TokenType.Mutiple, '+', null),
			'{': new Token(TokenType.GroupStart, '{', null),
			'}': new Token(TokenType.GroupEnd, '}', null),
			'(': new Token(TokenType.ArgStart, '(', null),
			')': new Token(TokenType.ArgEnd, ')', null),
			',': new Token(TokenType.Comma, ',', null),
			'!': new Token(TokenType.Anonymous, '!', null),
			
			'match': new Token(TokenType.Match, 'match', null),
			'group': new Token(TokenType.Group, 'group', null),
			'define': new Token(TokenType.Define, 'define', null),

			'if': new Token(TokenType.If, 'if', null),
			'else': new Token(TokenType.Else, 'else', null),
		}
	}

	// Transform formula to array of statements
	public static lex(text: string): Token[] {
		let out: Token[] = []
		let currPos: number = 0

		// Token pos
		let currLine: number = 1
		let currColumn: number = 1

		function next() {
			currPos++
			currColumn++
		}
		function increase(val: number) {
			currPos += val
			currColumn += val
		}
		function nextLine() {
			currLine++
			currColumn = 1
		}
		function getPos() {
			return {
				start: {
					line: currLine,
					column: currColumn
				}
			}
		}

		// Lookahead text to match string
		function lookaheadString(str: string): boolean {
			const parts: string[] = str.split('')
		  
			for (let i = 0; i < parts.length; i++) {
			  if (text[currPos + i] !== parts[i]) {
				return false
			  }
			}
		  
			return true
		}
		function lookahead(match: RegExp, matchNext?: RegExp): string[] {
			const bucket: string[] = []

			while (true) {
				const nextIndex: number = currPos + bucket.length
				const nextToken: string = text[nextIndex]
				if (!nextToken) { break }
				let m: string | RegExp = match
				if (matchNext && bucket.length) { m = matchNext }
				if (m && !m.test(nextToken)) { break }
				bucket.push(nextToken)
			}

			return bucket
		}

		while(currPos < text.length) {
			const char: string = text[currPos]

			logLexer('LOOP', char, currPos)

			// Skip space
			if(/\s/.test(char)) {
				if(char === '\n') {
					nextLine()
				}
				next()
				continue
			}

			// String literal
			if(char === "'") {
				next()

				const bucket = lookahead(/[^']/)
				out.push(new Token(TokenType.LiteralString, bucket.join(''), getPos()))
				increase(bucket.length + 1)

				logLexer('STRING', char, currPos, bucket.join(''))
				
				continue
			}

			// Comment
			if(char === '#') {
				while(text[currPos] !== '\n') {
					next()
				}
			}

			// Name
			const literalRegex = /[a-zA-Z_]/
			const literalRegexNext = /[a-zA-Z0-9_]/
			const literalRegexNumber = /[0-9]/
			if (literalRegex.test(char)) {
				const bucket = lookahead(literalRegex, literalRegexNext)
				let value: string = bucket.join('')
				increase(bucket.length)

				if(Lexer.tokens[value]) {
					let tok = Object.assign({}, Lexer.tokens[value])
					tok.pos = getPos()
					out.push(tok)
				}
				else {
					out.push(new Token(TokenType.Name, value, getPos()))
				}

				logLexer('NAME', char, currPos, value)

				continue
			}
			else if(literalRegexNumber.test(char)) {
				const bucket = lookahead(literalRegexNumber)
				let value: string = bucket.join('')
				increase(bucket.length)

				if(Lexer.tokens[value]) {
					let tok = Object.assign({}, Lexer.tokens[value])
					tok.pos = getPos()
					out.push(tok)
				}
				else {
					out.push(new Token(TokenType.LiteralNumber, value, { start: { line: currLine, column: currPos }}))
				}

				logLexer('NUMBER', char, currPos, value)

				continue
			}

			// Other tokens
			let didMatch: boolean = false
			for(const key in Lexer.tokens) {
				if(!lookaheadString(key)) {
					continue
				}

				if(Lexer.tokens[key]) {
					let tok = Object.assign({}, Lexer.tokens[key])
					tok.pos = getPos()
					out.push(tok)
					increase(key.length)
					didMatch = true
				}
			}

			if(didMatch) continue
		}

		return out
	}
}