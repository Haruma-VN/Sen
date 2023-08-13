
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip.Compression;
using ICSharpCode.SharpZipLib.Zip.Compression.Streams;
using ICSharpCode.SharpZipLib.Zip;
using System.Runtime.InteropServices;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Reflection.Emit;

namespace Sen.Shell.Modules.Standards
{

    public abstract class Abstract_Compress
    {
        public abstract void CompressZip(string zip_output, string[] files, string[] directories);

        public abstract Task CompressZipAsync(string zip_output, string[] files, string[] directories);

        public abstract void UncompressZip(string zip_input, string extracted_directory);

        public abstract Task UncompressZipAsync(string zip_input, string extracted_directory);

        public abstract byte[] CompressZlib(byte[] dataStream, ZlibCompressionLevel compression_level);

        public abstract byte[] UncompressZlib(byte[] zlibData);

    }
    public enum ZlibCompressionLevel
    {
        NO_COMPRESSION,
        DEFAULT_COMPRESSION,
        BEST_SPEED,
        BEST_COMPRESSION,
        DEFLATED,
    }

    public class SenAPI
    {
        private const string LibraryModule = $"./Internal";

        [DllImport(LibraryModule)]
        public static extern IntPtr compress_zlib(byte[] data, int dataSize, int level, out int compressedSize);
    }


    public class Compress : Abstract_Compress
    {

        public override byte[] UncompressZlib(byte[] zlibData)
        {
            using (var outputStream = new MemoryStream())
            {
                using (InflaterInputStream inflaterStream = new InflaterInputStream(new MemoryStream(zlibData)))
                {
                    inflaterStream.CopyTo(outputStream);
                }
                return outputStream.ToArray();
            }
        }


        public override byte[] CompressZlib(byte[] dataStream, ZlibCompressionLevel compression_level)
        {

            var compressionLevel = compression_level switch
            {
                ZlibCompressionLevel.NO_COMPRESSION => Deflater.NO_COMPRESSION,
                ZlibCompressionLevel.DEFAULT_COMPRESSION => Deflater.DEFAULT_COMPRESSION,
                ZlibCompressionLevel.BEST_SPEED => Deflater.BEST_SPEED,
                ZlibCompressionLevel.BEST_COMPRESSION => Deflater.BEST_COMPRESSION,
                ZlibCompressionLevel.DEFLATED => Deflater.DEFLATED,
                _ => Deflater.DEFAULT_COMPRESSION,
            };
            int compressedSize;
            IntPtr compressedDataPtr = SenAPI.compress_zlib(dataStream, dataStream.Length, compressionLevel, out compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
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
