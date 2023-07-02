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
        key: Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONCrypt>(`${Sen.Shell.MainScriptDirectory}/Modules/Customization/methods/popcap_rton_cipher.json`).encryptionKey,
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

    export function PopCapRTONDecode(inFile: string, outFile: string, decryptRTON: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONDecode(inFile, outFile, decryptRTON);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RTONDecodeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }
    /**
     *
     * @param inFile - Pass file path
     * @param outFile - Pass out file
     * @param encryptOption - Pass encrypt option
     * @returns Encode RTON
     */

    export function PopCapRTONEncode(inFile: string, outFile: string, encryptOption: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONEncode(inFile, outFile, encryptOption);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RTONEncodeError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }

    /**
     *
     * @param inFile - Pass file path
     * @param outFile - Pass out file
     * @param decryptRTON - Pass decrypt option
     * @returns Decrypt RTON
     */
    export function PopCapRTONDecrypt(inFile: string, outFile: string, decryptRTON: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONDecrypt(inFile, outFile, decryptRTON);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RTONDecryptError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }
    /**
     *
     * @param inFile - Pass file path
     * @param outFile - Pass out file
     * @param encryptRTON - Pass encrypt option
     * @returns Encrypt RTON
     */
    export function PopCapRTONEncrypt(inFile: string, outFile: string, encryptRTON: RTONCipher): void {
        try {
            Sen.Shell.PvZ2Shell.RTONEncrypt(inFile, outFile, encryptRTON);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RTONEncryptError(Sen.Script.Modules.System.Default.Localization.GetString((error as any).message), inFile);
        }
        return;
    }
}
