namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack {
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

    export interface MainfestInfo {
        version: number;
        path?: RSBPathInfo;
        group: GroupInfo[];
    }

    export interface RSBPathInfo {
        rsgs: string[];
        packet_path: string;
    }

    export interface GroupInfo {
        name: string;
        is_composite: boolean;
        subgroup: SubGroupInfo[];
    }

    export interface SubGroupInfo {
        name_packet: string;
        category?: number | null;
        packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo;
    }

    /**
     * Pass in for Unpack Simple
     */

    export interface SimpleResources {
        encryptedRTON: boolean;
        encryptedKey?: string;
        expand_path: "string" | "array";
    }

    // Information

    export interface RSBManifestInformation {
        version: 3 | 4;
        group: {
            [composite_name: string]: {
                is_composite: boolean;
                subgroup: {
                    [subgroup_children: string]: {
                        category?: number | null;
                        packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo;
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

    export function ConvertToManifest(
        information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo
    ): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = {
            version: information.version as 3 | 4,
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
                const packetInfo: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo = {
                    version: packet_info.version,
                    compression_flags: packet_info.compression_flags,
                    res: [],
                };

                packet_info.res.forEach((res: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.ResInfo) => {
                    packetInfo.res.push({ ...res, path: (res.path as string).split("\\") });
                });

                manifest_info.group[name].subgroup[name_packet] = {
                    category,
                    packet_info: packetInfo,
                };
            });
        });

        return manifest_info;
    }

    /**
     *
     * @param information - Pass information deserialize manifest
     * @returns Workaround manifest (Only for for the shell)
     */

    export function ConvertFromManifest(
        information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation
    ): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo {
        const manifest_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = {
            version: information.version as 3 | 4,
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
     * @param inRSB - Pass RSB
     * @param outDirectory - Pass directory output
     * @returns RSB Unpack
     */

    export function UnpackPopCapOfficialRSB(inRSB: string, outDirectory: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo {
        const manifest_json: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo = PvZ2Shell.RSBUnpack(inRSB, outDirectory);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            Path.Resolve(`${outDirectory}/manifest_info.json`),
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ConvertToManifest(manifest_json)
        );
        return manifest_json;
    }

    /**
     *
     * @param inRSB - Pass RSB here
     * @returns Unpack RSB by simple
     */

    export function UnpackPopCapOfficialRSBBySimple(
        inRSB: string,
        outDirectory: string,
        information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.SimpleResources
    ): void {
        const rsb_header_structure: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBHead = PvZ2Shell.ProcessRSBData(inRSB);
        if (rsb_header_structure.version !== 4) {
            throw new Sen.Script.Modules.Exceptions.UnsupportedDataType(`Does not support version other than version 4 for this function`, inRSB);
        }
        const manifest_additional_information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo =
            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(
                inRSB,
                outDirectory
            ) as Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.MainfestInfo;
        const manifest_group: string | undefined = manifest_additional_information.path?.rsgs.find((rsg: string) => /__MANIFESTGROUP__(.+)?/i.test(rsg));
        const packages: string | undefined = manifest_additional_information.path?.rsgs.find((rsg: string) => /Packages(.+)?/i.test(rsg));
        if (manifest_group) {
            PvZ2Shell.RSGUnpack(Path.Resolve(`${outDirectory}/packet/${manifest_group}.rsg`), Path.Resolve(`${outDirectory}/resource`), false);
            const resources_rton_path: string = Path.Resolve(`${outDirectory}/resource/PROPERTIES/RESOURCES.RTON`);
            if (Fs.FileExists(resources_rton_path)) {
                const resources_json_path: string = Path.Resolve(
                    `${Path.Dirname(resources_rton_path)}/${Path.Parse(resources_rton_path).name_without_extension}.json`
                );
                PvZ2Shell.RTONDecode(resources_rton_path, resources_json_path, false);
                Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                    resources_json_path,
                    Path.Resolve(`${outDirectory}/res.json`),
                    information.expand_path
                );
            }
        }
        if (packages) {
            PvZ2Shell.RSGUnpack(Path.Resolve(`${outDirectory}/packet/${packages}.rsg`), Path.Resolve(`${outDirectory}/resource`), false);
        }
        return;
    }
}
