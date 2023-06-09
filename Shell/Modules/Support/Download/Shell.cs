using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Sen.Shell.Modules.Support.Download
{
    public class InternalShell
    {
        public static void CreateExecuable()
        {
            var fs = new FileSystem();
            var path = new ImplementPath();
            switch (Platform.CurrentPlatform())
            {
                case UserPlatform.Windows:
                    {
                        string bat = Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.bat");
                        string batrun = Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shellrun.bat");
                        if(fs.FileExists( bat ) )
                        {
                            fs.DeleteFile(bat);
                        }
                        string currentPath = Path.GetFullPath($"{path.Dirname(Sen.Shell.Program.Script_Directory)}");
                        string currentShellName = "shell.exe";
                        string newShellName = "shell_new";
                        fs.WriteText(bat, $"@echo off\r\ncd {Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}")}\r\nstart shellrun.bat /popup\r\nexit", EncodingType.UTF8);
                        fs.WriteText(batrun, $"@echo off\r\nset currentPath={currentPath}\r\nset currentShellName={currentShellName} \r\nset newShellName={newShellName}\r\n\r\ncd %currentPath%\r\nStart /WAIT taskkill /f /im %currentShellName%\r\nTimeout /t 2 >NUL\r\nif not exist %newShellName% exit \r\nif exist %currentShellName% del %currentShellName%\r\nren %newShellName% %currentShellName%\r\nexit", EncodingType.UTF8);
                        break;
                    }
                case UserPlatform.Macintosh:
                case UserPlatform.Linux:
                    {
                        string sh = Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.sh");
                        if (fs.FileExists(sh))
                        {
                            fs.DeleteFile(sh);
                            string current_shell = Path.GetFullPath($"{path.Dirname(Sen.Shell.Program.Script_Directory)}/shell");
                            string new_shell = Path.GetFullPath($"{path.Dirname(Sen.Shell.Program.Script_Directory)}/shell_new");
                            fs.WriteText(sh, $"#!/bin/bash\r\n\r\ncurrentShellPath=\"{current_shell}\"\r\nnewShellPath=\"{new_shell}\"\r\nbatchFilePath=\"$0\"\r\n\r\nif [ ! -f \"$currentShellPath\" ]; then\r\n    exit 1\r\nfi\r\n\r\nrm \"$currentShellPath\"\r\nmv \"$newShellPath\" \"$currentShellPath\"\r\nmv \"$currentShellPath\" \"$currentShellPath\"\r\n\r\nsleep 3\r\nrm \"$batchFilePath\"", EncodingType.UNICODE);
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            return;
        }

        public static void ExecuteBat()
        {
            string FilePath = Platform.CurrentPlatform() switch
            {
                UserPlatform.Windows => Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.bat"),
                UserPlatform.Macintosh => Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.sh"),
                UserPlatform.Linux => Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.sh"),
                _ => "unknown"
            } ;
            if(FilePath== "unknown")
            {
                return;
            }
            var process = new Process();
            if (Platform.CurrentPlatform() == UserPlatform.Windows)
            {
                process.StartInfo.FileName = $"cmd.exe";
                process.StartInfo.Arguments = $"/c start \"\" /b \"{FilePath}\"";
            }
            else if (Platform.CurrentPlatform() == UserPlatform.Macintosh || Platform.CurrentPlatform() == UserPlatform.Linux)
            {
                process.StartInfo.FileName = $"/bin/sh";
                process.StartInfo.Arguments = $"-c \"{FilePath} &\"";
            }
            else
            {
                return;
            }
            process.Start();
            process.WaitForExit();
        }
    }
}
