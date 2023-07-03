
using ICSharpCode.SharpZipLib.Core;
using System.IO.Compression;
using ICSharpCode.SharpZipLib.Zip;

namespace Sen.Shell.Modules.Standards
{

    public abstract class Abstract_Compress
    {
        public abstract void CompressZip(string zip_output, string[] files, string[] directories);

        public abstract Task CompressZipAsync(string zip_output, string[] files, string[] directories);

        public abstract void UncompressZip(string zip_input, string extracted_directory);

        public abstract Task UncompressZipAsync(string zip_input, string extracted_directory);

        public abstract byte[] CompressZlibBytes<Generic_T>(Generic_T data, ZlibCompressionLevel compression_level);

        public abstract byte[] UncompressZlibBytes<Generic_T>(Generic_T zlibData) where Generic_T : IList<byte>;

    }
    public enum ZlibCompressionLevel
    {
        Optimal,
        Fastest,
        NoCompression,
        SmallestSize,
    }


    public class Compress : Abstract_Compress
    {



        public override byte[] UncompressZlibBytes<Generic_T>(Generic_T zlibData)
        {
            byte[] dataBytes;
            if (zlibData is byte[] byteArray)
            {
                dataBytes = byteArray;
            }
            else if (zlibData is Array array && array.GetType().GetElementType() == typeof(byte))
            {
                dataBytes = array.Cast<byte>().ToArray();
            }
            else
            {
                throw new Exception($"invalid_zlib");
            }
            using var zlibStream = new ZLibStream(new MemoryStream(dataBytes), CompressionMode.Decompress, true);
            {
                using var outputStream = new MemoryStream();
                {
                    zlibStream.CopyTo(outputStream);
                    return outputStream.ToArray();
                }
            }
        }


        public override byte[] CompressZlibBytes<Generic_T>(Generic_T data, ZlibCompressionLevel compression_level)
        {

            var compressionLevel = compression_level switch
            {
                ZlibCompressionLevel.Optimal => CompressionLevel.Optimal,
                ZlibCompressionLevel.Fastest => CompressionLevel.Fastest,
                ZlibCompressionLevel.NoCompression => CompressionLevel.NoCompression,
                ZlibCompressionLevel.SmallestSize => CompressionLevel.SmallestSize,
                _ => CompressionLevel.Optimal,

            };
            byte[] dataBytes;

            if (data is byte[] byteArray)
            {
                dataBytes = byteArray;
            }
            else
            {
                throw new Exception($"invalid_zlib");
            }
            byte[] compressedData;
            using var outputStream = new MemoryStream();
            {
                using var compressionStream = new ZLibStream(outputStream, compressionLevel, true);
                {
                    compressionStream.Write(dataBytes, 0, dataBytes.Length);
                }

                compressedData = outputStream.ToArray();
            }
            return compressedData;
        }

        public override void CompressZip(string zip_output, string[] files, string[] directories)
        {
            using var zipStream = new ZipOutputStream(File.Create(zip_output));
            {
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        var entry = new ZipEntry(Path.GetFileName(file));
                        entry.DateTime = DateTime.Now;
                        zipStream.PutNextEntry(entry);

                        using var fs = File.OpenRead(file);
                        fs.CopyTo(zipStream);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        var folderOffset = directory.Length + (directory.EndsWith("\\") ? 0 : 1);
                        CompressFolder(directory, zipStream, folderOffset);
                    }
                }

                zipStream.Finish();
                zipStream.Close();
            }

            return;
        }

        private void CompressFolder(string path, ZipOutputStream zipStream, int folderOffset)
        {
            var files = Directory.GetFiles(path);

            foreach (var filename in files)
            {
                var fileInfo = new FileInfo(filename);
                var entryName = filename.Substring(folderOffset);
                entryName = ZipEntry.CleanName(entryName);
                var newEntry = new ZipEntry(entryName);
                newEntry.DateTime = fileInfo.LastWriteTime;
                newEntry.Size = fileInfo.Length;

                zipStream.PutNextEntry(newEntry);

                using var buffer = fileInfo.OpenRead();
                StreamUtils.Copy(buffer, zipStream, new byte[4096]);
            }

            var folders = Directory.GetDirectories(path);

            foreach (var folder in folders)
            {
                CompressFolder(folder, zipStream, folderOffset);
            }
        }

        public override async Task CompressZipAsync(string zipOutput, string[] files, string[] directories)
        {
            await Task.Run(() =>
            {
                using var zipStream = new ZipOutputStream(File.Create(zipOutput));
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        var entry = new ZipEntry(Path.GetFileName(file));
                        entry.DateTime = DateTime.Now;
                        zipStream.PutNextEntry(entry);

                        using var fs = File.OpenRead(file);
                        fs.CopyTo(zipStream);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        var folderOffset = directory.Length + (directory.EndsWith("\\") ? 0 : 1);
                        CompressFolder(directory, zipStream, folderOffset);
                    }
                }

                zipStream.Finish();
                zipStream.Close();
            });
            return;
        }

        public override void UncompressZip(string zip_input, string extracted_directory)
        {
            try
            {
                using var fs = File.OpenRead(zip_input);
                using var zf = new ICSharpCode.SharpZipLib.Zip.ZipFile(fs);
                foreach (ZipEntry zipEntry in zf)
                {
                    if (!zipEntry.IsFile) continue;

                    var entryFileName = zipEntry.Name;
                    var buffer = new byte[4096];
                    var zipStream = zf.GetInputStream(zipEntry);

                    var fullZipToPath = Path.Combine(extracted_directory, entryFileName);
                    var directoryName = Path.GetDirectoryName(fullZipToPath);

                    if (!string.IsNullOrEmpty(directoryName))
                        Directory.CreateDirectory(directoryName);

                    using var streamWriter = File.Create(fullZipToPath);
                    StreamUtils.Copy(zipStream, streamWriter, buffer);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
            return;
        }

        public override async Task UncompressZipAsync(string zip_input, string extracted_directory)
        {
            await Task.Run(() =>
            {
                using var fs = File.OpenRead(zip_input);
                using var zf = new ICSharpCode.SharpZipLib.Zip.ZipFile(fs);
                foreach (ZipEntry zipEntry in zf)
                {
                    if (!zipEntry.IsFile)
                    {
                        continue;
                    }
                    var entryFileName = zipEntry.Name;
                    var buffer = new byte[4096];
                    var zipStream = zf.GetInputStream(zipEntry);

                    var fullZipToPath = Path.Combine(extracted_directory, entryFileName);
                    var directoryName = Path.GetDirectoryName(fullZipToPath);

                    if (!string.IsNullOrEmpty(directoryName))
                        Directory.CreateDirectory(directoryName);

                    using var streamWriter = File.Create(fullZipToPath);
                    StreamUtils.Copy(zipStream, streamWriter, buffer);
                }
            });
            return;
        }

    }
}
