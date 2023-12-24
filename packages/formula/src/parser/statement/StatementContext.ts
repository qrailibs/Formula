import DefineStatement from "./statements/DefineStatement";
import TestStatement from "./statements/TestStatement";

export default class StatementContext {
	define: Record<string, DefineStatement> = {};
	test: TestStatement[] = [];
}