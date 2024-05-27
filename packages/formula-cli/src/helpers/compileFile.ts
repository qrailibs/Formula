import path from "path";
import { writeFile } from "./writeFile";
import { readFile } from "./readFile";
import { compileToRegexp, compileToJs, CompileOutput } from "./compileString";

/**
 * Compile .formula file
 * @param filePath path to filee
 */
export const compileFile = async (filePath: string, to: CompileOutput = "regexp") => {
    const baseName: string = path.basename(filePath, ".formula");
    const content: string = await readFile(filePath);

    const { result } = to === "regexp" ? compileToRegexp(content) : compileToJs(content, baseName);

    await writeFile("./dist/" + baseName + (to === "regexp" ? ".txt" : ".js"), result);
};
