using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace PngParser
{
    public class Png
    {
        static readonly byte[] signature = new byte [] { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a };
        private List<PngChunk> chunks;

        public Png(BinaryReader stream)
        {
            chunks = new List<PngChunk>();
            byte[] s = stream.ReadBytes(8);
            for (int i = 0; i < 8; i++) if (s[i] != signature[i]) throw new Exception("Signature is unmatched at PNG format");
            while (true)
            {
                byte[] _size = stream.ReadBytes(4);
                if (_size.Length == 0) break;
                if (_size.Length != 4) throw new Exception("読み取りブロックエラー");
                int size = ToInteger(_size);
                chunks.Add(ReadChunk(stream, size));
            }
            stream.Close();
        }

        public Png(string file) : this(new BinaryReader(new FileStream(file, FileMode.Open))) { }

        public Png(byte [] data) : this(new BinaryReader(new MemoryStream(data, false))) { }

        private PngChunk ReadChunk(BinaryReader reader, int size)
        {
            byte[] type = reader.ReadBytes(4);
            string _type = Encoding.ASCII.GetString(type);

            PngChunk chunk;
            byte[] data = reader.ReadBytes(size);

            switch (_type)
            {
                case "IHDR":
                    chunk = new PngIHDRChunk(data);
                    break;
                case "IDAT":
                    chunk = new PngIDATChunk(data);
                    break;
                default:
                    chunk = new PngChunk(type, data);
                    break;
            }
            uint read_crc = (uint)ToInteger(reader.ReadBytes(4));

            uint calculated_crc = chunk.Crc();
            if (read_crc != calculated_crc) throw new Exception("CRCエラー"); 

            return chunk;
        }

        private int ToInteger(byte [] bytes)
        {
            return bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
        }

        public void Save(string file)
        {
            using (var w = new BinaryWriter(new FileStream(file, FileMode.Create)))
            {
                w.Write(signature);
                foreach(var chunk in chunks)
                {
                    w.Write(chunk.ToBytes());
                }
            }
        }

        public void SaveApng(string file, Png [] frames, ushort delay_num, ushort delay_density)
        {
            using (var w = new BinaryWriter(new FileStream(file, FileMode.Create)))
            {
                w.Write(signature);

                PngIHDRChunk ihdr = (PngIHDRChunk)chunks.Find(d => d.IsType("IHDR"));
                w.Write(ihdr.ToBytes());

                w.Write(new PngacTLChunk((uint)(frames.Length + 1), 0).ToBytes());

                uint sequence = 0;
                w.Write(new PngfcTLChunk(ihdr, sequence++, delay_num, delay_density).ToBytes());

                foreach (var chunk in chunks.FindAll(d=> d.IsType("IDAT")))
                {
                    w.Write(chunk.ToBytes());
                }

                foreach(Png frame in frames)
                {
                    w.Write(new PngfcTLChunk(ihdr, sequence++, delay_num, delay_density).ToBytes());
                    foreach(var chunk in frame.chunks.FindAll(d => d.IsType("IDAT")))
                    {
                        w.Write(((PngIDATChunk)chunk).TofdATChunk(sequence++).ToBytes());
                    }
                }

                w.Write(chunks.Find(d => d.IsType("IEND")).ToBytes());
            }
        }
    }
}
