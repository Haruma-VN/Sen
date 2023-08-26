using Sen.Shell.Modules;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
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

    public partial class SenAPI
    {
        private const string LibraryModule = $"./Internal";

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial int InternalVersion();

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial Architecture GetProcessorArchitecture();
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

        private readonly Standards.Compress m_compress = new Standards.Compress();

        public Compress() { }

        public byte[] Zlib(byte[] data, Standards.ZlibCompressionLevel level = ZlibCompressionLevel.BEST_COMPRESSION) => m_compress.CompressZlib(data, level);


        public byte[] Gzip(byte[] data) => m_compress.CompressGZip(data);

        public byte[] Deflate(byte[] data) => m_compress.CompressDeflate(data);

    }

    public class Uncompress
    {

        private readonly Standards.Compress m_compress = new ();

        public byte[] Zlib(byte[] data) => m_compress.UncompressZlib(data);

        public byte[] Gzip(byte[] data) => m_compress.UncompressGZip(data);

        public byte[] Deflate(byte[] data) => m_compress.UncompressDeflate(data);
    }

    /// <summary>
    /// Open VCDiff from Google, Support RSB-Patch
    /// </summary>

    public class VCDiff
    {
        public VCDiff() { }

        public byte[] Decode(byte[] before, byte[] patch)
        {
            var after = Sen.Shell.Modules.Standards.SenAPI.VCDiffDecode(before, before.Length, patch, patch.Length, out var size);
            byte[] afterData = new byte[size];
            Marshal.Copy(after, afterData, 0, size);
            Marshal.FreeHGlobal(after);
            return afterData;
        }

        public void Decode(string before, string patch, string after)
        {
            var sen = new SenBuffer(Decode(new SenBuffer(before).toBytes(), new SenBuffer(patch).toBytes()));
            sen.OutFile(after);
            return;
        }

        public byte[] Encode(byte[] before, byte[] after)
        {
            var patch = Sen.Shell.Modules.Standards.SenAPI.VCDiffEncode(before, before.Length, after, after.Length, out var size);
            byte[] patchData = new byte[size];
            Marshal.Copy(patch, patchData, 0, size);
            return patchData;
        }

        public void Encode(string before, string after, string patch)
        {
            var sen = new SenBuffer(Encode(new SenBuffer(before).toBytes(), new SenBuffer(after).toBytes()));
            sen.OutFile(patch);
            return;
        }
    }
}
