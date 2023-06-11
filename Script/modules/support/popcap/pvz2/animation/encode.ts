namespace Sen.Script.Modules.Support.PopCap.PvZ2.Animation {
    /**
     * @param SexyAppFrameworkAnimationVersion - All version for PoPCap Animation
     */

    export type SexyAppFrameworkAnimationVersion = 1 | 2 | 3 | 4 | 5 | 6;

    /**
     * @param SexyAppFrameworkAnimationPamJson - PopCap PAM JSON based on TwinStar ToolKit project
     */
    // https://github.com/twinkles-twinstar/TwinStar.ToolKit

    export type SexyAppFrameworkAnimationPamJson = {
        version: SexyAppFrameworkAnimationVersion;
        frame_rate: int;
        position: [double, double];
        size: [double, double];
        image: Array<SexyAppFrameworkImageInfo>;
        sprite: Array<SexyAppFrameworkSpriteInfo>;
        main_sprite: SexyAppFrameworkSpriteInfo;
    };

    /**
     * @param SexyAppFrameworkImageInfo - PAM Json image object
     */

    export type SexyAppFrameworkImageInfo = {
        name: string | null;
        size: [int, int];
        transform: [double, double, double, double, double, double] | null;
    };

    /**
     * @param SexyAppFrameworkSpriteInfo - PAM Json sprite object
     */

    export type SexyAppFrameworkSpriteInfo = {
        name?: string;
        description?: string;
        frame_rate: double;
        work_area?: [int, int];
        frame?: Array<SexyAppFrameworkFrameInfo>;
    };

    /**
     * @param SexyAppFrameworkFrameInfo - PAM Json frame object
     */

    export type SexyAppFrameworkFrameInfo = {
        label?: string;
        stop: boolean;
        command?: CommandsInfo[];
        remove?: RemovesInfo[];
        append?: AddsInfo[];
        change?: MovesInfo[];
    };

    export type CommandsInfo = {
        command: string[];
    };

    export type RemovesInfo = {
        index: number;
    };

    export type AddsInfo = {
        index: number;
        name?: string;
        resource: number;
        sprite: boolean;
        additive: boolean;
        preload_frame: number;
        time_scale: number;
    };

    export type MovesInfo = {
        index: number;
        transform: [int, int];
        color?: number[];
        source_rectangle?: number[];
        sprite_frame_number: number;
    };

    /**
     * @param FrameFlags - Frame flags
     */

    export enum FrameFlags {
        Removes = 1,
        Adds = 2,
        Moves = 4,
        FrameName = 8,
        Stop = 16,
        Commands = 32,
    }

    /**
     *
     * @param pam_json - Send json obj here
     * @param file_path - File path for exception, undefined if nothing found
     * @returns if the obj is pam json
     */

    export function CheckPamJson(
        pam_json: SexyAppFrameworkAnimationPamJson,
        file_path?: string,
    ): pam_json is SexyAppFrameworkAnimationPamJson {
        if (!("version" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `version`,
                ),
                `version`,
                (file_path ??= "undefined"),
            );
        }
        if (!Number.isInteger(pam_json.version)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `version`,
                        `${pam_json.version}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        `${typeof pam_json.version}`,
                    ],
                ),
                `version`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
            );
        }
        if (
            pam_json.version !== 1 &&
            pam_json.version !== 2 &&
            pam_json.version !== 3 &&
            pam_json.version !== 4 &&
            pam_json.version !== 5 &&
            pam_json.version !== 6
        ) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [`version`, `${pam_json.version}`, `1, 2, 3, 4, 5, 6`, `${pam_json.version}`],
                ),
                `version`,
                (file_path ??= "undefined"),
                `1, 2, 3, 4, 5, 6`,
            );
        }
        if (!("frame_rate" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `frame_rate`,
                ),
                `frame_rate`,
                (file_path ??= "undefined"),
            );
        }
        if (!Number.isInteger(pam_json.frame_rate)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `frame_rate`,
                        `${pam_json.frame_rate}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                        `${typeof pam_json.frame_rate}`,
                    ],
                ),
                `frame_rate`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
            );
        }
        if (!("position" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `position`,
                ),
                `position`,
                (file_path ??= "undefined"),
            );
        }
        if (!Array.isArray(pam_json.position)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `position`,
                        `${pam_json.position}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof pam_json.position}`,
                    ],
                ),
                `position`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
            );
        }
        if (pam_json.position.length !== 2) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                    [`position`, `2`],
                ),
                `position`,
                (file_path ??= "undefined"),
                `this.position.size() == 2`,
            );
        }
        if (!("size" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `size`,
                ),
                `size`,
                (file_path ??= "undefined"),
            );
        }
        if (!Array.isArray(pam_json.size)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `size`,
                        `${pam_json.size}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof pam_json.size}`,
                    ],
                ),
                `size`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
            );
        }
        if (pam_json.size.length !== 2) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                    [`size`, `2`],
                ),
                `size`,
                (file_path ??= "undefined"),
                `this.size.size() == 2`,
            );
        }
        if (!("image" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `image`,
                ),
                `image`,
                (file_path ??= "undefined"),
            );
        }
        if (!Array.isArray(pam_json.image)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `image`,
                        `${pam_json.image}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof pam_json.image}`,
                    ],
                ),
                `image`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
            );
        }
        // check image
        for (let image of pam_json.image) {
            if (!("size" in image)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `size`,
                    ),
                    `size`,
                    (file_path ??= "undefined"),
                );
            }
            if (!Array.isArray(image.size)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `size`,
                            `${image.size}`,
                            `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                            `${typeof image.size}`,
                        ],
                    ),
                    `size`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                );
            }
            if (image.size.length !== 2) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                        [`size`, `2`],
                    ),
                    `size`,
                    (file_path ??= "undefined"),
                    `this.size.size() == 2`,
                );
            }
        }
        if (!("sprite" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `sprite`,
                ),
                `sprite`,
                (file_path ??= "undefined"),
            );
        }
        if (!Array.isArray(pam_json.sprite)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                    [
                        `sprite`,
                        `${pam_json.sprite}`,
                        `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                        `${typeof pam_json.sprite}`,
                    ],
                ),
                `sprite`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
            );
        }
        if (!("main_sprite" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                    /\{\}/g,
                    `main_sprite`,
                ),
                `main_sprite`,
                (file_path ??= "undefined"),
            );
        }
        return true;
    }
}
