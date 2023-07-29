namespace Sen.Script.Modules.Numeric {
    /**
     *
     * @param num - Pass number
     * @returns True/false
     */

    export function IsUnsignedIntegerNumber(num: bigint): boolean {
        if (num < 0n) {
            return false;
        }
        if (num > 4_294_967_295n) {
            return false;
        }
        return true;
    }

    /**
     *
     * @param num - Pass int
     * @returns True/false
     */

    export function IsLongNumber(num: bigint): boolean {
        if (num < -9_223_372_036_854_775_808n || num > 9_223_372_036_854_775_807n) {
            return false;
        }
        return true;
    }

    /**
     *
     * @param num - Pass int
     * @returns True/false
     */

    export function IsUnsignedLongNumber(num: bigint): boolean {
        if (num < 0n) {
            return false;
        }
        if (num > 18_446_744_073_709_551_615n) {
            return false;
        }
        return true;
    }
}
