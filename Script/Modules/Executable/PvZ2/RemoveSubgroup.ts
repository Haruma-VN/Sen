namespace Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup {
    /**
     * Structure
     */

    export interface SubgroupChildrenStructure {
        [composite_name: string]: {
            is_composite: boolean;
            subgroup: {
                [subgroup_children: string]: {
                    category: [int, string | null];
                    packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo;
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
        const regex: RegExp = new RegExp(`_${keyword}$`, "i");
        groups.forEach((group: string) => {
            const subgroups: Array<string> = Object.keys(information.group[group].subgroup);
            subgroups.forEach((subgroup: string) => {
                if (regex.test(subgroup)) {
                    Sen.Shell.Console.Print(null, Sen.Script.Modules.System.Default.Localization.GetString("execution_process").replace(/\{\}/g, subgroup));
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
        const regex: RegExp = new RegExp(`_${keyword}$`, "i");
        groups.forEach((group: string) => {
            const subgroups: Array<string> = Object.keys(information.groups[group].subgroup);
            subgroups.forEach((subgroup: string) => {
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
        const all_files: Array<string> = Sen.Shell.FileSystem.ReadDirectory(directory, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory);
        const regex: RegExp = new RegExp(`_${keyword}$`, "i");
        all_files.forEach((file: string) => {
            if (Sen.Shell.FileSystem.FileExists(file) && regex.test(Sen.Shell.Path.Parse(file).name_without_extension)) {
                Sen.Shell.FileSystem.DeleteFile(file);
            }
        });
        return;
    }

    /**
     *
     * @returns Evaluate()
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("remove_subgroup"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_current_bundle"))
        );
        const dir_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const res_json_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${dir_in}`, `res.json`));
        const manifest_json_destination: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${dir_in}`, `manifest.json`));
        const packet_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${dir_in}`, `packet`));
        const keyword: string = `384`;
        if (!Sen.Shell.FileSystem.FileExists(res_json_destination)) {
            throw new Sen.Script.Modules.Exceptions.MissingFile(Sen.Script.Modules.System.Default.Localization.GetString("no_such_file").replace(/\{\}/g, res_json_destination), res_json_destination);
        }
        if (!Sen.Shell.FileSystem.FileExists(manifest_json_destination)) {
            throw new Sen.Script.Modules.Exceptions.MissingFile(Sen.Script.Modules.System.Default.Localization.GetString("no_such_file").replace(/\{\}/g, manifest_json_destination), manifest_json_destination);
        }
        if (!Sen.Shell.FileSystem.DirectoryExists(packet_directory)) {
            throw new Sen.Script.Modules.Exceptions.MissingDirectory(Sen.Script.Modules.System.Default.Localization.GetString("no_such_directory").replace(/\{\}/g, packet_directory), packet_directory);
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            manifest_json_destination,
            Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromManifest(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest_json_destination), keyword),
            false
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<res_json>(
            res_json_destination,
            Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromResJson(Sen.Script.Modules.FileSystem.Json.ReadJson<res_json>(res_json_destination), keyword),
            false
        );
        Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.RemoveFromPacket(keyword, packet_directory);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.Evaluate();
