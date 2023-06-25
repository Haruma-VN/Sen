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

    export interface RTONCrypt {
        encryptionKey: string;
    }

    /**
     * RTON official
     */

    export const RTONOfficial: RTONCipher = {
        key: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONCrypt>(
            `${MainScriptDirectory}/modules/customization/methods/popcap_rton_cipher.json`
        ).encryptionKey,
        crypt: false,
    };

    /**
     * RTON 2C
     */
    export const RTONEncrypt: RTONCipher = {
        ...Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial,
        crypt: true,
    };
}
