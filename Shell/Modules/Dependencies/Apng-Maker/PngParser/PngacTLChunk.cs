using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngacTLChunk : PngChunk
    {
        public PngacTLChunk(uint frames, uint loop) : base("acTL", new byte[8])
        {
            Array.Copy(ToBytes(frames), 0, Data, 0, 4);
            Array.Copy(ToBytes(loop), 0, Data, 4, 4);
        }
    }
}
