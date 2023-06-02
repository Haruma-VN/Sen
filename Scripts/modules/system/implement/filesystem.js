"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var FileSystem;
            (function (FileSystem) {
                var Json;
                (function (Json) {
                    /**
                     *
                     * @param filePath Provide file path to read json
                     * @returns Deserialized JSON can be used by the tool
                     */
                    function ReadJson(filePath) {
                        return Sen.Script.Modules.FileSystem.Implement.JsonLibrary.ParseJson(Fs.ReadText(filePath, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8));
                    }
                    Json.ReadJson = ReadJson;
                    /**
                     *
                     * @param output_path - Provide output path as string
                     * @param serializedJson - Provide serialized JSON Data
                     * @param indent - Indent, can be skipped
                     * @returns Writted JSON
                     */
                    function WriteJson(output_path, serializedJson, indent = "\t") {
                        Fs.WriteText(output_path, Sen.Script.Modules.FileSystem.Implement.JsonLibrary.StringifyJson(serializedJson, indent), Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8);
                        return;
                    }
                    Json.WriteJson = WriteJson;
                })(Json = FileSystem.Json || (FileSystem.Json = {}));
            })(FileSystem = Modules.FileSystem || (Modules.FileSystem = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
