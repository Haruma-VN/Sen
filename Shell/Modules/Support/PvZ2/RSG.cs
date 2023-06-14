using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using System.Text;
using Sen.Shell.Modules.Standards;

namespace Sen.Shell.Modules.Support.PvZ2.RSG
{
    internal class PacketInfo
    {
        public int head_version { get; set; }
        public int compression_flags { get; set; }
        public ResInfo[] res { get; set; }
    }

    internal class ResInfo
    {
        public RSG_DataInfo[]? dataInfo { get; set; }
        public RSG_AtlasInfo[]? atlasInfo { get; set; }

    }

    internal class RSG_DataInfo
    {
        public string[] path { get; set; }
    }

    internal class RSG_AtlasInfo
    {
        public string[] path { get; set; }
        public PtxInfo ptxInfo { get; set; }
    }

    internal class PtxInfo
    {
        public int id { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }

    internal class RSG_head
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

    internal class FileList
    {
        public List<Part0_List> part0List = new List<Part0_List>();
        public List<Part1_List> part1List = new List<Part1_List>();
    }

    internal class Part0_List
    {
        public string path { get; set; }
        public int offset { get; set; }
        public int size { get; set; }
    }
    internal class Part1_List
    {
        public string path { get; set; }
        public int offset { get; set; }
        public int size { get; set; }
        public int id { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }

    internal class NameDict
    {
        public string namePath { get; set; }
        public int offsetByte { get; set; }
    }

    internal class RSGFunction
    {
        public static void UnpackNormal(SenBuffer RsgFile, string outFolder)
        {
            RSG_head HeadInfo = ReadRSG_Head(RsgFile);
            FileList fileList = FileListSplit(RsgFile, HeadInfo);
            var fs = new FileSystem();
            var json = new JsonImplement();
            fs.CreateDirectory(outFolder);
            byte[] bytes = Encoding.UTF8.GetBytes(json.StringifyJson(fileList, null));
            SenBuffer fileListWrite = new SenBuffer(bytes);
            fileListWrite.SaveFile($"{outFolder}/fileList.json");
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

        private static FileList FileListSplit(SenBuffer RsgFile, RSG_head HeadInfo)
        {
            FileList fileList = new FileList();
            List<NameDict> nameDict = new List<NameDict>();
            string namePath = "";
            int tempOffset = HeadInfo.fileList_Offset;
            RsgFile.readOffset = tempOffset;
            int offsetLimit = tempOffset + HeadInfo.fileList_Length;
            while (tempOffset < offsetLimit)
            {
                string characterByte = RsgFile.readString(1);
                int offsetByte = RsgFile.readInt24LE();
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
                    bool typeByte = RsgFile.readBool();
                    if (typeByte)
                    {
                        fileList.part1List.Add(
                            new Part1_List
                            {
                                path = namePath,
                                offset = RsgFile.readInt32LE(),
                                size = RsgFile.readInt32LE(),
                                id = RsgFile.readInt32LE(RsgFile.readOffset + 12),
                                width = RsgFile.readInt32LE(),
                                height = RsgFile.readInt32LE()
                            }
                        );
                    }
                    else
                    {
                        fileList.part0List.Add(
                            new Part0_List
                            {
                                path = namePath,
                                offset = RsgFile.readInt32LE(),
                                size = RsgFile.readInt32LE()
                            }
                        );
                    }
                    nameDict.ForEach(e =>
                    {
                        if (e.offsetByte < RsgFile.readInt32LE())
                        {
                            nameDict.Remove(e);
                        }
                        else
                        {
                            namePath = e.namePath;
                        }
                    });
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
            return fileList;
        }
    }


}