import type { Arguments, CommandBuilder } from 'yargs'
import fs from 'fs'
import path from 'path'
import Lexer from '../parser/Lexer'
import Token from '../parser/type/Token'
import Parser from '../parser/Parser'

const readFile = (filepath: fs.PathLike): string => {
	return fs.readFileSync(filepath, 'utf8')
}
const writeFile = async(filepath: fs.PathLike, content: string) => {
	fs.writeFileSync(filepath, content)
}
const compileFile = (filePath: string) => {
	let baseName: string = path.basename(filePath, '.formula')
	let content: string = readFile(filePath)
	let result: string = compileFormula(content)
	writeFile('./dist/' + baseName + '.txt', result)
}
const compileFormula = (formula: string): string => {
	// Lex
	let lexed: Token[] = Lexer.lex(formula)
	// Parse
	let parseResult = Parser.parse(lexed)
	// Serialize
	return parseResult.program.serialize(parseResult.context)
}

type Options = {
	path: string;
	dir: boolean | undefined;
}

export const command: string = 'compile <path>';
export const desc: string = 'Compile formula file/directory <path> to regex';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .options({
      dir: { type: 'boolean' },
    })
    .positional('path', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
	const { path: _path, dir } = argv;
	// Whole directory
	if(dir) {
		let files: string[] = fs.readdirSync(_path)
		
		// Create /dist
		if (!fs.existsSync('./dist')){
			fs.mkdirSync('./dist')
		}

		// Compile files to /dist
		for(let file of files) {
			if(file.endsWith('.formula')) {
				compileFile(_path + '/' + file)
			}
		}
	}
	// File
	else {
		compileFile(_path)
	}
	
	process.stdout.write('> FINISHED');
	process.exit(0);
};