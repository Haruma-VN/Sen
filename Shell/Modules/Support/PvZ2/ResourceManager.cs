using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace Sen.Shell.Modules.Support.PvZ2
{
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

                var resource = new MSubgroupWrapper()
                {
                    slot = 0,
                    id = key,
                    path = use_array ? value["path"]! : string.Join('\\', value["path"]!),
                    type = (string)value["type"]!,
                    atlas = true,
                    runtime = true,
                    width = (uint)value["dimension"]!["width"]!,
                    height = (uint)value["dimension"]!["height"]!,
                };
                composite_k.resources.Add(resource);

                foreach (var subProperty in ((JObject)value["data"]!).Properties())
                {
                    string subKey = subProperty.Name;
                    JObject subValue = (JObject)subProperty.Value;

                    var subResource = new MSubgroupWrapper()
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
                        x = (int)subValue["default"]!["x"]! != 0 ? (int)subValue["default"]!["x"]! : null,
                        y = (int)subValue["default"]!["y"]! != 0 ? (int)subValue["default"]!["y"]! : null,
                        cols = (uint?)(subValue["default"]!["cols"]),
                        rows = (uint?)(subValue["default"]!["rows"]),
                    };
                    composite_k.resources.Add(subResource);
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
                var group = res_info.groups[composite_name];
                if (group.is_composite)
                {
                    resourceGroup.groups.Add(GenerateComposite(composite_name, group));
                    foreach (var subgroup_name in group.subgroup.Keys)
                    {
                        var subgroup = group.subgroup[subgroup_name];
                        if (subgroup.type is not null)
                        {
                            resourceGroup.groups.Add(GenerateImageInfo(new ExtraInformation()
                            {
                                id = subgroup_name,
                                parent = composite_name,
                            }, subgroup, use_array));
                        }
                        else
                        {
                            resourceGroup.groups.Add(GenerateFileInfo(new ExtraInformation()
                            {
                                id = subgroup_name,
                                parent = composite_name,
                            }, subgroup, use_array));
                        }
                    }
                }
                else
                {
                    foreach (var subgroup_name in group.subgroup.Keys)
                    {
                        resourceGroup.groups.Add(GenerateFileInfo(new ExtraInformation()
                        {
                            id = subgroup_name,
                            parent = null,
                        }, group.subgroup[subgroup_name], use_array));
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
            foreach (var e in resourceGroup.groups)
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
                    res_info.groups.Add(e.id, new GroupDictionary()
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
                    res_info.groups.Add(e.id, new GroupDictionary()
                    {
                        is_composite = false,
                        subgroup = subgroup,
                    });
                }
            }
            return res_info;
        }


        private unsafe static MResourceGroup RewriteSlot(MResourceGroup resoureGroup)
        {
            var map = new Dictionary<string, uint>();
            foreach(var e in resoureGroup.groups)
            {
                if(e.resources is not null)
                {
                    foreach(var resource in e.resources)
                    {
                        if(map.TryGetValue(resource.id, out var slot))
                        {
                            resource.slot = slot;
                        }
                        else
                        {
                            slot = resoureGroup.slot_count;
                            ++resoureGroup.slot_count;
                            resource.slot = slot;
                            map.Add(resource.id, slot);
                        }
                    }
                }
            }
            return resoureGroup;
        }

    }


    #endregion
}
