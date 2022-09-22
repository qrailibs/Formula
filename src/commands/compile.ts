import type { Arguments, CommandBuilder } from 'yargs'
import fs from 'fs'
import Lexer from '../parser/Lexer'
import Token from '../parser/type/Token'
import Parser from '../parser/Parser'

const readFile = (filepath: fs.PathLike): string => {
	return fs.readFileSync(filepath, 'utf8')
}
const writeFile = async(filepath: fs.PathLike, content: string) => {
	fs.writeFileSync(filepath, content)
}

type Options = {
	file: string;
}

export const command: string = 'compile <file>';
export const desc: string = 'Compile formula file <file> to regex';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    /*.options({
      upper: { type: 'boolean' },
    })*/
    .positional('file', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
	// File
	const { file } = argv;
	let formulaContent: string = readFile(file)

	// Lex
	let lexed: Token[] = Lexer.lex(formulaContent)

	// Parse
	let parseResult = Parser.parse(lexed)

	// Serialize
	let result: string = parseResult.program.serialize(parseResult.context)

	// Save
	writeFile('out.txt', result)

	process.stdout.write('COMPILED TO: ' + result);
	process.exit(0);
};