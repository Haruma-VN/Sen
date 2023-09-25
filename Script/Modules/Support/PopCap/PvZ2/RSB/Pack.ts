namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack {
    /**
     *
     * @param information - Pass information deserialize manifest
     * @returns Workaround manifest (Only for for the shell)
     */

    export function ConvertFromManifest(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = {
            version: information.version as 3 | 4,
            ptx_info_size: information.ptx_info_size as 16 | 20 | 24,
            group: [],
        } satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo;
        const groups: Array<string> = Object.keys(information.group);
        for (const group of groups) {
            const infox: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo = {
                name: group,
                is_composite: information.group[group].is_composite,
                subgroup: [],
            };
            const subgroups: Array<string> = Object.keys(information.group[group].subgroup);
            for (const subgroup of subgroups) {
                const construct_data: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo = {
                    name_packet: subgroup,
                    category: information.group[group].subgroup[subgroup].category,
                    packet_info: information.group[group].subgroup[subgroup].packet_info,
                };
                construct_data.packet_info.res.forEach((res) => {
                    res.path = (res.path as Array<string>).join("\\");
                });
                infox.subgroup.push(construct_data);
            }
            manifest_info.group.push(infox);
        }
        return manifest_info;
    }

    /**
     *
     * @param inDirectory - Pass directory
     * @param outFile - Pass out RSB
     * @returns
     */

    export function PackPopCapRSB(inDirectory: string, outFile: string): void {
        const manifest_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `manifest.json`));
        const original_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest_path);
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromManifest(original_manifest);
        try {
            Sen.Shell.LotusModule.RSBPack(inDirectory, outFile, manifest);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inDirectory);
        }
        return;
    }

    /**
     * Options for Packing
     */

    export interface Options {
        generate_resources: boolean;
        encryptRTON: boolean;
        encryptionKey: string;
        encode_newton: boolean;
    }

    /**
     *
     * @param inDirectory - Pass RSB bundle
     * @param outFile - Pass RSB outfile
     * @param option - Pass Option
     * @returns Out RSB packed
     */

    export function PackPopCapRSBBySimple(inDirectory: string, outFile: string, option: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.Options): void {
        const manifest_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `manifest.json`));
        const original_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformationForSimple =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformationForSimple>(manifest_path);
        Sen.Script.Modules.Support.Json.Generic.PropertyView(
            original_manifest,
            "extends_texture_information_for_pvz2c",
            Sen.Script.Modules.System.Default.Localization.GetString("property_is_missing").replace(/\{\}/g, "extends_texture_information_for_pvz2c"),
            manifest_path
        );
        Sen.Script.Modules.Support.Json.Generic.PropertyView(original_manifest, "version", Sen.Script.Modules.System.Default.Localization.GetString("property_is_missing").replace(/\{\}/g, "version"), manifest_path);
        Sen.Script.Modules.Support.Json.Generic.PropertyView(original_manifest, "ptx_info_size", Sen.Script.Modules.System.Default.Localization.GetString("property_is_missing").replace(/\{\}/g, "ptx_info_size"), manifest_path);
        if (BigInt(original_manifest.extends_texture_information_for_pvz2c) === 0n && BigInt(original_manifest.version) === 4n && BigInt(original_manifest.ptx_info_size) === 16n) {
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.StrictlyHandlePitch<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation, string, string, 4n, 16n, string>(original_manifest, 4n, 16n, manifest_path);
        }
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromManifest(original_manifest);
        let manifest_group: int = -1;
        let packages: int = -1;
        for (let i: int = 0; i < manifest.group.length; ++i) {
            if (/__MANIFESTGROUP__(.+)?/i.test(manifest.group[i].name)) {
                manifest_group = i;
            }
            if (/Packages(.+)?/i.test(manifest.group[i].name) && manifest.group[i].name.toUpperCase() === "PACKAGES") {
                packages = i;
            }
        }
        const manifestgroup_save: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `packet`, `${manifest.group[manifest_group].name}.rsg`));
        const properties: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `resource`, `PACKAGES`));
        if (Sen.Shell.FileSystem.DirectoryExists(properties)) {
            const files: Array<string> = Sen.Shell.FileSystem.ReadDirectory(properties, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
            let json_count: int = 0;
            files.forEach((file: string) => {
                if (Sen.Shell.Path.Parse(file).ext.toUpperCase() === `.JSON`) {
                    json_count++;
                    Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                        file,
                        file.replace(/((\.json))?$/i, ".RTON"),
                        option.encryptRTON ? Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt : Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
                    );
                }
            });
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_process").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("converted")}: ${json_count} JSONs -> RTONs`);
        }
        if (option.generate_resources) {
            const resource_file: string = Sen.Shell.Path.Join(
                `${inDirectory}`,
                `resource`,
                ...(manifest.group[manifest_group].subgroup[0].packet_info.res.find((e) => (e.path as string).endsWith(".RTON"))!.path as string).split("\\")
            ).replace(/((\.rton))?$/i, ".json");
            const res_info_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `res.json`));
            //// Merge Split Res
            // const res_info_split_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `res.json.info`));
            // if (Sen.Shell.FileSystem.DirectoryExists(res_info_split_path)) {
            //     Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, `Merge by automatically`));
            //     Sen.Shell.Console.Printf(null, `      ${`Find Splitted Res-Info directory, merge Res-Info`}`);
            //     Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.MergeResInfoJson.CreateConversion(res_info_split_path, res_info_path);
            // }
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToResourceGroup.CreateConversion(Sen.Shell.Path.Resolve(res_info_path), Sen.Shell.Path.Resolve(resource_file));
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("converted_resinfo_to_resourcegroup")}`);
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(resource_file, resource_file.replace(/((\.json))?$/i, ".RTON"), Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
            if (option.encode_newton) {
                Sen.Shell.LotusModule.EncodeNewtonResource(resource_file, resource_file.replace(/((\.json))?$/i, ".NEWTON"));
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
                Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("generated_newton_resource")}`);
            }
        } else {
            const resource_file: string = Sen.Shell.Path.Join(
                `${inDirectory}`,
                `resource`,
                ...(manifest.group[manifest_group].subgroup[0].packet_info.res.find((e) => (e.path as string).endsWith(".RTON"))!.path as string).split("\\")
            ).replace(/((\.rton))?$/i, ".json");
            //// Merge Split Res
            // const resource_file_splitted_directory: string = Sen.Shell.Path.Join(`${inDirectory}`, `resource`, `PROPERTIES`, `RESOURCES.res`);
            // if (Sen.Shell.FileSystem.DirectoryExists(resource_file_splitted_directory)) {
            //     Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, `Merge by automatically`));
            //     Sen.Shell.Console.Printf(null, `      ${`Find Splitted Resource-Group directory, merge Resource-Group`}`);
            //     Sen.Script.Modules.Support.PopCap.PvZ2.Resources.ResourceGroup.PopCapResources.MergePopCapResources(resource_file_splitted_directory, resource_file);
            // }
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ResInfoResourceConversion.CreateConversion(
                resource_file,
                Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `res.json`)),
                Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `res.json`))).expand_path
            );
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("converted_resources_json_to_res_json")}`);
            if (option.encode_newton) {
                Sen.Shell.LotusModule.EncodeNewtonResource(resource_file, resource_file.replace(/((\.json))?$/i, ".NEWTON"));
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
                Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("generated_newton_resource")}`);
            }
        }
        if (manifest_group !== -1 && packages === -1) {
            const resource_file: string = Sen.Shell.Path.Join(`${inDirectory}`, `resource`, ...(manifest.group[manifest_group].subgroup[0].packet_info.res.find((e) => (e.path as string).endsWith(".RTON"))!.path as string).split("\\"));
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                Sen.Shell.Path.Resolve(resource_file.replace(/((\.rton))?$/i, ".json")),
                Sen.Shell.Path.Resolve(resource_file),
                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
            );
            Sen.Shell.LotusModule.RSGPack(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `resource`)), manifestgroup_save, manifest.group[manifest_group].subgroup[0].packet_info, false);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(manifestgroup_save).name_without_extension)}`);
        } else if (packages !== -1 && manifest_group === -1) {
            const packages_save: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `packet`, `${manifest.group[packages].name}.rsg`));
            Sen.Shell.LotusModule.RSGPack(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `resource`)), packages_save, manifest.group[packages].subgroup[0].packet_info, false);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(packages_save).name_without_extension)}`);
        } else if (packages !== -1 && manifest_group !== -1) {
            const resource_file: string = Sen.Shell.Path.Join(`${inDirectory}`, `resource`, ...(manifest.group[manifest_group].subgroup[0].packet_info.res.find((e) => (e.path as string).endsWith(".RTON"))!.path as string).split("\\"));
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                Sen.Shell.Path.Resolve(resource_file.replace(/((\.rton))?$/i, ".json")),
                Sen.Shell.Path.Resolve(resource_file),
                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
            );
            const packages_save: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `packet`, `${manifest.group[packages].name}.rsg`));
            Sen.Shell.LotusModule.RSGPackAsync(
                {
                    inFolder: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `resource`)),
                    outFile: manifestgroup_save,
                    packet: manifest.group[manifest_group].subgroup[0].packet_info,
                    useResDirectory: false,
                },
                {
                    inFolder: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `resource`)),
                    outFile: packages_save,
                    packet: manifest.group[packages].subgroup[0].packet_info,
                    useResDirectory: false,
                }
            );
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(manifestgroup_save).name_without_extension)}`);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ``));
            Sen.Shell.Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(packages_save).name_without_extension)}`);
        }
        Sen.Shell.LotusModule.RSBPack(inDirectory, outFile, manifest);
        return;
    }

    /**
     *
     * @param packet_item_name - Pass packet name
     * @returns ? This is not accurate
     */

    export function GetCategoryPacket(packet_item_name: string): [number, string | null] {
        if (packet_item_name.endsWith("_1536")) {
            return [1536, null];
        } else if (packet_item_name.endsWith("_1200")) {
            return [1200, null];
        } else if (packet_item_name.endsWith("_768")) {
            return [768, null];
        } else if (packet_item_name.endsWith("_384")) {
            return [384, null];
        } else {
            return [0, null];
        }
    }

    /**
     *
     * @param information - Pass information
     * @param inDirectory - Pass in directory
     * @returns
     */

    export function ConvertFromSimplifedManifestGroup(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string>, inDirectory: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = {
            version: information.version as 4,
            ptx_info_size: information.ptx_info_size as 16,
            group: [],
        } satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo;
        Object.keys(information.groups).forEach((composite_group_name: string) => {
            let composite_type: boolean = false;
            const infox: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo = {
                name: composite_group_name,
                is_composite: false,
                subgroup: [],
            };
            information.groups[composite_group_name].forEach((packet_item_name: string) => {
                const rsb_rsg_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo = Sen.Shell.LotusModule.GetRSBPacketInfo(
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `packet`, `${packet_item_name}.rsg`))
                );
                const packet_category: [number, string | null] = GetCategoryPacket(packet_item_name.toLowerCase());
                if (!composite_type && packet_category[0] !== 0) {
                    composite_type = true;
                }
                const construct_data: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo = {
                    name_packet: packet_item_name,
                    category: packet_category,
                    packet_info: rsb_rsg_packet_info,
                };
                infox.subgroup.push(construct_data);
            });
            if (composite_type) {
                infox.is_composite = true;
            }
            manifest_info.group.push(infox);
        });
        return manifest_info;
    }

    /**
     *
     * @param inDirectory - Pass dir
     * @param outFile - Pass output
     * @returns RSB version 4 (PvZ2)
     */

    export function PackPopCapRSBUsingSimplifiedInformation(inDirectory: string, outFile: string): void {
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromSimplifedManifestGroup(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string>>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `pvz2.json`))),
            inDirectory
        );
        // Sen.Shell.FileSystem.ReadDirectory(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `packet`)), Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory).forEach((e: string) => {
        //     if (Sen.Shell.FileSystem.DirectoryExists(e) && /\.packet$/i.test(e)) {
        //         Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGPack(e, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(e)}`, `${Sen.Shell.Path.Parse(e).name_without_extension}.rsg`)));
        //     }
        // });
        Sen.Shell.LotusModule.RSBPack(inDirectory, outFile, manifest);
        return;
    }

    /**
     *
     * @param information - Manifest
     * @param version - Version number
     * @param manifest_path - Manifest path
     * @returns
     */

    export function StrictlyHandlePitch<
        safe extends Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation,
        CompositeShell extends string,
        Subgroup extends string,
        Version extends 3n | 4n,
        PTXInfomation extends 16n | 20n | 24n,
        ManifestPath extends string
    >(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation, version: Version, ptx_info: PTXInfomation, manifest_path?: ManifestPath): information is safe {
        Sen.Script.Modules.Support.Json.Generic.PropertyView(information, "group", Sen.Script.Modules.System.Default.Localization.GetString("property_is_missing").replace(/\{\}/g, "group"), manifest_path);
        const composite_shell_list: Array<CompositeShell> = Object.keys(information.group) as Array<CompositeShell>;
        const is_pvz2: boolean = version === 4n && ptx_info === 16n;
        composite_shell_list.forEach((composite_shell: CompositeShell) => {
            const subgroup_list: Array<Subgroup> = Object.keys(information.group[composite_shell].subgroup) as Array<Subgroup>;
            subgroup_list.forEach((subgroup: Subgroup) => {
                information.group[composite_shell].subgroup[subgroup].packet_info.res.forEach((res: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo) => {
                    if (res.ptx_info && res.ptx_property) {
                        if (is_pvz2) {
                            if (BigInt(res.ptx_property.format) === 0n || BigInt(res.ptx_property.format) === 147n || BigInt(res.ptx_property.format) === 148n) {
                                if (!(res.ptx_property.pitch === res.ptx_info.width * 4)) {
                                    throw new Sen.Script.Modules.Exceptions.PitchError(
                                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("pitch_at_subgroup_is_wrong"), [
                                            `${res.ptx_info.id}`,
                                            (res.path as Array<string>).at(-1)!,
                                            subgroup,
                                            composite_shell,
                                            `${res.ptx_info.width * 4}`,
                                            `${res.ptx_property.pitch}`,
                                        ]),
                                        manifest_path ?? "undefined",
                                        `${res.ptx_info.width * 4}`
                                    );
                                }
                            }
                            if (BigInt(res.ptx_property.format) === 30n && !(res.ptx_property.pitch === res.ptx_info.width / 2)) {
                                throw new Sen.Script.Modules.Exceptions.PitchError(
                                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("pitch_at_subgroup_is_wrong"), [
                                        `${res.ptx_info.id}`,
                                        (res.path as Array<string>).at(-1)!,
                                        subgroup,
                                        composite_shell,
                                        `${res.ptx_info.width / 2}`,
                                        `${res.ptx_property.pitch}`,
                                    ]),
                                    manifest_path ?? "undefined",
                                    `${res.ptx_info.width / 2}`
                                );
                            }
                        } else {
                            if (!(res.ptx_property.pitch === res.ptx_info.width * 4) && !(res.ptx_property.pitch === res.ptx_info.width * 2)) {
                                throw new Sen.Script.Modules.Exceptions.PitchError(
                                    Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("pitch_at_subgroup_is_wrong"), [
                                        `${res.ptx_info.id}`,
                                        (res.path as Array<string>).at(-1)!,
                                        subgroup,
                                        composite_shell,
                                        Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_or_that"), [`${res.ptx_info.width * 4}`, `${res.ptx_info.width * 2}`]),
                                        `${res.ptx_property.pitch}`,
                                    ]),
                                    manifest_path ?? "undefined",
                                    `${res.ptx_info.width * 4}`
                                );
                            }
                        }
                    }
                });
            });
        });
        return true;
    }
}
