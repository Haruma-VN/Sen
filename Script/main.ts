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
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/localization.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/conversion.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/official.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/split.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/pack.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/resize.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/animation/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/animation/helper.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/argument/input.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/rsg/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/rsb/unpack.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/rsb/pack.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/rsb/convert/resource.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/rton/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/wwise/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/interface/assert.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/interface/arguments.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/interface/execute.js`),
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
                JavaScriptEngine.Execute(Fs.ReadText(script, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), script);
            } catch (error) {
                Console.Print(null, error);
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
        if (ShellUpdate.HasAdmin()) {
            const available: Array<number> = new Array();
            11;
            const assets = ShellUpdate.SendGetRequest(`https://api.github.com/repos/Haruma-VN/Sen/releases/tags/shell`, "Sen").assets;
            Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Please select one Shell below to download`);
            for (let i: number = 0; i < assets.length; ++i) {
                available.push(i + 1);
                Console.Printf(null, `      ${i + 1}. ${assets[i].name}`);
            }
            let input: string = Console.Input(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            while (!available.includes(parseInt(input))) {
                Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Does not included in the list`);
                input = Console.Input(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            }
            ShellUpdate.DownloadShell(MainScriptDirectory, `https://api.github.com/repos/Haruma-VN/Sen/releases/tags/shell`, parseInt(input) - 1, `shell_new`);
        } else {
            Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: You need to run as adminstrator to download new update`);
            throw new Error("Cannot download update");
        }
        return;
    }

    /**
     * Test shell
     */

    export function TestShell(): void {
        if (DotNetPlatform.CurrentUserPlatform() === "windows") {
            if (!Fs.FileExists(`${Path.Resolve(`${Path.Dirname(MainScriptDirectory)}/Sen.exe`)}`)) {
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
        if (DotNetPlatform.SenShell === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)) {
            DotNetPlatform.SupportUtf8Console();
        }
        Console.Print(null, `Sen ~ 1.0.0 ~ ${DotNetPlatform.ShellHost()} ~ ${DotNetPlatform.CurrentUserPlatform()}`);
        if (ShellVersion.ScriptRequirement > Sen.Script.ScriptVersion) {
            Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Script outdated, please delete the current script folder and let the tool redownload`);
            Sen.Script.Modules.Platform.Constraints.ExitProgram();
            return;
        }
        if (Sen.Script.ShellRequirement > ShellVersion.ShellVersion) {
            Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Shell outdated, please update the shell to continue`);
            Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Download link:`);
            Console.Printf(null, `      https://github.com/Haruma-VN/Sen/releases/tag/shell`);
            Sen.Script.Modules.Platform.Constraints.ExitProgram();
            return;
        }
        Sen.Script.TestShell();
        const time_start: number = Date.now();
        Sen.Script.LoadModules(Sen.Script.ScriptModules);
        const time_end: number = Date.now();
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("all_modules_have_been_loaded")));
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, 3)));
        const Sen_module_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        try {
            Sen.Script.Modules.Interface.Assert.Evaluate(argument);
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
        }
        const Sen_module_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, ""));
        Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("all_commands_executed")}`);
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(Sen_module_time_start, Sen_module_time_end, 3)));
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
    }
}

Sen.Script.Main(args);
