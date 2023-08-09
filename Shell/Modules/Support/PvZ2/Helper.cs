using System.IO.Compression;
using Newtonsoft.Json;
using ICSharpCode.SharpZipLib.Zip.Compression;
using ICSharpCode.SharpZipLib.Zip.Compression.Streams;
using Sen.Shell.Modules.Support.PvZ2.RSG;

namespace Sen.Shell.Modules.Support.PvZ2.Helper
{
    public abstract class PVZ2RSG_Stream
    {
        public abstract Task DecodeAsync(Stream RSGData, string packetFolder, List<Task> tasks, bool writePacketInfo, bool useResFolder);

        public abstract Task<RSG_head> ReadHead(BinaryReader RSGHeadOnly);

        public abstract Task EncodeAsync(BinaryWriter RSGWriter, string packetFolder, PacketInfo packetInfo, bool useResFolder);
    }

    public class StandandsModule
    {
        public static Task<MemoryStream> ZlibUncompress(byte[] zlibData)
        {

            var fileWrite = new MemoryStream();
            using (var zlibMemory = new MemoryStream(zlibData))
            using (var deflateStream = new ZLibStream(zlibMemory, CompressionMode.Decompress))
            {
                deflateStream.CopyToAsync(fileWrite);
            }
            return Task.FromResult(fileWrite);
        }

        public static Task<MemoryStream> ZlibCompress(byte[] zlibData)
        {

            var fileWrite = new MemoryStream();
            using (var zlibMemory = new MemoryStream(zlibData))
            using (var deflaterStream = new DeflaterOutputStream(fileWrite, new Deflater(Deflater.BEST_COMPRESSION)))
            {
                zlibMemory.CopyToAsync(deflaterStream);
            }
            return Task.FromResult(fileWrite);

        }

        public static async Task<MemoryStream> ReadFileAsync(string inPath)
        {
            var stream = new MemoryStream();
            using (FileStream sourceStream = File.OpenRead(inPath))
            {
                await sourceStream.CopyToAsync(stream);
            }
            return stream;
        }

        public static Generic_T ReadJson<Generic_T>(string inPath)
        {
            var texts = File.ReadAllText(inPath);
            return JsonConvert.DeserializeObject<Generic_T>(texts)!;
        }

        public static async Task<Task> OutFileAsync(byte[] byteData, string outPath)
        {
            var directoryPath = Path.GetDirectoryName(outPath)!;
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            using (FileStream sourceStream = File.Create(outPath))
            {
                await new MemoryStream(byteData).CopyToAsync(sourceStream);
            }
            return (Task<Task>)Task.CompletedTask;
        }

        public static async Task<Task> OutFileAsync(Stream stream, string outPath)
        {
            var directoryPath = Path.GetDirectoryName(outPath)!;
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            using (FileStream sourceStream = File.Create(outPath))
            {
                await stream.CopyToAsync(sourceStream);
            }
            return (Task<Task>)Task.CompletedTask;
        }

        public static Task<Task> OutJsonAsync<Generic_T>(Generic_T JSON, string outPath)
        {
            var directoryPath = Path.GetDirectoryName(outPath)!;
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            using (var stringReader = new StringReader(JsonConvert.SerializeObject(JSON)))
            using (var stringWriter = new StringWriter())
            {
                var jsonReader = new JsonTextReader(stringReader);
                var jsonWriter = new JsonTextWriter(stringWriter) { Formatting = Formatting.Indented, IndentChar = '\t', Indentation = 1 };
                jsonWriter.WriteToken(jsonReader);
                File.WriteAllText(outPath, stringWriter.ToString());
            }
            return Task.FromResult(Task.CompletedTask);
        }
    }
    public class PVZ2RSG : PVZ2RSG_Stream
    {
        public static readonly byte[] RSGMagic = { 0x70, 0x67, 0x73, 0x72 };
        private static readonly byte[] zlibData = new byte[4096];

        public override async Task<Task> DecodeAsync(Stream RSGData, string packetFolder, List<Task> tasks, bool writePacketInfo, bool useResFolder = true)
        {
            using (var RSGReader = new BinaryReader(RSGData))
            {
                var RSGHeadInfo = await ReadHead(RSGReader);
                _ = DecompressData(RSGHeadInfo, RSGReader, packetFolder, tasks, writePacketInfo, useResFolder);
            }
            return Task.CompletedTask;
        }


        public override Task<RSG_head> ReadHead(BinaryReader RSGReader)
        {
            var RSGHeadInfo = new RSG_head();
            RSGReader.BaseStream.Position = 0x04;
            var version = RSGReader.ReadInt32();
            if (version != 3 && version != 4) throw new Exception("Invaild RSG verison");
            RSGReader.BaseStream.Position = 0x10;
            var flags = RSGReader.ReadInt32();
            if (flags < 0 || flags > 3) throw new Exception("Invaild RSG Flag Compression");
            RSGHeadInfo.version = version;
            RSGHeadInfo.flags = flags;
            RSGHeadInfo.fileOffset = RSGReader.ReadInt32();
            var part0_Offset = RSGReader.ReadInt32();
            RSGHeadInfo.part0_Offset = part0_Offset;
            var part0_Zlib = RSGReader.ReadInt32();
            if (part0_Offset != 0)
            {
                RSGHeadInfo.part0_Zlib = part0_Zlib;
                RSGHeadInfo.part0_Size = RSGReader.ReadInt32();
            }
            RSGReader.BaseStream.Position = 0x28;
            RSGHeadInfo.part1_Offset = RSGReader.ReadInt32();
            var part1_Zlib = RSGReader.ReadInt32();
            if (part1_Zlib != 0)
            {
                RSGHeadInfo.part1_Zlib = part1_Zlib;
                RSGHeadInfo.part1_Size = RSGReader.ReadInt32();
            }
            RSGReader.BaseStream.Position = 0x48;
            RSGHeadInfo.fileList_Length = RSGReader.ReadInt32();
            RSGHeadInfo.fileList_Offset = RSGReader.ReadInt32();
            return Task.FromResult(RSGHeadInfo);
        }

        protected static async Task<Task> DecompressData(RSG_head RSGHeadInfo, BinaryReader RSGReader, string outPath, List<Task> tasks, bool writePacketInfo, bool useResFolder)
        {
            var flags = RSGHeadInfo.flags;
            var isPart0 = RSGHeadInfo.part0_Zlib > 0;
            var isPart1 = RSGHeadInfo.part1_Zlib > 0;
            var part0Stream = new BinaryReader(new MemoryStream());
            var part1Stream = new BinaryReader(new MemoryStream());
            if (isPart0)
            {
                RSGReader.BaseStream.Position = RSGHeadInfo.part0_Offset;
                var zlibByte = RSGReader.ReadBytes(RSGHeadInfo.part0_Zlib);
                if (flags > 2 || ZlibHeaderCheck(zlibByte))
                {
                    part0Stream = new BinaryReader(await StandandsModule.ZlibUncompress(zlibByte));
                }
                else
                {
                    part0Stream = new BinaryReader(new MemoryStream(zlibByte));
                }
            }
            if (isPart1)
            {
                RSGReader.BaseStream.Position = RSGHeadInfo.part1_Offset;
                var zlibByte = RSGReader.ReadBytes(RSGHeadInfo.part1_Zlib);
                if (flags == 1 || flags == 3 || ZlibHeaderCheck(zlibByte))
                {
                    part1Stream = new BinaryReader(await StandandsModule.ZlibUncompress(zlibByte));
                }
                else
                {
                    part1Stream = new BinaryReader(new MemoryStream(zlibByte));
                }
            }
            var resInfo = new List<RSG.ResInfo>();
            {
                RSGReader.BaseStream.Position = RSGHeadInfo.fileList_Offset;
                var offsetLimit = RSGHeadInfo.fileList_Offset + RSGHeadInfo.fileList_Length;
                var nameDict = new List<NameDict>();
                var namePath = "";
                while (RSGReader.BaseStream.Position < offsetLimit)
                {
                    var characterByte = RSGReader.ReadChar();
                    var offsetByte = ReadUInt24(RSGReader.ReadBytes(3)) * 4;
                    if (characterByte == 0)
                    {
                        if (offsetByte != 0)
                        {
                            nameDict.Add(new NameDict
                            {
                                namePath = namePath,
                                offsetByte = (int)offsetByte,
                            }
                            );
                        }
                        bool typeByte = RSGReader.ReadUInt32() == 1;
                        if (typeByte)
                        {
                            var path = namePath;
                            var offset = RSGReader.ReadUInt32();
                            var size = RSGReader.ReadUInt32();
                            var id = RSGReader.ReadUInt32();
                            var width = RSGReader.ReadUInt32();
                            RSGReader.BaseStream.Position += 8;
                            var height = RSGReader.ReadUInt32();
                            if (writePacketInfo)
                            {
                                resInfo.Add(new RSG.ResInfo
                                {
                                    path = path,
                                    ptx_info = new PtxInfo()
                                    {
                                        width = (int)width,
                                        height = (int)height,
                                        id = (int)id,
                                    }
                                });
                            }
                            tasks.Add(Task.Run(() =>
                            {
                                part1Stream.BaseStream.Position = offset;
                                _ = StandandsModule.OutFileAsync(part1Stream.ReadBytes((int)size), Path.Join(outPath, useResFolder ? "Res" : "", path));
                            }));
                        }
                        else
                        {
                            var path = namePath;
                            var offset = RSGReader.ReadUInt32();
                            var size = RSGReader.ReadUInt32();
                            if (writePacketInfo)
                            {
                                resInfo.Add(new RSG.ResInfo
                                {
                                    path = path,
                                });
                            }
                            tasks.Add(Task.Run(() =>
                            {
                                part0Stream.BaseStream.Position = offset;
                                _ = StandandsModule.OutFileAsync(part0Stream.ReadBytes((int)size), Path.Join(outPath, useResFolder ? "Res" : "", path));
                            }));
                        }
                        for (var i = 0; i < nameDict.Count; i++)
                        {
                            if (nameDict[i].offsetByte + RSGHeadInfo.fileList_Offset == RSGReader.BaseStream.Position)
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
                                offsetByte = (int)offsetByte,
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
            if (writePacketInfo)
            {
                var packetInfo = new PacketInfo()
                {
                    version = RSGHeadInfo.version,
                    compression_flags = RSGHeadInfo.flags,
                    res = resInfo.ToArray()
                };
                tasks.Add(Task.Run(() => { StandandsModule.OutJsonAsync(packetInfo, Path.Join(outPath, "packet.json")); }));
            }
            return Task.CompletedTask;
        }

        protected static bool ZlibHeaderCheck(byte[] zlibByte)
        {
            int[,] ZlibLevelCompression = {
                {120, 1},
                {120, 94},
                {120, 156},
                {120, 218},
                };
            for (int i = 0; i < 4; i++)
            {
                if (zlibByte[0] == ZlibLevelCompression[i, 0] && zlibByte[1] == ZlibLevelCompression[i, 1])
                {
                    return true;
                }
            }
            return false;
        }

        protected static uint ReadUInt24(byte[] threeBytes)
        {
            return (uint)(threeBytes[0] | (threeBytes[1] << 8) | (threeBytes[2] << 16));
        }


        public override async Task<Task> EncodeAsync(BinaryWriter RSGWriter, string packetFolder, PacketInfo packetInfo, bool useResFolder)
        {
            RSGWriter.Write(RSGMagic);
            RSGWriter.Write((uint)packetInfo.version);
            var resInfo = new List<RSG.ResInfo>();
            foreach (var resFile in packetInfo.res)
            {
                resInfo.Add(new RSG.ResInfo()
                {
                    path = resFile.path,
                    ptx_info = resFile.ptx_info,
                });
            }
            var pathTemps = FileListPack(resInfo);
            await EncodeData(packetFolder, (uint)packetInfo.compression_flags, pathTemps, useResFolder, RSGWriter);
            return Task.CompletedTask;
        }

        protected static List<PathTemp> FileListPack(List<RSG.ResInfo> resInfo)
        {
            resInfo.Insert(0, new RSG.ResInfo() { path = "" });
            resInfo.Sort(delegate (RSG.ResInfo a, RSG.ResInfo b)
            {
                return string.CompareOrdinal(a.path.ToUpper(), b.path.ToUpper());
            });
            var listLength = resInfo.Count - 1;
            var pathTemps = new List<PathTemp>();
            int w_postion = 0;
            for (var i = 0; i < listLength; i++)
            {
                string Path1 = resInfo[i].path.ToUpper();
                string Path2 = resInfo[i + 1].path.ToUpper();
                if (IsNotASCII(Path2))
                {
                    throw new Exception($"item_part_must_be_ascii");
                }
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
                                    offset = k - pathTemps[h - 1].key
                                });
                                break;
                            }
                        }
                        w_postion += Path2.EndsWith(".PTX") ? (Path2.Length - k + 9) : (Path2.Length - k + 4);
                        pathTemps.Add(new PathTemp
                        {
                            pathSlice = Path2[k..],
                            key = k,
                            resInfo = resInfo[i + 1],
                            isAtlas = Path2.EndsWith(".PTX"),
                        });
                        break;
                    }
                }
            }
            return pathTemps;
        }

        public static bool IsNotASCII(string str)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] > 127) return true;
            }
            return false;
        }

        protected static async Task<Task> EncodeData(string packetFolder, uint flags, List<PathTemp> pathTemps, bool useResFolder, BinaryWriter RSGWriter)
        {
            using (var part0Stream = new MemoryStream())
            using (var part1Stream = new MemoryStream())
            using (var part0Writer = new BinaryWriter(part0Stream))
            using (var part1Writer = new BinaryWriter(part1Stream))
            {
                uint dataPos = 0;
                uint atlasPos = 0;
                var RSGHeadInfo = new RSG_head();
                RSGWriter.BaseStream.Position = 0x5C;
                for (var i = 0; i < pathTemps.Count; i++)
                {
                    var beginOffset = RSGWriter.BaseStream.Position;
                    var staticPacketInfo = pathTemps[i].resInfo;
                    RSGWriter.Write(WriteStringFourByte(pathTemps[i].pathSlice));
                    var backupWriteOffset = RSGWriter.BaseStream.Position;
                    for (var h = 0; h < pathTemps[i].positions.Count; h++)
                    {
                        RSGWriter.BaseStream.Position = beginOffset + pathTemps[i].positions[h].offset * 4 + 1;
                        RSGWriter.Write(WriteInt24LE(pathTemps[i].positions[h].position));
                    }
                    RSGWriter.BaseStream.Position = backupWriteOffset;
                    var fileBytes = (await StandandsModule.ReadFileAsync(useResFolder ? Path.Join(packetFolder, "res", staticPacketInfo.path) : Path.Join(packetFolder, staticPacketInfo.path))).ToArray();
                    var appendBytes = BeautifyLengthForFile((uint)fileBytes.Length);
                    if (pathTemps[i].isAtlas)
                    {
                        part1Writer.Write(fileBytes);
                        WriteNull(part1Writer, appendBytes);
                        RSGWriter.Write((uint)1);
                        RSGWriter.Write(atlasPos);
                        RSGWriter.Write((uint)fileBytes.Length);
                        RSGWriter.Write(staticPacketInfo.ptx_info!.id);
                        RSGWriter.BaseStream.Position += 8;
                        RSGWriter.Write(staticPacketInfo.ptx_info!.width);
                        RSGWriter.Write(staticPacketInfo.ptx_info!.height);
                        atlasPos += (uint)fileBytes.Length + appendBytes;
                    }
                    else
                    {
                        part0Writer.Write(fileBytes);
                        WriteNull(part0Writer, appendBytes);
                        RSGWriter.Write((uint)0);
                        RSGWriter.Write(dataPos);
                        RSGWriter.Write((uint)fileBytes.Length);
                        dataPos += (uint)fileBytes.Length + appendBytes;
                    }
                }
                {
                    RSGHeadInfo.fileList_Length = (int)RSGWriter.BaseStream.Length - 0x5C;
                    var appendBytes = BeautifyLength((uint)RSGWriter.BaseStream.Length);
                    RSGWriter.BaseStream.Position += appendBytes;
                }
                {
                    if (part0Stream.Length > 0)
                    {
                        RSGHeadInfo.part0_Offset = (int)RSGWriter.BaseStream.Position;
                        var dataBytes = part0Stream.ToArray();
                        if (flags > 2)
                        {
                            var ZlibData = (await StandandsModule.ZlibCompress(dataBytes)).ToArray();
                            var appendBytes = BeautifyLength((uint)ZlibData.Length);
                            RSGWriter.Write(ZlibData);
                            WriteNull(RSGWriter, appendBytes);
                            RSGHeadInfo.part0_Zlib = ZlibData.Length + (int)appendBytes;
                        }
                        else
                        {
                            RSGWriter.Write(dataBytes);
                            RSGHeadInfo.part0_Zlib = dataBytes.Length;
                        }
                        RSGHeadInfo.part0_Size = dataBytes.Length;
                        RSGHeadInfo.part1_Offset = (int)RSGWriter.BaseStream.Position;
                    }
                    if (part1Stream.Length > 0)
                    {
                        var dataBytes = part1Stream.ToArray();
                        if (flags == 1 || flags == 3)
                        {
                            if (flags == 3 && RSGHeadInfo.part0_Offset == 0)
                            {
                                RSGHeadInfo.part0_Size = 0;
                                RSGHeadInfo.part0_Offset = (int)RSGWriter.BaseStream.Position;
                                RSGHeadInfo.part0_Size = RSGHeadInfo.part0_Zlib = (int)RSGWriter.BaseStream.Position;
                                RSGWriter.Write((await StandandsModule.ZlibCompress(zlibData)).ToArray());
                            }
                            RSGHeadInfo.part1_Offset = (int)RSGWriter.BaseStream.Position;
                            var ZlibData = (await StandandsModule.ZlibCompress(dataBytes)).ToArray();
                            var appendBytes = BeautifyLength((uint)ZlibData.Length);
                            RSGWriter.Write(ZlibData);
                            WriteNull(RSGWriter, appendBytes);
                            RSGHeadInfo.part1_Zlib = ZlibData.Length + (int)appendBytes;
                        }
                        else
                        {
                            if (flags == 2 && RSGHeadInfo.part0_Offset == 0)
                            {
                                RSGHeadInfo.part0_Size = 0;
                                RSGHeadInfo.part0_Offset = (int)RSGWriter.BaseStream.Position;
                                RSGHeadInfo.part0_Size = RSGHeadInfo.part0_Zlib = (int)RSGWriter.BaseStream.Position;
                                RSGWriter.Write((await StandandsModule.ZlibCompress(zlibData)).ToArray());
                            }
                            RSGHeadInfo.part1_Offset = (int)RSGWriter.BaseStream.Position;
                            RSGWriter.Write(dataBytes);
                            RSGHeadInfo.part1_Zlib = dataBytes.Length;
                        }
                    }
                }
                {
                    RSGWriter.BaseStream.Position = 0x10;
                    RSGWriter.Write(flags);
                    RSGWriter.Write(RSGHeadInfo.part0_Offset);
                    RSGWriter.Write(RSGHeadInfo.part0_Offset);
                    RSGWriter.Write(RSGHeadInfo.part0_Zlib);
                    RSGWriter.Write(RSGHeadInfo.part0_Size);
                    RSGWriter.BaseStream.Position += 4;
                    RSGWriter.Write(RSGHeadInfo.part1_Offset);
                    RSGWriter.Write(RSGHeadInfo.part1_Zlib);
                    RSGWriter.Write(RSGHeadInfo.part1_Size);
                    RSGWriter.BaseStream.Position += 20;
                    RSGWriter.Write(RSGHeadInfo.fileList_Length);
                    RSGWriter.Write((uint)0x5C);
                }
            }
            return Task.CompletedTask;
        }

        protected static void WriteNull(BinaryWriter RSGWriter, uint size)
        {
            if (size != 0)
            {
                RSGWriter.BaseStream.Position += size - 1;
                RSGWriter.Write((byte)0x0);
            }
        }

        protected static byte[] WriteStringFourByte(string str)
        {
            var strLength = str.Length;
            byte[] str_bytes = new byte[strLength * 4 + 4];
            for (var i = 0; i < strLength; i++)
            {
                str_bytes[i * 4] = (byte)str[i];
            }
            return str_bytes;
        }

        protected static byte[] WriteInt24LE(int number)
        {
            var num_bytes = new byte[3];
            num_bytes[0] = (byte)number;
            num_bytes[1] = (byte)(number >> 8);
            num_bytes[2] = (byte)(number >> 16);
            return num_bytes;
        }

        protected static uint BeautifyLengthForFile(uint oriLength)
        {
            if (oriLength % 4096 == 0)
            {
                return 0;
            }
            else
            {
                return 4096 - (oriLength % 4096);
            }
        }

        protected static uint BeautifyLength(uint oriLength)
        {
            if (oriLength % 4096 == 0)
            {
                return 4096;
            }
            else
            {
                return 4096 - (oriLength % 4096);
            }
        }
    }
}