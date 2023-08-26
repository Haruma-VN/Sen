
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

        public abstract byte[] CompressGZip(byte[] dataStream);

        public abstract byte[] UncompressGZip(byte[] zlibData);

        public abstract byte[] CompressDeflate(byte[] dataStream);

        public abstract byte[] UncompressDeflate(byte[] zlibData);

        public abstract byte[] CompressBzip2(byte[] dataStream);

        public abstract byte[] UncompressBzip2(byte[] zlibData);

        public abstract byte[] CompressLzma(byte[] dataStream);

        public abstract byte[] UncompressLzma(byte[] zlibData);

    }
    public enum ZlibCompressionLevel
    {
        NO_COMPRESSION,
        DEFAULT_COMPRESSION,
        BEST_SPEED,
        BEST_COMPRESSION,
        DEFLATED,
    }

    public static class SenAPI
    {

        private const string LibraryModule = $"./Internal";

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr ZlibCompress(byte[] data, int dataSize, int level, out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void ZlibUncompress(byte[] data, int dataSize, out IntPtr uncompressedData, out int uncompressedDataSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr OpenFileDialog(string title, int size, string[] filters);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr OpenMultipleFileDialog(string title, int size, string[] filters);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr OpenDirectoryDialog(string title);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr SaveFileDialog(string title, int size, string[] filters);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void SendLosNotification(string title, string message, string info);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void SendMessageBox(string title, string message, string btn_display);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr GZipCompress(byte[] data, int dataSize, out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr GZipUncompress(byte[] data, int dataSize, out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void DeflateCompress(byte[] data, int dataSize, out IntPtr compressedData, out int size);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void DeflateUncompress(byte[] input, int input_size, out IntPtr output, out int output_size);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr BZip2Compress(byte[] data, int dataSize, out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr BZip2Uncompress(byte[] data, int dataSize, out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void lzmaCompress(byte[] data, int dataSize, out IntPtr compressData ,out int compressedSize);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern void lzmaUncompress(byte[] data, int dataSize, out IntPtr uncompressedData ,out int compressedSize);

    }


    public class Compress : Abstract_Compress
    {

        public override byte[] UncompressZlib(byte[] zlibData)
        {
            IntPtr uncompressedDataPtr;
            int uncompressedDataSize;
            SenAPI.ZlibUncompress(zlibData, zlibData.Length, out uncompressedDataPtr, out uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressGZip(byte[] zlibData)
        {
            IntPtr uncompressedDataPtr = SenAPI.GZipUncompress(zlibData, zlibData.Length, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressDeflate(byte[] zlibData)
        {
            SenAPI.DeflateUncompress(zlibData, zlibData.Length, out IntPtr output, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(output, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(output);
            return uncompressedData;
        }

        public override byte[] UncompressBzip2(byte[] data)
        {
            IntPtr uncompressedDataPtr = SenAPI.BZip2Uncompress(data, data.Length, out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] UncompressLzma(byte[] lzma)
        {
            SenAPI.lzmaUncompress(lzma, lzma.Length, out IntPtr uncompressedDataPtr ,out int uncompressedDataSize);
            byte[] uncompressedData = new byte[uncompressedDataSize];
            Marshal.Copy(uncompressedDataPtr, uncompressedData, 0, uncompressedDataSize);
            Marshal.FreeHGlobal(uncompressedDataPtr);
            return uncompressedData;
        }

        public override byte[] CompressGZip(byte[] dataStream)
        {
            IntPtr compressedDataPtr = SenAPI.GZipCompress(dataStream, dataStream.Length, out var compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressBzip2(byte[] dataStream)
        {
            IntPtr compressedDataPtr = SenAPI.BZip2Compress(dataStream, dataStream.Length, out var compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressedDataPtr, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressLzma(byte[] dataStream)
        {
            SenAPI.lzmaCompress(dataStream, dataStream.Length, out IntPtr compressData ,out int compressedSize);
            byte[] compressedData = new byte[compressedSize];
            Marshal.Copy(compressData, compressedData, 0, compressedSize);
            return compressedData;

        }

        public override byte[] CompressDeflate(byte[] dataStream)
        {
            SenAPI.DeflateCompress(dataStream, dataStream.Length, out var compressedData, out var size);
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
            int compressedSize;
            IntPtr compressedDataPtr = SenAPI.ZlibCompress(dataStream, dataStream.Length, compressionLevel, out compressedSize);
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
