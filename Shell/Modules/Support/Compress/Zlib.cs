using Sen.Shell.Modules.Internal;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Support.Compress
{

    using Buffer = JavaScript.Implement.Buffer;

    using Compress = Standards.Compress;


    public abstract class ZlibAbstract
    {
        public abstract SenBuffer ZlibCompress(ZlibCompress options);

        public abstract byte[] ZlibUncompress(string ripefile, bool use64bitvariant);

        public abstract void CheckPopCapZlibMagic(byte[] header, string? filepath);

    }

    public unsafe class ZlibBase
    {

        public unsafe readonly byte[] magic = new byte[] { 0xD4, 0xFE, 0xAD, 0xDE };

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

        public override void CheckPopCapZlibMagic(byte[] header, string? filepath)
        {
            var testMagic = header.Take(4).ToArray();
            var zlib_base = new ZlibBase();
            if (!testMagic.SequenceEqual<byte>(zlib_base.magic))
            {
                throw new Exception($"mismatch_popcap_zlib_magic");
            };
        }

        public override unsafe SenBuffer ZlibCompress(ZlibCompress options)
        {
            var buffer = new SenBuffer();
            var destination = new SenBuffer(options.RipeFile);
            buffer.writeBytes([0xD4, 0xFE, 0xAD, 0xDE]);
            if (options.Use64BitVariant)
            {
                buffer.writeNull(4);
            }
            buffer.writeUInt32LE((uint)destination.length);
            if (options.Use64BitVariant)
            {
                buffer.writeNull(4);
            }
            var compress = new Standards.Compress();
            var data = compress.CompressZlib(destination.toBytes(), options.ZlibLevel);
            buffer.writeBytes(data);
            return buffer;
        }


        public unsafe override byte[] ZlibUncompress(string ripefile, bool use64bitvariant)
        {
            var buffer = new SenBuffer(ripefile);
            var magic = buffer.readUInt32LE();
            if (magic != 0xDEADFED4)
            {
                throw new Exception("mismatch_popcap_zlib_magic");
            }
            if (use64bitvariant)
            {
                buffer.slice(16, buffer.length);
            }
            else
            {
                buffer.slice(8, buffer.length);
            }
            var compress = new Compress();
            return compress.UncompressZlib(buffer.toBytes());
        }
    }
}
