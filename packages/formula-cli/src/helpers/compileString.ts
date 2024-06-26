import { Lexer, Parser, Token } from "@datasco/formula";
import type { StatementContext } from "@datasco/formula";

export type CompileOutput = "js" | "regex";
export type CompileResult = {
    type: CompileOutput;
    result: string;
    context: StatementContext;
};

/**
 * Compile formula to RegExp text
 * @param formula formula code
 * @returns result of compilation
 */
export const compileToRegexp = (formula: string): CompileResult => {
    // 1. Lexing
    const lexed: Token[] = new Lexer().lex(formula);

    // 2. Parsing
    const parseResult = new Parser().parse(lexed);

    // 3. Transpilating
    return {
        type: "regex",
        result: parseResult.program.serialize(parseResult.context),
        context: parseResult.context,
    };
};

/**
 * Compile formula to JS code
 * @param formula formula code
 * @returns result of compilation
 */
export const compileToJs = (formula: string, exportAs: string = "formula"): CompileResult => {
    const { result, context } = compileToRegexp(formula);

    return {
        type: "js",
        result: /*js*/ `export const ${exportAs} = new RegExp(/${result}/g);`,
        context,
    };
};
