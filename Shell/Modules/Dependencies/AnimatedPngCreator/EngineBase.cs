using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMK
{
    internal class EngineBase
    {
        protected static readonly Byte[] IEND = { 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 };
        protected static readonly Byte[] SIGNATURE = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };

        internal class CrcCalculator
        {
            long[] pTable = new long[256];

            //Für Standard CRC32:
            //(Wert kann verändert werden)
            long Poly = 0xEDB88320;

            public CrcCalculator()
            {
                long CRC;
                int i, j;
                for (i = 0; i < 256; i++)
                {
                    CRC = i;
                    for (j = 0; j < 8; j++)
                        if ((CRC & 0x1) == 1)
                            CRC = (CRC >> 1) ^ Poly;
                        else
                            CRC = (CRC >> 1);
                    pTable[i] = CRC;
                }
            }

            public uint GetCRC32(byte[] input)
            {
                long StreamLength, CRC;
                StreamLength = input.Length;
                CRC = 0xFFFFFFFF;
                for (int i = 0; i < input.Length; i++)
                    CRC = ((CRC & 0xFFFFFF00) / 0x100) & 0xFFFFFF ^ pTable[input[i] ^ CRC & 0xFF];
                CRC = (-(CRC)) - 1; // !(CRC)
                return (uint)CRC;
            }
        }

        public static byte[] getSwappedCrc(byte[] chunk)
        {
            var crc32 = new CrcCalculator();
            var crc = crc32.GetCRC32(chunk);
            var crcArray = BitConverter.GetBytes(crc);
            Array.Reverse(crcArray);
            return crcArray;
        }

        public static byte[] getSwappedArray(int i)
        {
            Byte[] bytes = BitConverter.GetBytes(i);
            Array.Reverse(bytes);
            return bytes;
        }

        public static byte[] getSwappedArray(short s)
        {
            Byte[] bytes = BitConverter.GetBytes(s);
            Array.Reverse(bytes);
            return bytes;
        }

        protected List<Byte[]> find_IHDR(Stream png)
        {
            return find(png, "IHDR".ToCharArray());
        }

        protected List<Byte[]> find_IDAT(Stream png)
        {
            return find(png, "IDAT".ToCharArray());
        }

        protected List<Byte[]> find(Stream png, Char[] search)
        {
            List<Byte[]> result = new List<byte[]>();
            var searchBytes = search.Select(c => (byte)c).ToArray();
            Byte[] bytes = new Byte[search.Length];
            int i = 0;
            int found = 0;
            while (i < png.Length - 4)
            {
                png.Flush();
                png.Position = i;
                var debug = png.Read(bytes, 0, search.Length);
                i++;
                if (bytes.SequenceEqual(searchBytes))
                {
                    Byte[] rawLength = new Byte[4];
                    png.Position -= 8;
                    png.Read(rawLength, 0, 4);
                    Array.Reverse(rawLength);
                    UInt32 length = BitConverter.ToUInt32(rawLength, 0);
                    result.Add(new Byte[length + 12]);
                    png.Position -= 4;
                    png.Read(result[found], 0, (int)(length + 12));
                    found++;
                }
            }
            return result;
        }

        public List<int> FindSequence(byte[] bytes, byte[] seqBytes)
        {
            int i = 0;
            var result = new List<int>();
            byte[] buffer = new byte[bytes.Length];
            while (i < seqBytes.Length)
            {
                buffer.Skip(1)
                    .ToArray()
                    .CopyTo(buffer, 0);
                buffer[bytes.Length - 1] = seqBytes[i];
                if (buffer.SequenceEqual(bytes))
                    result.Add(i - bytes.Length + 1);
                i++;
            }
            return result;
        }

        public List<int> FindSequence(byte[] bytes, Stream stream)
        {
            int i = 0;
            var result = new List<int>();
            byte[] buffer = new byte[bytes.Length];
            while (i < stream.Length)
            {
                buffer.Skip(1)
                    .ToArray()
                    .CopyTo(buffer, 0);
                buffer[bytes.Length - 1] = (byte)stream.ReadByte();
                if (buffer.SequenceEqual(bytes))
                    result.Add(i - bytes.Length + 1);
                i++;
            }
            stream.Flush();
            return result;
        }
    }
}
