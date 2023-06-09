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
                        if(fs.FileExists( bat ) )
                        {
                            fs.DeleteFile(bat);
                        }
                        string current_shell = Path.GetFullPath($"{path.Dirname(Sen.Shell.Program.Script_Directory)}/shell.exe");
                        string new_shell = Path.GetFullPath($"{path.Dirname(Sen.Shell.Program.Script_Directory)}/shell_new");
                        fs.WriteText(bat, $"@echo off\r\nset \"currentShellPath={current_shell}\"\r\nset \"newShellPath={new_shell}\"\r\n\r\ntasklist /fi \"imagename eq %currentShellPath%\" | find /i \"%currentShellPath%\" >nul\r\n\r\nif errorlevel 1 (\r\n    rem Program is not running.\r\n) else (\r\n    taskkill /f /im \"%currentShellPath%\" >nul 2>&1\r\n)\r\n\r\nif not exist \"%currentShellPath%\" exit /b\r\nmove /y \"%newShellPath%\" \"%currentShellPath%\" >nul 2>&1\r\nfor %%F in (\"%currentShellPath%\") do (\r\n    ren \"%%F\" \"%%~nxF\" >nul 2>&1\r\n)\r\n\r\nexit /b\r\n", EncodingType.UTF8);
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
                            fs.WriteText(sh, $"#!/bin/bash\r\n\r\ncurrentShellPath=\"{current_shell}\"\r\nnewShellPath=\"{new_shell}\"\r\nbatchFilePath=\"$0\"\r\n\r\nif [ ! -f \"$currentShellPath\" ]; then\r\n    exit 1\r\nfi\r\n\r\nrm \"$currentShellPath\"\r\nmv \"$newShellPath\" \"$currentShellPath\"\r\nmv \"$currentShellPath\" \"$currentShellPath\"\r\n\r\nsleep 3\r\nrm \"$batchFilePath\"", EncodingType.UTF8);
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
