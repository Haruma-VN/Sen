namespace Sen.Script.Modules.System.Default.Timer {
    /**
     *
     * @returns Get current time
     */
    export function CurrentTime(): number {
        return Date.now();
    }

    /**
     *
     * @param begin_time - Pass begin time
     * @param end_time - Pass end time
     * @param to_fixed - Fixed number if possible
     * @returns Fixed number as string
     */

    export function CalculateTime(begin_time: number, end_time: number, to_fixed: number = 3): string {
        if (Sen.Script.Modules.System.Default.Localization.EntryJson.default.format_time) {
            return Sen.Script.Modules.System.Default.Timer.FormatTime((end_time - begin_time) / 1000, to_fixed);
        }
        return ((end_time - begin_time) / 1000).toFixed(to_fixed);
    }

    /**
     *
     * @param seconds - Pass seconds as bigint
     * @returns Formated string
     */

    export function FormatTime(seconds: number, fixed: number): string {
        let result: string = "";
        const hours: number = Math.floor(seconds / 3600);
        const minutes: number = Math.floor(Number((seconds % 3600) / 60));

        if (hours > 0) {
            result += `${hours} ${
                hours > 1 ? Sen.Script.Modules.System.Default.Localization.GetString("hours") : Sen.Script.Modules.System.Default.Localization.GetString("hour")
            } `;
        }
        if (minutes > 0) {
            result += `${minutes} ${
                minutes > 1
                    ? Sen.Script.Modules.System.Default.Localization.GetString("minutes")
                    : Sen.Script.Modules.System.Default.Localization.GetString("minute")
            } `;
        }
        if (seconds > 0 || result === "") {
            result += `${(seconds % 60).toFixed(fixed)}`;
        }
        return result;
    }
}
