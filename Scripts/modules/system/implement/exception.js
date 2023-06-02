"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var Exceptions;
            (function (Exceptions) {
                /**
                 * If inheritance this, will override the instance of method
                 */
                class OverrideInheritence {
                    static [Symbol.hasInstance](instance) {
                        return false;
                    }
                }
                Exceptions.OverrideInheritence = OverrideInheritence;
                /**
                 * Implementing SenError for JS
                 */
                class SenError extends Error {
                    /**
                     * Out put file path to print
                     */
                    _file_path;
                    /**
                     *
                     * @param error - Provide the message here
                     * @param file_path - Provide file path is an exception to raise it
                     */
                    constructor(error, file_path) {
                        super(error);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("Sen_error");
                        this._file_path = Path.Resolve(file_path);
                    }
                    /**
                     * @returns Give you the current file path
                     */
                    get file_path() {
                        return this._file_path;
                    }
                    /**
                     * @param new_file_path - Provide new file path to override
                     */
                    set file_path(new_file_path) {
                        if (new_file_path !== null) {
                            this._file_path = Path.Resolve(new_file_path);
                        }
                    }
                }
                Exceptions.SenError = SenError;
                /**
                 * JS Evaluate Error
                 */
                class EvaluateError extends Error {
                    /**
                     * @param _script - Script that raise the error
                     */
                    _script;
                    /**
                     *
                     * @param error - Provide the message error
                     * @param script - Script that raise the error
                     */
                    constructor(error, script) {
                        super(error);
                        this._script = Path.Resolve(script);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("evaluate_error");
                    }
                    /**
                     * @returns Give you the current script error
                     */
                    get script() {
                        return this._script;
                    }
                    /**
                     * @param new_script - Provide new script to override
                     */
                    set file_path(new_script) {
                        if (new_script !== null) {
                            this._script = new_script;
                        }
                    }
                }
                Exceptions.EvaluateError = EvaluateError;
                /**
                 * JS Missing file requirement implement Sen
                 */
                class MissingFileRequirement extends SenError {
                    /**
                     *
                     * @param error - Provide error message
                     * @param file_path - Provide file missing
                     */
                    constructor(error, file_path) {
                        super(error, file_path);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_files_requirement");
                    }
                }
                Exceptions.MissingFileRequirement = MissingFileRequirement;
                /**
                 * JS Implement error for unknown Module
                 */
                class ModuleNotFound extends Error {
                    /**
                     * @param _module - The missing module
                     */
                    _module;
                    /**
                     *
                     * @param error - Provide the error message
                     * @param module - Provide the missing module
                     */
                    constructor(error, module) {
                        super(error);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("module_not_found");
                        this._module = module;
                    }
                    /**
                     * @returns The missing module
                     */
                    get module() {
                        return this._module;
                    }
                    /**
                     * @param new_module - Provide the new module
                     */
                    set module(new_module) {
                        this._module = new_module;
                    }
                }
                Exceptions.ModuleNotFound = ModuleNotFound;
                /**
                 * Missing Property Implement error of JS
                 */
                class MissingProperty extends Error {
                    /**
                     * @param _property - Property value
                     * @param _file_path - File that raise the exception
                     */
                    _property;
                    _file_path;
                    /**
                     *
                     * @param error - Pass error message
                     * @param property - Pass error property
                     * @param file_path - Pass error file path
                     */
                    constructor(error, property, file_path) {
                        super(error);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_property");
                        this._property = property;
                        this._file_path = Path.Resolve(file_path);
                    }
                    /**
                     * @returns The current property
                     */
                    get property() {
                        return this._property;
                    }
                    /**
                     * @void Replace the current property
                     */
                    set property(new_property) {
                        if (typeof new_property === "string" &&
                            new_property !== null &&
                            new_property !== undefined &&
                            new_property !== void 0) {
                            this._property = new_property;
                        }
                    }
                    /**
                     * @returns The current file path
                     */
                    get file_path() {
                        return this._file_path;
                    }
                    /**
                     * @void Replace the current file path
                     */
                    set file_path(new_file_path) {
                        if (typeof new_file_path === "string" &&
                            new_file_path !== null &&
                            new_file_path !== undefined &&
                            new_file_path !== void 0) {
                            this._file_path = new_file_path;
                        }
                    }
                }
                Exceptions.MissingProperty = MissingProperty;
                /**
                 * Implement property undefined
                 */
                class PropertyHasNotBeenDefined extends MissingProperty {
                    /**
                     *
                     * @param message - Error message
                     * @param property - Missing property
                     * @param file_path - From which file
                     */
                    constructor(message, property, file_path) {
                        super(message, property, file_path);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("property_is_not_defined");
                    }
                }
                Exceptions.PropertyHasNotBeenDefined = PropertyHasNotBeenDefined;
                /**
                 * Implement data type error, like expected float but received integer
                 */
                class WrongDataType extends MissingProperty {
                    _type_expected;
                    /**
                     *
                     * @param message - Error messasge
                     * @param property - Property error
                     * @param file_path - File path that raise the exception
                     * @param type_expected - Remember to implement this (expected_type example: boolean)
                     */
                    constructor(message, property, file_path, type_expected) {
                        super(message, property, file_path);
                        this.name = Sen.Script.Modules.System.Default.Localization.GetString("wrong_data_type");
                        this._type_expected = type_expected;
                    }
                    /**
                     * @returns the expected type
                     */
                    get type_expected() {
                        return this._type_expected;
                    }
                    /**
                     * @void Set the new type
                     */
                    set type_expected(new_type_expect) {
                        this._type_expected = new_type_expect;
                    }
                }
                Exceptions.WrongDataType = WrongDataType;
                class DimensionError extends Error {
                    _dimension_type_error;
                    _file_path;
                    constructor(message, file_path, dimension_type_error) {
                        super(message);
                        this.name = "wrong_dimension";
                        this._dimension_type_error = dimension_type_error;
                        this._file_path = Path.Resolve(file_path);
                    }
                    get dimension_type_error() {
                        return this._dimension_type_error;
                    }
                    set dimension_type_error(new_expected_dimension_type) {
                        this._dimension_type_error = new_expected_dimension_type;
                    }
                    get file_path() {
                        return this._file_path;
                    }
                    set file_path(new_file_location) {
                        this._file_path = new_file_location;
                    }
                }
                Exceptions.DimensionError = DimensionError;
                class MissingFile extends Error {
                    _file_path;
                    constructor(message, file_path) {
                        super(message);
                        this.name = "missing_file";
                        this._file_path = Path.Resolve(file_path);
                    }
                    get file_location() {
                        return this._file_path;
                    }
                    set file_location(new_file_location) {
                        this._file_path = new_file_location;
                    }
                }
                Exceptions.MissingFile = MissingFile;
                class MissingDirectory extends MissingFile {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "missing_directory";
                    }
                }
                Exceptions.MissingDirectory = MissingDirectory;
                class ResizeImageError extends Error {
                    _file_path;
                    _code;
                    constructor(message, file_path, code) {
                        super(message);
                        this.name = "resize_error";
                        this._file_path = Path.Resolve(file_path);
                        this._code = code;
                    }
                    get code() {
                        return this.code;
                    }
                    set code(new_code) {
                        this._code = new_code;
                    }
                }
                Exceptions.ResizeImageError = ResizeImageError;
                class UnknownFormat extends ResizeImageError {
                    _format;
                    constructor(message, file_path, code, format) {
                        super(message, file_path, code);
                        this.name = "unknown_format";
                        this._format = format;
                    }
                    get format() {
                        return this._format;
                    }
                    set format(new_format) {
                        this._format = new_format;
                    }
                }
                Exceptions.UnknownFormat = UnknownFormat;
                class JSONParseSyntaxError extends Error {
                    _file_path;
                    constructor(message, file_path) {
                        super(message);
                        this.name = "unknown_format";
                        this._file_path = Path.Resolve(file_path);
                    }
                    get file_path() {
                        return this._file_path;
                    }
                    set file_path(new_file_location) {
                        this._file_path = new_file_location;
                    }
                }
                Exceptions.JSONParseSyntaxError = JSONParseSyntaxError;
                class JSONParseTrailingCommasError extends JSONParseSyntaxError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "this_json_trailing_commas";
                    }
                }
                Exceptions.JSONParseTrailingCommasError = JSONParseTrailingCommasError;
                class JSONParseTypeError extends JSONParseSyntaxError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "this_json_has_type_error";
                    }
                }
                Exceptions.JSONParseTypeError = JSONParseTypeError;
                class JSONPatchOperationError extends Error {
                    _operation;
                    constructor(message, operation) {
                        super(message);
                        this.name = "this_json_has_type_error";
                        this._operation = operation;
                    }
                    get operation() {
                        return this._operation;
                    }
                    set operation(new_operation) {
                        this._operation = new_operation;
                    }
                }
                Exceptions.JSONPatchOperationError = JSONPatchOperationError;
                class WrongPropertyValue extends MissingProperty {
                    _additional_message = "";
                    constructor(error, property, file_path, additional_message) {
                        super(error, property, file_path);
                        this.name = "wrong_property_value";
                        if (additional_message !== null &&
                            additional_message !== undefined &&
                            additional_message !== void 0 &&
                            typeof additional_message === "string") {
                            this._additional_message = additional_message;
                        }
                    }
                    get additional_message() {
                        return this._additional_message;
                    }
                    set additional_message(new_msg) {
                        this._additional_message = new_msg;
                    }
                }
                Exceptions.WrongPropertyValue = WrongPropertyValue;
                class WrongFile extends MissingFile {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "wrong_file_type";
                    }
                }
                Exceptions.WrongFile = WrongFile;
                class BrokenFile extends WrongFile {
                    constructor(message, file_path, name) {
                        super(message, file_path);
                        this.name = name;
                    }
                }
                Exceptions.BrokenFile = BrokenFile;
                class InvalidRange extends Error {
                    _file_path;
                    constructor(message, file_path) {
                        super(message);
                        this.name = "invalid_range";
                        this._file_path = Path.Resolve(file_path);
                    }
                    get file_path() {
                        return this._file_path;
                    }
                    set file_path(file_location) {
                        this._file_path = file_location;
                    }
                }
                Exceptions.InvalidRange = InvalidRange;
                class DOMDocumentError extends InvalidRange {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "domdocument_error";
                    }
                }
                Exceptions.DOMDocumentError = DOMDocumentError;
                class ImageXMLError extends DOMDocumentError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "image_error";
                    }
                }
                Exceptions.ImageXMLError = ImageXMLError;
                class SpriteXMLError extends ImageXMLError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "sprite_error";
                    }
                }
                Exceptions.SpriteXMLError = SpriteXMLError;
                class ResourceDataTypeContainerStrictlyRequirement extends ImageXMLError {
                    constructor(message, file_path, name) {
                        super(message, file_path);
                        this.name = name;
                    }
                }
                Exceptions.ResourceDataTypeContainerStrictlyRequirement = ResourceDataTypeContainerStrictlyRequirement;
                class EncodingError extends ImageXMLError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "encoding_error";
                    }
                }
                Exceptions.EncodingError = EncodingError;
                class ReadPathFailed extends ImageXMLError {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "cannot_read_path";
                    }
                }
                Exceptions.ReadPathFailed = ReadPathFailed;
                class UnsupportedDataType extends ReadPathFailed {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "unsupported_data_type";
                    }
                }
                Exceptions.UnsupportedDataType = UnsupportedDataType;
                class UnsupportedFileType extends UnsupportedDataType {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "unsupported_file_type";
                    }
                }
                Exceptions.UnsupportedFileType = UnsupportedFileType;
                class CannotWriteFile extends MissingFile {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "cannot_write_file";
                    }
                }
                Exceptions.CannotWriteFile = CannotWriteFile;
                class CannotReadFileSystem extends MissingFile {
                    constructor(message, file_path, write_template) {
                        super(message, file_path);
                        switch (write_template) {
                            case "directory": {
                                this.name = "cannot_read_file".replace(/\{\}/g, "directory");
                                break;
                            }
                            case "file": {
                                this.name = "cannot_read_file".replace(/\{\}/g, "file");
                                break;
                            }
                            default: {
                                this.name = "cannot_read_file".replace(/\{\}/g, "file_or_directory");
                                break;
                            }
                        }
                    }
                }
                Exceptions.CannotReadFileSystem = CannotReadFileSystem;
                class ExtensionDoesNotMeetsRequirement extends MissingFile {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "cannot_read_file";
                    }
                }
                Exceptions.ExtensionDoesNotMeetsRequirement = ExtensionDoesNotMeetsRequirement;
                class JoinImageError extends MissingFile {
                    constructor(message, file_path) {
                        super(message, file_path);
                        this.name = "cannot_read_file";
                    }
                }
                Exceptions.JoinImageError = JoinImageError;
                function ExecutionExceptionType(exception_type) {
                    Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("exception_type")}${exception_type}`);
                    return;
                }
                Exceptions.ExecutionExceptionType = ExecutionExceptionType;
                function ExecutionLoadedFrom(file_location) {
                    Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("exception_path")}`);
                    Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `   ${file_location}`);
                    return;
                }
                Exceptions.ExecutionLoadedFrom = ExecutionLoadedFrom;
                function ExecutionError(message) {
                    Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_error").replace(/\{\}/g, `${message}`)}`);
                }
                Exceptions.ExecutionError = ExecutionError;
                function PrintError(error) {
                    switch (error.constructor) {
                        case Sen.Script.Modules.Exceptions.BrokenFile: {
                            const name = error.name;
                            const file_location = error.file_location;
                            const message = error.message;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.DOMDocumentError: {
                            const name = error.name;
                            const file_location = error.file_path;
                            const message = error.message;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.DimensionError: {
                            const name = error.name;
                            const file_location = error.file_path;
                            const message = error.message;
                            const property_error = error
                                .dimension_type_error;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.EncodingError: {
                            const name = error.name;
                            const file_location = error.file_path;
                            const message = error.message;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.EvaluateError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ImageXMLError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.WrongDataType: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            const expected_data_type = error.type_expected;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, `${Sen.Script.Modules.System.Default.Localization.GetString("expected_variable_type").replace(/\{\}/g, expected_data_type)}`)}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.MissingProperty: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            const property = error.property;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_property_is"} "${property}"`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            const property = error.property;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_property_is"} "${property}"`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.SenError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.SenError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.MissingFileRequirement: {
                            const name = error.name;
                            const message = error.message;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.MissingFile: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.WrongFile: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.BrokenFile: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.MissingDirectory: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.InvalidRange: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.DOMDocumentError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ImageXMLError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.SpriteXMLError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ResourceDataTypeContainerStrictlyRequirement: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ReadPathFailed: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ResizeImageError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.UnknownFormat: {
                            const name = error.name;
                            const message = error.message;
                            const format = error.format;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_unknown_format_is".replace(/\{\}/g, format)}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.JSONParseSyntaxError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.JSONParseTrailingCommasError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error
                                .file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.JSONPatchOperationError: {
                            const name = error.name;
                            const message = error.message;
                            const operation = error.operation;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_the_operation_is".replace(/\{\}/g, operation)}`);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.WrongPropertyValue: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            const additional_message = error
                                .additional_message;
                            const property = error.property;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_the_wrong_property_is".replace(/\{\}/g, property)}`);
                            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_reminder")}${additional_message}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ModuleNotFound: {
                            const name = error.name;
                            const message = error.message;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.UnsupportedDataType: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.UnsupportedFileType: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_path;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.CannotWriteFile: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.CannotReadFileSystem: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.ExtensionDoesNotMeetsRequirement: {
                            const name = error.name;
                            const message = error
                                .message;
                            const location = error
                                .file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        case Sen.Script.Modules.Exceptions.JoinImageError: {
                            const name = error.name;
                            const message = error.message;
                            const location = error.file_location;
                            Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                            Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                            Sen.Script.Modules.Exceptions.ExecutionError(message);
                            break;
                        }
                        default: {
                            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, error.message)}`);
                        }
                    }
                    Console.Printf(null, error.stack !== null &&
                        error.stack !== undefined &&
                        error.stack !== void 0 &&
                        "stack" in error
                        ? error.stack?.replace(/(\s)at(\s)/g, DotNetPlatform.IsUTF8Support() ? " ▶ " : " > ")
                        : error.stackTrace
                            ?.replace(/\n\s*--- End of stack trace from previous location ---[\s\S]*$/, "")
                            ?.replace(/(\s)at(\s)/g, DotNetPlatform.IsUTF8Support() ? " ▶ " : " > "));
                }
                Exceptions.PrintError = PrintError;
            })(Exceptions = Modules.Exceptions || (Modules.Exceptions = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
