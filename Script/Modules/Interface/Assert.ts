namespace Sen.Script.Modules.Interface.Assert {
    /**
     * Structure
     */

    export type ArgumentType = "file" | "directory" | "unknown";
    /**
     * Structure
     */
    export interface RequestArgument<Argument extends string> {
        argument?: Argument;
        method: string | null;
    }

    /**
     * Structure
     */

    export type HostRequestArgument<Argument extends string> = Array<Sen.Script.Modules.Interface.Assert.RequestArgument<Argument>>;
    /**
     *
     * @param argument - Provides argument
     * @param index - Provide index to delete
     * @returns Delete one item only
     */

    export function DeleteArgument<Argument extends string>(argument: Array<Argument>, index: int): void {
        argument.splice(index, 1);
        return;
    }

    /**
     *
     * @param argument - Pass argument
     * @returns Methods array
     */

    export function ProcessArgument<Argument extends string>(argument: Array<Argument>): HostRequestArgument<Argument> {
        const request: HostRequestArgument<Argument> = new Array<RequestArgument<Argument>>();
        let currentArg: RequestArgument<Argument> = {
            method: null,
        };
        for (let i: int = 0; i < argument.length; i++) {
            if (argument[i] !== "-method") {
                currentArg.argument = argument[i];
                if (i + 1 < argument.length && i + 2 < argument.length) {
                    if (argument[i + 1] === "-method") {
                        currentArg.method = argument[i + 2];
                        i += 2;
                    }
                }
                request.push(currentArg);
                currentArg = {
                    method: null,
                };
            }
        }
        return request;
    }

    /**
     * Total Count
     */

    export interface Wrapper {
        success: number;
        fail: number;
        has_argument: boolean;
    }

    /**
     *
     * @param argument - Assert functions
     * @returns
     */
    export function Evaluate(argument: Array<string>, wrapper: Wrapper): void {
        // create debug directory
        Sen.Script.Modules.Interface.Assert.ProcessFunctionsJson();
        Sen.Script.Modules.Interface.Assert.CreateDebugDirectory();
        const host: HostRequestArgument<string> = Sen.Script.Modules.Interface.Assert.ProcessArgument<string>(argument);
        if (host.length === 0) {
            Sen.Script.Modules.Interface.Assert.InputMorePath(host, wrapper);
        }
        let evaluate_more_argument: boolean = false;
        if (host.length > 1 && host.filter((value: RequestArgument<string>) => value.method !== null).length === 0) {
            evaluate_more_argument = Sen.Script.Modules.Interface.Assert.EvaluateMoreArgument();
        }
        if (host.length !== 0) {
            wrapper.has_argument = true;
        }
        if (evaluate_more_argument) {
            const execute_argument: Array<string> = host.map((e) => e.argument!);
            PrintPath(execute_argument, {
                current: host.length,
                all: host.length,
            });
            try {
                Sen.Script.Modules.Interface.Execute.ExecuteArgument(execute_argument, wrapper);
            } catch (error: unknown) {
                Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
            }
        } else {
            host.forEach((arg: RequestArgument<string>, index: int) => {
                PrintPath(arg.argument!, {
                    current: index + 1,
                    all: host.length,
                });
                if (arg.method === null) {
                    try {
                        Sen.Script.Modules.Interface.Execute.ExecuteArgument(arg.argument!, wrapper);
                    } catch (error: unknown) {
                        Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
                    }
                } else {
                    try {
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("type_of_argument"));
                        Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.Interface.Assert.ObtainArgumentType(Sen.Script.Modules.System.Default.Localization.GetString(arg.argument!))}`);
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("method_obtained_by_default"));
                        Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString(arg.method!)} | ${arg.method}`);
                        Sen.Script.Modules.Interface.Execute.Evaluate(arg.method as unknown as Sen.Script.Modules.Interface.Execute.function_name, arg.argument!, wrapper, true);
                    } catch (error: unknown) {
                        Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
                    }
                }
            });
        }
        // if (wrapper.has_argument) {
        //     argument = [];
        //     Evaluate(argument, wrapper);
        // }
        return;
    }

    /**
     *
     * @param argument - Pass argument
     * @returns
     */

    export function ObtainArgumentType(argument: string): ArgumentType {
        if (Sen.Shell.FileSystem.FileExists(argument)) {
            return "file";
        } else if (Sen.Shell.FileSystem.DirectoryExists(argument)) {
            return "directory";
        } else {
            return "unknown";
        }
    }

    /**
     * Function json
     */

    export interface FunctionJson {
        [x: string]: {
            func_number: number;
            include: Array<string>;
            exclude: Array<string>;
            type: Sen.Script.Modules.FileSystem.filter_file_type;
            is_enabled: boolean;
        };
    }

    /**
     * Function json file path
     */

    export const function_json_location: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `functions.json`));

    /**
     * Deserialized function json
     */

    export const FunctionJsonObject: FunctionJson = Sen.Script.Modules.FileSystem.Json.ReadJson<FunctionJson>(Sen.Script.Modules.Interface.Assert.function_json_location);

    /**
     * All functions name
     */

    export const FunctionCollection: Array<string> = Object.keys(Sen.Script.Modules.Interface.Assert.FunctionJsonObject);

    /**
     * All functions number
     */

    export const FunctionNumbers: Array<int> = FunctionCollection.map((key: string) => Sen.Script.Modules.Interface.Assert.FunctionJsonObject[key].func_number);

    /**
     *
     * @returns Process function json
     */

    export function ProcessFunctionsJson(): void {
        for (let func of Sen.Script.Modules.Interface.Assert.FunctionCollection) {
            if (!("func_number" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"func_number"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Number.isInteger(FunctionJsonObject[func].func_number)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `func_number`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        `${typeof FunctionJsonObject[func].func_number}`,
                    ]),
                    `func_number`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                );
            }
            if (!("type" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"type"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (FunctionJsonObject[func].type !== "directory" && FunctionJsonObject[func].type !== "file" && FunctionJsonObject[func].type !== "unknown") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `type`,
                        `${func}`,
                        `directory or file or unknown`,
                        `${typeof FunctionJsonObject[func].type}`,
                    ]),
                    `type`,
                    function_json_location,
                    `directory or file or unknown`
                );
            }
            if (!("include" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"include"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Array.isArray(FunctionJsonObject[func].include)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `includes`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof FunctionJsonObject[func].include}`,
                    ]),
                    `resources`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
            if (!("exclude" in FunctionJsonObject[func])) {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("missing_in"), [`"exclude"`, `${func}`])}`,

                    Sen.Script.Modules.Interface.Assert.function_json_location
                );
            }
            if (!Array.isArray(FunctionJsonObject[func].exclude)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `exclude`,
                        `${func}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof FunctionJsonObject[func].exclude}`,
                    ]),
                    `resources`,
                    function_json_location,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
        }
        return;
    }

    /**
     *
     * @param argument - Pass argument here
     * @param size - Pass size
     * @returns
     */

    export function PrintPath(argument: Array<string> | string, size: { current: int; all: number }): void {
        if (Array.isArray(argument)) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(/\{\}/g, `${size.current}/${size.all}`)}`);
            argument.forEach((arg: string) => Sen.Shell.Console.Printf(null, `      ${arg}`));
        } else {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_in_progress").replace(/\{\}/g, `${size.current}/${size.all}`)}`);
            Sen.Shell.Console.Printf(null, `      ${argument satisfies string}`);
        }
        return;
    }

    /**
     *
     * @returns If the user want to evaluate all arguments at one
     */

    export function EvaluateMoreArgument(): boolean {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("execute_all_argument_in_queue"))}`
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
     * Structure
     */

    export interface CommandForward {
        query: "js_evaluate";
        package: Array<Record<"launch" | "id", string>>;
    }

    /**
     *
     * @param path - Current launch
     * @param command_path - Command.json path
     * @returns
     */

    export function QueryPath(path: string, command_path: string): string {
        if (path.startsWith("~")) {
            return Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(Sen.Shell.MainScriptDirectory, ...path.split("/").filter((e, i) => i !== 0)));
        } else if (path.startsWith(".")) {
            return Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(command_path, ...path.split("/").filter((e, i) => i !== 0)));
        }
        return path;
    }

    /**
     *
     * @param forward - Forward
     * @param command - Command path
     * @returns
     */

    export function QuickJS(forward: CommandForward, command: string): void {
        Sen.Shell.Console.Print(Platform.Constraints.ConsoleColor.Green, System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, System.Default.Localization.GetString("select_js")));
        const available: Array<int> = new Array<int>();
        forward.package.forEach((command: Record<"id" | "launch", string>, index: int) => {
            Sen.Shell.Console.Printf(null, `      ${index + 1}. ${System.Default.Localization.GetString(command.id)}`);
            available.push(index + 1);
        });
        let input: string = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
        while (!available.includes(parseInt(input))) {
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`));
            input = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
        }
        Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(`${QueryPath(forward.package[parseInt(input) - 1].launch, command)}.js`);
        return;
    }

    /**
     *
     * @param argument - Pass the argument array to input more
     * @returns
     */
    export function InputMorePath(argument: Sen.Script.Modules.Interface.Assert.HostRequestArgument<string>, wrapper: Wrapper): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, ``)}`);
        Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("no_argument_were_passed")}`);
        let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        assert_view: while (arg !== "") {
            function UseHotKey(): boolean {
                switch (arg) {
                    case ":js": {
                        const js_command: string = Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Executable`, `Methods`, `js_evaluate.json`);
                        QuickJS(Sen.Script.Modules.FileSystem.Json.ReadJson<CommandForward>(js_command), js_command);
                        return true;
                    }
                    case ":b": {
                        Sen.Script.Modules.Interface.Batch.Execute(wrapper);
                        return true;
                    }
                }
                return false;
            }
            if (UseHotKey()) {
                ++wrapper.success;
                break assert_view;
            }
            if (arg === ":p") {
                const method: 1 | 2 | 3 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("select_input_method"), [1, 2, 3], {
                    "1": [Sen.Script.Modules.System.Default.Localization.GetString("file"), Sen.Script.Modules.System.Default.Localization.GetString("file")],
                    "2": [Sen.Script.Modules.System.Default.Localization.GetString("directory"), Sen.Script.Modules.System.Default.Localization.GetString("directory")],
                    "3": [Sen.Script.Modules.System.Default.Localization.GetString("multiple_files"), Sen.Script.Modules.System.Default.Localization.GetString("multiple_files")],
                }) as 1 | 2 | 3;
                m_case: switch (method) {
                    case 1: {
                        do {
                            arg = Sen.Shell.Console.OpenFileDialog("Sen", []);
                        } while (arg === null || arg === ``);
                        Sen.Script.Modules.Interface.Arguments.ObtainArgument(arg);
                        break m_case;
                    }
                    case 2: {
                        do {
                            arg = Sen.Shell.Console.OpenDirectoryDialog("Sen");
                        } while (arg === null || arg === ``);
                        Sen.Script.Modules.Interface.Arguments.ObtainArgument(arg);
                        break m_case;
                    }
                    case 3: {
                        do {
                            argument.push(
                                ...Sen.Shell.Console.OpenMultipleFileDialog("Sen", []).map((e: string) => ({
                                    argument: Sen.Shell.Path.Resolve(e),
                                    method: null,
                                }))
                            );
                        } while (argument.length === 0);
                        Sen.Script.Modules.Interface.Arguments.ObtainArgument(arg);
                        return;
                    }
                }
            }
            if (arg.endsWith(" ")) {
                arg = arg.slice(0, -1);
            }
            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                arg = arg.slice(1, -1);
            }
            if (Sen.Shell.FileSystem.FileExists(arg) || Sen.Shell.FileSystem.DirectoryExists(arg)) {
                argument.push({
                    argument: Sen.Shell.Path.Resolve(arg),
                    method: null,
                });
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(/\{\}/g, arg)}`);
            }
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_size").replace(/\{\}/g, `${argument.length}`)}`);
            arg = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        if (argument.length === 0) {
            wrapper.has_argument = false;
        }
        return;
    }

    export const debug_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}`, `Debug`));

    /**
     *
     * @returns Create debug directory if not exists
     */

    export function CreateDebugDirectory(): void {
        if (!Sen.Shell.FileSystem.DirectoryExists(debug_directory)) {
            Sen.Shell.FileSystem.CreateDirectory(debug_directory);
        }
        return;
    }

    /**
     *
     * @param argument - Provide argument
     * @returns If contains, return true
     */

    export function CheckForJsonAndPng(argument: Array<string>): boolean {
        const jsonRegex: RegExp = /\.json$/i;
        const pngRegex: RegExp = /\.png$/i;
        let hasJson: boolean = false;
        let hasPng: boolean = false;

        for (const filePath of argument) {
            if (jsonRegex.test(filePath)) {
                hasJson = true;
            } else if (pngRegex.test(filePath)) {
                hasPng = true;
            }

            if (hasJson && hasPng) {
                return true;
            }
        }

        return false;
    }
}
