namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack {
    /**
     *
     * @param information - Pass information deserialize manifest
     * @returns Workaround manifest (Only for for the shell)
     */

    export function ConvertFromManifest(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = {
            version: information.version as 3 | 4,
            ptx_info_size: information.ptx_info_size as 16 | 20 | 24,
            group: [],
        } satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo;
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
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromManifest(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(`${inDirectory}/manifest.json`)
        );
        Sen.Shell.PvZ2Shell.RSBPack(inDirectory, outFile, manifest);
        return;
    }

    /**
     * Options for Packing
     */

    export interface Options {
        generate_resources: boolean;
        encryptRTON: boolean;
        encryptionKey: string;
    }

    /**
     *
     * @param inDirectory - Pass RSB bundle
     * @param outFile - Pass RSB outfile
     * @param option - Pass Option
     * @returns Out RSB packed
     */

    export function PackPopCapRSBBySimple(inDirectory: string, outFile: string, option: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.Options): void {
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromManifest(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(`${inDirectory}/manifest.json`)
        );
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
        const manifestgroup_save: string = `${inDirectory}/packet/${manifest.group[manifest_group].name}.rsg`;
        const packages_save: string = `${inDirectory}/packet/${manifest.group[packages].name}.rsg`;
        const properties: string = `${inDirectory}/resource/PACKAGES`;
        if (Sen.Shell.FileSystem.DirectoryExists(properties)) {
            const files: Array<string> = Sen.Shell.FileSystem.ReadDirectory(properties, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
            let json_count: int = 0;
            files.forEach((file: string) => {
                if (Sen.Shell.Path.Parse(file).ext.toUpperCase() === `.JSON`) {
                    json_count++;
                    Sen.Shell.PvZ2Shell.RTONEncode(file, file.replace(/((\.json))?$/i, ".RTON"), option.encryptRTON ? Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt : Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
                }
            });
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_process").replace(/\{\}/g, `${json_count} JSONs`));
        }
        if (option.generate_resources) {
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(`${inDirectory}/res.json`, `${inDirectory}/resource/PROPERTIES/RESOURCES.json`);
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_res_json_to_resources_json")));
        } else {
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(`${inDirectory}/resource/PROPERTIES/RESOURCES.json`, `${inDirectory}/res.json`, Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(`${inDirectory}/res.json`).expand_path);
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_resources_json_to_res_json").replace(/\{\}/g, Sen.Shell.Path.Parse(manifestgroup_save).name_without_extension))
            );
        }
        if (manifest_group !== -1) {
            Sen.Shell.PvZ2Shell.RTONEncode(`${inDirectory}/resource/PROPERTIES/RESOURCES.json`, `${inDirectory}/resource/PROPERTIES/RESOURCES.RTON`, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
            Sen.Shell.PvZ2Shell.RSGPack(`${inDirectory}/resource/`, manifestgroup_save, manifest.group[manifest_group].subgroup[0].packet_info, false);
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(manifestgroup_save).name_without_extension))
            );
        }
        if (packages !== -1) {
            Sen.Shell.PvZ2Shell.RSGPack(`${inDirectory}/resource/`, packages_save, manifest.group[packages].subgroup[0].packet_info, false);
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Sen.Shell.Path.Parse(packages_save).name_without_extension))
            );
        }
        Sen.Shell.PvZ2Shell.RSBPack(inDirectory, outFile, manifest);
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

    export function ConvertFromSimplifedManifestGroup(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string>, inDirectory: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = {
            version: information.version as 4,
            ptx_info_size: information.ptx_info_size as 16,
            group: [],
        } satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo;
        Object.keys(information.groups).forEach((composite_group_name: string) => {
            let composite_type: boolean = false;
            const infox: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo = {
                name: composite_group_name,
                is_composite: false,
                subgroup: [],
            };
            information.groups[composite_group_name].forEach((packet_item_name: string) => {
                const rsb_rsg_packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo = Sen.Shell.PvZ2Shell.GetRSBPacketInfo(`${inDirectory}/packet/${packet_item_name}.rsg`);
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
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.ConvertFromSimplifedManifestGroup(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string>>(`${inDirectory}/pvz2.json`),
            inDirectory
        );
        Sen.Shell.PvZ2Shell.RSBPack(inDirectory, outFile, manifest);
        return;
    }
}
