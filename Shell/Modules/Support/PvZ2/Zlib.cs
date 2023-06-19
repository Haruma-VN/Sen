using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class ZlibAbstract
    {
        public abstract byte[] ZlibCompress(string ripefile, bool use64bitvariant);

        public abstract byte[] ZlibUncompress(string ripefile, bool use64bitvariant);

    }


    public unsafe class Zlib : ZlibAbstract
    {
        public static readonly byte[] header = new byte[] { 0xD4, 0xFE, 0xAD, 0xDE };

        public override unsafe byte[] ZlibCompress(string ripefile, bool use64bitvariant)
            {
                #pragma warning disable CS8500
                var fs = new FileSystem();
                FileSystem* file_stream = &fs;
                var ripe_data = file_stream->ReadBytes(ripefile);
                Marshal.FreeHGlobal((IntPtr)file_stream);
                var length = ripe_data.Length;
                var value = uint.Parse(length.ToString("x"), System.Globalization.NumberStyles.HexNumber);
                byte[] bits = BitConverter.GetBytes(value);
                var bytes = use64bitvariant switch
                {
                    true => JavaScript.Implement.Buffer.Concat(Zlib.header, JavaScript.Implement.Buffer.Alloc(4).ToArray(), bits),
                    false => JavaScript.Implement.Buffer.Concat(Zlib.header, bits)
                };
                var buffer = JavaScript.Implement.Buffer.From(bytes).ToArray();
                var compress = new Compress();
                var zlib_data = compress.CompressZlibBytes<byte[]>(ripe_data, ZlibCompressionLevel.Level9);
                return use64bitvariant ? JavaScript.Implement.Buffer.Concat(buffer, JavaScript.Implement.Buffer.Alloc(4).ToArray(), zlib_data)
                    : JavaScript.Implement.Buffer.Concat(buffer, zlib_data);
            }


        public unsafe override byte[] ZlibUncompress(string ripefile, bool use64bitvariant)
        {
            #pragma warning disable CS8500
            var fs = new FileSystem();
            FileSystem* file_stream = &fs;
            var ripe_data = file_stream->ReadBytes(ripefile);
            Marshal.FreeHGlobal((IntPtr)file_stream);
            var buffer = use64bitvariant switch
            {
                true => JavaScript.Implement.Buffer.Slice(ripe_data, 16, ripe_data.Length - 16),
                false => JavaScript.Implement.Buffer.Slice(ripe_data, 8, ripe_data.Length - 8),

            };
            byte[]* buffer_ptr = &buffer;
            var uncompress = new Compress();
            Compress* uncompress_ptr = &uncompress;
            var zlib_uncompress_data = uncompress_ptr->UncompressZlibBytes<byte[]>(*buffer_ptr);
            return zlib_uncompress_data;
        }
    }
}
