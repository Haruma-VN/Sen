"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var System;
            (function (System) {
                var Default;
                (function (Default) {
                    var Exceptions;
                    (function (Exceptions) {
                        var Handler;
                        (function (Handler) {
                            /**
                             * @package Script loaded to the Sen
                             */
                            Handler.ScriptModules = [
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
                            function LoadModules(scripts) {
                                for (const script of scripts) {
                                    JavaScriptEngine.Execute(Fs.ReadText(script, 0), script);
                                }
                                return;
                            }
                            Handler.LoadModules = LoadModules;
                            /**
                             *
                             * @param argument - Pass arguments from .NET here
                             */
                            function HandleError(ex) {
                                Sen.Script.Modules.System.Default.Exceptions.Handler.LoadModules(Sen.Script.Modules.System.Default.Exceptions.Handler.ScriptModules);
                                Sen.Script.Modules.Exceptions.PrintError(ex);
                                Sen.Script.Modules.Platform.Constraints.ExitProgram();
                                return;
                            }
                            Handler.HandleError = HandleError;
                        })(Handler = Exceptions.Handler || (Exceptions.Handler = {}));
                    })(Exceptions = Default.Exceptions || (Default.Exceptions = {}));
                })(Default = System.Default || (System.Default = {}));
            })(System = Modules.System || (Modules.System = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
Sen.Script.Modules.System.Default.Exceptions.Handler.HandleError(DotNetExceptionArg);
