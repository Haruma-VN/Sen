namespace Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle {
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
                Sen.Shell.Console.Printf(null, `      ${index + 1}. ${arg}`);
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
     * Structure
     */

    export interface Option {
        int_bundle: string;
        cn_bundle: string;
        chinese_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
        international_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation;
    }

    /**
     *
     * @param option - pass option
     */

    export function Watch(option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Option): Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
        const bundle_list = new Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.BundleList();
        const chinese_groups: Array<string> = Object.keys(option.chinese_manifest.group);
        const available: Array<int> = new Array();
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("choose_one_or_more_group_that_displayed_and_click_enter_to_finish"))
        );
        chinese_groups.forEach((group: string, index: int) => {
            const valid_option: int = index + 1;
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `        ${valid_option}. ${group}`);
            available.push(valid_option);
        });
        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (input !== "") {
            if (available.includes(parseInt(input))) {
                const data: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure = option.chinese_manifest.group[chinese_groups[available[parseInt(input)] - 2]] as any &
                    Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure;
                bundle_list.AppendArgument(chinese_groups[available[parseInt(input)] - 2], data);
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`));
            }
            input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_finish").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("list_of_added_content"))
        );
        bundle_list.PrintArgument();
        const confirm: boolean = Boolean(Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(Sen.Script.Modules.System.Default.Localization.GetString("confirm_your_choice")));
        if (!confirm) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString("user_refused_to_continue"), `undefined`);
        }
        return bundle_list.argument;
    }

    /**
     * Structure
     */

    export interface AddRSGOption extends Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Option {
        watch: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure>;
        rsg: {
            ptx: {
                encode: bigint;
            };
        };
    }

    /**
     *
     * @param file_in - Pass RSG path
     * @param file_out - Pass RSG outpath
     * @returns RSG converted to 2i
     */

    export function ConvertTextureRSG(file_in: string, file_out: string, format: bigint): void {
        const packet_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name_without_extension}.packet`)}`);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGUnpack(file_in, packet_directory);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(
            Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`)
        );
        information.res.forEach((resource: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.ResInfo) => {
            let home: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${packet_directory}`, `res`));
            create_nested_directory: for (let i: int = 0; i < (resource.path as Array<string>).length; ++i) {
                if (i === resource.path.length - 1) {
                    break create_nested_directory;
                }
                home = Sen.Shell.Path.Join(home, resource.path[i]);
            }
            const ptx_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(home, resource.path.at(-1)! as string));
            const png_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(home, resource.path.at(-1)! as string).replace(/((\.ptx))?$/i, `.png`));
            Sen.Shell.TextureHandler.Create_PVRTC1_4BPP_RGBA_Decode(ptx_path, png_path, (resource.ptx_info as any).width, (resource.ptx_info as any).height);
            Sen.Shell.FileSystem.DeleteFile(ptx_path);
            switch (format) {
                case 147n: {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A8);
                    break;
                }
                case 0n: {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA8888);
                }
            }
            Sen.Shell.FileSystem.DeleteFile(png_path);
        });
        information.compression_flags = 0b0011;
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`), information, true);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGPack(packet_directory, file_out);
        Sen.Shell.FileSystem.DeleteDirectory([packet_directory]);
        return;
    }

    /**
     *
     * @param file_in - Pass file input
     * @param file_out - Pass file output
     * @returns RSG converted to 0x03
     */

    export function ConvertCommonRSG(file_in: string, file_out: string): void {
        const packet_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(file_in)}`, `${Sen.Shell.Path.Parse(file_in).name_without_extension}.packet`)}`);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGUnpack(file_in, packet_directory);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(
            Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`)
        );
        information.compression_flags = 0b0011;
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo>(Sen.Shell.Path.Join(`${packet_directory}`, `packet.json`), information, true);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGPack(packet_directory, file_out);
        Sen.Shell.FileSystem.DeleteDirectory([packet_directory]);
        return;
    }

    /**
     *
     * @param option Pass option
     */

    export function AddsRSGToOfficialPacketBundle(option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.AddRSGOption): void {
        const keys: Array<string> = Object.keys(option.watch);
        keys.forEach((key: string) => {
            const second_keys: Array<string> = Object.keys((option.watch[key] as any).subgroup);
            second_keys.forEach((rsg_name: string) => {
                const rsg_entry: string = `${rsg_name}.rsg`;
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("converted_rsg").replace(/\{\}/g, `${rsg_entry}`))
                );
                const entry: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.cn_bundle, `packet`, rsg_entry));
                const output: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(option.int_bundle, `packet`, rsg_entry));
                (option.watch[key] as any).subgroup[rsg_name].packet_info.compression_flags = 0b0011;
                switch ((option.watch[key] as any).subgroup[rsg_name].category[0]) {
                    case 0: {
                        Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ConvertCommonRSG(entry, output);
                        break;
                    }
                    default: {
                        Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ConvertTextureRSG(entry, output, option.rsg.ptx.encode);
                        (option.watch[key] as any).subgroup[rsg_name].packet_info.res.forEach((e: any) => {
                            e.ptx_property.format = option.rsg.ptx.encode;
                            e.ptx_property.pitch = BigInt(e.ptx_info.width) * 4n;
                        });
                        break;
                    }
                }
            });
            option.international_manifest.group[key] = option.watch[key] as any;
        });
        return;
    }

    /**
     * Structure
     */

    export interface ResJsonTemplate {
        groups: {
            [x: string]: any;
        };
    }

    /**
     *
     * @param option - Pass option
     * @returns
     */

    export function AppendUnofficialResources(option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.AddRSGOption): void {
        const res_json_international: string = Sen.Shell.Path.Join(option.int_bundle, `res.json`);
        const res_json_chinese: string = Sen.Shell.Path.Join(option.cn_bundle, `res.json`);
        const deserialized_international_res_json: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(res_json_international);
        const deserialized_chinese_res_json: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(res_json_chinese);
        const keys: Array<string> = Object.keys(option.watch);
        keys.forEach((key: string) => {
            deserialized_international_res_json.groups[key] = deserialized_chinese_res_json.groups[key];
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.ResJsonTemplate>(res_json_international, deserialized_international_res_json, false);
        return;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("import_pvz2c_bundle"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_current_bundle"))
        );
        const international_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_chinese_bundle"))
        );
        const chinese_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Option = {
            int_bundle: international_bundle,
            cn_bundle: chinese_bundle,
            chinese_manifest: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Join(chinese_bundle, `manifest.json`)),
            international_manifest: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Join(international_bundle, `manifest.json`)),
        };
        const argument: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> = Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Watch(option);
        const executable_option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.AddRSGOption = {
            ...option,
            watch: argument,
            rsg: {
                ptx: {
                    encode: 147n,
                },
            },
        };
        Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.AddsRSGToOfficialPacketBundle(executable_option);
        Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.AppendUnofficialResources(executable_option);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Join(`${option.int_bundle}`, `manifest.json`), option.international_manifest, true);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Evaluate();
