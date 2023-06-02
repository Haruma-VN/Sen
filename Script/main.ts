namespace Runtime.Script {
    /**
     * @package Script loaded to the Runtime
     */
    export const ScriptModules: Array<string> = [
        ...new Set([
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/compression.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/crypto.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/timer.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/json.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/javascript.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/third/maxrects-packer/maxrects-packer.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/third/cross-path-sort/index.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/platform.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/exception.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/localization.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/test.js`),
        ]),
    ];

    /**
     *
     * @param scripts - Pass scripts here
     * @returns
     */

    export function LoadModules(scripts: Array<string>): void {
        for (const script of scripts) {
            try {
                JavaScriptEngine.Execute(
                    Fs.ReadText(script, 0 as Runtime.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                    script,
                );
            } catch (error) {
                Console.Print(null, error);
            }
        }
        return;
    }

    /**
     *
     * @param argument - Pass arguments from .NET here
     */

    export async function Main(argument: string[]): Promise<void> {
        // Support UTF8 Console
        const time_start: number = Date.now();
        Runtime.Script.LoadModules(Runtime.Script.ScriptModules);
        const time_end: number = Date.now();
        if (DotNetPlatform.SenShell === Runtime.Script.Modules.Platform.Constraints.ShellType.Console) {
            DotNetPlatform.SupportUtf8Console();
        }
        Console.Print(
            Runtime.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Runtime.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /{\}/g,
                Runtime.Script.Modules.System.Default.Localization.GetString("all_modules_have_been_loaded"),
            ),
        );
        Console.Print(
            Runtime.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Runtime.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Runtime.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, 3),
            ),
        );
        const g_module_time_start: number = Runtime.Script.Modules.System.Default.Timer.CurrentTime();
        try {
            Console.Print(
                Runtime.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                `Module loaded: Runtime.Test.CreateConversion(file_path, output_path)`,
            );
            // Runtime.Script.Test.ResourceConversion.CreateConversion("./src/RESOURCES.json", "./src/res.json");
            Runtime.Script.Test.SplitUnofficialResources.CreateConversion("./src/res.json", "./src/test_folder");
        } catch (error: unknown) {
            Runtime.Script.Modules.Exceptions.PrintError<Error, string>(error);
            // Console.Print(null, true);
        }
        const g_module_time_end: number = Runtime.Script.Modules.System.Default.Timer.CurrentTime();
        Console.Print(
            Runtime.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Runtime.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Runtime.Script.Modules.System.Default.Timer.CalculateTime(g_module_time_start, g_module_time_end, 3),
            ),
        );
        Runtime.Script.Modules.Platform.Constraints.ExitProgram();
    }
}

Runtime.Script.Main(args);
