namespace Sen.Script {
    /**
     * @package Script loaded to the Sen
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
            Path.Resolve(`${MainScriptDirectory}/modules/third/fast-sort/sort.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/platform.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/exception.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/localization.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/conversion.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/official.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/split.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`),
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
                    Fs.ReadText(script, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
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

    export function Main(argument: string[]): void {
        // Support UTF8 Console
        if (DotNetPlatform.SenShell === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)) {
            DotNetPlatform.SupportUtf8Console();
        }
        Console.Print(
            null,
            `Sen ~ 1.0.0 ~ ${
                DotNetPlatform.CurrentPlatform() === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)
                    ? "Console"
                    : "GUI"
            } ~ Windows`,
        );
        const time_start: number = Date.now();
        Sen.Script.LoadModules(Sen.Script.ScriptModules);
        const time_end: number = Date.now();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("all_modules_have_been_loaded"),
            ),
        );
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, 3),
            ),
        );
        const Sen_module_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        try {
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
        }
        const Sen_module_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Timer.CalculateTime(Sen_module_time_start, Sen_module_time_end, 3),
            ),
        );
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
    }
}

Sen.Script.Main(args);
