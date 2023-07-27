namespace Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB {
    /**
     * Convert StreamingWave on Android to Global_Data on IOS
     *
     * @returns void
     */
    export function ConvertStreamingWavetoGlobalData(bundle_directory: string, information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation): void {
        const streaming_wave_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `StreamingWave.rsg`));
        const streaming_wave_bundle: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `StreamingWave.rsg.packet`));
        const streaming_wave_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo = Sen.Shell.PvZ2Shell.RSGUnpack(streaming_wave_path, `${streaming_wave_bundle}`, false);
        const global_data_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `Global_Data.rsg`));
        const global_data_bundle: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `Global_Data.rsg.packet`));
        Sen.Shell.FileSystem.CreateDirectory(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(global_data_bundle, `STREAMINGWAVES`, `GLOBAL_DATA`)));
        const global_data_res: Array<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.ResInfo> = [];
        const global_data_res_clone: Array<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo> = [];
        for (const res_index in streaming_wave_packet_info.res) {
            const wem_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${streaming_wave_bundle}`, `${streaming_wave_packet_info.res[res_index].path as string}`));
            const path_change: string = (streaming_wave_packet_info.res[res_index].path as string).replace(`STREAMINGWAVES`, `STREAMINGWAVES\\GLOBAL_DATA`);
            const new_wem_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${global_data_bundle}`, `${path_change}`));
            global_data_res.push({ path: path_change });
            global_data_res_clone.push({ path: path_change.split("\\") });
            Sen.Shell.FileSystem.CopyFile(wem_path, new_wem_path);
        }
        streaming_wave_packet_info.res = global_data_res;
        Sen.Shell.PvZ2Shell.RSGPack(`${global_data_bundle}`, `${global_data_path}`, streaming_wave_packet_info, false);
        information.group["Global_Data"] = {
            is_composite: false,
            subgroup: {
                Global_Data: {
                    category: [0, null],
                    packet_info: {
                        version: streaming_wave_packet_info.version,
                        compression_flags: streaming_wave_packet_info.compression_flags,
                        res: global_data_res_clone,
                    },
                },
            },
        };
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_finish").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_streaming_wave_to_global_data"))
        );
        return;
    }

    /**
     *
     * @param manifest_rsg_bundle_directory - pass bundle
     * @param subgroup_content_json - pass json
     * @returns
     */

    export function ConvertStreamingWavetoGlobalDataforResouces(manifest_rsg_bundle_directory: string, subgroup_content_json: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.official_subgroup_json): void {
        const streaming_wave_res_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, `subgroup`, `StreamingWave.json`));
        const global_data_res_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, `subgroup`, `Global_Data.json`));
        const deserialized_subgroup: resource_atlas_and_sprites = Sen.Script.Modules.FileSystem.Json.ReadJson<resource_atlas_and_sprites>(streaming_wave_res_path) satisfies resource_atlas_and_sprites;
        deserialized_subgroup.id = "Global_Data";
        for (let i = 0; i < deserialized_subgroup.resources.length; i++) {
            deserialized_subgroup.resources[i].id = deserialized_subgroup.resources[i].id.replace(`STREAMINGWAVES`, `STREAMINGWAVES_GLOBAL_DATA`);
            deserialized_subgroup.resources[i].path = [deserialized_subgroup.resources[i].path[0], "Global_Data", deserialized_subgroup.resources[i].path[1]];
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<resource_atlas_and_sprites>(global_data_res_path, deserialized_subgroup, false);
        subgroup_content_json["Global_Data"] = {
            is_composite: false,
            subgroups: {
                Global_Data: {
                    type: null,
                },
            },
        };
        return;
    }

    /**
     * Structure
     */

    export const IOSRequireFormat30AtlasList: Array<string> = [];

    /**
     * Convert PTX from Android to IOS
     *
     * @returns Texture format
     */

    export function ConvertFormat(bundle_directory: string, atlas_name: string, ptx_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo, atlas_format: number, compress_ptx: boolean): number {
        const ptx_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `unpack`, atlas_name as string));
        const png_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `convert`, atlas_name as string).replace(/((\.ptx))?$/i, `.png`));
        if (!Sen.Shell.FileSystem.DirectoryExists(Sen.Shell.Path.Dirname(png_path))) Sen.Shell.FileSystem.CreateDirectory(Sen.Shell.Path.Dirname(png_path));
        if (atlas_format === 0) {
            Sen.Shell.TextureHandler.Create_RGBA8888_Decode(
                ptx_path,
                png_path,
                (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo).width as number,
                (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo).height as number
            );
        } else if (atlas_format === 147) {
            Sen.Shell.TextureHandler.Create_ETC1_RGB_A8_Decode(
                ptx_path,
                png_path,
                (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo).width as number,
                (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo).height as number
            );
        }
        compress_ptx && atlas_format === 147
            ? Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8)
            : Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB8888);
        return atlas_format === 147 && compress_ptx ? 148 : 0;
    }

    /**
     * Unpack RSB, decode PTX and repack RSG
     *
     * @returns ManifestGroup name
     */

    export function UnpackRSBAndConvertPTX(file_in: string, bundle_directory: string, input_resolution: number, compress_ptx: boolean): string {
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(file_in, bundle_directory);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            Sen.Shell.Path.Join(`${bundle_directory}`, `manifest.json`)
        );
        const groups: Array<string> = Object.keys(information.group);
        const atlas_res_bundle: Array<number> = [1536, 768, 384];
        const string_res_resolution: string = `_${atlas_res_bundle[input_resolution - 1]}`;
        let manifest_packet_name: string = ``;
        let check_contain_atlas: boolean = false;
        for (const group of groups) {
            if (group.toUpperCase().includes("MANIFESTGROUP")) manifest_packet_name = group;
            if (group.toUpperCase() === "STREAMINGWAVE") {
                delete information.group[group];
                ConvertStreamingWavetoGlobalData(bundle_directory, information);
                continue;
            }
            if (information.group[group].is_composite) {
                const subgroups: Array<string> = Object.keys(information.group[group].subgroup);
                for (const subgroup of subgroups) {
                    if (subgroup.toUpperCase().endsWith("_COMMON")) continue;
                    else if (subgroup.toUpperCase().endsWith(string_res_resolution)) {
                        check_contain_atlas = true;
                        const rsg_infile_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `${subgroup}.rsg`));
                        const rsg_outfile_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `unpack`));
                        Sen.Shell.PvZ2Shell.RSGUnpack(rsg_infile_path, `${rsg_outfile_path}`, false);
                        for (let k = 0; k < information.group[group].subgroup[subgroup].packet_info.res.length; k++) {
                            const packet_res_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo = information.group[group].subgroup[subgroup].packet_info.res[k];
                            information.group[group].subgroup[subgroup].packet_info.res[k].ptx_property!.format = ConvertFormat(
                                bundle_directory,
                                (packet_res_info.path as Array<string>).join("\\"),
                                packet_res_info.ptx_info!,
                                packet_res_info.ptx_property!.format,
                                compress_ptx
                            );
                        }
                        const rsg_packetinfo: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo = information.group[group].subgroup[subgroup].packet_info;
                        rsg_packetinfo.res.forEach((res) => {
                            res.path = (res.path as Array<string>).join("\\");
                        });
                        Sen.Shell.PvZ2Shell.RSGPack(`${rsg_outfile_path}`, `${rsg_infile_path}`, rsg_packetinfo, false);
                        rsg_packetinfo.res.forEach((res) => {
                            res.path = (res.path as string).split("\\");
                        });
                        Sen.Shell.Console.Print(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_finish").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_rsg").replace(/\{\}/g, `${subgroup}`))}`
                        );
                    } else {
                        delete information.group[group].subgroup[subgroup];
                    }
                }
                if (!check_contain_atlas)
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(
                        Sen.Script.Modules.System.Default.Localization.GetString("does_not_contains_in_rsb").replace(/\{\}/g, `${atlas_res_bundle[input_resolution - 1]}`),
                        Sen.Script.Modules.System.Default.Localization.GetString("missing_resolution"),
                        `${file_in}`
                    );
            }
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Join(`${bundle_directory}`, `manifest.json`), information, false);
        return manifest_packet_name;
    }

    /**
     * Remove all unnecessary res and rewrite resources
     *
     * @returns void
     */

    export function RewriteResources(bundle_directory: string, manifest_packet_name: string, input_resolution: number): void {
        const manifest_rsg_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `${manifest_packet_name}.rsg`));
        const manifest_rsg_bundle_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `${manifest_packet_name}.bundle`));
        const manifest_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo = Sen.Shell.PvZ2Shell.RSGUnpack(manifest_rsg_path, `${manifest_rsg_bundle_directory}`, false);
        const res_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, manifest_packet_info.res[0].path as string));
        const res_json_argument: string = res_argument.replace(/((\.rton))?$/i, `.json`);
        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(res_argument, res_json_argument, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
        const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(res_argument)}`, `${Sen.Shell.Path.Parse(res_argument).name_without_extension}.res`));
        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(res_json_argument, output_argument);
        const content_json_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_argument, `content.json`));
        const subgroup_content_json: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.official_subgroup_json =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.official_subgroup_json>(content_json_path);
        const parents: Array<string> = Object.keys(subgroup_content_json);
        const atlas_res_bundle: Array<number> = [1536, 768, 384];
        const type_res_subgroup: string = `${atlas_res_bundle[input_resolution - 1]}`;
        for (const parent of parents) {
            if (parent.toUpperCase() === `STREAMINGWAVE`) {
                delete subgroup_content_json[parent];
                ConvertStreamingWavetoGlobalDataforResouces(output_argument, subgroup_content_json);
                continue;
            }
            const subgroups: Array<string> = Object.keys(subgroup_content_json[parent].subgroups);
            if (subgroup_content_json[parent].is_composite) {
                for (const subgroup of subgroups) {
                    if (subgroup_content_json[parent].subgroups[subgroup].type === null) {
                        continue;
                    } else if (subgroup_content_json[parent].subgroups[subgroup].type === type_res_subgroup) {
                        continue;
                    } else {
                        delete subgroup_content_json[parent].subgroups[subgroup];
                    }
                }
            }
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.official_subgroup_json>(content_json_path, subgroup_content_json, false);
        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(output_argument, res_json_argument);
        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(res_json_argument, res_argument, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
        Sen.Shell.PvZ2Shell.RSGPack(`${manifest_rsg_bundle_directory}`, `${manifest_rsg_path}`, manifest_packet_info, false);
        return;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_rsb_path"))
        );
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const bundle_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name_without_extension}.bundle`)}`);
        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(bundle_directory, "file");
        const output_file: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(file_in)}/${Sen.Shell.Path.Parse(file_in).name_without_extension}.converted.rsb`);
        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_file, "file");
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("popcap_ptx_encode"))
        );
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      1. argb_8888`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      2. pvrtc1_4bpp_rgba_a8`);
        const compress_ptx: boolean = Sen.Script.Modules.Interface.Arguments.TestInput([1, 2]) === 2;
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("popcap_texture_resolution"))
        );
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      1. ${Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_1536")}`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      2. ${Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_768")}`);
        const input_resolution: int = Sen.Script.Modules.Interface.Arguments.TestInput([1, 2]);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("please_wait_for_few_minutes_to_finish_conversion"))
        );
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("rsg_list"))
        );
        const manifest_packet_name: string = Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB.UnpackRSBAndConvertPTX(file_in, bundle_directory, input_resolution, compress_ptx);
        RewriteResources(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${bundle_directory}`, `packet`)), manifest_packet_name, input_resolution);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSB(bundle_directory, output_file);
        Sen.Shell.FileSystem.DeleteDirectory([bundle_directory]);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB.Evaluate();
