namespace Sen
{
     internal class Program
    {
        public static int Main(string[] args)
        {
            var SystemConsole = new Sen.Modules.Standards.SystemImplement();
            var Script_Directory = $"{Sen.Modules.Standards.Platform.CurrentDirectoryContainsShell}/Script";
            try
            {
                Sen.Modules.JavaScript.Engine.Evaluate(ref Script_Directory, args);
            }
            catch(Exception ex)
            {
                Sen.Modules.JavaScript.Engine.EvaluateError(ref Script_Directory, ex);
            }
            return 0;
        }
    }
}
