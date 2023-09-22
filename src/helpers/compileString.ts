import Lexer from "../parser/Lexer";
import Parser from "../parser/Parser";
import StatementContext from "../parser/statement/StatementContext";
import Token from "../parser/type/Token";

export type CompileResult = {
	result: string
	context: StatementContext
};

export const compileString = (formula: string): CompileResult => {
	// 1. Lexing
	let lexed: Token[] = new Lexer().lex(formula);
	
	// 2. Parsing
	let parseResult = new Parser().parse(lexed);

	// 3. Serializing to RegExp
	return {
		result: parseResult.program.serialize(parseResult.context),
		context: parseResult.context
	};
};