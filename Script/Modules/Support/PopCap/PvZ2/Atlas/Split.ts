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
        expand_path?: "array" | "string";
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

    export class CreateAtlasJson extends Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.CheckOfficialResources {
        /**
         *
         * @param official_subgroup - Provide official subgroup
         * @param file_path - Provide file path process, if nothing passed, string become "undefined"
         * @returns
         */
        private static IsOfficialSubgroup<Generic_T extends resource_atlas_and_sprites>(official_subgroup: Generic_T, file_path?: string): void {
            if (!("id" in official_subgroup) || official_subgroup.id === null || official_subgroup.id === undefined || official_subgroup.id === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(`${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, "id")}`, "id", (file_path ??= "undefined"));
            }
            if (!("parent" in official_subgroup) || official_subgroup.parent === null || official_subgroup.parent === undefined || official_subgroup.parent === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(`${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, "parent")}`, "parent", (file_path ??= "undefined"));
            }
            if (!("resources" in official_subgroup) || official_subgroup.resources === null || official_subgroup.resources === undefined || official_subgroup.resources === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(`${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, "resources")}`, "resources", (file_path ??= "undefined"));
            }
            if (!("type" in official_subgroup) || official_subgroup.type === null || official_subgroup.type === undefined || official_subgroup.type === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(`${Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, "type")}`, "type", (file_path ??= "undefined"));
            }
            if (typeof official_subgroup.id !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`id`, `this.json()`, `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`, `${typeof official_subgroup.id}`]),
                    `id`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                );
            }
            if (typeof official_subgroup.parent !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `parent`,
                        `${official_subgroup.id}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        `${typeof official_subgroup.parent}`,
                    ]),
                    `parent`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                );
            }
            if (typeof official_subgroup.res !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `res`,
                        `${official_subgroup.id}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        `${typeof official_subgroup.res}`,
                    ]),
                    `res`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                );
            }
            if (typeof official_subgroup.type !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `type`,
                        `${official_subgroup.id}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`,
                        `${typeof official_subgroup.type}`,
                    ]),
                    `type`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                );
            }
            if (!Array.isArray(official_subgroup.resources)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `resources`,
                        `${official_subgroup.id}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof official_subgroup.resources}`,
                    ]),
                    `resources`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
            official_subgroup.resources.forEach((res, index) => {
                if ("id" in res) {
                    if (typeof res.id !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`id`, `${index}`, `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`, `${typeof res.id}`]),
                            `id`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                        );
                    }
                }
                if ("parent" in res) {
                    if (typeof res.parent !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`parent`, `${index}`, `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`, `${typeof res.parent}`]),
                            `parent`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                        );
                    }
                }
                if ("type" in res) {
                    if (typeof res.type !== "string") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`type`, `${index}`, `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`, `${typeof res.type}`]),
                            `type`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string")}`
                        );
                    }
                }
                if ("path" in res) {
                    if (typeof res.path !== "string" && !Array.isArray(res.path)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `path`,
                                `${index}`,
                                `${Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections")}`,
                                `${typeof res.path}`,
                            ]),
                            `type`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections")}`
                        );
                    }
                }
                if ("atlas" in res) {
                    if (typeof res.atlas !== "boolean") {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`atlas`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`, `${typeof res.atlas}`]),
                            `atlas`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("boolean")}`
                        );
                    }
                }
                if ("width" in res) {
                    if (!Number.isInteger(res.width)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`width`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.width}`]),
                            `width`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("height" in res) {
                    if (!Number.isInteger(res.height)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`height`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.height}`]),
                            `height`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("ax" in res) {
                    if (!Number.isInteger(res.ax)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`ax`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.ax}`]),
                            `ax`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("ay" in res) {
                    if (!Number.isInteger(res.ay)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`ay`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.ay}`]),
                            `ay`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("aw" in res) {
                    if (!Number.isInteger(res.aw)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`aw`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.aw}`]),
                            `aw`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("ah" in res) {
                    if (!Number.isInteger(res.ah)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`ah`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.ah}`]),
                            `ah`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("x" in res) {
                    if (!Number.isInteger(res.x)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`x`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.x}`]),
                            `x`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("y" in res) {
                    if (!Number.isInteger(res.y)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`y`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.y}`]),
                            `y`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
                        );
                    }
                }
                if ("cols" in res) {
                    if (!Number.isInteger(res.cols)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`cols`, `${res.id}`, `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`, `${typeof res.cols}`]),
                            `cols`,
                            (file_path ??= "undefined"),
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
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

        protected static CheckOfficialPathType<Template extends resource_atlas_and_sprites>(subgroup_json: Template): "array" | "string" {
            for (let i: number = 0; i < subgroup_json.resources.length; ++i) {
                if ("path" in subgroup_json.resources[i]) {
                    if ("path" in subgroup_json.resources[i]) {
                        try {
                            (subgroup_json.resources[i].path as Array<string>).join("\\");
                            return "array";
                        } catch {
                            return "string";
                        }
                    }
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

        public static ConvertAtlasJsonFromOfficial<Generic_T extends resource_atlas_and_sprites>(official_subgroup: Generic_T, method: "id" | "path", expand_path: "array" | "string", file_path?: string): AtlasJson {
            this.IsOfficialSubgroup<Generic_T>(official_subgroup, (file_path ??= "undefined"));
            const atlas_json: AtlasJson = {
                method: method,
                expand_path: expand_path,
                subgroup: official_subgroup.id,
                trim: false,
                res: official_subgroup.res as "1536" | "768" | "384" | "1200" | "640",
                groups: {},
            };
            for (const subgroup of official_subgroup.resources) {
                if ("id" in subgroup && "ax" in subgroup && "ay" in subgroup && "ah" in subgroup && "aw" in subgroup && "path" in subgroup) {
                    atlas_json.groups[subgroup.id] =
                        subgroup.cols !== undefined && subgroup.cols !== null && subgroup.cols !== void 0
                            ? ({
                                  default: {
                                      x: (subgroup.x ??= 0),
                                      y: (subgroup.x ??= 0),
                                      cols: subgroup.cols,
                                  },
                                  path: subgroup.path,
                              } as any)
                            : {
                                  default: {
                                      x: (subgroup.x ??= 0),
                                      y: (subgroup.x ??= 0),
                                  },
                                  path: subgroup.path,
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

        public static CreateAtlasJsonFromOfficial(file_input: string, file_output: string, method: "id" | "path", expand_path: "string" | "array"): void {
            Sen.Script.Modules.FileSystem.Json.WriteJson<AtlasJson>(file_output, this.ConvertAtlasJsonFromOfficial<resource_atlas_and_sprites>(Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(file_input), method, expand_path, file_input));
            return;
        }

        /**
         *
         * @param unofficial_subgroup - Pass unofficial subgroup (Sen standards)
         * @param file_path - Pass file path here
         * @returns Check done
         */

        private static CheckWholeUnofficialSubgroupStandard<Generic_T extends UnofficialSubgroupStandard>(unofficial_subgroup: Generic_T, file_path?: string): void {
            if (!("type" in unofficial_subgroup) || unofficial_subgroup.type === null || unofficial_subgroup.type === undefined || unofficial_subgroup.type === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `type`), `type`, (file_path ??= "undefined"));
            }
            if (typeof unofficial_subgroup.type !== "string") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `type`,
                        file_path !== undefined ? Sen.Shell.Path.Parse(file_path).basename : "undefined",
                        Sen.Script.Modules.System.Default.Localization.GetString("string"),
                        typeof unofficial_subgroup.type,
                    ]),
                    `type`,
                    (file_path ??= "undefined"),
                    Sen.Script.Modules.System.Default.Localization.GetString("string")
                );
            }
            if (!("packet" in unofficial_subgroup) || unofficial_subgroup.packet === null || unofficial_subgroup.packet === undefined || unofficial_subgroup.packet === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `packet`), `packet`, (file_path ??= "undefined"));
            }
            const parents: Array<string> = Object.keys(unofficial_subgroup.packet);
            for (let parent of parents) {
                if (!("type" in unofficial_subgroup.packet[parent]) || unofficial_subgroup.packet[parent].type === null || unofficial_subgroup.packet[parent].type === undefined || unofficial_subgroup.packet[parent].type === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `type`), `type`, (file_path ??= "undefined"));
                }
                if (typeof unofficial_subgroup.packet[parent].type !== "string") {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                            `type`,
                            parent,
                            Sen.Script.Modules.System.Default.Localization.GetString("string"),
                            typeof unofficial_subgroup.packet[parent].type,
                        ]),
                        `type`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("string")
                    );
                }
                if (!("dimension" in unofficial_subgroup.packet[parent]) || unofficial_subgroup.packet[parent].dimension === null || unofficial_subgroup.packet[parent].dimension === undefined || unofficial_subgroup.packet[parent].dimension === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `dimension`), `dimension`, (file_path ??= "undefined"));
                }
                if (!("width" in unofficial_subgroup.packet[parent].dimension) || unofficial_subgroup.packet[parent].dimension.width === null || unofficial_subgroup.packet[parent].dimension.width === undefined || unofficial_subgroup.packet[parent].dimension.width === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `width`), `width`, (file_path ??= "undefined"));
                }
                if (!Number.isInteger(unofficial_subgroup.packet[parent].dimension.width)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                            `width`,
                            parent,
                            Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                            unofficial_subgroup.packet[parent].dimension.width.toString(),
                        ]),
                        `type`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("integer")
                    );
                }
                if (!("height" in unofficial_subgroup.packet[parent].dimension) || unofficial_subgroup.packet[parent].dimension.height === null || unofficial_subgroup.packet[parent].dimension.height === undefined || unofficial_subgroup.packet[parent].dimension.height === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `height`), `height`, (file_path ??= "undefined"));
                }
                if (!Number.isInteger(unofficial_subgroup.packet[parent].dimension.height)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                            `height`,
                            parent,
                            Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                            unofficial_subgroup.packet[parent].dimension.height.toString(),
                        ]),
                        `type`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("integer")
                    );
                }
                if (!("path" in unofficial_subgroup.packet[parent]) || unofficial_subgroup.packet[parent].path === null || unofficial_subgroup.packet[parent].path === undefined || unofficial_subgroup.packet[parent].path === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `path`), `path`, (file_path ??= "undefined"));
                }
                if (!Array.isArray(unofficial_subgroup.packet[parent].path)) {
                    throw new Sen.Script.Modules.Exceptions.WrongDataType(
                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [`path`, parent, Sen.Script.Modules.System.Default.Localization.GetString("array"), typeof unofficial_subgroup.packet[parent].path]),
                        `path`,
                        (file_path ??= "undefined"),
                        Sen.Script.Modules.System.Default.Localization.GetString("path")
                    );
                }
                if (!("data" in unofficial_subgroup.packet[parent]) || unofficial_subgroup.packet[parent].data === null || unofficial_subgroup.packet[parent].data === undefined || unofficial_subgroup.packet[parent].data === void 0) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `data`), `data`, (file_path ??= "undefined"));
                }
                const childrens_data: Array<string> = Object.keys(unofficial_subgroup.packet[parent].data);
                for (const children of childrens_data) {
                    if (
                        !("default" in unofficial_subgroup.packet[parent].data[children]) ||
                        unofficial_subgroup.packet[parent].data[children].default === null ||
                        unofficial_subgroup.packet[parent].data[children].default === undefined ||
                        unofficial_subgroup.packet[parent].data[children].default === void 0
                    ) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `default`), `default`, (file_path ??= "undefined"));
                    }
                    if (
                        !("ax" in unofficial_subgroup.packet[parent].data[children].default) ||
                        unofficial_subgroup.packet[parent].data[children].default.ax === null ||
                        unofficial_subgroup.packet[parent].data[children].default.ax === undefined ||
                        unofficial_subgroup.packet[parent].data[children].default.ax === void 0
                    ) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `ax`), `ax`, (file_path ??= "undefined"));
                    }
                    if (!Number.isInteger(unofficial_subgroup.packet[parent].data[children].default.ax)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `ax`,
                                children,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                unofficial_subgroup.packet[parent].data[children].default.ax !== undefined ? (unofficial_subgroup.packet[parent].data[children].default.ax as number).toString() : "undefined",
                            ]),
                            `ax`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("integer")
                        );
                    }
                    if (
                        !("ay" in unofficial_subgroup.packet[parent].data[children].default) ||
                        unofficial_subgroup.packet[parent].data[children].default.ay === null ||
                        unofficial_subgroup.packet[parent].data[children].default.ay === undefined ||
                        unofficial_subgroup.packet[parent].data[children].default.ay === void 0
                    ) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `ay`), `ay`, (file_path ??= "undefined"));
                    }
                    if (!Number.isInteger(unofficial_subgroup.packet[parent].data[children].default.ay)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `ay`,
                                children,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                unofficial_subgroup.packet[parent].data[children].default.ay !== undefined ? (unofficial_subgroup.packet[parent].data[children].default.ay as number).toString() : "undefined",
                            ]),
                            `ay`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("integer")
                        );
                    }
                    if (
                        !("ah" in unofficial_subgroup.packet[parent].data[children].default) ||
                        unofficial_subgroup.packet[parent].data[children].default.ah === null ||
                        unofficial_subgroup.packet[parent].data[children].default.ah === undefined ||
                        unofficial_subgroup.packet[parent].data[children].default.ah === void 0
                    ) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `ah`), `ah`, (file_path ??= "undefined"));
                    }
                    if (!Number.isInteger(unofficial_subgroup.packet[parent].data[children].default.ah)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `ah`,
                                children,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                unofficial_subgroup.packet[parent].data[children].default.ah !== undefined ? (unofficial_subgroup.packet[parent].data[children].default.ah as number).toString() : "undefined",
                            ]),
                            `ah`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("integer")
                        );
                    }
                    if (
                        !("aw" in unofficial_subgroup.packet[parent].data[children].default) ||
                        unofficial_subgroup.packet[parent].data[children].default.aw === null ||
                        unofficial_subgroup.packet[parent].data[children].default.aw === undefined ||
                        unofficial_subgroup.packet[parent].data[children].default.aw === void 0
                    ) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `aw`), `aw`, (file_path ??= "undefined"));
                    }
                    if (!Number.isInteger(unofficial_subgroup.packet[parent].data[children].default.aw)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `aw`,
                                children,
                                Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                unofficial_subgroup.packet[parent].data[children].default.aw !== undefined ? (unofficial_subgroup.packet[parent].data[children].default.aw as number).toString() : "undefined",
                            ]),
                            `aw`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("integer")
                        );
                    }
                    if (!("path" in unofficial_subgroup.packet[parent].data[children]) || unofficial_subgroup.packet[parent].data[children].path === null || unofficial_subgroup.packet[parent].data[children].path === undefined || unofficial_subgroup.packet[parent].data[children].path === void 0) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `path`), `path`, (file_path ??= "undefined"));
                    }
                    if (!Array.isArray(unofficial_subgroup.packet[parent].data[children].path)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                `path`,
                                children,
                                Sen.Script.Modules.System.Default.Localization.GetString("array"),
                                typeof unofficial_subgroup.packet[parent].data[children].path,
                            ]),
                            `path`,
                            (file_path ??= "undefined"),
                            Sen.Script.Modules.System.Default.Localization.GetString("path")
                        );
                    }
                    if (!("type" in unofficial_subgroup.packet[parent].data[children]) || unofficial_subgroup.packet[parent].data[children].type === null || unofficial_subgroup.packet[parent].data[children].type === undefined || unofficial_subgroup.packet[parent].data[children].type === void 0) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `type`), `type`, (file_path ??= "undefined"));
                    }
                    if ("cols" in unofficial_subgroup.packet[parent].data[children]) {
                        if (!Number.isInteger(unofficial_subgroup.packet[parent].data[children].default.cols)) {
                            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                                    `cols`,
                                    children,
                                    Sen.Script.Modules.System.Default.Localization.GetString("integer"),
                                    unofficial_subgroup.packet[parent].data[children].default.cols !== undefined ? (unofficial_subgroup.packet[parent].data[children].default.cols as number).toString() : "undefined",
                                ]),
                                `cols`,
                                (file_path ??= "undefined"),
                                Sen.Script.Modules.System.Default.Localization.GetString("integer")
                            );
                        }
                    }
                }
            }
            return;
        }

        public static CreateAtlasJsonFromUnofficial<Generic_T extends UnofficialSubgroupStandard>(unofficial_subgroup: Generic_T, method: "id" | "path", file_path: string): AtlasJson {
            this.CheckWholeUnofficialSubgroupStandard<Generic_T>(unofficial_subgroup, file_path);
            const atlas_json: AtlasJson = {
                method: method,
                subgroup: Sen.Shell.Path.Parse(file_path).name_without_extension,
                trim: false,
                res: unofficial_subgroup.type as "1536" | "768" | "384" | "640" | "1200",
                groups: {},
            };
            const parents: Array<string> = Object.keys(unofficial_subgroup.packet);
            for (const parent of parents) {
                const datas: Array<string> = Object.keys(unofficial_subgroup.packet[parent].data);
                for (const data of datas) {
                    atlas_json.groups[data] = {
                        default: {
                            x: (unofficial_subgroup.packet[parent].data[data].default.x ??= 0),
                            y: (unofficial_subgroup.packet[parent].data[data].default.y ??= 0),
                        },
                        path: [...unofficial_subgroup.packet[parent].data[data].path],
                    };
                }
            }
            return atlas_json;
        }
    }

    /**
     * PvZ2 Official Resources Structure splitting atlas
     */

    export class ExtractOfficialAtlas extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.CreateAtlasJson {
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
                            Sen.Shell.Path.Parse(more_arg).name.startsWith(
                                Sen.Shell.Path.Parse(arg)
                                    .name.replace(/((\.json))?$/i, ``)
                                    .toUpperCase()
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
         * @param output_directory - Pass output dir (optional)
         * @returns Extracted PvZ2 Atlas
         */

        public static ExtractPvZ2AtlasOfficialStructure(argument: Array<string>, method: "id" | "path", expand_path: "string" | "array", output_directory?: string): void {
            // json must be official
            const json: string = argument.find((file) => /((\.json))?$/i.test(file) && file.toLowerCase().endsWith(".json")) as string;
            const pngs: Array<string> = argument.filter((file) => /((.png))?$/i.test(file) && file.toLowerCase().endsWith(".png"));
            const official_subgroup: resource_atlas_and_sprites = Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(json);
            const resources_used: resource_atlas_and_sprites = {
                ...official_subgroup,
                resources: [],
            };
            const directory_contains: string = (output_directory ??= json.replace(/((.json))?$/i, `.sprite`));
            const directory_contains_sprite: string = Sen.Shell.Path.Resolve(`${directory_contains}/media`);
            Sen.Shell.FileSystem.CreateDirectory(directory_contains);
            Sen.Shell.FileSystem.CreateDirectory(directory_contains_sprite);
            const async_task: Array<Sen.Shell.AsyncTaskImageSplit> = new Array();
            for (const subgroup_children of official_subgroup.resources) {
                if (`ax` in subgroup_children && `ay` in subgroup_children && `ah` in subgroup_children && `aw` in subgroup_children && `parent` in subgroup_children) {
                    pngs.forEach((file: string) => {
                        if (
                            subgroup_children.parent?.endsWith(
                                Sen.Shell.Path.Parse(file)
                                    .name.replace(/((.png))?$/i, "")
                                    .toUpperCase()
                            )
                        ) {
                            subgroup_children.path = expand_path === "array" ? subgroup_children.path : (subgroup_children.path as string).split("\\");
                            async_task.push({
                                sourceImagePath: file,
                                outputImagePath: Sen.Shell.Path.Resolve(`${directory_contains_sprite}/${method === "path" ? subgroup_children.path[subgroup_children.path.length - 1] : subgroup_children.id}.png`),
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
            const output_images: Array<string> = new Array(...new Set(async_task.map((task: Sen.Shell.AsyncTaskImageSplit) => task.outputImagePath)));
            if (async_task.length !== output_images.length) {
                this.FindDuplicates(async_task.map((task) => task.outputImagePath)).forEach((file: string) => {
                    Sen.Shell.Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("id_is_duplicated").replace(/\{\}/g, Sen.Shell.Path.Parse(file).basename))
                    );
                });
                throw new Sen.Script.Modules.Exceptions.CannotWriteFile(Sen.Script.Modules.System.Default.Localization.GetString("contains_duplicated").replace(/\{\}/g, (async_task.length - output_images.length).toString()), json);
            }
            Sen.Shell.DotNetBitmap.CropAndSaveImages(async_task);
            Sen.Script.Modules.FileSystem.Json.WriteJson<AtlasJson>(Sen.Shell.Path.Resolve(`${directory_contains}/atlas.json`), this.ConvertAtlasJsonFromOfficial(resources_used, method, expand_path, json));
            return;
        }

        /**
         *
         * @param argument - Pass arguments here
         * @param method - Pass method
         * @returns Many splitted argument
         */

        public static ExtractManyPvZ2OfficialStructure(argument: Array<string>, method: "id" | "path", expand_path: "array" | "string"): void {
            const SeperatedArray: Array<Array<string>> = this.SeperateParentsToArray(argument);
            SeperatedArray.forEach((list_collections: Array<string>) => {
                this.ExtractPvZ2AtlasOfficialStructure(list_collections, method, expand_path);
            });
            return;
        }
    }

    /**
     * Implement extracting Unofficial structure
     */

    export class ExtractUnofficialPvZ2Atlas extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractOfficialAtlas {
        /**
         *
         * @param argument - Pass arguments
         * @param method - Pass method
         * @param output_directory - Pass output dir (optional)
         * @returns Extracted PvZ2 Atlas
         */

        public static ExtractPvZ2AtlasUnofficialStructure(argument: Array<string>, method: "id" | "path", output_directory?: string): void {
            // json must be unofficial
            const json: string = argument.find((file) => /((\.json))?$/i.test(file) && file.toLowerCase().endsWith(".json")) as string;
            const pngs: Array<string> = argument.filter((file) => /((.png))?$/i.test(file) && file.toLowerCase().endsWith(".png"));
            const unofficial_subgroup: UnofficialSubgroupStandard = Sen.Script.Modules.FileSystem.Json.ReadJson<UnofficialSubgroupStandard>(json);
            const resources_used: UnofficialSubgroupStandard = {
                ...unofficial_subgroup,
                packet: {},
            };
            const parents: Array<string> = Object.keys(unofficial_subgroup.packet);
            const directory_contains: string = (output_directory ??= json.replace(/((.json))?$/i, `.sprite`));
            const directory_contains_sprite: string = Sen.Shell.Path.Resolve(`${directory_contains}/media`);
            Sen.Shell.FileSystem.CreateDirectory(directory_contains);
            Sen.Shell.FileSystem.CreateDirectory(directory_contains_sprite);
            const async_task: Array<Sen.Shell.AsyncTaskImageSplit> = new Array();
            for (const parent of parents) {
                const ids_collection: Array<string> = Object.keys(unofficial_subgroup.packet[parent].data);
                resources_used.packet[parent] = {
                    ...unofficial_subgroup.packet[parent],
                    data: {},
                };
                for (const id of ids_collection) {
                    if (`ax` in unofficial_subgroup.packet[parent].data[id].default && `ay` in unofficial_subgroup.packet[parent].data[id].default && `ah` in unofficial_subgroup.packet[parent].data[id].default && `aw` in unofficial_subgroup.packet[parent].data[id].default) {
                        pngs.forEach((file: string) => {
                            if (parent?.endsWith(Sen.Shell.Path.Parse(file).name.replace(/((.png))?$/i, ""))) {
                                async_task.push({
                                    sourceImagePath: file,
                                    outputImagePath: Sen.Shell.Path.Resolve(`${directory_contains_sprite}/${method === "path" ? unofficial_subgroup.packet[parent].data[id].path[unofficial_subgroup.packet[parent].data[id].path.length - 1] : id}.png`),
                                    x: unofficial_subgroup.packet[parent].data[id].default.ax as number,
                                    y: unofficial_subgroup.packet[parent].data[id].default.ay as number,
                                    width: unofficial_subgroup.packet[parent].data[id].default.aw as number,
                                    height: unofficial_subgroup.packet[parent].data[id].default.ah as number,
                                });
                            }
                            resources_used.packet[parent].data[id] = {
                                default: {
                                    ...unofficial_subgroup.packet[parent].data[id].default,
                                },
                                path: [...unofficial_subgroup.packet[parent].data[id].path],
                                type: unofficial_subgroup.packet[parent].data[id].type,
                            };
                        });
                    }
                }
            }
            const output_images: Array<string> = new Array(...new Set(async_task.map((task: Sen.Shell.AsyncTaskImageSplit) => task.outputImagePath)));
            if (async_task.length !== output_images.length) {
                this.FindDuplicates(async_task.map((task) => task.outputImagePath)).forEach((file: string) => {
                    Sen.Shell.Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("id_is_duplicated").replace(/\{\}/g, Sen.Shell.Path.Parse(file).basename))
                    );
                });
                throw new Sen.Script.Modules.Exceptions.CannotWriteFile(Sen.Script.Modules.System.Default.Localization.GetString("contains_duplicated").replace(/\{\}/g, (async_task.length - output_images.length).toString()), json);
            }
            Sen.Shell.DotNetBitmap.CropAndSaveImages(async_task);
            Sen.Script.Modules.FileSystem.Json.WriteJson<AtlasJson>(Sen.Shell.Path.Resolve(`${directory_contains}/atlas.json`), this.CreateAtlasJsonFromUnofficial(resources_used, method, json));
            Sen.Shell.Console.Print(null, Sen.Script.Modules.System.Default.Localization.GetString("total_sprites_count").replace(/\{\}/g, `${async_task.length}`));
            return;
        }

        /**
         *
         * @param argument - Pass arguments here
         * @param method - Pass method
         * @returns Many splitted argument
         */

        public static ExtractManyPvZ2UnOfficialStructure(argument: Array<string>, method: "id" | "path"): void {
            const SeperatedArray: Array<Array<string>> = this.SeperateParentsToArray(argument);
            SeperatedArray.forEach((list_collections: Array<string>) => {
                this.ExtractPvZ2AtlasUnofficialStructure(list_collections, method);
            });
            return;
        }
    }
}
