
using System.IO.Compression;

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


        public override void CompressZip(string zip_output, string[] files, string[] directories)
        {
            using var zip = new Ionic.Zip.ZipFile();
            {
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        zip.AddFile(file);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        zip.AddDirectory(directory);
                    }
                }

                zip.Save(zip_output);
            }

            return;
        }


        public override async Task CompressZipAsync(string zipOutput, string[] files, string[] directories)
        {
            await Task.Run(() =>
            {
                using var zip = new Ionic.Zip.ZipFile();
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        zip.AddFile(file);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        zip.AddDirectory(directory);
                    }
                }

                zip.Save(zipOutput);
            });
            return;
        }


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
            using (ZLibStream zlibStream = new ZLibStream(new MemoryStream(dataBytes), CompressionMode.Decompress, true))
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
            using (MemoryStream outputStream = new MemoryStream())
            {
                using (ZLibStream compressionStream = new ZLibStream(outputStream, compressionLevel, true))
                {
                    compressionStream.Write(dataBytes, 0, dataBytes.Length);
                }

                compressedData = outputStream.ToArray();
            }
            return compressedData;
        }


        public override void UncompressZip(string zip_input, string extracted_directory)
        {
            try
            {
                using var zip = Ionic.Zip.ZipFile.Read(zip_input);
                {
                    zip.ExtractAll(extracted_directory);
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
                using var zip = Ionic.Zip.ZipFile.Read(zip_input);
                {
                    zip.ExtractAll(extracted_directory);
                }
            });
            return;
        }

    }
}
