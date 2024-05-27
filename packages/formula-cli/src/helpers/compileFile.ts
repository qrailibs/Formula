import path from "path";
import { writeFile } from "./writeFile";
import { readFile } from "./readFile";
import { compileToRegexp, compileToJs, CompileOutput } from "./compileString";
import { normalizeName } from "./normalizeName";

/**
 * Compile .formula file
 * @param filePath path to filee
 */
export const compileFile = async (filePath: string, to: CompileOutput = "regex") => {
    const baseName: string = path.basename(filePath, ".formula");
    const normalizedName: string = normalizeName(baseName);
    const content: string = await readFile(filePath);

    const { result } = to === "regex" ? compileToRegexp(content) : compileToJs(content, normalizedName);

    if (to === "regex") {
        await writeFile("./dist/" + baseName + ".txt", result);
    } else {
        await writeFile("./dist/" + normalizedName + ".js", result);
    }
};
