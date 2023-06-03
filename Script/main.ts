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
            Path.Resolve(`${MainScriptDirectory}/modules/third/cross-path-sort/index.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/constraints/platform.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/exception.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/localization.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/conversion.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/official.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/split.js`),
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
            // // Sen.Script.Test.ResourceConversion.CreateConversion("./src/RESOURCES.json", "./src/res.json");
            // Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToString(
            //     "./Scripts/resources.beta.json",
            //     "./Scripts/resources.beta2.json",
            // );
            // const options: Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.IOption = {
            //     smart: true,
            //     pot: true,
            //     square: false,
            //     allowRotation: true,
            //     tag: false,
            //     border: 5,
            // }; // Set packing options
            // let packer = new Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.MaxRectsPacker(
            //     1024,
            //     1024,
            //     2,
            //     options,
            // ); // width, height, padding, options
            // let input = [
            //     // any object with width & height is OK since v2.1.0
            //     { width: 600, height: 20, name: "tree", foo: "bar" },
            //     { width: 600, height: 20, name: "flower" },
            //     { width: 2000, height: 2000, name: "oversized background" },
            //     { width: 1000, height: 1000, name: "background", color: 0x000000ff },
            //     { width: 1000, height: 1000, name: "overlay", allowRotation: true },
            // ];
            // packer.addArray(input as any); // Start packing with input array
            // // packer.next(); // Start a new packer bin
            // packer.bins.forEach((bin) => {
            //     Console.Print(null, JSON.stringify(bin.rects, null, "\t"));
            // });
            // DotNetBitmap.CompositeImages(
            //     [
            //         {
            //             x: 0,
            //             y: 0,
            //             file_path: "./Scripts/R.png",
            //             width: 485,
            //             height: 768,
            //         },
            //     ],
            //     "test.png",
            //     "./Scripts",
            //     1200,
            //     1200,
            // );
            // // Reuse packer
            // let bins = packer.save();
            // packer.load(bins);
            // packer.addArray(input as any);
            Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractAtlas.ExtractPvZ2AtlasOfficialStructure(
                [
                    "D:/Res/Tre's Temp File/ZombieSkycityZombossGroup_1536.json",
                    "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.png",
                    "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_01.png",
                ],
                "id",
            );
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
            // Console.Print(null, true);
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
