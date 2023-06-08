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

    export type official_subgroup_json = {
        [x: string]: {
            is_composite: boolean;
            subgroups: {
                [x: string]: {
                    type: string | null;
                };
            };
        };
    };

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
            const subgroup_directory: string = Path.Resolve(`${output_directory}/subgroup`);
            Fs.CreateDirectory(subgroup_directory);
            const subgroup_json: official_subgroup_json = {};
            for (const resource of resources_json.groups) {
                if ("resources" in resource) {
                    resource.resources.forEach(
                        (element: { slot?: int }, index: number) => delete resource.resources[index].slot,
                    );
                }
                if ("resources" in resource && "parent" in resource) {
                    Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(
                        Path.Resolve(`${subgroup_directory}/${resource.id}.json`),
                        resource,
                    );
                }
                if ("subgroups" in resource || ("resources" in resource && !("parent" in resource))) {
                    if ("subgroups" in resource) {
                        subgroup_json[resource.id] = {
                            is_composite: true,
                            subgroups: {},
                        };
                        for (const sub of resource.subgroups) {
                            subgroup_json[resource.id].subgroups[sub.id] = {
                                type: (sub.res ??= null),
                            };
                        }
                    } else {
                        subgroup_json[resource.id] = {
                            is_composite: false,
                            subgroups: {
                                [resource.id]: {
                                    type: null,
                                },
                            },
                        };
                        Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(
                            Path.Resolve(`${subgroup_directory}/${resource.id}.json`),
                            resource,
                        );
                    }
                }
            }
            Sen.Script.Modules.FileSystem.Json.WriteJson<official_subgroup_json>(
                Path.Resolve(`${output_directory}/content.json`),
                subgroup_json,
            );
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
         * @param content_json - Pass content json
         * @param subgroup_dir - Pass subgroup directory path
         * @returns Checked
         */

        public static CheckDirectoryContainsSubgroups<T extends official_subgroup_json>(
            content_json: T,
            subgroup_dir: string,
        ): void {
            const contents: Array<string> = Object.keys(content_json);
            for (let i: number = 0; i < contents.length; ++i) {
                // checker
                if (!("is_composite" in content_json[contents[i]])) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                            /\{\}/g,
                            "is_composite",
                        )}`,
                        "is_composite",
                        contents[i],
                    );
                }
                if (typeof content_json[contents[i]].is_composite !== "boolean") {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(
                            Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                            [
                                `is_composite`,
                                `${contents[i]}`,
                                `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`,
                                `${typeof content_json[contents[i]].is_composite}`,
                            ],
                        ),
                        `is_composite`,
                        "undefined",
                        `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`,
                    );
                }
                if (!("subgroups" in content_json[contents[i]])) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                            /\{\}/g,
                            "subgroups",
                        )}`,
                        "subgroups",
                        contents[i],
                    );
                }
                // handle
                const subgroups: Array<string> = Object.keys(content_json[contents[i]].subgroups);
                for (let j_index: number = 0; j_index < subgroups.length; ++j_index) {
                    const subgroup_path: string = Path.Resolve(`${subgroup_dir}/${subgroups[j_index]}.json`);
                    if (!Fs.FileExists(subgroup_path)) {
                        throw new Sen.Script.Modules.Exceptions.MissingFile(
                            Sen.Script.Modules.System.Default.Localization.GetString("no_such_file").replace(
                                /\{\}/g,
                                subgroup_path,
                            ),
                            subgroup_path,
                        );
                    }
                }
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
            const content_json_path: string = Path.Resolve(`${directory_path}/content.json`);
            if (!Fs.FileExists(content_json_path)) {
                throw new Sen.Script.Modules.Exceptions.MissingFile(
                    Sen.Script.Modules.System.Default.Localization.GetString("no_such_file").replace(
                        /\{\}/g,
                        content_json_path,
                    ),
                    content_json_path,
                );
            }
            const subgroup_json: official_subgroup_json =
                Sen.Script.Modules.FileSystem.Json.ReadJson<official_subgroup_json>(content_json_path);
            const subgroup_dir: string = Path.Resolve(`${directory_path}/subgroup`);
            this.CheckDirectoryContainsSubgroups<official_subgroup_json>(subgroup_json, subgroup_dir);
            const directory_files: Array<string> = Fs.ReadDirectory(
                subgroup_dir,
                Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory,
            );
            const resources_json: Generic_T = {
                version: 1,
                content_version: 1,
                slot_count: 0,
                groups: [],
            } as any;
            const parents: Array<string> = Object.keys(subgroup_json);
            for (const parent of parents) {
                const subgroups: Array<string> = Object.keys(subgroup_json[parent].subgroups);
                if (subgroup_json[parent].is_composite) {
                    const composite_object: {
                        id: string;
                        subgroups: { id: string; res?: string }[];
                        type: "composite";
                    } = {
                        id: parent,
                        type: "composite",
                        subgroups: [],
                    };
                    for (const subgroup of subgroups) {
                        composite_object.subgroups.push(
                            subgroup_json[parent].subgroups[subgroup].type !== null
                                ? {
                                      id: subgroup,
                                      res: subgroup_json[parent].subgroups[subgroup].type as string,
                                  }
                                : {
                                      id: subgroup,
                                  },
                        );
                    }
                    resources_json.groups.push(composite_object);
                }
                for (const subgroup of subgroups) {
                    const subgroup_json_path: string = Path.Resolve(`${subgroup_dir}/${subgroup}.json`);
                    const deserialized_subgroup: resource_atlas_and_sprites =
                        Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(
                            subgroup_json_path,
                        ) satisfies resource_atlas_and_sprites;
                    if (!("resources" in deserialized_subgroup)) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(
                            `${Sen.Script.Modules.System.Default.Localization.GetString(
                                "property_is_undefined",
                            ).replace(/\{\}/g, "resources")}`,
                            "resources",
                            subgroup_json_path,
                        );
                    }
                    deserialized_subgroup.resources.forEach((element) => {
                        element.slot = resources_json.slot_count;
                        resources_json.slot_count++;
                    });
                    resources_json.groups.push(deserialized_subgroup);
                }
            }
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
