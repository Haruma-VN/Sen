namespace Sen.Script.Modules.Support.Json.Generic {
    /**
     *
     * @param condition - If this is false, will throw error
     * @param message - Message will be thrown if error
     * @returns
     */

    export function Assert(condition: boolean, message: string, file_path?: string): void {
        if (!condition) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(message, file_path ?? "undefined");
        }
        return;
    }

    /**
     *
     * @param json - Deserialize JSON Object
     * @param property - Property to Query
     * @param message - Message
     * @returns
     */

    export function PropertyView(json: any, property: string, message: string, file_path?: string): void {
        Assert(json[property] !== null && json[property] !== undefined, message, file_path);
        return;
    }
}
