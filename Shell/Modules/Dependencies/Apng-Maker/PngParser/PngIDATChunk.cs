using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngIDATChunk : PngChunk
    {
        public PngIDATChunk(byte [] data) : base("IDAT", data) { }

        public PngfdATChunk TofdATChunk(uint sequence)
        {
            return new PngfdATChunk(sequence, Data);
        }
    }
}
