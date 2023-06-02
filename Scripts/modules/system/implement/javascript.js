"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var System;
            (function (System) {
                var Implement;
                (function (Implement) {
                    var JavaScript;
                    (function (JavaScript) {
                        /**
                         *
                         * @param js_string_to_evaluate - Pass JS String to Evaluate
                         * @returns Finished evaluate
                         */
                        function Evaluate(js_string_to_evaluate, source) {
                            try {
                                JavaScriptEngine.Evaluate(js_string_to_evaluate, source);
                            }
                            catch (error) {
                                Console.Print(error.message);
                            }
                            return;
                        }
                        JavaScript.Evaluate = Evaluate;
                        /**
                         *
                         * @param js_path - Pass ".js" script to the tool
                         * @returns Finish evaluate
                         */
                        function JSEvaluate(js_path) {
                            try {
                                Sen.Script.Modules.System.Implement.JavaScript.Evaluate(Fs.ReadText(js_path, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), js_path);
                            }
                            catch (error) {
                                Console.Print(error.message);
                            }
                            return;
                        }
                        JavaScript.JSEvaluate = JSEvaluate;
                    })(JavaScript = Implement.JavaScript || (Implement.JavaScript = {}));
                })(Implement = System.Implement || (System.Implement = {}));
            })(System = Modules.System || (Modules.System = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
