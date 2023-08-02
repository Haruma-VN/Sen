using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngfcTLChunk : PngChunk
    {
        public PngfcTLChunk(PngIHDRChunk ihdr, uint sequence, ushort delay_num, ushort delay_density) : base("fcTL", new byte[26])
        {
            Array.Copy(ToBytes(sequence), 0, Data, 0, 4);
            Array.Copy(ihdr.WidthBytes, 0, Data, 4, 4);
            Array.Copy(ihdr.HeightBytes, 0, Data, 8, 4);
            Array.Copy(ToBytes(delay_num), 0, Data, 20, 2);
            Array.Copy(ToBytes(delay_density), 0, Data, 22, 2);
        }
    }
}
