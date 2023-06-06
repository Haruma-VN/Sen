using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.JavaScript;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Download;
using System.IO;

namespace Sen.Shell
{
     internal class Program
     {

        public static readonly string Script_Directory = Platform.CurrentPlatform() switch {
            UserPlatform.Windows => Implement_Path.FullPath($"{Platform.CurrentDirectoryContainsShell}\\Scripts"),
            UserPlatform.Linux => Implement_Path.FullPath($"{Platform.CurrentDirectoryContainsShell}\\Scripts"),
            UserPlatform.Macintosh => Implement_Path.FullPath($"{Platform.CurrentDirectoryContainsShell}\\Scripts"),
            UserPlatform.Android => Implement_Path.FullPath($"/sdcard/data/com.harumavn.sen.pvz2tool/Scripts"),
            UserPlatform.iOS => Implement_Path.FullPath($"?unknown"),
            _ => throw new Exception($"Unknown"),
        };


        public async static Task<int> Main(string[] args)
        {
            var SystemConsole = new SystemImplement();
            var path = new Implement_Path();
            var fs = new FileSystem();
            if (!fs.DirectoryExists(Script_Directory) || !fs.FileExists(path.Resolve($"{Script_Directory}\\main.js")))
            {
                SystemConsole.Print(null, $"Scripts not found, redownloading scripts from github");
                await GitHub.DownloadScript(Script_Directory, $"https://api.github.com/repos/Haruma-VN/Sen/releases/tags/scripts");
            }
            try
            {
                Engine.Evaluate(Script_Directory, args);
            }
            catch (Exception ex)
            {
                Engine.EvaluateError(Script_Directory, ex);
            }
            finally
            {
                SystemConsole.TerminateProgram();
            }
            return 0;
        }
    }
}
