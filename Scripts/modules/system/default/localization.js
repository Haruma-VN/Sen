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
                    var Localization;
                    (function (Localization) {
                        /**
                         *
                         * @param property - Provide property to get
                         * @returns String if exists, else return property
                         */
                        function GetString(property) {
                            return DotNetLocalization.Get(property, Path.Resolve(`${MainScriptDirectory}/modules/language`), "English");
                        }
                        Localization.GetString = GetString;
                        /**
                         *
                         * @param inputString - Pass the string like Test {1} {2} {3}
                         * @param replacements - Pass array ["test", "test", "t"]
                         * @returns Test test test t
                         */
                        function RegexReplace(inputString, replacements) {
                            return inputString.replace(/\{(\d+)\}/g, (match, index) => {
                                let replacementIndex = parseInt(index) - 1;
                                return replacements[replacementIndex] || match;
                            });
                        }
                        Localization.RegexReplace = RegexReplace;
                    })(Localization = Default.Localization || (Default.Localization = {}));
                })(Default = System.Default || (System.Default = {}));
            })(System = Modules.System || (Modules.System = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
