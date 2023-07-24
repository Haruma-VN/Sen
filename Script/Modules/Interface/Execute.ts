namespace Sen.Script.Modules.Interface.Execute {
    /**
     *
     * @param argument - Pass argument
     */
    export function ExecuteArgument(argument: string | Array<string>): void {
        const available: Array<int> = new Array();
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("all_functions_loaded")
            )
        );
        if (Array.isArray(argument)) {
            for (const func of Sen.Script.Modules.Interface.Assert.FunctionCollection) {
                if (func === "popcap_official_atlas_split" || func === "popcap_unofficial_atlas_split") {
                    if (Sen.Script.Modules.Interface.Assert.CheckForJsonAndPng(argument)) {
                        Sen.Shell.Console.Printf(
                            null,
                            `      ${
                                Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                            }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                        );
                        available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                        continue;
                    }
                }
                const assert_test: boolean = argument.every((arg: string) =>
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        arg,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude
                    )
                );
                if (assert_test) {
                    Sen.Shell.Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            }
        } else {
            Sen.Script.Modules.Interface.Assert.FunctionCollection.forEach((func: string) => {
                if (
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        argument,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude
                    )
                ) {
                    Sen.Shell.Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            });
        }
        if (available.length === 0) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("no_function_were_found")
                )
            );
            return;
        }
        const func_name: function_name = Sen.Script.Modules.Interface.Execute.GetFunctionName(Sen.Script.Modules.Interface.Arguments.TestInput(available));
        Sen.Script.Modules.Interface.Execute.Evaluate(func_name, argument);
        return;
    }

    /**
     *
     * @param option - Pass user input
     * @returns The function number name
     */

    export function GetFunctionName(option: int): function_name {
        let index: number = -1;
        for (let i: number = 0; i < Sen.Script.Modules.Interface.Assert.FunctionNumbers.length; ++i) {
            if (Sen.Script.Modules.Interface.Assert.FunctionNumbers[i] === option) {
                index = i;
                break;
            }
        }
        return Sen.Script.Modules.Interface.Assert.FunctionCollection[index] as function_name;
    }

    /**
     * function
     */

    export type function_name =
        | "js_evaluate"
        | "popcap_ptx_encode"
        | "popcap_ptx_decode"
        | "popcap_official_resources_split"
        | "popcap_official_resources_merge"
        | "popcap_official_atlas_split"
        | "popcap_official_pam_to_pam_json"
        | "popcap_official_pam_json_to_pam"
        | "popcap_official_atlas_merge"
        | "popcap_unofficial_atlas_split"
        | "popcap_unofficial_atlas_merge"
        | "popcap_unofficial_resources_split"
        | "popcap_unofficial_resources_merge"
        | "popcap_rton_to_json"
        | "popcap_json_to_rton"
        | "popcap_sprite_resize"
        | "popcap_official_pam_to_flash_animation"
        | "popcap_official_pam_from_flash_animation"
        | "popcap_official_resources_to_unofficial_resources"
        | "popcap_unofficial_resources_to_official_resources"
        | "popcap_rsg_unpack"
        | "popcap_rsg_pack"
        | "popcap_official_pam_json_to_flash_animation"
        | "popcap_official_pam_json_from_flash_animation"
        | "popcap_rsb_unpack"
        | "popcap_rsb_pack"
        | "popcap_zlib_compress"
        | "popcap_zlib_uncompress"
        | "popcap_rsb_unpack_simple"
        | "popcap_rsb_pack_simple"
        | "wwise_media_to_ogg"
        | "popcap_rsb_obfuscate"
        | "wwise_soundbank_decode"
        | "wwise_soundbank_encode"
        | "popcap_rton_encrypt"
        | "popcap_rton_decrypt"
        | "popcap_rton_encode_and_encrypt"
        | "popcap_rton_decrypt_and_decode"
        | "popcap_add_image_to_flash_animation_adobe"
        | "flash_animation_resize"
        | "popcap_rsb_unpack_by_loose_constraints"
        | "popcap_rsb_unpack_resource"
        | "popcap_rsb_pack_resource"
        | "popcap_rsb_unpack_with_simplified_manifest"
        | "popcap_rsb_pack_with_simplified_manifest"
        | "ogg_to_wav"
        | "popcap_official_resource_path_convert"
        | "popcap_animation_render";

    /**
     *
     * @param function_name - Function name
     * @param argument - Pass argument
     * @returns Evaluate the tool
     */

    export function Evaluate(function_name: Sen.Script.Modules.Interface.Execute.function_name, argument: string | string[]): void {
        let notify: boolean = true;
        const func_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        try {
            switch (function_name) {
                case "js_evaluate": {
                    if (!Array.isArray(argument)) {
                        Sen.Shell.JavaScriptCoreEngine.Evaluate(
                            Sen.Shell.FileSystem.ReadText(argument, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                            argument.replaceAll(`/`, `\\`)
                        );
                    } else {
                        argument.forEach((arg: string) =>
                            Sen.Shell.JavaScriptCoreEngine.Evaluate(
                                Sen.Shell.FileSystem.ReadText(arg, 0 as Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                                arg.replaceAll(`/`, `\\`)
                            )
                        );
                    }
                    break;
                }
                case "popcap_official_resource_path_convert": {
                    if (!Array.isArray(argument)) {
                        const convert: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_official_resource_path_convert"),
                            [1, 2],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"),
                                ],
                            },
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(
                                    `${Sen.Shell.MainScriptDirectory}`,
                                    `Modules`,
                                    `Customization`,
                                    `Methods`,
                                    `popcap_resources_path_convert.json`
                                )
                            ),
                            `convert`
                        ) as 1 | 2;
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.convert.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        switch (convert) {
                            case 1: {
                                Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToArray(
                                    argument,
                                    output_argument
                                );
                                break;
                            }
                            case 2: {
                                Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToString(
                                    argument,
                                    output_argument,
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType.array
                                );
                                break;
                            }
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const convert: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_official_resource_path_convert"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_resources_path_convert.json`
                                    )
                                ),
                                `convert`
                            ) as 1 | 2;
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.convert.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            switch (convert) {
                                case 1: {
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToArray(
                                        arg,
                                        output_argument
                                    );
                                    break;
                                }
                                case 2: {
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToString(
                                        arg,
                                        output_argument,
                                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathType.array
                                    );
                                    break;
                                }
                            }
                        });
                    }
                    break;
                }
                case "popcap_rsb_unpack_by_loose_constraints": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bundle`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackAbnormalRSBByLooseConstraints(argument, output_argument);
                        Sen.Shell.Console.Print(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Magenta,
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                Sen.Script.Modules.System.Default.Localization.GetString("please_use_for_more"),
                                [
                                    Sen.Script.Modules.System.Default.Localization.GetString("popcap_rsb_pack_resource"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                ]
                            )
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bundle`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackAbnormalRSBByLooseConstraints(arg, output_argument);
                            Sen.Shell.Console.Print(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Magenta,
                                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                                    Sen.Script.Modules.System.Default.Localization.GetString("please_use_for_more"),
                                    [
                                        Sen.Script.Modules.System.Default.Localization.GetString("popcap_rsb_pack_resource"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                    ]
                                )
                            );
                        });
                    }
                    break;
                }
                case "popcap_rton_decrypt": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bin`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecrypt(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bin`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecrypt(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                            );
                        });
                    }
                    break;
                }
                case "popcap_add_image_to_flash_animation_adobe": {
                    if (!Array.isArray(argument)) {
                        Sen.Shell.Console.Print(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("input_more_that_path").replace(/\{\}/g, "png")
                            )
                        );
                        const png_argument: Array<string> = new Array();
                        assert_argument: while (true) {
                            let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                            if (arg.endsWith(` `)) {
                                arg = arg.slice(0, -1);
                            }
                            if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                                arg = arg.slice(1, -1);
                            }
                            if (Sen.Shell.FileSystem.FileExists(arg) && /((\.png))$/i.test(arg)) {
                                png_argument.push(arg);
                                break assert_argument;
                            } else {
                                Sen.Shell.Console.Print(
                                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                                    Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                                        /\{\}/g,
                                        Sen.Script.Modules.System.Default.Localization.GetString("file_assert_is_not").replace(/\{\}/g, "png")
                                    )
                                );
                            }
                        }
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                            ),
                            `resolution`
                        );
                        const sprite_distribution: 1 | 2 | 3 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("sprite_distribution"),
                            [1, 2, 3],
                            {
                                "1": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("do_not_touch_sprite"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("do_not_touch_sprite"),
                                ],
                                "2": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("add_to_existed_sprite"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("add_to_existed_sprite"),
                                ],
                                "3": [
                                    Sen.Script.Modules.System.Default.Localization.GetString("generate_a_new_sprite"),
                                    Sen.Script.Modules.System.Default.Localization.GetString("generate_a_new_sprite"),
                                ],
                            }
                        ) as 1 | 2 | 3;
                        let option: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.Option = {
                            generate_sprite: "none",
                        };
                        switch (sprite_distribution) {
                            case 1:
                                option.generate_sprite = "none";
                                break;
                            case 2:
                                option.generate_sprite = "old";
                                break;
                            case 3:
                                option.generate_sprite = "new";
                                break;
                        }
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.AddImageToAnimationAdobeFlash(png_argument, argument, resolution, option);
                    } else {
                        argument.forEach((arg: string) => {
                            Sen.Shell.Console.Print(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                                Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                    /\{\}/g,
                                    Sen.Script.Modules.System.Default.Localization.GetString("input_more_that_path").replace(/\{\}/g, "png")
                                )
                            );
                            const png_argument: Array<string> = new Array();
                            assert_argument: while (true) {
                                let arg: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                                if (arg.endsWith(` `)) {
                                    arg = arg.slice(0, -1);
                                }
                                if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                                    arg = arg.slice(1, -1);
                                }
                                if (Sen.Shell.FileSystem.FileExists(arg) && /((\.json))?$/i.test(arg)) {
                                    png_argument.push(arg);
                                    break assert_argument;
                                } else {
                                    Sen.Shell.Console.Print(
                                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                                            /\{\}/g,
                                            Sen.Script.Modules.System.Default.Localization.GetString("file_assert_is_not").replace(/\{\}/g, "png")
                                        )
                                    );
                                }
                            }
                            const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                                ),
                                `resolution`
                            );
                            const sprite_distribution: 1 | 2 | 3 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("sprite_distribution"),
                                [1, 2, 3],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("do_not_touch_sprite"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("do_not_touch_sprite"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("add_to_existed_sprite"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("add_to_existed_sprite"),
                                    ],
                                    "3": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("generate_a_new_sprite"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("generate_a_new_sprite"),
                                    ],
                                }
                            ) as 1 | 2 | 3;
                            let option: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.Option = {
                                generate_sprite: "none",
                            };
                            switch (sprite_distribution) {
                                case 1:
                                    option.generate_sprite = "none";
                                    break;
                                case 2:
                                    option.generate_sprite = "old";
                                    break;
                                case 3:
                                    option.generate_sprite = "new";
                                    break;
                            }
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.AddImageToAnimationAdobeFlash(png_argument, arg, resolution, option);
                        });
                    }
                    break;
                }
                case "popcap_rton_encrypt": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bin`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncrypt(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bin`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncrypt(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                            );
                        });
                    }
                    break;
                }
                case "ogg_to_wav": {
                    if (!Array.isArray(argument)) {
                        try {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.wav`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Shell.PvZ2Shell.ConvertOGGtoWAV(argument, output_argument);
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.RuntimeError(`${(error as any).message}`, argument);
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            try {
                                const output_argument: string = Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.wav`)
                                );
                                Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                                Sen.Shell.PvZ2Shell.ConvertOGGtoWAV(arg, output_argument);
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.RuntimeError(`${(error as any).message}`, arg);
                            }
                        });
                    }
                    break;
                }
                case "wwise_media_to_ogg": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.ogg`)
                        );
                        const inlineCodebook: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                                Sen.Script.Modules.System.Default.Localization.GetString("is_inline_codebook"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `wwise_encoded_media.json`)
                                ),
                                `inlineCodebook`
                            )
                        );
                        const inlineSetup: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                                Sen.Script.Modules.System.Default.Localization.GetString("is_inline_setup"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `wwise_encoded_media.json`)
                                ),
                                `inlineSetup`
                            )
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        try {
                            Sen.Shell.PvZ2Shell.WemToOGG(
                                argument,
                                output_argument,
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `${Sen.Script.Modules.System.Default.Localization.packed_codebooks_aoTuV_603}`
                                    )
                                ),
                                inlineCodebook,
                                inlineSetup
                            );
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.RuntimeError(`${(error as any).message}`, argument);
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.ogg`)
                            );
                            const inlineCodebook: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                                    Sen.Script.Modules.System.Default.Localization.GetString("is_inline_codebook"),
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `wwise_encoded_media.json`
                                        )
                                    ),
                                    `inlineCodebook`
                                )
                            );
                            const inlineSetup: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                                    Sen.Script.Modules.System.Default.Localization.GetString("is_inline_setup"),
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `wwise_encoded_media.json`
                                        )
                                    ),
                                    `inlineSetup`
                                )
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            try {
                                Sen.Shell.PvZ2Shell.WemToOGG(
                                    arg,
                                    output_argument,
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `${Sen.Script.Modules.System.Default.Localization.packed_codebooks_aoTuV_603}`
                                        )
                                    ),
                                    inlineCodebook,
                                    inlineSetup
                                );
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.RuntimeError(`${(error as any).message}`, arg);
                            }
                        });
                    }
                    break;
                }
                case "wwise_soundbank_encode": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.bnk`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankEncodeBySimple(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.bnk`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankEncodeBySimple(arg, output_argument);
                        });
                    }
                    break;
                }
                case "wwise_soundbank_decode": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.soundbank`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankDecodeBySimple(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.soundbank`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseSoundbankDecodeBySimple(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_resources_to_unofficial_resources": {
                    if (!Array.isArray(argument)) {
                        const expand_path: "array" | "string" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_resources_conversion.json`
                                    )
                                ),
                                `expand_path`
                            ) as 1 | 2) === 1
                                ? "array"
                                : "string";
                        const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `res.json`));
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                            argument,
                            output_argument,
                            expand_path
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const expand_path: "array" | "string" =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                    [1, 2],
                                    {
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                        ],
                                        "2": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_resources_conversion.json`
                                        )
                                    ),
                                    `expand_path`
                                ) as 1 | 2) === 1
                                    ? "array"
                                    : "string";
                            const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `res.json`));
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                                arg,
                                output_argument,
                                expand_path
                            );
                        });
                    }
                    break;
                }
                case "popcap_rsg_unpack": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.packet`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.packet`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsg_pack": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.rsg`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.rsg`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_unpack": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bundle`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bundle`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSB(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_unpack_with_simplified_manifest": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bundle`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapRSBWithSimplifiedInformation(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bundle`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapRSBWithSimplifiedInformation(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_unpack_simple": {
                    if (!Array.isArray(argument)) {
                        const expand_path: "array" | "string" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_unpack_simple.json`
                                    )
                                ),
                                `expand_path`
                            ) as 1 | 2) === 1
                                ? "array"
                                : "string";
                        const encrypted_rton: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("rton_are_encrypted"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_unpack_simple.json`
                                    )
                                ),
                                `encryptedRton`
                            ) as 0 | 1
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bundle`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSBBySimple(argument, output_argument, {
                            encryptedRTON: encrypted_rton,
                            expand_path: expand_path,
                        });
                    } else {
                        argument.forEach((arg: string) => {
                            const expand_path: "array" | "string" =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                    [1, 2],
                                    {
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                        ],
                                        "2": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_simple.json`
                                        )
                                    ),
                                    `expand_path`
                                ) as 1 | 2) === 1
                                    ? "array"
                                    : "string";
                            const encrypted_rton: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("rton_are_encrypted"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_simple.json`
                                        )
                                    ),
                                    `encryptedRton`
                                ) as 0 | 1
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bundle`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.UnpackPopCapOfficialRSBBySimple(arg, output_argument, {
                                encryptedRTON: encrypted_rton,
                                expand_path: expand_path,
                            });
                        });
                    }
                    break;
                }
                case "popcap_rsb_pack": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSB(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSB(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_pack_with_simplified_manifest": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSBUsingSimplifiedInformation(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSBUsingSimplifiedInformation(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_pack_resource": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}`)
                        );
                        const use_convert: boolean =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("convert_convert_to_unpack"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_convert_directory_for_pack"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_convert_directory_for_pack"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_pack_resource.json`
                                    )
                                ),
                                `use_convert`
                            ) as 0 | 1) === 1
                                ? true
                                : false;
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.PackPopCapRSBInsideConvertDirectory({
                            use_convert: use_convert,
                            convert_pam_json_to_pam: false,
                            convert_png_to_ptx: false,
                            convert_res_json_to_resource_json: false,
                            convert_xfl_to_pam_json: false,
                            encode_rtons: false,
                            encodeBNK: false,
                            encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial.key,
                            rsb_output: output_argument,
                            rton_encrypt: false,
                            texture_format: "android",
                            bundle_path: argument,
                        });
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}`)
                            );
                            const use_convert: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_convert_to_unpack"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_unpack_directory"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_convert_directory_for_pack"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_convert_directory_for_pack"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_pack_resource.json`
                                        )
                                    ),
                                    `use_convert`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.PackPopCapRSBInsideConvertDirectory({
                                use_convert: use_convert,
                                convert_pam_json_to_pam: false,
                                convert_png_to_ptx: false,
                                convert_res_json_to_resource_json: false,
                                convert_xfl_to_pam_json: false,
                                encode_rtons: false,
                                encodeBNK: false,
                                encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial.key,
                                rsb_output: output_argument,
                                rton_encrypt: false,
                                texture_format: "android",
                                bundle_path: arg,
                            });
                        });
                    }
                    break;
                }
                case "popcap_rsb_pack_simple": {
                    if (!Array.isArray(argument)) {
                        const encrypted_rton: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("ignore_encrypt"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("ignore_encrypt"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons_for_pvz2c"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons_for_pvz2c"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_pack_simple.json`
                                    )
                                ),
                                `encryptedRton`
                            ) as 0 | 1
                        );
                        const generate_resources: boolean =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("convert_res_json_to_resources_json"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_by_automatically"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_by_automatically"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_legacy_resources_json"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_legacy_resources_json"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_pack_simple.json`
                                    )
                                ),
                                `use_res_json`
                            ) as 1 | 2) === 1
                                ? true
                                : false;
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSBBySimple(argument, output_argument, {
                            encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt.key,
                            encryptRTON: encrypted_rton,
                            generate_resources: generate_resources,
                        });
                    } else {
                        argument.forEach((arg: string) => {
                            const encrypted_rton: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("ignore_encrypt"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("ignore_encrypt"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons_for_pvz2c"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("encrypt_pvz2_rtons_for_pvz2c"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_pack_simple.json`
                                        )
                                    ),
                                    `encryptedRton`
                                ) as 0 | 1
                            );
                            const generate_resources: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("convert_res_json_to_resources_json"),
                                    [1, 2],
                                    {
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("convert_by_automatically"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("convert_by_automatically"),
                                        ],
                                        "2": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_legacy_resources_json"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_legacy_resources_json"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_pack_simple.json`
                                        )
                                    ),
                                    `use_res_json`
                                ) as 1 | 2) === 1
                                    ? true
                                    : false;
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Pack.PackPopCapRSBBySimple(arg, output_argument, {
                                encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt.key,
                                encryptRTON: encrypted_rton,
                                generate_resources: generate_resources,
                            });
                        });
                    }
                    break;
                }
                case "popcap_unofficial_resources_to_official_resources": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `resources.json`));
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `resources.json`));
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_unofficial_resources_split": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.json.info`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.json.info`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_pam_from_flash_animation": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.pam`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        const extra: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonConvertBack(
                                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
                                    Sen.Shell.Path.Join(`${argument}`, `extra.json`)
                                )
                            );
                        try {
                            Sen.Shell.PvZ2Shell.FlashAnimationtoPAM(argument, output_argument, extra);
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.FlashAnimationToPopCapAnimationError(`${(error as any).message}`, argument);
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.pam`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            const extra: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonConvertBack(
                                    Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
                                        Sen.Shell.Path.Join(`${arg}`, `extra.json`)
                                    )
                                );
                            try {
                                Sen.Shell.PvZ2Shell.FlashAnimationtoPAM(arg, output_argument, extra);
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.FlashAnimationToPopCapAnimationError(`${(error as any).message}`, arg);
                            }
                        });
                    }
                    break;
                }
                case "popcap_rton_to_json": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
                            );
                        });
                    }
                    break;
                }
                case "popcap_rton_decrypt_and_decode": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONDecode(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                            );
                        });
                    }
                    break;
                }
                case "popcap_rton_encode_and_encrypt": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.rton`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.rton`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt
                            );
                        });
                    }
                    break;
                }
                case "popcap_json_to_rton": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.rton`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                            argument,
                            output_argument,
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.rton`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.PopCapRTONEncode(
                                arg,
                                output_argument,
                                Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial
                            );
                        });
                    }
                    break;
                }
                case "popcap_unofficial_resources_merge": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.MergeUnofficialJson.CreateConversion(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_ptx_decode": {
                    if (!Array.isArray(argument)) {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.png`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            argument,
                            output_argument,
                            dimension.width,
                            dimension.height,
                            encode
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                            const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.png`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                                argument,
                                output_argument,
                                dimension.width,
                                dimension.height,
                                encode
                            );
                        });
                    }
                    break;
                }
                case "popcap_official_atlas_merge": {
                    if (!Array.isArray(argument)) {
                        const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(argument, destination);
                    } else {
                        argument.forEach((arg: string) => {
                            const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                            Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(arg, destination);
                        });
                    }
                    break;
                }
                case "popcap_ptx_encode": {
                    if (!Array.isArray(argument)) {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.ptx`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(argument, output_argument, encode);
                    } else {
                        argument.forEach((arg: string) => {
                            const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.ptx`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(argument, output_argument, encode);
                        });
                    }
                    break;
                }
                case "popcap_official_resources_split": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.res`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.res`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_resources_merge": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_atlas_split": {
                    if (Array.isArray(argument)) {
                        const method: "id" | "path" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_method"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_atlas_split.json`)
                                ),
                                `method`
                            ) as 1 | 2) === 2
                                ? "path"
                                : "id";
                        const expand_path: "array" | "string" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_atlas_split.json`)
                                ),
                                `expand_path`
                            ) as 1 | 2) === 1
                                ? "array"
                                : "string";
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractOfficialAtlas.ExtractPvZ2AtlasOfficialStructure(
                            argument,
                            method,
                            expand_path
                        );
                    }
                    break;
                }
                case "popcap_unofficial_atlas_split": {
                    if (Array.isArray(argument)) {
                        const method: "id" | "path" =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_method"),
                                [1, 2],
                                {
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_id"),
                                    ],
                                    "2": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("split_atlas_to_sprites_by_property_path"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_atlas_split.json`)
                                ),
                                `method`
                            ) as 1 | 2) === 2
                                ? "path"
                                : "id";
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractUnofficialPvZ2Atlas.ExtractPvZ2AtlasUnofficialStructure(argument, method);
                    }
                    break;
                }
                case "popcap_unofficial_atlas_merge": {
                    if (!Array.isArray(argument)) {
                        const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(argument, destination);
                    } else {
                        argument.forEach((arg: string) => {
                            const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement =
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputAtlasMerge();
                            Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(arg, destination);
                        });
                    }
                    break;
                }
                case "popcap_official_pam_to_pam_json": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.pam.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.pam.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimationJson(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_pam_to_flash_animation": {
                    if (!Array.isArray(argument)) {
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                            ),
                            `resolution`
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.xfl`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimateAdobeFlashAnimation(argument, output_argument, resolution);
                    } else {
                        argument.forEach((arg: string) => {
                            const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                                ),
                                `resolution`
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.xfl`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationToAnimateAdobeFlashAnimation(arg, output_argument, resolution);
                        });
                    }
                    break;
                }
                case "popcap_official_pam_json_to_pam": {
                    if (!Array.isArray(argument)) {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                argument
                            )
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(
                                `${Sen.Shell.Path.Dirname(argument)}`,
                                `${Sen.Shell.Path.Parse(Sen.Shell.Path.Parse(argument).name_without_extension).name_without_extension}.pam`
                            )
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimation(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                    arg
                                )
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(
                                    `${Sen.Shell.Path.Dirname(arg)}`,
                                    `${Sen.Shell.Path.Parse(Sen.Shell.Path.Parse(arg).name_without_extension).name_without_extension}.pam`
                                )
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimation(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_sprite_resize": {
                    if (!Array.isArray(argument)) {
                        const original: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_original_res"),
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_sprite_resize.json`)
                            ),
                            `original_res`
                        );
                        const modified: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_output_res"),
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_sprite_resize.json`)
                            ),
                            `output_res`
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(
                                `${Sen.Shell.Path.Dirname(argument)}`,
                                `${Sen.Shell.Path.Parse(argument).name.replace(original.toString(), modified.toString())}`
                            )
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                            argument,
                            original,
                            modified,
                            output_argument
                        );
                    } else {
                        argument.forEach((arg: string) => {
                            const original: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_original_res"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_sprite_resize.json`)
                                ),
                                `original_res`
                            );
                            const modified: 1536 | 768 | 384 | 640 | 1200 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_sprite_resize_output_res"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_sprite_resize.json`)
                                ),
                                `output_res`
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(
                                    `${Sen.Shell.Path.Dirname(arg)}`,
                                    `${Sen.Shell.Path.Parse(arg).name.replace(original.toString(), modified.toString())}`
                                )
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                                arg,
                                original,
                                modified,
                                output_argument
                            );
                        });
                    }
                    break;
                }
                case "popcap_official_pam_json_from_flash_animation": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.pam.json`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.AnimateAdobeFlashAnimationToPopCapAnimationJson(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                    arg
                                )
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.pam.json`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.AnimateAdobeFlashAnimationToPopCapAnimationJson(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_rsb_obfuscate": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name}.bin`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        Sen.Shell.PvZ2Shell.RSBObfuscate(argument, output_argument);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name}.bin`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            Sen.Shell.PvZ2Shell.RSBObfuscate(arg, output_argument);
                        });
                    }
                    break;
                }
                case "popcap_official_pam_json_to_flash_animation": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(argument)}`, `${Sen.Shell.Path.Parse(argument).name_without_extension}.xfl`)
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                            Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                            ),
                            `resolution`
                        );
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(argument, output_argument, resolution);
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(`${Sen.Shell.Path.Dirname(arg)}`, `${Sen.Shell.Path.Parse(arg).name_without_extension}.xfl`)
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation.json`)
                                ),
                                `resolution`
                            );
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PopCapAnimationJsonToAnimateAdobeFlashAnimation(arg, output_argument, resolution);
                        });
                    }
                    break;
                }
                case "flash_animation_resize": {
                    if (!Array.isArray(argument)) {
                        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                            Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation")
                        );
                        try {
                            Sen.Shell.PvZ2Shell.FlashAnimationResize(argument, resolution);
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.FlashAnimationResizeError(`${(error as any).message}`, argument);
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation")
                            );
                            try {
                                Sen.Shell.PvZ2Shell.FlashAnimationResize(arg, resolution);
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.FlashAnimationResizeError(`${(error as any).message}`, arg);
                            }
                        });
                    }
                    break;
                }
                case "popcap_zlib_compress": {
                    if (!Array.isArray(argument)) {
                        const use_64bit_variant: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("unknown"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("not_use_64_bit_variant"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("set_this_if_you_using_pvzgames"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_zlib.json`)
                                ),
                                `use_64_bit_variant`
                            ) as 0 | 1
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(`${argument}.bin`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        try {
                            Sen.Shell.PvZ2Shell.PopCapZlibCompress(
                                argument,
                                use_64bit_variant,
                                output_argument,
                                Sen.Script.Modules.Compression.Constraints.ZlibLevel.Optimal
                            );
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                argument
                            );
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const use_64bit_variant: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("unknown"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_use_64_bit_variant"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_this_if_you_using_pvzgames"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_zlib.json`)
                                    ),
                                    `use_64_bit_variant`
                                ) as 0 | 1
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(`${arg}.bin`);
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            try {
                                Sen.Shell.PvZ2Shell.PopCapZlibCompress(
                                    arg,
                                    use_64bit_variant,
                                    output_argument,
                                    Sen.Script.Modules.Compression.Constraints.ZlibLevel.Optimal
                                );
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                    Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                    arg
                                );
                            }
                        });
                    }
                    break;
                }
                case "popcap_rsb_unpack_resource": {
                    if (!Array.isArray(argument)) {
                        const use_convert: boolean =
                            (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("use_convert_directory"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("not_convert_everything_after_unpack_all_rsgs"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("not_convert_everything_after_unpack_all_rsgs"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_everything_after_unpack_all_rsgs"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_everything_after_unpack_all_rsgs"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_unpack_resource.json`
                                    )
                                ),
                                `use_convert`
                            ) as 0 | 1) === 1
                                ? true
                                : false;
                        if (use_convert) {
                            const architecture: "android" | "ios" | "android_cn" = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArchitecture(
                                Sen.Script.Modules.System.Default.Localization.GetString("input_architecture"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_unpack_resource.json`
                                    )
                                ),
                                `architecture`
                            );
                            const extract_atlas: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("extract_atlas"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_extract_atlas"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("extract_atlas"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `extract_atlas`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            const decode_bnk: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_bnk"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_bnk"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_bnk"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_bnk`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            const decode_popcap_animation: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_pam"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_pam"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_pam"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_pam`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            let convert_pam_to_flash_animation: boolean = false;
                            if (decode_popcap_animation) {
                                convert_pam_to_flash_animation =
                                    (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_pam_json_to_flash_animation"),
                                        [0, 1],
                                        {
                                            "0": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                    /\{\}/g,
                                                    Sen.Script.Modules.System.Default.Localization.GetString("False")
                                                ),
                                                Sen.Script.Modules.System.Default.Localization.GetString("not_convert_pam_json_to_flash_animation"),
                                            ],
                                            "1": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                    /\{\}/g,
                                                    Sen.Script.Modules.System.Default.Localization.GetString("True")
                                                ),
                                                Sen.Script.Modules.System.Default.Localization.GetString("convert_pam_json_to_flash_animation"),
                                            ],
                                        },
                                        Sen.Shell.Path.Resolve(
                                            Sen.Shell.Path.Join(
                                                `${Sen.Shell.MainScriptDirectory}`,
                                                `Modules`,
                                                `Customization`,
                                                `Methods`,
                                                `popcap_rsb_unpack_resource.json`
                                            )
                                        ),
                                        `convert_pam_json_to_flash_animation`
                                    ) as 0 | 1) === 1
                                        ? true
                                        : false;
                            }
                            let resolution: int = 1200;
                            if (convert_pam_to_flash_animation) {
                                resolution = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                    Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `resolution`
                                );
                            }
                            const decode_rtons: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_rtons"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_rtons"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_rtons"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_rtons`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            let encrypted_rton: boolean = false;
                            if (decode_rtons) {
                                encrypted_rton = Boolean(
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                        Sen.Script.Modules.System.Default.Localization.GetString("rton_are_encrypted"),
                                        [0, 1],
                                        {
                                            "0": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                            ],
                                            "1": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                            ],
                                        },
                                        Sen.Shell.Path.Resolve(
                                            Sen.Shell.Path.Join(
                                                `${Sen.Shell.MainScriptDirectory}`,
                                                `Modules`,
                                                `Customization`,
                                                `Methods`,
                                                `popcap_rsb_unpack_resource.json`
                                            )
                                        ),
                                        `encryptedRton`
                                    ) as 0 | 1
                                );
                            }
                            const expand_path: "array" | "string" =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                    [1, 2],
                                    {
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                        ],
                                        "2": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `expand_path`
                                ) as 1 | 2) === 1
                                    ? "array"
                                    : "string";
                            const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${argument}`, `convert`));
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.UnpackAllPopCapRSGDataInsideUnpackDirectory(
                                {
                                    rsb_parent_directory: argument,
                                    rsb_unpack_dir: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${argument}`, `unpack`)),
                                    texture_format: architecture,
                                    extractAtlas: extract_atlas,
                                    encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt.key,
                                    decode_bnk: decode_bnk,
                                    decode_pam: decode_popcap_animation,
                                    pam_to_flash_animation: convert_pam_to_flash_animation,
                                    extractSprites: true,
                                    decode_rton: decode_rtons,
                                    decode_wem: false,
                                    rton_encrypted: encrypted_rton,
                                    resolution: resolution,
                                    expand_path: expand_path,
                                },
                                output_argument
                            );
                        } else {
                            const output_argument: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${argument}`, `unpack`));
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.UnpackAllPopCapRSGs(argument, output_argument);
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const architecture: "android" | "ios" | "android_cn" = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArchitecture(
                                Sen.Script.Modules.System.Default.Localization.GetString("input_architecture"),
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(
                                        `${Sen.Shell.MainScriptDirectory}`,
                                        `Modules`,
                                        `Customization`,
                                        `Methods`,
                                        `popcap_rsb_unpack_resource.json`
                                    )
                                ),
                                `architecture`
                            );
                            const extract_atlas: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("extract_atlas"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_extract_atlas"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("extract_atlas"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `extract_atlas`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            const decode_bnk: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_bnk"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_bnk"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_bnk"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_bnk`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            const decode_popcap_animation: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_pam"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_pam"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_pam"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_pam`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            let convert_pam_to_flash_animation: boolean = false;
                            if (decode_popcap_animation) {
                                convert_pam_to_flash_animation =
                                    (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                        Sen.Script.Modules.System.Default.Localization.GetString("convert_pam_json_to_flash_animation"),
                                        [0, 1],
                                        {
                                            "0": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                    /\{\}/g,
                                                    Sen.Script.Modules.System.Default.Localization.GetString("False")
                                                ),
                                                Sen.Script.Modules.System.Default.Localization.GetString("not_convert_pam_json_to_flash_animation"),
                                            ],
                                            "1": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                    /\{\}/g,
                                                    Sen.Script.Modules.System.Default.Localization.GetString("True")
                                                ),
                                                Sen.Script.Modules.System.Default.Localization.GetString("convert_pam_json_to_flash_animation"),
                                            ],
                                        },
                                        Sen.Shell.Path.Resolve(
                                            Sen.Shell.Path.Join(
                                                `${Sen.Shell.MainScriptDirectory}`,
                                                `Modules`,
                                                `Customization`,
                                                `Methods`,
                                                `popcap_rsb_unpack_resource.json`
                                            )
                                        ),
                                        `convert_pam_json_to_flash_animation`
                                    ) as 0 | 1) === 1
                                        ? true
                                        : false;
                            }
                            let resolution: int = 1200;
                            if (convert_pam_to_flash_animation) {
                                resolution = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(
                                    Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"),
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `resolution`
                                );
                            }
                            const decode_rtons: boolean =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("decode_rtons"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("False")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_decode_rtons"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_the_argument_to").replace(
                                                /\{\}/g,
                                                Sen.Script.Modules.System.Default.Localization.GetString("True")
                                            ),
                                            Sen.Script.Modules.System.Default.Localization.GetString("decode_rtons"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `decode_rtons`
                                ) as 0 | 1) === 1
                                    ? true
                                    : false;
                            let encrypted_rton: boolean = false;
                            if (decode_rtons) {
                                encrypted_rton = Boolean(
                                    Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                        Sen.Script.Modules.System.Default.Localization.GetString("rton_are_encrypted"),
                                        [0, 1],
                                        {
                                            "0": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_normal_rton"),
                                            ],
                                            "1": [
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                                Sen.Script.Modules.System.Default.Localization.GetString("use_encrypted_rton_decrypt"),
                                            ],
                                        },
                                        Sen.Shell.Path.Resolve(
                                            Sen.Shell.Path.Join(
                                                `${Sen.Shell.MainScriptDirectory}`,
                                                `Modules`,
                                                `Customization`,
                                                `Methods`,
                                                `popcap_rsb_unpack_resource.json`
                                            )
                                        ),
                                        `encryptedRton`
                                    ) as 0 | 1
                                );
                            }
                            const expand_path: "array" | "string" =
                                (Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("using_popcap_resources_path"),
                                    [1, 2],
                                    {
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_old_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_old_resources_path"),
                                        ],
                                        "2": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("select_this_if_you_are_modding_on_pvz2_new_resources"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("using_new_resources_path"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(
                                            `${Sen.Shell.MainScriptDirectory}`,
                                            `Modules`,
                                            `Customization`,
                                            `Methods`,
                                            `popcap_rsb_unpack_resource.json`
                                        )
                                    ),
                                    `expand_path`
                                ) as 1 | 2) === 1
                                    ? "array"
                                    : "string";
                            Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Resource.UnpackAllPopCapRSGDataInsideUnpackDirectory(
                                {
                                    rsb_parent_directory: arg,
                                    rsb_unpack_dir: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${arg}`, `unpack`)),
                                    texture_format: architecture,
                                    extractAtlas: extract_atlas,
                                    encryptionKey: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONEncrypt.key,
                                    decode_bnk: decode_bnk,
                                    decode_pam: decode_popcap_animation,
                                    pam_to_flash_animation: convert_pam_to_flash_animation,
                                    extractSprites: true,
                                    decode_rton: decode_rtons,
                                    decode_wem: false,
                                    rton_encrypted: encrypted_rton,
                                    resolution: resolution,
                                    expand_path: expand_path,
                                },
                                Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${arg}`, `convert`))
                            );
                        });
                    }
                    break;
                }
                case "popcap_zlib_uncompress": {
                    if (!Array.isArray(argument)) {
                        const use_64bit_variant: boolean = Boolean(
                            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                [0, 1],
                                {
                                    "0": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("unknown"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("not_use_64_bit_variant"),
                                    ],
                                    "1": [
                                        Sen.Script.Modules.System.Default.Localization.GetString("set_this_if_you_using_pvzgames"),
                                        Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                    ],
                                },
                                Sen.Shell.Path.Resolve(
                                    Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_zlib.json`)
                                ),
                                `use_64_bit_variant`
                            ) as 0 | 1
                        );
                        const output_argument: string = Sen.Shell.Path.Resolve(`${argument}.bin`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                        try {
                            Sen.Shell.PvZ2Shell.PopCapZlibUncompress(argument, use_64bit_variant, output_argument);
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                argument
                            );
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const use_64bit_variant: boolean = Boolean(
                                Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                                    Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                    [0, 1],
                                    {
                                        "0": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("unknown"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("not_use_64_bit_variant"),
                                        ],
                                        "1": [
                                            Sen.Script.Modules.System.Default.Localization.GetString("set_this_if_you_using_pvzgames"),
                                            Sen.Script.Modules.System.Default.Localization.GetString("use_64_bit_variant"),
                                        ],
                                    },
                                    Sen.Shell.Path.Resolve(
                                        Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_zlib.json`)
                                    ),
                                    `use_64_bit_variant`
                                ) as 0 | 1
                            );
                            const output_argument: string = Sen.Shell.Path.Resolve(`${arg}.bin`);
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "file");
                            try {
                                Sen.Shell.PvZ2Shell.PopCapZlibUncompress(arg, use_64bit_variant, output_argument);
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                    Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                    arg
                                );
                            }
                        });
                    }
                    break;
                }
                case "popcap_animation_render": {
                    if (!Array.isArray(argument)) {
                        const output_argument: string = Sen.Shell.Path.Resolve(
                            Sen.Shell.Path.Join(
                                `${Sen.Shell.Path.Dirname(argument)}`,
                                `${Sen.Shell.Path.Parse(Sen.Shell.Path.Parse(argument).name_without_extension).name_without_extension}.render.animation`
                            )
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                        try {
                            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.GenerateImageSequence(argument, output_argument);
                        } catch (error: unknown) {
                            throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                argument
                            );
                        }
                    } else {
                        argument.forEach((arg: string) => {
                            const output_argument: string = Sen.Shell.Path.Resolve(
                                Sen.Shell.Path.Join(
                                    `${Sen.Shell.Path.Dirname(arg)}`,
                                    `${Sen.Shell.Path.Parse(Sen.Shell.Path.Parse(arg).name_without_extension).name_without_extension}.render.animation`
                                )
                            );
                            Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument, "directory");
                            try {
                                Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.GenerateImageSequence(arg, output_argument);
                            } catch (error: unknown) {
                                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                                    Sen.Script.Modules.System.Default.Localization.GetString((error as any).message),
                                    arg
                                );
                            }
                        });
                    }
                    break;
                }
                default: {
                    throw new Sen.Script.Modules.Exceptions.RuntimeError(
                        Sen.Script.Modules.System.Default.Localization.GetString("function_not_found").replace(/\{\}/g, function_name),
                        Sen.Script.Modules.Interface.Assert.function_json_location
                    ) as never;
                }
            }
        } catch (error: unknown) {
            notify = false;
            Sen.Script.Modules.Exceptions.PrintError<Error, string>(error);
            if (Sen.Script.Modules.System.Default.Localization.EntryJson.default.execute_again_after_error) {
                const confirm: boolean = Boolean(
                    Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                        Sen.Script.Modules.System.Default.Localization.GetString("execute_again")
                    )
                );
                if (confirm) {
                    Evaluate(function_name, argument);
                }
            }
        }
        const func_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        const time_spent: string = Sen.Script.Modules.System.Default.Timer.CalculateTime(func_time_start, func_time_end, 3);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(/\{\}/g, time_spent)
        );
        if (Sen.Script.Modules.System.Default.Localization.notification && notify) {
            Sen.Shell.DotNetPlatform.SendNotification(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("toast_notification_message"),
                    [Sen.Script.Modules.System.Default.Localization.GetString(function_name), time_spent]
                ),
                `Sen`
            );
        }
        return;
    }
}
