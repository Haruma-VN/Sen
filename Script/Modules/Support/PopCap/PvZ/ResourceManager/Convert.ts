namespace Sen.Script.Modules.Support.PopCap.PvZ.ResourceManager.Convert {
    /**
     * Main Group
     */

    export interface ResourcesDescription {
        groups: Record<string, DescriptionGroup>;
    }

    /**
     * Description
     */

    export interface DescriptionGroup {
        composite: boolean;
        subgroups: Record<string, DescriptionSubGroup>;
    }

    /**
     * Subgroup
     */

    export interface DescriptionSubGroup {
        res: string;
        language: string;
        resources: Record<string, DescriptionResources>;
    }

    /**
     * Resource
     */

    export interface DescriptionResources {
        type: bigint;
        path: string;
        ptx_info?: PropertiesPtxInfo;
        properties: Record<string, string>;
    }

    /**
     * Property
     */

    export interface PropertiesPtxInfo {
        imagetype: string;
        aflags: string;
        x: string;
        y: string;
        ax: string;
        ay: string;
        aw: string;
        ah: string;
        rows: string;
        cols: string;
        parent: string;
    }

    /**
     * Definition
     */

    export interface Definition {
        composite: boolean;
        subgroups: Array<string>;
    }

    /**
     *
     * @param file_path - Description file path
     * @param out_dir - Output directory
     * @returns
     */

    export function Split(file_path: string, out_dir: string): void {
        const description: ResourcesDescription = Sen.Script.Modules.FileSystem.Json.ReadJson(file_path);
        Sen.Shell.FileSystem.CreateDirectory(out_dir);
        const root: string = Sen.Shell.Path.Join(out_dir, `subgroups`);
        Sen.Shell.FileSystem.CreateDirectory(root);
        const groups: Array<string> = Object.keys(description.groups);
        const group_size: number = groups.length;
        const definition: Record<string, Definition> = {};
        for (let i: number = 0; i < group_size; ++i) {
            definition[groups[i]] = {
                composite: description.groups[groups[i]].composite,
                subgroups: [],
            };
            const subgroups: Array<string> = Object.keys(description.groups[groups[i]].subgroups);
            const subgroup_size: number = subgroups.length;
            for (let j: number = 0; j < subgroup_size; ++j) {
                definition[groups[i]].subgroups.push(subgroups[j]);
                Sen.Script.Modules.FileSystem.Json.WriteJson<DescriptionSubGroup>(Sen.Shell.Path.Join(root, `${subgroups[j]}.json`), description.groups[groups[i]].subgroups[subgroups[j]], false);
            }
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Record<string, Definition>>(Sen.Shell.Path.Join(out_dir, `definition.json`), definition, false);
        return;
    }

    /**
     *
     * @param dir_path - Input directory
     * @param out_file - Out file
     * @returns
     */

    export function Merge(dir_path: string, out_file: string): void {
        const definition: Record<string, Definition> = Sen.Script.Modules.FileSystem.Json.ReadJson(Sen.Shell.Path.Join(dir_path, `definition.json`));
        const root: string = Sen.Shell.Path.Join(dir_path, `subgroups`);
        const description: ResourcesDescription = {
            groups: {},
        };
        const groups: Array<string> = Object.keys(definition);
        const group_size: number = groups.length;
        for (let i = 0; i < group_size; ++i) {
            description.groups[groups[i]] = {
                composite: definition[groups[i]].composite,
                subgroups: {},
            };
            const subgroups: Array<string> = definition[groups[i]].subgroups;
            const subgroup_size: number = subgroups.length;
            for (let j = 0; j < subgroup_size; ++j) {
                description.groups[groups[i]].subgroups[subgroups[j]] = Sen.Script.Modules.FileSystem.Json.ReadJson(Sen.Shell.Path.Join(root, `${subgroups[j]}.json`));
            }
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<ResourcesDescription>(out_file, description, false);
        return;
    }
}
