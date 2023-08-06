namespace Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion {
    /**
     * Structure
     */

    export enum ExpandPath {
        String,
        Array,
    }

    /**
     * Structure
     */

    export interface ResourcesForWork extends small_bundle_info_json {
        group_parent: string;
    }

    /**
     * Structure
     */

    export interface M_Wrapper_Construct {
        name: string;
        image: null | "1536" | "768" | "384" | "640" | "1200";
    }

    /**
     * Structure
     */

    export type SubgroupList = Array<
        Array<{
            name: string;
            image: null | "1536" | "768" | "384" | "640" | "1200";
        }>
    >;

    /**
     * Requires
     */

    export abstract class CheckResourceGroupResources {
        /**
         *
         * @param num - Number
         * @param property - Property
         * @param id - ID
         * @param file_path - File path
         * @returns
         */

        protected static CheckIntegerNumber(num: number, property: string, id: string, file_path: string): boolean {
            if (!Number.isInteger(num)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    `${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        `${property}`,
                        `${id}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        `${num}`,
                    ])}`,
                    property,
                    file_path,
                    Sen.Script.Modules.System.Default.Localization.GetString("integer")
                );
            }
            return true;
        }

        /**
         *
         * @param sub_resource_data - Provide res
         * @param file_path - File path
         * @returns
         */

        public static CheckWholeData(sub_resource_data: Resource_Structure_Template, file_path: string): sub_resource_data is Resource_Structure_Template {
            if (!("resources" in sub_resource_data) || sub_resource_data.resources === undefined || sub_resource_data.resources === null || sub_resource_data.resources === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "resources"), "resources", file_path);
            }
            if (!("id" in sub_resource_data) || sub_resource_data.id === undefined || sub_resource_data.id === null || sub_resource_data.id === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "id"), "id", file_path);
            }
            return true;
        }

        /**
         *
         * @param resources_group - Provide ResourceGroup
         * @param file_path - File path
         * @returns
         */

        protected static CheckResourceGroup<Template extends Resources_Group_Structure_Template>(resources_group: Template, file_path: string): resources_group is Template {
            if (!("groups" in resources_group)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "groups"), "groups", file_path);
            }
            return true;
        }

        /**
         *
         * @param sub_resource_data - Provide subgroup resource
         * @param file_path - Provide file path
         * @returns
         */

        protected static CheckSubgroupChildrenDataImage<Resource_Template extends Resource_Structure_Template>(sub_resource_data: Resource_Template, file_path: string): sub_resource_data is Resource_Template {
            this.CheckWholeData(sub_resource_data, file_path);
            if (!("res" in sub_resource_data) || sub_resource_data.res === undefined || sub_resource_data.res === null || sub_resource_data.res === void 0) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "res"), "res", file_path);
            }
            return true;
        }

        /**
         *
         * @param res_json - Provide Res Info
         * @param file_path - Provide file path
         * @returns
         */

        protected static CheckResInfoJsonForWork<Template extends res_json>(res_json: Template, file_path: string): res_json is Template {
            if (!("expand_path" in res_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "expand_path"), "expand_path", file_path);
            }
            if (!(res_json.expand_path === "array") && !(res_json.expand_path === ("string" as any))) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                        "expand_path",
                        Sen.Shell.Path.Parse(file_path).basename,
                        Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections"),
                        res_json.expand_path,
                    ]),
                    "expand_path",
                    file_path,
                    Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections")
                );
            }
            if (!("groups" in res_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "groups"), "groups", file_path);
            }
            return true;
        }

        /**
         *
         * @param assert_test - Test string
         * @param file_path - Provide file path
         * @returns
         */

        protected static CheckString(assert_test: any, file_path: string): assert_test is string {
            if (typeof assert_test !== "string") {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("not_a").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("string")));
            }
            return true;
        }
    }

    /**
     * Conversion
     */

    export class ResInfoResourceConversion extends CheckResourceGroupResources {
        /** Deprecated */

        private static CheckResourceGroupPathType<Template extends Resources_Group_Structure_Template>(resource_json: Template): "array" | "string" {
            for (let index: number = 0; index < resource_json.groups.length; ++index) {
                if ("resources" in resource_json.groups[index]) {
                    for (let j_index: number = 0; j_index < resource_json.groups[index].resources.length; ++j_index) {
                        if ("path" in resource_json.groups[index].resources[j_index]) {
                            try {
                                (resource_json.groups[index].resources[j_index] as Array<string>).join("\\");
                                return "array";
                            } catch {
                                return "string";
                            }
                        }
                    }
                }
            }
            throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("path_is_invalid"));
        }

        /**
         *
         * @param sub_resource_data - ResInfo
         * @param file_path - Path
         * @returns
         */

        private static ConvertResourceGroupSubgroupFile<Template extends Resource_Structure_Template, Value extends subgroup_children>(sub_resource_data: Template, file_path: string): Value {
            this.CheckWholeData(sub_resource_data, file_path);
            const res_json_conversion: Value = {
                [sub_resource_data.id]: {
                    type: null,
                    packet: {
                        type: "File",
                        data: {},
                    },
                },
            } as any;
            for (const resource of sub_resource_data.resources ?? []) {
                const { id, srcpath, type, path, forceOriginalVectorSymbolSize } = resource;
                const packetData = res_json_conversion[sub_resource_data.id].packet.data as any;
                packetData[id] = {
                    type,
                    path: Array.isArray(path) ? path : path.split("\\"),
                    forceOriginalVectorSymbolSize,
                };
                if (srcpath) {
                    packetData[id].srcpath = Array.isArray(srcpath) ? srcpath : srcpath.split("\\");
                }
            }
            return res_json_conversion;
        }

        /**
         *
         * @param sub_resource_data - ResInfo
         * @param file_path - File Path
         * @returns
         */

        private static ConvertResourceGroupSubgroupContainsAtlas<Template extends Resource_Structure_Template>(sub_resource_data: Template, file_path: string): sprite_data {
            this.CheckSubgroupChildrenDataImage<Resource_Structure_Template>(sub_resource_data, file_path);
            const res_json_conversion: sprite_data = {
                [sub_resource_data.id]: {
                    type: sub_resource_data.res ?? null,
                    packet: {},
                },
            } as any;
            for (const k_current of sub_resource_data.resources) {
                if ("atlas" in k_current) {
                    const { id, type, path, width, height } = k_current;
                    this.CheckIntegerNumber(width!, "width", id, file_path);
                    this.CheckIntegerNumber(height!, "height", id, file_path);
                    res_json_conversion[sub_resource_data.id].packet[id] = {
                        type,
                        path: Array.isArray(path) ? path : path.split("\\"),
                        dimension: { width, height },
                        data: {},
                    } as any;
                    for (const k_struct of sub_resource_data.resources) {
                        if (k_struct.parent === id) {
                            const { ax, ay, aw, ah, x, y, cols } = k_struct;
                            this.CheckIntegerNumber(ax!, "ax", k_struct.id, file_path);
                            this.CheckIntegerNumber(ay!, "ay", k_struct.id, file_path);
                            this.CheckIntegerNumber(aw!, "aw", k_struct.id, file_path);
                            this.CheckIntegerNumber(ah!, "ah", k_struct.id, file_path);
                            res_json_conversion[sub_resource_data.id].packet[id].data[k_struct.id] = {
                                default: {
                                    ax: Math.abs(ax!),
                                    ay: Math.abs(ay!),
                                    aw: Math.abs(aw!),
                                    ah: Math.abs(ah!),
                                    x: x ?? 0,
                                    y: y ?? 0,
                                    cols,
                                },
                                path: Array.isArray(k_struct.path) ? k_struct.path : k_struct.path.split("\\"),
                                type: k_struct.type!,
                            };
                        }
                    }
                }
            }
            return res_json_conversion;
        }

        /**
         *
         * @param resources_group - ResourceGroup
         * @param file_path - File path
         * @param expand_path - Extends path
         * @returns
         */

        public static DoAllProcess<Template extends Resources_Group_Structure_Template, Value_Return extends res_json>(resources_group: Template, file_path: string, expand_path: "string" | "array"): Value_Return {
            this.CheckResourceGroup<Template>(resources_group, file_path);
            const res_json: Value_Return = {
                expand_path,
                groups: {},
            } as Value_Return;
            const subgroups_parent_containers: Array<{
                [x: string]: Array<{
                    name: string;
                    image: null | "1536" | "768" | "384" | "640" | "1200";
                }>;
            }> = [];
            const subgroups_independent_construct: string[] = [];
            for (const M_Wrapper of resources_group.groups) {
                if ("subgroups" in M_Wrapper) {
                    const subgroup_template_container_parent = M_Wrapper.subgroups.map(({ id, res }: any) => ({
                        name: id,
                        image: typeof res === "string" ? res : null,
                    }));
                    subgroups_parent_containers.push({
                        [M_Wrapper.id]: subgroup_template_container_parent,
                    });
                }
                if (!("parent" in M_Wrapper) && !("subgroups" in M_Wrapper)) {
                    subgroups_independent_construct.push(M_Wrapper.id);
                }
            }
            for (const container of subgroups_parent_containers) {
                const current_subgroup_name = Object.keys(container)[0];
                res_json.groups[current_subgroup_name] = {
                    is_composite: true,
                    subgroup: {},
                };
                const subgroup_list = Object.values(container);
                for (const subgroup of subgroup_list.flat()) {
                    const { name, image } = subgroup;
                    const resource = resources_group.groups.find((res) => res.id === name);
                    if (resource) {
                        (res_json.groups[current_subgroup_name].subgroup[name] as any) = image
                            ? Object.values(this.ConvertResourceGroupSubgroupContainsAtlas(resource, file_path))[0]
                            : Object.values(this.ConvertResourceGroupSubgroupFile(resource, file_path))[0];
                    }
                }
            }
            for (const k_current of subgroups_independent_construct) {
                res_json.groups[k_current] = {
                    is_composite: false,
                    subgroup: {},
                };
                const resource = resources_group.groups.find((res) => res.id === k_current);
                if (resource) {
                    res_json.groups[k_current].subgroup = this.ConvertResourceGroupSubgroupFile(resource, file_path);
                }
            }
            return res_json;
        }

        /**
         *
         * @param file_input - File in
         * @param output_file - Output
         * @param expand_path - Extends
         */

        public static CreateConversion<Required_Template extends Resources_Group_Structure_Template, Res_JSON_Structure extends res_json>(file_input: string, output_file: string, expand_path: "array" | "string"): void {
            Sen.Shell.PvZ2Shell.ConvertResourceGroupToResInfo(Sen.Script.Modules.FileSystem.Json.ReadJson(file_input), expand_path === "array" ? ExpandPath.Array : ExpandPath.String, output_file);
            return;
        }
    }

    /**
     * Conversion
     */

    export class ConvertToResourceGroup extends CheckResourceGroupResources {
        /**
         *
         * @param packet - Pass packet here
         * @param subgroup_parent_name - Pass "id", example "_1536", "_768"
         * @param subgroup_default_parent - Pass default parent which contains whole subgroups
         * @returns
         */
        private static ConvertSubgroupResInfoToResourceGroup<Template extends packet_data>(
            packet: Template,
            subgroup_parent_name: string,
            subgroup_default_parent: string,
            res_type: resolution,
            expand_path_for_array: boolean,
            file_path: string
        ): resource_atlas_and_sprites {
            const manifest_group_for_atlas_and_sprite: resource_atlas_and_sprites = {
                id: subgroup_parent_name,
                parent: subgroup_default_parent,
                res: res_type,
                resources: [],
                type: "simple",
            } as any;
            const resource_atlas_parent = Object.keys(packet.packet);
            for (let index = 0; index < resource_atlas_parent.length; ++index) {
                const M_Current: any = packet.packet[resource_atlas_parent[index]];
                const resource_atlas_children_sprites_id = Object.keys(M_Current.data);
                manifest_group_for_atlas_and_sprite.resources.push({
                    slot: 0,
                    id: resource_atlas_parent[index],
                    path: expand_path_for_array ? M_Current.path : M_Current.path.join("\\"),
                    type: M_Current.type,
                    atlas: true,
                    width: M_Current.dimension.width,
                    height: M_Current.dimension.height,
                    runtime: true,
                });
                for (let j_index = 0; j_index < resource_atlas_children_sprites_id.length; ++j_index) {
                    const k_default = M_Current.data[resource_atlas_children_sprites_id[j_index]].default;
                    manifest_group_for_atlas_and_sprite.resources.push({
                        slot: 0,
                        id: resource_atlas_children_sprites_id[j_index],
                        path: expand_path_for_array ? M_Current.data[resource_atlas_children_sprites_id[j_index]].path : M_Current.data[resource_atlas_children_sprites_id[j_index]].path.join("\\"),
                        type: M_Current.data[resource_atlas_children_sprites_id[j_index]].type,
                        parent: resource_atlas_parent[index],
                        ax: k_default.ax > 0 ? k_default.ax : Math.abs(k_default.ax),
                        ay: k_default.ay > 0 ? k_default.ay : Math.abs(k_default.ay),
                        aw: k_default.aw > 0 ? k_default.aw : Math.abs(k_default.aw),
                        ah: k_default.ah > 0 ? k_default.ah : Math.abs(k_default.ah),
                        x: k_default.x ? k_default.x : 0,
                        y: k_default.y ? k_default.y : 0,
                        cols: M_Current.data[resource_atlas_children_sprites_id[j_index]].default.cols,
                    });
                }
            }
            return manifest_group_for_atlas_and_sprite;
        }

        /**
         *
         * @param res_subgroup_children - Children
         * @param subgroup_id - Id
         * @param expand_path_for_array - Extends path
         * @param file_path - File path
         * @param subgroup_parent - Parent
         * @returns
         */

        private static ConvertResInfoToResourceGroupFile<Template extends packet_data, Value_Return extends Resource_File_Bundle>(
            res_subgroup_children: Template,
            subgroup_id: string,
            expand_path_for_array: boolean,
            file_path: string,
            subgroup_parent?: string
        ): Value_Return | Resource_File_Bundle {
            const template_resource_build: Value_Return | Resource_File_Bundle = {
                id: subgroup_id,
                resources: [],
                type: "simple",
            };
            if (subgroup_parent) {
                template_resource_build.parent = subgroup_parent;
            }
            const resource_data: Array<string> = Object.keys((res_subgroup_children as any).packet.data);
            for (let index: number = 0; index < resource_data.length; ++index) {
                const k_struct = (res_subgroup_children.packet.data as any)[resource_data[index]];
                this.CheckString(k_struct.type as string & any, file_path);
                const m_data: any = {
                    slot: 0,
                    id: resource_data[index],
                    path: expand_path_for_array ? k_struct.path : ((k_struct.path as Array<string> & any).join("\\") as string & any),
                    type: k_struct.type as string & any,
                };
                if (k_struct.forceOriginalVectorSymbolSize) {
                    m_data.forceOriginalVectorSymbolSize = k_struct.forceOriginalVectorSymbolSize;
                }
                if (k_struct.srcpath) {
                    m_data.srcpath = expand_path_for_array ? k_struct.srcpath : ((k_struct.srcpath as Array<string> & any).join("\\") as string & any);
                }
                template_resource_build.resources.push(m_data);
            }
            return template_resource_build;
        }

        /**
         *
         * @param subgroup - Pass subgroup
         * @param subgroup_parent - Parent
         * @param file_path - File path
         * @returns
         */

        private static GenerateResourceGroupComposite<Template extends subgroup_children>(subgroup: Template, subgroup_parent: string, file_path: string): composite_object {
            const composite_object: composite_object = {
                id: subgroup_parent,
                subgroups: [],
                type: "composite",
            };
            const subgroups_keys = Object.keys(subgroup);
            for (let index = 0; index < subgroups_keys.length; ++index) {
                const current = {
                    id: subgroups_keys[index],
                };
                const k_struct = subgroup[subgroups_keys[index]];
                if (k_struct.type && this.CheckString(k_struct.type, file_path)) {
                    (current as any).res = k_struct.type;
                }
                composite_object.subgroups.push(current);
            }
            return composite_object;
        }

        /**
         *
         * @param res_json - ResInfo
         * @param file_path - File path
         * @returns
         */

        public static DoAllProcess<Res_Json_Template extends res_json, Resource_json_Template extends Resources_Group_Structure_Template>(res_json: Res_Json_Template, file_path: string): Resource_json_Template {
            this.CheckResourceGroup(res_json as any, file_path);
            const resources_json: any = {
                version: 1,
                content_version: 1,
                slot_count: 0,
                groups: [],
            };
            const res_json_groups = res_json.groups;
            const subgroups_key = Object.keys(res_json_groups);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("popcap_debug_dump"));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("res_info_count"), [subgroups_key[0], `${subgroups_key.length}`])}`);
            for (let index = 0; index < subgroups_key.length; ++index) {
                if (res_json.groups[subgroups_key[index]].is_composite) {
                    const current: any = res_json.groups[subgroups_key[index]].subgroup;
                    const subgroup_keys = Object.keys(current);
                    (resources_json as any).groups.push(this.GenerateResourceGroupComposite<subgroup_children>(current, subgroups_key[index], file_path));
                    for (let j_index = 0; j_index < subgroup_keys.length; ++j_index) {
                        const current_k = current[subgroup_keys[j_index]];
                        if (current_k.type && this.CheckString(current_k.type, file_path)) {
                            (resources_json as any).groups.push(this.ConvertSubgroupResInfoToResourceGroup<packet_data>(current_k, subgroup_keys[j_index], subgroups_key[index], current_k.type, res_json.expand_path === "array", file_path));
                        } else {
                            (resources_json as any).groups.push(
                                this.ConvertResInfoToResourceGroupFile<packet_data, Resource_File_Bundle>(current_k, subgroup_keys[j_index], res_json.expand_path === "array", file_path, subgroups_key[index])
                            );
                        }
                    }
                } else {
                    const current = res_json.groups[subgroups_key[index]].subgroup;
                    const subgroup_keys = Object.keys(current);
                    for (let j_index = 0; j_index < subgroup_keys.length; ++j_index) {
                        (resources_json as any).groups.push(
                            this.ConvertResInfoToResourceGroupFile<packet_data, Resource_File_Bundle>(current[subgroup_keys[j_index]] as any, subgroup_keys[j_index], res_json.expand_path === "array", file_path)
                        );
                    }
                }
            }
            return resources_json;
        }

        /**
         *
         * @param file_input - Pass file in
         * @param output_file - Outfile
         * @returns Converted
         */

        public static CreateConversion(file_input: string, output_file: string): void {
            Sen.Shell.PvZ2Shell.ConvertResInfoToResourceGroup(output_file, file_input);
            return;
        }
    }

    /**
     * Structure
     */

    export class SplitResInfoResources extends CheckResourceGroupResources {
        /**
         *
         * @param res_json - Res Info
         * @param file_path - File path
         * @returns
         */

        private static SetDefaultInfo<Template extends res_json, Value extends Output_Value>(res_json: Template, file_path: string): Value | Output_Value {
            this.CheckResInfoJsonForWork(res_json, file_path);
            const info_json: Output_Value | Value = {
                information: {
                    expand_path: res_json.expand_path as "string" | "array",
                },
                groups: {},
            };
            const info_groups: Array<string> = Object.keys(res_json.groups);
            for (let i: number = 0; i < info_groups.length; ++i) {
                info_json.groups[info_groups[i]] = this.GenerateSubgroup(res_json.groups[info_groups[i]]) as any;
            }
            return info_json;
        }

        /**
         *
         * @param res_json - Res Info
         * @returns
         */

        private static GenerateSubgroup<Template extends res_json_children, Value extends small_bundle_info_json>(res_json: Template): Value | small_bundle_info_json {
            const info_json: Value | small_bundle_info_json = {
                is_composite: res_json.is_composite,
                subgroups: Object.keys(res_json.subgroup),
            };
            return info_json;
        }

        /**
         *
         * @param file_path - File path
         * @param save_directory - Save directory
         * @returns
         */

        public static DoWholeProcess<Template extends res_json>(
            file_path: string,
            save_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_path)}`, `${Sen.Shell.Path.Parse(file_path).name}.info`))
        ): void {
            const groups_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${save_directory}`, `groups`));
            const res_json: Template = Sen.Script.Modules.FileSystem.Json.ReadJson<Template>(file_path) as Template;
            const info_json: Output_Value = this.SetDefaultInfo<Template, Output_Value>(res_json, file_path);
            Sen.Shell.FileSystem.CreateDirectory(Sen.Shell.Path.Resolve(`${save_directory}`));
            Sen.Script.Modules.FileSystem.Json.WriteJson<Output_Value>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${save_directory}`, `info.json`)), info_json, false);
            Sen.Shell.FileSystem.CreateDirectory(groups_directory);
            const info_json_groups_keys: Array<string> = Object.keys(info_json.groups);
            for (let index: number = 0; index < info_json_groups_keys.length; ++index) {
                const subgroup_keys: Array<string> = Object.keys(res_json.groups[info_json_groups_keys[index]].subgroup);
                for (let j_index: number = 0; j_index < subgroup_keys.length; ++j_index) {
                    Sen.Script.Modules.FileSystem.Json.WriteJson(
                        Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${groups_directory}`, `${subgroup_keys[j_index]}.json`)),
                        res_json.groups[info_json_groups_keys[index]].subgroup[subgroup_keys[j_index]],
                        false
                    );
                }
            }
            return;
        }
        /**
         *
         * @param file_path - Pass file, etc: ".json"
         * @param output_dir - Pass output directory
         * @returns
         */
        public static CreateConversion(file_path: string, output_dir: string): void {
            this.DoWholeProcess<res_json>(file_path, output_dir);
            return;
        }
    }

    /**
     * Merge ResInfo
     */

    export class MergeResInfoJson extends CheckResourceGroupResources {
        /**
         *
         * @param res_json - Res Info
         * @returns Checker
         */

        private static CheckInfoJson<Template extends Output_Value>(res_json: Template): res_json is Template {
            if (!("information" in res_json)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_information_is_null"));
            }
            if (!("expand_path" in res_json.information)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_expand_path_is_null"));
            }
            if (res_json.information.expand_path !== "array" && res_json.information.expand_path !== "string") {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_expand_path_does_not_meet_requirement"));
            }
            if (!("groups" in res_json)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_groups_is_null"));
            }
            return true;
        }

        /**
         *
         * @param res_json - Res Info
         * @param file_path - File Path
         * @returns
         */

        private static CheckDataJson<Template extends small_bundle_info_json>(res_json: Template, file_path: string): res_json is Template {
            if (!("is_composite" in res_json)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_is_composite_is_null"));
            }
            if (typeof res_json.is_composite !== "boolean") {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_is_composite_is_not_type_of_boolean"));
            }
            if (!("subgroups" in res_json)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_is_subgroups_is_null"));
            }
            if (!Array.isArray(res_json.subgroups)) {
                throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("property_is_subgroups_is_not_type_of_list"));
            }
            return true;
        }

        /**
         *
         * @param directory_path - Provide directory
         * @returns Test
         */

        private static CheckDirectoryInformation(directory_path: string): void {
            if (!Sen.Shell.FileSystem.DirectoryExists(directory_path)) {
                throw new Sen.Script.Modules.Exceptions.MissingDirectory(``, directory_path);
            }
            const info_json: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `info.json`));
            if (!Sen.Shell.FileSystem.FileExists(info_json)) {
                throw new Sen.Script.Modules.Exceptions.MissingFile(``, info_json);
            }
            const groups: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `groups`));
            if (!Sen.Shell.FileSystem.DirectoryExists(groups)) {
                throw new Sen.Script.Modules.Exceptions.MissingDirectory(``, groups);
            }
            return;
        }

        /**
         *
         * @param directory_path - Provide directory
         * @param collections - Provide list
         * @returns
         */

        private static CheckGroups(directory_path: string, collections: Array<string>): void {
            for (const file of collections) {
                const file_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `${file}.json`));
                if (!Sen.Shell.FileSystem.FileExists(file_path)) {
                    throw new Sen.Script.Modules.Exceptions.MissingFile(``, file_path);
                }
            }
            return;
        }

        /**
         *
         * @param directory_path - Provide directory
         * @param output_file - Output file
         * @returns
         */

        public static DoAllProcess<Template extends Output_Value>(
            directory_path: string,
            output_file: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(directory_path)}`, `${Sen.Shell.Path.Parse(directory_path).name}.json`))
        ): void {
            this.CheckDirectoryInformation(directory_path);
            const info_json_information: Template = Sen.Script.Modules.FileSystem.Json.ReadJson(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `info.json`))) as Template;
            this.CheckInfoJson<Output_Value>(info_json_information);
            const res_json: res_json = {
                expand_path: info_json_information.information.expand_path as "array" | "string",
                groups: {},
            };
            const group_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `groups`));
            const groups_inventory: Array<ResourcesForWork> = new Array();
            const groups_collection: Array<string> = Object.keys(info_json_information.groups);
            this.CheckGroups(
                group_directory,
                groups_collection.reduce((result, current) => {
                    result.push(...(info_json_information.groups[current] as any).subgroups);
                    return result;
                }, new Array<string>())
            );
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("res_info_count"), [groups_collection[0], `${groups_collection.length}`])
            );
            for (let index: number = 0; index < groups_collection.length; ++index) {
                const group: string = groups_collection[index];
                const data_json: small_bundle_info_json = info_json_information.groups[groups_collection[index]] as small_bundle_info_json & any;
                this.CheckDataJson<small_bundle_info_json>(data_json, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${directory_path}`, `info.json`)));
                groups_inventory.push({
                    ...data_json,
                    group_parent: group,
                });
            }
            for (let index: number = 0; index < groups_inventory.length; ++index) {
                res_json.groups[groups_inventory[index].group_parent] = {
                    is_composite: groups_inventory[index].is_composite,
                    subgroup: {},
                };
                for (let j_index: number = 0; j_index < groups_inventory[index].subgroups.length; ++j_index) {
                    res_json.groups[groups_inventory[index].group_parent].subgroup[groups_inventory[index].subgroups[j_index]] = Sen.Script.Modules.FileSystem.Json.ReadJson(
                        Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${group_directory}`, `${groups_inventory[index].subgroups[j_index]}.json`))
                    );
                }
            }
            Sen.Script.Modules.FileSystem.Json.WriteJson(output_file, res_json, false);
            return;
        }
        /**
         *
         * @param directory_path - Pass directory here
         * @param output_file - Pass output file location, etc: "C:/Haruma-VN/test.json"
         */
        public static CreateConversion(directory_path: string, output_file?: string): void {
            this.DoAllProcess<Output_Value>(directory_path, output_file);
            return;
        }
    }
}
