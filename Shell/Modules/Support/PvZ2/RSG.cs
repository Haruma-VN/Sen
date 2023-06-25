using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using System.Text.Json.Serialization;
using Sen.Shell.Modules.Standards;


namespace Sen.Shell.Modules.Support.PvZ2.RSG
{
#pragma warning disable SYSLIB0020
    using Compress = Standards.Compress;
    public class PacketInfo
    {
        public int version { get; set; }

        public int compression_flags { get; set; }

        public required ResInfo[] res { get; set; }
    }

    public class ResInfo
    {
        public required string path { get; set; }
        public PtxInfo? ptx_info { get; set; }
    }

    public class PtxInfo
    {
        public int id { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int? format { get; set; }
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
        public required string namePath { get; set; }
        public required int offsetByte { get; set; }
    }

    public class PathTemp
    {
        public required string pathSlice { get; set; }
        public int key { get; set; }
        public required ResInfo resInfo { get; set; }
        public required bool isAtlas { get; set; }
        public List<PathPosition> positions = new List<PathPosition>();
    }

    public class PathPosition
    {
        public int position { get; set; }
        public int offset { get; set; }
    }

    public class RSGFunction
    {

        public static List<Part0_List> part0List = new List<Part0_List>();

        public static List<Part1_List> part1List = new List<Part1_List>();

        public class Part0_List
        {
            public required string path { get; set; }
            public required int offset { get; set; }
            public required int size { get; set; }
        }
        public class Part1_List
        {
            public required string path { get; set; }
            public required int offset { get; set; }
            public required int size { get; set; }
            public required int id { get; set; }
            public required int width { get; set; }
            public required int height { get; set; }
        }
        public static readonly int[,] ZlibLevelCompression = {
            {120, 1},
            {120, 94},
            {120, 156},
            {120, 218},
        };
        public static PacketInfo Unpack(SenBuffer RsgFile, string outFolder, bool UseResFolder = true, bool GetPacketInfo = false)
        {
            RSG_head HeadInfo = ReadRSG_Head(RsgFile);
            part0List.Clear();
            part1List.Clear();
            FileListSplit(RsgFile, HeadInfo);
            var fileData = new SenBuffer();
            var part0RawData = new SenBuffer();
            var part1RawData = new SenBuffer();
            List<ResInfo> resInfo = new List<ResInfo>();
            int part0_Length = part0List.Count;
            if (part0_Length > 0)
            {

                if (!GetPacketInfo) part0RawData = new SenBuffer(CheckZlib(RsgFile, HeadInfo, false));
                for (var i = 0; i < part0_Length; i++)
                {
                    if (!GetPacketInfo)
                    {
                        fileData = new SenBuffer(part0RawData.getBytes(part0List[i].size, part0List[i].offset));
                        fileData.OutFile(UseResFolder ? $"{outFolder}/res/{part0List[i].path}" : $"{outFolder}/{part0List[i].path}");
                    }
                    resInfo.Add(new ResInfo
                    {
                        path = part0List[i].path,
                    });
                }
                part0RawData.Close();
            }
            int part1_Length = part1List.Count;
            if (part1_Length > 0)
            {
                if (!GetPacketInfo) part1RawData = new SenBuffer(CheckZlib(RsgFile, HeadInfo, true));
                for (var i = 0; i < part1_Length; i++)
                {
                    if (!GetPacketInfo)
                    {
                        fileData = new SenBuffer(part1RawData.getBytes(part1List[i].size, part1List[i].offset));
                        fileData.OutFile(UseResFolder ? $"{outFolder}/res/{part1List[i].path}" : $"{outFolder}/{part1List[i].path}");
                    }
                    resInfo.Add(new ResInfo
                    {
                        path = part1List[i].path,
                        ptx_info = new PtxInfo
                        {
                            id = part1List[i].id,
                            width = part1List[i].width,
                            height = part1List[i].height
                        }
                    });
                }
                part1RawData.Close();
            }
            PacketInfo packetInfo = new PacketInfo
            {
                version = HeadInfo.version,
                compression_flags = HeadInfo.flags,
                res = resInfo.ToArray(),
            };
            if (!GetPacketInfo)
            {
                RsgFile.Close();
            }
            return packetInfo;
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
            var nameDict = new List<NameDict>();
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
                                id = RsgFile.readInt32LE(),
                                width = RsgFile.readInt32LE(RsgFile.readOffset + 8),
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
        // Pack RSG
        public static SenBuffer Pack(string inFolder, PacketInfo packetInfo, bool UseResFolder = true)
        {
            if (packetInfo.version != 3 && packetInfo.version != 4) throw new Exception("RSG version out of range");
            if (packetInfo.compression_flags < 0 || packetInfo.compression_flags > 3) throw new Exception("RSG compression flags out of range");
            var RSGFile = new SenBuffer();
            RSGFile.writeString(RSG_head.magic);
            RSGFile.writeInt32LE(packetInfo.version);
            RSGFile.writeNull(8);
            RSGFile.writeInt32LE(packetInfo.compression_flags);
            RSGFile.writeNull(72);
            var pathTemps = FileListPack(packetInfo.res);
            WriteRSG(RSGFile, pathTemps, packetInfo.compression_flags, inFolder, UseResFolder);
            return RSGFile;
        }

        public static bool IsNotASCII(string str)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] > 127) return true;
            }
            return false;
        }

        private static List<PathTemp> FileListPack(ResInfo[] ResInfo)
        {
            var ResInfoList = ResInfo.ToList();
            ResInfoList.Insert(0, new ResInfo { path = "" });
            ResInfoList.Sort(delegate (ResInfo a, ResInfo b)
            {
                return a.path.CompareTo(b.path);
            });
            var ListLength = ResInfoList.Count - 1;
            var pathTemps = new List<PathTemp>();
            int w_postion = 0;
            for (var i = 0; i < ListLength; i++)
            {
                string Path1 = ResInfoList[i].path.ToUpper();
                string Path2 = ResInfoList[i + 1].path.ToUpper();
                if (IsNotASCII(Path2)) throw new Exception("Item Path must be ASCII");
                var strLongestLength = Path1.Length >= Path2.Length ? Path1.Length : Path2.Length;
                for (var k = 0; k < strLongestLength; k++)
                {
                    if (k >= Path1.Length || k >= Path2.Length || Path1[k] != Path2[k])
                    {
                        for (var h = pathTemps.Count; h > 0; h--)
                        {
                            if (k >= pathTemps[h - 1].key)
                            {
                                pathTemps[h - 1].positions.Add(new PathPosition
                                {
                                    position = w_postion,
                                    offset = (k - pathTemps[h - 1].key)
                                });
                                break;
                            }

                        }
                        w_postion += (Path2.EndsWith(".PTX") ? (Path2.Length - k + 9) : (Path2.Length - k + 4));
                        pathTemps.Add(new PathTemp
                        {
                            pathSlice = Path2.Substring(k),
                            key = k,
                            resInfo = ResInfoList[i + 1],
                            isAtlas = (Path2.EndsWith(".PTX") ? true : false),
                        });
                        break;
                    }
                }
            }
            return pathTemps;
        }

        private static void WriteRSG(SenBuffer RSGFile, List<PathTemp> pathTemps, int compression_flags, string inFolder, bool UseResFolder = true)
        {
            var pathTempLength = pathTemps.Count;
            var fileListBeginOffset = RSGFile.writeOffset;
            if (fileListBeginOffset != 92) throw new Exception("Invalid fileList Offset");
            var fs = new FileSystem();
            SenBuffer dataGroup = new SenBuffer();
            SenBuffer atlasGroup = new SenBuffer();
            int dataPos = 0;
            int atlasPos = 0;
            for (var i = 0; i < pathTempLength; i++)
            {
                var beginOffset = RSGFile.writeOffset;
                var PacketResInfo = pathTemps[i].resInfo;
                RSGFile.writeStringFourByte(pathTemps[i].pathSlice);
                RSGFile.BackupWriteOffset();
                for (var h = 0; h < pathTemps[i].positions.Count; h++)
                {
                    RSGFile.writeInt24LE(pathTemps[i].positions[h].position, beginOffset + pathTemps[i].positions[h].offset * 4 + 1);
                }
                byte[] dataItem = fs.ReadBytes(UseResFolder ? $"{inFolder}/res/{PacketResInfo.path}" : $"{inFolder}/{PacketResInfo.path}");
                int appendLength = BeautifyLength(dataItem.Length);
                if (pathTemps[i].isAtlas)
                {
                    atlasGroup.writeBytes(dataItem);
                    atlasGroup.writeNull(appendLength);
                    RSGFile.RestoreWriteOffset();
                    RSGFile.writeInt32LE(1);
                    RSGFile.writeInt32LE(atlasPos);
                    RSGFile.writeInt32LE(dataItem.Length);
                    RSGFile.writeInt32LE(PacketResInfo.ptx_info!.id);
                    RSGFile.writeNull(8);
                    RSGFile.writeInt32LE(PacketResInfo.ptx_info!.width);
                    RSGFile.writeInt32LE(PacketResInfo.ptx_info!.height);
                    atlasPos += dataItem.Length + appendLength;
                }
                else
                {
                    dataGroup.writeBytes(dataItem);
                    dataGroup.writeNull(appendLength);
                    RSGFile.RestoreWriteOffset();
                    RSGFile.writeInt32LE(0);
                    RSGFile.writeInt32LE(dataPos);
                    RSGFile.writeInt32LE(dataItem.Length);
                    dataPos += dataItem.Length + appendLength;
                }
            }
            var fileListLength = RSGFile.writeOffset - fileListBeginOffset;
            RSGFile.writeNull(BeautifyLength((int)RSGFile.writeOffset));
            RSGFile.BackupWriteOffset();
            RSGFile.writeInt32LE((int)RSGFile.writeOffset, 0x14);
            RSGFile.writeInt32LE((int)fileListLength, 0x48);
            RSGFile.writeInt32LE((int)fileListBeginOffset);
            RSGFile.RestoreWriteOffset();
            Compressor(RSGFile, dataGroup, atlasGroup, compression_flags);
        }

        private static void Compressor(SenBuffer RSGFile, SenBuffer dataGroup, SenBuffer atlasGroup, int compression_flags)
        {
            var Compress = new Compress();
            void DataWrite(byte[] dataBytes, int flags)
            {
                int part0_Offset = (int)RSGFile.writeOffset;
                int part0_Size = dataBytes.Length;
                if (flags < 2)
                {
                    RSGFile.writeBytes(dataBytes);
                    RSGFile.BackupWriteOffset();
                    RSGFile.writeInt32LE(part0_Offset, 0x18);
                    RSGFile.writeInt32LE(part0_Size);
                    RSGFile.writeInt32LE(part0_Size);
                    RSGFile.RestoreWriteOffset();
                }
                else
                {
                    byte[] ZlibBytes = Compress.CompressZlibBytes(dataBytes, ZlibCompressionLevel.Level9);
                    int ZlibAppendLength = BeautifyLength(ZlibBytes.Length);
                    RSGFile.writeBytes(ZlibBytes);
                    RSGFile.writeNull(ZlibAppendLength);
                    int part0_Zlib = ZlibBytes.Length + ZlibAppendLength;
                    RSGFile.BackupWriteOffset();
                    RSGFile.writeInt32LE(part0_Offset, 0x18);
                    RSGFile.writeInt32LE(part0_Zlib);
                    RSGFile.writeInt32LE(part0_Size);
                    RSGFile.RestoreWriteOffset();
                }
            }
            if (dataGroup.length != 0)
            {
                byte[] dataBytes = dataGroup.toBytes();
                dataGroup.Close();
                DataWrite(dataBytes, compression_flags);
            }
            if (atlasGroup.length != 0)
            {
                byte[] atlasBytes = atlasGroup.toBytes();
                atlasGroup.Close();
                int part1_Offset;
                int part1_Size = atlasBytes.Length;
                if (compression_flags == 0 || compression_flags == 2)
                {
                    if (dataGroup.length == 0)
                    {
                        DataWrite(new byte[4096], 3);
                    }
                    part1_Offset = (int)RSGFile.writeOffset;
                    RSGFile.writeBytes(atlasBytes);
                    RSGFile.BackupWriteOffset();
                    RSGFile.writeInt32LE(part1_Offset, 0x28);
                    RSGFile.writeInt32LE(part1_Size);
                    RSGFile.writeInt32LE(part1_Size);
                    RSGFile.RestoreWriteOffset();
                }
                else
                {
                    if (compression_flags == 3 && dataGroup.length == 0)
                    {
                        DataWrite(new byte[4096], 3);
                    }
                    part1_Offset = (int)RSGFile.writeOffset;
                    byte[] ZlibBytes = Compress.CompressZlibBytes(atlasBytes, ZlibCompressionLevel.Level9);
                    int ZlibAppendLength = BeautifyLength(ZlibBytes.Length);
                    RSGFile.writeBytes(ZlibBytes);
                    RSGFile.writeNull(ZlibAppendLength);
                    int part1_Zlib = ZlibBytes.Length + ZlibAppendLength;
                    RSGFile.BackupWriteOffset();
                    RSGFile.writeInt32LE(part1_Offset, 0x28);
                    RSGFile.writeInt32LE(part1_Zlib);
                    RSGFile.writeInt32LE(part1_Size);
                    RSGFile.RestoreWriteOffset();
                }
            }
            else
            {
                RSGFile.writeInt32LE((int)RSGFile.length, 0x28);
            }
        }

        public static int BeautifyLength(int oriLength)
        {
            if (oriLength % 4096 == 0)
            {
                return oriLength;
            }
            else
            {
                return 4096 - (oriLength % 4096);
            }
        }
    }
}