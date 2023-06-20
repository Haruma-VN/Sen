using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Support.Compress
{

    using Buffer = JavaScript.Implement.Buffer;

    using Compress = Standards.Compress;


    public abstract class ZlibAbstract
    {
        public abstract byte[] ZlibCompress(ZlibCompress options);

        public abstract byte[] ZlibUncompress(string ripefile, bool use64bitvariant);

    }

    public unsafe class ZlibBase
    {

        public unsafe readonly byte[] header = new byte[] { 0xD4, 0xFE, 0xAD, 0xDE };

        public unsafe readonly byte[] blank = new byte[] { 0x00, 0x00, 0x00, 0x00 };
    }

    public struct ZlibCompress
    {
        public string RipeFile;

        public bool Use64BitVariant;

        public ZlibCompressionLevel ZlibLevel;
    }


    public unsafe class PopCapZlib : ZlibAbstract
    {
        public PopCapZlib() { }


        public override unsafe byte[] ZlibCompress(ZlibCompress options)
        {
                #pragma warning disable CS8500
                var fs = new FileSystem();
                FileSystem* file_stream = &fs;
                var ripe_data = file_stream->ReadBytes(options.RipeFile);
                Marshal.FreeHGlobal((IntPtr)file_stream);
                var length = ripe_data.Length;
                var value = uint.Parse(length.ToString("x"), System.Globalization.NumberStyles.HexNumber);
                var bits = BitConverter.GetBytes(value);
                void* bits_ptr = &bits;
                var zlib_base = new ZlibBase();
                void* zlib_base_ptr = &zlib_base;
                if (((byte[]*)bits_ptr)->Length < 4)
                {
                    byte[] padding = ((ZlibBase*)zlib_base_ptr)->blank;
                    (*(byte[]*)bits_ptr) = padding.Concat(bits).ToArray();
                }
                if(((byte[]*)bits_ptr)->Length > 4) {
                    throw new ZlibException($"zlib_array_unsupported", $"{options.RipeFile}");
                }
                var bytes = options.Use64BitVariant switch
                {
                    true => Buffer.Concat(((ZlibBase*)zlib_base_ptr)->header, ((ZlibBase*)zlib_base_ptr)->blank, 
                    (*(byte[]*)bits_ptr)),
                    false => Buffer.Concat(((ZlibBase*)zlib_base_ptr)->header, (*(byte[]*)bits_ptr))
                };
                var buffer = Buffer.From(bytes).ToArray();
                var compress = new Compress();
                void* compress_ptr = &compress;
                var zlib_data = ((Compress*)compress_ptr)->CompressZlibBytes<byte[]>(ripe_data, options.ZlibLevel);
                return options.Use64BitVariant ? Buffer.Concat(buffer, ((ZlibBase*)zlib_base_ptr)->blank, zlib_data)
                    : Buffer.Concat(buffer, zlib_data);
            }


        public unsafe override byte[] ZlibUncompress(string ripefile, bool use64bitvariant)
        {
            #pragma warning disable CS8500
            var fs = new FileSystem();
            void* file_stream = &fs;
            var ripe_data = ((FileSystem*)file_stream)->ReadBytes(ripefile);
            Marshal.FreeHGlobal((IntPtr)file_stream);
            var buffer = use64bitvariant switch
            {
                true => Buffer.Slice(ripe_data, 16, ripe_data.Length - 16),
                false => Buffer.Slice(ripe_data, 8, ripe_data.Length - 8),

            };
            void* buffer_ptr = &buffer;
            var uncompress = new Compress();
            void* uncompress_ptr = &uncompress;
            try
            {
                var zlib_uncompress_data = ((Compress*)uncompress_ptr)->UncompressZlibBytes<byte[]>(*(byte[]*)buffer_ptr);
                return zlib_uncompress_data;
            }
            catch
            {
                throw new ZlibException($"zlib_array_unsupported", $"{ripefile}");
            }
        }
    }
}
