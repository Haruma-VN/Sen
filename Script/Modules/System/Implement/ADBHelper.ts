namespace Sen.Script.Modules.System.Implement.ADBHelper {
    /**
     * Strucutre
     */

    export interface Information {
        ["vendor.soter.teei.googlekey.model"]: string;
        ["ro.product.vendor.manufacturer"]: string;
        ["vendor.service.nvram_init"]: string;
    }

    /**
     * ADB Path
     */
    export const ADBPath: string = Sen.Shell.Path.Join(Sen.Shell.MainScriptDirectory, `External`, `ADB`, `adb`);

    export function VerifyADBPath(): void {
        const adb_directory: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(Sen.Shell.MainScriptDirectory, `External`, `ADB`));
        if (!Sen.Shell.FileSystem.DirectoryExists(adb_directory)) {
            throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("cannot_find_adb_directory"));
        }
        return;
    }

    /**
     *
     * @param inFile - Android file destination
     * @param outFile - Machine output file destination
     * @returns Copy file from Android to Machine
     */

    export function CopyFileFromAndroid(inFile: string, outFile: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `pull ${inFile} ${outFile}`);
        return;
    }
    /**
     *
     * @param inFile - Machine file destination
     * @param outFile - Android output file destination
     * @returns Copy file from Machine to Android
     */

    export function CopyFileFromLocalMachine(inFile: string, outFile: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `push ${inFile} ${outFile}`);
        return;
    }

    /**
     *
     * @param text - Provide text
     * @returns Deserialize
     */

    export function DeserializeAndroidInformation(text: string): Record<string, string> {
        const properties = text.split("\n");
        const deviceInfo: Record<string, string> = {};
        properties.forEach((property: string) => {
            const match = property.match(/\[(.+)\]: \[(.+)\]/);
            if (match) {
                deviceInfo[match[1]] = match[2];
            }
        });
        return deviceInfo;
    }

    /**
     *
     * @returns Current Machine Information
     */

    export function ObtainCurrentAndroidMachineInformation(): Record<string, string> {
        return Sen.Script.Modules.System.Implement.ADBHelper.DeserializeAndroidInformation(Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell getprop`));
    }

    /**
     *
     * @param android_input - Android path
     * @param machine_output - Windows Folder Path
     * @returns Print message
     */

    export function PrintCopyFromAndroid(android_input: string, machine_output: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("android_file_obtained"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${android_input}`);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("machine_file_obtained"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(machine_output, Sen.Shell.Path.Parse(android_input).name))}`);
        return;
    }

    /**
     *
     * @param machine_input - Windows Path
     * @param android_output - Android path
     * @returns Print message
     */

    export function PrintCopyToAndroid(machine_input: string, android_output: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("machine_file_obtained"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${machine_input}`);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("android_file_obtained"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${android_output}`);
        return;
    }

    /**
     *
     * @param application_package - Provide application package such "com.ea.game.pvz2.row"
     * @returns Run application
     */

    export function RunApplication(application_package: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell monkey -p ${application_package} -c android.intent.category.LAUNCHER 1`);
        return;
    }

    /**
     *
     * @param apk_path - Provide apk path
     * @returns Install APK on Android
     */

    export function InstallApplication(apk_path: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `install ${apk_path}`);
        return;
    }

    /**
     *
     * @param file_path - Provide file path to remove
     * @returns Removed file
     */

    export function RemoveFile(file_path: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell rm ${file_path}`);
        return;
    }

    /**
     *
     * @param dir_path - Provide directory path to remove
     * @returns Removed directory
     */

    export function RemoveDirectory(dir_path: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell rm -r ${dir_path}`);
        return;
    }
    /**
     *
     * @param dir_path - Provide directory path to create
     * @returns Created directory
     */

    export function CreateDirectory(dir_path: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell mkdir ${dir_path}`);
        return;
    }

    /**
     *
     * @param output - Pass the output from ADB Send Connect
     * @returns
     */

    export function ADBDeviceTest(output: string): { [serial: string]: string } {
        const lines = output.trim().split("\n");
        const devices: { [serial: string]: string } = {};
        for (const line of lines.slice(1)) {
            const [serial, status] = line.split("\t");
            devices[serial] = status;
        }
        return devices;
    }

    /**
     *
     * @returns Test Android connection
     */

    export function AndroidConnection(): { [serial: string]: string } {
        return Sen.Script.Modules.System.Implement.ADBHelper.ADBDeviceTest(Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `devices`));
    }
    /**
     *
     * @param machine_input - APK
     * @returns Print message
     */

    export function PrintApplicationInstall(machine_input: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("now_installing_application"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Shell.Path.Parse(machine_input).name_without_extension}`);
        return;
    }

    /**
     *
     * @param file_path - Provide file path
     * @returns
     */

    export function Existed(file_path: string): boolean {
        return Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell ls ${file_path}`) === "true";
    }

    /**
     * Structure
     */

    interface PackageInfo {
        versionCode: string;
        versionName: string;
        primaryCpuAbi: string;
        [key: string]: string;
    }

    /**
     *
     * @param output - After Shell call
     * @returns
     */

    export function DeserializePackageInformation(output: string): PackageInfo {
        const lines = output.trim().split("\n");
        const packageInfo: PackageInfo = {
            versionCode: "",
            versionName: "",
            primaryCpuAbi: "",
        };
        for (const line of lines) {
            const match = line.match(/^\s*([a-zA-Z]+)=([^\s]+)/);
            if (match) {
                const key = match[1];
                const value = match[2];
                packageInfo[key] = value;
            }
        }
        return packageInfo;
    }

    /**
     *
     * @param package_name - Provide application package name
     * @returns
     */

    export function ObtainApplicationInformation(package_name: string): PackageInfo {
        return Sen.Script.Modules.System.Implement.ADBHelper.DeserializePackageInformation(Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell dumpsys package ${package_name}`));
    }

    /**
     *
     * @param packet_info - Information of application
     * @returns
     */

    export function PrintApplicationInformation(packet_info: PackageInfo): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("installed_application_detail"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("current_app_version_code")}: ${packet_info.versionCode}`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("current_app_version_name")}: ${packet_info.versionName}`);
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Script.Modules.System.Default.Localization.GetString("architecture")}: ${packet_info.primaryCpuAbi}`);
        return;
    }
    /**
     *
     * @param machine_input - APK
     * @returns Print message
     */

    export function PrintApplicationRun(machine_input: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("now_running_application"));
        Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      ${Sen.Shell.Path.Parse(machine_input).name_without_extension}`);
        return;
    }

    /**
     *
     * @param application_package - Provide application package
     * @returns
     */

    export function ForceCloseApplication(application_package: string): void {
        Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell am force-stop ${application_package}`);
        return;
    }

    /**
     *
     * @param application_package - Provide application package name
     * @returns
     */

    export function IsClosed(application_package: string): boolean {
        return Sen.Shell.ADBHelper.ADBSendConnect(Sen.Script.Modules.System.Implement.ADBHelper.ADBPath, `shell pidof ${application_package}`) === "";
    }
}
