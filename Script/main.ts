namespace Sen.Script {
    /**
     * @package Script loaded to the Sen
     */
    export const ScriptModules: Array<string> = [
        ...new Set([
            `Modules/Constraints/Compression`,
            `Modules/Constraints/Crypto`,
            `Modules/Constraints/FileSystem`,
            `Modules/System/Implement/Json`,
            `Modules/System/Implement/JavaScript`,
            `Modules/Third/maxrects-packer/maxrects-packer`,
            `Modules/Third/fast-sort/sort`,
            `Modules/Constraints/Platform`,
            `Modules/System/Implement/Exception`,
            `Modules/System/Implement/FileSystem`,
            `Modules/System/Implement/XML`,
            `Modules/System/Implement/Number`,
            `Modules/System/Implement/ADBHelper`,
            `Modules/System/Default/Localization`,
            `Modules/System/Default/Timer`,
            `Modules/Support/PopCap/PvZ2/Resources/ResInfo`,
            `Modules/Support/PopCap/PvZ2/Resources/ResourceGroup`,
            `Modules/Support/PopCap/PvZ2/Atlas/Split`,
            `Modules/Support/PopCap/PvZ2/Atlas/Pack`,
            `Modules/Support/PopCap/PvZ2/Atlas/Resize`,
            `Modules/Support/PopCap/PvZ2/PTX/Encode`,
            `Modules/Support/PopCap/PvZ2/RTON/Encode`,
            `Modules/Support/PopCap/PvZ2/Animation/Encode`,
            `Modules/Support/PopCap/PvZ2/Animation/Helper`,
            `Modules/Support/PopCap/PvZ2/Animation/Render`,
            `Modules/Support/PopCap/PvZ2/Android/Remote`,
            `Modules/Support/PopCap/PvZ2/Arguments/Input`,
            `Modules/Support/PopCap/PvZ2/RSG/Pack`,
            `Modules/Support/PopCap/PvZ2/RSB/Unpack`,
            `Modules/Support/PopCap/PvZ2/RSB/Pack`,
            `Modules/Support/PopCap/PvZ2/Lawnstrings/Convert`,
            `Modules/Support/PopCap/PvZ2/RSB/Manifest`,
            `Modules/Support/PopCap/PvZ2/RSB/Convert/Resource`,
            `Modules/Support/WWise/Encode`,
            `Modules/Interface/Assert`,
            `Modules/Interface/Arguments`,
            `Modules/Interface/Execute`,
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
                Sen.Shell.JavaScriptCoreEngine.Evaluate(
                    Sen.Shell.FileSystem.ReadText(`${Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(Sen.Shell.MainScriptDirectory, script))}.js`, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                    Sen.Shell.Path.Join(`Scripts`, `${script}.js`).replaceAll(`/`, `\\`)
                );
            } catch (error: unknown) {
                Sen.Shell.Console.Print(null, error);
            }
        }
        return;
    }

    /**
     * Current Script version
     */
    export const ScriptVersion: int = 13 as const;

    /**
     * Requirement version for Shell
     */
    export const ShellRequirement: int = 8 as const;

    export const M_Version: string = `2.3.0` as const;

    /**
     *
     * @returns Update current Shell
     */

    export function ShellUpdateByAutomatically(): void {
        if (Sen.Shell.ShellUpdate.HasAdmin()) {
            const available: Array<number> = new Array();
            const assets = Sen.Shell.ShellUpdate.SendGetRequest(`https://api.github.com/repos/Haruma-VN/Sen/releases/tags/shell`, "Sen").assets;
            Sen.Shell.Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Please select one Shell below to download`);
            for (let i: int = 0; i < assets.length; ++i) {
                const k_index: int = i + 1;
                available.push(k_index);
                Sen.Shell.Console.Printf(14 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${k_index}. ${assets[i].name}`);
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
        if (Sen.Shell.DotNetPlatform.CurrentUserPlatform() === "Windows") {
            if (!Sen.Shell.FileSystem.FileExists(`${Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}/Sen.exe`)}`)) {
                throw new Error(`The Shell name must be "Sen.exe" on platform windows`);
            }
        }
    }

    /**
     * External Libraries
     */

    export function DownloadInternal(): void {
        switch (Sen.Shell.DotNetPlatform.CurrentUserPlatform()) {
            case "Windows": {
                const internal_path = `${Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}/Internal.dll`)}`;
                if (!Sen.Shell.FileSystem.FileExists(internal_path)) {
                    Sen.Shell.Console.Print(null, `Internal Not Found, redownload Internal from server`);
                    Sen.Shell.ShellUpdate.DownloadFromServer(`https://github.com/Haruma-VN/Sen/releases/download/internal/Internal.dll`, internal_path, "Sen");
                }
                break;
            }
            case "Linux": {
                const internal_path = `${Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(Sen.Shell.MainScriptDirectory)}/Internal.so`)}`;
                if (!Sen.Shell.FileSystem.FileExists(internal_path)) {
                    Sen.Shell.Console.Print(null, `Internal Not Found, redownload Internal from server`);
                    Sen.Shell.ShellUpdate.DownloadFromServer(`https://github.com/Haruma-VN/Sen/releases/download/internal/Internal.so`, internal_path, "Sen");
                }
                break;
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
        if (Sen.Shell.DotNetPlatform.SenShell === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)) {
            Sen.Shell.DotNetPlatform.SupportUtf8Console();
        }
        Sen.Script.DownloadInternal();
        Sen.Shell.Console.Print(
            14 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.White,
            `Sen ~ ${Sen.Script.M_Version} |  Shell ${
                Sen.Shell.ShellVersion.ShellVersion
            } & Script ${ScriptVersion} & Internal ${Sen.Internal.Version.InternalVersion()} | ${Sen.Shell.DotNetPlatform.ShellHost()} & ${Sen.Shell.DotNetPlatform.CurrentUserPlatform()} & ${Sen.Internal.Version.GetProcessorArchitecture()}`
        );
        if (Sen.Shell.ShellVersion.ScriptRequirement > Sen.Script.ScriptVersion) {
            Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Script outdated, please delete the current script folder and let the tool redownload`);
            Sen.Shell.Console.Print(11 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, "Press any keys to continue...");
            return;
        }
        if (Sen.Script.ShellRequirement > Sen.Shell.ShellVersion.ShellVersion) {
            Sen.Shell.Console.Print(13 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Shell outdated, please update the shell to continue`);
            Sen.Shell.Console.Print(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Download link:`);
            Sen.Shell.Console.Printf(14 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      https://github.com/Haruma-VN/Sen/releases/tag/shell`);
            Sen.Shell.Console.Print(11 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, "Press any keys to continue...");
            return;
        }
        Sen.Script.TestShell();
        const time_start: number = Date.now();
        Sen.Script.LoadModules(Sen.Script.ScriptModules);
        const time_end: number = Date.now();
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("all_modules_have_been_loaded"))
        );
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, 3))
        );
        const Sen_module_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        try {
            Sen.Script.Modules.Interface.Assert.Evaluate(argument);
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
        }
        const Sen_module_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, ""));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("all_commands_executed")}`);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("total_time_spent").replace(/\{\}/g, Sen.Script.Modules.System.Default.Timer.CalculateTime(Sen_module_time_start, Sen_module_time_end, 3))
        );
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
        return;
    }
}
Sen.Script.Main(Sen.Shell.argument);
