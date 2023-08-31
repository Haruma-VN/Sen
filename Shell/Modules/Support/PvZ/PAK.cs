using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.IOModule.Buffer;

namespace Sen.Shell.Modules.Support.PvZ.PAK
{
    public enum PAK_Version
    {
        PC,
        XBox_360,
        TV,
    }

    public class PAK_Info
    {
        public PAK_Version pak_version;
        public bool windows_path_separate;
        public bool zlib_compress;
    }

    public class FileInfo
    {
        public string? file_name;
        public int zlib_size;
        public int size;
        public long file_time = 129146222018596744;
    }

    public class PAK_Function
    {
        public static PAK_Info Unpack(SenBuffer rawFile, string outFolder)
        {
            var senFile = new SenBuffer();
            var pak_info = new PAK_Info();
            var magic = rawFile.peekInt32LE();
            var path = new ImplementPath();
            var compress = new Standards.Compress();
            if (magic == 1295498551)
            { //37 BD 37 4D
                pak_info.pak_version = PAK_Version.PC;
                var length = rawFile.length;
                for (var i = 0; i < length; i++)
                {
                    senFile.writeUInt8((byte)(rawFile.readUInt8() ^ 0xF7));
                }
            }
            else if (magic == -1161803072) //C0 4A C0 BA
            {
                senFile = rawFile;
            }
            else if (magic == 67324752) //50 4B 03 04
            {
                pak_info.pak_version = PAK_Version.TV;
            }
            senFile.readOffset = 0;
            if (pak_info.pak_version == PAK_Version.TV)
            {
                compress.UncompressZip(rawFile.filePath!, outFolder);
            }
            else
            {
                var pak_magic = senFile.readInt32LE();
                if (pak_magic != -1161803072) throw new Exception("Invaild pak magic");
                var pak_version = senFile.readInt32LE();
                if (pak_version != 0x0) throw new Exception("Invaild pak version");
                var fileInfo_library = new List<FileInfo>();
                bool? compress_zlib = null;
                try
                {
                    while (true)
                    {
                        if (senFile.readUInt8() == 0x80)
                        {
                            break;
                        }
                        if (compress_zlib == null)
                        {
                            senFile.BackupReadOffset();
                            senFile.readStringByUInt8();
                            senFile.readOffset += 0x10;
                            var bp = senFile.readUInt8();
                            compress_zlib = (bp != 0x0 || bp == 0x80) ? true : false;
                            senFile.RestoreReadOffset();
                        }
                        fileInfo_library.Add(ReadFileInfo(senFile, compress_zlib));
                    }
                }
                catch (Exception)
                {
                    senFile.readOffset = 0x8;
                    compress_zlib = false;
                    fileInfo_library = new List<FileInfo>();
                    fileInfo_library.Add(ReadFileInfo(senFile, compress_zlib));
                }
                foreach (FileInfo file in fileInfo_library)
                {
                    if (file.file_name!.IndexOf('/') > -1)
                    {
                        pak_info.windows_path_separate = false;
                        break;
                    }
                    if (file.file_name!.IndexOf('\\') > -1)
                    {
                        break;
                    }
                }
                pak_info.zlib_compress = compress_zlib == true;
                if (fileInfo_library == null) return pak_info;
                for (var i = 0; i < fileInfo_library.Count; i++)
                {
                    if (pak_info.pak_version == PAK_Version.PC)
                    {
                        var pak_360 = false;
                        pak_360 |= Jump(senFile);
                        if (pak_360) pak_info.pak_version = PAK_Version.XBox_360;
                    }
                    var file_path_out = path.Resolve(path.Join(outFolder, fileInfo_library[i].file_name!));
                    var file_data = senFile.readBytes(fileInfo_library[i].size);
                    if (fileInfo_library[i].zlib_size != 0)
                    {
                        var senWrite = new SenBuffer(compress.UncompressZlib(file_data));
                        senWrite.OutFile(file_path_out);
                    }
                    else
                    {
                        var senWrite = new SenBuffer(file_data);
                        senWrite.OutFile(file_path_out);
                    }
                }
            }
            return pak_info;
        }

        private static FileInfo ReadFileInfo(SenBuffer senFile, bool? compress)
        {
            var file_info = new FileInfo();
            file_info.file_name = senFile.readStringByUInt8();
            file_info.size = senFile.readInt32LE();
            if (compress == true)
            {
                file_info.zlib_size = senFile.readInt32LE();
            }
            file_info.file_time = senFile.readBigInt64LE();
            return file_info;
        }

        private static bool Jump(SenBuffer senFile)
        {
            var jmp = senFile.readUInt16LE();
            senFile.readOffset += jmp;
            if (jmp > 8) return true;
            return false;
        }

        public static void Pack(PAK_Info pak_info, string inFolder, string outFile)
        {
            var path = new ImplementPath();
            var fs = new FileSystem();
            var temp = inFolder.Length + 1;
            var compress = new Standards.Compress();
            var compress_zlib = pak_info.zlib_compress;
            if (pak_info.pak_version == PAK_Version.TV)
            {
                compress.CompressZip(outFile, new string[0], new string[] { inFolder });
            }
            else
            {
                var filePathList = fs.ReadDirectory(inFolder, ReadDirectory.AllNestedDirectory);
                var json_path = ""; // unfinished
                var senFile = new SenBuffer();
                var fileInfo_library = new List<FileInfo>();
                for (var i = 0; i < filePathList.Length; i++)
                {
                    if (filePathList[i] == json_path) continue;
                    var info = new FileInfo();
                    if (pak_info.windows_path_separate)
                    {
                        info.file_name = filePathList[i][temp..].Replace('/', '\\').Replace(@"\\", @"\").Replace(@" \", @"\");
                    }
                    else
                    {
                        info.file_name = filePathList[i][temp..].Replace('\\', '/').Replace("//", "/").Replace(" /", "/");
                    }
                    fileInfo_library.Add(info);
                }
                Write(senFile, fileInfo_library, compress_zlib);
                var json_path_index = 0;
                for (var i = 0; i < filePathList.Length; i++)
                {
                    if (filePathList[i] == json_path)
                    {
                        json_path_index++;
                        continue;
                    }
                    if (pak_info.pak_version != PAK_Version.PC)
                    {
                        if (pak_info.pak_version != PAK_Version.XBox_360 && path.Extname(filePathList[i]).ToLower() == ".ptx")
                        {
                            Fill0x1000(senFile);
                        }
                        else {
                            Fill(senFile);
                        }
                    }
                    var file_info = fileInfo_library[i - json_path_index];
                    var file_data = File.ReadAllBytes(filePathList[i]);
                    if (compress_zlib) {
                        var zlib_data = compress.CompressZlib(file_data, ZlibCompressionLevel.BEST_COMPRESSION);
                        senFile.writeBytes(zlib_data);
                    }
                    else {
                        senFile.writeBytes(file_data);
                    }
                }
                senFile.writeOffset = 0;
                Write(senFile, fileInfo_library, compress_zlib);
                if (pak_info.pak_version != PAK_Version.PC) {
                    var senWrite = new SenBuffer();
                    var length = senFile.length;
                    senFile.readOffset = 0;
                    for (var i = 0; i < length; i++) {
                        senWrite.writeUInt8((byte)(senFile.readUInt8() ^ 0xF7));
                    }
                    senWrite.OutFile(outFile);
                }
                senFile.OutFile(outFile);
            }
            

        }

        private static void Write(SenBuffer senFile, List<FileInfo> fileInfo_library, bool compress)
        {
            senFile.writeInt32LE(-1161803072);
            senFile.writeInt32LE(0x0);
            for (var i = 0; i < fileInfo_library.Count; i++)
            {
                senFile.writeUInt8(0x0);
                WriteFileInfo(fileInfo_library[i], senFile, compress);
            }
            senFile.writeUInt8(0x80);
        }

        private static void WriteFileInfo(FileInfo file_info, SenBuffer senFile, bool compress)
        {
            senFile.writeStringByUInt8(file_info.file_name);
            senFile.writeInt32LE(file_info.size);
            if (compress) senFile.writeInt32LE(file_info.zlib_size);
            senFile.writeBigInt64LE(129146222018596744);
        }

        private static void Fill0x1000(SenBuffer senFile)
        {
            var length = senFile.writeOffset & (0x1000 - 1);
            if (length == 0)
            {
                senFile.writeUInt16LE(0x1000 - 2);
                senFile.writeNull(0x1000 - 2);
            }
            else if (length > 0x1000 - 2)
            {
                var w = (ushort)(0x2000 - 2 - length);
                senFile.writeUInt16LE(w);
                senFile.writeNull(w);
            }
            else
            {
                var w = (ushort)(0x1000 - 2 - length);
                senFile.writeUInt16LE(w);
                senFile.writeNull(w);
            }
        }

        private static void Fill(SenBuffer senFile)
        {
            var length = senFile.writeOffset & 0b111;
            if (length == 0)
            {
                senFile.writeUInt16LE(0x06);
                senFile.writeNull(6);
            }
            else if (length > 5)
            {
                var w = (ushort)(14 - length);
                senFile.writeUInt16LE(w);
                senFile.writeNull(w);
            }
            else
            {
                var w = (ushort)(6 - length);
                senFile.writeUInt16LE(w);
                senFile.writeNull(w);
            }
        }
    }
}