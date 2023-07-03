using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.Bitmap;
using Sen.Shell.Modules.Support.TextureEncode.RSB;
using Sen.Shell.Modules.Support.PvZ2;
using Jint;
using Sen.Shell.Modules.Support.Download;
using Jint.Native;

namespace Sen.Shell.Modules.JavaScript
{
    public class JSEngine
    {
        public static void Execute(string Script_Directory, string[] args)
        {

            var path = new ImplementPath();
            var fs = new FileSystem();
            var main_js = path.Resolve($"{Script_Directory}/main.js");
            var SystemConsole = new SystemImplement();
            var engine = new Engine(options => options.AllowClr(typeof(Program).Assembly).CatchClrExceptions(exception => true));
            var ns = new JsObject(engine);
            var dictionary = new Dictionary<string, object>
            {
                {"FileSystem", fs },
                { "argument", args },
                { "MainScriptDirectory", Script_Directory },
                { "Console", SystemConsole },
                { "JavaScriptCoreEngine", engine },
                { "Path", path },
                {"DotNetPlatform", new Platform()},
                {"DotNetBitmap", new Bitmap_Implement()},
                {"DotNetCrypto", new ImplementCrypto()},
                {"DotNetCompress", new Compress()},
                {"JsonLibrary", new JsonImplement()},
                {"DotNetLocalization", new Localization()},
                {"TextureHandler", new TextureEncoderFast()},
                {"TextureHandlerPromise", new TextureEncoderAsync()},
                {"PvZ2Shell", new PvZ2Shell()},
                {"ShellVersion", new Version()},
                {"ShellUpdate", new DownloadUpdate()},
                {"Buffer", typeof(Implement.Buffer)},
                {"PvZ2XML", new Support.Flash.PvZ2XML()},
                {"XMLHelper", new Support.Flash.XmlHelper()},
            };
            ns.Set("Shell", JsValue.FromObject(engine, dictionary));
            engine.SetValue("Sen", ns);
            engine.Evaluate(fs.ReadText(main_js, EncodingType.UTF8), "Scripts/main.js");
            return;
        }
    }
}
