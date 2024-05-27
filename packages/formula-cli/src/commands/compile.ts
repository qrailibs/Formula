import type { Arguments, CommandBuilder } from "yargs";
import { compileFile } from "../helpers/compileFile";
import { compileFolder } from "../helpers/compileFolder";
import { CompileOutput } from "../helpers/compileString";

type Options = {
    path: string;
    dir?: boolean;
    out?: string;
};

export const command: string = "compile <path>";
export const desc: string = "Compile formula file/directory <path> to regex";

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .options({
            dir: { type: "boolean" },
            out: { type: "string", choices: ["regex", "js"], default: "regex" },
        })
        .positional("path", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>) => {
    const { path, dir, out } = argv;

    // Whole directory
    if (dir) {
        await compileFolder(path, (out ?? "regex") as CompileOutput);
    }
    // One file
    else {
        await compileFile(path, (out ?? "regex") as CompileOutput);
    }

    process.stdout.write("> FINISHED");
    process.exit(0);
};
