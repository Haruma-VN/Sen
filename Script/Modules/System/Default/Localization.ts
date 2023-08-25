namespace Sen.Script.Modules.System.Default.Localization {
    /**
     *
     * @param path - Current launch
     * @param command_path - Command.json path
     * @returns
     */

    export function QueryPath(path: string, command_path: string): string {
        if (path.startsWith("~")) {
            return Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(Sen.Shell.MainScriptDirectory, ...path.split("/").filter((e, i) => i !== 0)));
        } else if (path.startsWith(".")) {
            return Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(command_path, ...path.split("/").filter((e, i) => i !== 0)));
        }
        return path;
    }
    /**
     * Entry json
     */
    export type entry_json = {
        default: {
            language: string;
            notification_when_finish: boolean;
            override: boolean;
            use_trailing_commas: boolean;
            debugger: boolean;
            execute_again_after_error: boolean;
            format_time: boolean;
            execute_function_if_exists_one: boolean;
        };
        additional: {
            packed_codebooks_aoTuV_603: string;
        };
    };

    export const EntryJson: Sen.Script.Modules.System.Default.Localization.entry_json = Sen.Script.Modules.FileSystem.Json.ReadJson<entry_json>(
        Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `entry.json`))
    );

    /**
     * Structure
     */

    export interface TimeSchedule {
        startTime: bigint;
        endTime: bigint;
    }

    /**
     *
     * @param view - Import View
     * @returns
     */

    export function ViewDate(view: TimeSchedule): void {
        const currentUnixTime = BigInt(Math.floor(Date.now() / 1000));
        if (currentUnixTime >= view.startTime && currentUnixTime <= view.endTime) {
            Sen.Shell.Console.Print(null, `4`);
        }
        return;
    }

    /**
     *
     * @param targetUnixTimestamp - target time
     * @returns Day left
     */

    export function TimeLeft(targetUnixTimestamp: number): number {
        const currentUnixTimestamp = Math.floor(Date.now() / 1000);
        const timeDifferenceInSeconds = targetUnixTimestamp - currentUnixTimestamp;
        const days = Math.floor(timeDifferenceInSeconds / (60 * 60 * 24));
        return days;
    }

    export function CountDown(range: number): void {
        const time_left = Sen.Script.Modules.System.Default.Localization.TimeLeft(1694278800);
        if (time_left <= range) {
            const data = new Shell.SenBuffer([
                0x7bn,
                0x7dn,
                0x20n,
                0x64n,
                0x61n,
                0x79n,
                0x20n,
                0x6cn,
                0x65n,
                0x66n,
                0x74n,
                0x20n,
                0x74n,
                0x6fn,
                0x20n,
                0x48n,
                0x61n,
                0x72n,
                0x75n,
                0x6dn,
                0x61n,
                0x27n,
                0x73n,
                0x20n,
                0x62n,
                0x69n,
                0x72n,
                0x74n,
                0x68n,
                0x64n,
                0x61n,
                0x79n,
            ]);
            Sen.Shell.Console.Print(null, data.readString(data.size()).replace(/\{\}/g, `${time_left}`));
        }
        return;
    }

    /**
     * Destination
     */

    export const packed_codebooks_aoTuV_603: string = QueryPath(EntryJson.additional.packed_codebooks_aoTuV_603, EntryJson.additional.packed_codebooks_aoTuV_603);

    /**
     * Tool language
     */

    export const notification: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.notification_when_finish;

    /**
     * Tool language
     */

    export const language: string = Sen.Script.Modules.System.Default.Localization.EntryJson.default.language;

    /**
     * Override file/directory
     */

    export const override: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.override;

    /**
     * If enabled, json output will be trailing commas
     */

    export const use_trailing_commas: boolean = Sen.Script.Modules.System.Default.Localization.EntryJson.default.use_trailing_commas;
    /**
     *
     * @param property - Provide property to get
     * @returns String if exists, else return property
     */

    export function GetString(property: string): string {
        return Sen.Shell.DotNetLocalization.Get(
            property,
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Language`)),
            `${Sen.Script.Modules.System.Default.Localization.language}`
        );
    }

    /**
     *
     * @param inputString - Pass the string like Test {1} {2} {3}
     * @param replacements - Pass array ["test", "test", "t"]
     * @returns Test test test t
     */

    export function RegexReplace(inputString: string, replacements: Array<string>): string {
        return inputString.replace(/\{(\d+)\}/g, (match: string, index: string) => {
            let replacementIndex: number = parseInt(index) - 1;
            return replacements[replacementIndex] || match;
        });
    }
}
