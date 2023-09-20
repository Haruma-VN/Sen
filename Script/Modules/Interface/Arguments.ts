namespace Sen.Script.Modules.Interface.Arguments {
    /**
     *
     * @returns Input argument for boolean
     */
    export function BooleanArgument(): 0 | 1 {
        Sen.Shell.Console.Printf(null, `      0. ${Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("False"))}`);
        Sen.Shell.Console.Printf(null, `      1. ${Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("True"))}`);
        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        let assert_test: int | null = Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, [0, 1]);
        while (assert_test === null) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, input))}`
            );
            input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            assert_test = Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, [0, 1]);
        }
        return assert_test as 1 | 0;
    }

    /**
     *
     * @param available Input for argument
     * @returns Evaluate option
     */

    export function TestInput(available: Array<int>): int {
        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, available)) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, input))}`
            ),
                (input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan));
        }
        return parseInt(input) as int;
    }

    /**
     *
     * @param msg - Pass message here
     * @returns Input argument
     */

    export function InputInteger(msg: string): int {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, msg);
        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!/^\d+$/.test(input)) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("not_a_valid_integer_input"))}`
            );
            input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return parseInt(input);
    }

    /**
     *
     * @param arg - Provide arg
     * @returns
     */

    export function ObtainArgument(arg: string): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_success").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("argument_obtained"))
        );
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${arg}`);
        return;
    }

    /**
     *
     * @param type - Type for input
     * @returns File path input by the user
     */

    export function InputPath(type: "file" | "directory" | "unknown"): string {
        let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (arg !== "") {
            if (arg === ":p") {
                switch (type) {
                    case "file": {
                        do {
                            arg = Sen.Shell.Console.OpenFileDialog("Sen", []);
                        } while (arg === null || arg === ``);
                        ObtainArgument(arg);
                        break;
                    }
                    case "directory": {
                        do {
                            arg = Sen.Shell.Console.OpenDirectoryDialog("Sen");
                        } while (arg === null || arg === ``);
                        ObtainArgument(arg);
                        break;
                    }
                    case "unknown": {
                        const method: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("select_input_method"), [1, 2], {
                            "1": [Sen.Script.Modules.System.Default.Localization.GetString("file"), Sen.Script.Modules.System.Default.Localization.GetString("file")],
                            "2": [Sen.Script.Modules.System.Default.Localization.GetString("directory"), Sen.Script.Modules.System.Default.Localization.GetString("directory")],
                        }) as 1 | 2;
                        switch (method) {
                            case 1: {
                                do {
                                    arg = Sen.Shell.Console.OpenFileDialog("Sen", []);
                                } while (arg === null || arg === ``);
                                ObtainArgument(arg);
                                break;
                            }
                            case 2: {
                                do {
                                    arg = Sen.Shell.Console.OpenDirectoryDialog("Sen");
                                } while (arg === null || arg === ``);
                                ObtainArgument(arg);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            if (arg.endsWith(" ")) {
                arg = arg.slice(0, -1);
            }
            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                arg = arg.slice(1, -1);
            }
            switch (type) {
                case "file": {
                    if (Sen.Shell.FileSystem.FileExists(arg)) {
                        return arg;
                    }
                }
                case "directory": {
                    if (Sen.Shell.FileSystem.DirectoryExists(arg)) {
                        return arg;
                    }
                }
                default: {
                    if (Sen.Shell.FileSystem.FileExists(arg) || Sen.Shell.FileSystem.DirectoryExists(arg)) {
                        return arg;
                    }
                }
            }
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(/\{\}/g, arg)}`);
            arg = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return "" as never;
    }

    /**
     *
     * @param type - Type for input
     * @returns File path input by the user
     */

    export function SavePath(type: "file" | "directory" | "unknown", filter: Array<string>): string {
        let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        assert_view: while (arg !== "") {
            if (arg === ":p") {
                switch (type) {
                    case "file": {
                        do {
                            arg = Sen.Shell.Console.SaveFileDialog("Sen", filter);
                        } while (arg === null || arg === ``);
                        ObtainArgument(arg);
                        break assert_view;
                    }
                    case "directory": {
                        do {
                            arg = Sen.Shell.Console.OpenDirectoryDialog("Sen");
                        } while (arg === null || arg === ``);
                        ObtainArgument(arg);
                        break assert_view;
                    }
                    case "unknown": {
                        const method: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("select_input_method"), [1, 2], {
                            "1": [Sen.Script.Modules.System.Default.Localization.GetString("file"), Sen.Script.Modules.System.Default.Localization.GetString("file")],
                            "2": [Sen.Script.Modules.System.Default.Localization.GetString("directory"), Sen.Script.Modules.System.Default.Localization.GetString("directory")],
                        }) as 1 | 2;
                        switch (method) {
                            case 1: {
                                do {
                                    arg = Sen.Shell.Console.SaveFileDialog("Sen", filter);
                                } while (arg === null || arg === ``);
                                ObtainArgument(arg);
                                break assert_view;
                            }
                            case 2: {
                                do {
                                    arg = Sen.Shell.Console.OpenDirectoryDialog("Sen");
                                } while (arg === null || arg === ``);
                                ObtainArgument(arg);
                                break assert_view;
                            }
                        }
                    }
                }
            }
            if (arg.endsWith(" ")) {
                arg = arg.slice(0, -1);
            }
            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                arg = arg.slice(1, -1);
            }
            if (type === "file" && !Sen.Shell.FileSystem.FileExists(arg)) {
                break assert_view;
            } else if (type === "directory" && !Sen.Shell.FileSystem.DirectoryExists(arg)) {
                return arg;
            } else {
                SavePath(type, filter);
            }
        }
        return arg;
    }

    /**
     * Structure
     */

    export interface Argument {
        argument: string;
    }

    /**
     *
     * @param argument - Pass argument here
     * @param type - Pass file type here
     * @returns Printing message
     */

    export function ArgumentPrint(option: Argument, type: "file" | "directory", filter?: Array<string>): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_receievd_as_default"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${option.argument}`);
        if (type === "file" && Sen.Shell.FileSystem.FileExists(option.argument)) {
            if (Sen.Script.Modules.System.Default.Localization.EntryJson.default.override) {
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Yellow,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_warning").replace(
                        /\{\}/g,
                        Sen.Script.Modules.System.Default.Localization.GetString("file_already_exists_remove_instantly").replace(/\{\}/g, option.argument)
                    )
                );
                Sen.Shell.FileSystem.DeleteFile(option.argument);
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Yellow, Sen.Script.Modules.System.Default.Localization.GetString("execution_warning").replace(/\{\}/g, ``));
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("file_already_exists")}`);
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("out_path"))
                );
                option.argument = SavePath("file", filter ?? []);
            }
        }
        if (type === "directory" && Sen.Shell.FileSystem.DirectoryExists(option.argument)) {
            if (Sen.Script.Modules.System.Default.Localization.EntryJson.default.override) {
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Yellow,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_warning").replace(
                        /\{\}/g,
                        Sen.Script.Modules.System.Default.Localization.GetString("directory_already_exists_override").replace(/\{\}/g, option.argument)
                    )
                );
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Yellow, Sen.Script.Modules.System.Default.Localization.GetString("execution_warning").replace(/\{\}/g, ``));
                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("directory_already_exists")}`);
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("out_path"))
                );
                option.argument = SavePath("directory", filter ?? []);
            }
        }
        return;
    }
}
