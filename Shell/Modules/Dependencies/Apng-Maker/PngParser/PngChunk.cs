using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngChunk
    {
        protected byte[] Type;
        protected byte[] Data;

        protected PngChunk(byte [] data)
        {
            Type = new byte[4];
            Data = data;
        }

        public PngChunk(string type, byte []data) : this(data)
        {
            SetType(type);
        }

        public PngChunk(byte[] type, byte [] data) : this(data)
        {
            Array.Copy(type, Type, 4);
        }

        protected void SetType(string typeString)
        {
            Type = Encoding.ASCII.GetBytes(typeString);
        }

        public uint Crc()
        {
            uint crc = 0xFFFFFFFF;   /* 0xFFFFFFFFで初期化する */
            uint magic = 0xEDB88320; /* 反転したマジックナンバー */
            uint[] table = new uint[256];                   /* 下位8ビットに対応する値を入れるテーブル */
            uint i, j;

            /* テーブルを作成する */
            for (i = 0; i < 256; i++)
            {      /* 下位8ビットそれぞれについて計算する */
                uint table_value = i;      /* 下位8ビットを添え字に、上位24ビットを0に初期化する */
                for (j = 0; j < 8; j++)
                {
                    uint b = (table_value & 1);   /* 上(反転したので下)から1があふれるかをチェックする */
                    table_value >>= 1;           /* シフトする */
                    if (b > 0) table_value ^= magic; /* 1があふれたらマジックナンバーをXORする */
                }
                table[i] = table_value;        /* 計算した値をテーブルに格納する */
            }

            /* テーブルを用いてCRC32を計算する */
            for (i = 0; i < Type.Length; i++)
            {
                crc = table[(crc ^ Type[i]) & 0xff] ^ (crc >> 8); /* 1バイト投入して更新する */
            }
            for (i = 0; i < Data.Length; i++)
            {
                crc = table[(crc ^ Data[i]) & 0xff] ^ (crc >> 8); /* 1バイト投入して更新する */
            }

            return ~crc;
        }

        protected byte[] ToBytes(uint value)
        {
            return new byte[] { (byte)(value >> 24), (byte)(value >> 16), (byte)(value >> 8), (byte)value };
        }

        protected byte[] ToBytes(ushort value)
        {
            return new byte[] { (byte)(value >> 8), (byte)value };
        }

        public byte [] ToBytes()
        {
            byte[] b = new byte[4 + 4 + Data.Length + 4];
            Array.Copy(ToBytes((uint)Data.Length), 0, b, 0, 4);
            Array.Copy(Type, 0, b, 4, 4);
            Array.Copy(Data, 0, b, 8, Data.Length);
            Array.Copy(ToBytes(Crc()), 0, b, 8 + Data.Length, 4);
            return b;
        }

        public bool IsType(string compareType)
        {
            byte[] _compareType = Encoding.ASCII.GetBytes(compareType);
            for (int i = 0; i < 4; i++) if (Type[i] != _compareType[i]) return false;
            return true;
        }
    }
}
