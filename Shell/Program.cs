using Sen.Shell.Kernel.Standards;
using Sen.Shell.Kernel.JavaScript;
using Sen.Shell.Kernel.Standards.IOModule;
using Sen.Shell.Kernel.Support.Download;

namespace Sen.Shell
{
     public class Program
     {

        public unsafe static readonly string Script_Directory = Platform.CurrentPlatform() switch {
            UserPlatform.Windows => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Linux => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Macintosh => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Scripts"),
            UserPlatform.Android => ImplementPath.FullPath($"storage/emulated/0/Android/data/com.vn.haruma.sen/scripts"),
            UserPlatform.iOS => ImplementPath.FullPath($"?unknown"),
            _ => throw new Exception($"Unknown"),
        };

        public unsafe static readonly string InternalPath = Platform.CurrentPlatform() switch
        {
            UserPlatform.Windows => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Internal.dll"),
            UserPlatform.Linux => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Internal.so"),
            UserPlatform.Macintosh => ImplementPath.FullPath($"{Platform.CurrentDirectoryContainsShell}/Internal.dylib"),
            _ => throw new Exception($"Unknown"),
        };

        public async static Task<int> Main(string[] args)
        {
            Kernel.Support.Misc.SignWindowsRegistry.AssignExtensionWithSen();
            var SystemConsole = new SystemImplement();
            var path = new ImplementPath();
            var fs = new FileSystem();
            if (!fs.FileExists(InternalPath))
            {
                SystemConsole.Print(null, $"Internal Module not found, redownloading Internal from Github");
                await GitHub.DownloadInternal(InternalPath, $"https://api.github.com/repos/Haruma-VN/Sen/releases/tags/internal");
            }
            if (!fs.DirectoryExists(Script_Directory) || !fs.FileExists(path.Resolve(path.Join($"{Script_Directory}", "main.js"))))
            {
                SystemConsole.Print(null, $"Script Module not found, redownloading Script from Github");
                await GitHub.DownloadScript(Script_Directory, $"https://api.github.com/repos/Haruma-VN/Sen/releases/tags/scripts");
            }
            try
            {
                JSEngine.Execute(Script_Directory, args);
            }
            finally
            {
                SystemConsole.TerminateProgram();
            }
            return 0;
        }
    }
}
