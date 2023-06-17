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
        | "popcap_official_pam_from_flash_animation"
        | "popcap_official_resources_to_unofficial_resources"
        | "popcap_unofficial_resources_to_official_resources"
        | "popcap_rsg_unpack"
        | "popcap_rsg_pack"
        | "popcap_official_pam_json_to_flash_animation"
        | "popcap_official_pam_json_from_flash_animation"
        | "popcap_rsb_unpack"
        | "popcap_rsb_pack";

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
            case "popcap_official_resources_to_unofficial_resources": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/res.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/res.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.UnofficialResourceConversion.CreateConversion(
                            arg,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_rsg_unpack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.packet`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSGUnpack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.packet`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSGUnpack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsg_pack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.rsg`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSGPack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.rsg`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSGPack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsb_unpack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name}.bundle`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSBUnpack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name}.bundle`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSBUnpack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rsb_pack": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RSBPack(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RSBPack(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_to_official_resources": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(`${Path.Dirname(argument)}/resources.json`);
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(`${Path.Dirname(arg)}/resources.json`);
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ConvertToOfficial.CreateConversion(
                            arg,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_split": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json.info`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json.info`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                            arg,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_official_pam_from_flash_animation": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.FlashAnimationtoPAM(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.FlashAnimationtoPAM(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_rton_to_json": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RTONDecode(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RTONDecode(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_json_to_rton": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.rton`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.RTONEncode(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.rton`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.RTONEncode(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_unofficial_resources_merge": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.MergeUnofficialJson.CreateConversion(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
                            arg,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_ptx_decode": {
                if (!Array.isArray(argument)) {
                    const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                    const dimension: Sen.Script.Modules.BitMap.Constraints.DimensionInterface<number> =
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputDimension();
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.png`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                        argument,
                        output_argument,
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
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.png`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.DecodePopCapPTX(
                            argument,
                            output_argument,
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
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.ptx`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(
                        argument,
                        output_argument,
                        encode,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial =
                            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.InputEncode();
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.ptx`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(
                            argument,
                            output_argument,
                            encode,
                        );
                    });
                }
                break;
            }
            case "popcap_official_resources_split": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.res`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.res`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.SplitPopCapResources(
                            arg,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_official_resources_merge": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.json`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(
                        argument,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.json`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResources.MergePopCapResources(
                            arg,
                            output_argument,
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
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam.json`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.PAMtoPAMJSON(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam.json`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.PAMtoPAMJSON(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_pam_to_flash_animation": {
                if (!Array.isArray(argument)) {
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.xfl`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    let resolution: int = 1536;
                    PvZ2Shell.PAMtoFlashAnimation(argument, output_argument, resolution);
                } else {
                    argument.forEach((arg: string) => {
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.xfl`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        let resolution: int = 1536;
                        PvZ2Shell.PAMtoFlashAnimation(arg, output_argument, resolution);
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
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.PAMJSONtoPAM(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                arg,
                            ),
                        );
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.PAMJSONtoPAM(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_sprite_resize": {
                if (!Array.isArray(argument)) {
                    const original: int = 1536;
                    const modified: int = 768;
                    const output_argument: string = Path.Resolve(
                        argument.replace(original.toString(), modified.toString()),
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                        argument,
                        original,
                        modified,
                        output_argument,
                    );
                } else {
                    argument.forEach((arg: string) => {
                        const original: int = 1536;
                        const modified: int = 768;
                        const output_argument: string = Path.Resolve(
                            arg.replace(original.toString(), modified.toString()),
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizePopCapSprite.DoAllResizeBasedOnAtlasJson(
                            arg,
                            original,
                            modified,
                            output_argument,
                        );
                    });
                }
                break;
            }
            case "popcap_official_pam_json_from_flash_animation": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                            argument,
                        ),
                    );
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.pam.json`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    PvZ2Shell.FlashAnimationtoPAMJSON(argument, output_argument);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                arg,
                            ),
                        );
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.pam`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        PvZ2Shell.FlashAnimationtoPAMJSON(arg, output_argument);
                    });
                }
                break;
            }
            case "popcap_official_pam_json_to_flash_animation": {
                if (!Array.isArray(argument)) {
                    Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                        Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                            argument,
                        ),
                    );
                    const output_argument: string = Path.Resolve(
                        `${Path.Dirname(argument)}/${Path.Parse(argument).name_without_extension}.xfl`,
                    );
                    Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                    let resolution: int = 1536;
                    PvZ2Shell.PAMJSONtoFlashAnimation(argument, output_argument, resolution);
                } else {
                    argument.forEach((arg: string) => {
                        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(
                            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(
                                arg,
                            ),
                        );
                        const output_argument: string = Path.Resolve(
                            `${Path.Dirname(arg)}/${Path.Parse(arg).name_without_extension}.xfl`,
                        );
                        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_argument);
                        let resolution: int = 1536;
                        PvZ2Shell.PAMJSONtoFlashAnimation(arg, output_argument, resolution);
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
