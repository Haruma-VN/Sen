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
        public static void CreateExecuable(string current_shell, string new_shell)
        {
            var fs = new FileSystem();
            switch (Platform.CurrentPlatform())
            {
                case UserPlatform.Windows:
                    {
                        string bat = Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.bat");
                        if(fs.FileExists( bat ) )
                        {
                            fs.DeleteFile(bat);
                        }
                        fs.WriteText(bat, $"@echo off\r\nset \"currentShellPath={current_shell}\"\r\nset \"newShellPath={new_shell}\"\r\nset \"batchFilePath=%~f0\"\r\n\r\nif not exist \"%currentShellPath%\" exit /b\r\ndel \"%currentShellPath%\"\r\nmove \"%newShellPath%\" \"%currentShellPath%\"\r\nfor %%F in (\"%currentShellPath%\") do (\r\n    ren \"%%F\" \"%%~nxF\"\r\n)\r\n\r\ntimeout /t 3 /nobreak >nul\r\ndel \"%batchFilePath%\"\r\n", EncodingType.UTF8);
                        break;
                    }
                case UserPlatform.Macintosh:
                case UserPlatform.Linux:
                    {
                        string sh = Path.GetFullPath($"{Sen.Shell.Program.Script_Directory}/shell.bat");
                        if (fs.FileExists(sh))
                        {
                            fs.DeleteFile(sh);
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

        public static void ExecuteBat(string FilePath)
        {
            Environment.Exit(0);
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
