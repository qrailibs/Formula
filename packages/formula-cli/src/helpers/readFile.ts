import fs from "fs";

/**
 * Utility to read content of file
 */
export const readFile = async (filepath: fs.PathLike): Promise<string> => {
    return await fs.promises.readFile(filepath, "utf8");
};
