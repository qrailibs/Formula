import fs from 'fs';

export const writeFile = async (filepath: fs.PathLike, content: string) => {
	await fs.promises.writeFile(filepath, content);
};