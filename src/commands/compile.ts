import type { Arguments, CommandBuilder } from 'yargs';
import { compileFile } from '../helpers/compileFile';
import { compileFolder } from '../helpers/compileFolder';

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

export const handler = async (argv: Arguments<Options>) => {
	const { path: _path, dir } = argv;

	await fn(_path, dir ?? false);
	
	process.stdout.write('> FINISHED');
	process.exit(0);
};

export const fn = async (path: string, isDir: boolean) => {
	// Whole directory
	if(isDir) {
		await compileFolder(path);
	}
	// One file
	else {
		await compileFile(path);
	}
}