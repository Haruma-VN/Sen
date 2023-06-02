"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var Platform;
            (function (Platform) {
                var Constraints;
                (function (Constraints) {
                    /**
                     * @param -  Shell Type for Sen
                     */
                    let ShellType;
                    (function (ShellType) {
                        ShellType[ShellType["Console"] = 0] = "Console";
                        ShellType[ShellType["GUI"] = 1] = "GUI";
                    })(ShellType = Constraints.ShellType || (Constraints.ShellType = {}));
                    /**
                     * @package Current user platform
                     */
                    let UserPlatform;
                    (function (UserPlatform) {
                        UserPlatform[UserPlatform["Windows"] = 0] = "Windows";
                        UserPlatform[UserPlatform["Macintosh"] = 1] = "Macintosh";
                        UserPlatform[UserPlatform["Linux"] = 2] = "Linux";
                        UserPlatform[UserPlatform["Android"] = 3] = "Android";
                        UserPlatform[UserPlatform["iOS"] = 4] = "iOS";
                        UserPlatform[UserPlatform["Unknown"] = 5] = "Unknown";
                    })(UserPlatform = Constraints.UserPlatform || (Constraints.UserPlatform = {}));
                    /**
                     * @param - Console color to choose
                     */
                    let ConsoleColor;
                    (function (ConsoleColor) {
                        ConsoleColor[ConsoleColor["Black"] = 0] = "Black";
                        ConsoleColor[ConsoleColor["Blue"] = 1] = "Blue";
                        ConsoleColor[ConsoleColor["Cyan"] = 2] = "Cyan";
                        ConsoleColor[ConsoleColor["DarkBlue"] = 3] = "DarkBlue";
                        ConsoleColor[ConsoleColor["DarkCyan"] = 4] = "DarkCyan";
                        ConsoleColor[ConsoleColor["DarkGray"] = 5] = "DarkGray";
                        ConsoleColor[ConsoleColor["DarkGreen"] = 6] = "DarkGreen";
                        ConsoleColor[ConsoleColor["DarkMagenta"] = 7] = "DarkMagenta";
                        ConsoleColor[ConsoleColor["DarkRed"] = 8] = "DarkRed";
                        ConsoleColor[ConsoleColor["DarkYellow"] = 9] = "DarkYellow";
                        ConsoleColor[ConsoleColor["Gray"] = 10] = "Gray";
                        ConsoleColor[ConsoleColor["Green"] = 11] = "Green";
                        ConsoleColor[ConsoleColor["Magenta"] = 12] = "Magenta";
                        ConsoleColor[ConsoleColor["Red"] = 13] = "Red";
                        ConsoleColor[ConsoleColor["White"] = 14] = "White";
                        ConsoleColor[ConsoleColor["Yellow"] = 15] = "Yellow";
                    })(ConsoleColor = Constraints.ConsoleColor || (Constraints.ConsoleColor = {}));
                    /**
                     * @returns Press any key to continue
                     */
                    function ExitProgram() {
                        Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_finish").replace(/{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("press_any_key_to_continue")));
                    }
                    Constraints.ExitProgram = ExitProgram;
                })(Constraints = Platform.Constraints || (Platform.Constraints = {}));
            })(Platform = Modules.Platform || (Modules.Platform = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
