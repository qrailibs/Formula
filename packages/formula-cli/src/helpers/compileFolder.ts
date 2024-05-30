import fs from "fs";
import { compileFile } from "./compileFile";
import { CompileOutput } from "./compileString";
import { writeFile } from "./writeFile";
import { basename, join } from "path";

/**
 * Compile folder with .formula files
 * @param dirPath path to folder
 */
export const compileFolder = async (dirPath: string, to: CompileOutput = "regex") => {
    const files: string[] = await fs.promises.readdir(dirPath);

    // Create /dist
    if (!fs.existsSync("./dist")) {
        await fs.promises.mkdir("./dist");
    }

    // Compile files to /dist
    for (const file of files) {
        if (file.endsWith(".formula")) {
            await compileFile(join(dirPath, file), to);
        }
    }

    // Link all compiles js into index
    if (to === "js") {
        await writeFile(
            join(dirPath, "index.js"),
            files.map((filename) => `import * from '${basename(filename, ".formula")}';`).join("\n")
        );
    }
};
