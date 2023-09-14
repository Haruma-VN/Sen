namespace Sen.Script {
    /**
     * @package Script loaded to the Sen
     */
    export const ScriptModules: Array<string> = [
        ...new Set<string>([
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
            `Modules/System/Implement/ByteStream`,
            `Modules/System/Default/Localization`,
            `Modules/System/Default/Timer`,
            `Modules/Support/PopCap/PvZ/CryptData/Encrypt`,
            `Modules/Support/PopCap/PvZ/ReAnimation/Encode`,
            `Modules/Support/PopCap/PvZ/Particles/Encode`,
            `Modules/Support/PopCap/PvZ/ResourceManager/Convert`,
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
            `Modules/Interface/Batch`,
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
    export const ScriptVersion: int = 22 as const;

    /**
     * Requirement version for Shell
     */
    export const ShellRequirement: int = 15 as const;

    /**
     * Tool Version
     */

    export const M_Version: string = `3.0.1` as const;

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
     *
     * @param argument - Pass arguments from .NET here
     */

    export function Main(argument: string[]): void {
        // Support UTF8 Console
        if (Sen.Shell.DotNetPlatform.SenShell === (0 as Sen.Script.Modules.Platform.Constraints.ShellType.Console)) {
            Sen.Shell.DotNetPlatform.SupportUtf8Console();
        }
        Sen.Shell.Console.Print(
            14 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.White,
            `Sen ~ ${Sen.Script.M_Version} | Shell ${
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
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Timer.CalculateTime(time_start, time_end, Sen.Shell.Console.ObtainCurrentArchitectureDecimalSymbols(), 3)
            )
        );
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("this_translation_by"), Sen.Script.Modules.System.Default.Localization.GetString("language.author"));
        Sen.Script.Modules.System.Default.Localization.CountDown(10);
        const Sen_module_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        const wrapper: Sen.Script.Modules.Interface.Assert.Wrapper = { success: 0, fail: 0, has_argument: false };
        try {
            Sen.Script.Modules.Interface.Assert.Evaluate(argument, wrapper);
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
        }
        const Sen_module_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/{\}/g, ""));
        Sen.Shell.Console.Printf(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.White,
            `      ${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("command_executed_with"), [`${wrapper.success}`, `${wrapper.fail}`])}`
        );
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("total_time_spent").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Timer.CalculateTime(Sen_module_time_start, Sen_module_time_end, Sen.Shell.Console.ObtainCurrentArchitectureDecimalSymbols(), 3)
            )
        );
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
        return;
    }
}
