using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Sen.Shell.Kernel.Internal
{
    public static partial class LotusAPI
    {

        private const string LibraryModule = $"./Internal";

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr ZlibCompress(byte[] data, int dataSize, int level, out int compressedSize);

        [LibraryImport(LibraryModule)][UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })] 
        public static partial void ZlibUncompress(byte[] data, int dataSize, out IntPtr uncompressedData, out int uncompressedDataSize);

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

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr GZipCompress(byte[] data, int dataSize, out int compressedSize);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr GZipUncompress(byte[] data, int dataSize, out int compressedSize);

        [LibraryImport(LibraryModule)][UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })] 
        public static partial void DeflateCompress(byte[] data, int dataSize, out IntPtr compressedData, out int size);

        [LibraryImport(LibraryModule)][UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial void DeflateUncompress(byte[] input, int input_size, out IntPtr output, out int output_size);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr BZip2Compress(byte[] data, int dataSize, out int compressedSize);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr BZip2Uncompress(byte[] data, int dataSize, out int compressedSize);

        [LibraryImport(LibraryModule)][UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })] public static partial void lzmaCompress(byte[] data, int dataSize, out IntPtr compressData, out int compressedSize);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial void lzmaUncompress(byte[] data, int dataSize, out IntPtr uncompressedData, out int compressedSize);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr VCDiffEncode(byte[] before, int before_size, byte[] after, int after_size, out int patch_size);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial IntPtr VCDiffDecode(byte[] before, int before_size, byte[] patch, int patch_size, out int after_size);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial int InternalVersion();

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public static partial Architecture GetProcessorArchitecture();

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public unsafe static partial void EncodeETC1Fast(uint* src, ulong* dst, uint block, uint width);

        [LibraryImport(LibraryModule)]
        [UnmanagedCallConv(CallConvs = new Type[] { typeof(System.Runtime.CompilerServices.CallConvCdecl) })]
        public unsafe static partial void EncodeETC1Slow(void* dst, uint* src);

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr MD5Hash(string str, int size);

    }
}
