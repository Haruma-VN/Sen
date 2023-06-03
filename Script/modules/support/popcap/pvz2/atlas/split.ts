namespace Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split {
    /**
     * Atlas Implementing from JS
     */

    /**
     * Atlas Json interface
     */

    export interface AtlasJson {
        method: "id" | "path";
        subgroup: string;
        expand_path: "array" | "string";
        trim: boolean;
        res: "1536" | "768" | "384" | "1200" | "640";
        groups: {
            [x: string]: {
                path: Array<string>;
                default: {
                    x: int;
                    y: int;
                    cols?: int;
                };
            };
        };
    }

    /**
     * Implement Create atlas JSON based on JS
     */

    export class CreateAtlasJson extends Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion
        .CheckOfficialResources {
        /**
         *
         * @param official_subgroup - Provide official subgroup
         * @param file_path - Provide file path process, if nothing passed, string become "undefined"
         * @returns
         */
        private static IsOfficialSubgroup<Generic_T extends resource_atlas_and_sprites>(
            official_subgroup: Generic_T,
            file_path?: string,
        ): void {
            if (
                !("id" in official_subgroup) ||
                official_subgroup.id === null ||
                official_subgroup.id === undefined ||
                official_subgroup.id === void 0
            ) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        "id",
                    )}`,
                    "id",
                    (file_path ??= "undefined"),
                );
            }
            if (
                !("parent" in official_subgroup) ||
                official_subgroup.parent === null ||
                official_subgroup.parent === undefined ||
                official_subgroup.parent === void 0
            ) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        "parent",
                    )}`,
                    "parent",
                    (file_path ??= "undefined"),
                );
            }
            if (
                !("resources" in official_subgroup) ||
                official_subgroup.resources === null ||
                official_subgroup.resources === undefined ||
                official_subgroup.resources === void 0
            ) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        "resources",
                    )}`,
                    "resources",
                    (file_path ??= "undefined"),
                );
            }
            if (
                !("type" in official_subgroup) ||
                official_subgroup.type === null ||
                official_subgroup.type === undefined ||
                official_subgroup.type === void 0
            ) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    `${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        "type",
                    )}`,
                    "type",
                    (file_path ??= "undefined"),
                );
            }
            if (typeof official_subgroup.id !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `id`,
                            `this.json()`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                            `${typeof official_subgroup.id}`,
                        ],
                    ),
                    `id`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                );
            }
            if (typeof official_subgroup.parent !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `parent`,
                            `${official_subgroup.id}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                            `${typeof official_subgroup.parent}`,
                        ],
                    ),
                    `parent`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                );
            }
            if (typeof official_subgroup.res !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `res`,
                            `${official_subgroup.id}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                            `${typeof official_subgroup.res}`,
                        ],
                    ),
                    `res`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                );
            }
            if (typeof official_subgroup.type !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `type`,
                            `${official_subgroup.id}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                            `${typeof official_subgroup.type}`,
                        ],
                    ),
                    `type`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                );
            }
            if (!Array.isArray(official_subgroup.resources)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `resources`,
                            `${official_subgroup.id}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                            `${typeof official_subgroup.resources}`,
                        ],
                    ),
                    `resources`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                );
            }
            official_subgroup.resources.forEach((res, index) => {
                if ("id" in res) {
                    if (typeof res.id !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `id`,
                                    `${index}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                                    `${typeof res.id}`,
                                ],
                            ),
                            `id`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        );
                    }
                }
                if ("parent" in res) {
                    if (typeof res.parent !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `parent`,
                                    `${index}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                                    `${typeof res.parent}`,
                                ],
                            ),
                            `parent`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        );
                    }
                }
                if ("type" in res) {
                    if (typeof res.type !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `type`,
                                    `${index}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                                    `${typeof res.type}`,
                                ],
                            ),
                            `type`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        );
                    }
                }
                if ("path" in res) {
                    if (typeof res.path !== "string" && !Array.isArray(res.path)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `path`,
                                    `${index}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString(
                                        "string_or_list_of_collections",
                                    )}`,
                                    `${typeof res.path}`,
                                ],
                            ),
                            `type`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString(
                                "string_or_list_of_collections",
                            )}`,
                        );
                    }
                }
                if ("atlas" in res) {
                    if (typeof res.atlas !== "boolean") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `atlas`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`,
                                    `${typeof res.atlas}`,
                                ],
                            ),
                            `atlas`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`,
                        );
                    }
                }
                if ("width" in res) {
                    if (!Number.isInteger(res.width)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `width`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.width}`,
                                ],
                            ),
                            `width`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("height" in res) {
                    if (!Number.isInteger(res.height)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `height`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.height}`,
                                ],
                            ),
                            `height`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("ax" in res) {
                    if (!Number.isInteger(res.ax)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `ax`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.ax}`,
                                ],
                            ),
                            `ax`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("ay" in res) {
                    if (!Number.isInteger(res.ay)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `ay`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.ay}`,
                                ],
                            ),
                            `ay`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("aw" in res) {
                    if (!Number.isInteger(res.aw)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `aw`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.aw}`,
                                ],
                            ),
                            `aw`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("ah" in res) {
                    if (!Number.isInteger(res.ah)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `ah`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.ah}`,
                                ],
                            ),
                            `ah`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("x" in res) {
                    if (!Number.isInteger(res.x)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `x`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.x}`,
                                ],
                            ),
                            `x`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("y" in res) {
                    if (!Number.isInteger(res.y)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `y`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.y}`,
                                ],
                            ),
                            `y`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
                if ("cols" in res) {
                    if (!Number.isInteger(res.cols)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                                [
                                    `cols`,
                                    `${res.id}`,
                                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                                    `${typeof res.cols}`,
                                ],
                            ),
                            `cols`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        );
                    }
                }
            });
            return;
        }

        /**
         *
         * @param subgroup_json - Provide parsed subgroup json object
         * @returns
         */

        private static CheckOfficialPathType<Template extends resource_atlas_and_sprites>(
            subgroup_json: Template,
        ): "array" | "string" {
            for (let i: number = 0; i < subgroup_json.resources.length; ++i) {
                if ("path" in subgroup_json.resources[i]) {
                    return Array.isArray(subgroup_json.resources[i].path) ? "array" : "string";
                }
            }
            throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("path_is_invalid"));
        }

        /**
         *
         * @param official_subgroup - Provide parsed Subgroup as JS object
         * @param method - provide method to split & pack
         * @param file_path - Provide file path for exception thrown
         * @returns atlas obj
         */

        public static ConvertAtlasJsonFromOfficial<Generic_T extends resource_atlas_and_sprites>(
            official_subgroup: Generic_T,
            method: "id" | "path",
            file_path?: string,
        ): AtlasJson {
            this.IsOfficialSubgroup<Generic_T>(official_subgroup, (file_path ??= "undefined"));
            const atlas_json: AtlasJson = {
                method: method,
                expand_path: this.CheckOfficialPathType(official_subgroup),
                trim: false,
                res: official_subgroup.res as "1536" | "768" | "384" | "1200" | "640",
                groups: {},
            } as AtlasJson;
            for (const subgroup of official_subgroup.resources) {
                if (
                    "id" in subgroup &&
                    "ax" in subgroup &&
                    "ay" in subgroup &&
                    "ah" in subgroup &&
                    "aw" in subgroup &&
                    "path" in subgroup
                ) {
                    atlas_json.groups[subgroup.id] =
                        subgroup.cols !== undefined && subgroup.cols !== null && subgroup.cols !== void 0
                            ? {
                                  default: {
                                      x: (subgroup.x ??= 0),
                                      y: (subgroup.x ??= 0),
                                      cols: subgroup.cols,
                                  },
                                  path: Array.isArray(subgroup.path) ? subgroup.path : subgroup.path.split("\\"),
                              }
                            : {
                                  default: {
                                      x: (subgroup.x ??= 0),
                                      y: (subgroup.x ??= 0),
                                  },
                                  path: Array.isArray(subgroup.path) ? subgroup.path : subgroup.path.split("\\"),
                              };
                }
            }
            return atlas_json;
        }

        /**
         *
         * @param file_input - Pass file path in here
         * @param file_output - Pass file output
         * @param method - Pass method
         * @returns Created atlas json at output path
         */

        public static CreateAtlasJsonFromOfficial(
            file_input: string,
            file_output: string,
            method: "id" | "path",
        ): void {
            Sen.Script.Modules.FileSystem.Json.WriteJson<AtlasJson>(
                file_output,
                this.ConvertAtlasJsonFromOfficial<resource_atlas_and_sprites>(
                    Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(file_input),
                    method,
                    file_input,
                ),
            );
            return;
        }
    }
    export class ExtractAtlas extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.CreateAtlasJson {
        /**
         *
         * @param argument - Pass all files here
         * @returns - Filtered files
         */
        public static SeperateParentsToArray(argument: Array<string>): Array<Array<string>> {
            const seperate_array: Array<Array<string>> = new Array();
            for (const arg of argument) {
                if (/.+\.json$/.test(arg)) {
                    const seperate_children: Array<string> = new Array();
                    seperate_children.push(arg);
                    for (const more_arg of argument) {
                        if (
                            Path.Parse(more_arg).name.startsWith(
                                Path.Parse(arg)
                                    .name.replace(/((\.json))?$/i, ``)
                                    .toUpperCase(),
                            )
                        ) {
                            seperate_children.push(more_arg);
                        }
                    }
                    seperate_array.push(seperate_children);
                }
            }
            return seperate_array;
        }

        /**
         *
         * @param array - Pass array contains duplicate
         * @returns - Array of duplicates only
         */

        public static FindDuplicates(array: string[]): string[] {
            const countMap: { [key: string]: number } = {};
            const duplicates: string[] = [];
            for (const item of array) {
                countMap[item] = (countMap[item] || 0) + 1;
            }
            for (const item in countMap) {
                if (countMap[item] > 1) {
                    duplicates.push(item);
                }
            }

            return duplicates;
        }

        /**
         *
         * @param argument - Pass arguments
         * @param method - Pass method
         * @returns Extracted PvZ2 Atlas
         */

        public static ExtractPvZ2AtlasOfficialStructure(argument: Array<string>, method: "id" | "path"): void {
            // json must be official
            const json: string = argument.filter((file) => /((\.json))?$/i.test(file))[0];
            const pngs: Array<string> = argument.filter((file) => /((.png))?$/i.test(file));
            const official_subgroup: resource_atlas_and_sprites =
                Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(json);
            const resources_used: resource_atlas_and_sprites = {
                ...official_subgroup,
                resources: [],
            };
            const directory_contains: string = json.replace(/((.json))?$/i, `.sprite`);
            const directory_contains_sprite: string = Path.Resolve(`${directory_contains}/sprite`);
            Fs.CreateDirectory(directory_contains);
            Fs.CreateDirectory(directory_contains_sprite);
            const async_task: Array<AsyncTaskImageSplit> = new Array();
            for (const subgroup_children of official_subgroup.resources) {
                if (
                    `ax` in subgroup_children &&
                    `ay` in subgroup_children &&
                    `ah` in subgroup_children &&
                    `aw` in subgroup_children &&
                    `parent` in subgroup_children
                ) {
                    pngs.forEach((file: string) => {
                        if (subgroup_children.parent?.endsWith(Path.Parse(file).name.replace(/((.png))?$/i, ""))) {
                            subgroup_children.path = Array.isArray(subgroup_children.path)
                                ? subgroup_children.path
                                : subgroup_children.path.split("\\");
                            async_task.push({
                                sourceImagePath: file,
                                outputImagePath: Path.Resolve(
                                    `${directory_contains_sprite}/${
                                        method === "path"
                                            ? subgroup_children.path[subgroup_children.path.length - 1]
                                            : subgroup_children.id
                                    }.png`,
                                ),
                                x: subgroup_children.ax as number,
                                y: subgroup_children.ay as number,
                                width: subgroup_children.aw as number,
                                height: subgroup_children.ah as number,
                            });
                        }
                        resources_used.resources.push(subgroup_children);
                    });
                }
            }
            const output_images: Array<string> = new Array(
                ...new Set(async_task.map((task: AsyncTaskImageSplit) => task.outputImagePath)),
            );
            if (async_task.length !== output_images.length) {
                this.FindDuplicates(async_task.map((task) => task.outputImagePath)).forEach((file: string) => {
                    Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                            /\{\}/g,
                            Sen.Script.Modules.System.Default.Localization.GetString("id_is_duplicated").replace(
                                /\{\}/g,
                                Path.Parse(file).basename,
                            ),
                        ),
                    );
                });
                throw new Sen.Script.Modules.Exceptions.CannotWriteFile(
                    Sen.Script.Modules.System.Default.Localization.GetString("contains_duplicated").replace(
                        /\{\}/g,
                        (async_task.length - output_images.length).toString(),
                    ),
                    json,
                );
            }
            DotNetBitmap.CropAndSaveImages(async_task);
            Sen.Script.Modules.FileSystem.Json.WriteJson<AtlasJson>(
                Path.Resolve(`${directory_contains}/atlas.json`),
                this.ConvertAtlasJsonFromOfficial(resources_used, method, json),
            );
            return;
        }

        /**
         *
         * @param argument - Pass arguments here
         * @param method - Pass method
         * @returns Many splitted argument
         */

        public static ExtractManyPvZ2OfficialStructure(argument: Array<string>, method: "id" | "path"): void {
            const SeperatedArray: Array<Array<string>> = this.SeperateParentsToArray(argument);
            SeperatedArray.forEach((list_collections: Array<string>) => {
                this.ExtractPvZ2AtlasOfficialStructure(list_collections, method);
            });
            return;
        }
    }
}
