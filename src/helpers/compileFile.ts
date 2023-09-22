import path from 'path';
import { writeFile } from './writeFile';
import { readFile } from './readFile';
import { compileString } from './compileString';

export const compileFile = async (filePath: string) => {
	let baseName: string = path.basename(filePath, '.formula');
	let content: string = await readFile(filePath);
	let { result } = compileString(content);
	await writeFile('./dist/' + baseName + '.txt', result);
};