using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.JavaScript;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Download;

namespace Sen.Shell
{
     internal class Program
    {
        public async static Task<int> Main(string[] args)
        {
            var SystemConsole = new SystemImplement();
            var path = new Implement_Path();
            var fs = new FileSystem();
            var Script_Directory = path.Resolve($"{Platform.CurrentDirectoryContainsShell}/Scripts");
            if (!fs.DirectoryExists(Script_Directory) || !fs.FileExists(path.Resolve($"{Script_Directory}\\main.js")))
            {
                SystemConsole.Print(null, $"Script not found, redownloading script from github");
                await GitHub.DownloadScript(Script_Directory, $"https://api.github.com/repos/Haruma-VN/Sen/releases/tags/scripts");
            }
            try
            {
                Engine.Evaluate(ref Script_Directory, args);
            }
            catch (Exception ex)
            {
                Engine.EvaluateError(ref Script_Directory, ex);
            }
            finally
            {
                SystemConsole.TerminateProgram();
            }
            return 0;
        }
    }
}
