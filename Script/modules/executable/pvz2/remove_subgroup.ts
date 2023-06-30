namespace Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup {
    /**
     * Structure
     */

    export interface SubgroupChildrenStructure {
        [composite_name: string]: {
            is_composite: boolean;
            subgroup: {
                [subgroup_children: string]: {
                    category: [number, string | null];
                    packet_info: Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo;
                };
            };
        };
    }

    /**
     *
     * @param information - Pass Deserialized Manifest
     * @param keyword - Pass keyword to remove such as _384
     * @returns Removed from manifest
     */

    export function RemoveFromManifest(information: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation, keyword: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation {
        const groups: Array<string> = Object.keys(information.group as Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure);
        groups.forEach((group: string) => {
            const subgroups: Array<string> = Object.keys(information.group[group].subgroup);
            subgroups.forEach((subgroup: string) => {
                const regex: RegExp = new RegExp(`_${keyword}$`, "i");
                if (regex.test(subgroup)) {
                    Console.Print(null, Sen.Script.Modules.System.Default.Localization.GetString("execution_process").replace(/\{\}/g, subgroup));
                    delete information.group[group].subgroup[subgroup];
                }
            });
        });
        return information;
    }

    /**
     *
     * @param information - Pass deserialized res_json
     * @param keyword - Pass keyword
     * @returns Removed from res.json
     */

    export function RemoveFromResJson(information: res_json, keyword: string): res_json {
        const groups: Array<string> = Object.keys(information.groups);
        groups.forEach((group: string) => {
            const subgroups: Array<string> = Object.keys(information.groups[group].subgroup);
            subgroups.forEach((subgroup: string) => {
                const regex: RegExp = new RegExp(`_${keyword}$`, "i");
                if (regex.test(subgroup)) {
                    delete information.groups[group].subgroup[subgroup];
                }
            });
        });
        return information;
    }

    /**
     *
     * @param keyword - Pass keyword to remove
     * @param directory - Pass directory path to remove
     * @returns Removed from directory
     */

    export function RemoveFromPacket(keyword: string, directory: string): void {
        const all_files: Array<string> = Fs.ReadDirectory(directory, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory);
        all_files.forEach((file: string) => {
            const regex: RegExp = new RegExp(`_${keyword}$`, "i");
            if (Fs.FileExists(file) && regex.test(Path.Parse(file).name_without_extension)) {
                Fs.DeleteFile(file);
            }
        });
        return;
    }

    /**
     *
     * @returns Evaluate()
     */

    export function Evaluate(): void {
        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input rsb.bundle path as simple unpack to continue`);
        const dir_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const res_json_destination: string = Path.Resolve(`${dir_in}/res.json`);
        const manifest_json_destination: string = Path.Resolve(`${dir_in}/manifest.json`);
        const packet_directory: string = Path.Resolve(`${dir_in}/packet`);
        if (!Fs.FileExists(res_json_destination)) {
            throw new Sen.Script.Modules.Exceptions.MissingFile(`No such file`, res_json_destination);
        }
        if (!Fs.FileExists(manifest_json_destination)) {
            throw new Sen.Script.Modules.Exceptions.MissingFile(`No such file`, manifest_json_destination);
        }
        if (!Fs.DirectoryExists(packet_directory)) {
            throw new Sen.Script.Modules.Exceptions.MissingDirectory(`No such directory`, packet_directory);
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            manifest_json_destination,
            Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromManifest(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest_json_destination), `384`)
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<res_json>(res_json_destination, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromResJson(Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(res_json_destination), `384`));
        Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromPacket(`384`, packet_directory);
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.Evaluate();
