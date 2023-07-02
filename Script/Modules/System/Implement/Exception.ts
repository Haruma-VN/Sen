namespace Sen.Script.Modules.Exceptions {
    /**
     * If inheritance this, will override the instance of method
     */
    export abstract class OverrideInheritence {
        public static [Symbol.hasInstance](instance: any): boolean {
            return false;
        }
    }

    /**
     * Exception from .NET
     */

    export enum StandardsException {
        RuntimeException,
        RTONException,
        RTONDecodeException,
        PAMException,
        PAMEncodeException,
        PAMDecodeException,
        ZlibException,
    }

    /**
     * Implementing RuntimeError for JS
     */

    export class RuntimeError extends Error {
        /**
         * Out put file path to print
         */
        protected _file_path: string;
        /**
         *
         * @param error - Provide the message here
         * @param file_path - Provide file path is an exception to raise it
         */
        public constructor(error: string, file_path: string) {
            super(error);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("runtime_error");
            this._file_path = Sen.Shell.Path.Resolve(file_path);
        }

        /**
         * @returns Give you the current file path
         */

        public get file_path(): string {
            return this._file_path;
        }

        /**
         * @param new_file_path - Provide new file path to override
         */

        public set file_path(new_file_path: string) {
            if (new_file_path !== null) {
                this._file_path = Sen.Shell.Path.Resolve(new_file_path);
            }
        }
    }

    /**
     * JS Evaluate Error
     */

    export class EvaluateError extends Error {
        /**
         * @param _script - Script that raise the error
         */
        protected _script: string;
        /**
         *
         * @param error - Provide the message error
         * @param script - Script that raise the error
         */
        public constructor(error: string, script: string) {
            super(error);
            this._script = Sen.Shell.Path.Resolve(script);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("evaluate_error");
        }

        /**
         * @returns Give you the current script error
         */

        public get script(): string {
            return this._script;
        }

        /**
         * @param new_script - Provide new script to override
         */

        public set file_path(new_script: string) {
            if (new_script !== null) {
                this._script = new_script;
            }
        }
    }

    /**
     * JS Missing file requirement implement Sen
     */

    export class MissingFileRequirement extends RuntimeError {
        /**
         *
         * @param error - Provide error message
         * @param file_path - Provide file missing
         */
        public constructor(error: string, file_path: string) {
            super(error, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_files_requirement");
        }
    }

    /**
     * JS Implement error for unknown Module
     */

    export class ModuleNotFound extends Error {
        /**
         * @param _module - The missing module
         */
        private _module: string;

        /**
         *
         * @param error - Provide the error message
         * @param module - Provide the missing module
         */

        public constructor(error: string, module: string) {
            super(error);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("module_not_found");
            this._module = module;
        }

        /**
         * @returns The missing module
         */

        public get module(): string {
            return this._module;
        }

        /**
         * @param new_module - Provide the new module
         */

        public set module(new_module: string) {
            this._module = new_module;
        }
    }

    /**
     * Missing Property Implement error of JS
     */

    export class MissingProperty extends Error {
        /**
         * @param _property - Property value
         * @param _file_path - File that raise the exception
         */
        protected _property: string;
        protected _file_path: string;

        /**
         *
         * @param error - Pass error message
         * @param property - Pass error property
         * @param file_path - Pass error file path
         */

        public constructor(error: string, property: string, file_path: string) {
            super(error);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_property");
            this._property = property;
            this._file_path = Sen.Shell.Path.Resolve(file_path);
        }

        /**
         * @returns The current property
         */

        public get property(): string {
            return this._property;
        }

        /**
         * @void Replace the current property
         */

        public set property(new_property: string) {
            if (typeof new_property === "string" && new_property !== null && new_property !== undefined && new_property !== void 0) {
                this._property = new_property;
            }
        }

        /**
         * @returns The current file path
         */

        public get file_path(): string {
            return this._file_path;
        }

        /**
         * @void Replace the current file path
         */

        public set file_path(new_file_path: string) {
            if (typeof new_file_path === "string" && new_file_path !== null && new_file_path !== undefined && new_file_path !== void 0) {
                this._file_path = new_file_path;
            }
        }
    }

    /**
     * Implement property undefined
     */

    export class PropertyHasNotBeenDefined extends MissingProperty {
        /**
         *
         * @param message - Error message
         * @param property - Missing property
         * @param file_path - From which file
         */
        public constructor(message: string, property: string, file_path: string) {
            super(message, property, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("property_is_not_defined");
        }
    }

    /**
     * Implement data type error, like expected float but received integer
     */

    export class WrongDataType extends MissingProperty {
        private _type_expected: string;
        /**
         *
         * @param message - Error messasge
         * @param property - Property error
         * @param file_path - File path that raise the exception
         * @param type_expected - Remember to implement this (expected_type example: boolean)
         */
        public constructor(message: string, property: string, file_path: string, type_expected: string) {
            super(message, property, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("wrong_data_type");
            this._type_expected = type_expected;
        }

        /**
         * @returns the expected type
         */

        public get type_expected(): string {
            return this._type_expected;
        }

        /**
         * @void Set the new type
         */
        public set type_expected(new_type_expect: string) {
            this._type_expected = new_type_expect;
        }
    }

    export class DimensionError extends Error {
        protected _dimension_type_error: "width" | "height";
        protected _file_path: string;
        private _additional_message: string | null = null;
        public constructor(message: string, file_path: string, dimension_type_error: "width" | "height", additional_message?: string) {
            super(message);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("wrong_dimension");
            this._dimension_type_error = dimension_type_error;
            this._file_path = Sen.Shell.Path.Resolve(file_path);
            if (additional_message) {
                this._additional_message = additional_message;
            }
        }
        public get dimension_type_error(): "width" | "height" {
            return this._dimension_type_error;
        }
        public set dimension_type_error(new_expected_dimension_type: "width" | "height") {
            this._dimension_type_error = new_expected_dimension_type;
        }
        public get file_path(): string {
            return this._file_path;
        }
        public set file_path(new_file_location: string | null) {
            if (new_file_location) {
                this._file_path = new_file_location;
            }
        }
        public get additional_message(): any {
            if (this._additional_message) {
                return this._additional_message;
            }
            return null;
        }
        public set additional_message(new_file_location: string) {
            this._additional_message = new_file_location;
        }
    }

    export class MissingFile extends Error {
        protected _file_path: string;
        public constructor(message: string, file_path: string) {
            super(message);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_file");
            this._file_path = Sen.Shell.Path.Resolve(file_path);
        }

        public get file_location(): string {
            return this._file_path;
        }

        public set file_location(new_file_location: string) {
            this._file_path = new_file_location;
        }
    }

    export class MissingDirectory extends MissingFile {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("missing_directory");
        }
    }

    export class ResizeImageError extends Error {
        protected _file_path: string;
        protected _code: string;

        public constructor(message: string, file_path: string, code: string) {
            super(message);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("resize_error");
            this._file_path = Sen.Shell.Path.Resolve(file_path);
            this._code = code;
        }

        public get code(): string {
            return this.code;
        }

        public set code(new_code: string) {
            this._code = new_code;
        }
    }

    export class UnknownFormat<T> extends ResizeImageError {
        private _format: T;
        public constructor(message: string, file_path: string, code: string, format: T) {
            super(message, file_path, code);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("unknown_format");
            this._format = format;
        }
        public get format(): T {
            return this._format;
        }

        public set format(new_format: T) {
            this._format = new_format;
        }
    }

    export class JSONParseSyntaxError extends Error {
        protected _file_path: string;
        public constructor(message: string, file_path: string) {
            super(message);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("unknown_format");
            this._file_path = Sen.Shell.Path.Resolve(file_path);
        }
        public get file_path(): string {
            return this._file_path;
        }

        public set file_path(new_file_location: string) {
            this._file_path = new_file_location;
        }
    }

    export class JSONParseTrailingCommasError extends JSONParseSyntaxError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "this_json_trailing_commas";
        }
    }

    export class JSONParseTypeError extends JSONParseSyntaxError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "this_json_has_type_error";
        }
    }

    export class JSONPatchOperationError extends Error {
        protected _operation: string;
        public constructor(message: string, operation: string) {
            super(message);
            this.name = "this_json_has_type_error";
            this._operation = operation;
        }

        public get operation(): string {
            return this._operation;
        }

        public set operation(new_operation: string) {
            this._operation = new_operation;
        }
    }

    export class WrongPropertyValue extends MissingProperty {
        protected _additional_message: string = "";
        public constructor(error: string, property: string, file_path: string, additional_message?: string) {
            super(error, property, file_path);
            this.name = "wrong_property_value";
            if (additional_message !== null && additional_message !== undefined && additional_message !== void 0 && typeof additional_message === "string") {
                this._additional_message = additional_message;
            }
        }
        public get additional_message(): string {
            return this._additional_message;
        }
        public set additional_message(new_msg: string) {
            this._additional_message = new_msg;
        }
    }

    export class WrongFile extends MissingFile {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "wrong_file_type";
        }
    }

    export class BrokenFile extends WrongFile {
        public constructor(message: string, file_path: string, name: string) {
            super(message, file_path);
            this.name = name;
        }
    }

    export class InvalidRange extends Error {
        protected _file_path: string;
        public constructor(message: string, file_path: string) {
            super(message);
            1;
            this.name = "invalid_range";
            this._file_path = Sen.Shell.Path.Resolve(file_path);
        }
        public get file_path(): string {
            return this._file_path;
        }
        public set file_path(file_location: string) {
            this._file_path = file_location;
        }
    }

    export class DOMDocumentError extends InvalidRange {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "domdocument_error";
        }
    }

    export class ImageXMLError extends DOMDocumentError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "image_error";
        }
    }

    export class SpriteXMLError extends ImageXMLError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "sprite_error";
        }
    }

    export class ResourceDataTypeContainerStrictlyRequirement extends ImageXMLError {
        public constructor(message: string, file_path: string, name: string) {
            super(message, file_path);
            this.name = name;
        }
    }

    export class EncodingError extends ImageXMLError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "encoding_error";
        }
    }

    export class ReadPathFailed extends ImageXMLError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "cannot_read_path";
        }
    }

    export class UnsupportedDataType extends ReadPathFailed {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "unsupported_data_type";
        }
    }

    export class UnsupportedFileType extends UnsupportedDataType {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "unsupported_file_type";
        }
    }

    export class CannotWriteFile extends MissingFile {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("cannot_write_file");
        }
    }

    export class CannotReadFileSystem extends MissingFile {
        public constructor(message: string, file_path: string, write_template: "directory" | "file" | "unknown") {
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

    export class ExtensionDoesNotMeetsRequirement extends MissingFile {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "cannot_read_file";
        }
    }

    export class JoinImageError extends MissingFile {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = "cannot_read_file";
        }
    }

    export class AlreadyExists extends JoinImageError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("already_exists");
        }
    }

    /**
     *
     * @param exception_type - Pass exception type
     * @returns Execution load type
     */

    export function ExecutionExceptionType(exception_type: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("exception_type")}${exception_type}`);
        return;
    }

    export class WrongListSize extends JoinImageError {
        public constructor(message: string, file_path: string) {
            super(message, file_path);
            this.name = Sen.Script.Modules.System.Default.Localization.GetString("invalid_size");
        }
    }

    /**
     *
     * @param file_location - Pass file path here
     * @returns Execution load print
     */

    export function ExecutionLoadedFrom(file_location: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("exception_path")}`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${file_location}`);
        return;
    }

    /**
     *
     * @param message - Pass message here
     * @returns Execution error
     */

    export function ExecutionError(message: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_error").replace(/\{\}/g, `${message}`)}`);
        return;
    }

    /**
     *
     * @param error - Print error test
     * @returns
     */

    export function PrintError<Generic_T extends Error, Generic_U extends string>(error: unknown): void {
        if ("stack" in (error as any)) {
            switch ((error as Generic_T).constructor) {
                case Sen.Script.Modules.Exceptions.BrokenFile: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).name;
                    const file_location: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).file_location;
                    const message: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.DOMDocumentError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).name;
                    const file_location: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).file_path;
                    const message: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.DimensionError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.DimensionError).name;
                    const file_location: string = (error as Sen.Script.Modules.Exceptions.DimensionError).file_path;
                    const message: string = (error as Sen.Script.Modules.Exceptions.DimensionError).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    if ((error as Sen.Script.Modules.Exceptions.DimensionError).additional_message) {
                        const property_error: string = (error as Sen.Script.Modules.Exceptions.DimensionError).dimension_type_error;
                        const additional_message: string = (error as Sen.Script.Modules.Exceptions.DimensionError).additional_message as string;
                        Sen.Script.Modules.Exceptions.ExecutionError(Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("property_is_oversized"), [`"${property_error}"`, `${additional_message}`]));
                    }
                    break;
                }
                case Sen.Script.Modules.Exceptions.EncodingError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.EncodingError).name;
                    const file_location: string = (error as Sen.Script.Modules.Exceptions.EncodingError).file_path;
                    const message: string = (error as Sen.Script.Modules.Exceptions.EncodingError).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(file_location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.EvaluateError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.EvaluateError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.EvaluateError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.EvaluateError).script;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ImageXMLError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.WrongDataType: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.WrongDataType).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.WrongDataType).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.WrongDataType).file_path;
                    const expected_data_type: string = (error as Sen.Script.Modules.Exceptions.WrongDataType).type_expected;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(name);
                    Sen.Shell.Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, `${Sen.Script.Modules.System.Default.Localization.GetString("expected_variable_type").replace(/\{\}/g, expected_data_type)}`)}`
                    );
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.MissingProperty: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.MissingProperty).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.MissingProperty).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.MissingProperty).file_path;
                    const property: string = (error as Sen.Script.Modules.Exceptions.MissingProperty).property;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_property_is"} "${property}"`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined).file_path;
                    const property: string = (error as Sen.Script.Modules.Exceptions.PropertyHasNotBeenDefined).property;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_property_is"} "${property}"`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.RuntimeError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.RuntimeError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.RuntimeError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.MissingFileRequirement: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.MissingFileRequirement).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.MissingFileRequirement).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.MissingFile: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.MissingFile).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.MissingFile).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.MissingFile).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.WrongFile: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.WrongFile).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.WrongFile).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.WrongFile).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.BrokenFile: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.BrokenFile).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.MissingDirectory: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.MissingDirectory).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.MissingDirectory).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.MissingDirectory).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.InvalidRange: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.InvalidRange).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.InvalidRange).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.InvalidRange).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.DOMDocumentError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.DOMDocumentError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ImageXMLError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.ImageXMLError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.SpriteXMLError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.SpriteXMLError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.SpriteXMLError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.SpriteXMLError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ResourceDataTypeContainerStrictlyRequirement: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ResourceDataTypeContainerStrictlyRequirement).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ResourceDataTypeContainerStrictlyRequirement).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.ResourceDataTypeContainerStrictlyRequirement).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ReadPathFailed: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ReadPathFailed).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ReadPathFailed).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.ReadPathFailed).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ResizeImageError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ResizeImageError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ResizeImageError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.MissingDirectory).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.UnknownFormat: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.UnknownFormat<Generic_U>).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.UnknownFormat<Generic_U>).message;
                    const format: Generic_U = (error as Sen.Script.Modules.Exceptions.UnknownFormat<Generic_U>).format;
                    const location: string = (error as Sen.Script.Modules.Exceptions.MissingDirectory).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_unknown_format_is".replace(/\{\}/g, format)}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.JSONParseSyntaxError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.JSONParseSyntaxError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.JSONParseSyntaxError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.JSONParseSyntaxError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.JSONParseTrailingCommasError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.JSONParseTrailingCommasError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.JSONParseTrailingCommasError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.JSONParseTrailingCommasError).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.JSONPatchOperationError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.JSONPatchOperationError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.JSONPatchOperationError).message;
                    const operation: string = (error as Sen.Script.Modules.Exceptions.JSONPatchOperationError).operation;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_the_operation_is".replace(/\{\}/g, operation)}`);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.WrongPropertyValue: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.WrongPropertyValue).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.WrongPropertyValue).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.WrongPropertyValue).file_path;
                    const additional_message: string = (error as Sen.Script.Modules.Exceptions.WrongPropertyValue).additional_message;
                    const property: string = (error as Sen.Script.Modules.Exceptions.WrongPropertyValue).property;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name} ${"and_the_wrong_property_is".replace(/\{\}/g, property)}`);
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_reminder")}${additional_message}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ModuleNotFound: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ModuleNotFound).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ModuleNotFound).message;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.UnsupportedDataType: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.UnsupportedDataType).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.UnsupportedDataType).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.UnsupportedDataType).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.UnsupportedFileType: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.UnsupportedFileType).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.UnsupportedFileType).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.UnsupportedFileType).file_path;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.CannotWriteFile: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.CannotWriteFile).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.CannotWriteFile).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.CannotWriteFile).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.CannotReadFileSystem: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.CannotReadFileSystem).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.CannotReadFileSystem).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.CannotReadFileSystem).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.ExtensionDoesNotMeetsRequirement: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.ExtensionDoesNotMeetsRequirement).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.ExtensionDoesNotMeetsRequirement).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.ExtensionDoesNotMeetsRequirement).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.JoinImageError: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.JoinImageError).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.JoinImageError).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.JoinImageError).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.AlreadyExists: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.AlreadyExists).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.AlreadyExists).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.AlreadyExists).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }
                case Sen.Script.Modules.Exceptions.WrongListSize: {
                    const name: string = (error as Sen.Script.Modules.Exceptions.WrongListSize).name;
                    const message: string = (error as Sen.Script.Modules.Exceptions.WrongListSize).message;
                    const location: string = (error as Sen.Script.Modules.Exceptions.WrongListSize).file_location;
                    Sen.Script.Modules.Exceptions.ExecutionExceptionType(`${name}`);
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(location);
                    Sen.Script.Modules.Exceptions.ExecutionError(message);
                    break;
                }

                default: {
                    Sen.Script.Modules.Exceptions.ExecutionLoadedFrom(((error as any).file_path ??= "undefined"));
                    (error as any).message = Sen.Script.Modules.System.Default.Localization.GetString((error as Sen.Shell.DotNetSystem.Exception).message);
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, (error as any).message)}`);
                    break;
                }
            }

            if (Sen.Script.Modules.System.Default.Localization.notification) {
                Sen.Shell.DotNetPlatform.SendNotification(Sen.Script.Modules.System.Default.Localization.GetString("execution_error").replace(/\{\}/g, (error as Error).message), `Sen`);
            }
            if ("stack" in (error as any)) {
                let firstLine = (error as any).stack.split("\n")[0];
                Sen.Script.Modules.Exceptions.CatchException(firstLine);
            }
            Sen.Shell.Console.Printf(
                null,
                (error as Error).stack !== null && (error as Error).stack !== undefined && (error as Error).stack !== void 0 && "stack" in (error as Error)
                    ? (error as Error).stack?.replace(/(\s)at(\s)/g, Sen.Shell.DotNetPlatform.IsUTF8Support() ? " ▶ " : " > ")
                    : (error as Sen.Shell.DotNetSystem.Exception).stackTrace?.replace(/\n\s*--- End of stack trace from previous location ---[\s\S]*$/, "")?.replace(/(\s)at(\s)/g, Sen.Shell.DotNetPlatform.IsUTF8Support() ? " ▶ " : " > ")
            );
            try {
                Sen.Script.Modules.FileSystem.Json.WriteJson<Generic_T>(
                    Sen.Shell.Path.Resolve(`${Sen.Script.Modules.Interface.Assert.debug_directory}/${Date.now()}.json`),
                    (error as Error).stack !== null && (error as Error).stack !== undefined && (error as Error).stack !== void 0 && "stack" in (error as Error)
                        ? error
                        : ({
                              message: (error as Sen.Shell.DotNetSystem.Exception).message,
                              stack: (error as Sen.Shell.DotNetSystem.Exception).stackTrace,
                          } as any)
                );
            } catch (error: any) {
                Sen.Shell.Console.Print(null, error.message);
            }
            return;
        }
    }

    /**
     *
     * @param text - Pass text
     * @param line - Pass line
     * @returns text at that line
     */

    export function GoToLine(text: string, line: int): string {
        const lines = text.split("\n");

        if (line >= 1 && line <= lines.length) {
            return lines[line - 1];
        }

        return "";
    }

    export function FormatError(stack: string): string {
        while (stack.startsWith(" ")) {
            stack = stack.slice(1);
        }
        return stack;
    }

    export function CatchException(errorString: string): void {
        const regexPattern: RegExp = /(.+)\s(.+):(\d+):(\d+)/;
        const match = errorString.match(regexPattern);

        if (match) {
            let stack: int = -1;
            match.forEach((f: string, index) => {
                stack = Sen.Shell.FileSystem.FileExists(f) ? index : stack;
            });
            if (stack !== -1) {
                const filePath: string = match[stack];
                const lineNumber: string = match[stack + 1];
                const columnNumber: string = match[stack + 2];

                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    Sen.Script.Modules.System.Default.Localization.GetString("exception_raise").replace(
                        /\{\}/g,
                        Sen.Script.Modules.Exceptions.FormatError(`${Sen.Script.Modules.Exceptions.GoToLine(Sen.Shell.FileSystem.ReadText(filePath, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), parseInt(lineNumber))}`)
                    )
                );
            }
        }

        return;
    }
}
