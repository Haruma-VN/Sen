using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.Bitmap;
using Sen.Shell.Modules.Support.TextureEncode.RSB;
using Sen.Shell.Modules.Support.PvZ2;
using Jint;
using Sen.Shell.Modules.Support.Download;
using Jint.Native;
using Jint.Runtime.Interop;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support;

namespace Sen.Shell.Modules.JavaScript
{
    public class JSEngine
    {
        public static Engine Engine { get; } = new Engine(options => 
        options.EnableModules(Sen.Shell.Program.Script_Directory).Strict().AllowClrWrite()
        .AllowClr(typeof(Program).Assembly).CatchClrExceptions(exception => true));

        public static void Execute(string Script_Directory, string[] args)
        {

            var path = new ImplementPath();
            var fs = new FileSystem();
            var main_js = path.Resolve(path.Join($"{Script_Directory}","main.js"));
            var SystemConsole = new SystemImplement();
            var ns = new JsObject(Engine);
            var dictionary = new Dictionary<string, object>
            {
                {"FileSystem", fs },
                { "argument", args },
                { "MainScriptDirectory", Script_Directory },
                { "Console", SystemConsole },
                { "JavaScriptCoreEngine", Engine },
                { "Path", path },
                {"DotNetPlatform", new Platform()},
                {"DotNetBitmap", new Bitmap_Implement()},
                {"DotNetCrypto", new ImplementCrypto()},
                {"DotNetCompress", new Compress()},
                {"JsonLibrary", new JsonImplement()},
                {"DotNetLocalization", new Localization()},
                {"TextureHandler", new TextureEncoderFast()},
                {"TextureHandlerPromise", new TextureEncoderAsync()},
                {"LotusModule", new LotusModule()},
                {"ShellVersion", new Version()},
                {"ShellUpdate", new DownloadUpdate()},
                {"Buffer", typeof(Implement.Buffer)},
                {"PvZ2XML", new Support.Flash.XML()},
                {"XMLHelper", new Support.Flash.XmlHelper()},
                {"PvZ2Lawnstrings", new Sen.Shell.Modules.Support.PvZ2.Lawnstrings()},
                {"ChatGPT", new Sen.Modules.Support.Misc.ChatGPT()},
                {"ADBHelper", new Sen.Shell.Modules.Support.Misc.ADBHelper()},
                { "SenBuffer", TypeReference.CreateTypeReference(Engine, typeof(SenBuffer)) },
            };
            ns.Set("Shell", JsValue.FromObject(Engine, dictionary));
            var k_dictionary = new Dictionary<string, object>
            {
                {"Version", new Internal.Version() },
                {"Compress", new Internal.Compress() },
                {"VCDiff", new Internal.VCDiff() },
                {"Uncompress", new Internal.Uncompress() },
            };
            ns.Set("Internal", JsValue.FromObject(Engine, k_dictionary));
            Engine.SetValue("Sen", ns);
            Engine.Evaluate(fs.ReadText(main_js, EncodingType.UTF8), "Scripts\\main.js");
            Engine.Evaluate($"Sen.Script.Main(Sen.Shell.argument);", "<Script>");
            return;
        }
    }
}
