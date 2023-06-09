using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;
using Sen.Shell.Modules.Support.PvZ2.PAM;
namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile);

        public abstract void RTONEncode(string inFile, string outFile);

        public abstract void PAMtoJSON(string inFile, string outFile);

        public abstract void JSONtoPAM(string inFile, string outFile);

    }

    public class PvZ2Shell : PvZ2ShellAbstract
    {
        public override void RTONDecode(string inFile, string outFile)
        {
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = RTONProcession.Decode(RtonFile, false);
            JsonFile.OutFile(outFile);
            return;
        }

        public override void RTONEncode(string inFile, string outFile)
        {
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var JsonFile = fs.ReadBytes(inFile);
            var RtonFile = RTONProcession.Encode(JsonFile, false);
            RtonFile.OutFile(outFile);
            return;
        }

        public override void PAMtoJSON(string inFile, string outFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            PAMJson.OutFile(outFile);
            return;
        }

        public override void JSONtoPAM(string inFile, string outFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Encode(PAMFile);
            PAMJson.OutFile(outFile);
            return;
        }
    }
}
