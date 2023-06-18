using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Support.PvZ2.RTON;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using Sen.Shell.Modules.Support.PvZ2.RSG;
namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile);

        public abstract void RTONEncode(string inFile, string outFile);

        public abstract void PAMtoPAMJSON(string inFile, string outFile);

        public abstract void PAMJSONtoPAM(string inFile, string outFile);

        public abstract void PAMJSONtoFlashAnimation(string inFile, string outFolder, int resolution);

        public abstract void FlashAnimationtoPAMJSON(string inFolder, string outFile);

        public abstract void PAMtoFlashAnimation(string inFile, string outFolder, int resolution);

        public abstract void FlashAnimationtoPAM(string inFolder, string outFile);

        public abstract PacketInfo RSGUnpack(string inFile, string outFolder);

        public abstract void RSGPack(string inFolder, string outFile, PacketInfo packet_info);

        public abstract void RSBUnpack(string inRSBpath, string outFolder);

        public abstract void RSBPack(string RSBDirectory, string outRSB);

        public abstract void RSBUnpackByLenient(string RSBin, string outRSBdirectory);

        public abstract void RSBDisturb(string RSBin, string outRSB);


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

        public override void PAMtoPAMJSON(string inFile, string outFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            PAMJson.OutFile(outFile);
            return;
        }

        public override void PAMJSONtoPAM(string inFile, string outFile)
        {
            var PAMJson = new SenBuffer(inFile);
            var PAMFile = PAM_Binary.Encode(PAMJson);
            PAMFile.OutFile(outFile);
            return;
        }

        public override void PAMJSONtoFlashAnimation(string inFile, string outFolder, int resolution)
        {
            var PAMFile = new SenBuffer(inFile);
            PAM_Animation.Decode(PAMFile, outFolder, resolution);
            return;
        }

        public override void FlashAnimationtoPAMJSON(string inFolder, string outFile)
        {
            var PAMJson = PAM_Animation.Encode(inFolder);
            PAMJson.OutFile(outFile);
            return;
        }

         public override void PAMtoFlashAnimation(string inFile, string outFolder, int resolution)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            PAM_Animation.Decode(PAMJson, outFolder, resolution);
            return;
        }

        public override void FlashAnimationtoPAM(string inFolder, string outFile)
        {
            var PAMJson = PAM_Animation.Encode(inFolder);
            var PAMFile = PAM_Binary.Encode(PAMJson);
            PAMFile.OutFile(outFile);
            return;
        }

        public override PacketInfo RSGUnpack(string inFile, string outFolder) {
            var RsgFile = new SenBuffer(inFile);
            var PacketInfo = RSGFunction.Unpack(RsgFile, outFolder);
            return PacketInfo;
        }

        public override void RSGPack(string inFolder, string outFile, PacketInfo packet_info) {
            var json = new JsonImplement();
            var RSGFile = RSGFunction.Pack(inFolder, packet_info);
            RSGFile.OutFile(outFile);
            return;
        }

        public override void RSBUnpack(string inRSBpath, string outFolder)
        {
            return;
        }

        public override void RSBPack(string RSBDirectory, string outRSB)
        {
            return;
        }

        public override void RSBUnpackByLenient(string RSBin, string outRSBdirectory)
        {
            return;
        }

        public override void RSBDisturb(string RSBin, string outRSB)
        {
            return;
        }
    }
}