namespace Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB {
    /**
     * Structure
     */

    export interface CustomProjectOption {
        current_bundle: string;
        import_bundle: string;
        current_rsb_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
        import_rsb_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
        current_rsb_res_json: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate;
        import_rsb_res_json: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate;
    }

    /**
     * Structure
     */

    export interface PortableProject<CompositeShell extends string> {
        version: 4n;
        ptx_info_size: 16n;
        groups: Array<CompositeShell>;
    }

    /**
     *
     * @param option - Pass option
     * @returns Test Argument
     */

    export function AssertVersion(option: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CustomProjectOption): void {
        if (!(BigInt(option.current_rsb_manifest.version) === 4n)) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString("this_script_only_support_rsb_version_4"), option.current_bundle);
        }
        if (!(BigInt(option.current_rsb_manifest.ptx_info_size) === 16n)) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString("this_script_only_support_rsb_ptx_info_size_16"), option.current_bundle);
        }
        if (!(BigInt(option.import_rsb_manifest.version) === 4n)) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString("this_script_only_support_rsb_version_4"), option.import_bundle);
        }
        if (!(BigInt(option.import_rsb_manifest.ptx_info_size) === 16n)) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString("this_script_only_support_rsb_ptx_info_size_16"), option.import_bundle);
        }
        return;
    }
    /**
     * Bundle List Structure
     */
    export class BundleList {
        /**
         * argument
         */
        private _argument: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure>;

        public constructor() {
            this._argument = {};
            return;
        }

        /**
         * getter
         */

        get argument(): Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
            return this._argument;
        }

        /**
         * setter
         */

        public AppendArgument(key: string, str: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure): void {
            this._argument[key] = str;
            return;
        }

        /**
         *
         * @param index - Pass index to delete
         * @returns
         */

        public DeleteArgument(key: string): void {
            delete this._argument[key];
            return;
        }

        /**
         * Print arguments
         * @returns
         */

        public PrintArgument(): void {
            Object.keys(this._argument).forEach((arg: string, index: int) => {
                Sen.Shell.Console.Printf(null, `        ${index + 1}. ${arg}`);
            });
            return;
        }

        /**
         *
         * @returns Exported keys of JS Object
         */

        public ExportKeys(): Array<string> {
            return Object.keys(this._argument);
        }

        /**
         *
         * @returns Exported value of JS Object
         */

        public ExportValue(): Array<Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
            return Object.values(this._argument);
        }
    }

    /**
     *
     * @returns Empty project getter
     */

    export function GenerateProjectGetter(): Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.PortableProject<string> {
        const portable_project: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.PortableProject<string> = {
            version: 4n,
            ptx_info_size: 16n,
            groups: [],
        };
        return portable_project;
    }
    /**
     *
     * @param option - Pass option
     * @param append - Pass appendable
     * @returns
     */

    export function AppendUnofficialResources(option: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CustomProjectOption, append: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure>): void {
        const keys: Array<string> = Object.keys(append);
        keys.forEach((key: string) => {
            option.current_rsb_res_json.groups[key] = option.import_rsb_res_json.groups[key];
        });
        return;
    }

    export function RequestArgument(option: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CustomProjectOption): Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
        Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.AssertVersion(option);
        const bundle_list = new Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.BundleList();
        const selection_method: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString(`import_type`), [1, 2], {
            "1": [Sen.Script.Modules.System.Default.Localization.GetString(`select_composite`), Sen.Script.Modules.System.Default.Localization.GetString(`select_composite`)],
            "2": [Sen.Script.Modules.System.Default.Localization.GetString(`import_composite`), Sen.Script.Modules.System.Default.Localization.GetString(`import_composite`)],
        }) as 1 | 2;
        switch (BigInt(selection_method)) {
            case 1n: {
                const composite_shell: Array<string> = Object.keys(option.import_rsb_manifest.group);
                const available: Array<int> = new Array<int>();
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                    Sen.Script.Modules.System.Default.Localization.GetString(`execution_argument`).replace(
                        /\{\}/g,
                        Sen.Script.Modules.System.Default.Localization.GetString(`choose_one_or_more_group_that_displayed_and_click_enter_to_finish`)
                    )
                );
                composite_shell.forEach((group: string, index: int) => {
                    const valid_option: int = index + 1;
                    Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `        ${valid_option}. ${group}`);
                    available.push(valid_option);
                });
                let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                while (input !== ``) {
                    if (available.includes(parseInt(input))) {
                        const data: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure = option.import_rsb_manifest.group[composite_shell[available[parseInt(input)] - 2]] as any &
                            Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure;
                        bundle_list.AppendArgument(composite_shell[available[parseInt(input)] - 2], data);
                    } else {
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString(`is_not_valid_input_argument`).replace(/\{\}/g, `${input}`));
                    }
                    input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                }
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                    Sen.Script.Modules.System.Default.Localization.GetString(`execution_finish`).replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString(`list_of_added_content`))
                );
                bundle_list.PrintArgument();
                const confirm: boolean = Boolean(Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(Sen.Script.Modules.System.Default.Localization.GetString(`confirm_your_choice`)));
                if (!confirm) {
                    throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString(`user_refused_to_continue`), `undefined`);
                }
                break;
            }
            case 2n: {
                const composite_json_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.current_bundle, `import.json`));
                Sen.Script.Modules.Interface.Arguments.ArgumentPrint(composite_json_path, `file`);
                Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.PortableProject<string>>(
                    composite_json_path,
                    Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.GenerateProjectGetter(),
                    true
                );
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString(`please_edit_import_json`));
                let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                while (input !== ``) {
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString(`is_not_enter`));
                    input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                }
                const portable_project: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.PortableProject<string> =
                    Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.PortableProject<string>>(composite_json_path);
                portable_project.groups.forEach((composite_shell: string) => {
                    bundle_list.AppendArgument(composite_shell, option.import_rsb_manifest.group[composite_shell] as any & Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure);
                });
            }
        }
        return bundle_list.argument;
    }
    /**
     *
     * @param file_in - Pass file input
     * @param file_out - Pass file output
     * @returns
     */

    export function ConvertAbnormalRSG(file_in: string, file_out: string): void {
        const packet_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name_without_extension}.packet`)}`);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(file_in, packet_directory);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(
            Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`)
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`), information, false);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(packet_directory, file_out);
        Sen.Shell.FileSystem.DeleteDirectory([packet_directory]);
        return;
    }

    /**
     *
     * @param option - Pass option
     * @param append - Append Composite Shell
     * @returns
     */

    export function CopyRSGFromAlternativeBundle(
        option: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CustomProjectOption,
        append: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure>
    ): void {
        const composite_shell_list: Array<string> = Object.keys(append);
        composite_shell_list.forEach((composite_shell: string) => {
            const subgroups: Array<string> = Object.keys(append[composite_shell].subgroup);
            subgroups.forEach((subgroup: string) => {
                const rsg_original: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.import_bundle, `packet`, `${subgroup}.rsg`));
                switch (Sen.Shell.PvZ2Shell.IsPopCapRSG(rsg_original)) {
                    case Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGAbnormal.Header: {
                        Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.ConvertAbnormalRSG(rsg_original, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.current_bundle, `packet`, `${subgroup}.rsg`)));
                        break;
                    }
                    case Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGAbnormal.NotASCIISmartpath: {
                        throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString(`rsg_abnormal_contains_non_ascii_smartpart`), subgroup);
                    }
                    case Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGAbnormal.None: {
                        Sen.Shell.FileSystem.CopyFile(rsg_original, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.current_bundle, `packet`, `${subgroup}.rsg`)));
                        break;
                    }
                }
            });
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString(`execution_finish`).replace(/\{\}/g, composite_shell));
            option.current_rsb_manifest.group[composite_shell] = option.import_rsb_manifest.group[composite_shell];
        });
        return;
    }

    /**
     *
     * @returns Evaluate()
     */
    export function Evaluate(): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString(`execution_argument`).replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString(`input_current_bundle`))
        );
        const current_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath(`directory`);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString(`execution_argument`).replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString(`input_imported_project`))
        );
        const import_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath(`directory`);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen,
            Sen.Script.Modules.System.Default.Localization.GetString(`execution_status`).replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString(`deserializing_json`))
        );
        const custom: Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CustomProjectOption = {
            current_bundle: current_bundle,
            import_bundle: import_bundle,
            current_rsb_manifest: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(current_bundle, `manifest.json`))),
            import_rsb_manifest: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(import_bundle, `manifest.json`))),
            current_rsb_res_json: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(current_bundle, `res.json`))),
            import_rsb_res_json: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(import_bundle, `res.json`))),
        };
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString(`execution_status`).replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString(`finished`))
        );
        const append: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> = Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.RequestArgument(custom);
        Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.AppendUnofficialResources(custom, append);
        Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.CopyRSGFromAlternativeBundle(custom, append);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(current_bundle, `res.json`)),
            custom.current_rsb_res_json,
            false
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(current_bundle, `manifest.json`)),
            custom.current_rsb_manifest,
            false
        );
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.ImportSubgroupFromRSB.Evaluate();
