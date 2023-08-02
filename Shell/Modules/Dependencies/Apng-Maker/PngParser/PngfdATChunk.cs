using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngfdATChunk : PngChunk
    {
        public PngfdATChunk(uint sequence, byte[] data) : base("fdAT", new byte[4+data.Length])
        {
            Array.Copy(ToBytes(sequence), 0, Data, 0, 4);
            Array.Copy(data, 0, Data, 4, data.Length);
        }
    }
}
