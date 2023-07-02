namespace Sen.Script {
    /**
     * @package Script loaded to the Sen
     */
    export const ScriptModules: Array<string> = [
        ...new Set([
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/constraints/compression.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/constraints/crypto.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/constraints/filesystem.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/default/timer.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/implement/json.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/implement/javascript.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/third/maxrects-packer/maxrects-packer.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/third/fast-sort/sort.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/constraints/platform.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/implement/exception.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/system/default/localization.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/resources/conversion.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/resources/official.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/atlas/split.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/atlas/pack.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/atlas/resize.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/animation/encode.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/animation/helper.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/argument/input.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/rsg/encode.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/rsb/unpack.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/rsb/pack.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/rsb/convert/resource.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/popcap/pvz2/rton/encode.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/support/wwise/encode.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/interface/assert.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/interface/arguments.js`),
            Sen.Shell.Path.Resolve(`${Sen.Shell.MainScriptDirectory}/modules/interface/execute.js`),
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
                Sen.Shell.JavaScriptCoreEngine.Execute(Sen.Shell.FileSystem.ReadText(script, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), script);
            } catch (error) {
                Sen.Shell.Console.Print(null, error);
            }
        }
        return;
    }

    /**
     * Current Script version
     */
    export const ScriptVersion: int = 0;

    /**
     * Requirement version for Shell
     */
    export const ShellRequirement: int = 0;

    /**
     *
     * @returns Update current Shell
     */

    export function ShellUpdateByAutomatically(): void {
        if (Sen.Shell.ShellUpdate.HasAdmin()) {
            const available: Array<number> = new Array();
            11;
            const assets = Sen.Shell.ShellUpdate.SendGetRequest(`https://api.github.com/repos/Haruma-VN/Sen/releases/tags/shell`, "Sen").assets;
            Sen.Shell.Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Please select one Shell below to download`);
            for (let i: number = 0; i < assets.length; ++i) {
                available.push(i + 1);
                Sen.Shell.Console.Printf(null, `      ${i + 1}. ${assets[i].name}`);
            }
            let input: string = Sen.Shell.Console.Input(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            while (!available.includes(parseInt(input))) {
                Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Does not included in the list`);
                input = Sen.Shell.Console.Input(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            }
            Sen.Shell.ShellUpdate.DownloadShell(Sen.Shell.MainScriptDirectory, `https://api.github.com/repos/Haruma-VN/Sen/releases/tags/shell`, parseInt(input) - 1, `shell_new`);
        } else {
            Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: You need to run as adminstrator to download new update`);
            throw new Error("Cannot download update");
        }
        return;
    }

    /**
     * Test shell
     */

    export function TestShell(): void {
        if (Sen.Shell.DotNetPlatform.CurrentUserPlatform() === "windows") {
            if (!Sen.Shell.FileSystem.FileExists(`${Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}/Sen.exe`)}`)) {
                throw new Error(`The Shell name must be "Sen.exe" on platform windows`);
            }
        }
    }

    /**
     *
     * @param argument - Pass arguments from .NET here
     */

    export function Main(argument: string[]): void {
        // Support UTF8 Console
        if (Sen.Shell.DotNetPlatform.SenShell === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)) {
            Sen.Shell.DotNetPlatform.SupportUtf8Console();
        }
        Sen.Shell.Console.Print(null, `Sen ~ 1.0.0 ~ ${Sen.Shell.DotNetPlatform.ShellHost()} ~ ${Sen.Shell.DotNetPlatform.CurrentUserPlatform()}`);
        if (Sen.Shell.ShellVersion.ScriptRequirement > Sen.Script.ScriptVersion) {
            Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Script outdated, please delete the current script folder and let the tool redownload`);
            Sen.Script.Modules.Platform.Constraints.ExitProgram();
            return;
        }
        if (Sen.Script.ShellRequirement > Sen.Shell.ShellVersion.ShellVersion) {
            Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Shell outdated, please update the shell to continue`);
            Sen.Shell.Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Download link:`);
            Sen.Shell.Console.Printf(null, `      https://github.com/Haruma-VN/Sen/releases/tag/shell`);
            Sen.Script.Modules.Platform.Constraints.ExitProgram();
            return;
        }
        Sen.Script.TestShell();
        const time_start: number = Date.now();
        Sen.Script.LoadModules(Sen.Script.ScriptModules);
        const time_end: number = Date.now();
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("all_modules_have_been_loaded")));
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, 3)));
        const Sen_module_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        try {
            Sen.Script.Modules.Interface.Assert.Evaluate(argument);
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
        }
        const Sen_module_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, ""));
        Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("all_commands_executed")}`);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(Sen_module_time_start, Sen_module_time_end, 3)));
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
    }
}

Sen.Script.Main(Sen.Shell.argument);
