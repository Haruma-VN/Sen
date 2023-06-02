"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var FileSystem;
            (function (FileSystem) {
                var Constraints;
                (function (Constraints) {
                    /**
                     * @param -  Encoding for File Opening
                     */
                    let EncodingType;
                    (function (EncodingType) {
                        EncodingType[EncodingType["UTF8"] = 0] = "UTF8";
                        EncodingType[EncodingType["ASCII"] = 1] = "ASCII";
                        EncodingType[EncodingType["LATIN1"] = 2] = "LATIN1";
                        EncodingType[EncodingType["UNICODE"] = 3] = "UNICODE";
                    })(EncodingType = Constraints.EncodingType || (Constraints.EncodingType = {}));
                    /**
                     * @param - Read Directory option
                     */
                    let ReadDirectory;
                    (function (ReadDirectory) {
                        ReadDirectory[ReadDirectory["OnlyCurrentDirectory"] = 0] = "OnlyCurrentDirectory";
                        ReadDirectory[ReadDirectory["AllNestedDirectory"] = 1] = "AllNestedDirectory";
                    })(ReadDirectory = Constraints.ReadDirectory || (Constraints.ReadDirectory = {}));
                })(Constraints = FileSystem.Constraints || (FileSystem.Constraints = {}));
            })(FileSystem = Modules.FileSystem || (Modules.FileSystem = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
