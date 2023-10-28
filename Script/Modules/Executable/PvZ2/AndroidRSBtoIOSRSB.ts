namespace Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB {
    /**
     * Convert StreamingWave on Android to Global_Data on IOS
     *
     * @returns void
     */
    export function ConvertStreamingWavetoGlobalData(bundle_directory: string, information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation): void {
        const streaming_wave_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `StreamingWave.rsg`));
        const streaming_wave_bundle: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `StreamingWave.rsg.packet`));
        const streaming_wave_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo = Sen.Shell.LotusModule.RSGUnpack(streaming_wave_path, `${streaming_wave_bundle}`, false);
        const global_data_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `Global_Data.rsg`));
        const global_data_bundle: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `Global_Data.rsg.packet`));
        Sen.Shell.FileSystem.CreateDirectory(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(global_data_bundle, `STREAMINGWAVES`, `GLOBAL_DATA`)));
        const global_data_res: Array<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo> = [];
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
        Sen.Shell.LotusModule.RSGPack(`${global_data_bundle}`, `${global_data_path}`, streaming_wave_packet_info, false);
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

    export function ConvertStreamingWavetoGlobalDataforResouces(manifest_rsg_bundle_directory: string, subgroup_content_json: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.official_subgroup_json): void {
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

    export function ConvertFormat(bundle_directory: string, atlas_name: string, ptx_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo, atlas_format: number, compress_ptx: boolean, toAndroid: boolean): number {
        const ptx_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `unpack`, atlas_name as string));
        const png_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `convert`, atlas_name as string).replace(/((\.ptx))?$/i, `.png`));
        if (!Sen.Shell.FileSystem.DirectoryExists(Sen.Shell.Path.Dirname(png_path))) Sen.Shell.FileSystem.CreateDirectory(Sen.Shell.Path.Dirname(png_path));
        switch (BigInt(atlas_format)) {
            case 0n: {
                if (toAndroid) {
                    Sen.Shell.TextureHandler.Create_ARGB8888_Decode(
                        ptx_path,
                        png_path,
                        (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).width as number,
                        (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).height as number
                    );
                } else {
                    Sen.Shell.TextureHandler.Create_RGBA8888_Decode(
                        ptx_path,
                        png_path,
                        (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).width as number,
                        (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).height as number
                    );
                }
                break;
            }
            case 147n: {
                Sen.Shell.TextureHandler.Create_ETC1_RGB_A8_Decode(
                    ptx_path,
                    png_path,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).width as number,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).height as number
                );
                break;
            }
            case 30n: {
                Sen.Shell.TextureHandler.Create_PVRTC1_4BPP_RGBA_Decode(
                    ptx_path,
                    png_path,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).width as number,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).height as number
                );
                break;
            }
            case 148n: {
                Sen.Shell.TextureHandler.Create_PVRTC1_4BPP_RGBA_A8_Decode(
                    ptx_path,
                    png_path,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).width as number,
                    (ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo).height as number
                );
                break;
            }
        }
        if (toAndroid) {
            if (compress_ptx && atlas_format === 30) {
                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A8);
            } else {
                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA8888);
            }
        } else {
            if (compress_ptx && atlas_format === 147) {
                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8);
            } else {
                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB8888);
            }
        }
        return toAndroid ? (atlas_format === 0 && compress_ptx ? 30 : 0) : atlas_format === 147 && compress_ptx ? 148 : 0;
    }

    /**
     * Unpack RSB, decode PTX and repack RSG
     *
     * @returns ManifestGroup name
     */

    export function UnpackRSBAndConvertPTX(file_in: string, bundle_directory: string, input_resolution: number, compress_ptx: boolean, toAndroid: boolean, use_high_thread: boolean = false): string {
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(file_in, bundle_directory, true);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            Sen.Shell.Path.Join(`${bundle_directory}`, `manifest.json`)
        );
        let resource_tasks: Array<Shell.LotusModule.RSGPackTemplate> = [];
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
                    let resource_need_pack: boolean = false!;
                    if (subgroup.toUpperCase().endsWith("_COMMON")) {
                        continue;
                    } else if (subgroup.toUpperCase().endsWith(string_res_resolution)) {
                        check_contain_atlas = true;
                        const rsg_infile_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `packet`, `${subgroup}.rsg`));
                        const rsg_outfile_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(bundle_directory, `unpack`));
                        Sen.Shell.LotusModule.RSGUnpack(rsg_infile_path, `${rsg_outfile_path}`, false);
                        for (let k = 0; k < information.group[group].subgroup[subgroup].packet_info.res.length; k++) {
                            const packet_res_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo = information.group[group].subgroup[subgroup].packet_info.res[k];
                            information.group[group].subgroup[subgroup].packet_info.res[k].ptx_property!.format = ConvertFormat(
                                bundle_directory,
                                (packet_res_info.path as Array<string>).join("\\"),
                                packet_res_info.ptx_info!,
                                packet_res_info.ptx_property!.format,
                                compress_ptx,
                                toAndroid
                            );
                        }
                        const rsg_packetinfo: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo = information.group[group].subgroup[subgroup].packet_info;
                        rsg_packetinfo.res.forEach((res) => {
                            res.path = (res.path as Array<string>).join("\\");
                        });
                        resource_need_pack = true;
                        resource_tasks.push({
                            inFolder: rsg_outfile_path,
                            outFile: rsg_infile_path,
                            packet: rsg_packetinfo,
                            useResDirectory: false,
                        });
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("rsg_in_queue").replace(/\{\}/g, `${subgroup}`));
                    } else {
                        delete information.group[group].subgroup[subgroup];
                    }
                    if (resource_need_pack && !use_high_thread) {
                        Sen.Shell.LotusModule.RSGPackAsync(...resource_tasks);
                        resource_tasks.forEach((e) => {
                            e.packet.res.forEach((res) => {
                                res.path = (res.path as string).split("\\");
                            });
                        });
                        resource_tasks = [];
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
        if (use_high_thread) {
            Sen.Shell.LotusModule.RSGPackAsync(...resource_tasks);
            resource_tasks.forEach((e) => {
                e.packet.res.forEach((res) => {
                    res.path = (res.path as string).split("\\");
                });
            });
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
        const manifest_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo = Sen.Shell.LotusModule.RSGUnpack(manifest_rsg_path, `${manifest_rsg_bundle_directory}`, false);
        const res_argument: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo[] = manifest_packet_info.res;
        const resource_contains_rton: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo | undefined = res_argument.find((e) => (e.path! as string).toUpperCase().endsWith(".RTON"));
        const resource_contains_newton: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo | undefined = res_argument.find((e) => (e.path! as string).toUpperCase().endsWith(".NEWTON"));
        let resource_has_rton: boolean = false;
        let resource_has_newton: boolean = false;
        if (resource_contains_rton) {
            resource_has_rton = true;
        }
        if (resource_contains_newton) {
            resource_has_newton = true;
        }
        let resources_json_path: string = undefined!;
        if (resource_has_rton && resource_has_newton) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("resource_has_newton_and_rton")}`);
            const resources_rton_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, resource_contains_rton!.path as string));
            resources_json_path = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(resources_rton_path)}`, `${Sen.Shell.Path.Parse(resources_rton_path).name_without_extension}.json`));
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(resources_rton_path, resources_json_path, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
        } else if (resource_has_rton && !resource_has_newton) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("resource_has_rton")}`);
            const resources_rton_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, resource_contains_rton!.path as string));
            resources_json_path = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(resources_rton_path)}`, `${Sen.Shell.Path.Parse(resources_rton_path).name_without_extension}.json`));
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(resources_rton_path, resources_json_path, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
        } else if (!resource_has_rton && resource_has_newton) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("resource_has_newton")}`);
            const resource_newton_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(manifest_rsg_bundle_directory, resource_contains_newton!.path as string));
            resources_json_path = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(resource_newton_path)}`, `${Sen.Shell.Path.Parse(resource_newton_path).name_without_extension}.json`));
            Sen.Shell.LotusModule.DecodeNewtonResource(resource_newton_path, resources_json_path);
        } else {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("execution_error").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("resource_invalid")}`);
            throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("invalid_resource_group"));
        }
        const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(resources_json_path)}`, `${Sen.Shell.Path.Parse(resources_json_path).name_without_extension}.res`));
        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.PopCapResources.SplitPopCapResources(resources_json_path, output_argument);
        const content_json_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_argument, `content.json`));
        const subgroup_content_json: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.official_subgroup_json =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.official_subgroup_json>(content_json_path);
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
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.official_subgroup_json>(content_json_path, subgroup_content_json, false);
        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.PopCapResources.MergePopCapResources(output_argument, resources_json_path);
        if (resource_has_newton) {
            Sen.Shell.LotusModule.EncodeNewtonResource(resources_json_path, resources_json_path.replace(/((\.json))?$/i, `.NEWTON`));
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("got_newton_resource")}`);
        }
        if (resource_has_rton) {
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(resources_json_path, resources_json_path.replace(/((\.json))?$/i, `.RTON`), Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("got_rton_resource")}`);
        }
        Sen.Shell.LotusModule.RSGPack(`${manifest_rsg_bundle_directory}`, `${manifest_rsg_path}`, manifest_packet_info, false);
        return;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("android_rsb_to_ios_rsb"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_rsb_path"))
        );
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const bundle_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name_without_extension}.bundle`)}`);
        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(
            {
                argument: bundle_directory,
            },
            "directory"
        );
        const output_file: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(file_in)}/${Sen.Shell.Path.Parse(file_in).name_without_extension}.converted.rsb`);
        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(
            {
                argument: output_file,
            },
            "file"
        );
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("popcap_ptx_encode"))
        );
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      1. argb_8888`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      2. pvrtc1_4bpp_rgba_a8`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      3. rgba_8888`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      4. rgb_etc1_a8`);
        const input_value: number = Sen.Script.Modules.Interface.Arguments.TestInput([1, 2, 3, 4]);
        const compress_ptx: boolean = input_value === 2 || input_value === 4;
        const isAndroidConvert: boolean = input_value === 3 || input_value === 4;
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
        const manifest_packet_name: string = Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB.UnpackRSBAndConvertPTX(file_in, bundle_directory, input_resolution, compress_ptx, isAndroidConvert, false);
        RewriteResources(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${bundle_directory}`, `packet`)), manifest_packet_name, input_resolution);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSB(bundle_directory, output_file);
        Sen.Shell.FileSystem.DeleteDirectory([bundle_directory]);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.AndroidRSBtoiOSRSB.Evaluate();
