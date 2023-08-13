namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack {
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
     * Structure
     */

    export enum RSGAbnormal {
        Header,
        NotASCIISmartpath,
        None,
    }

    /**
     *
     * @param rsg_in - Pass RSG path
     * @param out_dir - Output directory
     * @param use_res - Use res directory for unpack
     * @returns Extracted
     */

    export function RSGUnpack(rsg_in: string, out_dir: string, use_res: boolean = false): void {
        const standard: PacketInfo = Sen.Shell.PvZ2Shell.RSGUnpack(rsg_in, out_dir);
        const packet_info: PacketInfo = { ...standard, res: [] };
        standard.res.forEach((resx: ResInfo) => {
            packet_info.res.push({
                path: (resx.path as string).split("\\"),
                ptx_info: resx.ptx_info,
            });
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${out_dir}`, `packet.json`)), packet_info, use_res);
        return;
    }

    /**
     *
     * @param rsg_directory - Pass RSG Directory
     * @param our_rsg - Pass out file RSG
     */

    export function RSGPack(rsg_directory: string, out_rsg: string): void {
        const packet_info: PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${rsg_directory}`, `packet.json`)));
        packet_info.res.forEach((res: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo) => {
            res.path = (res.path as Array<string>).join("\\");
        });
        Sen.Shell.PvZ2Shell.RSGPack(rsg_directory, out_rsg, packet_info);
        return;
    }
}
