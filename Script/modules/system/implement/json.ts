namespace Runtime.Script.Modules.FileSystem.Implement.JsonLibrary {
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

    export function StringifyJson<Generic_T>(serializedJson: Generic_T, indent: string | number = "\t"): string {
        return JSON.stringify(serializedJson, null, indent);
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
}
