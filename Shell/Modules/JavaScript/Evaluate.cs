using Sen.Modules.Standards;
using Sen.Modules.Standards.IOModule;
using Sen.Modules.Standards.Bitmap;

namespace Sen.Modules.JavaScript
{
    public class Engine
    {
        public static void Evaluate(ref string Script_Directory, string[] args)
        {

            var path = new Implement_Path();
            Script_Directory = path.Resolve(Script_Directory);
            var fs = new FileSystem();
            var main_js = path.Resolve($"{Script_Directory}/main.js");
            var SystemConsole = new SystemImplement();
            var engine = new Jint.Engine();

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
            engine.SetValue("TextureEncoder", new TextureEncoderFast());

            try
            {
                engine.Execute(fs.ReadText(main_js, EncodingType.UTF8), main_js);
            }
            catch(Exception ex)
            {
                EvaluateError(ref Script_Directory, ex);
            }

            return;
        }

        public static void EvaluateError(ref string Script_Directory, Exception ex)
        {
            var path = new Implement_Path();
            Script_Directory = path.Resolve(Script_Directory);
            var fs = new FileSystem();
            var SystemConsole = new SystemImplement();
            var engine = new Jint.Engine();

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
            engine.SetValue("DotNetExceptionArg", ex);
            engine.Execute(
                fs.ReadText(path.Resolve($"{Script_Directory}/modules/system/default/exception_handler.js"), EncodingType.UTF8));
        }

    }
}
