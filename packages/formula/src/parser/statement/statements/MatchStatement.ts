import compileParams, { MatcherParams } from "../../helpers/compileParams";
import IStatement from "../IStatement";
import StatementContext from "../StatementContext";
import StatementType from "../StatementType";

export type MatchPrimitive = {
    pseudo?: "behind" | "ahead";
    type: "define" | "literal";
    value: string;
};

export type MatchOperator = "or";
const Operators: Readonly<Record<MatchOperator, string>> = {
    or: "|",
};

export default class MatchStatement implements IStatement {
    public type: StatementType = StatementType.Match;
    public operator: MatchOperator;
    public values: MatchPrimitive[];
    public params: MatcherParams;

    constructor(operator: MatchOperator, values: MatchPrimitive[], params: MatcherParams = { optional: false }) {
        this.operator = operator;
        this.values = values;
        this.params = params;
    }

    private serializeOne(ctx: StatementContext, primitive: MatchPrimitive) {
        let regexResult = "";

        // Defined
        if (primitive.type === "define") {
            regexResult = this.getDefined(ctx, primitive.value);
        }
        // Range of characters
        else if (primitive.value.startsWith("[") && primitive.value.endsWith("]")) {
            regexResult = primitive.value;
        }
        // Literal
        else {
            regexResult = primitive.value.replace(/\-/g, "\\-").replace(/\./g, "\\.");
        }

        // Lookahead
        if (primitive.pseudo === "ahead") {
            regexResult = `(?=${regexResult})`;
        }
        // Lookbehind
        else if (primitive.pseudo === "behind") {
            regexResult = `(?<=${regexResult})`;
        }

        return regexResult;
    }

    private getDefined(ctx: StatementContext, definitionName: string): string {
        // Constants
        switch (definitionName) {
            case "START": {
                return "^";
            }
            case "END": {
                return "$";
            }
            case "DIGIT": {
                return "\\d";
            }
            case "NONDIGIT": {
                return "\\D";
            }
            case "LETTER": {
                return "[a-zA-Z]";
            }
            case "WORD": {
                return "\\w";
            }
            case "NONWORD": {
                return "\\W";
            }
            case "ANY": {
                return ".";
            }
            case "SPACE": {
                return "\\s";
            }
        }

        // Definitions
        if (ctx.define[definitionName]) {
            return ctx.define[definitionName].value.serialize(ctx);
        } else {
            throw new Error(`Unexpected variable "${definitionName}", there's no definition for that variable.`);
        }
    }

    public serialize(ctx: StatementContext): string {
        let result = null;

        // Should values be packed into anonymous group? (For splitting with operator)
        let doPacking =
            this.values.length > 1 &&
            this.values.every((primitive) => (primitive.type === "literal" ? primitive.value.length > 1 : true));

        // Concat all values and split them with operator
        result = this.values
            .map((value) => (doPacking ? "(?:" + this.serializeOne(ctx, value) + ")" : this.serializeOne(ctx, value)))
            .join(Operators[this.operator]);

        return result !== null ? compileParams(result, this.params) : "";
    }
}
