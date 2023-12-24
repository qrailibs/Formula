import fs from 'fs';

export const readFile = async (filepath: fs.PathLike): Promise<string> => {
	return await fs.promises.readFile(filepath, 'utf8');
};