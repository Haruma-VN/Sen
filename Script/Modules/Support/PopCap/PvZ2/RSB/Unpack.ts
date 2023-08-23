namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack {
    /**
     * RSB Header Interface
     */

    export interface RSBHead {
        readonly magic: string;
        version: int;
        fileOffset: int;
        fileListLength: int;
        fileList_BeginOffset: int;
        rsgListLength: int;
        rsgList_BeginOffset: int;
        rsgint: int;
        rsgInfo_BeginOffset: int;
        rsgInfo_EachLength: int;
        compositeint: int;
        compostieInfo_BeginOffset: int;
        compositeInfo_EachLength: int;
        compositeListLength: int;
        compositeList_BeginOffset: int;
        autopoolint: int;
        autopoolInfo_BeginOffset: int;
        autopoolInfo_EachLength: int;
        ptxint: int;
        ptxInfo_BeginOffset: int;
        ptxInfo_EachLength: int;
        part1_BeginOffset: int;
        part2_BeginOffset: int;
        part3_BeginOffset: int;
    }

    /**
     * Info for Shell
     */

    export interface ManifestInfo {
        version: number;
        ptx_info_size: number;
        path?: RSBPathInfo;
        group: GroupInfo[];
    }

    /**
     * Path interface
     */

    export interface RSBPathInfo {
        rsgs: string[];
        packet_path: string;
    }

    /**
     * Group Interface
     */

    export interface GroupInfo {
        name: string;
        is_composite: boolean;
        subgroup: SubGroupInfo[];
    }

    /**
     * Subgroup Interface
     */

    export interface SubGroupInfo {
        name_packet: string;
        category: [number, string | null];
        packet_info: RSBPacketInfo;
    }

    /**
     * Packet Data Interface
     */

    export interface RSBPacketInfo {
        version: number;
        compression_flags: number;
        res: ResInfo[];
    }

    /**
     * Resource Interface
     */

    export interface ResInfo {
        path: string | string[];
        ptx_info?: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PtxInfo;
        ptx_property?: PtxProperty;
    }

    /**
     * PTX Interface
     */

    export interface PtxProperty {
        format: number;
        pitch: number;
        alpha_size: number | null;
        alpha_format: number | null;
    }

    /**
     * Pass in for Unpack Simple
     */

    export interface SimpleResources {
        expand_path: "string" | "array";
        extends_texture_information_for_pvz2c: 0n | 1n | 2n | 3n;
    }

    // Information

    export interface RSBManifestInformation {
        version: 3 | 4;
        ptx_info_size: 16 | 20 | 24;
        group: {
            [composite_name: string]: {
                is_composite: boolean;
                subgroup: {
                    [subgroup_children: string]: {
                        category: [number, string | null];
                        packet_info: RSBPacketInfo;
                    };
                };
            };
        };
    }

    /**
     *
     * @param information - Pass information deserialize manifest
     * @returns Workaround manifest (Only for Output)
     */

    export function ConvertToManifest(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = {
            version: information.version as 3 | 4,
            ptx_info_size: information.ptx_info_size as 16 | 20 | 24,
            group: {},
        };

        information.group.forEach((group: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo) => {
            const { name, is_composite, subgroup } = group satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo;
            manifest_info.group[name] = {
                is_composite,
                subgroup: {},
            };

            subgroup.forEach((subgroupInfo: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo) => {
                const { name_packet, category, packet_info } = subgroupInfo satisfies Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo;
                const packetInfo: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo = {
                    version: packet_info.version,
                    compression_flags: packet_info.compression_flags,
                    res: [],
                };

                packet_info.res.forEach((res: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ResInfo) => {
                    packetInfo.res.push({ ...res, path: (res.path as string).split("\\") });
                });

                manifest_info.group[name].subgroup[name_packet] = {
                    category: [Number(category[0]), category[1] === "" ? null : category[1]],
                    packet_info: packetInfo,
                };
            });
        });

        return manifest_info;
    }
    /**
     *
     * @param inRSB - Pass RSB
     * @param outDirectory - Pass directory output
     * @returns RSB Unpack
     */

    export function UnpackPopCapOfficialRSB(inRSB: string, outDirectory: string, write_manifest: boolean): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo {
        try {
            const manifest_json: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Shell.PvZ2Shell.RSBUnpack(inRSB, outDirectory);
            if (write_manifest) {
                Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `manifest.json`)),
                    Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ConvertToManifest(manifest_json),
                    false
                );
            }
            return manifest_json;
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inRSB);
        }
    }

    /**
     * Structure
     */

    export interface RSBManifestInformationForSimple extends RSBManifestInformation {
        extends_texture_information_for_pvz2c: 0n | 1n | 2n | 3n;
    }

    /**
     * Structure
     */

    export interface DecodeRTON {
        decode_rtons: boolean;
        rton_is_encrypted: boolean;
        rton_key: string;
    }
    /**
     *
     * @param inRSB - Pass RSB here
     * @returns Unpack RSB by simple
     */

    export function UnpackPopCapOfficialRSBBySimple(inRSB: string, outDirectory: string, information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimpleResources, rton_option: DecodeRTON): void {
        const rsb_header_structure: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBHead = Sen.Shell.PvZ2Shell.ProcessRSBData(inRSB);
        if (BigInt(rsb_header_structure.version) !== 4n) {
            throw new Sen.Script.Modules.Exceptions.UnsupportedDataType(Sen.Script.Modules.System.Default.Localization.GetString("unsupported_rsb_version_not_4"), inRSB);
        }
        const manifest_additional_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(
            inRSB,
            outDirectory,
            false
        ) as Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo;
        const manifest_output: RSBManifestInformationForSimple = {
            extends_texture_information_for_pvz2c: information.extends_texture_information_for_pvz2c,
            ...Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ConvertToManifest(manifest_additional_information),
        };
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `manifest.json`)), manifest_output, true);
        const manifest_group: string | undefined = manifest_additional_information.path?.rsgs.find((rsg: string) => /__MANIFESTGROUP__(.+)?/i.test(rsg));
        const packages: string | undefined = manifest_additional_information.path?.rsgs.find((rsg: string) => /Packages(.+)?/i.test(rsg) && rsg.toUpperCase() === "PACKAGES");
        if (manifest_group) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("converting_resource_to_resinfo")}`);
            Sen.Shell.PvZ2Shell.RSGUnpack(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `packet`, `${manifest_group}.rsg`)), Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `resource`)), false);
            const manifest_path: string = manifest_additional_information.group.find((e) => e.name === manifest_group)?.subgroup[0].packet_info.res.find((e) => (e.path as string)!.endsWith(".RTON"))?.path! as string;
            const resources_rton_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `resource`, ...manifest_path.split("\\")));
            const resources_json_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(resources_rton_path)}`, `${Sen.Shell.Path.Parse(resources_rton_path).name_without_extension}.json`));
            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(resources_rton_path, resources_json_path, Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial);
            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ResInfoResourceConversion.CreateConversion(resources_json_path, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `res.json`)), information.expand_path);
        }
        if (packages) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("unpacking_packages")}`);
            const packages_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `resource`));
            Sen.Shell.PvZ2Shell.RSGUnpack(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `packet`, `${packages}.rsg`)), packages_destination, false);
            if (rton_option.decode_rtons) {
                if (rton_option.rton_is_encrypted) {
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("pvz2_chinese_encryption_key_obtained").replace(/\{\}/g, ""));
                    Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${rton_option.rton_key}`);
                }
                const packages_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `resource`, `PACKAGES`));
                const rtons: Array<string> = Sen.Shell.FileSystem.ReadDirectory(packages_directory, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory).filter((e: string) => e.toUpperCase().endsWith(".RTON"));
                rtons.forEach((rton: string) =>
                    Sen.Shell.PvZ2Shell.RTONDecode(rton, rton.replace(/((\.rton))?$/i, ".JSON"), {
                        key: rton_option.rton_key,
                        crypt: rton_option.rton_is_encrypted,
                    })
                );
            }
        } else {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Yellow, Sen.Script.Modules.System.Default.Localization.GetString("execution_warning").replace(/\{\}/g, ""));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("no_packages_found")}`);
        }
        return;
    }
    /**
     *
     * @param inRSB - Pass RSB
     * @param outDirectory - Pass directory output
     * @returns RSB Unpack
     */

    export function UnpackAbnormalRSBByLooseConstraints(inRSB: string, outDirectory: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo {
        const manifest_json: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Shell.PvZ2Shell.RSBUnpackByLooseConstraints(inRSB, outDirectory);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `manifest.json`)),
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ConvertToManifest(manifest_json),
            false
        );
        return manifest_json;
    }

    /**
     * Simple Manifest Interface
     */

    export interface SimplifiedManifest<subgroup extends string> {
        version: 4;
        ptx_info_size: 16;
        groups: {
            [composite_shell: string]: Array<subgroup>;
        };
    }

    /**
     *
     * @param information - Pass information for manifest
     * @returns The simplified manifest
     */

    export function ConvertToSimplifiedManifest(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string> {
        const groups: Array<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo> = information.group;
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string> = {
            version: 4,
            ptx_info_size: 16,
            groups: {},
        };
        groups.forEach((group: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.GroupInfo) => {
            manifest.groups[group.name] = [];
            group.subgroup.forEach((subgroup: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SubGroupInfo) => {
                manifest.groups[group.name].push(subgroup.name_packet);
            });
        });
        return manifest;
    }

    /**
     *
     * @param inRSB - Pass RSB Path (support pvz2 only)
     * @param outDirectory - Pass output path
     * @returns Unpacked RSB
     */

    export function UnpackPopCapRSBWithSimplifiedInformation(inRSB: string, outDirectory: string): void {
        const rsb_header_structure: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBHead = Sen.Shell.PvZ2Shell.ProcessRSBData(inRSB);
        if (rsb_header_structure.version !== 4) {
            throw new Sen.Script.Modules.Exceptions.UnsupportedDataType(Sen.Script.Modules.System.Default.Localization.GetString("unsupported_rsb_version_not_4"), inRSB);
        }
        const manifest_json: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo = Sen.Shell.PvZ2Shell.RSBUnpack(inRSB, outDirectory);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimplifiedManifest<string>>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `pvz2.json`)),
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ConvertToSimplifiedManifest(manifest_json),
            false
        );
        return;
    }
}
