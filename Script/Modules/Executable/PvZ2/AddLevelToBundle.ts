// DT :: Share -> Haruma :: Adapt
namespace Sen.Script.Modules.Executable.PvZ2.AddLevelToBundle {
    /**
     *  Default, don't change this
     */

    export const resource_path: Array<String> = Array.from(["packages", "levels"] as const);
    /**
     * Seperator
     */

    export const split_seperator: string = `` as const;

    export class Process {
        /**
         *
         * @param str - Pass string to cast
         * @returns string casted
         */
        private cast_pascal_case(str: string): string {
            const raw: Array<string> = str.split(split_seperator);
            const char_c: int = raw[0].charCodeAt(0);
            if (!(char_c >= 65 && char_c <= 90)) {
                raw[0] = String.fromCharCode(char_c - 32);
            }
            for (let i = 1; i < raw.length; ++i) {
                raw[i] = raw[i].toLowerCase();
            }
            return raw.join(split_seperator);
        }

        /**
         *
         * @param str - Pass string to cast
         * @returns string casted
         */

        private cast(str: string): string {
            if (/_/.test(str)) {
                return str;
            }
            return this.cast_pascal_case(str);
        }

        /**
         * Manifest
         */

        private manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;

        /**
         *  Res-Info
         */

        private res_info: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate;

        /**
         *
         * @param manifest - Manfiest path
         * @param res_info - Res-Info path
         * @returns
         */

        constructor(manifest: string, res_info: string) {
            this.manifest = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(manifest);
            this.res_info = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(res_info);
            return;
        }

        /**
         * Export Manifest
         */

        public export_manifest(): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation {
            return this.manifest;
        }

        /**
         * Export Res-Info
         */

        public export_res_info(): Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate {
            return this.res_info;
        }

        /**
         *
         * @param levels - Levels to push
         * @returns
         */

        public push_back(levels: Array<string>, directory_name: string): void {
            const keys: Array<string> = Object.keys(this.manifest.group);
            let index: int = -1;
            view_data: for (let i = 0; i < keys.length; ++i) {
                if (/Packages(.+)?/i.test(keys[i])) {
                    index = i;
                    break view_data;
                }
            }
            const packages: string = keys[index];
            const manifest_packages_keys: Array<string> = Object.keys(this.manifest.group[packages].subgroup);
            Sen.Script.Modules.Support.Json.Generic.Assert(manifest_packages_keys.length === 1, Sen.Script.Modules.System.Default.Localization.GetString("manifest_can_only_have_one_packages_in_subgroup"));
            const resource_packages_keys: Array<string> = Object.keys(this.res_info.groups[packages].subgroup);
            Sen.Script.Modules.Support.Json.Generic.Assert(resource_packages_keys.length === 1, Sen.Script.Modules.System.Default.Localization.GetString("res_info_can_only_have_one_packages_in_subgroup"));
            for (let i = 0; i < levels.length; ++i) {
                const path: Array<string> = [
                    ...levels[i]
                        .replace(new RegExp(`.*${directory_name}`), "")
                        .replaceAll("\\", "/")
                        .split("/"),
                ].filter((e) => e !== "");
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_success").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("apply_to").replace(/\{\}/g, path.join("/")))
                );
                this.manifest.group[packages].subgroup[manifest_packages_keys[0]].packet_info.res.push({
                    path: [...resource_path.map((e) => e.toUpperCase()), ...path.map((e) => e.toUpperCase())],
                    ptx_info: null!,
                    ptx_property: null!,
                });
                this.res_info.groups[packages].subgroup[manifest_packages_keys[0]].packet.data[
                    `RESFILE_PACKAGES_LEVELS_${path
                        .map((e, i) => (i === path.length - 1 ? Sen.Shell.Path.GetFileNameWithoutExtension(e) : e))
                        .join("_")
                        .toUpperCase()}`
                ] = {
                    type: `File`,
                    path: [...resource_path, ...path.map((e, i) => (i === path.length - 1 ? this.cast(e) : e.toLowerCase()))],
                };
            }
            return;
        }

        /**
         *
         * Kill the manifest and Res-Info
         */

        public release(): void {
            this.manifest = undefined!;
            this.res_info = undefined!;
            return;
        }
    }

    /**
     *
     * @param packages_path - Path of Package
     * @param levels - Levels
     * @returns
     */

    export function CopyLevels(packages_path: string, levels: Array<string>, directory_name: string) {
        const temporary: string = Sen.Shell.Path.Join(packages_path, ...resource_path.map((e) => e.toUpperCase()));
        if (!Sen.Shell.FileSystem.DirectoryExists(temporary)) {
            Sen.Shell.FileSystem.CreateDirectory(temporary);
        }
        for (const level of levels) {
            const m: Array<string> = [
                ...level
                    .replace(new RegExp(`.*${directory_name}`), "")
                    .replaceAll("\\", "/")
                    .split("/"),
            ].filter((e: string) => e !== "");
            const t = Sen.Shell.Path.Join(temporary, ...m);
            Sen.Shell.FileSystem.OutFile(t, Sen.Shell.FileSystem.ReadText(level, FileSystem.Constraints.EncodingType.UTF8));
        }
        return;
    }

    /**
     *
     * Sen : Execute
     *
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("add_levels_to_bundle"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_current_bundle"))
        );
        const dir_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_level_directory"))
        );
        const directory: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const raw: Array<string> = Sen.Shell.FileSystem.ReadDirectory(directory, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory).filter((e) => /((\.rton))?$/i.test(e));
        const manifest: string = Sen.Shell.Path.Join(dir_in, "manifest.json");
        const res_info: string = Sen.Shell.Path.Join(dir_in, "res.json");
        const view = new Process(manifest, res_info);
        const directory_name: string = Sen.Shell.Path.Basename(directory);
        view.push_back(
            raw.sort((a: string, b: string) => {
                const numA: int = parseInt(Sen.Shell.Path.Parse(a).name_without_extension);
                const numB: int = parseInt(Sen.Shell.Path.Parse(b).name_without_extension);
                return numA - numB;
            }),
            directory_name
        );
        Sen.Script.Modules.Executable.PvZ2.AddLevelToBundle.CopyLevels(Sen.Shell.Path.Join(dir_in, "resource"), raw, directory_name);
        Sen.Script.Modules.FileSystem.Json.WriteJson(manifest, view.export_manifest(), false);
        Sen.Script.Modules.FileSystem.Json.WriteJson(res_info, view.export_res_info(), false);
        view.release();
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.AddLevelToBundle.Evaluate();
