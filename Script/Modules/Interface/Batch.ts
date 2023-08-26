namespace Sen.Script.Modules.Interface.Batch {
    /**
     * Available Batch
     */

    export const available_batch: Array<Sen.Script.Modules.Interface.Execute.function_name> = new Array<Sen.Script.Modules.Interface.Execute.function_name>(
        ...([
            "popcap_pam_to_pam_json",
            "popcap_pam_json_to_pam",
            "popcap_rton_to_json",
            "popcap_json_to_rton",
            "popcap_pam_to_flash_animation",
            "popcap_pam_from_flash_animation",
            "popcap_rsg_unpack",
            "popcap_rton_encrypt",
            "popcap_rton_decrypt",
            "popcap_rton_encode_and_encrypt",
            "popcap_rton_decrypt_and_decode",
        ] as Array<Sen.Script.Modules.Interface.Execute.function_name>)
    );

    /**
     * Execute Batch function
     * @returns
     */

    export function Execute(wrapper: Sen.Script.Modules.Interface.Assert.Wrapper): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_dir"))
        );
        const argument: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const available: Array<int> = available_batch.map<int>((e, i) => i + 1);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("select_method"))
        );
        available_batch.forEach((k_data: string, m_index: number) => {
            Sen.Shell.Console.Printf(null, `      ${m_index + 1}. ${Sen.Script.Modules.System.Default.Localization.GetString(k_data)}`);
        });
        let input: string = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
        while (!available.includes(parseInt(input))) {
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`));
            input = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
        }
        const data: Array<string> = Sen.Shell.FileSystem.ReadDirectory(argument, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
        data.forEach((arg: string, index: number) => {
            try {
                const func: Execute.function_name = available_batch[parseInt(input) - 1];
                if (
                    Sen.Script.Modules.FileSystem.FilterFilePath(arg, Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include, Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude) &&
                    Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].is_enabled
                ) {
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(/\{\}/g, `${index + 1}/${data.length}`)}`);
                    Sen.Script.Modules.Interface.Execute.Evaluate(func, arg, wrapper, index === data.length - 1);
                    Sen.Shell.Console.Printf(null, `      ${arg satisfies string}`);
                }
            } catch (error: unknown) {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${(error as Error).message}`);
            }
        });
        return;
    }
}
