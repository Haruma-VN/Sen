namespace Sen.Script.Modules.Support.WWise.Soundbank.Encode {
    /**
     * Structure
     */

    export interface WWiseInfoSimple {
        bank_header: BKHD;
        initialization?: INIT[];
        game_synchronization?: STMG;
        embedded_media?: number[];
        hierarchy?: HIRC[];
        environments?: ENVS;
        reference?: STID;
        platform_setting?: PLAT;
    }

    /**
     * Structure
     */

    export interface BKHD {
        version: number;
        id: number;
        head_expand: string;
    }

    /**
     * Structure
     */

    export interface INIT {
        id: number;
        name: string;
    }

    /**
     * Structure
     */

    export interface STMG {
        volume_threshold: string;
        max_voice_instances: string;
        unknown_type_1: number;
        stage_group: STMGStageGroup[];
        switch_group: STMGSwitchGroup[];
        game_parameter: STMGGameParameter[];
        unknown_type_2: number;
    }

    /**
     * Structure
     */

    export interface STMGStageGroup {
        id: number;
        data: STMGStageGroupData;
    }

    /**
     * Structure
     */

    export interface STMGStageGroupData {
        default_transition_time: string;
        custom_transition: Array<string>;
    }

    /**
     * Structure
     */

    export interface STMGSwitchGroup {
        id: number;
        data: STMGSwitchGroupData;
    }

    /**
     * Structure
     */

    export interface STMGSwitchGroupData {
        parameter: number;
        parameter_category: number;
        point: Array<string>;
    }

    export interface STMGGameParameter {
        id: number;
        data: string;
    }

    /**
     * Structure
     */

    export interface HIRC {
        id: number;
        type: number;
        data: string;
    }

    /**
     * Structure
     */

    export interface ENVS {
        obstruction: ENVSItem;
        occlusion: ENVSItem;
    }

    /**
     * Structure
     */

    export interface ENVSItem {
        volume: ENVSVolume;
        low_pass_filter: ENVSLowPassFilter;
        high_pass_filter?: ENVSHighPassFilter;
    }

    export interface ENVSVolume {
        volume_value: string;
        volume_point: Array<string>;
    }

    /**
     * Structure
     */

    export interface ENVSLowPassFilter {
        low_pass_filter_vaule: string;
        low_pass_filter_point: Array<string>;
    }

    /**
     * Structure
     */

    export interface ENVSHighPassFilter {
        high_pass_filter_vaule: string;
        high_pass_filter_point: Array<string>;
    }

    /**
     * Structure
     */

    export interface STID {
        data: STIDData[];
        unknown_type: number;
    }

    /**
     * Structure
     */

    export interface STIDData {
        id: number;
        name: string;
    }

    /**
     * Structure
     */

    export interface PLAT {
        platform: string;
    }

    /**
     * Structure
     */

    export interface WEMDATATemp {
        offset: number;
        length: number;
    }

    /**
     *
     * @param inFile - Pass file in
     * @param outDirectory - Pass dir out
     * @returns Decoded BNK
     */

    export function WWiseSoundbankDecodeBySimple(inFile: string, outDirectory: string): void {
        try {
            const information: Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple = Sen.Shell.LotusModule.WWiseSoundBankDecode(inFile, outDirectory);
            Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${outDirectory}`, `definition.json`)), information, false);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }

    /**
     *
     * @param inDirectory - Pass dir in
     * @param outFile - Pass file out
     * @returns Encoded BNK
     */

    export function WWiseSoundbankEncodeBySimple(inDirectory: string, outFile: string): void {
        const information: Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${inDirectory}`, `definition.json`))
        );
        try {
            Sen.Shell.LotusModule.WWiseSoundBankEncode(inDirectory, outFile, information);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inDirectory);
        }
        return;
    }
}
