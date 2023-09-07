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
using static Sen.Shell.Modules.Support.PvZ2.RSG.RSGFunction;
using Newtonsoft.Json;
using static Sen.Shell.Modules.Support.PvZ2Thread;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Linq;
using Sen.Shell.Modules.Support.PvZ2.Helper;
using Sen.Shell.Modules.Support.PvZ2.RenderEffect;
using Sen.Shell.Modules.Support.PvZ2;
using Sen.Shell.Modules.Support.PVZ.Reanim;
using Jint.Runtime;
using Sen.Shell.Modules.Support.PVZ.Particles;
using Jint;
using Jint.Native;
using Sen.Shell.Modules.Standards.Bitmap;
using Sen.Shell.Modules.Support.Download;
using Sen.Shell.Modules.Support.TextureEncode.RSB;
using System.IO;
using Sen.Shell.Modules.Support.PvZ.CharacterFontWidget2;
using Sen.Shell.Modules.Support.PvZ.PAK;
using ResInfo = Sen.Shell.Modules.Support.PvZ2.ResInfo;
using SixLabors.ImageSharp.PixelFormats;
using Sen.Shell.Modules.Internal;

namespace Sen.Shell.Modules.Support
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

    #region Lotus Module Abstract

    public abstract class PvZ2ShellAbstract
    {
        public abstract void ConvertResInfoToResourceGroup(string outFile, string inFile);
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

        public abstract ManifestInfo RSBUnpack(string inRSBpath, string outFolder);

        public abstract void RSBPack(string RSBDirectory, string outRSB, ManifestInfo ManifestInfo);

        public abstract ManifestInfo RSBUnpackByLooseConstraints(string RSBin, string outRSBdirectory, RSBFunction.Version version);

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

        public abstract void RewriteSlot(ResourceGroup resoureGroup, string outfile);

        public abstract void RSGPackAsync(params RSGPackTemplate[] kn);

        public abstract void RSGUnpackAsync(params RSGUnpackTemplate[] kn);

        public abstract void PopcapRenderEffectDecode(string inFile, string outFile);

        public abstract void PopcapRenderEffectEncode(string inFile, string outFile);

        public abstract void DecodeNewtonResource(string inFile, string outFile);

        public abstract void EncodeNewtonResource(string inFile, string outFile);

        public abstract void GZipCompress(string inFile, string outFile);

        public abstract void GZipUncompress(string inFile, string outFile);

        public abstract void DeflateCompress(string inFile, string outFile);

        public abstract void DeflateUncompress(string inFile, string outFile);

        public abstract void Bzip2Compress(string inFile, string outFile);

        public abstract void Bzip2Uncompress(string inFile, string outFile);

        public abstract void LzmaCompress(string inFile, string outFile);

        public abstract void LzmaUncompress(string inFile, string outFile);

        public abstract void CryptDataEncrypt(string inFile, string outFile, string key);

        public abstract void CryptDataDecrypt(string inFile, string outFile, string key);

        public abstract Reanim ReanimToReanimJson(string inFile);

        public abstract void ReanimFromReanimJson(Reanim reanim, ReanimVersion version, string outFile);

        public abstract void ReanimJsonToFlashXfl(Reanim reanim, string outFolder);

        public abstract Reanim ReaimJsonFromFlashXfl(string inFolder);

        public abstract void ReanimToFlashXfl(string inFile, string outFolder);

        public abstract void ReanimFromFlashXfl(string inFolder, string outFile, ReanimVersion version);

        public abstract string SerializeJson(object json, char? indent, bool? handle_null);

        public abstract void DecodeCompiledText(string inFile, string outFile, string encryptionKey, bool use64bitVariant);

        public abstract void EncodeCompiledText(string inFile, string outFile, string encryptionKey, bool use64bitVariant);

        public abstract void ReanimToXML(Reanim reanim, string outFile);

        public abstract Reanim ReanimFromXML(string inFile);

        public abstract Particles ParticlesToJson(string inFile);

        public abstract void ParticlesFromJson(Particles particles, ParticlesVersion version, string outFile);

        public abstract void ParticlesToXML(string inFile, string outFile);

        public abstract Particles ParticlesFromXML(string inFile);

        public abstract void DecodeCFW2(string inFile, string outFile);

        public abstract void EncodeCFW2(string inFile, string outFile);

        public abstract void UnpackPackage(string inFile, string outDirectory);

        public abstract void PackPackage(string inDirectory, string outFile);

        public abstract ExtraInfo CreatePamFlashEmpty(FlashRequest package_n);
    }

    #endregion


    #region Asynchronous Task

    public class PvZ2Thread
    {


        public class RSGPackTemplate
        {
            public required string inFolder;

            public required string outFile;

            public readonly bool useResDirectory = false;

            public required PacketInfo packet;
        };

        public class RSGUnpackTemplate
        {
            public required string inFile;

            public required string outFolder;

            public readonly bool useResDirectory = false;

        };


        public static async Task RSGPackAsync(params RSGPackTemplate[] kn)
        {
            var shell = new LotusModule();
            var tasks = new List<Task>();
            foreach (var ki in kn)
            {
                tasks.Add(Task.Run(() => { shell.RSGPack(ki.inFolder, ki.outFile, ki.packet, ki.useResDirectory); }));
            }
            await Task.WhenAll(tasks);
            return;
        }

        public static async Task RSGUnpackAsync(params RSGUnpackTemplate[] kn)
        {
            var RSGFunction = new PVZ2RSG();
            var tasks = new List<Task>();
            foreach (var ki in kn)
            {
                tasks.Add(Task.Run(() =>
                {
                    using var stream = File.OpenRead(ki.inFile);
                    _ = RSGFunction.DecodeAsync(stream, ki.outFolder, tasks, false, ki.useResDirectory);
                }));
            }
            await Task.WhenAll(tasks);
            return;
        }



    }


    #endregion


    #region Functions

    public unsafe sealed class LotusModule : PvZ2ShellAbstract
    {

        public unsafe override void DecodeCFW2(string inFile, string outFile)
        {
            var decode_data = CharacterFontWidget2_Function.Decode(new SenBuffer(inFile));
            var fs = new FileSystem();
            var path = new ImplementPath();
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            fs.OutFile<string>(path.Resolve(outFile),
                RSBFunction.JsonPrettify(JsonConvert.SerializeObject(decode_data, settings)));
            return;
        }

        public unsafe override void EncodeCFW2(string inFile, string outFile)
        {
            var fs = new FileSystem();
            var encode_data = CharacterFontWidget2_Function.Encode(JsonConvert.DeserializeObject<CharacterFontWidget2>(fs.ReadText(inFile,
                EncodingType.UTF8))!);
            encode_data.OutFile(outFile);
            return;
        }

        public override unsafe void UnpackPackage(string inFile, string outDirectory)
        {
            var path = new ImplementPath();
            var fs = new FileSystem();
            var outBundle = path.Resolve(path.Join(outDirectory, "bundle"));
            var pak_info = PAK_Function.Unpack(new SenBuffer(inFile), outBundle);
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            fs.OutFile<string>(path.Resolve(path.Join(outDirectory, "info.json")),
                RSBFunction.JsonPrettify(JsonConvert.SerializeObject(pak_info, settings)));
            return;
        }

        public override unsafe void PackPackage(string inDirectory, string outFile)
        {
            var path = new ImplementPath();
            var m_bundle = path.Join(inDirectory, "bundle");
            var info_file = path.Join(inDirectory, "info.json");
            PAK_Function.Pack(JsonConvert.DeserializeObject<PAK_Info>(File.ReadAllText(info_file))!, m_bundle, outFile);
            return;
        }


        public override unsafe void ConvertResInfoToResourceGroup(string outFile, string inFile)
        {
            var fs = new FileSystem();
            var resourceGroup = PvZ2ResourceConversion.ConvertResInfoToResourceGroup(JsonConvert.DeserializeObject<ResInfo>(fs.ReadText(inFile, EncodingType.UTF8))!);
            var path = new ImplementPath();
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            fs.OutFile<string>(path.Resolve(outFile),
                RSBFunction.JsonPrettify(JsonConvert.SerializeObject(resourceGroup, settings)));
            return;
        }

        public unsafe void ConvertResourceGroupToResInfo(ResourceGroup ResourceGroup, ExpandPath version, string outFile)
        {
            var res_info = PvZ2ResourceConversion.ConvertResourceGroupToResInfo(ResourceGroup, version);
            var path = new ImplementPath();
            var fs = new FileSystem();
            fs.OutFile<string>(path.Resolve(outFile),
                RSBFunction.JsonPrettify(JsonConvert.SerializeObject(res_info)));
            return;
        }

        public unsafe sealed override void RSGPackAsync(params RSGPackTemplate[] kn)
        {
            var task = PvZ2Thread.RSGPackAsync(kn);
            task.Wait();
            return;
        }

        public unsafe sealed override void RSGUnpackAsync(params RSGUnpackTemplate[] kn)
        {
            var task = PvZ2Thread.RSGUnpackAsync(kn);
            task.Wait();
            return;
        }

        public unsafe sealed override void RewriteSlot(ResourceGroup resoureGroup, string outfile)
        {
            var composite_list = resoureGroup.groups.Where(e => e.subgroups is not null).ToList();
            composite_list.ForEach(g_composite =>
            {
                var slot_id = new Dictionary<string, MSubgroupWrapper>();
                foreach (var e in g_composite.subgroups!)
                {
                    var resource = resoureGroup.groups.First(resource => resource.id == e.id)!.resources!;
                    foreach (var resx in resource)
                    {
                        if (!slot_id.TryGetValue(resx.id, out var id_possibly_null))
                        {
                            resx.slot = resoureGroup.slot_count;
                            resoureGroup.slot_count++;
                            slot_id.Add(resx.id, new MSubgroupWrapper()
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
            {
                var RtonFile = new SenBuffer(inFile);
                var JsonFile = Decode(RtonFile, DecryptRTON);
                JsonFile.OutFile(outFile);
                return;
            }

            //public void ThrowError(Exception e)
            //{
            //    var engine = new Engine();
            //    var ns = new JsObject(engine);
            //    var dictionary = new Dictionary<string, object>
            //        {
            //            { "Console", new SystemImplement() },
            //        };
            //    ns.Set("Shell", JsValue.FromObject(engine, dictionary));
            //    engine.SetValue("Sen", ns);
            //    engine.Evaluate($"throw new Error({SerializeJson(e.StackTrace, '\t', true)})");
            //    return;
        }

        public unsafe sealed override void RTONEncode(string inFile, string outFile, RTONCipher EncryptRTON)
        {
            var fs = new FileSystem();
            var JsonFile = fs.ReadBytes(inFile);
            var RtonFile = Encode(JsonFile, EncryptRTON);
            RtonFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override PAMInfo PAMtoPAMJSON(string inFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile, inFile);
            return PAMJson;
        }

        public unsafe sealed override void PAMJSONtoPAM(string PAMJson, string outFile)
        {
            var fs = new FileSystem();
            var PAMFile = PAM_Binary.Encode(fs.ReadJson<PAMInfo>(PAMJson), PAMJson);
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
            var PamInfo = PAM_Binary.Decode(PAMFile, inFile);
            var extraInfo = PAM_Animation.Decode(PamInfo, outFolder, resolution);
            return extraInfo;
        }

        public unsafe sealed override void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            var PAMFile = PAM_Binary.Encode(PAMJson, inFolder);
            PAMFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override PacketInfo RSGUnpack(string inFile, string outFolder, bool useResDirectory = true)
        {
            var RsgFile = new SenBuffer(inFile);
            var PacketInfo = Unpack(RsgFile, outFolder, useResDirectory);
            return PacketInfo;
        }

        public unsafe sealed override void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory = true)
        {
            var RSGFile = Pack(inFolder, packet_info, useResDirectory);
            RSGFile.OutFile(outFile);
            return;
        }

        public unsafe sealed override ManifestInfo RSBUnpack(string inRSBpath, string outFolder)
        {
            var buffer = new SenBuffer(inRSBpath);
            return RSBFunction.Unpack(buffer, outFolder);
        }

        public unsafe sealed override void RSBPack(string RSBDirectory, string outRSB, ManifestInfo ManifestInfo)
        {
            RSBFunction.Pack(RSBDirectory, outRSB, ManifestInfo);
            return;
        }

        public unsafe sealed override ManifestInfo RSBUnpackByLooseConstraints(string RSBin, string outRSBdirectory, RSBFunction.Version version)
        {
            var buffer = new SenBuffer(RSBin);
            var manifest = RSBFunction.UnpackByLooseConstraints(buffer, outRSBdirectory, version);
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
            zlib_data.OutFile(outFile);
            return;
        }

        public unsafe sealed override void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var uncompresszlib_data = zlib.ZlibUncompress(new SenBuffer(ripefile), use64bitvariant);
            var fs = new FileSystem();
            fs.OutFile(outFile, uncompresszlib_data);
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
            var compression = new Standards.Compress();
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

        public unsafe override sealed void GZipCompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.CompressGZip(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void GZipUncompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.UncompressGZip(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void DeflateCompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.CompressDeflate(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void DeflateUncompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.UncompressDeflate(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void Bzip2Compress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.CompressBzip2(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void Bzip2Uncompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.UncompressBzip2(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void LzmaCompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.CompressLzma(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }

        public unsafe override sealed void LzmaUncompress(string inFile, string outFile)
        {
            var buffer = new SenBuffer(inFile);
            var compression = new Standards.Compress();
            byte[] file = compression.UncompressLzma(buffer.toBytes());
            var wr = new SenBuffer(file);
            wr.OutFile(outFile);
            return;
        }


        public unsafe override sealed void VCDiffEncode(string OldFile, string NewFile, string PatchOutFile, bool interleaved)
        {

            var before = File.ReadAllBytes(OldFile);
            var after = File.ReadAllBytes(NewFile);
            var vcdiff = new Internal.VCDiff();
            var encode = vcdiff.Encode(before, after);
            File.WriteAllBytes(PatchOutFile, encode);
            return;
        }

        public unsafe override sealed void VCDiffDecode(string OldFile, string PatchFile, string NewFile)
        {
            var before = File.ReadAllBytes(OldFile);
            var after = File.ReadAllBytes(PatchFile);
            var vcdiff = new Internal.VCDiff();
            var decode = vcdiff.Decode(before, after);
            File.WriteAllBytes(NewFile, decode);
            return;
        }

        public unsafe override sealed RSGAbnormal IsPopCapRSG(string inFile) => PvZ2.RSG.RSGFunction.IsPopCapRSG(new SenBuffer(inFile), true);

        public unsafe override sealed void PopcapRenderEffectDecode(string inFile, string outFile)
        {
            PopcapRenderEffect.Decode(new SenBuffer(inFile), outFile);
            return;
        }

        public unsafe override sealed void PopcapRenderEffectEncode(string inFile, string outFile)
        {
            var text = File.ReadAllText(inFile);
            var POPFXObject = JsonConvert.DeserializeObject<PopcapRenderEffect.PopcapRenderEffectObject>(text)!;
            PopcapRenderEffect.Encode(POPFXObject, outFile);
            return;
        }

        public override void DecodeNewtonResource(string inFile, string outFile)
        {
            var resource = Newton.DecodeNewton(new SenBuffer(inFile));
            var fs = new FileSystem();
            var path = new ImplementPath();
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            fs.WriteText(path.Resolve(outFile), RSBFunction.JsonPrettify(JsonConvert.SerializeObject(resource, settings)),
                EncodingType.UTF8);
            return;
        }

        public override void EncodeNewtonResource(string inFile, string outFile)
        {
            var fs = new FileSystem();
            var newton = Newton.EncodeNewton(
                JsonConvert.DeserializeObject<MResourceGroup>(fs.ReadText(inFile, EncodingType.UTF8))!
                );
            newton.OutFile(outFile);
            return;
        }

        public override void CryptDataEncrypt(string inFile, string outFile, string key)
        {
            var sen = Shell.Modules.Support.PvZ.CryptData.Encrypt(inFile, key);
            sen.OutFile(outFile);
            return;
        }

        public override void CryptDataDecrypt(string inFile, string outFile, string key)
        {
            var sen = Shell.Modules.Support.PvZ.CryptData.Decrypt(inFile, key);
            sen.OutFile(outFile);
            return;
        }

        public override Reanim ReanimToReanimJson(string inFile)
        {
            var reanim = Reanim_Function.ParseReanim(inFile);
            return reanim;
        }

        public override void ReanimFromReanimJson(Reanim reanim, ReanimVersion version, string outFile)
        {
            var sen = Reanim_Function.WriteReanim(reanim, version);
            sen.OutFile(outFile);
            return;
        }

        public override void ReanimJsonToFlashXfl(Reanim reanim, string outFolder)
        {
            Reanim_Aniamtion.Encode(reanim, outFolder);
            return;
        }

        public override Reanim ReaimJsonFromFlashXfl(string inFolder)
        {
            var reanim = Reanim_Aniamtion.Decode(inFolder);
            return reanim;
        }

        public override void ReanimToFlashXfl(string inFile, string outFolder)
        {
            var reanim = Reanim_Function.ParseReanim(inFile);
            Reanim_Aniamtion.Encode(reanim, outFolder);
            return;
        }

        public override void ReanimFromFlashXfl(string inFolder, string outFile, ReanimVersion version)
        {
            var reanim = Reanim_Aniamtion.Decode(inFolder);
            var sen = Reanim_Function.WriteReanim(reanim, version);
            sen.OutFile(outFile);
            return;
        }

        public override void ReanimToXML(Reanim reanim, string outFile)
        {
            Reanim_RawXML.Encode(reanim, outFile);
            return;
        }

        public override Reanim ReanimFromXML(string inFile)
        {
            var reanim = Reanim_RawXML.Decode(inFile);
            return reanim;
        }

        public override Particles ParticlesToJson(string inFile)
        {
            var particles = Particles_Function.ParseParticles(inFile);
            return particles;
        }

        public override void ParticlesFromJson(Particles particles, ParticlesVersion version, string outFile)
        {
            var sen = Particles_Function.WriteParticles(particles, version);
            sen.OutFile(outFile);
            return;
        }

        public override void ParticlesToXML(string inFile, string outFile)
        {
            var particles = JsonConvert.DeserializeObject<Particles>(File.ReadAllText(inFile))!;
            Particles_RawXml.Encode(particles, outFile);
            return;
        }

        public override Particles ParticlesFromXML(string inFile)
        {
            var particles = Particles_RawXml.Decode(inFile);
            return particles;
        }

        public override string SerializeJson(object json, char? indent, bool? allow_null)
        {
            return RSBFunction.JsonPrettify(JsonConvert.SerializeObject(json, Formatting.Indented,
                new JsonSerializerSettings
                {
                    NullValueHandling = allow_null is not null && (bool)allow_null ? NullValueHandling.Include : NullValueHandling.Ignore
                }), indent ?? '\t');
        }

        public override void DecodeCompiledText(string inFile, string outFile, string encryptionKey, bool use64bitVariant)
        {
            var rijndael = new SenBuffer(bytes: Org.BouncyCastle.Utilities.Encoders.Base64.Decode(new SenBuffer(inFile).toBytes())!);
            var compiled = Decrypt(rijndael, encryptionKey);
            var zlib = new PopCapZlib();
            var string_x = new SenBuffer(zlib.ZlibUncompress(compiled, use64bitVariant));
            string_x.OutFile(outFile);
            return;
        }

        public override void EncodeCompiledText(string inFile, string outFile, string encryptionKey, bool use64bitVariant)
        {
            var zlib = new PopCapZlib();
            var byte_x = zlib.ZlibCompress(new SenBuffer(inFile), use64bitVariant, ZlibCompressionLevel.BEST_COMPRESSION);
            var rijndael = Encrypt(byte_x, encryptionKey);
            var compiled = new SenBuffer(bytes: Org.BouncyCastle.Utilities.Encoders.Base64.Encode(rijndael.toBytes())!);
            compiled.OutFile(outFile);
            return;
        }

        public override ExtraInfo CreatePamFlashEmpty(FlashRequest package_n) {
            var extra_info = AnimationHelper.CreatePamFlashEmpty(package_n);
            return extra_info;
        }

        public unsafe void EncodeETC1(string inFile, string outFile)
        {
            var senFile = new SenBuffer(inFile);
            var image = senFile.getImage();
            var width = image.Width;
            var height = image.Height;
            var image_block = new uint[16];
            var data = new ulong[width * height];
            fixed (ulong* data_ptr = data)
            {
                for (var block_y = 0; block_y < height / 4; block_y++)
                {
                    for (var block_x = 0; block_x < width / 4; block_x++)
                    {
                        for (var pixel_y = 0; pixel_y < 4; pixel_y++)
                        {
                            for (var pixel_x = 0; pixel_x < 4; pixel_x++)
                            {
                                var pixel = image[block_y * 4 + pixel_y, block_x * 4 + pixel_x];
                                image_block[(pixel_y * 4 + pixel_x) * 4 + 0] = pixel.B;
                                image_block[(pixel_y * 4 + pixel_x) * 4 + 1] = pixel.G;
                                image_block[(pixel_y * 4 + pixel_x) * 4 + 2] = pixel.R;
                                image_block[(pixel_y * 4 + pixel_x) * 4 + 3] = 255;
                            }
                        }
                    }
                    LotusAPI.EncodeETC1Fast(image_block, data_ptr, 1, (uint)width);
                }
            }
            byte[] outputBytes = new byte[data.Length * sizeof(ulong)];
            Buffer.BlockCopy(data, 0, outputBytes, 0, outputBytes.Length);
            var SenWriter = new SenBuffer(outputBytes);
            SenWriter.OutFile(outFile);
            return;
        }

        #endregion
    }
}