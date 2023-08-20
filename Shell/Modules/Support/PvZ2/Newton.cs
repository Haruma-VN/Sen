using Esprima.Ast;
using Newtonsoft.Json;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RSB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                    1 => "composite",
                    2 => "simple",
                    _ => throw new Exception($"Unknown type {group_type}")
                };
                var res = data.readUInt32LE();
                group.res = res != 0 ? $"{res}" : null;
                var subgroups_count = data.readUInt32LE();
                var resources_count = data.readUInt32LE();
                if (!(data.readUInt8() == 1))
                {
                    throw new Exception("Unknown version");
                }
                var group_has_parent = data.readUInt8();
                group.id = ReadString(data);
                if (group_has_parent != 0)
                {
                    group.parent = ReadString(data);
                }
                if(group_type == 1)
                {
                    if(!(resources_count == 0))
                    {
                        throw new Exception("Unknown resource count");
                    }
                    group.subgroups = new List<SubgroupWrapper>();
                    for (var subgroups_index = 0; subgroups_index < subgroups_count; ++subgroups_index)
                    {
                        var subgroup = new SubgroupWrapper() {
                            id = "",
                            res = "",
                        };
                        var sub_res = data.readUInt32LE();
                        subgroup.res = sub_res != 0 ? $"{sub_res}" : null;
                        subgroup.id = ReadString(data);
                        group.subgroups.Add(subgroup);
                    }
                }
                if(group_type == 2)
                {
                    if (!(subgroups_count == 0))
                    {
                        throw new Exception();
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
                            case 1:
                                {
                                    resource_x.type = "Image";
                                    break;
                                }
                            case 2:
                                {
                                    resource_x.type = "PopAnim";
                                    break;
                                }
                            case 3:
                                {
                                    resource_x.type = "SoundBank";
                                    break;
                                }
                            case 4:
                                {
                                    resource_x.type = "File";
                                    break;
                                }
                            case 5:
                                {
                                    resource_x.type = "PrimeFont";
                                    break;
                                }
                            case 6:
                                {
                                    resource_x.type = "RenderEffect";
                                    break;
                                }
                            case 7:
                                {
                                    resource_x.type = "DecodedSoundBank";
                                    break;
                                }
                            default:
                                {
                                    throw new Exception($"Unknown {resource_type} at {group.id}");
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
                        resource_x.slot = m_wrapper.slot;
                            resource_x.width = m_wrapper.width != 0 ? m_wrapper.width : null;
                            resource_x.height = m_wrapper.height != 0 ? m_wrapper.height : null;
                            resource_x.x = m_wrapper.x != 2147483647 ? m_wrapper.x : null; 
                            resource_x.y = m_wrapper.y != 2147483647 ? m_wrapper.y : null;
                            resource_x.ax = m_wrapper.ax != 0 ? m_wrapper.ax : null;
                            resource_x.ay = m_wrapper.ay != 0 ? m_wrapper.ay : null;
                            resource_x.aw = m_wrapper.aw != 0 ? m_wrapper.aw : null;
                            resource_x.ah = m_wrapper.ah != 0 ? m_wrapper.ah : null;
                            resource_x.cols = m_wrapper.cols != 1 ? m_wrapper.cols : null;
                            resource_x.rows = m_wrapper.rows != 1 ? m_wrapper.rows : null; 
                            resource_x.atlas = m_wrapper.atlas ? true : null;
                            data.readUInt8();
                            data.readUInt8();
                            var resource_has_parent = data.readUInt8();
                            resource_x.id = ReadString(data);
                            resource_x.path = ReadString(data);
                            if (resource_has_parent != 0) {
                                resource_x.parent = ReadString(data);
                            }
                            group.resources.Add(resource_x);
                    }
                }
                resource.groups.Add(group);
            }
            return resource;
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
