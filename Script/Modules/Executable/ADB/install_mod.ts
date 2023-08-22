namespace Sen.Script.Modules.Executable.PvZ2.RemoteAndroidHelper.InstallMod {
    export function Evaluate(): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_application_package_name"))
        );
        const package_name: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_apk_path"))
        );
        const apk_path: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_rsb_path"))
        );
        const rsb_path: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const rsb_outpath: string = `/sdcard/Android/obb/${package_name}`;
        const destination: string = `${rsb_outpath}/${Sen.Shell.Path.Parse(rsb_path).name}`;
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
        if (Sen.Script.Modules.System.Implement.ADBHelper.Existed(rsb_outpath)) {
            Sen.Script.Modules.System.Implement.ADBHelper.RemoveDirectory(rsb_outpath);
        }
        Sen.Script.Modules.System.Implement.ADBHelper.CreateDirectory(rsb_outpath);
        Sen.Script.Modules.System.Implement.ADBHelper.PrintApplicationInstall(apk_path);
        Sen.Script.Modules.System.Implement.ADBHelper.InstallApplication(apk_path);
        Sen.Script.Modules.System.Implement.ADBHelper.PrintCopyToAndroid(rsb_path, destination);
        Sen.Script.Modules.System.Implement.ADBHelper.CopyFileFromLocalMachine(rsb_path, destination);
        Sen.Script.Modules.System.Implement.ADBHelper.PrintApplicationInformation(Sen.Script.Modules.System.Implement.ADBHelper.ObtainApplicationInformation(package_name));
        Sen.Script.Modules.System.Implement.ADBHelper.RunApplication(package_name);
        Sen.Script.Modules.System.Implement.ADBHelper.PrintApplicationRun(apk_path);
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.RemoteAndroidHelper.InstallMod.Evaluate();
