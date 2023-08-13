namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource {
    /**
     *
     * @param rsb_dir - Pass RSB Directory
     * @returns Unpacked all
     */
    export function UnpackAllPopCapRSGs(rsb_dir: string, out_dir: string): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("mode_selected").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("unpack_all_rsg"))
        );
        const manifest_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_dir}`, `manifest.json`));
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest_destination);
        const rsgs: Array<string> = Array.from([...Object.keys(manifest.group).map((composite: string) => Object.keys(manifest.group[composite].subgroup))])
            .reduce((k1: Array<string>, k2: Array<string>) => k1.concat(k2), [])
            .map((e: string) => Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(rsb_dir, `packet`, `${e}.rsg`)));
        rsgs.forEach((rsg: string) => {
            Sen.Shell.PvZ2Shell.RSGUnpack(rsg, out_dir, false);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, Sen.Script.Modules.System.Default.Localization.GetString("now_processing_rsg"));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${rsg}`);
        });
        return;
    }

    /**
     * Structure
     */

    export interface RSBConvertOption {
        rsb_parent_directory: string;
        rsb_unpack_dir: string;
        extractAtlas: boolean;
        texture_format: "android" | "ios" | "android_cn";
        decode_pam: boolean;
        pam_to_flash_animation: boolean;
        decode_bnk: boolean;
        decode_wem: boolean;
        decode_rton: boolean;
        rton_encrypted: boolean;
        encryptionKey: string;
        extractSprites: boolean;
        resolution: int;
        expand_path: "string" | "array";
    }

    /**
     * Structure
     */

    export interface TextureFormat {
        [child: string]: "string";
    }

    /**
     * Structure
     */

    export type FlashAnimationContainer = {
        subgroup: string;
        filepath: string;
        pam: string;
    };

    /**
     *
     * @param rsb_unpack_option - Provide option
     * @param out_dir - Output directory
     * @returns
     */

    export function UnpackAllPopCapRSGDataInsideUnpackDirectory(rsb_unpack_option: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.RSBConvertOption, out_dir: string): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("unpacking_all_rsgs"))
        );
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.UnpackAllPopCapRSGs(rsb_unpack_option.rsb_parent_directory, rsb_unpack_option.rsb_unpack_dir);
        const popcap_resource_group_resources_rton_input_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_unpack_option.rsb_unpack_dir}`, `PROPERTIES`, `RESOURCES.RTON`));
        const popcap_resource_group_resources_json_output_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${out_dir}`, `PROPERTIES`, `RESOURCES.JSON`));
        const res_json_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_unpack_option.rsb_parent_directory}`, `res.json`));
        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(
            popcap_resource_group_resources_rton_input_destination,
            popcap_resource_group_resources_json_output_destination,
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
        );
        const res_json: res_json = Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ResInfoResourceConversion.DoAllProcess<Resources_Group_Structure_Template, res_json>(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(popcap_resource_group_resources_json_output_destination),
            popcap_resource_group_resources_json_output_destination,
            rsb_unpack_option.expand_path as "array" | "string"
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<res_json>(res_json_destination, res_json, false);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_resources_json_to_res_json"))
        );
        const manifest: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_unpack_option.rsb_parent_directory}`, `manifest.json`));
        Sen.Shell.FileSystem.CreateDirectory(out_dir);
        // const groups: Array<string> = Object.keys(res_json.groups);
        const manifest_deserialize: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            manifest as string
        ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
        const compositeshell: Array<string> = Object.keys(manifest_deserialize.group);
        const information_host: Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat> = Sen.Script.Modules.FileSystem.Json.ReadJson<
            Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat>
        >(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_ptx.json`))) satisfies Record<
            string,
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat
        >;
        const architecture: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat = information_host[rsb_unpack_option.texture_format];
        const flash_animation_destination: Array<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.FlashAnimationContainer> = new Array();
        compositeshell.forEach((parent: string) => {
            const subgroup: Array<string> = Object.keys(manifest_deserialize.group[parent].subgroup);
            subgroup.forEach((subgroup_children: string) => {
                manifest_deserialize.group[parent].subgroup[subgroup_children].packet_info.res.forEach((worker: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo) => {
                    let home: string = `${out_dir}`;
                    create_nested_directory: for (let i: int = 0; i < (worker.path as Array<string>).length; ++i) {
                        if (i === worker.path.length - 1) {
                            break create_nested_directory;
                        }
                        const directory: string = worker.path[i];
                        home = Sen.Shell.Path.Join(home, directory);
                        Sen.Shell.FileSystem.CreateDirectory(home);
                    }
                    const resource_unpack_path: string = `${Sen.Shell.Path.Join(...(worker.path as Array<string>))}`;
                    const resource_popcap_texture_format_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.PtxProperty = worker.ptx_property as Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.PtxProperty;
                    const resource_popcap_texture_dimension_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo = worker.ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo;
                    const input_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_unpack_option.rsb_unpack_dir}`, `${resource_unpack_path}`));
                    const output_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${out_dir}`, `${resource_unpack_path}`));
                    if (resource_popcap_texture_format_information !== null && resource_popcap_texture_dimension_information !== null && rsb_unpack_option.extractAtlas) {
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("decoding_popcap_ptx").replace(/\{\}/g, ""));
                        Sen.Shell.Console.Printf(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.White,
                            `      ${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("decoding_popcap_ptx_template"), [
                                input_path,
                                `${resource_popcap_texture_dimension_information.width}`,
                                `${resource_popcap_texture_dimension_information.height}`,
                                `${resource_popcap_texture_format_information.format}`,
                                Sen.Script.Modules.System.Default.Localization.GetString(rsb_unpack_option.texture_format),
                            ])}`
                        );
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            `${input_path}`,
                            `${output_path.replace(/((\.ptx))?$/i, `.PNG`)}`,
                            resource_popcap_texture_dimension_information.width,
                            resource_popcap_texture_dimension_information.height,
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.SwapTextureFormatInformation(architecture[`${resource_popcap_texture_format_information.format}`])
                        );
                    } else if (Sen.Shell.Path.Parse(input_path).ext.toUpperCase() === ".RTON" && rsb_unpack_option.decode_rton) {
                        if (Sen.Shell.Path.Parse(input_path).name.toUpperCase() !== "RESOURCES") {
                            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("decoding_popcap_rton").replace(/\{\}/g, ""));
                            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${input_path}`);
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(input_path, output_path.replace(/((\.rton))?$/i, `.JSON`), {
                                crypt: rsb_unpack_option.rton_encrypted,
                                key: rsb_unpack_option.encryptionKey,
                            });
                        }
                    } else if (Sen.Shell.Path.Parse(input_path).ext.toUpperCase() === ".PAM" && rsb_unpack_option.decode_pam) {
                        const output_pam_json: string = output_path.replace(/((\.pam))?$/i, `.PAM.JSON`);
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("decoding_popcap_pam"));
                        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${input_path}`);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(input_path, output_pam_json);
                        if (rsb_unpack_option.pam_to_flash_animation) {
                            const destination: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.FlashAnimationContainer = {
                                filepath: Sen.Shell.Path.Resolve(
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(output_pam_json, output_pam_json.replace(/((\.pam.json))?$/i, `.xfl`), rsb_unpack_option.resolution)
                                ),
                                subgroup: worker.path.at(-2) as string,
                                pam: worker.path.at(-1) as string,
                            };
                            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("popcap_animation_to_flash"));
                            Sen.Shell.Console.Printf(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.White,
                                `      ${Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("decoding_popcap_animation_to_flash"), [
                                    destination.filepath,
                                    `${rsb_unpack_option.resolution}`,
                                ])}`
                            );
                            flash_animation_destination.push(destination);
                        }
                    } else if (Sen.Shell.Path.Parse(input_path).ext.toUpperCase() === ".BNK" && rsb_unpack_option.decode_bnk) {
                        const output = output_path.replace(/((\.bnk))?$/i, `.soundbank`);
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("decode_wwise_bnk"));
                        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${input_path}`);
                        Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankDecodeBySimple(input_path, output);
                    }
                });
            });
        });
        return;
    }

    /**
     * RSBPackOption
     * @param use_convert - Use convert directory
     */

    export interface RSBPackOption {
        use_convert: boolean;
        convert_png_to_ptx: boolean;
        convert_res_json_to_resource_json: boolean;
        convert_xfl_to_pam_json: boolean;
        convert_pam_json_to_pam: boolean;
        encode_rtons: boolean;
        rton_encrypt: boolean;
        encryptionKey: string;
        encodeBNK: boolean;
        texture_format: "android" | "ios" | "android_cn";
        bundle_path: string;
        rsb_output: string;
    }

    /**
     *
     * @param rsb_packing_option - Provide option
     * @param use_high_thread - High Thread Packing Performance
     * @returns Packed RSB
     */

    export function PackPopCapRSBInsideConvertDirectory(rsb_packing_option: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.RSBPackOption, use_high_thread: boolean): void {
        const manifest: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_packing_option.bundle_path}`, `manifest.json`));
        const convert_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_packing_option.bundle_path}`, `convert`));
        const manifest_deserialize: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest);
        const converted_manifest_for_shell: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromManifest(manifest_deserialize);
        const packet_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_packing_option.bundle_path}`, `packet`));
        const unpack_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsb_packing_option.bundle_path}`, `unpack`));
        if (rsb_packing_option.use_convert) {
        }
        if (use_high_thread) {
            const async_tasks: Array<Sen.Shell.PvZ2Shell.RSGPackTemplate> = new Array<Sen.Shell.PvZ2Shell.RSGPackTemplate>();
            converted_manifest_for_shell.group.forEach((group: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo) => {
                group.subgroup.forEach((subgroup: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo) => {
                    const rsg: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${packet_directory}`, `${subgroup.name_packet}.rsg`));
                    async_tasks.push({
                        inFolder: unpack_directory,
                        outFile: rsg,
                        useResDirectory: false,
                        packet: subgroup.packet_info,
                    });
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, Sen.Script.Modules.System.Default.Localization.GetString("rsg_pack_as_result"));
                    Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${rsg}`);
                });
            });
            Sen.Shell.PvZ2Shell.RSGPackAsync(...async_tasks);
        } else {
            converted_manifest_for_shell.group.forEach((group: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo) => {
                const async_tasks: Array<Sen.Shell.PvZ2Shell.RSGPackTemplate> = new Array<Sen.Shell.PvZ2Shell.RSGPackTemplate>();
                // group.subgroup.forEach((subgroup: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo) => {
                //     Sen.Shell.PvZ2Shell.RSGPack(`${unpack_directory}`, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${packet_directory}`, `${subgroup.name_packet}.rsg`)), subgroup.packet_info, false);
                // });
                group.subgroup.forEach((subgroup: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo) => {
                    const rsg: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${packet_directory}`, `${subgroup.name_packet}.rsg`));
                    async_tasks.push({
                        inFolder: unpack_directory,
                        outFile: rsg,
                        useResDirectory: false,
                        packet: subgroup.packet_info,
                    });
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, Sen.Script.Modules.System.Default.Localization.GetString("rsg_pack_as_result"));
                    Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${rsg}`);
                });
                Sen.Shell.PvZ2Shell.RSGPackAsync(...async_tasks);
            });
        }
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSB(rsb_packing_option.bundle_path, rsb_packing_option.rsb_output);
        return;
    }
}
