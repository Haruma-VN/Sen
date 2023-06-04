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

    /**
     *
     * @param filePath - Pass file path requires to filter here
     * @param filter - Pass filter option, if you want to filter extension pass ".json" for example for filtering only json
     * @param filter - Pass "main.js" for example for filtering whole file name
     * @param excludes - Pass exclude array, pass an empty array if you don't want to exclude anything
     * @returns True if match else False
     */

    export function FilterFilePath(filePath: string, filters: Array<string>, excludes: Array<string>): boolean {
        for (const filter of filters) {
            let isExcluded: boolean = false;
            for (const excluse of excludes) {
                if (filter === excluse) {
                    isExcluded = true;
                    break;
                }
            }

            if (isExcluded) {
                continue;
            }

            if (filter.startsWith(".")) {
                const extensionRegex: RegExp = new RegExp(`${filter}$`, `i`);
                const extensionMatch: RegExpMatchArray | null = filePath.match(extensionRegex);
                if (extensionMatch) {
                    return true;
                }
            } else {
                const fileNameRegex: RegExp = new RegExp(`${filter}$`, `i`);
                const fileNameMatch: RegExpMatchArray | null = filePath.match(fileNameRegex);
                if (fileNameMatch) {
                    return true;
                }
            }
        }
        return false;
    }
}
