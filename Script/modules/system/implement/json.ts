namespace Sen.Script.Modules.FileSystem.Implement.JsonLibrary {
    /**
     *
     * @param jsonText Provide serialized JSON text as string
     * @returns Deserialized JSON can be used by the tool
     */

    export function ParseJson<Generic_T>(jsonText: string): Generic_T {
        return JSON.parse(jsonText) as Generic_T;
    }

    /**
     *
     * @param serializedJson - Provide serialized JSON Data
     * @param indent - Indent, can be skipped
     * @returns Stringify JSON as string
     */

    export function StringifyJson<Generic_T>(serializedJson: Generic_T, indent: string | number = "\t", addTrailingCommas: boolean): string {
        return addTrailingCommas
            ? Sen.Script.Modules.FileSystem.Implement.JsonLibrary.AddTrailingCommas(JSON.stringify(serializedJson, null, indent))
            : JSON.stringify(serializedJson, null, indent);
    }

    /**
     * @package JSON Patch Operation
     */

    export type PatchOperation =
        | { op: "add"; path: string[]; value: any }
        | { op: "remove"; path: string[] }
        | { op: "replace"; path: string[]; value: any }
        | { op: "move"; from: string[]; path: string[] }
        | { op: "copy"; from: string[]; path: string[] }
        | { op: "test"; path: string[]; value: any };

    /**
     *
     * @param obj - Provide JSON Obj
     * @param path - Provide path as Array of str
     * @returns Get current property
     */

    function get(obj: any, path: string[]): any {
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

    function set(obj: any, path: string[], value: any): void {
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

    function remove(obj: any, path: string[]): void {
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

    function applyPatch(obj: any, patch: PatchOperation): void {
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
                throw new Error(`${"invalid_patch_op"}`) as never;
        }
    }

    /**
     *
     * @param obj - Provide Object
     * @param patches - Provide patches operation
     * @returns Finished patch
     */

    export function ApplyPatch(obj: any, patches: PatchOperation[]) {
        for (const patch of patches) {
            applyPatch(obj, patch);
        }
        return obj;
    }

    /**
     *
     * @param content - Pass trailing commas content
     * @returns Strip all trailing commas
     */

    export function StripJsonTrailingCommas(content: string): string {
        return content.replace(/(?<=(true|false|null|["\d}\]])\s*)\s*,(?=\s*[}\]])/g, "");
    }

    /**
     * Interface
     */

    export interface InterfaceStripJsonWithComments {
        whitespace: boolean;
        trailingCommas: boolean;
    }

    // Source: https://www.npmjs.com/package/strip-json-comments?activeTab=code

    export function StripJsonComments(jsonString: string, { whitespace = true, trailingCommas = false } = {}): string {
        const singleComment = Symbol("singleComment");
        const multiComment = Symbol("multiComment");

        const stripWithoutWhitespace = () => "";
        const stripWithWhitespace = (string: string, start?: int, end?: int) => string.slice(start, end).replace(/\S/g, " ");

        const isEscaped = (jsonString: string, quotePosition: int) => {
            let index = quotePosition - 1;
            let backslashCount = 0;

            while (jsonString[index] === "\\") {
                index -= 1;
                backslashCount += 1;
            }

            return Boolean(backslashCount % 2);
        };
        if (typeof jsonString !== "string") {
            throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
        }

        const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;

        let isInsideString = false;
        let isInsideComment: boolean = false;
        let offset = 0;
        let buffer = "";
        let result = "";
        let commaIndex = -1;

        for (let index = 0; index < jsonString.length; index++) {
            const currentCharacter = jsonString[index];
            const nextCharacter = jsonString[index + 1];

            if (!isInsideComment && currentCharacter === '"') {
                // Enter or exit string
                const escaped = isEscaped(jsonString, index);
                if (!escaped) {
                    isInsideString = !isInsideString;
                }
            }

            if (isInsideString) {
                continue;
            }

            if (!isInsideComment && currentCharacter + nextCharacter === "//") {
                // Enter single-line comment
                buffer += jsonString.slice(offset, index);
                offset = index;
                (isInsideComment as any) = singleComment;
                index++;
            } else if ((isInsideComment as any) === singleComment && currentCharacter + nextCharacter === "\r\n") {
                // Exit single-line comment via \r\n
                index++;
                isInsideComment = false;
                buffer += strip(jsonString, offset, index);
                offset = index;
                continue;
            } else if ((isInsideComment as any) === singleComment && currentCharacter === "\n") {
                // Exit single-line comment via \n
                isInsideComment = false;
                buffer += strip(jsonString, offset, index);
                offset = index;
            } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
                // Enter multiline comment
                buffer += jsonString.slice(offset, index);
                offset = index;
                (isInsideComment as any) = multiComment;
                index++;
                continue;
            } else if ((isInsideComment as any) === multiComment && currentCharacter + nextCharacter === "*/") {
                // Exit multiline comment
                index++;
                isInsideComment = false;
                buffer += strip(jsonString, offset, index + 1);
                offset = index + 1;
                continue;
            } else if (trailingCommas && !isInsideComment) {
                if (commaIndex !== -1) {
                    if (currentCharacter === "}" || currentCharacter === "]") {
                        // Strip trailing comma
                        buffer += jsonString.slice(offset, index);
                        result += strip(buffer, 0, 1) + buffer.slice(1);
                        buffer = "";
                        offset = index;
                        commaIndex = -1;
                    } else if (currentCharacter !== " " && currentCharacter !== "\t" && currentCharacter !== "\r" && currentCharacter !== "\n") {
                        // Hit non-whitespace following a comma; comma is not trailing
                        buffer += jsonString.slice(offset, index);
                        offset = index;
                        commaIndex = -1;
                    }
                } else if (currentCharacter === ",") {
                    // Flush buffer prior to this point, and save new comma index
                    result += buffer + jsonString.slice(offset, index);
                    buffer = "";
                    offset = index;
                    commaIndex = index;
                }
            }
        }

        return result + buffer + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
    }

    /**
     *
     * @param jsonData - Pass JSON Data
     * @returns Trailing commas JSON
     */

    export function AddTrailingCommas(jsonData: string): string {
        const data: Array<string> = jsonData.split("\n");
        const lastLine: string | undefined = data.pop();
        const modifiedData: Array<string> = data.map((line: string) => {
            if (line.match(/^\s*[\[{]|[,{]\s*$/)) {
                return line;
            } else {
                const trimmedLine = line.trim();
                const lastChar = trimmedLine[trimmedLine.length - 1];
                if (lastChar === "," || lastChar === "{" || lastChar === "[") {
                    return line;
                } else {
                    return `${line},`;
                }
            }
        });
        if (lastLine && !lastLine.match(/^\s*[\]}]\s*$/)) {
            modifiedData.push(`${lastLine},`);
        } else if (lastLine) {
            modifiedData.push(lastLine);
        }
        let result: string = modifiedData.join("\n");
        result = result.replace(/({|\[)(\s*),(\s*)(}|])/g, "$1$2$4$5");
        return result;
    }
}
