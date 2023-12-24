import fs from "fs";
import chalk from "chalk";
import { Lexer, Parser, Token } from "./index";

export const readFile = async (filepath: fs.PathLike): Promise<string> => {
    return await fs.promises.readFile(filepath, "utf8");
};
export const writeFile = async (filepath: fs.PathLike, content: string) => {
    await fs.promises.writeFile(filepath, content);
};

(async () => {
    const formulaContent: string = await readFile("src/test/in.formula");

    // Lex
    const lexed: Token[] = new Lexer(true).lex(formulaContent);

    console.log("--------------");
    console.log(chalk.yellow("LEXED"), lexed);
    console.log("--------------");

    // Parse
    const parseResult = new Parser(true).parse(lexed);

    // Serialize
    const result: string = parseResult.program.serialize(parseResult.context);
    console.log("--------------");
    console.log(chalk.blue("RESULT"), result);
    console.log(chalk.blue("CONTEXT"), parseResult.context);
    console.log("--------------");

    // Test
    console.log(chalk.blue("TESTING"));
    const textSuccess = chalk.green;
    const textError = chalk.red;
    let testNumber = 1;
    for (const test of parseResult.context.test) {
        const success: boolean = new RegExp(result).test(test.value);

        const message = `${success ? "✓" : "✖"} Test ${testNumber}: ${test.value}`;
        console.log(" ".repeat(4) + (success ? textSuccess(message) : textError(message)));
        testNumber++;
    }
    console.log("--------------");

    // Save
    await writeFile("src/test/out.txt", result);
})();
