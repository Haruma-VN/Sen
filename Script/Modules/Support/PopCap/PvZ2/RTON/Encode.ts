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
        key: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONCrypt>(`${Sen.Shell.MainScriptDirectory}/modules/customization/methods/popcap_rton_cipher.json`).encryptionKey,
        crypt: false,
    };

    /**
     * RTON 2C
     */
    export const RTONEncrypt: RTONCipher = {
        ...Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONOfficial,
        crypt: true,
    };

    /**
     *
     * @param inFile - Pass file path
     * @param outFile - Pass out file
     * @param decryptRTON - Pass decrypt option
     * @returns Decode RTON
     */

    export function RTONDecode(inFile: string, outFile: string, decryptRTON: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONDecode(inFile, outFile, decryptRTON);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }

    /**
     *
     * @param inFile - Pass file path
     * @param outFile - Pass out file
     * @param decryptRTON - Pass decrypt option
     * @returns Decode RTON
     */
    export function RTONDecrypt(inFile: string, outFile: string, decryptRTON: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONDecrypt(inFile, outFile, decryptRTON);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.EvaluateError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }
}
