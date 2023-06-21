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
        work_area: [int, int];
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

    export interface ExtraInfo {
        version: number;
        frame_rate: number;
        position: number[];
        image?: ExtraImageInfo[];
        sprite?: ExtraSpriteInfo[];
        main_sprite?: ExtraSpriteInfo;
    }

    export interface ExtraImageInfo {
        name?: string;
        size: number[];
    }

    export interface ExtraSpriteInfo {
        name?: string;
    }

    /**
     *
     * @param pam_json - Send json obj here
     * @param file_path - File path for exception, undefined if nothing found
     * @returns if the obj is pam json
     */

    export function CheckPamJson(pam_json: SexyAppFrameworkAnimationPamJson, file_path?: string): pam_json is SexyAppFrameworkAnimationPamJson {
        if (!("version" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `version`),
                `version`,
                (file_path ??= "undefined")
            );
        }
        if (!Number.isInteger(pam_json.version)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `version`,
                    `${pam_json.version}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                    `${typeof pam_json.version}`,
                ]),
                `version`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
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
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `version`,
                    `${pam_json.version}`,
                    `1, 2, 3, 4, 5, 6`,
                    `${pam_json.version}`,
                ]),
                `version`,
                (file_path ??= "undefined"),
                `1, 2, 3, 4, 5, 6`
            );
        }
        if (!("frame_rate" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `frame_rate`),
                `frame_rate`,
                (file_path ??= "undefined")
            );
        }
        if (!Number.isInteger(pam_json.frame_rate)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `frame_rate`,
                    `${pam_json.frame_rate}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`,
                    `${typeof pam_json.frame_rate}`,
                ]),
                `frame_rate`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("integer")}`
            );
        }
        if (!("position" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `position`),
                `position`,
                (file_path ??= "undefined")
            );
        }
        if (!Array.isArray(pam_json.position)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `position`,
                    `${pam_json.position}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                    `${typeof pam_json.position}`,
                ]),
                `position`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
            );
        }
        if (pam_json.position.length !== 2) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                    [`position`, `2`]
                ),
                `position`,
                (file_path ??= "undefined"),
                `this.position.size() == 2`
            );
        }
        if (!("size" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `size`),
                `size`,
                (file_path ??= "undefined")
            );
        }
        if (!Array.isArray(pam_json.size)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `size`,
                    `${pam_json.size}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                    `${typeof pam_json.size}`,
                ]),
                `size`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
            );
        }
        if (pam_json.size.length !== 2) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(
                    Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                    [`size`, `2`]
                ),
                `size`,
                (file_path ??= "undefined"),
                `this.size.size() == 2`
            );
        }
        if (!("image" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `image`),
                `image`,
                (file_path ??= "undefined")
            );
        }
        if (!Array.isArray(pam_json.image)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `image`,
                    `${pam_json.image}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                    `${typeof pam_json.image}`,
                ]),
                `image`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
            );
        }
        // check image
        for (let image of pam_json.image) {
            if (!("size" in image)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `size`),
                    `size`,
                    (file_path ??= "undefined")
                );
            }
            if (!Array.isArray(image.size)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [`size`, `${image.size}`, `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`, `${typeof image.size}`]
                    ),
                    `size`,
                    (file_path ??= "undefined"),
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
                );
            }
            if (image.size.length !== 2) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("size_of_array_does_not_match"),
                        [`size`, `2`]
                    ),
                    `size`,
                    (file_path ??= "undefined"),
                    `this.size.size() == 2`
                );
            }
        }
        if (!("sprite" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `sprite`),
                `sprite`,
                (file_path ??= "undefined")
            );
        }
        if (!Array.isArray(pam_json.sprite)) {
            throw new Sen.Script.Modules.Exceptions.WrongDataType(
                Sen.Script.Modules.System.Default.Localization.RegexReplace(Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"), [
                    `sprite`,
                    `${pam_json.sprite}`,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`,
                    `${typeof pam_json.sprite}`,
                ]),
                `sprite`,
                (file_path ??= "undefined"),
                `${Sen.Script.Modules.System.Default.Localization.GetString("array")}`
            );
        }
        if (!("main_sprite" in pam_json)) {
            throw new Sen.Script.Modules.Exceptions.MissingProperty(
                Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(/\{\}/g, `main_sprite`),
                `main_sprite`,
                (file_path ??= "undefined")
            );
        }
        return true;
    }

    /**
     *
     * @param inFile - Pass PAM
     * @param outFile - Pass output pam json
     * @returns PAM to PAM JSON
     */

    export function PopCapAnimationToAnimationJson(inFile: string, outFile: string): void {
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson = PvZ2Shell.PAMtoPAMJSON(inFile);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(outFile, pam_json);
        return;
    }

    /**
     *
     * @param inFile - Pass PAM JSON
     * @param outFile - Pass PAM Output
     * @returns PAM JSON to PAM
     */

    export function PopCapAnimationJsonToAnimation(inFile: string, outFile: string): void {
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(inFile);
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(pam_json);
        PvZ2Shell.PAMJSONtoPAM(inFile, outFile);
        return;
    }

    /**
     *
     * @param inFile - Pass PAM JSON
     * @param outputDirectory - Pass output directory
     * @param resolution - Pass resolution
     * @returns PAM JSON to XFL
     */

    // PAMJSONtoFlashAnimation
    export function PopCapAnimationJsonToAnimateAdobeFlashAnimation(inFile: string, outputDirectory: string, resolution: int): void {
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(inFile);
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(pam_json);
        const extra_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo = PvZ2Shell.PAMJSONtoFlashAnimation(inFile, outputDirectory, resolution);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
            Path.Resolve(`${outputDirectory}/extra.json`),
            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonConvert(extra_json)
        );
        return;
    }

    /**
     *
     * @param inDirectory - Pass directory
     * @param outFile - Pass output pam json
     * @returns XFL to PAM JSON
     */

    // FlashAnimationtoPAMJSON
    export function AnimateAdobeFlashAnimationToPopCapAnimationJson(inDirectory: string, outFile: string): void {
        const extra_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo = Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonConvertBack(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
                Path.Resolve(`${inDirectory}/extra.json`)
            )
        );
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson = PvZ2Shell.FlashAnimationtoPAMJSON(
            inDirectory,
            extra_json
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(outFile, pam_json);
        return;
    }

    /**
     *
     * @param inFile - Pass PAM
     * @param outputDirectory - Pass output directory
     * @param resolution - Pass resolution
     * @returns PAM to XFL
     */

    export function PopCapAnimationToAnimateAdobeFlashAnimation(inFile: string, outputDirectory: string, resolution: int): void {
        const extra_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo = PvZ2Shell.PAMtoFlashAnimation(inFile, outputDirectory, resolution);
        const extra = Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonConvert(extra_json);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
            Path.Resolve(`${outputDirectory}/extra.json`),
            extra
        );
        return;
    }

    /**
     * Send from Shell
     */

    export interface PAMHeader {
        magic: int;
        version: int;
        frame_rate: int;
    }

    export interface ExtraJsonForUser {
        version: number;
        frame_rate: number;
        position: [int, int];
        image: {
            [image_string: string]: {
                name: string;
                width: int;
                height: int;
            };
        };
        sprite: {
            [sprite_string: string]: string;
        };
        main_sprite: {
            main_sprite: "";
        };
    }

    /**
     *
     * @param information - Pass information
     * @returns Convert Extra Json
     */

    export function ExtraJsonConvert(
        information: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo
    ): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser {
        const extra: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser = {
            version: information.version,
            frame_rate: information.frame_rate,
            position: [information.position[0], information.position[1]],
            image: {},
            sprite: {},
            main_sprite: {
                main_sprite: "",
            },
        };
        if ("image" in information) {
            for (let i: number = 0; i < (information.image as ExtraImageInfo[]).length; ++i) {
                extra.image[`image_${i + 1}`] = {
                    name: (information.image as ExtraImageInfo[])[i].name as string,
                    width: (information.image as ExtraImageInfo[])[i].size[0] as int,
                    height: (information.image as ExtraImageInfo[])[i].size[1] as int,
                };
            }
        }
        if ("sprite" in information) {
            for (let i: number = 0; i < (information.sprite as ExtraSpriteInfo[]).length; ++i) {
                extra.sprite[`sprite_${i + 1}`] = ((information.sprite as ExtraSpriteInfo[])[i] as ExtraSpriteInfo).name as string;
            }
        }
        return extra;
    }

    /**
     *
     * @param information - Pass information of extra json
     * @returns Extra json readed by shell
     */

    export function ExtraJsonConvertBack(
        information: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser
    ): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo {
        const extra: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo = {
            version: information.version,
            frame_rate: information.frame_rate,
            position: information.position,
            image: [],
            sprite: [],
            main_sprite: {
                name: "",
            },
        };
        const images: Array<string> = Object.keys(information.image);
        for (let i: int = 0; i < images.length; ++i) {
            (extra.image as Array<ExtraImageInfo>).push({
                name: information.image[images[i]].name,
                size: [information.image[images[i]].width, information.image[images[i]].height],
            });
        }
        const sprites: Array<string> = Object.keys(information.sprite);
        for (let i: int = 0; i < sprites.length; ++i) {
            (extra.sprite as Array<ExtraSpriteInfo>).push({
                name: sprites[i],
            });
        }
        return extra;
    }
}
