using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Support.PvZ2.RSG;

namespace Sen.Shell.Modules.Support.PvZ2.RSB
{
    public class MainfestInfo
    {
        public int version { get; set; }

        public required RSBPathInfo path { get; set; }

        public required GroupInfo[] group { get; set; }
    }

    public class RSBPathInfo
    {
        public required string[] rsgs { get; set; }
        public required string packet_path { get; set; }
    }

    public class GroupInfo
    {
        public required string name { get; set; }
        public required bool is_composite { get; set; }
        public required SubGroupInfo[] subgroup { get; set; }
    }

    public class SubGroupInfo
    {
        public required string name_packet { get; set; }
        public int? category { get; set; }
        public required PacketInfo packet_info { get; set; }

    }

    public class RSB_head
    {
        public static readonly string magic = "1bsr";
        public int version { get; set; }
        public int fileOffset { get; set; }
        public int fileListLength { get; set; }
        public int fileList_BeginOffset { get; set; }
        public int rsgListLength { get; set; }
        public int rsgList_BeginOffset { get; set; }
        public int rsgNumber { get; set; }
        public int rsgInfo_BeginOffset { get; set; }
        public int rsgInfo_EachLength { get; set; }
        public int compositeNumber { get; set; }
        public int compostieInfo_BeginOffset { get; set; }
        public int compositeInfo_EachLength { get; set; }
        public int compositeListLength { get; set; }
        public int compositeList_BeginOffset { get; set; }
        public int autopoolNumber { get; set; }
        public int autopoolInfo_BeginOffset { get; set; }
        public int autopoolInfo_EachLength { get; set; }
        public int ptxNumber { get; set; }
        public int ptxInfo_BeginOffset { get; set; }
        public int ptxInfo_EachLength { get; set; }
        public int part1_BeginOffset { get; set; }
        public int part2_BeginOffset { get; set; }
        public int part3_BeginOffset { get; set; }
    }

    public class FileListInfo
    {
        public required string namePath { get; set; }
        public required int poolIndex { get; set; }
    }

    public class CompositeInfo
    {
        public required string name { get; set; }
        public required bool isComposite { get; set; }
        public required int packetNumber { get; set; }
        public CompositePacketInfo[]? packetInfo { get; set; }
    }

    public class CompositePacketInfo
    {
        public required int packetIndex { get; set; }
        public required int category { get; set; }
    }

    public class RSGInfo
    {
        public required string name { get; set; }
        public required int rsgOffset { get; set; }
        public required int rsgLength { get; set; }
        public required int poolIndex { get; set; }
        public required int ptxBeforeNumber { get; set; }
    }

    public class AutoPoolInfo
    {
        public required string name { get; set; }
        public required int part0_Size { get; set; }
        public required int part1_Size { get; set; }
    }

    public class PtxInfo
    {
        public required int ptxIndex { get; set; }
        public required int width { get; set; }
        public required int height { get; set; }
        public required int width_plus { get; set; }
        public required int format { get; set; }
    }

    public class ResourcesDescription
    {
        public required DescriptionGroup[] groups { get; set; }
    }

    public class DescriptionGroup
    {
        public required string id { get; set; }
        public required bool composite { get; set; }
        public required DescriptionSubGroup[] subgroups { get; set; }
    }

    public class DescriptionSubGroup
    {
        public required string id { get; set; }
        public required string res { get; set; }
        public required DescriptionResources[] resources { get; set; }
    }

    public class DescriptionResources
    {
        public required int type { get; set; }
        public required string id { get; set; }
        public required string path { get; set; }
        public PropertiesPtxInfo? ptx_info { get; set; }
        public required Dictionary<string, string>[] properties { get; set; }
    }

    public class PropertiesPtxInfo
    {
        public required string imagetype { get; set; }
        public required string aflags { get; set; }
        public required string x { get; set; }
        public required string y { get; set; }
        public required string ax { get; set; }
        public required string ay { get; set; }
        public required string aw { get; set; }
        public required string ah { get; set; }
        public required string rows { get; set; }
        public required string cols { get; set; }
        public required string parent { get; set; }
    }

    public class CompositeResoucesDescriptionInfo
    {
        public required string id { get; set; }
        public required int rsgNumber { get; set; }
        public required ResourcesRsgInfo[] rsgInfoList { get; set; }
    }

    public class ResourcesRsgInfo
    {
        public required int resolutionRatio { get; set; }
        public required string language { get; set; }
        public required string id { get; set; }
        public required int resourcesNumber { get; set; }
        public required ResourcesInfo[] resourcesInfoList { get; set; }
    }

    public class ResourcesInfo
    {
        public int infoOffsetPart2 { get; set; }
        public int propertiesNumber { get; set; }
        public string? id { get; set; }
        public string? path { get; set; }
        public ResourcesPtxInfo? ptxInfo { get; set; }
        public ResourcesPropertiesInfo[]? propertiesInfoList { get; set; }

    }

    public class ResourcesPtxInfo
    {
        public ushort imagetype { get; set; }
        public ushort aflags { get; set; }
        public ushort x { get; set; }
        public ushort y { get; set; }
        public ushort ax { get; set; }
        public ushort ay { get; set; }
        public ushort aw { get; set; }
        public ushort ah { get; set; }
        public ushort rows { get; set; }
        public ushort cols { get; set; }
        public string? parent { get; set; }
    }

    public class ResourcesPropertiesInfo
    {
        public required string key { get; set; }
        public required string value { get; set; }
    }

    public class RSBFunction
    {
        public static MainfestInfo Unpack(SenBuffer RSBFile, string outFolder)
        {
            var rsbHeadInfo = ReadHead(RSBFile);
            var fs = new FileSystem();
            var json = new JsonImplement();
            var fileList = new List<FileListInfo>();
            fs.CreateDirectory(outFolder);
            FileListSplit(RSBFile, rsbHeadInfo.fileList_BeginOffset, rsbHeadInfo.fileListLength, ref fileList);
            var rsgList = new List<FileListInfo>();
            FileListSplit(RSBFile, rsbHeadInfo.rsgList_BeginOffset, rsbHeadInfo.rsgListLength, ref rsgList);
            var compositeInfo = new List<CompositeInfo>();
            ReadCompositeInfo(RSBFile, rsbHeadInfo, ref compositeInfo);
            var compositeList = new List<FileListInfo>();
            FileListSplit(RSBFile, rsbHeadInfo.compositeList_BeginOffset, rsbHeadInfo.compositeListLength, ref compositeList);
            var rsgInfoList = new List<RSGInfo>();
            ReadRSGInfo(RSBFile, rsbHeadInfo, ref rsgInfoList);
            var autopoolInfoList = new List<AutoPoolInfo>();
            ReadAutoPool(RSBFile, rsbHeadInfo, ref autopoolInfoList);
            var ptxInfoList = new List<PtxInfo>();
            ReadPTXInfo(RSBFile, rsbHeadInfo, ref ptxInfoList);
            if (rsbHeadInfo.version == 3)
            {
                if (rsbHeadInfo.part1_BeginOffset == 0 && rsbHeadInfo.part2_BeginOffset == 0 && rsbHeadInfo.part3_BeginOffset == 0)
                {
                    throw new Exception("Invalid Resources Version 3 Offset");
                }
                ReadResoucesDescription(RSBFile, rsbHeadInfo, outFolder);
            }
            // Unpack RSG
            var groupList = new List<GroupInfo>();
            var compositeLength = compositeInfo.Count;
            var ptxInfoNum = 0;
            var rsgNameList = new List<string>();
            for (var i = 0; i < compositeLength; i++)
            {
                if (compositeInfo[i].name.ToUpper() != compositeList[i].namePath.Replace("_COMPOSITESHELL", ""))
                {
                    throw new Exception(compositeInfo[i].name);
                }
                var subGroupList = new List<SubGroupInfo>();
                for (var k = 0; k < compositeInfo[i].packetNumber; k++)
                {
                    var packetIndex = compositeInfo[i].packetInfo![k].packetIndex;
                    var rsgInfoCount = 0;
                    var rsgListCount = 0;
                    while (rsgInfoList[rsgInfoCount].poolIndex != packetIndex)
                    {
                        if (rsgInfoCount > rsgInfoList.Count) throw new Exception("Out of ranger 1");
                        rsgInfoCount++;
                    }
                    while (rsgList[rsgListCount].poolIndex != packetIndex)
                    {
                        if (rsgListCount > rsgList.Count) throw new Exception("Out of ranger 2");
                        rsgListCount++;
                    }
                    if (rsgInfoList[rsgInfoCount].name.ToUpper() != rsgList[rsgListCount].namePath.ToUpper())
                    {
                        throw new Exception($"Invalid rsg name: {rsgInfoList[rsgInfoCount].name}");
                    }
                    var resInfoList = new List<ResInfo>();
                    var fileListLength = fileList.Count;
                    var ptxId = 0;
                    for (var h = 0; h < fileListLength; h++)
                    {
                        if (fileList[h].poolIndex == packetIndex)
                        {
                            var resInfo = new ResInfo
                            {
                                path = fileList[h].namePath,
                            };
                            if (fileList[h].namePath.EndsWith(".PTX"))
                            {
                                resInfo.ptx_info = new RSG.PtxInfo
                                {
                                    id = ptxId,
                                    width = ptxInfoList[ptxInfoNum].width,
                                    height = ptxInfoList[ptxInfoNum].height,
                                    format = ptxInfoList[ptxInfoNum].format
                                };
                                ptxInfoNum++;
                                ptxId++;
                            }
                            resInfoList.Add(resInfo);
                        }
                        if (fileList[h].poolIndex > packetIndex) break;
                    };
                    rsgNameList.Add(rsgInfoList[rsgInfoCount].name);
                    byte[] packetFile = RSBFile.getBytes(rsgInfoList[rsgInfoCount].rsgLength, (long)rsgInfoList[rsgInfoCount].rsgOffset);
                    fs.OutFile($"{outFolder}/packet/{rsgInfoList[rsgInfoCount].name}.rsg", packetFile);
                    var packetInfoList = new PacketInfo
                    {
                        version = RSBFile.readInt32LE((long)rsgInfoList[rsgInfoCount].rsgOffset + 4),
                        compression_flags = RSBFile.readInt32LE((long)rsgInfoList[rsgInfoCount].rsgOffset + 16),
                        res = resInfoList.ToArray(),
                    };
                    subGroupList.Add(new SubGroupInfo
                    {
                        name_packet = rsgInfoList[rsgInfoCount].name,
                        category = compositeInfo[i].packetInfo![k].category,
                        packet_info = packetInfoList,
                    });
                }
                groupList.Add(new GroupInfo
                {
                    name = compositeInfo[i].name,
                    is_composite = compositeInfo[i].isComposite,
                    subgroup = subGroupList.ToArray(),
                });
            }
            var mainfest_info = new MainfestInfo
            {
                version = rsbHeadInfo.version,
                path = new RSBPathInfo
                {
                    rsgs = rsgNameList.ToArray(),
                    packet_path = $"{outFolder}\\packet",
                },
                group = groupList.ToArray(),
            };
            return mainfest_info;
        }

        private static void ReadResoucesDescription(SenBuffer RSBFile, RSB_head rsbHeadInfo, string outFolder)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.part1_BeginOffset;
            var part2_Offset = rsbHeadInfo.part2_BeginOffset;
            var part3_Offset = rsbHeadInfo.part3_BeginOffset;
            var compositeResoucesInfo = new List<CompositeResoucesDescriptionInfo>();
            var DescriptionGroup = new List<DescriptionGroup>();
            for (var i = 0; RSBFile.readOffset < (long)part2_Offset; i++)
            {
                var idOffsetPart3 = RSBFile.readInt32LE();
                var id = RSBFile.getStringByEmpty(part3_Offset + idOffsetPart3);
                var rsgNumber = RSBFile.readInt32LE();
                var subgroup = new List<DescriptionSubGroup>();
                if (RSBFile.readInt32LE() != 0x10) throw new Exception($"Invalid RSG number | Offset: {RSBFile.readOffset}");
                var rsgInfoList = new List<ResourcesRsgInfo>();
                for (var k = 0; k < rsgNumber; k++)
                {
                    var resolutionRatio = RSBFile.readInt32LE();
                    var language = RSBFile.readString(4).Replace("\0", "");
                    var rsgIdOffsetPart3 = RSBFile.readInt32LE();
                    var resourcesNumber = RSBFile.readInt32LE();
                    var resourcesInfoList = new List<ResourcesInfo>();
                    for (var l = 0; l < resourcesNumber; l++)
                    {
                        var infoOffsetPart2 = RSBFile.readInt32LE();
                        resourcesInfoList.Add(new ResourcesInfo
                        {
                            infoOffsetPart2 = infoOffsetPart2,
                        });
                    }
                    var rsgId = RSBFile.getStringByEmpty(part3_Offset + idOffsetPart3);
                    subgroup.Add(new DescriptionSubGroup
                    {
                        id = rsgId,
                        res = $"{resolutionRatio}",
                        resources = new DescriptionResources[resourcesNumber],
                    });
                    rsgInfoList.Add(new ResourcesRsgInfo
                    {
                        resolutionRatio = resolutionRatio,
                        language = language,
                        id = rsgId,
                        resourcesNumber = resourcesNumber,
                        resourcesInfoList = resourcesInfoList.ToArray()
                    });
                }
                DescriptionGroup.Add(new DescriptionGroup{
                    id = id,
                    composite = !id.EndsWith("_CompositeShell"),
                    subgroups = subgroup.ToArray(),
                });
                compositeResoucesInfo.Add(new CompositeResoucesDescriptionInfo
                {
                    id = id,
                    rsgNumber = rsgNumber,
                    rsgInfoList = rsgInfoList.ToArray()
                });

                RSBFile.BackupReadOffset();
                var resourcesRsgNumber = compositeResoucesInfo[i].rsgNumber;
                for (var k = 0; k < resourcesRsgNumber; k++)
                {
                    var resourcesNumber = compositeResoucesInfo[i].rsgInfoList[k].resourcesNumber;
                    for (var h = 0; h < resourcesNumber; h++)
                    {
                        RSBFile.readOffset = part2_Offset + compositeResoucesInfo[i].rsgInfoList[k].resourcesInfoList[h].infoOffsetPart2;
                        {
                            if (RSBFile.readInt32LE() != 0x0) throw new Exception("Invalid Part2 Offset");
                            var type = RSBFile.readUInt16LE();
                            if (RSBFile.readUInt16LE() != 0x1C) throw new Exception("Invalid head length");
                            var ptxInfoEndOffsetPart2 = RSBFile.readInt32LE();
                            var ptxInfoBeginOffsetPart2 = RSBFile.readInt32LE();
                            var resIdOffsetPart3 = RSBFile.readInt32LE();
                            var pathOffsetPart3 = RSBFile.readInt32LE();
                            var resId = RSBFile.getStringByEmpty(part3_Offset + resIdOffsetPart3);
                            var resPath = RSBFile.getStringByEmpty(part3_Offset + pathOffsetPart3);
                            var propertiesNumber = RSBFile.readInt32LE();
                            PropertiesPtxInfo? ptxInfoList = null;
                            if (ptxInfoEndOffsetPart2 * ptxInfoBeginOffsetPart2 != 0)
                            {
                                ptxInfoList = new PropertiesPtxInfo
                                {
                                    imagetype = $"{RSBFile.readUInt16LE()}",
                                    aflags = $"{RSBFile.readUInt16LE()}",
                                    x = $"{RSBFile.readUInt16LE()}",
                                    y = $"{RSBFile.readUInt16LE()}",
                                    ax = $"{RSBFile.readUInt16LE()}",
                                    ay = $"{RSBFile.readUInt16LE()}",
                                    aw = $"{RSBFile.readUInt16LE()}",
                                    ah = $"{RSBFile.readUInt16LE()}",
                                    rows = $"{RSBFile.readUInt16LE()}",
                                    cols = $"{RSBFile.readUInt16LE()}",
                                    parent = RSBFile.getStringByEmpty(part3_Offset + RSBFile.readInt32LE()),
                                };
                            }
                            var propertiesInfoList = new Dictionary<string, string>[propertiesNumber];
                            for (var l = 0; l < propertiesNumber; l++)
                            {
                                var keyOffsetPart3 = RSBFile.readInt32LE();
                                if (RSBFile.readInt32LE() != 0x0) throw new Exception("");
                                var valueOffsetPart3 = RSBFile.readInt32LE();
                                var key = RSBFile.getStringByEmpty(part3_Offset + keyOffsetPart3);
                                var value = RSBFile.getStringByEmpty(part3_Offset + valueOffsetPart3);
                                var property = new Dictionary<string, string>();
                                property.Add(key, value);
                                propertiesInfoList[l] = property;
                            }
                            var descriptionResources = new DescriptionResources
                            {
                                id = resId,
                                path = resPath,
                                type = type,
                                ptx_info = ptxInfoList,
                                properties = propertiesInfoList,
                            };
                            DescriptionGroup[i].subgroups[k].resources[h] = descriptionResources;
                        }
                    }
                }
                RSBFile.RestoreReadOffset();
            }
            var fs = new FileSystem();
            fs.WriteJson($"{outFolder}/description.json", DescriptionGroup.ToArray());
        }

        public static RSB_head ReadHead(SenBuffer RSBFile)
        {
            var rsbHeadInfo = new RSB_head();
            var magic = RSBFile.readString(4);
            if (magic != RSB_head.magic) throw new Exception("this file is not RSB");
            var version = RSBFile.readInt32LE();
            if (version != 3 && version != 4) throw new Exception("invalid RSB version");
            rsbHeadInfo.version = version;
            RSBFile.readBytes(4);
            rsbHeadInfo.fileOffset = RSBFile.readInt32LE();
            rsbHeadInfo.fileListLength = RSBFile.readInt32LE();
            rsbHeadInfo.fileList_BeginOffset = RSBFile.readInt32LE();
            RSBFile.readBytes(8);
            rsbHeadInfo.rsgListLength = RSBFile.readInt32LE();
            rsbHeadInfo.rsgList_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.rsgNumber = RSBFile.readInt32LE();
            rsbHeadInfo.rsgInfo_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.rsgInfo_EachLength = RSBFile.readInt32LE();
            rsbHeadInfo.compositeNumber = RSBFile.readInt32LE();
            rsbHeadInfo.compostieInfo_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.compositeInfo_EachLength = RSBFile.readInt32LE();
            rsbHeadInfo.compositeListLength = RSBFile.readInt32LE();
            rsbHeadInfo.compositeList_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.autopoolNumber = RSBFile.readInt32LE();
            rsbHeadInfo.autopoolInfo_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.autopoolInfo_EachLength = RSBFile.readInt32LE();
            rsbHeadInfo.ptxNumber = RSBFile.readInt32LE();
            rsbHeadInfo.ptxInfo_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.ptxInfo_EachLength = RSBFile.readInt32LE();
            rsbHeadInfo.part1_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.part2_BeginOffset = RSBFile.readInt32LE();
            rsbHeadInfo.part3_BeginOffset = RSBFile.readInt32LE();
            if (version == 4)
            {
                rsbHeadInfo.fileOffset = RSBFile.readInt32LE();
            }
            return rsbHeadInfo;
        }
        private static void FileListSplit(SenBuffer RSBFile, int tempOffset, int tempLength, ref List<FileListInfo> fileList)
        {
            RSBFile.readOffset = (long)tempOffset;
            var nameDict = new List<NameDict>();
            string namePath = "";
            int offsetLimit = tempOffset + tempLength;
            while (RSBFile.readOffset < offsetLimit)
            {
                string characterByte = RSBFile.readString(1);
                int offsetByte = RSBFile.readInt24LE() * 4;
                if (characterByte == "\0")
                {
                    if (offsetByte != 0)
                    {
                        nameDict.Add(new NameDict
                        {
                            namePath = namePath,
                            offsetByte = offsetByte,
                        }
                        );
                    }
                    fileList.Add(new FileListInfo
                    {
                        namePath = namePath,
                        poolIndex = RSBFile.readInt32LE(),
                    });
                    for (var i = 0; i < nameDict.Count; i++)
                    {
                        if (nameDict[i].offsetByte + tempOffset == RSBFile.readOffset)
                        {
                            namePath = nameDict[i].namePath;
                            nameDict.RemoveAt(i);
                            break;
                        }
                    }
                }
                else
                {
                    if (offsetByte != 0)
                    {
                        nameDict.Add(new NameDict
                        {
                            namePath = namePath,
                            offsetByte = offsetByte,
                        }
                        );
                        namePath += characterByte;
                    }
                    else
                    {
                        namePath += characterByte;
                    }
                }
            }
            fileList.Sort((a, b) => a.poolIndex.CompareTo(b.poolIndex));
            CheckEndOffset(RSBFile, offsetLimit);
        }

        private static void ReadCompositeInfo(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<CompositeInfo> compositeInfoList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.compostieInfo_BeginOffset;
            for (var i = 0; i < rsbHeadInfo.compositeNumber; i++)
            {
                var startOffset = RSBFile.readOffset;
                var compositeName = RSBFile.readStringByEmpty();
                var packetNumber = RSBFile.readInt32LE(startOffset + rsbHeadInfo.compositeInfo_EachLength - 4);
                RSBFile.BackupReadOffset();
                RSBFile.readOffset = startOffset + 128;
                var packetInfo = new List<CompositePacketInfo>();
                for (var k = 0; k < packetNumber; k++)
                {
                    packetInfo.Add(new CompositePacketInfo
                    {
                        packetIndex = RSBFile.readInt32LE(),
                        category = RSBFile.readInt32LE(),
                    });
                    RSBFile.readBytes(8);
                }
                compositeInfoList.Add(new CompositeInfo
                {
                    name = compositeName.Replace("_CompositeShell", ""),
                    isComposite = !compositeName.EndsWith("_CompositeShell"),
                    packetNumber = packetNumber,
                    packetInfo = packetInfo.ToArray(),
                });
                RSBFile.RestoreReadOffset();
            }
            var endOffset = rsbHeadInfo.compositeInfo_EachLength * rsbHeadInfo.compositeNumber + rsbHeadInfo.compostieInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static void ReadRSGInfo(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<RSGInfo> rsgInfoList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.rsgInfo_BeginOffset;
            for (var i = 0; i < rsbHeadInfo.rsgNumber; i++)
            {
                var startOffset = RSBFile.readOffset;
                var packetName = RSBFile.readStringByEmpty();
                RSBFile.readOffset = startOffset + 128;
                var rsgOffset = RSBFile.readInt32LE();
                var rsgLength = RSBFile.readInt32LE();
                var rsgIndex = RSBFile.readInt32LE();
                var ptxBeforeNumber = RSBFile.readInt32LE(startOffset + rsbHeadInfo.rsgInfo_EachLength - 4);
                rsgInfoList.Add(new RSGInfo
                {
                    name = packetName,
                    rsgOffset = rsgOffset,
                    rsgLength = rsgLength,
                    poolIndex = rsgIndex,
                    ptxBeforeNumber = ptxBeforeNumber,
                });
            }
            var endOffset = rsbHeadInfo.rsgInfo_EachLength * rsbHeadInfo.rsgNumber + rsbHeadInfo.rsgInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static void ReadAutoPool(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<AutoPoolInfo> autopoolList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.autopoolInfo_BeginOffset;
            for (var i = 0; i < rsbHeadInfo.autopoolNumber; i++)
            {
                var startOffset = RSBFile.readOffset;
                var autopoolName = RSBFile.readStringByEmpty();
                RSBFile.readOffset = startOffset + 128;
                autopoolList.Add(new AutoPoolInfo
                {
                    name = autopoolName,
                    part0_Size = RSBFile.readInt32LE(),
                    part1_Size = RSBFile.readInt32LE()
                });
                RSBFile.readOffset = startOffset + rsbHeadInfo.autopoolInfo_EachLength;
            }
            var endOffset = rsbHeadInfo.autopoolInfo_EachLength * rsbHeadInfo.autopoolNumber + rsbHeadInfo.autopoolInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static void ReadPTXInfo(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<PtxInfo> ptxInfoList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.ptxInfo_BeginOffset;
            for (var i = 0; i < rsbHeadInfo.ptxNumber; i++)
            {
                ptxInfoList.Add(new PtxInfo
                {
                    ptxIndex = i,
                    width = RSBFile.readInt32LE(),
                    height = RSBFile.readInt32LE(),
                    width_plus = RSBFile.readInt32LE(),
                    format = RSBFile.readInt32LE()
                });
            }
            var endOffset = rsbHeadInfo.ptxInfo_EachLength * rsbHeadInfo.ptxNumber + rsbHeadInfo.ptxInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static void CheckEndOffset(SenBuffer RSBFile, int endOffset)
        {
            if ((int)RSBFile.readOffset != endOffset) throw new Exception($"invalid offset: {RSBFile.readOffset} | {endOffset}");
        }
    }

}