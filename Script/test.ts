namespace Runtime.Script.Test {
    abstract class CheckOfficialResources {
        protected static CheckIntegerNumber(num: number, property: string, id: string, file_path: string): boolean {
            if (!Number.isInteger(num)) {
                throw new Runtime.Script.Modules.Exceptions.WrongDataType(
                    `${Runtime.Script.Modules.System.Default.Localization.RegexReplace(
                        Runtime.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `${property}`,
                            `${id}`,
                            `${Runtime.Script.Modules.System.Default.Localization.GetString("integer")}`,
                            `${num}`,
                        ],
                    )}`,
                    property,
                    file_path,
                    Runtime.Script.Modules.System.Default.Localization.GetString("integer"),
                );
            }
            return true;
        }
        protected static CheckWholeData(
            sub_resource_data: Resource_Structure_Template,
            file_path: string,
        ): sub_resource_data is Resource_Structure_Template {
            if (
                !("resources" in sub_resource_data) ||
                sub_resource_data.resources === undefined ||
                sub_resource_data.resources === null ||
                sub_resource_data.resources === void 0
            ) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "resources",
                    ),
                    "resources",
                    file_path,
                );
            }
            if (
                !("id" in sub_resource_data) ||
                sub_resource_data.id === undefined ||
                sub_resource_data.id === null ||
                sub_resource_data.id === void 0
            ) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "id",
                    ),
                    "id",
                    file_path,
                );
            }
            return true;
        }
        protected static CheckOfficial<Template extends Resources_Group_Structure_Template>(
            resources_group: Template,
            file_path: string,
        ): resources_group is Template {
            if (!("groups" in resources_group)) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "groups",
                    ),
                    "groups",
                    file_path,
                );
            }
            return true;
        }
        protected static CheckSubgroupChildrenDataImage<Resource_Template extends Resource_Structure_Template>(
            sub_resource_data: Resource_Template,
            file_path: string,
        ): sub_resource_data is Resource_Template {
            this.CheckWholeData(sub_resource_data, file_path);
            if (
                !("res" in sub_resource_data) ||
                sub_resource_data.res === undefined ||
                sub_resource_data.res === null ||
                sub_resource_data.res === void 0
            ) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "res",
                    ),
                    "res",
                    file_path,
                );
            }
            return true;
        }
        protected static CheckUnofficialJsonForWork<Template extends res_json>(
            res_json: Template,
            file_path: string,
        ): res_json is Template {
            if (!("expand_path" in res_json)) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "expand_path",
                    ),
                    "expand_path",
                    file_path,
                );
            }
            if (!(res_json.expand_path === "array") && !(res_json.expand_path === ("string" as any))) {
                throw new Runtime.Script.Modules.Exceptions.WrongDataType(
                    Runtime.Script.Modules.System.Default.Localization.RegexReplace(
                        Runtime.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            "expand_path",
                            Path.Parse(file_path).basename,
                            Runtime.Script.Modules.System.Default.Localization.GetString(
                                "string_or_list_of_collections",
                            ),
                            res_json.expand_path,
                        ],
                    ),
                    "expand_path",
                    file_path,
                    Runtime.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections"),
                );
            }
            if (!("groups" in res_json)) {
                throw new Runtime.Script.Modules.Exceptions.MissingProperty(
                    Runtime.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(
                        /\{\}/g,
                        "groups",
                    ),
                    "groups",
                    file_path,
                );
            }
            return true;
        }
        protected static CheckString(assert_test: any, file_path: string): assert_test is string {
            if (typeof assert_test !== "string") {
                throw new Error(
                    Runtime.Script.Modules.System.Default.Localization.GetString("not_a").replace(
                        /\{\}/g,
                        Runtime.Script.Modules.System.Default.Localization.GetString("string"),
                    ),
                );
            }
            return true;
        }
    }
    export class ResourceConversion extends CheckOfficialResources {
        private static CheckOfficialPathType<Template extends Resources_Group_Structure_Template>(
            resource_json: Template,
        ): "array" | "string" {
            for (let index: number = 0; index < resource_json.groups.length; ++index) {
                if ("resources" in resource_json.groups[index]) {
                    for (let j_index: number = 0; j_index < resource_json.groups[index].resources.length; ++j_index) {
                        if (
                            "path" in resource_json.groups[index].resources[j_index] &&
                            Array.isArray(resource_json.groups[index].resources[j_index])
                        ) {
                            return "array";
                        } else {
                            return "string";
                        }
                    }
                }
            }
            throw new Error(Runtime.Script.Modules.System.Default.Localization.GetString("path_is_invalid"));
        }
        private static ConvertOfficialSubgroupFile<
            Template extends Resource_Structure_Template,
            Value extends subgroup_children,
        >(sub_resource_data: Template, file_path: string): Value {
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
            for (let index: number = 0; index < sub_resource_data.resources?.length; ++index) {
                (res_json_conversion[sub_resource_data.id].packet.data as any)[sub_resource_data.resources[index].id] =
                    sub_resource_data.resources[index].srcpath !== undefined &&
                    sub_resource_data.resources[index].srcpath !== null &&
                    sub_resource_data.resources[index].srcpath !== void 0 &&
                    (Array.isArray(sub_resource_data.resources[index].srcpath) ||
                        typeof sub_resource_data.resources[index].srcpath === "string")
                        ? {
                              type: sub_resource_data.resources[index].type as string,
                              path: Array.isArray(sub_resource_data.resources[index].path)
                                  ? sub_resource_data.resources[index].path
                                  : ((sub_resource_data.resources[index].path as string).split("\\") as Array<string> &
                                        any),
                              forceOriginalVectorSymbolSize:
                                  sub_resource_data.resources[index].forceOriginalVectorSymbolSize,
                              srcpath: Array.isArray(sub_resource_data.resources[index].srcpath)
                                  ? sub_resource_data.resources[index].srcpath
                                  : ((sub_resource_data.resources[index].srcpath as string).split(
                                        "\\",
                                    ) as Array<string> & any),
                          }
                        : {
                              type: sub_resource_data.resources[index].type as string,
                              path: Array.isArray(sub_resource_data.resources[index].path)
                                  ? sub_resource_data.resources[index].path
                                  : ((sub_resource_data.resources[index].path as string).split("\\") as Array<string> &
                                        any),
                              forceOriginalVectorSymbolSize:
                                  sub_resource_data.resources[index].forceOriginalVectorSymbolSize,
                          };
            }
            return res_json_conversion;
        }
        private static ConvertOfficialSubgroupContainsAtlas<Template extends Resource_Structure_Template>(
            sub_resource_data: Template,
            file_path: string,
        ): sprite_data {
            this.CheckSubgroupChildrenDataImage<Resource_Structure_Template>(sub_resource_data, file_path);
            const res_json_conversion: sprite_data = {
                [sub_resource_data.id]: {
                    type: sub_resource_data.res !== undefined ? (sub_resource_data.res as resolution) : null,
                    packet: {},
                },
            };
            for (let index: number = 0; index < sub_resource_data.resources.length; ++index) {
                if ("atlas" in sub_resource_data.resources[index]) {
                    this.CheckIntegerNumber(
                        sub_resource_data.resources[index].width as number,
                        "width",
                        sub_resource_data.resources[index].id,
                        file_path,
                    );
                    this.CheckIntegerNumber(
                        sub_resource_data.resources[index].height as number,
                        "height",
                        sub_resource_data.resources[index].id,
                        file_path,
                    );
                    res_json_conversion[sub_resource_data.id].packet[sub_resource_data.resources[index].id] = {
                        type: sub_resource_data.resources[index].type,
                        path: Array.isArray(sub_resource_data.resources[index].path)
                            ? sub_resource_data.resources[index].path
                            : ((sub_resource_data.resources[index].path as string).split("\\") as Array<string> & any),
                        dimension: {
                            width: sub_resource_data.resources[index].width,
                            height: sub_resource_data.resources[index].height,
                        },
                        data: {},
                    } as any;
                    for (let j_index: number = 0; j_index < sub_resource_data.resources.length; ++j_index) {
                        if (sub_resource_data.resources[j_index].parent === sub_resource_data.resources[index].id) {
                            res_json_conversion[sub_resource_data.id].packet[
                                sub_resource_data.resources[index].id
                            ].data[sub_resource_data.resources[j_index].id] = {
                                default: {
                                    ax:
                                        sub_resource_data.resources[j_index].ax !== undefined &&
                                        sub_resource_data.resources[j_index].ax !== null &&
                                        sub_resource_data.resources[j_index].ax !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].ax as number,
                                            "ax",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        ) &&
                                        (sub_resource_data.resources[j_index].ax as number) > 0
                                            ? sub_resource_data.resources[j_index].ax
                                            : Math.abs(sub_resource_data.resources[j_index].ax as number),
                                    ay:
                                        sub_resource_data.resources[j_index].ay !== undefined &&
                                        sub_resource_data.resources[j_index].ay !== null &&
                                        sub_resource_data.resources[j_index].ay !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].ay as number,
                                            "ay",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        ) &&
                                        (sub_resource_data.resources[j_index].ay as number) > 0
                                            ? sub_resource_data.resources[j_index].ay
                                            : Math.abs(sub_resource_data.resources[j_index].ay as number),
                                    aw:
                                        sub_resource_data.resources[j_index].aw !== undefined &&
                                        sub_resource_data.resources[j_index].aw !== null &&
                                        sub_resource_data.resources[j_index].aw !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].aw as number,
                                            "aw",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        ) &&
                                        (sub_resource_data.resources[j_index].aw as number) > 0
                                            ? sub_resource_data.resources[j_index].aw
                                            : Math.abs(sub_resource_data.resources[j_index].aw as number),
                                    ah:
                                        sub_resource_data.resources[j_index].ah !== undefined &&
                                        sub_resource_data.resources[j_index].ah !== null &&
                                        sub_resource_data.resources[j_index].ah !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].ah as number,
                                            "ah",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        ) &&
                                        (sub_resource_data.resources[j_index].ah as number) > 0
                                            ? sub_resource_data.resources[j_index].ah
                                            : Math.abs(sub_resource_data.resources[j_index].ah as number),
                                    x:
                                        sub_resource_data.resources[j_index].x !== undefined &&
                                        sub_resource_data.resources[j_index].x !== null &&
                                        sub_resource_data.resources[j_index].x !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].x as number,
                                            "x",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        )
                                            ? sub_resource_data.resources[j_index].x
                                            : 0,
                                    y:
                                        sub_resource_data.resources[j_index].y !== undefined &&
                                        sub_resource_data.resources[j_index].y !== null &&
                                        sub_resource_data.resources[j_index].y !== void 0 &&
                                        this.CheckIntegerNumber(
                                            sub_resource_data.resources[j_index].y as number,
                                            "y",
                                            sub_resource_data.resources[j_index].id,
                                            file_path,
                                        )
                                            ? sub_resource_data.resources[j_index].y
                                            : 0,
                                    cols: sub_resource_data.resources[j_index].cols,
                                },
                                path: Array.isArray(sub_resource_data.resources[j_index].path)
                                    ? sub_resource_data.resources[j_index].path
                                    : ((sub_resource_data.resources[j_index].path as string).split(
                                          "\\",
                                      ) as Array<string> & any),
                                type: sub_resource_data.resources[j_index].type as string,
                            };
                        }
                    }
                }
            }
            return res_json_conversion;
        }
        public static DoAllProcess<Template extends Resources_Group_Structure_Template, Value_Return extends res_json>(
            resources_group: Template,
            file_path: string,
        ): Value_Return {
            this.CheckOfficial<Template>(resources_group, file_path);
            const res_json: Value_Return = {
                expand_path: this.CheckOfficialPathType<Resources_Group_Structure_Template>(resources_group),
                groups: {},
            } as Value_Return;
            const subgroups_parent_containers: Array<{
                [x: string]: Array<{
                    name: string;
                    image: null | "1536" | "768" | "384" | "640" | "1200";
                }>;
            }> = new Array();
            const subgroups_independent_construct: Array<string> = new Array();
            for (let index: number = 0; index < resources_group.groups.length; ++index) {
                if ("subgroups" in resources_group.groups[index]) {
                    const subgroup_template_container_parent: Array<{
                        name: string;
                        image: null | "1536" | "768" | "384" | "640" | "1200";
                    }> = new Array();
                    for (let j_index: number = 0; j_index < resources_group.groups[index].subgroups.length; ++j_index) {
                        subgroup_template_container_parent.push({
                            name: resources_group.groups[index].subgroups[j_index].id as string,
                            image:
                                resources_group.groups[index].subgroups[j_index].res !== undefined &&
                                resources_group.groups[index].subgroups[j_index].res !== null &&
                                resources_group.groups[index].subgroups[j_index].res !== void 0 &&
                                typeof resources_group.groups[index].subgroups[j_index].res === "string"
                                    ? (resources_group.groups[index].subgroups[j_index].res as
                                          | "1536"
                                          | "768"
                                          | "384"
                                          | "640"
                                          | "1200")
                                    : null,
                        });
                    }
                    subgroups_parent_containers.push({
                        [resources_group.groups[index].id]: subgroup_template_container_parent,
                    });
                }
                if (!("parent" in resources_group.groups[index]) && !("subgroups" in resources_group.groups[index])) {
                    subgroups_independent_construct.push(resources_group.groups[index].id);
                }
            }
            for (let index: number = 0; index < subgroups_parent_containers.length; ++index) {
                const current_subgroup_name: string = Object.keys(subgroups_parent_containers[index])[0];
                res_json.groups[current_subgroup_name] = {
                    is_composite: true,
                    subgroup: {},
                };
                const subgroup_list: Array<
                    Array<{
                        name: string;
                        image: null | "1536" | "768" | "384" | "640" | "1200";
                    }>
                > = Object.values(subgroups_parent_containers[index]);
                for (let j_index: number = 0; j_index < subgroup_list.length; ++j_index) {
                    for (let k_index: number = 0; k_index < subgroup_list[j_index].length; ++k_index) {
                        res_json.groups[current_subgroup_name].subgroup[subgroup_list[j_index][k_index].name] =
                            subgroup_list[j_index][k_index].image !== null
                                ? Object.values(
                                      this.ConvertOfficialSubgroupContainsAtlas(
                                          resources_group.groups.filter(
                                              (res) => res.id === subgroup_list[j_index][k_index].name,
                                          )[0] as any,
                                          file_path,
                                      ),
                                  )[0]
                                : (Object.values(
                                      this.ConvertOfficialSubgroupFile(
                                          resources_group.groups.filter(
                                              (res) => res.id === subgroup_list[j_index][k_index].name,
                                          )[0] as any,
                                          file_path,
                                      ) as any,
                                  )[0] as any);
                    }
                }
            }
            for (let index: number = 0; index < subgroups_independent_construct.length; ++index) {
                res_json.groups[subgroups_independent_construct[index]] = {
                    is_composite: false,
                    subgroup: {},
                };
                res_json.groups[subgroups_independent_construct[index]].subgroup = this.ConvertOfficialSubgroupFile(
                    resources_group.groups.filter((res) => res.id === subgroups_independent_construct[index])[0],
                    file_path,
                );
            }
            return res_json;
        }
        public static CreateConversion<
            Required_Template extends Resources_Group_Structure_Template,
            Res_JSON_Structure extends res_json,
        >(file_input: string, output_file: string): void {
            const resource_json: Required_Template = Runtime.Script.Modules.FileSystem.Json.ReadJson<Required_Template>(
                file_input,
            ) as Required_Template;
            Runtime.Script.Modules.FileSystem.Json.WriteJson<Res_JSON_Structure>(
                output_file,
                this.DoAllProcess<Required_Template, Res_JSON_Structure>(resource_json, file_input),
            );
        }
    }
    export class ConvertToOfficial extends CheckOfficialResources {
        /**
         *
         * @param packet - Pass packet here
         * @param subgroup_parent_name - Pass "id", example "_1536", "_768"
         * @param subgroup_default_parent - Pass default parent which contains whole subgroups
         * @returns
         */
        private static ConvertSubgroupUnofficialToOfficial<Template extends packet_data>(
            packet: Template,
            subgroup_parent_name: string,
            subgroup_default_parent: string,
            res_type: resolution,
            expand_path_for_array: boolean,
            file_path: string,
        ): resource_atlas_and_sprites {
            const manifest_group_for_atlas_and_sprite: resource_atlas_and_sprites = {
                id: subgroup_parent_name,
                parent: subgroup_default_parent,
                res: res_type as string,
                resources: [],
                type: "simple",
            };
            const resource_atlas_parent: Array<string> = Object.keys(packet.packet);
            for (let index: number = 0; index < resource_atlas_parent.length; ++index) {
                const resource_atlas_children_sprites_id: Array<string> = Object.keys(
                    packet.packet[resource_atlas_parent[index]].data,
                );
                manifest_group_for_atlas_and_sprite.resources.push({
                    slot: 0,
                    id: resource_atlas_parent[index],
                    path: expand_path_for_array
                        ? packet.packet[resource_atlas_parent[index]].path
                        : ((packet.packet[resource_atlas_parent[index]].path as Array<string> & any).join(
                              "\\",
                          ) as string & any),
                    type: (packet.packet[resource_atlas_parent[index]] as any).type,
                    atlas: true,
                    width: (packet.packet[resource_atlas_parent[index]].dimension as any).width,
                    height: (packet.packet[resource_atlas_parent[index]].dimension as any).height,
                    runtime: true,
                });
                for (let j_index: number = 0; j_index < resource_atlas_children_sprites_id.length; ++j_index) {
                    this.CheckIntegerNumber(
                        (packet.packet[resource_atlas_parent[index]].data as any)[
                            resource_atlas_children_sprites_id[j_index]
                        ].default.ax,
                        "ax",
                        resource_atlas_children_sprites_id[j_index] as string,
                        file_path,
                    );
                    this.CheckIntegerNumber(
                        (packet.packet[resource_atlas_parent[index]].data as any)[
                            resource_atlas_children_sprites_id[j_index]
                        ].default.ay,
                        `ay`,
                        resource_atlas_children_sprites_id[j_index],
                        file_path,
                    );
                    this.CheckIntegerNumber(
                        (packet.packet[resource_atlas_parent[index]].data as any)[
                            resource_atlas_children_sprites_id[j_index]
                        ].default.ah,
                        `ah`,
                        resource_atlas_children_sprites_id[j_index],
                        file_path,
                    );
                    this.CheckIntegerNumber(
                        (packet.packet[resource_atlas_parent[index]].data as any)[
                            resource_atlas_children_sprites_id[j_index]
                        ].default.aw,
                        `aw`,
                        resource_atlas_children_sprites_id[j_index],
                        file_path,
                    );
                    manifest_group_for_atlas_and_sprite.resources.push(
                        (packet.packet[resource_atlas_parent[index]].data as any)[
                            resource_atlas_children_sprites_id[j_index]
                        ].default.cols !== undefined &&
                            (packet.packet[resource_atlas_parent[index]].data as any)[
                                resource_atlas_children_sprites_id[j_index]
                            ].default.cols !== null &&
                            (packet.packet[resource_atlas_parent[index]].data as any)[
                                resource_atlas_children_sprites_id[j_index]
                            ].default.cols !== void 0 &&
                            this.CheckIntegerNumber(
                                (packet.packet[resource_atlas_parent[index]].data as any)[
                                    resource_atlas_children_sprites_id[j_index]
                                ].default.cols,
                                `cols`,
                                resource_atlas_children_sprites_id[j_index],
                                file_path,
                            )
                            ? {
                                  slot: 0,
                                  id: resource_atlas_children_sprites_id[j_index],
                                  path: expand_path_for_array
                                      ? (packet.packet[resource_atlas_parent[index]].data as any)[
                                            resource_atlas_children_sprites_id[j_index]
                                        ].path
                                      : ((packet.packet[resource_atlas_parent[index]].data as any)[
                                            resource_atlas_children_sprites_id[j_index]
                                        ].path.join("\\") as string & any),
                                  type: (packet.packet[resource_atlas_parent[index]].data as any)[
                                      resource_atlas_children_sprites_id[j_index]
                                  ].type,
                                  parent: resource_atlas_parent[index],
                                  ax:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ax,
                                          `ax`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ax
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ax,
                                            ),
                                  ay:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ay,
                                          `ay`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ay
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ay,
                                            ),
                                  aw:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.aw,
                                          `aw`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.aw
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.aw,
                                            ),
                                  ah:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ah,
                                          `ah`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ah
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ah,
                                            ),
                                  x:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.x,
                                          `x`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      )
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.x
                                          : 0,
                                  y:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.y,
                                          `y`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      )
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.y
                                          : 0,
                                  cols: (packet.packet[resource_atlas_parent[index]].data as any)[
                                      resource_atlas_children_sprites_id[j_index]
                                  ].default.cols,
                              }
                            : {
                                  slot: 0,
                                  id: resource_atlas_children_sprites_id[j_index],
                                  path: expand_path_for_array
                                      ? (packet.packet[resource_atlas_parent[index]].data as any)[
                                            resource_atlas_children_sprites_id[j_index]
                                        ].path
                                      : ((packet.packet[resource_atlas_parent[index]].data as any)[
                                            resource_atlas_children_sprites_id[j_index]
                                        ].path.join("\\") as string & any),
                                  type: (packet.packet[resource_atlas_parent[index]].data as any)[
                                      resource_atlas_children_sprites_id[j_index]
                                  ].type,
                                  parent: resource_atlas_parent[index],
                                  ax:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ax,
                                          `ax`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ax > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ax
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ax,
                                            ),
                                  ay:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ay,
                                          `ay`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ay > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ay
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ay,
                                            ),
                                  aw:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.aw,
                                          `aw`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.aw > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.aw
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.aw,
                                            ),
                                  ah:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.ah,
                                          `ah`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      ) &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.ah > 0
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.ah
                                          : Math.abs(
                                                (packet.packet[resource_atlas_parent[index]] as any).data[
                                                    resource_atlas_children_sprites_id[j_index]
                                                ].default.ah,
                                            ),
                                  x:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.x !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.x,
                                          `x`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      )
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.x
                                          : 0,
                                  y:
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== undefined &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== null &&
                                      (packet.packet[resource_atlas_parent[index]] as any).data[
                                          resource_atlas_children_sprites_id[j_index]
                                      ].default.y !== void 0 &&
                                      this.CheckIntegerNumber(
                                          (packet.packet[resource_atlas_parent[index]] as any).data[
                                              resource_atlas_children_sprites_id[j_index]
                                          ].default.y,
                                          `y`,
                                          resource_atlas_children_sprites_id[j_index],
                                          file_path,
                                      )
                                          ? (packet.packet[resource_atlas_parent[index]] as any).data[
                                                resource_atlas_children_sprites_id[j_index]
                                            ].default.y
                                          : 0,
                              },
                    );
                }
            }
            return manifest_group_for_atlas_and_sprite;
        }
        private static ConvertUnofficialToOfficialFile<
            Template extends packet_data,
            Value_Return extends Resource_File_Bundle,
        >(
            res_subgroup_children: Template,
            subgroup_id: string,
            expand_path_for_array: boolean,
            file_path: string,
            subgroup_parent?: string,
        ): Value_Return | Resource_File_Bundle {
            const template_resource_build: Value_Return | Resource_File_Bundle = subgroup_parent
                ? {
                      id: subgroup_id,
                      parent: subgroup_parent,
                      resources: [],
                      type: "simple",
                  }
                : {
                      id: subgroup_id,
                      resources: [],
                      type: "simple",
                  };
            const resource_data: Array<string> = Object.keys((res_subgroup_children as any).packet.data);
            for (let index: number = 0; index < resource_data.length; ++index) {
                this.CheckString(
                    (res_subgroup_children.packet.data as any)[resource_data[index]].type as string & any,
                    file_path,
                );
                template_resource_build.resources.push(
                    (res_subgroup_children.packet.data as any)[resource_data[index]].srcpath !== undefined &&
                        (res_subgroup_children.packet.data as any)[resource_data[index]].srcpath !== null &&
                        (res_subgroup_children.packet.data as any)[resource_data[index]].srcpath !== void 0 &&
                        Array.isArray((res_subgroup_children.packet.data as any)[resource_data[index]].srcpath)
                        ? {
                              slot: 0,
                              id: resource_data[index],
                              path: expand_path_for_array
                                  ? (res_subgroup_children.packet.data as any)[resource_data[index]].path
                                  : ((
                                        (res_subgroup_children.packet.data as any)[resource_data[index]]
                                            .path as Array<string> & any
                                    ).join("\\") as string & any),
                              type: (res_subgroup_children.packet.data as any)[resource_data[index]].type as string &
                                  any,
                              forceOriginalVectorSymbolSize: (res_subgroup_children.packet.data as any)[
                                  resource_data[index]
                              ].forceOriginalVectorSymbolSize,
                              srcpath: expand_path_for_array
                                  ? (res_subgroup_children.packet.data as any)[resource_data[index]].srcpath
                                  : ((
                                        (res_subgroup_children.packet.data as any)[resource_data[index]]
                                            .srcpath as Array<string> & any
                                    ).join("\\") as string & any),
                          }
                        : {
                              slot: 0,
                              id: resource_data[index],
                              path: expand_path_for_array
                                  ? (res_subgroup_children.packet.data as any)[resource_data[index]].path
                                  : ((
                                        (res_subgroup_children.packet.data as any)[resource_data[index]]
                                            .path as Array<string> & any
                                    ).join("\\") as string & any),
                              type: (res_subgroup_children.packet.data as any)[resource_data[index]].type as string &
                                  any,
                              forceOriginalVectorSymbolSize: (res_subgroup_children.packet.data as any)[
                                  resource_data[index]
                              ].forceOriginalVectorSymbolSize,
                          },
                );
            }
            return template_resource_build;
        }
        private static GenerateOfficialComposite<Template extends subgroup_children>(
            subgroup: Template,
            subgroup_parent: string,
            file_path: string,
        ): composite_object {
            const composite_object: composite_object = {
                id: subgroup_parent,
                subgroups: [],
                type: "composite",
            };
            const subgroups_keys: Array<string> = Object.keys(subgroup);
            for (let index: number = 0; index < subgroups_keys.length; ++index) {
                composite_object.subgroups.push(
                    subgroup[subgroups_keys[index]].type !== undefined &&
                        subgroup[subgroups_keys[index]].type !== null &&
                        subgroup[subgroups_keys[index]].type !== void 0 &&
                        this.CheckString(subgroup[subgroups_keys[index]].type, file_path)
                        ? {
                              id: subgroups_keys[index],
                              res: subgroup[subgroups_keys[index]].type,
                          }
                        : ({
                              id: subgroups_keys[index],
                          } as any),
                );
            }
            return composite_object;
        }
        public static DoAllProcess<
            Res_Json_Template extends res_json,
            Resource_json_Template extends Resources_Group_Structure_Template,
        >(res_json: Res_Json_Template, file_path: string): Resource_json_Template {
            this.CheckOfficial(res_json as any, file_path);
            const resources_json: Resource_json_Template = {
                version: 1,
                content_version: 1,
                slot_count: 0,
                groups: [],
            } as any & Resource_json_Template;
            const res_json_groups: subgroup_parent = res_json.groups;
            const subgroups_key: Array<string> = Object.keys(res_json_groups);
            for (let index: number = 0; index < subgroups_key.length; ++index) {
                if (res_json.groups[subgroups_key[index]].is_composite === true) {
                    const create_subgroup_placeholder: Array<string> = Object.keys(
                        res_json.groups[subgroups_key[index]].subgroup,
                    );
                    (resources_json as any).groups.push(
                        this.GenerateOfficialComposite<subgroup_children>(
                            res_json.groups[subgroups_key[index]].subgroup,
                            subgroups_key[index],
                            file_path,
                        ),
                    );
                    for (let j_index: number = 0; j_index < create_subgroup_placeholder.length; ++j_index) {
                        if (
                            res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                .type !== null &&
                            res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                .type !== undefined &&
                            res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                .type !== void 0 &&
                            this.CheckString(
                                res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                    .type,
                                file_path,
                            )
                        ) {
                            (resources_json as any).groups.push(
                                this.ConvertSubgroupUnofficialToOfficial<packet_data>(
                                    res_json.groups[subgroups_key[index]].subgroup[
                                        create_subgroup_placeholder[j_index]
                                    ] as any,
                                    create_subgroup_placeholder[j_index],
                                    subgroups_key[index],
                                    res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                        .type as resolution & any,
                                    res_json.expand_path === "array",
                                    file_path,
                                ),
                            );
                        } else {
                            (resources_json as any).groups.push(
                                this.ConvertUnofficialToOfficialFile<packet_data, Resource_File_Bundle>(
                                    res_json.groups[subgroups_key[index]].subgroup[
                                        create_subgroup_placeholder[j_index]
                                    ] as any,
                                    create_subgroup_placeholder[j_index],
                                    res_json.expand_path === "array",
                                    file_path,
                                    subgroups_key[index],
                                ),
                            );
                        }
                    }
                } else {
                    const create_subgroup_placeholder: Array<string> = Object.keys(
                        res_json.groups[subgroups_key[index]].subgroup,
                    );
                    for (let j_index: number = 0; j_index < create_subgroup_placeholder.length; ++j_index) {
                        (resources_json as any).groups.push(
                            this.ConvertUnofficialToOfficialFile<packet_data, Resource_File_Bundle>(
                                res_json.groups[subgroups_key[index]].subgroup[
                                    create_subgroup_placeholder[j_index]
                                ] as any,
                                create_subgroup_placeholder[j_index],
                                res_json.expand_path === "array",
                                file_path,
                            ),
                        );
                    }
                }
            }
            ((resources_json as any).groups satisfies Array<resource_atlas_and_sprites>).forEach(
                (element: resource_atlas_and_sprites, k_lambda_index: number) => {
                    if ("resources" in element) {
                        ((resources_json as any).groups[k_lambda_index].resources as Array<blank_slot>).forEach(
                            (resource_element: blank_slot, lambda_index: number) => {
                                ((resources_json as any).groups[k_lambda_index].resources as Array<blank_slot>)[
                                    lambda_index
                                ].slot = (resources_json as any).slot_count;
                                (resources_json as any).slot_count++;
                            },
                        );
                    }
                },
            );
            return resources_json;
        }
        public static CreateWholeConversion(file_input: string, output_file: string): void {
            const res_json: res_json = Runtime.Script.Modules.FileSystem.Json.ReadJson<res_json>(
                file_input,
            ) as res_json;
            Runtime.Script.Modules.FileSystem.Json.WriteJson(
                output_file,
                this.DoAllProcess<res_json, Resources_Group_Structure_Template>(res_json, file_input),
            );
        }
    }
    export class SplitUnofficialResources extends CheckOfficialResources {
        private static SetDefaultInfo<Template extends res_json, Value extends Output_Value>(
            res_json: Template,
            file_path: string,
        ): Value | Output_Value {
            this.CheckUnofficialJsonForWork(res_json, file_path);
            const info_json: Output_Value | Value = {
                information: {
                    expand_path: res_json.expand_path as "string" | "array",
                },
                groups: Object.keys(res_json.groups),
            };
            return info_json;
        }
        private static GenerateSubgroup<Template extends res_json_children, Value extends small_bundle_info_json>(
            res_json: Template,
        ): Value | small_bundle_info_json {
            const info_json: Value | small_bundle_info_json = {
                is_composite: res_json.is_composite,
                subgroups: Object.keys(res_json.subgroup),
            };
            return info_json;
        }
        private static CreateMultipleDirectory<Template extends Output_Value>(
            save_directory: string,
            info_json: Template,
        ): void {
            for (const directory of info_json.groups) {
                Fs.CreateDirectory(Path.Resolve(`${save_directory}/${directory}`));
            }
            return;
        }
        public static DoWholeProcess<Template extends res_json>(
            file_path: string,
            save_directory: string = Path.Resolve(`${Path.Dirname(file_path)}/${Path.Parse(file_path).name}.info`),
        ): void {
            const groups_directory: string = Path.Resolve(`${save_directory}/groups`);
            const res_json: Template = Runtime.Script.Modules.FileSystem.Json.ReadJson<Template>(file_path) as Template;
            const info_json: Output_Value = this.SetDefaultInfo<Template, Output_Value>(res_json, file_path);
            Fs.CreateDirectory(Path.Resolve(`${save_directory}`));
            Runtime.Script.Modules.FileSystem.Json.WriteJson<Output_Value>(
                Path.Resolve(Path.Resolve(`${save_directory}/info.json`)),
                info_json,
            );
            Fs.CreateDirectory(groups_directory);
            this.CreateMultipleDirectory<Output_Value>(groups_directory, info_json);
            for (let index: number = 0; index < info_json.groups.length; ++index) {
                const subgroup_info_json: small_bundle_info_json = this.GenerateSubgroup<
                    res_json_children,
                    small_bundle_info_json
                >(res_json.groups[info_json.groups[index]]);
                Runtime.Script.Modules.FileSystem.Json.WriteJson<small_bundle_info_json>(
                    Path.Resolve(`${groups_directory}/${info_json.groups[index]}/data.json`),
                    subgroup_info_json,
                );
                const directory_contain_whole_subgroups: string = `${groups_directory}/${info_json.groups[index]}/subgroup`;
                Fs.CreateDirectory(directory_contain_whole_subgroups);
                const subgroup_keys: Array<string> = Object.keys(res_json.groups[info_json.groups[index]].subgroup);
                for (let j_index: number = 0; j_index < subgroup_keys.length; ++j_index) {
                    Runtime.Script.Modules.FileSystem.Json.WriteJson(
                        Path.Resolve(`${directory_contain_whole_subgroups}/${subgroup_keys[j_index]}.json`),
                        res_json.groups[info_json.groups[index]].subgroup[subgroup_keys[j_index]],
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
}
