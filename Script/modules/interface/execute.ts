namespace Sen.Script.Modules.Interface.Execute {
    /**
     *
     * @param argument - Pass argument
     */
    export function ExecuteArgument(argument: string | Array<string>): void {
        const available: Array<int> = new Array();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("all_functions_loaded"),
            ),
        );
        if (Array.isArray(argument)) {
            for (const func of Sen.Script.Modules.Interface.Assert.FunctionCollection) {
                if (func === "popcap_official_atlas_split" || func === "popcap_unofficial_atlas_split") {
                    if (Sen.Script.Modules.Interface.Assert.CheckForJsonAndPng(argument)) {
                        Console.Printf(
                            null,
                            `      ${
                                Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                            }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`,
                        );
                        available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                        continue;
                    }
                }
                const assert_test: boolean = argument.every((arg: string) =>
                    Sen.Script.Modules.FileSystem.FilterFilePath(
                        arg,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].include,
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude,
                    ),
                );
                if (assert_test) {
                    Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`,
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
                        Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].exclude,
                    )
                ) {
                    Console.Printf(
                        null,
                        `      ${
                            Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number
                        }. ${Sen.Script.Modules.System.Default.Localization.GetString(func)}`,
                    );
                    available.push(Sen.Script.Modules.Interface.Assert.FunctionJsonObject[func].func_number);
                }
            });
        }
        if (available.length === 0) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("no_function_were_found"),
                ),
            );
            return;
        }
        const func_name: function_name = Sen.Script.Modules.Interface.Execute.GetFunctionName(
            Sen.Script.Modules.Interface.Arguments.TestInput(available),
        );
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
        | "popcap_official_pam_from_flash_animation";

    /**
     *
     * @param function_name - Function name
     * @param argument - Pass argument
     * @returns Evaluate the tool
     */

    export function Evaluate(
        function_name: Sen.Script.Modules.Interface.Execute.function_name,
        argument: string | string[],
    ): void {
        const func_time_start: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        switch (function_name) {
            case "js_evaluate": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(argument);
                } else {
                    argument.forEach((arg: string) => Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(arg));
                }
                break;
            }
            case "popcap_unofficial_resources_split": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                        argument,
                        argument.replace(/((\.json))?$/i, ".json.info"),
                    );
                } else {
                    argument.forEach((arg: string) =>
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                            arg,
                            arg.replace(/((\.json))?$/i, ".json.info"),
                        ),
                    );
                }
                break;
            }
            case "popcap_official_pam_from_flash_animation": {
                if (!Array.isArray(argument)) {
                    PvZ2Shell.FlashAnimationtoPAM(argument, argument.replace(/((\.xfl))?$/i, ".pam"));
                } else {
                    argument.forEach((arg: string) =>
                        PvZ2Shell.FlashAnimationtoPAM(arg, arg.replace(/((\.xfl))?$/i, ".pam")),
                    );
                }
                break;
            }
            case "popcap_rton_to_json": {
                if (!Array.isArray(argument)) {
                    PvZ2Shell.RTONDecode(argument, argument.replace(/((\.rton))?$/i, ".json"));
                } else {
                    argument.forEach((arg: string) => PvZ2Shell.RTONDecode(arg, arg.replace(/((\.rton))?$/i, ".json")));
                }
                break;
            }
            case "popcap_json_to_rton": {
                if (!Array.isArray(argument)) {
                    PvZ2Shell.RTONEncode(argument, argument.replace(/((\.json))?$/i, ".rton"));
                } else {
                    argument.forEach((arg: string) => PvZ2Shell.RTONEncode(arg, arg.replace(/((\.json))?$/i, ".rton")));
                }
                break;
            }
            case "popcap_unofficial_resources_merge": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.MergeUnofficialJson.CreateConversion(
                        argument,
                        argument.replace(/((\.json.info))?$/i, ".json"),
                    );
                } else {
                    argument.forEach((arg: string) =>
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                            arg,
                            arg.replace(/((\.json.info))?$/i, ".json"),
                        ),
                    );
                }
                break;
            }
            case "popcap_ptx_decode": {
                if (!Array.isArray(argument)) {
                    const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                    const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<number> =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                        argument,
                        Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.png`),
                        dimension.width,
                        dimension.height,
                        encode,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<number> =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            argument,
                            Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.png`),
                            dimension.width,
                            dimension.height,
                            encode,
                        );
                    });
                }
                break;
            }
            case "popcap_official_atlas_merge": {
                if (!Array.isArray(argument)) {
                    let width: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                            /\{\}/g,
                            Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("width"),
                            ),
                        ),
                    );
                    let height: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                            /\{\}/g,
                            Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("height"),
                            ),
                        ),
                    );
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(
                        argument,
                        width,
                        height,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        let width: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                    /\{\}/g,
                                    Sen.Script.Modules.System.Default.Localization.GetString("width"),
                                ),
                            ),
                        );
                        let height: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                    /\{\}/g,
                                    Sen.Script.Modules.System.Default.Localization.GetString("height"),
                                ),
                            ),
                        );
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForOfficialSubgroupStructure(
                            arg,
                            width,
                            height,
                        );
                    });
                }
                break;
            }
            case "popcap_ptx_encode": {
                if (!Array.isArray(argument)) {
                    const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(
                        argument,
                        Path.Resolve(`${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.ptx`),
                        encode,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(
                            argument,
                            Path.Resolve(`${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.ptx`),
                            encode,
                        );
                    });
                }
                break;
            }
            case "popcap_official_resources_split": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(
                        argument,
                        argument.replace(/((\.json))?$/i, ".res"),
                    );
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(
                            arg,
                            arg.replace(/((\.json))?$/i, ".res"),
                        );
                    });
                }
                break;
            }
            case "popcap_official_resources_merge": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(
                        argument,
                        argument.replace(/((\.res))?$/i, ".json"),
                    );
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(
                            arg,
                            arg.replace(/((\.res))?$/i, ".json"),
                        );
                    });
                }
                break;
            }
            case "popcap_official_atlas_split": {
                if (Array.isArray(argument)) {
                    let method: "id" | "path" = "id";
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractOfficialAtlas.ExtractPvZ2AtlasOfficialStructure(
                        argument,
                        method,
                    );
                }
                break;
            }
            case "popcap_unofficial_atlas_split": {
                if (Array.isArray(argument)) {
                    let method: "id" | "path" = "id";
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractUnofficialPvZ2Atlas.ExtractPvZ2AtlasUnofficialStructure(
                        argument,
                        method,
                    );
                }
                break;
            }
            case "popcap_unofficial_atlas_merge": {
                if (!Array.isArray(argument)) {
                    let width: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                            /\{\}/g,
                            Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("width"),
                            ),
                        ),
                    );
                    let height: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                            /\{\}/g,
                            Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("height"),
                            ),
                        ),
                    );
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(
                        argument,
                        width,
                        height,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        let width: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                    /\{\}/g,
                                    Sen.Script.Modules.System.Default.Localization.GetString("width"),
                                ),
                            ),
                        );
                        let height: int = Sen.Script.Modules.Interface.Arguments.InputInteger(
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                                /\{\}/g,
                                Sen.Script.Modules.System.Default.Localization.GetString("input_").replace(
                                    /\{\}/g,
                                    Sen.Script.Modules.System.Default.Localization.GetString("height"),
                                ),
                            ),
                        );
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson.PackForUnofficialSubgroupStructure(
                            arg,
                            width,
                            height,
                        );
                    });
                }
                break;
            }
            case "popcap_official_pam_to_pam_json": {
                if (!Array.isArray(argument)) {
                    PvZ2Shell.PAMtoPAMJSON(argument, argument.replace(/((\.pam))?$/i, ".pam.json"));
                } else {
                    argument.forEach((arg: string) => {
                        PvZ2Shell.PAMtoPAMJSON(arg, arg.replace(/((\.pam))?$/i, ".pam.json"));
                    });
                }
                break;
            }
            case "popcap_official_pam_to_flash_animation": {
                if (!Array.isArray(argument)) {
                    let resolution: int = 1536;
                    PvZ2Shell.PAMtoFlashAnimation(argument, argument.replace(/((\.pam))?$/i, ".xfl"), resolution);
                } else {
                    argument.forEach((arg: string) => {
                        let resolution: int = 1536;
                        PvZ2Shell.PAMtoFlashAnimation(arg, arg.replace(/((\.pam))?$/i, ".xfl"), resolution);
                    });
                }
                break;
            }
            case "popcap_official_pam_json_to_pam": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                            argument,
                        ),
                    );
                    PvZ2Shell.PAMJSONtoPAM(argument, argument.replace(/((\.pam.json))?$/i, ".pam"));
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                arg,
                            ),
                        );
                        PvZ2Shell.PAMJSONtoPAM(arg, arg.replace(/((\.pam.json))?$/i, ".pam"));
                    });
                }
                break;
            }
            case "popcap_sprite_resize": {
                if (!Array.isArray(argument)) {
                    const original: int = 1536;
                    const modified: int = 768;
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                        argument,
                        original,
                        modified,
                        argument.replace(original.toString(), modified.toString()),
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const original: int = 1536;
                        const modified: int = 768;
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                            arg,
                            original,
                            modified,
                            arg.replace(original.toString(), modified.toString()),
                        );
                    });
                }
                break;
            }
            default: {
                throw new Sen.Script.Modules.Exceptions.RuntimeError(
                    Sen.Script.Modules.System.Default.Localization.GetString("function_not_found").replace(
                        /\{\}/g,
                        function_name,
                    ),
                    Sen.Script.Modules.Interface.Assert.function_json_location,
                ) as never;
            }
        }
        const func_time_end: number = Sen.Script.Modules.System.Default.Timer.CurrentTime();
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_time").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Timer.CalculateTime(func_time_start, func_time_end, 3),
            ),
        );
        return;
    }
}
