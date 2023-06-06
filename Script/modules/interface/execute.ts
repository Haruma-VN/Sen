namespace Sen.Script.Modules.Interface.Execute {
    /**
     *
     * @param argument - Pass argument
     */
    export function ExecuteArgument(argument: string | Array<string>): void {
        const available: Array<int> = new Array();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("all_functions_loaded"),
            ),
        );
        if (Array.isArray(argument)) {
        } else {
            Sen.Script.Modules.Interface.Assert.FunctionCollection.forEach((func: string) => {
                if (
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        argument,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude,
                    )
                ) {
                    Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`,
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            });
        }
        const func_name: function_name = Sen.Script.Modules.Interface.Execute.GetFunctionName(
            Sen.Script.Modules.Interface.Arguments.TestInput(available),
        );
        Sen.Script.Modules.Interface.Execute.Evaluate(func_name, argument);
    }

    /**
     *
     * @param option - Pass user input
     * @returns The function number name
     */

    export function GetFunctionName(option: int): function_name {
        let index: number = -1;
        for (let i: number = 0; i < Sen.Script.Modules.Interface.Assert.FunctionNumbers.length; ++i) {
            if (Sen.Script.Modules.Interface.Assert.FunctionNumbers[i] === option) {
                index = i;
                break;
            }
        }
        return Sen.Script.Modules.Interface.Assert.FunctionCollection[index] as function_name;
    }

    export type function_name = "js_evaluate" | "";

    export function Evaluate(
        function_name: Sen.Script.Modules.Interface.Execute.function_name,
        argument: string | string[],
    ): void {
        switch (function_name) {
            case "js_evaluate": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(argument);
                } else {
                    argument.forEach((arg) => Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(arg));
                }
                break;
            }
            default: {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    Sen.Script.Modules.System.Default.Localization.GetString("function_not_found").replace(
                        /\{\}/g,
                        function_name,
                    ),
                    Sen.Script.Modules.Interface.Assert.function_json_location,
                );
            }
        }
    }
}
