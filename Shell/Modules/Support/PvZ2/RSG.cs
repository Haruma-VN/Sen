using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using System.Text.Encodings.Web;
using System.Text.Json;
using Sen.Shell.Modules.Standards;

namespace Sen.Shell.Modules.Support.PvZ2.RSG
{
#pragma warning disable CS8618
#pragma warning disable SYSLIB0020
    public class PacketInfo
    {
        public int head_version { get; set; }
        public int compression_flags { get; set; }
        public ResInfo[] res { get; set; }
    }

    public class ResInfo
    {
        public string path { get; set; }
        public PtxInfo? ptxInfo { get; set; }
    }

    public class PtxInfo
    {
        public int id { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }

    public class RSG_head
    {
        public static readonly string magic = "pgsr";
        public int version { get; set; }
        public int flags { get; set; }
        public int fileOffset { get; set; }
        public int part0_Offset { get; set; }
        public int part0_Zlib { get; set; }
        public int part0_Size { get; set; }
        public int part1_Offset { get; set; }
        public int part1_Zlib { get; set; }
        public int part1_Size { get; set; }
        public int fileList_Length { get; set; }
        public int fileList_Offset { get; set; }
    }



    public class NameDict
    {
        public string namePath { get; set; }
        public int offsetByte { get; set; }
    }


    public class RSGFunction
    {

        public static List<Part0_List> part0List = new List<Part0_List>();

        public static List<Part1_List> part1List = new List<Part1_List>();

        public class Part0_List
        {
            public string path { get; set; }
            public int offset { get; set; }
            public int size { get; set; }
        }
        public class Part1_List
        {
            public string path { get; set; }
            public int offset { get; set; }
            public int size { get; set; }
            public int id { get; set; }
            public int width { get; set; }
            public int height { get; set; }
        }
        public static readonly int[,] ZlibLevelCompression = {
            {120, 1},
            {120, 94},
            {120, 156},
            {120, 218},
        };
        public static void UnpackNormal(SenBuffer RsgFile, string outFolder)
        {
            RSG_head HeadInfo = ReadRSG_Head(RsgFile);
            part0List.Clear();
            part1List.Clear();
            FileListSplit(RsgFile, HeadInfo);
            var json = new JsonImplement();
            var fs = new FileSystem();
            byte[] fileData;
            List<ResInfo> resInfo = new List<ResInfo>();
            int part0_Length = part0List.Count;
            if (part0_Length > 0)
            {
                byte[] part0RawData = CheckZlib(RsgFile, HeadInfo, false);
                for (var i = 0; i < part0_Length; i++)
                {
                    fileData = new byte[part0List[i].size];
                    Array.Copy(part0RawData, (long)part0List[i].offset, fileData, 0, (long)part0List[i].size);
                    fs.OutFile($"{outFolder}/res/{part0List[i].path}", fileData);
                    resInfo.Add(new ResInfo
                    {
                        path = part0List[i].path,
                    });
                }
            }
            int part1_Length = part1List.Count;
            if (part1_Length > 0)
            {
                byte[] part1RawData = CheckZlib(RsgFile, HeadInfo, true);
                for (var i = 0; i < part1_Length; i++)
                {
                    fileData = new byte[part1List[i].size];
                    Array.Copy(part1RawData, (long)part1List[i].offset, fileData, 0, (long)part1List[i].size);
                    fs.OutFile($"{outFolder}/res/{part1List[i].path}", fileData);
                    resInfo.Add(new ResInfo
                    {
                        path = part1List[i].path,
                        ptxInfo = new PtxInfo
                        {
                            id = part1List[i].id,
                            width = part1List[i].width,
                            height = part1List[i].height
                        }
                    });
                }
            }
            PacketInfo packetInfo = new PacketInfo
            {
                head_version = HeadInfo.version,
                compression_flags = HeadInfo.flags,
                res = resInfo.ToArray(),
            };

            JsonSerializerOptions options = new JsonSerializerOptions
            {
                WriteIndented = true,
                IgnoreNullValues = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            };
            var packet_info = json.StringifyJson(packetInfo, options);
            fs.OutFile($"{outFolder}/packet_info.json", packet_info);
            RsgFile.Close();
        }


        private static RSG_head ReadRSG_Head(SenBuffer RsgFile)
        {
            RSG_head HeadInfo = new RSG_head();
            string magic = RsgFile.readString(4);
            if (magic != RSG_head.magic) throw new Exception("This is not RSG");
            int version = RsgFile.readInt32LE();
            if (version != 3 && version != 4) throw new Exception("Invalid RSG version");
            HeadInfo.version = version;
            RsgFile.readBytes(8);
            int flags = RsgFile.readInt32LE();
            if (flags > 3 || flags < 0) throw new Exception("Invalid RSG compression flags");
            HeadInfo.flags = flags;
            HeadInfo.fileOffset = RsgFile.readInt32LE();
            HeadInfo.part0_Offset = RsgFile.readInt32LE();
            HeadInfo.part0_Zlib = RsgFile.readInt32LE();
            HeadInfo.part0_Size = RsgFile.readInt32LE();
            RsgFile.readInt32LE();
            HeadInfo.part1_Offset = RsgFile.readInt32LE();
            HeadInfo.part1_Zlib = RsgFile.readInt32LE();
            HeadInfo.part1_Size = RsgFile.readInt32LE();
            RsgFile.readBytes(20);
            HeadInfo.fileList_Length = RsgFile.readInt32LE();
            HeadInfo.fileList_Offset = RsgFile.readInt32LE();
            return HeadInfo;
        }

        private static byte[] CheckZlib(SenBuffer RsgFile, RSG_head HeadInfo, bool atlasInfo)
        {
            bool ZlibHeaderCheck(byte[] RSGData)
            {
                for (int i = 0; i < ZlibLevelCompression.GetLength(0); i++)
                {
                    if (RSGData[0] == ZlibLevelCompression[i, 0] && RSGData[1] == ZlibLevelCompression[i, 1])
                    {
                        return false;
                    }
                }
                return true;
            }
            var Compress = new Compress();
            if (atlasInfo)
            {
                if (HeadInfo.flags == 0 || HeadInfo.flags == 2 || (HeadInfo.part1_Size == HeadInfo.part1_Zlib && HeadInfo.part1_Size != 0) || ZlibHeaderCheck(RsgFile.getBytes(2, HeadInfo.part1_Offset)))
                {
                    return RsgFile.getBytes(HeadInfo.part1_Size, HeadInfo.part1_Offset);
                }
                else
                {
                    return Compress.UncompressZlibBytes(RsgFile.getBytes(HeadInfo.part1_Zlib, HeadInfo.part1_Offset));
                }
            }
            else
            {
                if (HeadInfo.flags < 2 || (HeadInfo.part0_Size == HeadInfo.part0_Zlib && HeadInfo.part0_Size != 0) || ZlibHeaderCheck(RsgFile.getBytes(2, HeadInfo.part0_Offset)))
                {
                    return RsgFile.getBytes(HeadInfo.part0_Size, HeadInfo.part0_Offset);
                }
                else
                {
                    return Compress.UncompressZlibBytes(RsgFile.getBytes(HeadInfo.part0_Zlib, HeadInfo.part0_Offset));
                }
            }
        }

        private static void FileListSplit(SenBuffer RsgFile, RSG_head HeadInfo)
        {
            var json = new JsonImplement();
            List<NameDict> nameDict = new List<NameDict>();
            string namePath = "";
            int tempOffset = HeadInfo.fileList_Offset;
            RsgFile.readOffset = tempOffset;
            int offsetLimit = tempOffset + HeadInfo.fileList_Length;
            while (RsgFile.readOffset < offsetLimit)
            {
                string characterByte = RsgFile.readString(1);
                int offsetByte = RsgFile.readInt24LE() * 4;
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
                        namePath += characterByte;
                    }
                    bool typeByte = RsgFile.readInt32LE() == 1;
                    if (typeByte)
                    {
                        part1List.Add(
                            new Part1_List
                            {
                                path = namePath,
                                offset = RsgFile.readInt32LE(),
                                size = RsgFile.readInt32LE(),
                                id = RsgFile.readInt32LE(RsgFile.readOffset + 8),
                                width = RsgFile.readInt32LE(),
                                height = RsgFile.readInt32LE()
                            }
                        );
                    }
                    else
                    {
                        part0List.Add(
                            new Part0_List
                            {
                                path = namePath,
                                offset = RsgFile.readInt32LE(),
                                size = RsgFile.readInt32LE()
                            }
                        );
                    }
                    for (var i = 0; i < nameDict.Count; i++)
                    {
                        if (nameDict[i].offsetByte + tempOffset == RsgFile.readOffset)
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
        }
    }


}
