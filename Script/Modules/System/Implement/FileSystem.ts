namespace Sen.Script.Modules.FileSystem {
    export class Json {
        /**
         *
         * @param filePath Provide file path to read json
         * @returns Deserialized JSON can be used by the tool
         */

        public static ReadJson<Generic_T>(filePath: string): Generic_T {
            return Sen.Script.Modules.FileSystem.Implement.JsonLibrary.ParseJson<Generic_T>(Sen.Shell.FileSystem.ReadText(filePath, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), true, filePath);
        }

        /**
         *
         * @param output_path - Provide output path as string
         * @param serializedJson - Provide serialized JSON Data
         * @param indent - Indent, can be skipped
         * @returns Writted JSON
         */

        public static WriteJson<Generic_T>(output_path: string, serializedJson: Generic_T, handle_bigint: boolean, indent: string | number = "\t"): void {
            Sen.Shell.FileSystem.OutFile(output_path, Sen.Script.Modules.FileSystem.Implement.JsonLibrary.StringifyJson<Generic_T>(serializedJson, handle_bigint, indent, Sen.Script.Modules.System.Default.Localization.use_trailing_commas));
            return;
        }
    }

    /**
     * filter file type
     */

    export type filter_file_type = "file" | "directory" | "unknown";

    /**
     *
     * @param filePath - Pass file path requires to filter here
     * @param filter - Pass filter option, if you want to filter extension pass ".json" for example for filtering only json
     * @param filter - Pass "main.js" for example for filtering whole file name
     * @param excludes - Pass exclude array, pass an empty array if you don't want to exclude anything
     * @param file_type - The file type
     * @returns True if match else False
     */

    export function FilterFilePath(filePath: string, filters: Array<string>, excludes: Array<string>, file_type: filter_file_type = "unknown"): boolean {
        switch (file_type) {
            case "directory": {
                if (!Sen.Shell.FileSystem.DirectoryExists(filePath)) {
                    return false;
                }
                break;
            }
            case "file": {
                if (!Sen.Shell.FileSystem.FileExists(filePath)) {
                    return false;
                }
                break;
            }
            case "unknown": {
                if (Sen.Shell.FileSystem.DirectoryExists(filePath) || Sen.Shell.FileSystem.FileExists(filePath)) {
                    break;
                }
            }
            default: {
                throw new Sen.Script.Modules.Exceptions.MissingFileRequirement(Sen.Script.Modules.System.Default.Localization.GetString("no_such_file_or_directory").replace(/\{\}/g, ""), filePath);
            }
        }
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
