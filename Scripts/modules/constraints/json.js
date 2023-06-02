"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var JsonLibrary;
            (function (JsonLibrary) {
                var Constraints;
                (function (Constraints) {
                    /**
                     * @param -  Comment Handling method for Json Parse
                     */
                    let CommentHandling;
                    (function (CommentHandling) {
                        CommentHandling[CommentHandling["Disallow"] = 0] = "Disallow";
                        CommentHandling[CommentHandling["Skip"] = 1] = "Skip";
                        CommentHandling[CommentHandling["Allow"] = 2] = "Allow";
                    })(CommentHandling = Constraints.CommentHandling || (Constraints.CommentHandling = {}));
                })(Constraints = JsonLibrary.Constraints || (JsonLibrary.Constraints = {}));
            })(JsonLibrary = Modules.JsonLibrary || (Modules.JsonLibrary = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
