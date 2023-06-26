namespace Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input {
    // Boolean type

    export type BooleanInput = 0 | 1;

    // Method json type

    export type MethodJson = {
        [x: string]: boolean | int | "?";
    };

    /**
     * Implement argument class
     */

    export class InputArgument {
        /**
         *
         * @param argument_message - Pass message here
         * @param json_method_path - Pass json path
         * @param property - Pass json property
         * @returns Boolean input
         */
        public static InputBoolean<Generic_T extends MethodJson>(argument_message: string, json_method_path?: string, property?: string): BooleanInput {
            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, argument_message));
            if (json_method_path) {
                const deserialize_json: Generic_T = Sen.Script.Modules.FileSystem.Json.ReadJson<Generic_T>(json_method_path);
                if (!property) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `${property}`), `${property}`, (json_method_path ??= "undefined"));
                }
                switch (deserialize_json[property]) {
                    case "?": {
                        return Sen.Script.Modules.Interface.Arguments.BooleanArgument();
                    }
                    case true: {
                        Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("True")}`);
                        return 1;
                    }
                    case false: {
                        Console.Printf(null, `      ${Sen.Script.Modules.System.Default.Localization.GetString("False")}`);
                        return 0;
                    }
                    default: {
                        throw new Sen.Script.Modules.Exceptions.RuntimeError(
                            Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("argument_not_found"), [`${deserialize_json[property]}`, `true, false`, `?`]),
                            Sen.Script.Modules.Interface.Assert.function_json_location
                        ) as never;
                    }
                }
            }
            return Sen.Script.Modules.Interface.Arguments.BooleanArgument();
        }

        /**
         *
         * @param argument_message - Pass message
         * @param must_match - Pass matching array
         * @param json_method_path - Pass json path
         * @param additional_options - Pass array of options, to print
         * @param property - Pass property
         * @returns
         */

        public static InputInteger<Generic_T extends MethodJson>(argument_message: string, must_match: Array<int> | null, additional_options: Record<string, [notify: string, success: string]>, json_method_path?: string, property?: string): int {
            Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, argument_message));
            const options: Array<string> = Object.keys(additional_options);
            if (options.length !== 0) {
                options.forEach((option: string) => {
                    Console.Printf(null, `      ${option}. ${additional_options[option][0]}`);
                });
            }
            if (json_method_path) {
                const deserialize_json: Generic_T = Sen.Script.Modules.FileSystem.Json.ReadJson<Generic_T>(json_method_path);
                if (!property) {
                    throw new Sen.Script.Modules.Exceptions.MissingProperty(Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `${property}`), `${property}`, (json_method_path ??= "undefined"));
                }
                if (typeof deserialize_json[property] === "number" && Number.isInteger(deserialize_json[property])) {
                    if (options.length !== 0) {
                        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument_set_as_default").replace(/\{\}/g, `${additional_options[deserialize_json[property].toString()][1]}`)}`);
                    } else {
                        Console.Printf(null, `      ${deserialize_json[property]}`);
                    }
                    return deserialize_json[property] as int;
                }
            }
            let input: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            while (!must_match) {
                if (/^\d+$/.test(input)) {
                    return parseInt(input);
                }
                Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, input))}`
                );
                input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
            }
            let assert_test: int | null = Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, must_match as Array<int>);
            while (assert_test === null) {
                Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, input))}`
                );
                input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                assert_test = Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(input, must_match as Array<int>);
            }
            return assert_test;
        }
    }

    /**
     * Requirement
     */

    export interface AtlasMergeInputRequirement extends Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> {
        smart: boolean;
        pot: boolean;
        square: boolean;
        allowRotation: boolean;
        padding: int;
    }

    /**
     *
     * @returns Input atlas merge
     */

    export function InputAtlasMerge(): Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement {
        const destination: Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.AtlasMergeInputRequirement = {
            width: 0,
            height: 0,
            smart: true,
            pot: false,
            square: true,
            allowRotation: false,
            padding: 1,
        };
        const width: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("input_width"), null, {}, `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`, `width`);
        const height: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("input_height"), null, {}, `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`, `height`);
        destination.width = width;
        destination.height = height;
        const smart: boolean =
            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                Sen.Script.Modules.System.Default.Localization.GetString("using_").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("smart")),
                `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`,
                `smart`
            ) === 1
                ? true
                : false;
        const pot: boolean =
            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                Sen.Script.Modules.System.Default.Localization.GetString("using_").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("pot")),
                `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`,
                `pot`
            ) === 1
                ? true
                : false;
        const square: boolean =
            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                Sen.Script.Modules.System.Default.Localization.GetString("using_").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("square")),
                `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`,
                `square`
            ) === 1
                ? true
                : false;
        const allowRotation: boolean =
            Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(
                Sen.Script.Modules.System.Default.Localization.GetString("using_").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("allowRotation")),
                `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`,
                `allowRotation`
            ) === 1
                ? true
                : false;
        const padding: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("set_packable_padding"), null, {}, `${MainScriptDirectory}/modules/customization/methods/popcap_atlas_merge.json`, `padding`);
        destination.smart = smart;
        destination.pot = pot;
        destination.square = square;
        destination.allowRotation = allowRotation;
        destination.padding = padding;
        return destination;
    }

    /**
     * Texture resolution
     */

    export enum TextureResolution {
        PopCap1536 = 1,
        PopCap768,
        PopCap384,
        PopCap640,
        PopCap1200,
    }

    /**
     *
     * @param addon_message - Pass msg
     * @param json_method_path - Pass json path
     * @param property - Pass property
     * @returns 1536, 768, 384, 640, 1200
     */

    export function InputTextureResolution(addon_message: string, json_method_path?: string, property?: string): 1536 | 768 | 384 | 640 | 1200 {
        const input: TextureResolution = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            `${addon_message}`,
            [1, 2, 3, 4, 5],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_1536"), `1536`],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_768"), "768"],
                "3": [Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_384"), "384"],
                "4": [Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_640"), "640"],
                "5": [Sen.Script.Modules.System.Default.Localization.GetString("popcap_res_1200"), "1200"],
            },
            json_method_path,
            property
        ) as 1 | 2 | 3 | 4 | 5;
        switch (input) {
            case TextureResolution.PopCap1536: {
                return 1536;
            }
            case TextureResolution.PopCap1200: {
                return 1200;
            }
            case TextureResolution.PopCap384: {
                return 384;
            }
            case TextureResolution.PopCap640: {
                return 640;
            }
            case TextureResolution.PopCap768: {
                return 768;
            }
        }
    }

    export function InputArchitecture(addon_message: string, json_method_path?: string, property?: string): "android" | "ios" | "android_cn" {
        const input: TextureResolution = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            `${addon_message}`,
            [1, 2, 3],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("android"), `android`],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("ios"), "ios"],
                "3": [Sen.Script.Modules.System.Default.Localization.GetString("android_cn"), "android_cn"],
            },
            json_method_path,
            property
        ) as 1 | 2 | 3 | 4 | 5;
        switch (input) {
            case 1: {
                return "android";
            }
            case 2: {
                return "ios";
            }
            case 3: {
                return "android_cn";
            }
            default: {
                throw new Error("Not found");
            }
        }
    }
}
