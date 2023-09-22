import fs from 'fs';
import { compileFile } from './compileFile';

export const compileFolder = async (dirPath: string) => {
	let files: string[] = await fs.promises.readdir(dirPath);
		
	// Create /dist
	if (!fs.existsSync('./dist')){
		await fs.promises.mkdir('./dist');
	}

	// Compile files to /dist
	for(let file of files) {
		if(file.endsWith('.formula')) {
			await compileFile(dirPath + '/' + file);
		}
	}
}