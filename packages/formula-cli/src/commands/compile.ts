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
            out: { type: "string", choices: ["regexp", "js"], default: "regexp" },
        })
        .positional("path", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<Options>) => {
    const { path: _path, dir, out } = argv;

    await fn(_path, dir ?? false, (out ?? "regexp") as CompileOutput);

    process.stdout.write("> FINISHED");
    process.exit(0);
};

export const fn = async (path: string, isDir: boolean, out: CompileOutput) => {
    // Whole directory
    if (isDir) {
        await compileFolder(path, out);
    }
    // One file
    else {
        await compileFile(path, out);
    }
};
