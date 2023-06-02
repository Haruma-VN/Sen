"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var FileSystem;
            (function (FileSystem) {
                var Implement;
                (function (Implement) {
                    var JsonLibrary;
                    (function (JsonLibrary) {
                        /**
                         *
                         * @param jsonText Provide serialized JSON text as string
                         * @returns Deserialized JSON can be used by the tool
                         */
                        function ParseJson(jsonText) {
                            return JSON.parse(jsonText);
                        }
                        JsonLibrary.ParseJson = ParseJson;
                        /**
                         *
                         * @param serializedJson - Provide serialized JSON Data
                         * @param indent - Indent, can be skipped
                         * @returns Stringify JSON as string
                         */
                        function StringifyJson(serializedJson, indent = "\t") {
                            return JSON.stringify(serializedJson, null, indent);
                        }
                        JsonLibrary.StringifyJson = StringifyJson;
                        /**
                         *
                         * @param obj - Provide JSON Obj
                         * @param path - Provide path as Array of str
                         * @returns Get current property
                         */
                        function get(obj, path) {
                            let current = obj;
                            for (const token of path) {
                                if (current === null || typeof current === "undefined") {
                                    return undefined;
                                }
                                current = current[token];
                            }
                            return current;
                        }
                        /**
                         *
                         * @param obj - Provide JSON Obj
                         * @param path - Provide path as Array of str
                         * @param value - Set property inside JSON Obj
                         */
                        function set(obj, path, value) {
                            let current = obj;
                            for (let i = 0; i < path.length - 1; i++) {
                                const token = path[i];
                                if (!(token in current)) {
                                    current[token] = {};
                                }
                                current = current[token];
                            }
                            current[path[path.length - 1]] = value;
                        }
                        /**
                         * @param obj - Provide JSON Obj
                         * @param path - Provide path as Array of str
                         * @returns
                         */
                        function remove(obj, path) {
                            let current = obj;
                            for (let i = 0; i < path.length - 1; i++) {
                                const token = path[i];
                                if (!(token in current)) {
                                    return;
                                }
                                current = current[token];
                            }
                            delete current[path[path.length - 1]];
                        }
                        /**
                         *
                         * @param obj - Provide JSON Obj
                         * @param patch - Provide operation
                         */
                        function applyPatch(obj, patch) {
                            switch (patch.op) {
                                case "add": {
                                    set(obj, patch.path, patch.value);
                                    break;
                                }
                                case "remove": {
                                    remove(obj, patch.path);
                                    break;
                                }
                                case "replace": {
                                    set(obj, patch.path, patch.value);
                                    break;
                                }
                                case "move": {
                                    const valueToMove = get(obj, patch.from);
                                    remove(obj, patch.from);
                                    set(obj, patch.path, valueToMove);
                                    break;
                                }
                                case "copy": {
                                    const valueToCopy = get(obj, patch.from);
                                    set(obj, patch.path, valueToCopy);
                                    break;
                                }
                                case "test": {
                                    const value = get(obj, patch.path);
                                    if (JSON.stringify(value) !== JSON.stringify(patch.value)) {
                                        throw new Error("test_operation_failed");
                                    }
                                    break;
                                }
                                default:
                                    throw new Error(`${"invalid_patch_op"}`);
                            }
                        }
                        /**
                         *
                         * @param obj - Provide Object
                         * @param patches - Provide patches operation
                         * @returns Finished patch
                         */
                        function ApplyPatch(obj, patches) {
                            for (const patch of patches) {
                                applyPatch(obj, patch);
                            }
                            return obj;
                        }
                        JsonLibrary.ApplyPatch = ApplyPatch;
                    })(JsonLibrary = Implement.JsonLibrary || (Implement.JsonLibrary = {}));
                })(Implement = FileSystem.Implement || (FileSystem.Implement = {}));
            })(FileSystem = Modules.FileSystem || (Modules.FileSystem = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
