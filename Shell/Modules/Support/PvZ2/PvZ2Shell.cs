using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using Sen.Shell.Modules.Support.PvZ2.RSG;
using Sen.Shell.Modules.Support.PvZ2.RSB;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Compress;
using Sen.Shell.Modules.Standards;
using WEMSharp;
using Sen.Shell.Modules.Support.WWise;
using static Sen.Shell.Modules.Support.PvZ2.RTON.RTONProcession;
using VCDiff.Includes;
using VCDiff.Encoders;
using VCDiff.Decoders;
using VCDiff.Shared;
using static Sen.Shell.Modules.Support.PvZ2.RSG.RSGFunction;
using System.IO;
using Newtonsoft.Json;

namespace Sen.Shell.Modules.Support.PvZ2
{

    #region RTONHead
    public struct RTONHead
    {
        public string magic;
        public string end;
        public int version;
    }

    #endregion


    #region PAMHead

    public struct PAMHeader
    {
        public uint magic;
        public int version;
        public int frame_rate;
    }

    #endregion

    #region PvZ2Shell Abstract

    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile, RTONCipher DecryptRTON);

        public abstract void RTONEncode(string inFile, string outFile, RTONCipher DecryptRTON);

        public abstract PAMInfo PAMtoPAMJSON(string inFile);

        public abstract void PAMJSONtoPAM(string PAMJson, string outFile);

        public abstract ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution);

        public abstract PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo);

        public abstract ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution);

        public abstract void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo);

        public abstract PacketInfo RSGUnpack(string inFile, string outFolder, bool useResDirectory);

        public abstract void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile, ZlibCompressionLevel zlib_level);

        public abstract void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile);

        public abstract void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory);

        public abstract MainfestInfo RSBUnpack(string inRSBpath, string outFolder);

        public abstract void RSBPack(string RSBDirectory, string outRSB, MainfestInfo mainfestInfo);

        public abstract MainfestInfo RSBUnpackByLooseConstraints(string RSBin, string outRSBdirectory);

        public abstract void RSBObfuscate(string RSBin, string outRSB);

        public abstract WWiseInfoSimple WWiseSoundBankDecode(string bnk_in, string bnk_dir_out);

        public abstract void WWiseSoundBankEncode(string soundbank_dir, string out_bnk, WWiseInfoSimple information);

        public abstract RSBPacketInfo GetRSBPacketInfo(string infile);

        public abstract RSB_head ProcessRSBData(string infile);

        public abstract RTONHead ProcessRTONData(string infile);

        public abstract PAMHeader ProcessPAMData(string inFile);

        public abstract void WemToOGG(string inFile, string outFile, string destination, bool inlineCodebook, bool inlineSetup);

        public abstract void RTONDecrypt(string inFile, string outFile, RTONCipher crypt);

        public abstract void RTONEncrypt(string inFile, string outFile, RTONCipher crypt);

        public abstract void FlashAnimationResize(string inDir, int resolution);


        public abstract void ZlibCompress(string inFile, string outFile);

        public abstract void ZlibUncompress(string inFile, string outFile);

        public abstract Dictionary<string, uint[]> GenerateImageSequence(string AnimationJsonPath, string outFolder, string mediaPath, AnimationHelperSetting setting);

        public abstract void CreateRSBPatch(string RSBOriginalFilePath, string RSBModFilePath, string RSBPatchOutFile);

        public abstract void ApplyRSBPatch(string RSBOriginalFilePath, string RSBPatchFilePath, string RSBOutFilePath);

        public abstract void VCDiffEncode(string OldFile, string NewFile, string PatchOutFile, bool interleaved);

        public abstract void VCDiffDecode(string OldFile, string PatchFile, string NewFile);

        public abstract RSGAbnormal IsPopCapRSG(string inFile);

        public abstract void RewriteSlot(ResoureGroup resoureGroup, string outfile);


    }

    #region Resources Writing

    public unsafe class ResoureGroup
    {

        public readonly uint version = 1;

        public readonly uint content_version = 1;

        public required uint slot_count;

        public required SubgroupData[] groups;
    }

    public unsafe class SubgroupData
    {
        public required string id;

        public required string type;

        public string? parent;

        public string? res;

        public SubgroupWrapper[]? subgroups;

        public M_Subgroup_Wrapper[]? resources;

    }

    public unsafe class SubgroupWrapper
    {

        public required string id;

        public string? res;
    }


    #pragma warning disable CS8618

    public unsafe class M_Subgroup_Wrapper
    {
        public required uint slot;

        public required string id;

        public object path;

        public string type;

        public string? parent;

        public bool? atlas;

        public bool? runtime;

        public uint? ax;

        public uint? ay;

        public uint? aw;

        public uint? ah;

        public int? x;

        public int? y;

        public int? cols;

        public int? rows;

        public uint? width;

        public uint? height;

        public bool? forceOriginalVectorSymbolSize;

        public object? srcpath;


    }

    #endregion


    #endregion

    #region Functions

    public unsafe sealed class PvZ2Shell : PvZ2ShellAbstract
    {

        public unsafe sealed override void RewriteSlot(ResoureGroup resoureGroup, string outfile)
        {
            var composite_list = resoureGroup.groups.Where(e => e.subgroups is not null).ToList();
            composite_list.ForEach(g_composite =>
            {
                var slot_id = new Dictionary<string, M_Subgroup_Wrapper>();
                foreach (var e in g_composite.subgroups!)
                {
                    var resource = resoureGroup.groups.First(resource => resource.id == e.id)!.resources!;
                    foreach (var resx in resource)
                    {
                        if (!slot_id.TryGetValue(resx.id, out var id_possibly_null))
                        {
                            resx.slot = resoureGroup.slot_count;
                            resoureGroup.slot_count++;
                            slot_id.Add(resx.id, new M_Subgroup_Wrapper()
                            {
                                id = resx.id,
                                slot = resx.slot,
                            });
                        }
                        else
                        {
                            resx.slot = id_possibly_null.slot!;
                        }
                    }
                }
            });
            foreach (var e in resoureGroup.groups)
            {
                if (e.resources is not null && e.parent is null && e.resources.All(k => k.slot == 0))
                {
                    foreach (var res in e.resources)
                    {
                        res.slot = resoureGroup.slot_count;
                        resoureGroup.slot_count++;
                    }
                }
            }
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            var path = new ImplementPath();
            var fs = new FileSystem();
            fs.WriteText(path.Resolve(outfile), RSBFunction.JsonPrettify(JsonConvert.SerializeObject(resoureGroup, settings)), EncodingType.UTF8);
            return;
        }




        public unsafe sealed override void RTONDecode(string inFile, string outFile, RTONCipher DecryptRTON)
        {
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = RTONProcession.Decode(RtonFile, DecryptRTON);
            JsonFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override void RTONEncode(string inFile, string outFile, RTONCipher EncryptRTON)
        {
            var fs = new FileSystem();
            var JsonFile = fs.ReadBytes(inFile);
            var RtonFile = RTONProcession.Encode(JsonFile, EncryptRTON);
            RtonFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override PAMInfo PAMtoPAMJSON(string inFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            return PAMJson;
        }

        public unsafe sealed override void PAMJSONtoPAM(string PAMJson, string outFile)
        {
            var fs = new FileSystem();
            var PAMFile = PAM_Binary.Encode(fs.ReadJson<PAMInfo>(PAMJson));
            PAMFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution)
        {
            var fs = new FileSystem();
            var extraInfo = PAM_Animation.Decode(fs.ReadJson<PAMInfo>(PAMJson), outFolder, resolution);
            return extraInfo;
        }

        public unsafe sealed override PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            return PAMJson;
        }

        public unsafe sealed override ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution)
        {
            var PAMFile = new SenBuffer(inFile);
            var PamInfo = PAM_Binary.Decode(PAMFile);
            var extraInfo = PAM_Animation.Decode(PamInfo, outFolder, resolution);
            return extraInfo;
        }

        public unsafe sealed override void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            var PAMFile = PAM_Binary.Encode(PAMJson);
            PAMFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override PacketInfo RSGUnpack(string inFile, string outFolder, bool useResDirectory = true)
        {
            var RsgFile = new SenBuffer(inFile);
            var PacketInfo = RSGFunction.Unpack(RsgFile, outFolder, useResDirectory);
            return PacketInfo;
        }

        public unsafe sealed override void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory = true)
        {
            var RSGFile = RSGFunction.Pack(inFolder, packet_info, useResDirectory);
            RSGFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override MainfestInfo RSBUnpack(string inRSBpath, string outFolder)
        {
            var buffer = new SenBuffer(inRSBpath);
            return RSBFunction.Unpack(buffer, outFolder);
        }

        public unsafe sealed override void RSBPack(string RSBDirectory, string outRSB, MainfestInfo mainfestInfo)
        {
            RSBFunction.Pack(RSBDirectory, outRSB, mainfestInfo);
            return;
        }

        public unsafe sealed override MainfestInfo RSBUnpackByLooseConstraints(string RSBin, string outRSBdirectory)
        {
            var buffer = new SenBuffer(RSBin);
            var manifest = RSBFunction.UnpackByLooseConstraints(buffer, outRSBdirectory);
            return manifest;
        }

        public unsafe sealed override void RSBObfuscate(string RSBin, string outRSB)
        {
            var RSBFile = new SenBuffer(RSBin);
            RSBFunction.RSBObfuscate(RSBFile);
            RSBFile.OutFile(outRSB);
            return;
        }


        public unsafe sealed override WWiseInfoSimple WWiseSoundBankDecode(string bnk_in, string bnk_dir_out)
        {
            var wwise_soundbank = new SenBuffer(bnk_in);
            var wwise_json = WwiseFunction.DecodeSimple(wwise_soundbank, bnk_dir_out);
            return wwise_json;
        }

        public unsafe sealed override void WWiseSoundBankEncode(string soundbank_dir, string out_bnk, WWiseInfoSimple information)
        {
            var wwise_soundbank = WwiseFunction.EncodeSimple(information, soundbank_dir);
            wwise_soundbank.OutFile(out_bnk);
            return;
        }

        public unsafe sealed override void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile, ZlibCompressionLevel zlib_level)
        {
            var zlib = new PopCapZlib();
            var zlib_data = zlib.ZlibCompress(new ZlibCompress()
            {
                RipeFile = ripefile,
                Use64BitVariant = use64bitvariant,
                ZlibLevel = zlib_level
            });
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, zlib_data);
            return;
        }

        public unsafe sealed override void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var uncompresszlib_data = zlib.ZlibUncompress(ripefile, use64bitvariant);
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, uncompresszlib_data);
            return;
        }

        public unsafe sealed override RSB_head ProcessRSBData(string infile)
        {
            var buffer = new SenBuffer(infile);
            return RSBFunction.ReadHead(buffer);
        }

        public unsafe sealed override RSBPacketInfo GetRSBPacketInfo(string infile)
        {
            var buffer = new SenBuffer(infile);
            return RSGFunction.GetRSBPacketInfo(buffer);
        }

        public unsafe sealed override RTONHead ProcessRTONData(string infile)
        {
            var RtonFile = new SenBuffer(infile);
            var Rton_magic = RtonFile.readString(4);
            var Rton_ver = RtonFile.readUInt32LE();
            var EOF = RtonFile.readString(4, RtonFile.length - 4);
            return new RTONHead()
            {
                version = (int)Rton_ver,
                magic = Rton_magic,
                end = EOF
            };
        }

        public unsafe sealed override PAMHeader ProcessPAMData(string inFile)
        {
            var buffer = new SenBuffer(inFile);
            var magic = buffer.readUInt32LE();
            int version = buffer.readInt32LE();
            int frame_rate = buffer.readUInt8();
            return new PAMHeader()
            {
                version = version,
                frame_rate = frame_rate,
                magic = magic,
            };
        }

        public unsafe sealed override void WemToOGG(string inFile, string outFile, string destination, bool inlineCodebook, bool inlineSetup)
        {
            var wem = new WEMFile(inFile, WEMForcePacketFormat.NoForcePacketFormat);
            wem.GenerateOGG(outFile, destination, inlineCodebook, inlineSetup);
            return;
        }

        public unsafe sealed override void RTONDecrypt(string inFile, string outFile, RTONCipher crypt)
        {
            var buffer = new SenBuffer(inFile);
            var rton = Decrypt(buffer, crypt.key);
            rton.OutFile(outFile);
            return;
        }

        public unsafe sealed override void RTONEncrypt(string inFile, string outFile, RTONCipher crypt)
        {
            var buffer = new SenBuffer(inFile);
            var rton = Encrypt(buffer, crypt.key);
            rton.OutFile(outFile);
            return;
        }

        public unsafe sealed override void FlashAnimationResize(string inDir, int resolution)
        {
            PAM_Animation.FlashAnimationResize(inDir, resolution);
            return;
        }
        public unsafe override sealed void ZlibCompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.CompressZlib(buffer.toBytes(), ZlibCompressionLevel.BEST_COMPRESSION);
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void ZlibUncompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Sen.Shell.Modules.Standards.Compress();
            byte[] file = compression.UncompressZlib(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed Dictionary<string, uint[]> GenerateImageSequence(string AnimationJsonPath, string outFolder, string mediaPath, AnimationHelperSetting setting)
        {
            var fs = new FileSystem();
            var anim = AnimationHelper.GenerateImageSequence(fs.ReadJson<PAMInfo>(AnimationJsonPath), outFolder, mediaPath, setting);
            return anim;
        }

        public unsafe override sealed void CreateRSBPatch(string RSBOriginalFilePath, string RSBModFilePath, string RSBPatchOutFile)
        {
            var SenWriter = RSBFunction.RSBPatchEncode(new SenBuffer(RSBOriginalFilePath), new SenBuffer(RSBModFilePath));
            SenWriter.OutFile(RSBPatchOutFile);
            return;
        }

        public unsafe override sealed void ApplyRSBPatch(string RSBOriginalFilePath, string RSBPatchFilePath, string RSBOutFilePath)
        {
            var RSBAfter = RSBFunction.RSBPatchDecode(new SenBuffer(RSBOriginalFilePath), new SenBuffer(RSBPatchFilePath));
            RSBAfter.OutFile(RSBOutFilePath);
            return;
        }


        public unsafe override sealed void VCDiffEncode(string OldFile, string NewFile, string PatchOutFile, bool interleaved)
        {
            using (FileStream output = new FileStream(PatchOutFile, FileMode.Create, FileAccess.Write))
            using (FileStream dict = new FileStream(OldFile, FileMode.Open, FileAccess.Read))
            using (FileStream target = new FileStream(NewFile, FileMode.Open, FileAccess.Read))
            {
                var coder = new VcEncoder(dict, target, output, 64);
                var result = coder.Encode(interleaved: interleaved, checksumFormat: ChecksumFormat.SDCH);
                if (result != VCDiffResult.SUCCESS)
                {
                    throw new Exception("invalid_vcdiff_encode");
                }
            }
            return;
        }

        public unsafe override sealed void VCDiffDecode(string OldFile, string PatchFile, string NewFile)
        {
            using var output = new FileStream(NewFile, FileMode.Create, FileAccess.Write);
            using var dict = new FileStream(OldFile, FileMode.Open, FileAccess.Read);
            using var target = new FileStream(PatchFile, FileMode.Open, FileAccess.Read);
            var decoder = new VcDecoder(dict, target, output, 0xFFFFFFF);
            long bytesWritten = 0;
            var result = decoder.Decode(out bytesWritten);
            if (result != VCDiffResult.SUCCESS)
            {
               throw new Exception("invalid_vcdiff_decode");
            }
            return;
        }

		public unsafe override sealed RSGAbnormal IsPopCapRSG(string inFile) => RSG.RSGFunction.IsPopCapRSG(new SenBuffer(inFile), true);


        #endregion
    }
}