namespace Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPA {
    export interface PassArgument {
        filepath: string;
        output: string;
    }

    export function ExtractFromIPA(argument: PassArgument): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, `Execution Status: Uncompressing Zip...`);
        Sen.Shell.DotNetCompress.UncompressZip(argument.filepath, argument.output);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `Execution Finish: Uncompressing Zip Success`);
        const files: Array<string> = Sen.Shell.FileSystem.ReadDirectory(argument.output, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
        const rsbs: Array<string> = files.filter((file: string) => Sen.Script.Modules.FileSystem.FilterFilePath(file, [".rsb"], [], "file"));
        const contains_rsb_path: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(argument.filepath)}/${Sen.Shell.Path.Parse(argument.filepath).name_without_extension}.rsb.extracted`);
        Sen.Shell.FileSystem.CreateDirectory(contains_rsb_path);
        rsbs.forEach((file: string) => {
            Sen.Shell.FileSystem.MoveFile(file, Sen.Shell.Path.Resolve(`${contains_rsb_path}/${Sen.Shell.Path.Parse(file).name}`));
        });
        Sen.Shell.FileSystem.DeleteDirectory([argument.output]);
        return;
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input ipa path to continue`);
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPA.ExtractFromIPA({
            filepath: file_in,
            output: Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(file_in)}/${Sen.Shell.Path.Parse(file_in).name}.extracted`),
        });
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPA.Evaluate();
