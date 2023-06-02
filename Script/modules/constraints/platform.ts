namespace Sen.Script.Modules.Platform.Constraints {
    /**
     * @param -  Shell Type for Sen
     */
    export enum ShellType {
        Console,
        GUI,
    }

    /**
     * @package Current user platform
     */

    export enum UserPlatform {
        Windows,
        Macintosh,
        Linux,
        Android,
        iOS,
        Unknown,
    }

    /**
     * @param - Console color to choose
     */

    export enum ConsoleColor {
        Black,
        Blue,
        Cyan,
        DarkBlue,
        DarkCyan,
        DarkGray,
        DarkGreen,
        DarkMagenta,
        DarkRed,
        DarkYellow,
        Gray,
        Green,
        Magenta,
        Red,
        White,
        Yellow,
    }

    /**
     * @returns Press any key to continue
     */

    export function ExitProgram(): void {
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_finish").replace(
                /{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("press_any_key_to_continue"),
            ),
        );
    }
}
