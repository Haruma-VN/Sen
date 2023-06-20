using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using Sen.Shell.Modules.Support.PvZ2.RSG;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Compress;

namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile);

        public abstract void RTONEncode(string inFile, string outFile);

        public abstract PAMInfo PAMtoPAMJSON(string inFile);

        public abstract void PAMJSONtoPAM(string PAMJson, string outFile);

        public abstract ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution);

        public abstract PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo);

        public abstract ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution);

        public abstract void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo);

        public abstract PacketInfo RSGUnpack(string inFile, string outFolder);

        public abstract void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile);

        public abstract void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile);

        public abstract void RSGPack(string inFolder, string outFile, PacketInfo packet_info);

        public abstract void RSBUnpack(string inRSBpath, string outFolder);

        public abstract void RSBPack(string RSBDirectory, string outRSB);

        public abstract void RSBUnpackByLenient(string RSBin, string outRSBdirectory);

        public abstract void RSBDisturb(string RSBin, string outRSB);

        public abstract void WWiseSoundBankDecode(string bnk_in, string bnk_dir_out);

        public abstract void WWiseSoundBankEncode(string soundbank_dir, string out_bnk);


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

        public override PAMInfo PAMtoPAMJSON(string inFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            return PAMJson;
        }

        public override void PAMJSONtoPAM(string PAMJson, string outFile)
        {
            var fs = new FileSystem();
            var PAMFile = PAM_Binary.Encode(fs.ReadJson<PAMInfo>(PAMJson));
            PAMFile.OutFile(outFile);
            return;
        }

        public override ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution)
        {
            var fs = new FileSystem();
            var extraInfo = PAM_Animation.Decode(fs.ReadJson<PAMInfo>(PAMJson), outFolder, resolution);
            return extraInfo;
        }

        public override PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            return PAMJson;
        }

         public override ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution)
        {
            var PAMFile = new SenBuffer(inFile);
            var PamInfo = PAM_Binary.Decode(PAMFile);
            var extraInfo = PAM_Animation.Decode(PamInfo, outFolder, resolution);
            return extraInfo;
        }

        public override void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
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

        public override void WWiseSoundBankDecode(string bnk_in, string bnk_dir_out)
        {
            return;
        }

        public override void WWiseSoundBankEncode(string soundbank_dir, string out_bnk)
        {
            return;
        }

        public override void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var zlib_data = zlib.ZlibCompress(ripefile, use64bitvariant);
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, zlib_data);
            return;
        }

        public override void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var uncompresszlib_data = zlib.ZlibUncompress(ripefile, use64bitvariant);
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, uncompresszlib_data);
            return;
        }
    }
}