namespace Sen.Script.Modules.Interface.Assert {
    /**
     *
     * @param argument - Assert functions
     * @returns
     */
    export function Evaluate(argument: Array<string>): void {
        if (argument.length === 0) {
            Sen.Script.Modules.Interface.Assert.InputMorePath(argument);
        }
        let evaluate_more_argument: boolean = false;
        if (argument.length > 1) {
            evaluate_more_argument = EvaluateMoreArgument();
        }
        if (evaluate_more_argument) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(
                    /\{\}/g,
                    `${argument.length}/${argument.length}`,
                )}`,
            );
            argument.forEach((arg: string) => Console.Printf(null, `      ${arg}`));
        }
        return;
    }

    /**
     *
     * @returns If the user want to evaluate all arguments at one
     */

    export function EvaluateMoreArgument(): boolean {
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("execute_all_argument_in_queue"),
            )}`,
        );
        return Sen.Script.Modules.Interface.Arguments.BooleanArgument() === 1;
    }

    /**
     *
     * @param input - Pass the input argument in
     * @param numbers - Pass the number array in
     * @returns number matched in the numbers[] else null
     */

    export function MatchInputWithNumbers(input: string, numbers: Array<number>): int | null {
        const numberRegex: RegExp = /^\d+$/;
        if (numberRegex.test(input)) {
            const inputNum: int = parseInt(input);
            if (numbers.includes(inputNum)) {
                return inputNum;
            }
        }
        return null;
    }

    /**
     *
     * @param argument - Pass the argument array to input more
     * @returns
     */

    export function InputMorePath(argument: Array<string>): void {
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("no_argument_were_passed"),
            )}`,
        );
        let arg: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (arg !== "") {
            if (arg.startsWith(`"`) && arg.endsWith(`"`)) {
                arg = arg.slice(1, -1);
            }
            if (Fs.FileExists(arg) || Fs.DirectoryExists(arg)) {
                argument.push(arg);
            } else {
                Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(
                        /\{\}/g,
                        arg,
                    )}`,
                );
            }
            arg = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return;
    }
}
