"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var Crypto;
            (function (Crypto) {
                var Constraints;
                (function (Constraints) {
                    /**
                     * @param - Implemented Rijndael based on .NET Library
                     * @param - Provide one padding
                     */
                    let RijndaelPadding;
                    (function (RijndaelPadding) {
                        RijndaelPadding[RijndaelPadding["None"] = 0] = "None";
                        RijndaelPadding[RijndaelPadding["PKCS7"] = 1] = "PKCS7";
                        RijndaelPadding[RijndaelPadding["Zeros"] = 2] = "Zeros";
                        RijndaelPadding[RijndaelPadding["ANSIX923"] = 3] = "ANSIX923";
                        RijndaelPadding[RijndaelPadding["ISO10126"] = 4] = "ISO10126";
                    })(RijndaelPadding = Constraints.RijndaelPadding || (Constraints.RijndaelPadding = {}));
                    /**
                     * @param - Implemented Rijndael based on .NET Library
                     * @param - Mode for Rijndael Encryption
                     */
                    let RijndaelMode;
                    (function (RijndaelMode) {
                        RijndaelMode[RijndaelMode["CBC"] = 0] = "CBC";
                        RijndaelMode[RijndaelMode["ECB"] = 1] = "ECB";
                        RijndaelMode[RijndaelMode["CFB"] = 2] = "CFB";
                        RijndaelMode[RijndaelMode["CTS"] = 3] = "CTS";
                    })(RijndaelMode = Constraints.RijndaelMode || (Constraints.RijndaelMode = {}));
                })(Constraints = Crypto.Constraints || (Crypto.Constraints = {}));
            })(Crypto = Modules.Crypto || (Modules.Crypto = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
