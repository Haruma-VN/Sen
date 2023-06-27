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
        PvZ2Shell.RSBPack(inDirectory, outFile, manifest);
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
        if (Fs.DirectoryExists(properties)) {
            const files: Array<string> = Fs.ReadDirectory(properties, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory);
            let json_count: int = 0;
            files.forEach((file: string) => {
                if (Path.Parse(file).ext.toUpperCase() === `.JSON`) {
                    json_count++;
                    PvZ2Shell.RTONEncode(file, file.replace(/((\.json))?$/i, ".RTON"), option.encryptRTON ? Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt : Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
                }
            });
            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_process").replace(/\{\}/g, `${json_count} JSONs`));
        }
        if (option.generate_resources) {
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(`${inDirectory}/res.json`, `${inDirectory}/resource/PROPERTIES/RESOURCES.json`);
            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_res_json_to_resources_json")));
        } else {
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(`${inDirectory}/resource/PROPERTIES/RESOURCES.json`, `${inDirectory}/res.json`, Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(`${inDirectory}/res.json`).expand_path);
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_resources_json_to_res_json").replace(/\{\}/g, Path.Parse(manifestgroup_save).name_without_extension))
            );
        }
        if (manifest_group !== -1) {
            PvZ2Shell.RTONEncode(`${inDirectory}/resource/PROPERTIES/RESOURCES.json`, `${inDirectory}/resource/PROPERTIES/RESOURCES.RTON`, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
            PvZ2Shell.RSGPack(`${inDirectory}/resource/`, manifestgroup_save, manifest.group[manifest_group].subgroup[0].packet_info, false);
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Path.Parse(manifestgroup_save).name_without_extension))
            );
        }
        if (packages !== -1) {
            PvZ2Shell.RSGPack(`${inDirectory}/resource/`, packages_save, manifest.group[packages].subgroup[0].packet_info, false);
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("finish_rsg_pack").replace(/\{\}/g, Path.Parse(packages_save).name_without_extension))
            );
        }
        PvZ2Shell.RSBPack(inDirectory, outFile, manifest);
        return;
    }
}
