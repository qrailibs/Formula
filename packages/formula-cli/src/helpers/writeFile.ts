import fs from "fs";

/**
 * Utility to write content to file
 */
export const writeFile = async (filepath: fs.PathLike, content: string) => {
    await fs.promises.writeFile(filepath, content);
};
