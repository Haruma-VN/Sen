namespace Sen.Script.Modules.Support.PopCap.PvZ2.Android.Remote {
    /**
     * Structure
     */

    export type TimeModify = {
        date: string;
        time: string;
    };
    /**
     * Structure
     */

    export interface Helper {
        file_path: string;
        android_path: string;
        application_package: string;
    }

    /**
     *
     * @param output - Pass Modify UTC
     * @returns
     */

    export function DeserializeTimeLine(output: string): TimeModify {
        const time: [string, string, string, string, string] = output.split(" ") as [string, string, string, string, string];
        return {
            date: `${time[0]} ${time[1]} ${time[2]} ${time[3]}`,
            time: time[4],
        };
    }

    export function WatchFile(helper: Helper): void {
        let connection: Record<string, string> = Sen.Script.Modules.System.Implement.ADBHelper.AndroidConnection();
        if (Object.keys(connection).length === 0) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, Sen.Script.Modules.System.Default.Localization.GetString("waiting_for_android_device_response"));
        }
        while (Object.keys(connection).length === 0) {
            connection = Sen.Script.Modules.System.Implement.ADBHelper.AndroidConnection();
        }
        Object.keys(connection).forEach((e: string) => {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("android_obtained_connection"));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${e}`);
        });
        let status: boolean = Sen.Shell.FileSystem.FileExists(helper.file_path);
        if (!status) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("no_such_file").replace(/\{\}/g, helper.file_path));
        }
        while (!status) {
            Sen.Shell.ADBHelper.Sleep(3000n);
            status = Sen.Shell.FileSystem.FileExists(helper.file_path);
        }
        if (status) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("now_watching_file"));
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${helper.file_path}`);
            let current = Sen.Shell.FileSystem.GetModifyTimeUTC(helper.file_path).toString();
            while (true) {
                try {
                    Sen.Shell.ADBHelper.Sleep(5000n);
                    const new_change = Sen.Shell.FileSystem.GetModifyTimeUTC(helper.file_path);
                    if (new_change.toString() !== current && new_change.toString() !== "01/01/1601 00:00:00" && Sen.Shell.FileSystem.FileExists(helper.file_path)) {
                        Sen.Shell.ADBHelper.Sleep(5000n);
                        const g_struct = Sen.Script.Modules.Support.PopCap.PvZ2.Android.Remote.DeserializeTimeLine(new_change.toString());
                        current = new_change.toString();
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("detect_file_changed"));
                        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${g_struct.date} & ${g_struct.time}`);
                        if (!Sen.Script.Modules.System.Implement.ADBHelper.IsClosed(helper.application_package)) {
                            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("current_status"));
                            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("require_closing_application")}`);
                            Sen.Script.Modules.System.Implement.ADBHelper.ForceCloseApplication(helper.application_package);
                        }
                        Sen.Script.Modules.System.Implement.ADBHelper.PrintCopyToAndroid(helper.file_path, helper.android_path);
                        Sen.Script.Modules.System.Implement.ADBHelper.CopyFileFromLocalMachine(helper.file_path, helper.android_path);
                        Sen.Script.Modules.System.Implement.ADBHelper.PrintApplicationInformation(Sen.Script.Modules.System.Implement.ADBHelper.ObtainApplicationInformation(helper.application_package));
                        Sen.Script.Modules.System.Implement.ADBHelper.RunApplication(helper.application_package);
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("now_running_application"));
                        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${helper.application_package}`);
                    }
                } catch (error: any) {
                    Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("current_status"));
                    Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("file_deleted")}`);
                    while (!Sen.Shell.FileSystem.FileExists(helper.file_path)) {
                        Sen.Shell.ADBHelper.Sleep(3000n);
                    }
                }
            }
        }
        return;
    }
}
