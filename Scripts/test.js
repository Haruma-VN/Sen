"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Test;
        (function (Test) {
            class CheckOfficialResources {
                static CheckIntegerNumber(num, property, id, file_path) {
                    if (!Number.isInteger(num)) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(`${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                            `${property}`,
                            `${id}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                            `${num}`,
                        ])}`, property, file_path, Sen.Script.Modules.System.Default.Localization.GetString("integer"));
                    }
                    return true;
                }
                static CheckWholeData(sub_resource_data, file_path) {
                    if (!("resources" in sub_resource_data) ||
                        sub_resource_data.resources === undefined ||
                        sub_resource_data.resources === null ||
                        sub_resource_data.resources === void 0) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "resources"), "resources", file_path);
                    }
                    if (!("id" in sub_resource_data) ||
                        sub_resource_data.id === undefined ||
                        sub_resource_data.id === null ||
                        sub_resource_data.id === void 0) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "id"), "id", file_path);
                    }
                    return true;
                }
                static CheckOfficial(resources_group, file_path) {
                    if (!("groups" in resources_group)) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "groups"), "groups", file_path);
                    }
                    return true;
                }
                static CheckSubgroupChildrenDataImage(sub_resource_data, file_path) {
                    this.CheckWholeData(sub_resource_data, file_path);
                    if (!("res" in sub_resource_data) ||
                        sub_resource_data.res === undefined ||
                        sub_resource_data.res === null ||
                        sub_resource_data.res === void 0) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "res"), "res", file_path);
                    }
                    return true;
                }
                static CheckUnofficialJsonForWork(res_json, file_path) {
                    if (!("expand_path" in res_json)) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "expand_path"), "expand_path", file_path);
                    }
                    if (!(res_json.expand_path === "array") && !(res_json.expand_path === "string")) {
                        throw new Sen.Script.Modules.Exceptions.WrongDataType(Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                            "expand_path",
                            Path.Parse(file_path).basename,
                            Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections"),
                            res_json.expand_path,
                        ]), "expand_path", file_path, Sen.Script.Modules.System.Default.Localization.GetString("string_or_list_of_collections"));
                    }
                    if (!("groups" in res_json)) {
                        throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_null").replace(/\{\}/g, "groups"), "groups", file_path);
                    }
                    return true;
                }
                static CheckString(assert_test, file_path) {
                    if (typeof assert_test !== "string") {
                        throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("not_a").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("string")));
                    }
                    return true;
                }
            }
            class ResourceConversion extends CheckOfficialResources {
                static CheckOfficialPathType(resource_json) {
                    for (let index = 0; index < resource_json.groups.length; ++index) {
                        if ("resources" in resource_json.groups[index]) {
                            for (let j_index = 0; j_index < resource_json.groups[index].resources.length; ++j_index) {
                                if ("path" in resource_json.groups[index].resources[j_index] &&
                                    Array.isArray(resource_json.groups[index].resources[j_index])) {
                                    return "array";
                                }
                                else {
                                    return "string";
                                }
                            }
                        }
                    }
                    throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("path_is_invalid"));
                }
                static ConvertOfficialSubgroupFile(sub_resource_data, file_path) {
                    this.CheckWholeData(sub_resource_data, file_path);
                    const res_json_conversion = {
                        [sub_resource_data.id]: {
                            type: null,
                            packet: {
                                type: "File",
                                data: {},
                            },
                        },
                    };
                    for (let index = 0; index < sub_resource_data.resources?.length; ++index) {
                        res_json_conversion[sub_resource_data.id].packet.data[sub_resource_data.resources[index].id] =
                            sub_resource_data.resources[index].srcpath !== undefined &&
                                sub_resource_data.resources[index].srcpath !== null &&
                                sub_resource_data.resources[index].srcpath !== void 0 &&
                                (Array.isArray(sub_resource_data.resources[index].srcpath) ||
                                    typeof sub_resource_data.resources[index].srcpath === "string")
                                ? {
                                    type: sub_resource_data.resources[index].type,
                                    path: Array.isArray(sub_resource_data.resources[index].path)
                                        ? sub_resource_data.resources[index].path
                                        : sub_resource_data.resources[index].path.split("\\"),
                                    forceOriginalVectorSymbolSize: sub_resource_data.resources[index].forceOriginalVectorSymbolSize,
                                    srcpath: Array.isArray(sub_resource_data.resources[index].srcpath)
                                        ? sub_resource_data.resources[index].srcpath
                                        : sub_resource_data.resources[index].srcpath.split("\\"),
                                }
                                : {
                                    type: sub_resource_data.resources[index].type,
                                    path: Array.isArray(sub_resource_data.resources[index].path)
                                        ? sub_resource_data.resources[index].path
                                        : sub_resource_data.resources[index].path.split("\\"),
                                    forceOriginalVectorSymbolSize: sub_resource_data.resources[index].forceOriginalVectorSymbolSize,
                                };
                    }
                    return res_json_conversion;
                }
                static ConvertOfficialSubgroupContainsAtlas(sub_resource_data, file_path) {
                    this.CheckSubgroupChildrenDataImage(sub_resource_data, file_path);
                    const res_json_conversion = {
                        [sub_resource_data.id]: {
                            type: sub_resource_data.res !== undefined ? sub_resource_data.res : null,
                            packet: {},
                        },
                    };
                    for (let index = 0; index < sub_resource_data.resources.length; ++index) {
                        if ("atlas" in sub_resource_data.resources[index]) {
                            this.CheckIntegerNumber(sub_resource_data.resources[index].width, "width", sub_resource_data.resources[index].id, file_path);
                            this.CheckIntegerNumber(sub_resource_data.resources[index].height, "height", sub_resource_data.resources[index].id, file_path);
                            res_json_conversion[sub_resource_data.id].packet[sub_resource_data.resources[index].id] = {
                                type: sub_resource_data.resources[index].type,
                                path: Array.isArray(sub_resource_data.resources[index].path)
                                    ? sub_resource_data.resources[index].path
                                    : sub_resource_data.resources[index].path.split("\\"),
                                dimension: {
                                    width: sub_resource_data.resources[index].width,
                                    height: sub_resource_data.resources[index].height,
                                },
                                data: {},
                            };
                            for (let j_index = 0; j_index < sub_resource_data.resources.length; ++j_index) {
                                if (sub_resource_data.resources[j_index].parent === sub_resource_data.resources[index].id) {
                                    res_json_conversion[sub_resource_data.id].packet[sub_resource_data.resources[index].id].data[sub_resource_data.resources[j_index].id] = {
                                        default: {
                                            ax: sub_resource_data.resources[j_index].ax !== undefined &&
                                                sub_resource_data.resources[j_index].ax !== null &&
                                                sub_resource_data.resources[j_index].ax !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].ax, "ax", sub_resource_data.resources[j_index].id, file_path) &&
                                                sub_resource_data.resources[j_index].ax > 0
                                                ? sub_resource_data.resources[j_index].ax
                                                : Math.abs(sub_resource_data.resources[j_index].ax),
                                            ay: sub_resource_data.resources[j_index].ay !== undefined &&
                                                sub_resource_data.resources[j_index].ay !== null &&
                                                sub_resource_data.resources[j_index].ay !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].ay, "ay", sub_resource_data.resources[j_index].id, file_path) &&
                                                sub_resource_data.resources[j_index].ay > 0
                                                ? sub_resource_data.resources[j_index].ay
                                                : Math.abs(sub_resource_data.resources[j_index].ay),
                                            aw: sub_resource_data.resources[j_index].aw !== undefined &&
                                                sub_resource_data.resources[j_index].aw !== null &&
                                                sub_resource_data.resources[j_index].aw !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].aw, "aw", sub_resource_data.resources[j_index].id, file_path) &&
                                                sub_resource_data.resources[j_index].aw > 0
                                                ? sub_resource_data.resources[j_index].aw
                                                : Math.abs(sub_resource_data.resources[j_index].aw),
                                            ah: sub_resource_data.resources[j_index].ah !== undefined &&
                                                sub_resource_data.resources[j_index].ah !== null &&
                                                sub_resource_data.resources[j_index].ah !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].ah, "ah", sub_resource_data.resources[j_index].id, file_path) &&
                                                sub_resource_data.resources[j_index].ah > 0
                                                ? sub_resource_data.resources[j_index].ah
                                                : Math.abs(sub_resource_data.resources[j_index].ah),
                                            x: sub_resource_data.resources[j_index].x !== undefined &&
                                                sub_resource_data.resources[j_index].x !== null &&
                                                sub_resource_data.resources[j_index].x !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].x, "x", sub_resource_data.resources[j_index].id, file_path)
                                                ? sub_resource_data.resources[j_index].x
                                                : 0,
                                            y: sub_resource_data.resources[j_index].y !== undefined &&
                                                sub_resource_data.resources[j_index].y !== null &&
                                                sub_resource_data.resources[j_index].y !== void 0 &&
                                                this.CheckIntegerNumber(sub_resource_data.resources[j_index].y, "y", sub_resource_data.resources[j_index].id, file_path)
                                                ? sub_resource_data.resources[j_index].y
                                                : 0,
                                            cols: sub_resource_data.resources[j_index].cols,
                                        },
                                        path: Array.isArray(sub_resource_data.resources[j_index].path)
                                            ? sub_resource_data.resources[j_index].path
                                            : sub_resource_data.resources[j_index].path.split("\\"),
                                        type: sub_resource_data.resources[j_index].type,
                                    };
                                }
                            }
                        }
                    }
                    return res_json_conversion;
                }
                static DoAllProcess(resources_group, file_path) {
                    this.CheckOfficial(resources_group, file_path);
                    const res_json = {
                        expand_path: this.CheckOfficialPathType(resources_group),
                        groups: {},
                    };
                    const subgroups_parent_containers = new Array();
                    const subgroups_independent_construct = new Array();
                    for (let index = 0; index < resources_group.groups.length; ++index) {
                        if ("subgroups" in resources_group.groups[index]) {
                            const subgroup_template_container_parent = new Array();
                            for (let j_index = 0; j_index < resources_group.groups[index].subgroups.length; ++j_index) {
                                subgroup_template_container_parent.push({
                                    name: resources_group.groups[index].subgroups[j_index].id,
                                    image: resources_group.groups[index].subgroups[j_index].res !== undefined &&
                                        resources_group.groups[index].subgroups[j_index].res !== null &&
                                        resources_group.groups[index].subgroups[j_index].res !== void 0 &&
                                        typeof resources_group.groups[index].subgroups[j_index].res === "string"
                                        ? resources_group.groups[index].subgroups[j_index].res
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
                    for (let index = 0; index < subgroups_parent_containers.length; ++index) {
                        const current_subgroup_name = Object.keys(subgroups_parent_containers[index])[0];
                        res_json.groups[current_subgroup_name] = {
                            is_composite: true,
                            subgroup: {},
                        };
                        const subgroup_list = Object.values(subgroups_parent_containers[index]);
                        for (let j_index = 0; j_index < subgroup_list.length; ++j_index) {
                            for (let k_index = 0; k_index < subgroup_list[j_index].length; ++k_index) {
                                res_json.groups[current_subgroup_name].subgroup[subgroup_list[j_index][k_index].name] =
                                    subgroup_list[j_index][k_index].image !== null
                                        ? Object.values(this.ConvertOfficialSubgroupContainsAtlas(resources_group.groups.filter((res) => res.id === subgroup_list[j_index][k_index].name)[0], file_path))[0]
                                        : Object.values(this.ConvertOfficialSubgroupFile(resources_group.groups.filter((res) => res.id === subgroup_list[j_index][k_index].name)[0], file_path))[0];
                            }
                        }
                    }
                    for (let index = 0; index < subgroups_independent_construct.length; ++index) {
                        res_json.groups[subgroups_independent_construct[index]] = {
                            is_composite: false,
                            subgroup: {},
                        };
                        res_json.groups[subgroups_independent_construct[index]].subgroup = this.ConvertOfficialSubgroupFile(resources_group.groups.filter((res) => res.id === subgroups_independent_construct[index])[0], file_path);
                    }
                    return res_json;
                }
                static CreateConversion(file_input, output_file) {
                    const resource_json = Sen.Script.Modules.FileSystem.Json.ReadJson(file_input);
                    Sen.Script.Modules.FileSystem.Json.WriteJson(output_file, this.DoAllProcess(resource_json, file_input));
                }
            }
            Test.ResourceConversion = ResourceConversion;
            class ConvertToOfficial extends CheckOfficialResources {
                /**
                 *
                 * @param packet - Pass packet here
                 * @param subgroup_parent_name - Pass "id", example "_1536", "_768"
                 * @param subgroup_default_parent - Pass default parent which contains whole subgroups
                 * @returns
                 */
                static ConvertSubgroupUnofficialToOfficial(packet, subgroup_parent_name, subgroup_default_parent, res_type, expand_path_for_array, file_path) {
                    const manifest_group_for_atlas_and_sprite = {
                        id: subgroup_parent_name,
                        parent: subgroup_default_parent,
                        res: res_type,
                        resources: [],
                        type: "simple",
                    };
                    const resource_atlas_parent = Object.keys(packet.packet);
                    for (let index = 0; index < resource_atlas_parent.length; ++index) {
                        const resource_atlas_children_sprites_id = Object.keys(packet.packet[resource_atlas_parent[index]].data);
                        manifest_group_for_atlas_and_sprite.resources.push({
                            slot: 0,
                            id: resource_atlas_parent[index],
                            path: expand_path_for_array
                                ? packet.packet[resource_atlas_parent[index]].path
                                : packet.packet[resource_atlas_parent[index]].path.join("\\"),
                            type: packet.packet[resource_atlas_parent[index]].type,
                            atlas: true,
                            width: packet.packet[resource_atlas_parent[index]].dimension.width,
                            height: packet.packet[resource_atlas_parent[index]].dimension.height,
                            Sen: true,
                        });
                        for (let j_index = 0; j_index < resource_atlas_children_sprites_id.length; ++j_index) {
                            this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax, "ax", resource_atlas_children_sprites_id[j_index], file_path);
                            this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay, `ay`, resource_atlas_children_sprites_id[j_index], file_path);
                            this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah, `ah`, resource_atlas_children_sprites_id[j_index], file_path);
                            this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw, `aw`, resource_atlas_children_sprites_id[j_index], file_path);
                            manifest_group_for_atlas_and_sprite.resources.push(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.cols !== undefined &&
                                packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.cols !== null &&
                                packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.cols !== void 0 &&
                                this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.cols, `cols`, resource_atlas_children_sprites_id[j_index], file_path)
                                ? {
                                    slot: 0,
                                    id: resource_atlas_children_sprites_id[j_index],
                                    path: expand_path_for_array
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].path
                                        : packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].path.join("\\"),
                                    type: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].type,
                                    parent: resource_atlas_parent[index],
                                    ax: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax, `ax`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax),
                                    ay: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay, `ay`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay),
                                    aw: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw, `aw`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw),
                                    ah: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah, `ah`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah),
                                    x: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x, `x`, resource_atlas_children_sprites_id[j_index], file_path)
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x
                                        : 0,
                                    y: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y, `y`, resource_atlas_children_sprites_id[j_index], file_path)
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y
                                        : 0,
                                    cols: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.cols,
                                }
                                : {
                                    slot: 0,
                                    id: resource_atlas_children_sprites_id[j_index],
                                    path: expand_path_for_array
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].path
                                        : packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].path.join("\\"),
                                    type: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].type,
                                    parent: resource_atlas_parent[index],
                                    ax: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax, `ax`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ax),
                                    ay: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay, `ay`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ay),
                                    aw: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw, `aw`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.aw),
                                    ah: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah, `ah`, resource_atlas_children_sprites_id[j_index], file_path) &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah > 0
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah
                                        : Math.abs(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.ah),
                                    x: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x, `x`, resource_atlas_children_sprites_id[j_index], file_path)
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.x
                                        : 0,
                                    y: packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== undefined &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== null &&
                                        packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y !== void 0 &&
                                        this.CheckIntegerNumber(packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y, `y`, resource_atlas_children_sprites_id[j_index], file_path)
                                        ? packet.packet[resource_atlas_parent[index]].data[resource_atlas_children_sprites_id[j_index]].default.y
                                        : 0,
                                });
                        }
                    }
                    return manifest_group_for_atlas_and_sprite;
                }
                static ConvertUnofficialToOfficialFile(res_subgroup_children, subgroup_id, expand_path_for_array, file_path, subgroup_parent) {
                    const template_resource_build = subgroup_parent
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
                    const resource_data = Object.keys(res_subgroup_children.packet.data);
                    for (let index = 0; index < resource_data.length; ++index) {
                        this.CheckString(res_subgroup_children.packet.data[resource_data[index]].type, file_path);
                        template_resource_build.resources.push(res_subgroup_children.packet.data[resource_data[index]].srcpath !== undefined &&
                            res_subgroup_children.packet.data[resource_data[index]].srcpath !== null &&
                            res_subgroup_children.packet.data[resource_data[index]].srcpath !== void 0 &&
                            Array.isArray(res_subgroup_children.packet.data[resource_data[index]].srcpath)
                            ? {
                                slot: 0,
                                id: resource_data[index],
                                path: expand_path_for_array
                                    ? res_subgroup_children.packet.data[resource_data[index]].path
                                    : res_subgroup_children.packet.data[resource_data[index]]
                                        .path.join("\\"),
                                type: res_subgroup_children.packet.data[resource_data[index]].type,
                                forceOriginalVectorSymbolSize: res_subgroup_children.packet.data[resource_data[index]].forceOriginalVectorSymbolSize,
                                srcpath: expand_path_for_array
                                    ? res_subgroup_children.packet.data[resource_data[index]].srcpath
                                    : res_subgroup_children.packet.data[resource_data[index]]
                                        .srcpath.join("\\"),
                            }
                            : {
                                slot: 0,
                                id: resource_data[index],
                                path: expand_path_for_array
                                    ? res_subgroup_children.packet.data[resource_data[index]].path
                                    : res_subgroup_children.packet.data[resource_data[index]]
                                        .path.join("\\"),
                                type: res_subgroup_children.packet.data[resource_data[index]].type,
                                forceOriginalVectorSymbolSize: res_subgroup_children.packet.data[resource_data[index]].forceOriginalVectorSymbolSize,
                            });
                    }
                    return template_resource_build;
                }
                static GenerateOfficialComposite(subgroup, subgroup_parent, file_path) {
                    const composite_object = {
                        id: subgroup_parent,
                        subgroups: [],
                        type: "composite",
                    };
                    const subgroups_keys = Object.keys(subgroup);
                    for (let index = 0; index < subgroups_keys.length; ++index) {
                        composite_object.subgroups.push(subgroup[subgroups_keys[index]].type !== undefined &&
                            subgroup[subgroups_keys[index]].type !== null &&
                            subgroup[subgroups_keys[index]].type !== void 0 &&
                            this.CheckString(subgroup[subgroups_keys[index]].type, file_path)
                            ? {
                                id: subgroups_keys[index],
                                res: subgroup[subgroups_keys[index]].type,
                            }
                            : {
                                id: subgroups_keys[index],
                            });
                    }
                    return composite_object;
                }
                static DoAllProcess(res_json, file_path) {
                    this.CheckOfficial(res_json, file_path);
                    const resources_json = {
                        version: 1,
                        content_version: 1,
                        slot_count: 0,
                        groups: [],
                    };
                    const res_json_groups = res_json.groups;
                    const subgroups_key = Object.keys(res_json_groups);
                    for (let index = 0; index < subgroups_key.length; ++index) {
                        if (res_json.groups[subgroups_key[index]].is_composite === true) {
                            const create_subgroup_placeholder = Object.keys(res_json.groups[subgroups_key[index]].subgroup);
                            resources_json.groups.push(this.GenerateOfficialComposite(res_json.groups[subgroups_key[index]].subgroup, subgroups_key[index], file_path));
                            for (let j_index = 0; j_index < create_subgroup_placeholder.length; ++j_index) {
                                if (res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                    .type !== null &&
                                    res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                        .type !== undefined &&
                                    res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                        .type !== void 0 &&
                                    this.CheckString(res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                        .type, file_path)) {
                                    resources_json.groups.push(this.ConvertSubgroupUnofficialToOfficial(res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]], create_subgroup_placeholder[j_index], subgroups_key[index], res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]]
                                        .type, res_json.expand_path === "array", file_path));
                                }
                                else {
                                    resources_json.groups.push(this.ConvertUnofficialToOfficialFile(res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]], create_subgroup_placeholder[j_index], res_json.expand_path === "array", file_path, subgroups_key[index]));
                                }
                            }
                        }
                        else {
                            const create_subgroup_placeholder = Object.keys(res_json.groups[subgroups_key[index]].subgroup);
                            for (let j_index = 0; j_index < create_subgroup_placeholder.length; ++j_index) {
                                resources_json.groups.push(this.ConvertUnofficialToOfficialFile(res_json.groups[subgroups_key[index]].subgroup[create_subgroup_placeholder[j_index]], create_subgroup_placeholder[j_index], res_json.expand_path === "array", file_path));
                            }
                        }
                    }
                    (resources_json.groups).forEach((element, k_lambda_index) => {
                        if ("resources" in element) {
                            resources_json.groups[k_lambda_index].resources.forEach((resource_element, lambda_index) => {
                                resources_json.groups[k_lambda_index].resources[lambda_index].slot = resources_json.slot_count;
                                resources_json.slot_count++;
                            });
                        }
                    });
                    return resources_json;
                }
                static CreateWholeConversion(file_input, output_file) {
                    const res_json = Sen.Script.Modules.FileSystem.Json.ReadJson(file_input);
                    Sen.Script.Modules.FileSystem.Json.WriteJson(output_file, this.DoAllProcess(res_json, file_input));
                }
            }
            Test.ConvertToOfficial = ConvertToOfficial;
            class SplitUnofficialResources extends CheckOfficialResources {
                static SetDefaultInfo(res_json, file_path) {
                    this.CheckUnofficialJsonForWork(res_json, file_path);
                    const info_json = {
                        information: {
                            expand_path: res_json.expand_path,
                        },
                        groups: Object.keys(res_json.groups),
                    };
                    return info_json;
                }
                static GenerateSubgroup(res_json) {
                    const info_json = {
                        is_composite: res_json.is_composite,
                        subgroups: Object.keys(res_json.subgroup),
                    };
                    return info_json;
                }
                static CreateMultipleDirectory(save_directory, info_json) {
                    for (const directory of info_json.groups) {
                        Fs.CreateDirectory(Path.Resolve(`${save_directory}/${directory}`));
                    }
                    return;
                }
                static DoWholeProcess(file_path, save_directory = Path.Resolve(`${Path.Dirname(file_path)}/${Path.Parse(file_path).name}.info`)) {
                    const groups_directory = Path.Resolve(`${save_directory}/groups`);
                    const res_json = Sen.Script.Modules.FileSystem.Json.ReadJson(file_path);
                    const info_json = this.SetDefaultInfo(res_json, file_path);
                    Fs.CreateDirectory(Path.Resolve(`${save_directory}`));
                    Sen.Script.Modules.FileSystem.Json.WriteJson(Path.Resolve(Path.Resolve(`${save_directory}/info.json`)), info_json);
                    Fs.CreateDirectory(groups_directory);
                    this.CreateMultipleDirectory(groups_directory, info_json);
                    for (let index = 0; index < info_json.groups.length; ++index) {
                        const subgroup_info_json = this.GenerateSubgroup(res_json.groups[info_json.groups[index]]);
                        Sen.Script.Modules.FileSystem.Json.WriteJson(Path.Resolve(`${groups_directory}/${info_json.groups[index]}/data.json`), subgroup_info_json);
                        const directory_contain_whole_subgroups = `${groups_directory}/${info_json.groups[index]}/subgroup`;
                        Fs.CreateDirectory(directory_contain_whole_subgroups);
                        const subgroup_keys = Object.keys(res_json.groups[info_json.groups[index]].subgroup);
                        for (let j_index = 0; j_index < subgroup_keys.length; ++j_index) {
                            Sen.Script.Modules.FileSystem.Json.WriteJson(Path.Resolve(`${directory_contain_whole_subgroups}/${subgroup_keys[j_index]}.json`), res_json.groups[info_json.groups[index]].subgroup[subgroup_keys[j_index]]);
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
                static CreateConversion(file_path, output_dir) {
                    this.DoWholeProcess(file_path, output_dir);
                    return;
                }
            }
            Test.SplitUnofficialResources = SplitUnofficialResources;
        })(Test = Script.Test || (Script.Test = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
