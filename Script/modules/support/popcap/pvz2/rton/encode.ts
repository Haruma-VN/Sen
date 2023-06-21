namespace Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode {
    /**
     * Exception from the Shell
     */
    export enum RTONListException {
        Magic,
        Version,
        Ends,
    }

    /**
     * RTON Head
     */

    export interface RTONHead {
        magic: string;
        end: string;
        version: int;
    }
}
