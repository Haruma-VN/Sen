namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode {
    /**
     * Packet Info interface
     */
    export interface PacketInfo {
        version: number;
        compression_flags: number;
        res: ResInfo[];
    }

    /**
     * ResInfo interface
     */

    export interface ResInfo {
        path: string | string[];
        ptx_info?: PtxInfo;
    }

    /**
     * PTX Info interface
     */

    export interface PtxInfo {
        id: number;
        width: number;
        height: number;
    }

    /**
     *
     * @param rsg_in - Pass RSG path
     * @param out_dir - Output directory
     * @returns Extracted
     */

    export function RSGUnpack(rsg_in: string, out_dir: string): void {
        const standard: PacketInfo = PvZ2Shell.RSGUnpack(rsg_in, out_dir);
        const packet_info: PacketInfo = { ...standard, res: [] };
        standard.res.forEach((resx: ResInfo) => {
            packet_info.res.push({
                path: (resx.path as string).split("\\"),
                ptx_info: resx.ptx_info,
            });
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<PacketInfo>(Path.Resolve(`${out_dir}/packet.json`), packet_info);
        return;
    }

    /**
     *
     * @param rsg_directory - Pass RSG Directory
     * @param our_rsg - Pass out file RSG
     */

    export function RSGPack(rsg_directory: string, out_rsg: string): void {
        const packet_info: PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<PacketInfo>(Path.Resolve(`${rsg_directory}/packet.json`));
        packet_info.res.forEach((res: ResInfo) => {
            res.path = (res.path as Array<string>).join("\\");
        });
        PvZ2Shell.RSGPack(rsg_directory, out_rsg, packet_info);
        return;
    }
}
