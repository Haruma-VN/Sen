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
                str += Convert.ToChar(data.readUInt8());
            }
            return str;
        }

        public static MResourceGroup DecodeNewton(SenBuffer data)
        {
            var resource = new MResourceGroup() { groups = new List<ShellSubgroupData>(), slot_count = 0 };
            resource.slot_count = data.readUInt32LE();
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
                group.res = $"{data.readUInt8()}";
                var subgroups_count = data.readUInt32LE();
                var resources_count = data.readUInt32LE();
                var group_has_parent = data.readUInt8();
                group.id = ReadString(data);
                if (group_has_parent != 0)
                {
                    group.parent = ReadString(data);
                }
                if(group_type == 1)
                {
                    group.subgroups = new List<SubgroupWrapper>();
                    for (var subgroups_index = 0; subgroups_index < subgroups_count; ++subgroups_index)
                    {
                        var subgroup = new SubgroupWrapper() {
                            id = "",
                            res = "",
                        };
                        subgroup.res = $"{data.readUInt32LE()}";
                        subgroup.id = ReadString(data);
                        group.subgroups.Add(subgroup);
                    }
                }
                if(group_type == 2)
                {
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
                                    throw new Exception("Unknown");
                                }
                            }
                            resource_x.slot = data.readUInt32LE();
                            resource_x.width = data.readUInt32LE();
                            resource_x.height = data.readUInt32LE();
                            resource_x.x = (int)data.readUInt32LE(); 
                            resource_x.y = (int)data.readUInt32LE();
                            resource_x.ax = data.readUInt32LE();
                            resource_x.ay = data.readUInt32LE();
                            resource_x.aw = data.readUInt32LE();
                            resource_x.ah = data.readUInt32LE();
                            resource_x.cols = (int)data.readUInt32LE();
                            resource_x.rows = (int)data.readUInt32LE(); 
                            resource_x.atlas = data.readUInt8() != 0; 
                            var resource_has_parent = data.readUInt8();
                            resource_x.id = ReadString(data);
                            resource_x.path = ReadString(data);
                            if (resource_has_parent != 0) {
                                resource_x.parent = ReadString(data);
                            }
                    }
                }
                resource.groups.Add(group);
            }
            return resource;
        }
    }
}
