"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var Compression;
            (function (Compression) {
                var Constraints;
                (function (Constraints) {
                    /**
                     * @param -  Provide Zlib level for all compression methods
                     */
                    let ZlibLevel;
                    (function (ZlibLevel) {
                        ZlibLevel[ZlibLevel["Level0"] = 0] = "Level0";
                        ZlibLevel[ZlibLevel["Level1"] = 1] = "Level1";
                        ZlibLevel[ZlibLevel["Level2"] = 2] = "Level2";
                        ZlibLevel[ZlibLevel["Level3"] = 3] = "Level3";
                        ZlibLevel[ZlibLevel["Level4"] = 4] = "Level4";
                        ZlibLevel[ZlibLevel["Level5"] = 5] = "Level5";
                        ZlibLevel[ZlibLevel["Level6"] = 6] = "Level6";
                        ZlibLevel[ZlibLevel["Level7"] = 7] = "Level7";
                        ZlibLevel[ZlibLevel["Level8"] = 8] = "Level8";
                        ZlibLevel[ZlibLevel["Level9"] = 9] = "Level9";
                        ZlibLevel[ZlibLevel["None"] = 10] = "None";
                        ZlibLevel[ZlibLevel["BestCompression"] = 11] = "BestCompression";
                        ZlibLevel[ZlibLevel["BestSpeed"] = 12] = "BestSpeed";
                    })(ZlibLevel = Constraints.ZlibLevel || (Constraints.ZlibLevel = {}));
                })(Constraints = Compression.Constraints || (Compression.Constraints = {}));
            })(Compression = Modules.Compression || (Modules.Compression = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
