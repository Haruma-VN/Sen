using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.PvZ2.RSG;

namespace Sen.Shell.Modules.Support.PvZ2.RSB
{
    public class MainfestInfo
    {
        public required int version { get; set; }

        public required int ptx_info_size { get; set; }

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
        public required string[] category { get; set; }
        public required RSBPacketInfo packet_info { get; set; }
    }

    public class RSBPacketInfo
    {
        public int version { get; set; }
        public int compression_flags { get; set; }
        public required RSBResInfo[] res { get; set; }
    }

    public class RSBResInfo
    {
        public required string path { get; set; }
        public PtxInfo? ptx_info { get; set; }
        public PTXProperty? ptx_property { get; set; }
    }

    public class PTXProperty
    {
        public required int format { get; set; }
        public required int pitch { get; set; }
        public int? alpha_size { get; set; }
        public int? alpha_format { get; set; }
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
        public int rsgInfo_EachLength { get; set; } = 204;
        public int compositeNumber { get; set; }
        public int compostieInfo_BeginOffset { get; set; }
        public int compositeInfo_EachLength { get; set; } = 1156;
        public int compositeListLength { get; set; }
        public int compositeList_BeginOffset { get; set; }
        public int autopoolNumber { get; set; }
        public int autopoolInfo_BeginOffset { get; set; }
        public int autopoolInfo_EachLength { get; set; } = 152;
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
        public required string[] category { get; set; }
    }

    public class RSGInfo
    {
        public required string name { get; set; }
        public required int rsgOffset { get; set; }
        public required int rsgLength { get; set; }
        public required int poolIndex { get; set; }
        public required int ptxNumber { get; set; }
        public required int ptxBeforeNumber { get; set; }
        public byte[]? packetHeadInfo { get; set; }
    }

    public class AutoPoolInfo
    {
        public required string name { get; set; }
        public required int part0_Size { get; set; }
        public required int part1_Size { get; set; }
    }

    public class RSBPtxInfo
    {
        public required int ptxIndex { get; set; }
        public required int width { get; set; }
        public required int height { get; set; }
        public required int pitch { get; set; }
        public required int format { get; set; }
        public int? alpha_size { get; set; }
        public int? alpha_format { get; set; }
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
        public required string language { get; set; }
        public required DescriptionResources[] resources { get; set; }
    }

    public class DescriptionResources
    {
        public required int type { get; set; }
        public required string id { get; set; }
        public required string path { get; set; }
        public PropertiesPtxInfo? ptx_info { get; set; }
        public required Dictionary<string, string> properties { get; set; }
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

    public class RSBPathTemp
    {
        public required string pathSlice { get; set; }
        public int key { get; set; }
        public required int poolIndex { get; set; }
        public List<PathPosition> positions = new List<PathPosition>();
    }



    public class RSBFunction
    {

        public static MainfestInfo Unpack(SenBuffer RSBFile, string outFolder)
        {
            var rsbHeadInfo = ReadHead(RSBFile);
            if (rsbHeadInfo.version != 3 && rsbHeadInfo.version != 4) throw new Exception("invalid RSB version");
            if (rsbHeadInfo.version == 3 && rsbHeadInfo.fileList_BeginOffset != 0x6C) throw new Exception("Invalid File List Offset");
            if (rsbHeadInfo.version == 4 && rsbHeadInfo.fileList_BeginOffset != 0x70) throw new Exception("Invalid File List Offset");
            var fileList = new List<FileListInfo>();
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
            var ptxInfoList = new List<RSBPtxInfo>();
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
            var rsgNameList = new List<string>();
            for (var i = 0; i < compositeLength; i++)
            {
                if (compositeInfo[i].name.ToUpper() != compositeList[i].namePath.ToUpper().Replace("_COMPOSITESHELL", ""))
                {
                    throw new Exception($"Invalid composite index: {compositeInfo[i].name}");
                }
                var subGroupList = new List<SubGroupInfo>();
                for (var k = 0; k < compositeInfo[i].packetNumber; k++)
                {
                    var packetIndex = compositeInfo[i].packetInfo![k].packetIndex;
                    var rsgInfoCount = 0;
                    var rsgListCount = 0;
                    while (rsgInfoList[rsgInfoCount].poolIndex != packetIndex)
                    {
                        if (rsgInfoCount >= rsgInfoList.Count - 1) throw new Exception("Out of ranger 1");
                        rsgInfoCount++;
                    }
                    while (rsgList[rsgListCount].poolIndex != packetIndex)
                    {
                        if (rsgListCount >= rsgList.Count - 1) throw new Exception("Out of ranger 2");
                        rsgListCount++;
                    }
                    if (rsgInfoList[rsgInfoCount].name.ToUpper() != rsgList[rsgListCount].namePath.ToUpper())
                    {
                        throw new Exception($"Invalid rsg name: {rsgInfoList[rsgInfoCount].name} || {rsgList[rsgListCount].namePath} in poolIndex: {packetIndex}");
                    };
                    rsgNameList.Add(rsgInfoList[rsgInfoCount].name);
                    byte[] packetFile = RSBFile.getBytes(rsgInfoList[rsgInfoCount].rsgLength, (long)rsgInfoList[rsgInfoCount].rsgOffset);
                    SenBuffer RSGFile = new SenBuffer(packetFile);
                    PacketInfo packetInfo = RSGFunction.Unpack(RSGFile, "", false, true);
                    var resInfoList = new List<RSBResInfo>();
                    var fileListLength = fileList.Count;
                    var ptxBeforeNumber = rsgInfoList[rsgInfoCount].ptxBeforeNumber;
                    for (var h = 0; h < fileListLength; h++)
                    {
                        if (fileList[h].poolIndex == packetIndex)
                        {
                            var resInfo = new RSBResInfo
                            {
                                path = fileList[h].namePath,
                            };
                            var resInfoLength = packetInfo.res.Length;
                            var existItemPacket = false;
                            for (var m = 0; m < resInfoLength; m++)
                            {
                                if (packetInfo.res[m].path.ToUpper() == fileList[h].namePath.ToUpper())
                                {
                                    existItemPacket = true;
                                    if (fileList[h].namePath.EndsWith(".PTX") && compositeInfo[i].isComposite)
                                    {
                                        if (ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].width != packetInfo.res[m].ptx_info!.width)
                                        {
                                            throw new Exception($"Invalid item packet width: {fileList[h].namePath}");
                                        }
                                        if (ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].height != packetInfo.res[m].ptx_info!.height)
                                        {
                                            throw new Exception($"Invalid item packet height: {fileList[h].namePath}");
                                        }
                                        resInfo.ptx_info = new RSG.PtxInfo
                                        {
                                            id = packetInfo.res[m].ptx_info!.id,
                                            width = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].width,
                                            height = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].height,
                                        };
                                        resInfo.ptx_property = new PTXProperty
                                        {
                                            format = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].format,
                                            pitch = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id].pitch,
                                            alpha_size = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id]?.alpha_size,
                                            alpha_format = ptxInfoList[ptxBeforeNumber + packetInfo.res[m].ptx_info!.id]?.alpha_format,
                                        };
                                    }
                                    break;
                                }
                            }
                            if (!existItemPacket) throw new Exception("Invalid Item Packet");
                            resInfoList.Add(resInfo);
                        }
                        if (fileList[h].poolIndex > packetIndex) break;
                    };
                    RSGFile.OutFile($"{outFolder}/packet/{rsgInfoList[rsgInfoCount].name}.rsg");
                    var packetInfoList = new RSBPacketInfo
                    {
                        version = RSBFile.readInt32LE((long)rsgInfoList[rsgInfoCount].rsgOffset + 4),
                        compression_flags = RSBFile.readInt32LE((long)rsgInfoList[rsgInfoCount].rsgOffset + 16),
                        res = resInfoList.ToArray(),
                    };
                    subGroupList.Add(new SubGroupInfo
                    {
                        name_packet = rsgInfoList[rsgInfoCount].name,
                        category = new string[] { compositeInfo[i].packetInfo![k].category[0], compositeInfo[i].packetInfo![k].category[1] },
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
                ptx_info_size = rsbHeadInfo.ptxInfo_EachLength,
                path = new RSBPathInfo
                {
                    rsgs = rsgNameList.ToArray(),
                    packet_path = $"{outFolder}\\packet",
                },
                group = groupList.ToArray(),
            };
            RSBFile.Close();
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
                    var rsgId = RSBFile.getStringByEmpty(part3_Offset + rsgIdOffsetPart3);
                    subgroup.Add(new DescriptionSubGroup
                    {
                        id = rsgId,
                        res = $"{resolutionRatio}",
                        language = language,
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
                DescriptionGroup.Add(new DescriptionGroup
                {
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
                            if (RSBFile.readInt32LE() != 0x0) throw new Exception($"Invalid Part2 Offset: {RSBFile.readOffset}");
                            var type = RSBFile.readUInt16LE();
                            if (RSBFile.readUInt16LE() != 0x1C) throw new Exception($"Invalid head length : {RSBFile.readOffset}");
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
                            var propertiesInfoList = new Dictionary<string, string>();
                            for (var l = 0; l < propertiesNumber; l++)
                            {
                                var keyOffsetPart3 = RSBFile.readInt32LE();
                                if (RSBFile.readInt32LE() != 0x0) throw new Exception("");
                                var valueOffsetPart3 = RSBFile.readInt32LE();
                                var key = RSBFile.getStringByEmpty(part3_Offset + keyOffsetPart3);
                                var value = RSBFile.getStringByEmpty(part3_Offset + valueOffsetPart3);
                                propertiesInfoList.Add(key, value);
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
            };
            var resourcesDescription = new ResourcesDescription
            {
                groups = DescriptionGroup.ToArray()
            };
            var fs = new FileSystem();
            fs.WriteJson($"{outFolder}/description.json", resourcesDescription);
        }

        public static RSB_head ReadHead(SenBuffer RSBFile)
        {
            var rsbHeadInfo = new RSB_head();
            var magic = RSBFile.readString(4);
            if (magic != RSB_head.magic) throw new Exception("this file is not RSB");
            var version = RSBFile.readInt32LE();
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
            if (version == 4 || version == 5)
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
            fileList.Sort(delegate (FileListInfo a, FileListInfo b)
            {
                return a.poolIndex.CompareTo(b.poolIndex);
            });
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
                        category = new string[] { RSBFile.readInt32LE().ToString(), RSBFile.readString(4).Replace("\0", "") },
                    });
                    RSBFile.readBytes(4);
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
                var ptxNumber = RSBFile.readInt32LE(startOffset + rsbHeadInfo.rsgInfo_EachLength - 8);
                var ptxBeforeNumber = RSBFile.readInt32LE();
                rsgInfoList.Add(new RSGInfo
                {
                    name = packetName,
                    rsgOffset = rsgOffset,
                    rsgLength = rsgLength,
                    poolIndex = rsgIndex,
                    ptxNumber = ptxNumber,
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

        private static void ReadPTXInfo(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<RSBPtxInfo> ptxInfoList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.ptxInfo_BeginOffset;
            if (rsbHeadInfo.ptxInfo_EachLength != 0x10 && rsbHeadInfo.ptxInfo_EachLength != 0x14 && rsbHeadInfo.ptxInfo_EachLength != 0x18)
            {
                throw new Exception("Invalid PTX Info EachLength");
            }
            for (var i = 0; i < rsbHeadInfo.ptxNumber; i++)
            {
                var width = RSBFile.readInt32LE();
                var height = RSBFile.readInt32LE();
                var pitch = RSBFile.readInt32LE();
                var format = RSBFile.readInt32LE();
                var ptxInfo = new RSBPtxInfo
                {
                    ptxIndex = i,
                    width = width,
                    height = height,
                    pitch = pitch,
                    format = format,
                };
                if (rsbHeadInfo.ptxInfo_EachLength >= 0x14)
                {
                    ptxInfo.alpha_size = RSBFile.readInt32LE();
                    ptxInfo.alpha_format = rsbHeadInfo.ptxInfo_EachLength == 0x18 ? RSBFile.readInt32LE() : (ptxInfo.alpha_size == 0 ? 0x0 : 0x64);
                }
                else
                {
                    ptxInfo.alpha_size = null;
                    ptxInfo.alpha_format = null;
                }
                ptxInfoList.Add(ptxInfo);
            }
            var endOffset = rsbHeadInfo.ptxInfo_EachLength * rsbHeadInfo.ptxNumber + rsbHeadInfo.ptxInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static void CheckEndOffset(SenBuffer RSBFile, int endOffset)
        {
            if ((int)RSBFile.readOffset != endOffset) throw new Exception($"invalid offset: {RSBFile.readOffset} | {endOffset}");
        }

        public static void Pack(string inFolder, string outFile, MainfestInfo manifestInfo)
        {
            var RSBFile = new SenBuffer();
            RSBFile.writeString(RSB_head.magic);
            var version = manifestInfo.version;
            int fileList_BeginOffset;
            if (version == 3)
            {
                fileList_BeginOffset = 0x6C;
            }
            else if (version == 4)
            {
                fileList_BeginOffset = 0x70;
            }
            else
            {
                throw new Exception("Invalid RSB version");
            }
            var rsbHeadInfo = new RSB_head();
            RSBFile.writeInt32LE(version);
            RSBFile.writeNull(fileList_BeginOffset - 8);
            rsbHeadInfo.ptxInfo_EachLength = manifestInfo.ptx_info_size;
            if (rsbHeadInfo.ptxInfo_EachLength != 0x10 && rsbHeadInfo.ptxInfo_EachLength != 0x14 && rsbHeadInfo.ptxInfo_EachLength != 0x18)
            {
                throw new Exception("Invalid PTX Info EachLength");
            }
            var fileList = new List<FileListInfo>();
            var rsgFileList = new List<FileListInfo>();
            var compositeList = new List<FileListInfo>();
            var compositeInfo = new SenBuffer();
            var rsgInfo = new SenBuffer();
            var autopoolInfo = new SenBuffer();
            var ptxInfo = new SenBuffer();
            var rsgFileBank = new SenBuffer();
            var rsgPacketIndex = 0;
            var groupLength = manifestInfo.group.Length;
            var ptxBeforeNumber = 0;
            for (var i = 0; i < groupLength; i++)
            {
                var compositeName = manifestInfo.group[i].is_composite ? manifestInfo.group[i].name : $"{manifestInfo.group[i].name}_CompositeShell";
                compositeList.Add(new FileListInfo
                {
                    namePath = compositeName.ToUpper(),
                    poolIndex = i,
                });
                compositeInfo.writeString(compositeName);
                compositeInfo.writeNull(128 - compositeName.Length);
                var subgroupLength = manifestInfo.group[i].subgroup.Length;
                for (var k = 0; k < subgroupLength; k++)
                {
                    var rsgName = manifestInfo.group[i].subgroup[k].name_packet;
                    var rsgComposite = false;
                    rsgFileList.Add(new FileListInfo
                    {
                        namePath = rsgName.ToUpper(),
                        poolIndex = rsgPacketIndex,
                    });
                    SenBuffer RSGFile = new SenBuffer($"{inFolder}/packet/{rsgName}.rsg");
                    ComparePacketInfo(manifestInfo.group[i].subgroup[k].packet_info, RSGFile);
                    var ptxNumber = 0;
                    var resInfoLength = manifestInfo.group[i].subgroup[k].packet_info.res.Length;
                    for (var l = 0; l < resInfoLength; l++)
                    {
                        fileList.Add(new FileListInfo
                        {
                            namePath = manifestInfo.group[i].subgroup[k].packet_info.res[l].path.ToUpper(),
                            poolIndex = rsgPacketIndex,
                        });
                        if (manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_info != null)
                        {
                            ptxNumber++;
                            rsgComposite = true;
                            {
                                // Write PtxInfo
                                var id = manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_info!.id;
                                var ptxOffset = (ptxBeforeNumber + id) * rsbHeadInfo.ptxInfo_EachLength;
                                ptxInfo.writeInt32LE(manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_info!.width, ptxOffset);
                                ptxInfo.writeInt32LE(manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_info!.height);
                                int format = manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_property!.format;
                                int pitch = manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_property!.pitch;
                                ptxInfo.writeInt32LE(pitch);
                                ptxInfo.writeInt32LE(format);
                                var alpha_size = manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_property?.alpha_size;
                                var alpha_format = manifestInfo.group[i].subgroup[k].packet_info.res[l].ptx_property?.alpha_format;
                                if (rsbHeadInfo.ptxInfo_EachLength != 0x10)
                                {
                                    ptxInfo.writeInt32LE(alpha_size ?? 0);
                                }
                                if (rsbHeadInfo.ptxInfo_EachLength == 0x18)
                                {
                                    ptxInfo.writeInt32LE(alpha_format ?? 0);
                                }
                            }
                        }
                    }
                    {
                        // Write CompositeInfo
                        compositeInfo.writeInt32LE(rsgPacketIndex);
                        compositeInfo.writeInt32LE(Int32.Parse(manifestInfo.group[i].subgroup[k].category[0]));
                        if (manifestInfo.group[i].subgroup[k].category[1] != null && manifestInfo.group[i].subgroup[k].category[1] != string.Empty)
                        {
                            if (manifestInfo.group[i].subgroup[k].category[1].Length != 4) throw new Exception("Category out of Length");
                            compositeInfo.writeString(manifestInfo.group[i].subgroup[k].category[1]);
                        }
                        else
                        {
                            compositeInfo.writeNull(4);
                        }
                        compositeInfo.writeNull(4);
                    }
                    {
                        // Write RSGInfo
                        rsgInfo.writeString(rsgName);
                        rsgInfo.writeNull(128 - rsgName.Length);
                        rsgInfo.writeInt32LE((int)rsgFileBank.writeOffset);
                        {
                            // WritePacket
                            rsgFileBank.writeBytes(RSGFile.toBytes());
                        }
                        rsgInfo.writeInt32LE((int)RSGFile.length);
                        rsgInfo.writeInt32LE(rsgPacketIndex);
                        rsgInfo.writeBytes(RSGFile.getBytes(56, 0x10));
                        var rsgWriteOffset = rsgInfo.writeOffset;
                        rsgInfo.writeInt32LE(RSGFile.readInt32LE(0x20), rsgWriteOffset - 36);
                        rsgInfo.writeInt32LE(ptxNumber, rsgWriteOffset);
                        rsgInfo.writeInt32LE(ptxBeforeNumber);
                        ptxBeforeNumber += ptxNumber;
                    }
                    {
                        // Write AutopoolInfo
                        var autopoolName = rsgName + "_AutoPool";
                        autopoolInfo.writeString(autopoolName);
                        autopoolInfo.writeNull(128 - autopoolName.Length);
                        if (rsgComposite)
                        {
                            autopoolInfo.writeInt32LE(RSGFile.readInt32LE(0x18));
                            autopoolInfo.writeInt32LE(RSGFile.readInt32LE(0x30));
                        }
                        else
                        {
                            autopoolInfo.writeInt32LE(RSGFile.readInt32LE(0x18) + RSGFile.readInt32LE(0x20));
                            autopoolInfo.writeInt32LE(0);
                        }
                        autopoolInfo.writeInt32LE(1);
                        autopoolInfo.writeNull(12);
                    }
                    rsgPacketIndex++;
                    RSGFile.readOffset = 0;
                }
                compositeInfo.writeNull(1024 - (subgroupLength * 16));
                compositeInfo.writeInt32LE(subgroupLength);
            }
            {
                var fileList_PathTemp = new List<RSBPathTemp>();
                FileListPack(fileList, ref fileList_PathTemp);
                var rsgList_PathTemp = new List<RSBPathTemp>();
                FileListPack(rsgFileList, ref rsgList_PathTemp);
                var compositeList_PathTemp = new List<RSBPathTemp>();
                FileListPack(compositeList, ref compositeList_PathTemp);
                var fileList_PathTemp_Length = fileList_PathTemp.Count;
                rsbHeadInfo.fileList_BeginOffset = fileList_BeginOffset;
                // Filelist
                for (var i = 0; i < fileList_PathTemp_Length; i++)
                {
                    WriteFileList(RSBFile, fileList_PathTemp[i]);
                }
                rsbHeadInfo.fileListLength = (int)RSBFile.writeOffset - fileList_BeginOffset;
                // RSGList
                var rsgList_PathTemp_Length = rsgList_PathTemp.Count;
                rsbHeadInfo.rsgList_BeginOffset = (int)RSBFile.writeOffset;
                for (var i = 0; i < rsgList_PathTemp_Length; i++)
                {
                    WriteFileList(RSBFile, rsgList_PathTemp[i]);
                }
                rsbHeadInfo.rsgListLength = (int)RSBFile.writeOffset - rsbHeadInfo.rsgList_BeginOffset;
                // CompositeInfo 
                rsbHeadInfo.compositeNumber = groupLength;
                rsbHeadInfo.compostieInfo_BeginOffset = (int)RSBFile.writeOffset;
                RSBFile.writeBytes(compositeInfo.toBytes());
                compositeInfo.Close();
                // CompositeList
                var compositeList_PathTemp_Length = compositeList_PathTemp.Count;
                rsbHeadInfo.compositeList_BeginOffset = (int)RSBFile.writeOffset;
                for (var i = 0; i < compositeList_PathTemp_Length; i++)
                {
                    WriteFileList(RSBFile, compositeList_PathTemp[i]);
                }
                rsbHeadInfo.compositeListLength = (int)RSBFile.writeOffset - rsbHeadInfo.compositeList_BeginOffset;
                // RSGInfo  
                rsbHeadInfo.rsgInfo_BeginOffset = (int)RSBFile.writeOffset;
                rsbHeadInfo.rsgNumber = rsgPacketIndex;
                RSBFile.writeBytes(rsgInfo.toBytes());
                rsgInfo.Close();
                // AutopoolInfo
                rsbHeadInfo.autopoolInfo_BeginOffset = (int)RSBFile.writeOffset;
                rsbHeadInfo.autopoolNumber = rsgPacketIndex;
                RSBFile.writeBytes(autopoolInfo.toBytes());
                autopoolInfo.Close();
                // PtxInfo 
                rsbHeadInfo.ptxInfo_BeginOffset = (int)RSBFile.writeOffset;
                rsbHeadInfo.ptxNumber = ptxBeforeNumber;
                RSBFile.writeBytes(ptxInfo.toBytes());
                ptxInfo.Close();
                if (version == 3)
                {
                    // Descripition
                    WriteResourcesDescription(RSBFile, rsbHeadInfo, inFolder);
                }
                RSBFile.writeNull(RSGFunction.BeautifyLength((int)RSBFile.writeOffset));
                // Packet
                var fileOffset = (int)RSBFile.writeOffset;
                rsbHeadInfo.fileOffset = fileOffset;
                RSBFile.writeBytes(rsgFileBank.toBytes());
                rsgFileBank.Close();
                // Rewrite PacketOffset
                RSBFile.readOffset = rsbHeadInfo.rsgInfo_BeginOffset;
                for (var i = 0; i < rsbHeadInfo.rsgNumber; i++)
                {
                    var rsgInfoFileOffset = (rsbHeadInfo.rsgInfo_BeginOffset + i * rsbHeadInfo.rsgInfo_EachLength) + 128;
                    var packetOffset = RSBFile.readInt32LE(rsgInfoFileOffset);
                    RSBFile.writeInt32LE(packetOffset + fileOffset, rsgInfoFileOffset);
                }
                // WriteHead
                rsbHeadInfo.version = version;
                WriteHead(RSBFile, rsbHeadInfo);
            }
            RSBFile.OutFile(outFile);
        }

        private static void WriteResourcesDescription(SenBuffer RSBFile, RSB_head rsbHeadInfo, string inFolder)
        {
            var fs = new FileSystem();
            var resourcesDescription = fs.ReadJson<ResourcesDescription>($"{inFolder}/description.json");
            var groupsLength = resourcesDescription.groups.Length;
            var part1_Res = new SenBuffer();
            var part2_Res = new SenBuffer();
            var part3_Res = new SenBuffer();
            Dictionary<string, int> stringPool = new Dictionary<string, int>();
            int ThrowInPool(string poolKey)
            {
                if (!stringPool.ContainsKey(poolKey))
                {
                    stringPool.Add(poolKey, (int)part3_Res.writeOffset);
                    part3_Res.writeStringByEmpty(poolKey);
                }
                return stringPool[poolKey];
            }
            part3_Res.writeNull(1);
            stringPool.Add("", 0);
            for (var i = 0; i < groupsLength; i++)
            {
                var idOffsetPart3 = ThrowInPool(resourcesDescription.groups[i].id);
                part1_Res.writeInt32LE(idOffsetPart3);
                var rsgNumber = resourcesDescription.groups[i].subgroups.Length;
                part1_Res.writeInt32LE(rsgNumber);
                part1_Res.writeInt32LE(0x10);
                for (var k = 0; k < rsgNumber; k++)
                {
                    part1_Res.writeInt32LE(Int32.Parse(resourcesDescription.groups[i].subgroups[k].res));
                    var language = resourcesDescription.groups[i].subgroups[k].language;
                    if (language == string.Empty)
                    {
                        part1_Res.writeInt32LE(0x0);
                    }
                    else
                    {
                        part1_Res.writeString((language + "    ")[..4]);
                    }
                    var rsgIdOffsetPart3 = ThrowInPool(resourcesDescription.groups[i].subgroups[k].id);
                    part1_Res.writeInt32LE(rsgIdOffsetPart3);
                    var resourcesNumber = resourcesDescription.groups[i].subgroups[k].resources.Length;
                    part1_Res.writeInt32LE(resourcesNumber);
                    for (var l = 0; l < resourcesNumber; l++)
                    {
                        var idOffsetPart2 = (int)part2_Res.writeOffset;
                        part1_Res.writeInt32LE(idOffsetPart2);
                        // Start writePart2
                        {
                            part2_Res.writeInt32LE(0x0);
                            var type = resourcesDescription.groups[i].subgroups[k].resources[l].type;
                            part2_Res.writeUInt16LE((ushort)type);
                            part2_Res.writeUInt16LE(0x1C);
                            part2_Res.BackupWriteOffset();
                            part2_Res.writeOffset += (0x8);
                            idOffsetPart3 = ThrowInPool(resourcesDescription.groups[i].subgroups[k].resources[l].id);
                            var pathOffsetPart3 = ThrowInPool(resourcesDescription.groups[i].subgroups[k].resources[l].path);
                            part2_Res.writeInt32LE(idOffsetPart3);
                            part2_Res.writeInt32LE(pathOffsetPart3);
                            var properties = resourcesDescription.groups[i].subgroups[k].resources[l].properties;
                            var propertiesNumber = properties.Count;
                            part2_Res.writeInt32LE(propertiesNumber);
                            if (type == 0)
                            {
                                var ptxInfoBeginOffsetPart2 = (int)part2_Res.writeOffset;
                                // Write PTXInfo
                                {
                                    var ptx_info = resourcesDescription.groups[i].subgroups[k].resources[l].ptx_info;
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.imagetype ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.aflags ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.x ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.y ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.ax ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.ay ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.aw ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.ah ?? "0"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.rows ?? "1"));
                                    part2_Res.writeUInt16LE(UInt16.Parse(ptx_info?.cols ?? "1"));
                                    var parentOffsetInPart3 = ThrowInPool(ptx_info?.parent ?? string.Empty);
                                    part2_Res.writeInt32LE(parentOffsetInPart3);
                                }
                                var ptxInfoEndOffsetPart2 = (int)part2_Res.writeOffset;
                                part2_Res.RestoreWriteOffset();
                                part2_Res.writeInt32LE(ptxInfoEndOffsetPart2);
                                part2_Res.writeInt32LE(ptxInfoBeginOffsetPart2);
                                part2_Res.writeOffset = ptxInfoEndOffsetPart2;
                            }
                            foreach (KeyValuePair<string, string> property in properties)
                            {
                                var keyOffsetInPart3 = ThrowInPool(property.Key ?? string.Empty);
                                var valueOffsetInPart3 = ThrowInPool(property.Value ?? string.Empty);
                                part2_Res.writeInt32LE(keyOffsetInPart3);
                                part2_Res.writeInt32LE(0x0);
                                part2_Res.writeInt32LE(valueOffsetInPart3);
                            }
                        }
                        //-----------
                    }
                }
            }
            rsbHeadInfo.part1_BeginOffset = (int)RSBFile.writeOffset;
            RSBFile.writeBytes(part1_Res.toBytes());
            part1_Res.Close();
            rsbHeadInfo.part2_BeginOffset = (int)RSBFile.writeOffset;
            RSBFile.writeBytes(part2_Res.toBytes());
            part2_Res.Close();
            rsbHeadInfo.part3_BeginOffset = (int)RSBFile.writeOffset;
            RSBFile.writeBytes(part3_Res.toBytes());
            part3_Res.Close();
        }

        private static void WriteHead(SenBuffer RSBFile, RSB_head rsbHeadInfo)
        {
            RSBFile.writeInt32LE(rsbHeadInfo.fileOffset, 12);
            RSBFile.writeInt32LE(rsbHeadInfo.fileListLength);
            RSBFile.writeInt32LE(rsbHeadInfo.fileList_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.rsgListLength, 32);
            RSBFile.writeInt32LE(rsbHeadInfo.rsgList_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.rsgNumber);
            RSBFile.writeInt32LE(rsbHeadInfo.rsgInfo_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.rsgInfo_EachLength);
            RSBFile.writeInt32LE(rsbHeadInfo.compositeNumber);
            RSBFile.writeInt32LE(rsbHeadInfo.compostieInfo_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.compositeInfo_EachLength);
            RSBFile.writeInt32LE(rsbHeadInfo.compositeListLength);
            RSBFile.writeInt32LE(rsbHeadInfo.compositeList_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.autopoolNumber);
            RSBFile.writeInt32LE(rsbHeadInfo.autopoolInfo_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.autopoolInfo_EachLength);
            RSBFile.writeInt32LE(rsbHeadInfo.ptxNumber);
            RSBFile.writeInt32LE(rsbHeadInfo.ptxInfo_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.ptxInfo_EachLength);
            RSBFile.writeInt32LE(rsbHeadInfo.part1_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.part2_BeginOffset);
            RSBFile.writeInt32LE(rsbHeadInfo.part3_BeginOffset);
            if (rsbHeadInfo.version == 4)
            {
                RSBFile.writeInt32LE(rsbHeadInfo.fileOffset);
            }

        }

        private static void WriteFileList(SenBuffer RSBFile, RSBPathTemp pathTemp)
        {
            var beginOffset = RSBFile.writeOffset;
            RSBFile.writeStringFourByte(pathTemp.pathSlice);
            RSBFile.BackupWriteOffset();
            for (var h = 0; h < pathTemp.positions.Count; h++)
            {
                RSBFile.writeInt24LE(pathTemp.positions[h].position, beginOffset + pathTemp.positions[h].offset * 4 + 1);
            }
            RSBFile.RestoreWriteOffset();
            RSBFile.writeInt32LE(pathTemp.poolIndex);
        }

        private static void ComparePacketInfo(RSBPacketInfo modifyPacketInfo, SenBuffer RSGFile)
        {
            void ThrowError<Generic_T>(string typeError, Generic_T oriValue, Generic_T modifyValue)
            {
                throw new Exception($"RSG {typeError} is not same. In ManiFestInfo: {oriValue} | In RSGFile: {modifyValue}. RSG path: {RSGFile.filePath}");
            }
            PacketInfo oriPacketInfo = RSGFunction.Unpack(RSGFile, "", false, true);
            if (oriPacketInfo.version != modifyPacketInfo.version) ThrowError("version", oriPacketInfo.version, modifyPacketInfo.version);
            if (oriPacketInfo.compression_flags != modifyPacketInfo.compression_flags) ThrowError("compression flags", oriPacketInfo.compression_flags, modifyPacketInfo.compression_flags);
            if (oriPacketInfo.res.Length != modifyPacketInfo.res.Length) ThrowError("item number", oriPacketInfo.res.Length, modifyPacketInfo.res.Length);
            var oriPacketResInfo = oriPacketInfo.res;
            Array.Sort(oriPacketResInfo, (a, b) => a.path.CompareTo(b.path));
            var modifyPacketResInfo = modifyPacketInfo.res;
            Array.Sort(modifyPacketResInfo, (a, b) => a.path.CompareTo(b.path));
            for (var i = 0; i < modifyPacketResInfo.Length; i++)
            {
                if (oriPacketResInfo[i].path != modifyPacketResInfo[i].path) ThrowError("item path", oriPacketResInfo[i].path, modifyPacketResInfo[i].path);
                if (oriPacketResInfo[i].ptx_info != null && modifyPacketResInfo[i].ptx_info != null)
                {
                    if (oriPacketResInfo[i].ptx_info!.id != modifyPacketResInfo[i].ptx_info!.id) ThrowError("item id", oriPacketResInfo[i].ptx_info!.id, modifyPacketResInfo[i].ptx_info!.id);
                    if (oriPacketResInfo[i].ptx_info!.width != modifyPacketResInfo[i].ptx_info!.width) ThrowError("item width", oriPacketResInfo[i].ptx_info!.width, modifyPacketResInfo[i].ptx_info!.width);
                    if (oriPacketResInfo[i].ptx_info!.height != modifyPacketResInfo[i].ptx_info!.height) ThrowError("item height", oriPacketResInfo[i].ptx_info!.height, modifyPacketResInfo[i].ptx_info!.height);
                }
            }
        }

        private static void FileListPack(List<FileListInfo> fileList, ref List<RSBPathTemp> pathTempList)
        {
            fileList.Sort(delegate (FileListInfo a, FileListInfo b)
            {
                return string.CompareOrdinal(a.namePath, b.namePath);
            });
            fileList.Insert(0, new FileListInfo { namePath = "", poolIndex = -1 });
            var ListLength = fileList.Count - 1;
            int w_postion = 0;
            for (var i = 0; i < ListLength; i++)
            {
                string Path1 = fileList[i].namePath.ToUpper();
                string Path2 = fileList[i + 1].namePath.ToUpper();
                if (RSGFunction.IsNotASCII(Path2)) throw new Exception("Item Path must be ASCII");
                var strLongestLength = Path1.Length >= Path2.Length ? Path1.Length : Path2.Length;
                for (var k = 0; k < strLongestLength; k++)
                {
                    if (k >= Path1.Length || k >= Path2.Length || Path1[k] != Path2[k])
                    {
                        for (var h = pathTempList.Count; h > 0; h--)
                        {
                            if (k >= pathTempList[h - 1].key)
                            {
                                pathTempList[h - 1].positions.Add(new PathPosition
                                {
                                    position = w_postion,
                                    offset = (k - pathTempList[h - 1].key)
                                });
                                break;
                            }

                        }
                        w_postion += Path2.Length - k + 2;
                        pathTempList.Add(new RSBPathTemp
                        {
                            pathSlice = Path2.Substring(k),
                            key = k,
                            poolIndex = fileList[i + 1].poolIndex,
                        });
                        break;
                    }
                }
            }
        }
        // Misc 
        public static void RSBObfuscate(SenBuffer RSBFile)
        {
            var HeadInfo = ReadHead(RSBFile);
            var rsgNumber = HeadInfo.rsgNumber;
            RSBFile.readOffset = HeadInfo.rsgInfo_BeginOffset;
            for (var i = 0; i < rsgNumber; i++)
            {
                var startOffset = RSBFile.readOffset;
                var autopoolStartOffset = HeadInfo.autopoolInfo_BeginOffset + i * 152;
                RSBFile.writeNull(128, startOffset);
                RSBFile.writeNull(128, autopoolStartOffset);
                RSBFile.writeNull(4, startOffset + 132);
                var packetOffset = RSBFile.readUInt32LE(startOffset + 128);
                RSBFile.writeNull(64, packetOffset);
                RSBFile.readOffset = startOffset + HeadInfo.rsgInfo_EachLength;
            };
            return;
        }

        public static MainfestInfo UnpackByLooseConstraints(SenBuffer RSBFile, string outFolder)
        {
            var rsbHeadInfo = ReadHead(RSBFile);
            if (rsbHeadInfo.version == 5)
            {
                FixFileListShuttle(RSBFile, rsbHeadInfo.rsgList_BeginOffset, rsbHeadInfo.rsgListLength, false);
            }
            var rsgList = new List<FileListInfo>();
            FileListSplit(RSBFile, rsbHeadInfo.rsgList_BeginOffset, rsbHeadInfo.rsgListLength, ref rsgList);
            var compositeInfo = new List<CompositeInfo>();
            ReadCompositeInfo(RSBFile, rsbHeadInfo, ref compositeInfo);
            var rsgInfoList = new List<RSGInfo>();
            ReadRSGInfoByLooseConstraints(RSBFile, rsbHeadInfo, ref rsgInfoList);
            var ptxInfoList = new List<RSBPtxInfo>();
            ReadPTXInfo(RSBFile, rsbHeadInfo, ref ptxInfoList);
            if (rsbHeadInfo.version == 3)
            {
                if (rsbHeadInfo.part1_BeginOffset == 0 && rsbHeadInfo.part2_BeginOffset == 0 && rsbHeadInfo.part3_BeginOffset == 0)
                {
                    throw new Exception("Invalid Resources Version 3 Offset");
                }
                ReadResoucesDescription(RSBFile, rsbHeadInfo, outFolder);
            }
            var groupList = new List<GroupInfo>();
            var compositeLength = compositeInfo.Count;
            var rsgNameList = new List<string>();
            for (var i = 0; i < compositeLength; i++)
            {
                var subGroupList = new List<SubGroupInfo>();
                for (var k = 0; k < compositeInfo[i].packetNumber; k++)
                {
                    var packetIndex = compositeInfo[i].packetInfo![k].packetIndex;
                    var rsgInfoCount = 0;
                    var rsgListCount = 0;
                    while (rsgInfoList[rsgInfoCount].poolIndex != packetIndex)
                    {
                        if (rsgInfoCount >= rsgInfoList.Count - 1) throw new Exception("Out of ranger 1");
                        rsgInfoCount++;
                    }
                    while (rsgList[rsgListCount].poolIndex != packetIndex)
                    {
                        Console.WriteLine(rsgList[rsgListCount].poolIndex);
                        if (rsgListCount >= rsgList.Count - 1) throw new Exception("Out of ranger 2");
                        rsgListCount++;
                    }
                    Console.WriteLine(rsgList[rsgListCount].namePath);
                    if (rsgInfoList[rsgInfoCount].name == "break") continue;
                    rsgNameList.Add(rsgList[rsgListCount].namePath);
                    byte[] packetFile = RSBFile.getBytes(rsgInfoList[rsgInfoCount].rsgLength, (long)rsgInfoList[rsgInfoCount].rsgOffset);
                    var RSGFile = new SenBuffer(packetFile);
                    FixRSG(RSGFile, rsbHeadInfo.version, new SenBuffer(rsgInfoList[rsgInfoCount].packetHeadInfo!));
                    var packetInfo = RSGFunction.Unpack(RSGFile, $"{outFolder}/unpack/", false, false);
                    var resInfoList = new List<RSBResInfo>();
                    var ptxBeforeNumber = rsgInfoList[rsgInfoCount].ptxBeforeNumber;
                    for (var h = 0; h < packetInfo.res.Length; h++)
                    {
                        var resInfo = new RSBResInfo
                        {
                            path = packetInfo.res[h].path
                        };
                        if (packetInfo.res[h].ptx_info != null)
                        {
                            resInfo.ptx_info = packetInfo.res[h].ptx_info;
                            resInfo.ptx_property = new PTXProperty
                            {
                                format = ptxInfoList[ptxBeforeNumber + packetInfo.res[h].ptx_info!.id].format,
                                pitch = ptxInfoList[ptxBeforeNumber + packetInfo.res[h].ptx_info!.id].pitch,
                                alpha_size = ptxInfoList[ptxBeforeNumber + packetInfo.res[h].ptx_info!.id]?.alpha_size,
                                alpha_format = ptxInfoList[ptxBeforeNumber + packetInfo.res[h].ptx_info!.id]?.alpha_format,
                            };
                        }
                        resInfoList.Add(resInfo);
                    }
                    var packetInfoList = new RSBPacketInfo
                    {
                        version = packetInfo.version,
                        compression_flags = packetInfo.compression_flags,
                        res = resInfoList.ToArray(),
                    };
                    subGroupList.Add(new SubGroupInfo
                    {
                        name_packet = rsgList[rsgListCount].namePath,
                        category = new string[] { compositeInfo[i].packetInfo![k].category[0], compositeInfo[i].packetInfo![k].category[1] },
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
                ptx_info_size = rsbHeadInfo.ptxInfo_EachLength,
                path = new RSBPathInfo
                {
                    rsgs = rsgNameList.ToArray(),
                    packet_path = $"{outFolder}\\packet",
                },
                group = groupList.ToArray(),
            };
            RSBFile.Close();
            return mainfest_info;
        }

        private static void FixFileListShuttle(SenBuffer FileBuffer, int startOffset, int fileListLength, bool isRSG)
        {
            FileBuffer.readOffset = (long)startOffset;
            int offsetLimit = startOffset + fileListLength;
            while (FileBuffer.readOffset < offsetLimit)
            {

                var characterByte = FileBuffer.readUInt8() - 2;
                if (characterByte % 2 != 0) characterByte -= 1;
                characterByte /= 2;
                if (characterByte == 0x0)
                {
                    FileBuffer.writeUInt8((byte)characterByte, FileBuffer.readOffset - 1);

                    var tempByte = FileBuffer.readInt24LE();
                    if (isRSG)
                    {
                        if (FileBuffer.readUInt32LE() == 1)
                        {
                            FileBuffer.readBytes(20);
                        }
                        else
                        {
                            FileBuffer.readBytes(8);
                        }
                    }
                    else
                    {
                        FileBuffer.readBytes(4);
                    }
                }
                else
                {
                    FileBuffer.writeUInt8((byte)characterByte, FileBuffer.readOffset - 1);

                    var tempByte = FileBuffer.readInt24LE();
                }
            }
            CheckEndOffset(FileBuffer, offsetLimit);
        }
        private static void FixRSG(SenBuffer RSGFile, int version, SenBuffer RsgInfo)
        {
            var rsgMagic = RSGFile.readString(4);
            var rsgVersion = RSGFile.readInt32LE();
            var rsgCompressionFlag = RSGFile.readInt32LE(0x10);
            if (version == 5)
            {
                FixFileListShuttle(RSGFile, RSGFile.readInt32LE(72), RSGFile.readInt32LE(), true);
            }
            RSGFile.readOffset = 0;
            if (rsgMagic == "pgsr" && rsgVersion == version && rsgCompressionFlag == RsgInfo.readInt32LE())
            {
                return;
            }
            else
            {
                RSGFile.writeString("pgsr");
                RSGFile.writeInt32LE(version);
                RSGFile.writeNull(8);
                RSGFile.writeBytes(RsgInfo.toBytes());
                RSGFile.writeNull(16);
                RsgInfo.Close();
            }
        }

        private static void ReadRSGInfoByLooseConstraints(SenBuffer RSBFile, RSB_head rsbHeadInfo, ref List<RSGInfo> rsgInfoList)
        {
            RSBFile.readOffset = (long)rsbHeadInfo.rsgInfo_BeginOffset;
            for (var i = 0; i < rsbHeadInfo.rsgNumber; i++)
            {
                var startOffset = RSBFile.readOffset;
                var rsgOffset = RSBFile.readInt32LE(startOffset + 128);
                var rsgIndex = RSBFile.readInt32LE(startOffset + 136);
                if (IsNotRSG(RSBFile, rsgOffset))
                {
                    rsgInfoList.Add(new RSGInfo
                    {
                        name = "break",
                        rsgOffset = 0,
                        rsgLength = 0,
                        poolIndex = rsgIndex,
                        ptxNumber = 0,
                        ptxBeforeNumber = 0
                    });
                    RSBFile.readOffset = startOffset + rsbHeadInfo.rsgInfo_EachLength;
                    continue;
                }
                var packetHeadInfo = RSBFile.readBytes(32, startOffset + 140);
                var rsgLength = RSBFile.readInt32LE(startOffset + 148) + RSBFile.readInt32LE(startOffset + 152) + RSBFile.readInt32LE(startOffset + 168);
                var ptxNumber = RSBFile.readInt32LE(startOffset + rsbHeadInfo.rsgInfo_EachLength - 8);
                var ptxBeforeNumber = RSBFile.readInt32LE();
                rsgInfoList.Add(new RSGInfo
                {
                    name = "",
                    rsgOffset = rsgOffset,
                    rsgLength = rsgLength,
                    poolIndex = rsgIndex,
                    ptxNumber = ptxNumber,
                    ptxBeforeNumber = ptxBeforeNumber,
                    packetHeadInfo = packetHeadInfo,
                });
            }
            var endOffset = rsbHeadInfo.rsgInfo_EachLength * rsbHeadInfo.rsgNumber + rsbHeadInfo.rsgInfo_BeginOffset;
            CheckEndOffset(RSBFile, endOffset);
        }

        private static bool IsNotRSG(SenBuffer RSBFile, long rsgOffset)
        {
            RSBFile.BackupReadOffset();
            var fileListOffset = RSBFile.readInt32LE(rsgOffset + 76);
            RSBFile.BackupReadOffset();
            if (fileListOffset != 0x5C) return true;
            else return false;
        }

    }

}