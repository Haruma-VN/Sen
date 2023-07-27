namespace Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest {
    /**
     * Structure
     */

    export interface CompositeInformation<Subgroup> {
        is_composite: boolean;
        subgroup: Array<Subgroup>;
    }

    /**
     * Structure
     */
    export interface ResourceManager<Subgroup> {
        version: 3n | 4n;
        ptx_info_size: 16n | 20n | 24n;
        group: Record<string, Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.CompositeInformation<Subgroup>>;
    }

    /**
     * Structure
     */

    export interface SubgroupSerializeContent {
        category: [int, string | null];
        packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo;
    }

    /**
     *
     * @param file_path - Pass file path
     * @param output_directory - Pass out dir
     * @returns Splitted manifest
     */
    export function SplitManifest<CompositeShell extends string, Subgroup extends string>(file_path: string, output_directory: string): void {
        const deserialize_content: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(file_path);
        Sen.Shell.FileSystem.CreateDirectory(output_directory);
        const subgroup_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_directory, `subgroup`));
        Sen.Shell.FileSystem.CreateDirectory(subgroup_directory);
        const description: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.ResourceManager<string> = {
            version: deserialize_content.version as unknown as 3n | 4n,
            ptx_info_size: deserialize_content.ptx_info_size as unknown as 16n | 20n | 24n,
            group: {},
        };
        const composite_shell_list: Array<CompositeShell> = Object.keys(deserialize_content.group) as Array<CompositeShell>;
        composite_shell_list.forEach((composite_shell: CompositeShell) => {
            description.group[composite_shell] = {
                is_composite: deserialize_content.group[composite_shell].is_composite,
                subgroup: [],
            };
            const subgroup_list: Array<Subgroup> = Object.keys(deserialize_content.group[composite_shell].subgroup) as Array<Subgroup>;
            subgroup_list.forEach((subgroup: Subgroup) => {
                description.group[composite_shell].subgroup.push(subgroup);
                Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.SubgroupSerializeContent>(
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(subgroup_directory, `${subgroup}.json`)),
                    deserialize_content.group[composite_shell].subgroup[subgroup],
                    false
                );
            });
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.ResourceManager<string>>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_directory, `description.json`)), description, false);
        return;
    }

    /**
     *
     * @param input_directory - Input directory
     * @param outfile - Outfile
     * @returns
     */

    export function MergeManifest<CompositeShell extends string, Subgroup extends string>(input_directory: string, outfile: string): void {
        const description: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.ResourceManager<string> = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.ResourceManager<string>>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${input_directory}`, `description.json`))
        );
        const subgroup_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(input_directory, `subgroup`));
        const manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = {
            version: description.version as unknown as 3 | 4,
            ptx_info_size: description.ptx_info_size as unknown as 16 | 20 | 24,
            group: {},
        };
        const composite_shell_list: Array<CompositeShell> = Object.keys(description.group) as Array<CompositeShell>;
        composite_shell_list.forEach((composite_shell: string) => {
            manifest.group[composite_shell] = {
                is_composite: description.group[composite_shell].is_composite,
                subgroup: {},
            };
            (description.group[composite_shell].subgroup as Array<Subgroup>).forEach((subgroup: Subgroup) => {
                manifest.group[composite_shell].subgroup[subgroup] = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Manifest.SubgroupSerializeContent>(
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(subgroup_directory, `${subgroup}.json`))
                );
            });
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(outfile, manifest, false);
        return;
    }
}
