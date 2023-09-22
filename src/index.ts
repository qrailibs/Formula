import Lexer from './parser/Lexer';
import Parser from './parser/Parser';
import Token from './parser/type/Token';
import { readFile } from './helpers/readFile';
import { writeFile } from './helpers/writeFile';
import { testString } from './helpers/testString';
import chalk from 'chalk';

(async() => {
	let formulaContent: string = await readFile('src/test/in.formula');
	
	// Lex
	let lexed: Token[] = new Lexer(true).lex(formulaContent);
	
	console.log('--------------');
	console.log(chalk.yellow('LEXED'), lexed);
	console.log('--------------');
	
	// Parse
	let parseResult = new Parser(true).parse(lexed);
	
	// Serialize
	let result: string = parseResult.program.serialize(parseResult.context);
	console.log('--------------');
	console.log(chalk.blue('RESULT'), result);
	console.log(chalk.blue('CONTEXT'), parseResult.context);
	console.log('--------------');

	// Test
	console.log(chalk.blue('TESTING'));
	const textSuccess = chalk.green
	const textError = chalk.red
	let testNumber = 1
	for(const test of parseResult.context.test) {
		const success: boolean = new RegExp(result).test(test.value);

		const message = `${success ? '✓' : '✖'} Test ${testNumber}: ${test.value}`;
		console.log(
			' '.repeat(4) +
			(success
				? textSuccess(message)
				: textError(message)
			)
		);
		testNumber++;
	}
	console.log('--------------');

	// Save
	await writeFile('src/test/out.txt', result);
})();