using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;

namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile);

    }

    public class PvZ2Shell : PvZ2ShellAbstract
    {
        public override void RTONDecode(string inFile, string outFile)
        {
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = RTONProcession.Decode(RtonFile, false);
            JsonFile.SaveFile(outFile);
            return;
        }
    }
}
