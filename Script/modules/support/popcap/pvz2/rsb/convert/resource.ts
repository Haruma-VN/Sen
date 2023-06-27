namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource {
    /**
     *
     * @param rsb_dir - Pass RSB Directory
     * @returns Unpacked all
     */
    export function UnpackAllPopCapRSGs(rsb_dir: string, out_dir: string): void {
        const packet_directory: string = Path.Resolve(`${rsb_dir}/packet`);
        const rsgs: Array<string> = Fs.ReadDirectory(packet_directory, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
        rsgs.forEach((rsg: string) => {
            PvZ2Shell.RSGUnpack(rsg, `${out_dir}`, false);
        });
        return;
    }

    export interface RSBOption {
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

    export interface TextureFormat {
        [child: string]: "string";
    }

    export type FlashAnimationContainer = {
        subgroup: string;
        filepath: string;
        pam: string;
    };

    export function UnpackAllPopCapRSGDataInsideUnpackDirectory(rsb_unpack_option: RSBOption, out_dir: string): void {
        const packet_directory: string = Path.Resolve(`${rsb_unpack_option.rsb_parent_directory}/packet`);
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("unpacking_all_rsgs")));
        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.UnpackAllPopCapRSGs(rsb_unpack_option.rsb_parent_directory, rsb_unpack_option.rsb_unpack_dir);
        const popcap_resource_group_resources_rton_input_destination: string = `${rsb_unpack_option.rsb_unpack_dir}/PROPERTIES/RESOURCES.RTON`;
        const popcap_resource_group_resources_json_output_destination: string = `${out_dir}/PROPERTIES/RESOURCES.JSON`;
        const res_json_destination: string = `${rsb_unpack_option.rsb_parent_directory}/res.json`;
        PvZ2Shell.RTONDecode(popcap_resource_group_resources_rton_input_destination, popcap_resource_group_resources_json_output_destination, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
        const res_json: res_json = Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.DoAllProcess<Resources_Group_Structure_Template, res_json>(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(popcap_resource_group_resources_json_output_destination),
            popcap_resource_group_resources_json_output_destination,
            rsb_unpack_option.expand_path as "array" | "string"
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<res_json>(res_json_destination, res_json);
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_resources_json_to_res_json")));
        const manifest: string = Path.Resolve(`${rsb_unpack_option.rsb_parent_directory}/manifest.json`);
        Fs.CreateDirectory(out_dir);
        const groups: Array<string> = Object.keys(res_json.groups);
        const manifest_deserialize: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            manifest as string
        ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
        const compositeshell: Array<string> = Object.keys(manifest_deserialize.group);
        const information_host: Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat> = Sen.Script.Modules.FileSystem.Json.ReadJson<Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat>>(
            `${MainScriptDirectory}/modules/customization/methods/popcap_ptx.json`
        ) satisfies Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.TextureFormat>;
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
                        home = Path.Join(home, directory);
                        Fs.CreateDirectory(home);
                    }
                    const resource_unpack_path: string = `${Path.Join(...(worker.path as Array<string>))}`;
                    const resource_popcap_texture_format_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.PtxProperty = worker.ptx_property as Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.PtxProperty;
                    const resource_popcap_texture_dimension_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo = worker.ptx_info as Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PtxInfo;
                    const input_path: string = `${rsb_unpack_option.rsb_unpack_dir}/${resource_unpack_path}`;
                    const output_path: string = `${out_dir}/${resource_unpack_path}`;
                    if (resource_popcap_texture_format_information !== null && resource_popcap_texture_dimension_information !== null && rsb_unpack_option.extractAtlas) {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            `${input_path}`,
                            `${output_path.replace(/((\.ptx))?$/i, `.PNG`)}`,
                            resource_popcap_texture_dimension_information.width,
                            resource_popcap_texture_dimension_information.height,
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.SwapTextureFormatInformation(architecture[`${resource_popcap_texture_format_information.format}`])
                        );
                    } else if (Path.Parse(input_path).ext.toUpperCase() === ".RTON" && rsb_unpack_option.decode_rton) {
                        if (Path.Parse(input_path).name.toUpperCase() !== "RESOURCES") {
                            PvZ2Shell.RTONDecode(input_path, output_path.replace(/((\.rton))?$/i, `.JSON`), {
                                crypt: rsb_unpack_option.rton_encrypted,
                                key: rsb_unpack_option.encryptionKey,
                            });
                        }
                    } else if (Path.Parse(input_path).ext.toUpperCase() === ".PAM" && rsb_unpack_option.decode_pam) {
                        const output_pam_json: string = output_path.replace(/((\.pam))?$/i, `.PAM.JSON`);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(input_path, output_pam_json);
                        if (rsb_unpack_option.pam_to_flash_animation) {
                            const destination: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.FlashAnimationContainer = {
                                filepath: Path.Resolve(Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(output_pam_json, output_pam_json.replace(/((\.pam.json))?$/i, `.xfl`), rsb_unpack_option.resolution)),
                                subgroup: worker.path.at(-2) as string,
                                pam: worker.path.at(-1) as string,
                            };
                            flash_animation_destination.push(destination);
                        }
                    } else if (Path.Parse(input_path).ext.toUpperCase() === ".BNK" && rsb_unpack_option.decode_bnk) {
                        Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankDecodeBySimple(input_path, output_path.replace(/((\.bnk))?$/i, `.soundbank`));
                    }
                });
            });
        });
        return;
    }
}
