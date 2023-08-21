namespace Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPAAndAPK {
    /**
     * Structure
     */
    export interface PassArgument {
        filepath: string;
        output: string;
    }

    /**
     *
     * @param argument - pass argument
     * @returns unpacked
     */

    export function ExtractFromIPAandAPK(argument: PassArgument): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("uncompressing_zip"))
        );
        Sen.Shell.DotNetCompress.UncompressZip(argument.filepath, argument.output);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("uncompressing_zip_success"))
        );
        const files: Array<string> = Sen.Shell.FileSystem.ReadDirectory(argument.output, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
        const rsbs: Array<string> = files.filter((file: string) => Sen.Script.Modules.FileSystem.FilterFilePath(file, [".rsb", ".rsb.smf"], [], "file"));
        const contains_rsb_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument.filepath)}`, `${Sen.Shell.Path.Parse(argument.filepath).name_without_extension}.rsb.extracted`));
        Sen.Shell.FileSystem.CreateDirectory(contains_rsb_path);
        rsbs.forEach((file: string) => {
            Sen.Shell.FileSystem.MoveFile(file, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${contains_rsb_path}`, `${Sen.Shell.Path.Parse(file).name}`)));
        });
        Sen.Shell.FileSystem.DeleteDirectory([argument.output]);
        return;
    }

    /**
     *
     * @returns Evaluate()
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("extract_cn_rsb"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_apk_or_ipa"))
        );
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPAAndAPK.ExtractFromIPAandAPK({
            filepath: Sen.Shell.Path.Resolve(file_in),
            output: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name}.extracted`)),
        });
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.ExtractCNRSBfromIPAAndAPK.Evaluate();
