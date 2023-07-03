using ICSharpCode.SharpZipLib.BZip2;
using System.IO.Compression;

namespace Sen.Shell.Modules.Support.Compress.Other
{
    public unsafe class Bzip2
{
    public unsafe static byte[] Uncompress(byte[] compressedData)
    {
        using var compressedStream = new MemoryStream(compressedData);
        using var bzip2Stream = new BZip2InputStream(compressedStream);
        using var decompressedStream = new MemoryStream();
        {
            bzip2Stream.CopyTo(decompressedStream);
            return decompressedStream.ToArray();
        }
    }

    public unsafe static byte[] Compress(byte[] data)
    {
        using var originalStream = new MemoryStream(data);
        using var compressedStream = new MemoryStream();
        using (var bzip2Stream = new BZip2OutputStream(compressedStream))
        {
            originalStream.CopyTo(bzip2Stream);
        }
        return compressedStream.ToArray();
    }
}

    public unsafe class Base64
    {
        public unsafe static string Encode(byte[] data)
        {
            return Convert.ToBase64String(data);
        }

        public unsafe static byte[] Decode(string data)
        {
            return Convert.FromBase64String(data);
        }

    }

    public class Zlib
    {
        public static byte[] CompressZlibBytes(byte[] data, CompressionLevel compressionLevel)
        {
            using var memoryStream = new MemoryStream();
            {
                using var zlibStream = new DeflateStream(memoryStream, compressionLevel);
                {
                    zlibStream.Write(data, 0, data.Length);
                }
                return memoryStream.ToArray();
            }
        }

        public static byte[] UncompressZlibBytes(byte[] compressedData)
        {
            using var compressedStream = new MemoryStream(compressedData);
            using var zlibStream = new DeflateStream(compressedStream, CompressionMode.Decompress);
            using var outputStream = new MemoryStream();
            {
                zlibStream.CopyTo(outputStream);
                return outputStream.ToArray();
            }
        }


    }

}
