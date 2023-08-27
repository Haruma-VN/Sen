using Sen.Modules.Support;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule.Buffer;

#pragma warning disable CS8602

namespace Sen.Shell.Modules.Support.PvZ2
{
    public class Newton
    {
        private static string ReadString(SenBuffer data)
        {
            var length = data.readUInt32LE();
            var str = "";
            for(var i = 0; i < length; i++)
            {
                str += data.readString(1);
            }
            return str;
        }

        public enum ResourceType
        {
            Image = 1,
            PopAnim,
            SoundBank,
            File,
            PrimeFont,
            RenderEffect,
            DecodedSoundBank,
        }

        public static MResourceGroup DecodeNewton(SenBuffer data)
        {
            var resource = new MResourceGroup() {
                groups = new List<ShellSubgroupData>(), 
                slot_count = data.readUInt32LE(),
            };
            var groups_count = data.readUInt32LE();
            for (var groups_index = 0; groups_index < groups_count; ++groups_index)
            {
                var group = new ShellSubgroupData() { 
                    id = "",
                    type="",
                };
                var group_type = data.readUInt8();
                group.type = group_type switch
                {
                    0x01 => "composite",
                    0x02 => "simple",
                    _ => throw new Exception($"{Localization.GetString("unknown_group_type")}: {group_type}")
                };
                var res = data.readUInt32LE();
                group.res = res != 0x00 ? $"{res}" : null;
                var subgroups_count = data.readUInt32LE();
                var resources_count = data.readUInt32LE();
                var version = data.readUInt8();
                if (!(version == 0x01))
                {
                    throw new Exception($"{Localization.GetString("unknown_version_number")}");
                }
                var group_has_parent = data.readUInt8();
                group.id = ReadString(data);
                if (group_has_parent != 0x00)
                {
                    group.parent = ReadString(data);
                }
                if(group_type == 0x01)
                {
                    if(!(resources_count == 0x00))
                    {
                        throw new Exception($"{Localization.GetString("unknown_resource_count")}");
                    }
                    group.subgroups = new List<SubgroupWrapper>();
                    for (var subgroups_index = 0; subgroups_index < subgroups_count; ++subgroups_index)
                    {
                        var subgroup = new SubgroupWrapper() {
                            id = "",
                            res = "",
                        };
                        var sub_res = data.readUInt32LE();
                        subgroup.res = sub_res != 0x00 ? $"{sub_res}" : null;
                        subgroup.id = ReadString(data);
                        group.subgroups.Add(subgroup);
                    }
                }
                if(group_type == 0x02)
                {
                    if (!(subgroups_count == 0x00))
                    {
                        throw new Exception($"{Localization.GetString("subgroup_count_cannot_be_zero")}");
                    }
                    group.resources = new List<MSubgroupWrapper>();
                    for (var resources_index = 0; resources_index < resources_count; ++resources_index)
                    {
                        var resource_x = new MSubgroupWrapper() { 
                            slot=0,
                            id="",
                        };
                        var resource_type = data.readUInt8();
                        switch (resource_type)
                        {
                            case (byte)ResourceType.Image:
                                {
                                    resource_x.type = "Image";
                                    break;
                                }
                            case (byte)ResourceType.PopAnim:
                                {
                                    resource_x.type = "PopAnim";
                                    break;
                                }
                            case (byte)ResourceType.SoundBank:
                                {
                                    resource_x.type = "SoundBank";
                                    break;
                                }
                            case (byte)ResourceType.File:
                                {
                                    resource_x.type = "File";
                                    break;
                                }
                            case (byte)ResourceType.PrimeFont:
                                {
                                    resource_x.type = "PrimeFont";
                                    break;
                                }
                            case (byte)ResourceType.RenderEffect:
                                {
                                    resource_x.type = "RenderEffect";
                                    break;
                                }
                            case (byte)ResourceType.DecodedSoundBank:
                                {
                                    resource_x.type = "DecodedSoundBank";
                                    break;
                                }
                            default:
                                {
                                    throw new Exception($"{Localization.GetString("unknown")} {resource_type} {Localization.GetString("at")} {group.id}");
                                }
                            }
                        var m_wrapper = new MData
                        {
                            slot = data.readUInt32LE(),
                            width = data.readUInt32LE(),
                            height = data.readUInt32LE(),
                            x = data.readInt32LE(),
                            y = data.readInt32LE(),
                            ax = data.readUInt32LE(),
                            ay = data.readUInt32LE(),
                            aw = data.readUInt32LE(),
                            ah = data.readUInt32LE(),
                            cols = data.readUInt32LE(),
                            rows = data.readUInt32LE(),
                            atlas = data.readUInt8() != 0
                        };
                            var is_sprite = m_wrapper.aw != 0 && m_wrapper.ah != 0;
                            resource_x.slot = m_wrapper.slot!;
                            resource_x.width = m_wrapper.width != 0 ? m_wrapper.width : null;
                            resource_x.height = m_wrapper.height != 0 ? m_wrapper.height : null;
                            resource_x.x = m_wrapper.x != 2147483647 && m_wrapper.x != 0 ? m_wrapper.x : null; 
                            resource_x.y = m_wrapper.y != 2147483647 && m_wrapper.y != 0 ? m_wrapper.y : null;
                            resource_x.ax = is_sprite ? m_wrapper.ax : null;
                            resource_x.ay = is_sprite ? m_wrapper.ay : null;
                            resource_x.aw = m_wrapper.aw != 0 ? m_wrapper.aw : null;
                            resource_x.ah = m_wrapper.ah != 0 ? m_wrapper.ah : null;
                            resource_x.cols = m_wrapper.cols != 1 ? m_wrapper.cols : null;
                            resource_x.rows = m_wrapper.rows != 1 ? m_wrapper.rows : null; 
                            data.readUInt8();
                            data.readUInt8();
                            var resource_has_parent = data.readUInt8();
                            resource_x.id = ReadString(data);
                            resource_x.path = ReadString(data);
                            if (resource_has_parent != 0x00) {
                                resource_x.parent = ReadString(data);
                            }
                            switch (resource_type)
                            {
                                case (byte)ResourceType.PopAnim:
                                    {
                                        resource_x.forceOriginalVectorSymbolSize = true;
                                        break;
                                    }
                                case (byte)ResourceType.RenderEffect:
                                    {
                                        resource_x.srcpath = $"res\\common\\{resource_x.path}";
                                        break;
                                    }
                                default:
                                    {
                                        if (m_wrapper.atlas)
                                        {
                                            resource_x.atlas = true;
                                            resource_x.runtime = true;
                                        }
                                        else
                                        {
                                            resource_x.atlas = null;
                                            resource_x.runtime = null;
                                        }
                                        break;
                                    }
                            }
                        group.resources.Add(resource_x);
                    }
                }
                resource.groups.Add(group);
            }
            return resource;
        }

        public static SenBuffer EncodeNewton(MResourceGroup resource)
        {
            var newton = new SenBuffer();
            newton.writeUInt32LE(resource.slot_count);
            var groups_count = resource.groups.Count;
            newton.writeUInt32LE((uint)groups_count);
            for(var group_index = 0; group_index < groups_count; ++group_index)
            {
                var m_data = resource.groups[group_index];
                newton.writeUInt8(m_data.type switch
                {
                    "composite" => 0x01,
                    "simple" => 0x02,
                    _ => throw new Exception($"{Localization.GetString("unknown_group_type")}: {m_data.type}"),
                });
                var subgroups_count = m_data.subgroups is null ? 0x00 : (uint)m_data.subgroups.Count;
                var resources_count = m_data.resources is null ? 0x00 : (uint)m_data.resources.Count;
                newton.writeUInt32LE(Convert.ToUInt32(m_data.res is null ? "0" : m_data.res));
                newton.writeUInt32LE(subgroups_count);
                newton.writeUInt32LE(resources_count);
                newton.writeUInt8(0x01);
                if (m_data.parent is not null)
                {
                    newton.writeUInt8(0x01);
                }
                else
                {
                    newton.writeUInt8(0x00);
                }
                    newton.writeUInt32LE((uint)m_data.id.Length);
                newton.writeString(m_data.id);
                if (m_data.parent is not null)
                {
                    newton.writeUInt32LE((uint)m_data.parent.Length);
                    newton.writeString(m_data.parent);
                }
                if(m_data.type == "composite")
                {
                    for(var i = 0; i < subgroups_count; ++i)
                    {
                        var current = m_data!.subgroups[i]!;
                        if(current.res is not null)
                        {
                            newton.writeUInt32LE(UInt32.Parse(current.res));
                        }
                        else
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        newton.writeUInt32LE((uint)current.id.Length);
                        newton.writeString(current.id);
                    }
                }
                if(m_data.type == "simple")
                {
                    for (var resources_index = 0; resources_index < resources_count; ++resources_index) 
                    {
                        var resources_x = m_data.resources![resources_index]!;
                        newton.writeUInt8(resources_x.type switch
                        {
                            "Image" => 0x01,
                            "PopAnim" => 0x02,
                            "SoundBank" => 0x03,
                            "File" => 0x04,
                            "PrimeFont" => 0x05,
                            "RenderEffect" => 0x06,
                            "DecodedSoundBank" => 0x07,
                            _ => throw new Exception($"{Localization.GetString("unknown_file_type")}: {resources_x.type}"),
                        });
                        newton.writeUInt32LE(resources_x.slot);
                        if(resources_x.width is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.width);
                        }
                        if (resources_x.height is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.height);
                        }
                        if (resources_x.x is null)
                        {
                            if (resources_x.aw != 0 && resources_x.ah != 0)
                            {
                                newton.writeInt32LE(0x00);
                            }
                            else
                            {
                                newton.writeInt32LE(0x7FFFFFFF);
                            }
                        }
                        else
                        {
                            newton.writeInt32LE((int)resources_x!.x);
                        }
                        if (resources_x.y is null)
                        {
                            if (resources_x.aw is not null && resources_x.aw != 0 && resources_x.ah is not null && resources_x.ah != 0)
                            {
                                newton.writeInt32LE(0x00);
                            }
                            else
                            {
                                newton.writeInt32LE(0x7FFFFFFF);
                            }
                        }
                        else
                        {
                            newton.writeInt32LE((int)resources_x!.y);
                        }
                        if (resources_x.ax is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.ax);
                        }
                        if (resources_x.ay is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.ay);
                        }
                        if (resources_x.aw is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.aw);
                        }
                        if (resources_x.ah is null)
                        {
                            newton.writeUInt32LE(0x00);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.ah);
                        }
                        if (resources_x.cols is null)
                        {
                            newton.writeUInt32LE(0x01);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.cols);
                        }
                        if (resources_x.rows is null)
                        {
                            newton.writeUInt32LE(0x01);
                        }
                        else
                        {
                            newton.writeUInt32LE((uint)resources_x.rows);
                        }
                        if (resources_x.atlas is not null && (bool)resources_x.atlas!)
                        {
                            newton.writeUInt8(0x01);
                        }
                        else
                        {
                            newton.writeUInt8(0x00);
                        }
                        newton.writeUInt8(0x01);
                        newton.writeUInt8(0x01);
                        var resource_has_parent = resources_x.parent is not null;
                        if (resource_has_parent)
                        {
                            newton.writeUInt8(0x01);
                        }
                        else
                        {
                            newton.writeUInt8(0x00);
                        }
                        newton.writeUInt32LE((uint)resources_x.id.Length);
                        newton.writeString(resources_x.id);
                        var path = resources_x.path.ToString()!;
                        newton.writeUInt32LE((uint)path.Length);
                        newton.writeString(path);
                        if (resource_has_parent)
                        {
                            newton.writeUInt32LE((uint)resources_x!.parent!.Length);
                            newton.writeString(resources_x.parent!);
                        }
                    }
                }
            }
            return newton;
        }

        public struct MData
        {
            public uint slot;
            public uint width;
            public uint height;
            public uint ax;
            public uint ay;
            public uint ah;
            public uint aw;
            public uint cols;
            public uint rows;
            public bool atlas;
            public int x;
            public int y;
        }
    }
}
