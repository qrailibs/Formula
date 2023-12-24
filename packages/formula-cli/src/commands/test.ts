import type { Arguments, CommandBuilder } from 'yargs';
import { readFile } from '../helpers/readFile';
import { testString } from '../helpers/testString';
import chalk from 'chalk';

type Options = {
	path: string;
}

export const command: string = 'test <path>';
export const desc: string = 'Run testing of formula in file/directory <path>';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional('path', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>) => {
	const { path: _path } = argv;

	await fn(_path);

	process.exit(0);
};

export const fn = async (path: string) => {
	const formula = await readFile(path);
	const testResults = testString(formula);

	const textSuccess = chalk.green
	const textError = chalk.red

	// Print test results
	console.log(`[${path}]`);
	for(const testResult of testResults) {
		const message = `${testResult.isSuccess ? '✓' : '✖'} Test ${testResult.number}: ${testResult.value}`;

		console.log(' '.repeat(4) + (testResult.isSuccess
			? textSuccess(message)
			: textError(message)));
	}
}