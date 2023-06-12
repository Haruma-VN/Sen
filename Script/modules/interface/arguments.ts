namespace Sen.Script.Modules.Interface.Arguments {
    /**
     *
     * @returns Input argument for boolean
     */
    export function BooleanArgument(): 0 | 1 {
        Console.Printf(
            null,
            `      0. ${Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("false"),
            )}`,
        );
        Console.Printf(
            null,
            `      1. ${Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("true"),
            )}`,
        );
        let input: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        let assert_test: int | null = Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, [0, 1]);
        while (assert_test === null) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(
                        /\{\}/g,
                        input,
                    ),
                )}`,
            );
            input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
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
        let input: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, available)) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(
                        /\{\}/g,
                        input,
                    ),
                )}`,
            ),
                (input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan));
        }
        return parseInt(input) as int;
    }

    /**
     *
     * @param msg - Pass message here
     * @returns Input argument
     */

    export function InputInteger(msg: string): int {
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, msg);
        let input: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!/^\d+$/.test(input)) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("not_a_valid_integer_input"),
                )}`,
            );
            input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return parseInt(input);
    }

    /**
     *
     * @param type - Type for input
     * @returns File path input by the user
     */

    export function InputPath(type: "file" | "directory" | "unknown"): string {
        let arg: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (arg !== "") {
            if (arg.endsWith(" ")) {
                arg = arg.slice(0, -1);
            }
            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                arg = arg.slice(1, -1);
            }
            switch (type) {
                case "file": {
                    if (Fs.FileExists(arg)) {
                        return arg;
                    }
                }
                case "directory": {
                    if (Fs.DirectoryExists(arg)) {
                        return arg;
                    }
                }
                default: {
                    if (Fs.FileExists(arg) || Fs.DirectoryExists(arg)) {
                        return arg;
                    }
                }
            }
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(
                    /\{\}/g,
                    arg,
                )}`,
            );
            arg = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return "" as never;
    }
}
