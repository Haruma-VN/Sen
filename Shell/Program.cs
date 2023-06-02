using Sen.Modules.Standards;
using Sen.Modules.JavaScript;

namespace Sen
{
     internal class Program
    {
        public static int Main(string[] args)
        {
            var SystemConsole = new SystemImplement();
            var Script_Directory = $"{Platform.CurrentDirectoryContainsShell}/Script";
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
