
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip.Compression;
using ICSharpCode.SharpZipLib.Zip.Compression.Streams;
using ICSharpCode.SharpZipLib.Zip;
using System.Runtime.InteropServices;
using Sen.Shell.Modules.Internal;
using ICSharpCode.SharpZipLib.GZip;
using ICSharpCode.SharpZipLib.Tar;

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

        public abstract byte[] CompressGZip(byte[] dataStream);

        public abstract byte[] UncompressGZip(byte[] zlibData);

        public abstract byte[] CompressDeflate(byte[] dataStream);

        public abstract byte[] UncompressDeflate(byte[] zlibData);

        public abstract byte[] CompressBzip2(byte[] dataStream);

        public abstract byte[] UncompressBzip2(byte[] zlibData);

        public abstract byte[] CompressLzma(byte[] dataStream);

        public abstract byte[] UncompressLzma(byte[] zlibData);

        public abstract void TarGzCompress(string inDirectory, string outDirectory);

    }
    public enum ZlibCompressionLevel
    {
        NO_COMPRESSION,
        DEFAULT_COMPRESSION,
        BEST_SPEED,
        BEST_COMPRESSION,
        DEFLATED,
    }


    public class Compress : Abstract_Compress
    {
        public unsafe override void TarGzCompress(string sourceDirectory, string tgzFilename)
        {
            using var outStream = File.Create(tgzFilename);
            using var gzoStream = new GZipOutputStream(outStream);
            using var tarArchive = TarArchive.CreateOutputTarArchive(gzoStream);
            tarArchive.RootPath = sourceDirectory.Replace('\\', '/');
            AddDirectoryFilesToTar(tarArchive, sourceDirectory, true);
            return;
        }

        private static void AddDirectoryFilesToTar(TarArchive tarArchive, string sourceDirectory, bool is_recursive)
        { 
            if (is_recursive)
            {
               var directories = Directory.GetDirectories(sourceDirectory);
               foreach (var directory in directories)
                    {

                        AddDirectoryFilesToTar(tarArchive, directory, is_recursive);
                    }
            }
            var filenames = Directory.GetFiles(sourceDirectory);
            foreach (var filename in filenames)
            {
                var tarEntry = TarEntry.CreateEntryFromFile(filename);
                tarEntry.Name = filename.Substring(sourceDirectory.Length + 1);
                tarArchive.WriteEntry(tarEntry, true);
            }
            return;
        }

        public override byte[] UncompressZlib(byte[] zlibData)
        {
            LotusAPI.ZlibUncompress(zlibData, zlibData.Length, out var uncompressedDataPtr, out var uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressGZip(byte[] zlibData)
        {
            IntPtr uncompressedDataPtr = LotusAPI.GZipUncompress(zlibData, zlibData.Length, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressDeflate(byte[] zlibData)
        {
            LotusAPI.DeflateUncompress(zlibData, zlibData.Length, out IntPtr output, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(output, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(output);
            return uncompressedData;
        }

        public override byte[] UncompressBzip2(byte[] data)
        {
            IntPtr uncompressedDataPtr = LotusAPI.BZip2Uncompress(data, data.Length, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressLzma(byte[] lzma)
        {
            LotusAPI.lzmaUncompress(lzma, lzma.Length, out IntPtr uncompressedDataPtr ,out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] CompressGZip(byte[] dataStream)
        {
            IntPtr compressedDataPtr = LotusAPI.GZipCompress(dataStream, dataStream.Length, out var compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressBzip2(byte[] dataStream)
        {
            IntPtr compressedDataPtr = LotusAPI.BZip2Compress(dataStream, dataStream.Length, out var compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressLzma(byte[] dataStream)
        {
            LotusAPI.lzmaCompress(dataStream, dataStream.Length, out IntPtr compressData ,out int compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressData, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressDeflate(byte[] dataStream)
        {
            LotusAPI.DeflateCompress(dataStream, dataStream.Length, out var compressedData, out var size);
            byte[] deflateData = new byte[size];
            Marshal.Copy(compressedData, deflateData, 0, size);
            Marshal.FreeHGlobal(compressedData);
            return deflateData;

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
            IntPtr compressedDataPtr = LotusAPI.ZlibCompress(dataStream, dataStream.Length, compressionLevel, out var compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override void CompressZip(string zip_output, string[] files, string[] directories)
        {
            using var zipStream = new ZipOutputStream(File.Create(zip_output));
            {
                if (files is not null)
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

                if (directories is not null)
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
                if (files is not null)
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

                if (directories is not null)
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
