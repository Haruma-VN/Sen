namespace Sen.Script.Modules.FileSystem.Json {
    /**
     *
     * @param filePath Provide file path to read json
     * @returns Deserialized JSON can be used by the tool
     */

    export function ReadJson<Generic_T>(filePath: string): Generic_T {
        return Sen.Script.Modules.FileSystem.Implement.JsonLibrary.ParseJson<Generic_T>(
            Fs.ReadText(filePath, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
        );
    }

    /**
     *
     * @param output_path - Provide output path as string
     * @param serializedJson - Provide serialized JSON Data
     * @param indent - Indent, can be skipped
     * @returns Writted JSON
     */

    export function WriteJson<Generic_T>(
        output_path: string,
        serializedJson: Generic_T,
        indent: string | number = "\t",
    ): void {
        Fs.WriteText(
            output_path,
            Sen.Script.Modules.FileSystem.Implement.JsonLibrary.StringifyJson<Generic_T>(serializedJson, indent),
            Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8,
        );
        return;
    }
}
