import fs from 'fs'
import Lexer from './parser/Lexer'
import Parser from './parser/Parser'
import Token from './parser/type/Token'

const readFile = (filepath: fs.PathLike): string => {
	return fs.readFileSync(filepath, 'utf8')
}
const writeFile = async(filepath: fs.PathLike, content: string) => {
	fs.writeFileSync(filepath, content)
}

let formulaContent: string = readFile('simple.formula')

// Lex
let lexed: Token[] = Lexer.lex(formulaContent)

console.log('LEXED', lexed)

// Parse
let parseResult = Parser.parse(lexed)

// Serialize
let result: string = parseResult.program.serialize(parseResult.context)

console.log('RESULT', result)

// Save
writeFile('out.txt', result)