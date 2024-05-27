import fs from "fs";
import { compileFile } from "./compileFile";
import { CompileOutput } from "./compileString";

/**
 * Compile folder with .formula files
 * @param dirPath path to folder
 */
export const compileFolder = async (dirPath: string, to: CompileOutput = "regexp") => {
    const files: string[] = await fs.promises.readdir(dirPath);

    // Create /dist
    if (!fs.existsSync("./dist")) {
        await fs.promises.mkdir("./dist");
    }

    // Compile files to /dist
    for (const file of files) {
        if (file.endsWith(".formula")) {
            await compileFile(dirPath + "/" + file, to);
        }
    }
};
