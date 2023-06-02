namespace Runtime.Script.Modules.System.Default.Exceptions.Handler {
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
                Fs.ReadText(script, 0 as Runtime.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
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
        Runtime.Script.Modules.System.Default.Exceptions.Handler.LoadModules(
            Runtime.Script.Modules.System.Default.Exceptions.Handler.ScriptModules,
        );
        Runtime.Script.Modules.Exceptions.PrintError(ex);
        Runtime.Script.Modules.Platform.Constraints.ExitProgram();
        return;
    }
}

Runtime.Script.Modules.System.Default.Exceptions.Handler.HandleError(DotNetExceptionArg as Error);
