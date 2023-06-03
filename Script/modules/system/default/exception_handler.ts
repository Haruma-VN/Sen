namespace Sen.Script.Modules.System.Default.Exceptions.Handler {
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
            JavaScriptEngine.Execute(
                Fs.ReadText(script, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                script,
            );
        }
        return;
    }

    /**
     *
     * @param argument - Pass arguments from .NET here
     */
    export function HandleError(ex: Error): void {
        Sen.Script.Modules.System.Default.Exceptions.Handler.LoadModules(
            Sen.Script.Modules.System.Default.Exceptions.Handler.ScriptModules,
        );
        Sen.Script.Modules.Exceptions.PrintError(ex);
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
        return;
    }
}

Sen.Script.Modules.System.Default.Exceptions.Handler.HandleError(DotNetExceptionArg as Error);
