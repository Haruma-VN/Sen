using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.JavaScript;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Download;

namespace Sen.Shell
{
     internal class Program
     {

        public static readonly string Script_Directory = Platform.CurrentPlatform() switch {
            UserPlatform.Windows => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Linux => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Macintosh => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Android => ImplementPath.FullPath($"storage/emulated/0/Android/data/com.vn.haruma.sen/scripts/"),
            UserPlatform.iOS => ImplementPath.FullPath($"?unknown"),
            _ => throw new Exception($"Unknown"),
        };

        public async static Task<int> Main(string[] args)
        {
            Sen.Shell.Modules.Support.Misc.SignWindowsRegistry.AssignExtensionWithSen();
            var SystemConsole = new SystemImplement();
            var path = new ImplementPath();
            var fs = new FileSystem();
            if (!fs.DirectoryExists(Script_Directory) || !fs.FileExists(path.Resolve($"{Script_Directory}/main.js")))
            {
                SystemConsole.Print(null, $"Scripts not found, redownloading scripts from github");
                await GitHub.DownloadScript(Script_Directory, $"https://api.github.com/repos/Haruma-VN/Sen/releases/tags/scripts");
            }
            try
            {
                JSEngine.Execute(Script_Directory, args);
            }
            catch (Exception ex)
            {
                JSEngine.EvaluateError(Script_Directory, ex);
            }
            finally
            {
                SystemConsole.TerminateProgram();
            }
            return 0;
        }
    }
}
