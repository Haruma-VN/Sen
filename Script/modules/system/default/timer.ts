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
        return ((end_time - begin_time) / 1000).toFixed(to_fixed);
    }
}
