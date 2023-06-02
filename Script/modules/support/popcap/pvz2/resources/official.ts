namespace Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official {
    /**
     * PopCap Resources Path enum
     */

    export enum PopCapResourcesPathType {
        array,
        string,
    }

    /**
     * Implementing base class
     */

    export class PopCapResources extends Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion
        .CheckOfficialResources {
        /**
         *
         * @param file_path - Pass resources.json file path here
         * @param output_directory - Pass output directory here
         * @returns Written to directory
         */

        public static SplitPopCapResources(file_path: string, output_directory: string): void {
            const resources_json: Resources_Group_Structure_Template =
                Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(file_path);
            this.CheckOfficial<Resources_Group_Structure_Template>(resources_json, file_path);
            Fs.CreateDirectory(output_directory);
            for (const resource of resources_json.groups) {
                Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(
                    Path.Resolve(`${output_directory}/${resource.id}.json`),
                    resource,
                );
            }
            return;
        }

        /**
         *
         * @param subgroup_json - Send subgroup json parsed here
         * @param file_path - Send file path here
         * @returns Check data finish
         */

        private static CheckPopCapSplittedJsonProperty(subgroup_json: any, file_path: string): void {
            if (!("id" in subgroup_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "id"),
                    `id`,
                    file_path,
                );
            }
            return;
        }

        /**
         *
         * @param directory_path - Send file path here
         * @param output_file - Send output file path here
         * @returns Merged file
         */

        public static MergePopCapResources<Generic_T extends Resources_Group_Structure_Template>(
            directory_path: string,
            output_file: string,
        ): void {
            const directory_files: Array<string> = Fs.ReadDirectory(
                directory_path,
                Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory,
            );
            const resources_json: Generic_T = {
                version: 1,
                content_version: 1,
                slot_count: 0,
                groups: [],
            } as any;
            for (const file of directory_files) {
                const subgroup_test: Resource_Structure_Template =
                    Sen.Script.Modules.FileSystem.Json.ReadJson<Resource_Structure_Template>(file);
                this.CheckPopCapSplittedJsonProperty(subgroup_test, file);
                resources_json.groups.push(subgroup_test);
            }
            resources_json.groups.forEach((subgroup: Resource_Structure_Template) => {
                if (`resources` in subgroup) {
                    subgroup.resources.forEach((subgroup_children) => {
                        subgroup_children.slot = resources_json.slot_count;
                        resources_json.slot_count++;
                    });
                }
            });
            Sen.Script.Modules.FileSystem.Json.WriteJson<Generic_T>(Path.Resolve(`${output_file}`), resources_json);
            return;
        }

        /**
         *
         * @param resource_json - Pass parsed resources json here
         * @returns "array" or string
         */
        private static CheckOfficialPathType<Template extends Resources_Group_Structure_Template>(
            resource_json: Template,
        ): Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType {
            for (let index: number = 0; index < resource_json.groups.length; ++index) {
                if ("resources" in resource_json.groups[index]) {
                    for (let j_index: number = 0; j_index < resource_json.groups[index].resources.length; ++j_index) {
                        if (
                            "path" in resource_json.groups[index].resources[j_index] &&
                            Array.isArray(resource_json.groups[index].resources[j_index].path)
                        ) {
                            return Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType
                                .array;
                        } else {
                            return Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType
                                .string;
                        }
                    }
                }
            }
            throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("path_is_invalid"));
        }

        /**
         *
         * @param resources_json - Pass resources.json parsed here
         * @param file_path - Pass file path here for exception thrown, if not pass the string will become "undefined"
         * @returns Path becomes \ like "images\popcap\test\haruma"
         */

        public static ConvertOfficialPathToString<Generic_T extends Resources_Group_Structure_Template>(
            resources_json: Generic_T,
            file_path?: string,
        ): Generic_T {
            this.CheckOfficial<Generic_T>(resources_json, (file_path ??= "undefined"));
            const check_resources_path: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType =
                this.CheckOfficialPathType<Generic_T>(resources_json);
            if (
                check_resources_path ===
                Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType.string
            ) {
                throw new Sen.Script.Modules.Exceptions.EvaluateError(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("already_being_type_of"),
                        [`"path"`, `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`],
                    ),
                    (file_path ??= "undefined"),
                );
            }
            resources_json.groups.forEach((subgroup: Resource_Structure_Template) => {
                if (`resources` in subgroup) {
                    subgroup.resources.forEach((subgroup_children) => {
                        subgroup_children.path = (subgroup_children.path as Array<string>).join("\\");
                    });
                }
            });
            return resources_json;
        }
        /**
         *
         * @param resources_json - Pass resources.json parsed here
         * @param file_path - Pass file path here for exception thrown, if not pass the string will become "undefined"
         * @returns Path becomes array like ["image", "test", "popcap", "haruma"]
         */

        public static ConvertOfficialPathToArray<Generic_T extends Resources_Group_Structure_Template>(
            resources_json: Generic_T,
            file_path?: string,
        ): Generic_T {
            this.CheckOfficial<Generic_T>(resources_json, (file_path ??= "undefined"));
            const check_resources_path: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType =
                this.CheckOfficialPathType<Generic_T>(resources_json);
            Console.Print(null, check_resources_path);
            if (
                check_resources_path ===
                Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType.array
            ) {
                throw new Sen.Script.Modules.Exceptions.EvaluateError(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("already_being_type_of"),
                        [`"path"`, `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`],
                    ),
                    (file_path ??= "undefined"),
                );
            }
            resources_json.groups.forEach((subgroup: Resource_Structure_Template) => {
                if (`resources` in subgroup) {
                    subgroup.resources.forEach((subgroup_children) => {
                        subgroup_children.path = (subgroup_children.path as string).split("\\");
                    });
                }
            });
            return resources_json;
        }
    }

    /**
     * Implemented class, only for write file
     */

    export class PopCapResourcesPathConversion extends Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official
        .PopCapResources {
        /**
         *
         * @param file_in - File input
         * @param file_out - File output
         * @returns The resources becomes path like "images\popcap\test\haruma"
         */

        public static ConvertResourcesOfficialPathToString(file_in: string, file_out: string): void {
            Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(
                file_out,
                this.ConvertOfficialPathToString<Resources_Group_Structure_Template>(
                    Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(file_in),
                    file_in,
                ),
            );
            return;
        }

        /**
         *
         * @param file_in - File input
         * @param file_out - File output
         * @returns The resources becomes path like Path becomes array like ["image", "test", "popcap", "haruma"]
         */

        public static ConvertResourcesOfficialPathToArray(file_in: string, file_out: string): void {
            Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(
                file_out,
                this.ConvertOfficialPathToArray<Resources_Group_Structure_Template>(
                    Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(file_in),
                    file_in,
                ),
            );
            return;
        }
    }
}
