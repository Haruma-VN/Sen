using Sen.Shell.Modules;
using Sen.Shell.Modules.Standards;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Internal
{
    public abstract class M_Internal
    {
        public abstract int InternalVersion();

        public abstract string GetProcessorArchitecture();
    }

    public enum Architecture
    {
        X64,
        ARM,
        INTEL,
        X86,
        UNKNOWN,
        ARM64,
    };

    public class SenAPI
    {
        private const string LibraryModule = $"./Internal";

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern int InternalVersion();

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern Architecture GetProcessorArchitecture();
    }

    public class Version : M_Internal
    {
        public override string GetProcessorArchitecture()
        {
             return SenAPI.GetProcessorArchitecture() switch
             {
                 Architecture.X64 => "x64",
                 Architecture.ARM => "ARM",
                 Architecture.INTEL => "Intel Itanium-based",
                 Architecture.X86 => "x86",
                 Architecture.UNKNOWN => "Unknown",
                 Architecture.ARM64 => "ARM64",
                 _ => throw new NotImplementedException(),
             };
        }

        public override int InternalVersion() => SenAPI.InternalVersion();
    }

    public class Compress
    {

        private Standards.Compress m_compress = new Standards.Compress();

        public Compress() { }

        public byte[] Zlib(byte[] data, Standards.ZlibCompressionLevel level = ZlibCompressionLevel.BEST_COMPRESSION) => m_compress.CompressZlib(data, level);


        public byte[] Gzip(byte[] data) => m_compress.CompressGZip(data);

        public byte[] Deflate(byte[] data) => m_compress.CompressDeflate(data);

    }

    public class Uncompress
    {

        private Standards.Compress m_compress = new Standards.Compress();

        public byte[] Zlib(byte[] data) => m_compress.UncompressZlib(data);

        public byte[] Gzip(byte[] data) => m_compress.UncompressGZip(data);

        public byte[] Deflate(byte[] data) => m_compress.UncompressDeflate(data);
    }
}
