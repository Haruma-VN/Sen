using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.Bitmap;
using Sen.Shell.Modules.Support.TextureEncode.RSB;
using Sen.Shell.Modules.Support.PvZ2;
using Jint;
using Jint.Native;
using Jint.Runtime.Interop;
using Sen.Shell.Modules.Support.Download;

namespace Sen.Shell.Modules.JavaScript
{
    public class Engine
    {
        public static void Evaluate(in string Script_Directory, string[] args)
        {

            var path = new Sen.Shell.Modules.Standards.IOModule.ImplementPath();
            var fs = new FileSystem();
            var main_js = path.Resolve($"{Script_Directory}/main.js");
            var SystemConsole = new SystemImplement();
            var engine = new Jint.Engine(options => options.AllowClr(typeof(Program).Assembly));

            engine.SetValue("Fs", fs);
            engine.SetValue("args", args);
            engine.SetValue("MainScriptDirectory", (Script_Directory));
            engine.SetValue("Console", SystemConsole);
            engine.SetValue("TypeChecker", new TypeChecker());
            engine.SetValue("JavaScriptEngine", engine);
            engine.SetValue("Path", path);
            engine.SetValue("DotNetPlatform", new Platform());
            engine.SetValue("DotNetBitmap", new Bitmap_Implement());
            engine.SetValue("DotNetCrypto", new ImplementCrypto());
            engine.SetValue("DotNetCompress", new Compress());
            engine.SetValue("JsonLibrary", new JsonImplement());
            engine.SetValue("DotNetLocalization", new Localization());
            engine.SetValue("TextureHandler", new TextureEncoderFast());
            engine.SetValue("TextureHandlerPromise", new TextureEncoderAsync());
            engine.SetValue("PvZ2Shell", new PvZ2Shell());
            engine.SetValue("ShellVersion", new Version());
            engine.SetValue("ShellUpdate", new DownloadUpdate());

            try
            {
                engine.Execute(fs.ReadText(main_js, EncodingType.UTF8), main_js);
            }
            catch(Exception ex)
            {
                EvaluateError(Script_Directory, ex);
            }

            return;
        }


        public static void EvaluateError(in string Script_Directory, Exception ex)
        {
            var path = new ImplementPath();
            var fs = new FileSystem();
            var SystemConsole = new SystemImplement();
            var engine = new Jint.Engine();
            engine.SetValue("DotNetExceptionArg", ex);

            engine.SetValue("Fs", fs);
            engine.SetValue("MainScriptDirectory", (Script_Directory));
            engine.SetValue("Console", SystemConsole);
            engine.SetValue("TypeChecker", new TypeChecker());
            engine.SetValue("JavaScriptEngine", engine);
            engine.SetValue("Path", path);
            engine.SetValue("DotNetPlatform", new Platform());
            engine.SetValue("DotNetBitmap", new Bitmap_Implement());
            engine.SetValue("DotNetCrypto", new ImplementCrypto());
            engine.SetValue("DotNetCompress", new Compress());
            engine.SetValue("JsonLibrary", new JsonImplement());
            engine.SetValue("DotNetLocalization", new Localization());
            engine.SetValue("TextureHandler", new TextureEncoderFast());
            engine.SetValue("TextureHandlerPromise", new TextureEncoderAsync());
            engine.SetValue("PvZ2Shell", new PvZ2Shell());
            engine.SetValue("ShellVersion", new Version());
            engine.SetValue("ShellUpdate", new DownloadUpdate());
            engine.Execute(
                fs.ReadText(path.Resolve($"{Script_Directory}/modules/system/default/exception_handler.js"), EncodingType.UTF8));
        }

    }
}
