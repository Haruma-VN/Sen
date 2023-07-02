namespace Sen.Script.Modules.Crypto.Constraints {
    /**
     * @param - Implemented Rijndael based on .NET Library
     * @param - Provide one padding
     */

    export enum RijndaelPadding {
        None,
        PKCS7,
        Zeros,
        ANSIX923,
        ISO10126,
    }

    /**
     * @param - Implemented Rijndael based on .NET Library
     * @param - Mode for Rijndael Encryption
     */

    export enum RijndaelMode {
        CBC,
        ECB,
        CFB,
        CTS,
    }
}
