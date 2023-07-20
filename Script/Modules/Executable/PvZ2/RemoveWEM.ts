namespace Sen.Script.Modules.Executable.PvZ2.RemoveWEM {
    /**
     * Remove ID, please add more if necessary
     */
    export const RemoveID: Array<bigint> = new Array<bigint>(...[3304213229n, 2272285081n, 1888044339n, 1397963563n]);

    /**
     * Structure
     */

    export interface Options {
        bundle: string;
        removeID: Array<string>;
    }

    /**
     *
     * @param IDs ids bigint
     * @returns
     */

    export function ConvertToWEMArray(IDs: Array<bigint>): Array<string> {
        return IDs.map((id: bigint) => `${id.toString()}.wem`);
    }

    /**
     *
     * @param information - pass res json
     * @param IDs - pass ids
     * @returns
     */

    export function RemoveFromResJson(information: res_json, IDs: Array<string>): res_json {
        Object.keys(information.groups[`StreamingWave`].subgroup[`StreamingWave`].packet.data).forEach((group: string, index: int) => {
            if (IDs.includes((information.groups[`StreamingWave`].subgroup[`StreamingWave`].packet.data[group].path as any).at(-1)?.toLowerCase() as string)) {
                delete information.groups[`StreamingWave`].subgroup[`StreamingWave`].packet.data[group];
            }
        });
        return information;
    }

    /**
     *
     * @param information - pass manifest
     * @param IDs - ids
     * @returns
     */

    export function RemoveFromManifest(
        information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation,
        IDs: Array<string>
    ): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation {
        information.group[`StreamingWave`][`subgroup`][`StreamingWave`][`packet_info`][`res`].forEach((res: any, index: int) => {
            if (IDs.includes(res.path.at(-1).toLowerCase())) {
                delete information.group[`StreamingWave`][`subgroup`][`StreamingWave`][`packet_info`][`res`][index];
            }
        });
        return information;
    }

    /**
     *
     * @param option - pass option
     * @returns
     */

    export function RemoveFromStreamingWave(option: Sen.Script.Modules.Executable.PvZ2.RemoveWEM.Options): void {
        const streamingwave_rsg: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${option.bundle}`, `packet`, `StreamingWave.rsg`));
        const streamingwave_dir: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${option.bundle}`, `packet`, `StreamingWave.packet`));
        if (Sen.Shell.FileSystem.FileExists(streamingwave_rsg)) {
            Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(streamingwave_rsg, streamingwave_dir);
            const packet_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${streamingwave_dir}`, `packet.json`));
            const packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo =
                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(packet_path);
            packet_info.res.forEach((res: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.ResInfo, index: int) => {
                if (option.removeID.includes(res.path.at(-1)?.toLowerCase() as string)) {
                    delete packet_info.res[index];
                }
            });
            const streamingwave_inside: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${streamingwave_dir}`, `res`, `STREAMINGWAVES`));
            option.removeID.forEach((id: string) => {
                const assert: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(streamingwave_inside, id));
                if (Sen.Shell.FileSystem.FileExists(assert)) {
                    Sen.Shell.Console.Print(null, `Removed ${assert}`);
                    Sen.Shell.FileSystem.DeleteFile(assert);
                }
            });
            const res_json_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${option.bundle}`, `res.json`));
            const manifest_json_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${option.bundle}`, `manifest.json`));
            Sen.Script.Modules.FileSystem.Json.WriteJson<res_json>(
                res_json_destination,
                Sen.Script.Modules.Executable.PvZ2.RemoveWEM.RemoveFromResJson(
                    Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(res_json_destination),
                    option.removeID
                )
            );
            Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
                manifest_json_destination,
                Sen.Script.Modules.Executable.PvZ2.RemoveWEM.RemoveFromManifest(
                    Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
                        manifest_json_destination
                    ),
                    option.removeID
                )
            );
            Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(packet_path, packet_info);
            Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(streamingwave_dir, streamingwave_rsg);
            Sen.Shell.FileSystem.DeleteDirectory([streamingwave_dir]);
        }
        return;
    }

    /**
     *
     * @returns Evaluate()
     */

    export function Evaluate(): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("input_current_bundle")
            )
        );
        const dir_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Script.Modules.Executable.PvZ2.RemoveWEM.RemoveFromStreamingWave({
            bundle: dir_in,
            removeID: Sen.Script.Modules.Executable.PvZ2.RemoveWEM.ConvertToWEMArray(Sen.Script.Modules.Executable.PvZ2.RemoveWEM.RemoveID),
        });
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.RemoveWEM.Evaluate();
