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
            Path.Resolve(`${MainScriptDirectory}/modules/system/implement/filesystem.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/system/default/localization.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/conversion.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/resources/official.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/split.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/pack.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/atlas/resize.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`),
            Path.Resolve(`${MainScriptDirectory}/modules/support/popcap/pvz2/animation/encode.js`),
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
    export function HandleError(ex: Error | DotNetSystem.Exception): void {
        Sen.Script.Modules.System.Default.Exceptions.Handler.LoadModules(
            Sen.Script.Modules.System.Default.Exceptions.Handler.ScriptModules,
        );
        try {
            if ("stackTrace" in ex) {
                // .NET
                switch ((ex as DotNetSystem.RuntimeException).errorCode) {
                    case Sen.Script.Modules.Exceptions.StandardsException.RuntimeException: {
                        Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(
                            ((ex as DotNetSystem.RuntimeException).file_path ??= "undefined"),
                        );
                        throw new Sen.Script.Modules.Exceptions.RuntimeError(
                            ex as any,
                            ((ex as DotNetSystem.RuntimeException).file_path ??= "undefined"),
                        );
                    }
                    case Sen.Script.Modules.Exceptions.StandardsException.RTONException: {
                        Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(
                            ((ex as DotNetSystem.RuntimeException).file_path ??= "undefined"),
                        );
                        throw new Sen.Script.Modules.Exceptions.BrokenFile(
                            ex as any,
                            ((ex as DotNetSystem.RuntimeException).file_path ??= "undefined"),
                            `Broken RTON file`,
                        );
                    }
                }
            }
        } catch (error: unknown) {
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(ex);
        }
        Sen.Script.Modules.Platform.Constraints.ExitProgram();
        return;
    }
}

Sen.Script.Modules.System.Default.Exceptions.Handler.HandleError(DotNetExceptionArg as Error);
