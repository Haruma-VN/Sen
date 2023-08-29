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

    }

    #endregion

    #region Resources Writing

    [JsonSerializable(typeof(ResourceGroup))]

    public unsafe class ResourceGroup
    {

        public readonly uint? version = 1;

        public readonly uint content_version = 1;

        public required uint slot_count;

        public required SubgroupData[] groups;
    }

    [JsonSerializable(typeof(MResourceGroup))]
    public unsafe class MResourceGroup
    {

        public readonly uint? version = 1;

        public readonly uint content_version = 1;

        public required uint slot_count;

        public required List<ShellSubgroupData> groups;
    }

    [JsonSerializable(typeof(ShellSubgroupData))]

    public unsafe class ShellSubgroupData
    {
        public required string type;

        public required string id;

        public string? res;

        public string? parent;

        public List<SubgroupWrapper>? subgroups;

        public List<MSubgroupWrapper>? resources;

    }

    [JsonSerializable(typeof(SubgroupData))]

    public unsafe class SubgroupData
    {
        public required string id;

        public required string type;

        public string? parent;

        public string? res;

        public SubgroupWrapper[]? subgroups;

        public MSubgroupWrapper[]? resources;

    }

    [JsonSerializable(typeof(SubgroupWrapper))]

    public unsafe class SubgroupWrapper
    {

        public required string id;

        public string? res;
    }


#pragma warning disable CS8618

    [JsonSerializable(typeof(MSubgroupWrapper))]

    public unsafe class MSubgroupWrapper
    {
        public string type;

        public required uint slot;

        public required string id;

        public object path;

        public bool? atlas;

        public bool? runtime;

        public int? x;

        public int? y;

        public uint? cols;

        public uint? rows;

        public string? parent;

        public uint? ax;

        public uint? ay;

        public uint? aw;

        public uint? ah;

        public uint? width;

        public uint? height;

        public bool? forceOriginalVectorSymbolSize;

        public object? srcpath;


    }

    [JsonSerializable(typeof(ResInfo))]

    public unsafe class ResInfo
    {

        public required string expand_path;

        public required Dictionary<string, GroupDictionary> groups;
    }

    [JsonSerializable(typeof(GroupDictionary))]

    public unsafe class GroupDictionary
    {

        public required bool is_composite;

        public required Dictionary<string, MSubgroupData> subgroup;

    }

    [JsonSerializable(typeof(MSubgroupData))]

    public unsafe class MSubgroupData
    {

        public required string? type;

        public required object packet;
    }

    [JsonSerializable(typeof(AtlasWrapper))]

    public unsafe class AtlasWrapper
    {
        public required string type;

        public required object path;

        public required Dimension dimension;

        public required object data;
    }

    [JsonSerializable(typeof(Dimension))]

    public unsafe class Dimension
    {

        public required uint width;

        public required uint height;
    }

    [JsonSerializable(typeof(SpriteData))]

    public unsafe class SpriteData
    {
        public required string type;

        public required object path;

        public required DefaultProperty @default;
    }

    [JsonSerializable(typeof(DefaultProperty))]

    public unsafe class DefaultProperty
    {
        public required uint ax;

        public required uint ay;

        public required uint aw;

        public required uint ah;

        public required int? x;

        public required int? y;

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]

        public required uint? cols;

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]

        public required uint? rows;
    }

    public enum ExpandPath
    {
        String,
        Array,
    }

    public unsafe class GBase
    {
    }

    [JsonSerializable(typeof(CommonWrapper))]

    public unsafe class CommonWrapper
    {

        public required string? type;

        public required Dictionary<string, CommonDataWrapper> data;
    }

    [JsonSerializable(typeof(CommonDataWrapper))]

    public unsafe class CommonDataWrapper
    {
        public required string type;

        public required object path;


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]

        public bool? forceOriginalVectorSymbolSize;

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]

        public object? srcpath;
    }


    public unsafe static class PvZ2ResourceConversion
    {

        private static MSubgroupData ConvertAtlasSubgroupData(SubgroupData subgroup, ExpandPath version)
        {
            var entry = new MSubgroupData()
            {
                type = subgroup.res,
                packet = new Dictionary<string, AtlasWrapper>()
            };
            var version_k = version == ExpandPath.Array;
            var resources = subgroup!.resources!.ToList();
            var childrenByParentId = new Dictionary<string, List<MSubgroupWrapper>>();
            foreach (var resource in resources)
            {
                if (resource.parent is not null)
                {
                    if (!childrenByParentId.TryGetValue(resource.parent, out List<MSubgroupWrapper>? value))
                    {
                        value = new List<MSubgroupWrapper>();
                        childrenByParentId[resource.parent] = value;
                    }

                    value.Add(resource);
                }
            }

            resources.Where((e) => e.atlas is not null && (bool)e.atlas).ToList().ForEach((e) =>
            {
                if ((bool)e.atlas!)
                {
                    var k_current_id = e.id;
                    var atlas = new AtlasWrapper()
                    {
                        type = e.type,
                        path = version_k ? e.path : (e.path as string)!.Split('\\'),
                        dimension = new Dimension()
                        {
                            height = (uint)e!.height!,
                            width = (uint)e!.width!,
                        },
                        data = new Dictionary<string, SpriteData>(),
                    };
                    if (childrenByParentId.TryGetValue(k_current_id, out List<MSubgroupWrapper>? value))
                    {
                        foreach (var k in value)
                        {
                            (atlas.data as Dictionary<string, SpriteData>)!.Add(k.id, new SpriteData()
                            {
                                type = k.type,
                                path = version_k ? k.path : (k.path as string)!.Split('\\'),
                                @default = new DefaultProperty()
                                {
                                    ax = (uint)k!.ax!,
                                    ay = (uint)k!.ay!,
                                    ah = (uint)k!.ah!,
                                    aw = (uint)k!.aw!,
                                    x = (k.x ??= 0),
                                    y = (k.y ??= 0),
                                    cols = (k.cols ??= null),
                                    rows = (k.rows ??= null),
                                }
                            });
                        }
                    }
                    (entry.packet as Dictionary<string, AtlasWrapper>)!.Add(k_current_id, atlas);
                }
            });
            return entry;
        }


        private static MSubgroupData ConvertCommonSubgroupData(SubgroupData subgroup, ExpandPath version)
        {
            var entry = new MSubgroupData()
            {
                type = null,
                packet = new CommonWrapper()
                {
                    type = "File",
                    data = new Dictionary<string, CommonDataWrapper>(),
                }
            };
            var version_k = version == ExpandPath.Array;
            foreach (var e in subgroup!.resources!)
            {
                object? src_path = e.srcpath is not null ? version_k ? e.srcpath : (e.srcpath as string)!.Split('\\') : null;
                ((entry.packet as CommonWrapper)!.data as Dictionary<string, CommonDataWrapper>)!.Add(e.id, new CommonDataWrapper()
                {
                    type = e.type,
                    path = version_k ? e.path : (e.path as string)!.Split('\\'),
                    forceOriginalVectorSymbolSize = e.forceOriginalVectorSymbolSize ??= null,
                    srcpath = src_path,
                });
            }
            return entry;
        }

        private static ShellSubgroupData GenerateComposite(string id, GroupDictionary composite)
        {
            var composite_k = new ShellSubgroupData()
            {
                id = id,
                type = "composite",
                subgroups = new List<SubgroupWrapper>()
            };
            composite.subgroup.Keys.ToList().ForEach((k) =>
            {
                composite_k.subgroups.Add(new SubgroupWrapper()
                {
                    id = k,
                    res = composite.subgroup[k].type,
                });
            });
            return composite_k;
        }

        private struct ExtraInformation
        {

            public required string id;

            public required string? parent;

        }

        private static ShellSubgroupData GenerateImageInfo(ExtraInformation k_data, MSubgroupData image_info, bool use_array)
        {
            var composite_k = new ShellSubgroupData()
            {
                id = k_data.id,
                parent = k_data.parent,
                res = image_info.type,
                type = "simple",
                resources = new List<MSubgroupWrapper>(),
            };

            var list = (JObject)(image_info.packet as dynamic);
            foreach (var property in list.Properties())
            {
                string key = property.Name;
                JObject value = (JObject)property.Value;

                composite_k.resources.Add(new MSubgroupWrapper()
                {
                    slot = 0,
                    id = key,
                    path = use_array ? value["path"]! : string.Join('\\', value["path"]!),
                    type = (string)value["type"]!,
                    atlas = true,
                    runtime = true,
                    width = (uint)value["dimension"]!["width"]!,
                    height = (uint)value["dimension"]!["height"]!,
                });

                foreach (var subProperty in ((JObject)value["data"]!).Properties())
                {
                    string subKey = subProperty.Name;
                    JObject subValue = (JObject)subProperty.Value;

                    composite_k.resources.Add(new MSubgroupWrapper()
                    {
                        slot = 0,
                        id = subKey,
                        path = use_array ? subValue["path"]! : string.Join('\\', subValue["path"]!),
                        type = (string)subValue["type"]!,
                        parent = key,
                        ax = (uint)subValue["default"]!["ax"]!,
                        ay = (uint)subValue["default"]!["ay"]!,
                        aw = (uint)subValue["default"]!["aw"]!,
                        ah = (uint)subValue["default"]!["ah"]!,
                        x = (int)subValue["default"]!["x"]!,
                        y = (int)subValue["default"]!["y"]!,
                        cols = (uint?)(subValue["default"]!["cols"] ??= null),
                        rows = (uint?)(subValue["default"]!["rows"] ??= null),
                    });
                }
            }

            return composite_k;
        }


        private static ShellSubgroupData GenerateFileInfo(ExtraInformation k_data, MSubgroupData image_info, bool use_array)
        {
            var composite_k = new ShellSubgroupData()
            {
                id = k_data.id,
                parent = k_data.parent,
                type = "simple",
                resources = new List<MSubgroupWrapper>(),
            };

            var list = (JObject)(image_info.packet as dynamic).data;
            foreach (var property in list.Properties())
            {
                string key = property.Name;
                JObject value = (JObject)property.Value;

                composite_k.resources.Add(new MSubgroupWrapper()
                {
                    slot = 0,
                    id = key,
                    path = use_array ? value["path"]! : string.Join('\\', value["path"]!),
                    type = (string)value["type"]!,
                    srcpath = value["srcpath"] is not null ? use_array ? value["srcpath"]! : string.Join('\\', value["srcpath"]!) : null,
                    forceOriginalVectorSymbolSize = (bool?)(value["forceOriginalVectorSymbolSize"] ??= null),
                });
            }

            return composite_k;
        }


        public static MResourceGroup ConvertResInfoToResourceGroup(ResInfo res_info)
        {
            var resourceGroup = new MResourceGroup()
            {
                slot_count = 0,
                groups = new List<ShellSubgroupData>()
            };
            var use_array = res_info.expand_path == "array";
            foreach (var composite_name in res_info.groups.Keys)
            {
                if (res_info.groups[composite_name].is_composite)
                {
                    resourceGroup.groups.Add(GenerateComposite(composite_name, res_info.groups[composite_name]));
                    foreach (var subgroup_name in res_info.groups[composite_name].subgroup.Keys)
                    {
                        if (res_info.groups[composite_name].subgroup[subgroup_name].type is not null)
                        {
                            resourceGroup.groups.Add(GenerateImageInfo(new ExtraInformation()
                            {
                                id = subgroup_name,
                                parent = composite_name,
                            }, res_info.groups[composite_name].subgroup[subgroup_name], use_array));
                        }
                        else
                        {
                            resourceGroup.groups.Add(GenerateFileInfo(new ExtraInformation()
                            {
                                id = subgroup_name,
                                parent = composite_name,
                            }, res_info.groups[composite_name].subgroup[subgroup_name], use_array));
                        }
                    }
                }
                else
                {
                    foreach (var subgroup_name in res_info.groups[composite_name].subgroup.Keys)
                    {
                        resourceGroup.groups.Add(GenerateFileInfo(new ExtraInformation()
                        {
                            id = subgroup_name,
                            parent = null,
                        }, res_info.groups[composite_name].subgroup[subgroup_name], use_array));
                    }
                }
            }
            RewriteSlot(resourceGroup);
            return resourceGroup;
        }



        public static ResInfo ConvertResourceGroupToResInfo(ResourceGroup resourceGroup, ExpandPath version)
        {
            var res_info = new ResInfo()
            {
                expand_path = version == ExpandPath.String ? "string" : "array",
                groups = new Dictionary<string, GroupDictionary>()
            };
            resourceGroup.groups.ToList().ForEach((e) =>
            {
                if (e.subgroups is not null)
                {
                    var subgroup = new Dictionary<string, MSubgroupData>();
                    foreach (var k in e.subgroups)
                    {
                        if (k.res is not null)
                        {
                            subgroup.Add(k.id, ConvertAtlasSubgroupData(resourceGroup.groups.First((m) => m.id == k.id), version));
                        }
                        else
                        {
                            subgroup.Add(k.id, ConvertCommonSubgroupData(resourceGroup.groups.First((m) => m.id == k.id), version));
                        }
                    }
                    (res_info.groups as Dictionary<string, GroupDictionary>).Add(e.id, new GroupDictionary()
                    {
                        is_composite = true,
                        subgroup = subgroup,
                    });
                }
                if (e.parent is null && e.resources is not null)
                {
                    var subgroup = new Dictionary<string, MSubgroupData>
                    {
                        { e.id, ConvertCommonSubgroupData(e, version) }
                    };
                    (res_info.groups as Dictionary<string, GroupDictionary>).Add(e.id, new GroupDictionary()
                    {
                        is_composite = false,
                        subgroup = subgroup,
                    });
                }
            });
            return res_info;
        }

        private unsafe static MResourceGroup RewriteSlot(MResourceGroup resoureGroup)
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
            return resoureGroup;
        }
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

        public unsafe void ConvertResInfoToResourceGroup(string outFile, string inFile)
        {
            var fs = new FileSystem();
            var resourceGroup = PvZ2ResourceConversion.ConvertResInfoToResourceGroup(JsonConvert.DeserializeObject<ResInfo>(fs.ReadText(inFile, EncodingType.UTF8))!);
            var path = new ImplementPath();
            var settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
            };
            fs.WriteText(path.Resolve(outFile), RSBFunction.JsonPrettify(JsonConvert.SerializeObject(resourceGroup, settings)), EncodingType.UTF8);
            return;
        }

        public unsafe void ConvertResourceGroupToResInfo(ResourceGroup ResourceGroup, ExpandPath version, string outFile)
        {
            var res_info = PvZ2ResourceConversion.ConvertResourceGroupToResInfo(ResourceGroup, version);
            var path = new ImplementPath();
            var fs = new FileSystem();
            fs.WriteText(path.Resolve(outFile), RSBFunction.JsonPrettify(JsonConvert.SerializeObject(res_info)), EncodingType.UTF8);
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
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = Decode(RtonFile, DecryptRTON);
            JsonFile.OutFile(outFile);
            return;
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
            var PacketInfo = Unpack(RsgFile, outFolder, useResDirectory);
            return PacketInfo;
        }

        public unsafe sealed override void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory = true)
        {
            var RSGFile = Pack(inFolder, packet_info, useResDirectory);
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
            zlib_data.OutFile(outFile);
            return;
        }

        public unsafe sealed override void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var uncompresszlib_data = zlib.ZlibUncompress(ripefile, use64bitvariant);
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

        public override string SerializeJson(object json, char? indent, bool? allow_null)
        {
            return RSBFunction.JsonPrettify(JsonConvert.SerializeObject(json, Formatting.Indented, 
                new JsonSerializerSettings { 
                    NullValueHandling = allow_null is not null && (bool)allow_null ? NullValueHandling.Include : NullValueHandling.Ignore
                }), indent ?? '\t');
        }


        #endregion
    }
}