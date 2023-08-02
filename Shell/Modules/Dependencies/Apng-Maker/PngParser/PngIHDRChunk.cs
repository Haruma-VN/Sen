using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PngParser
{
    class PngIHDRChunk : PngChunk
    {
        public PngIHDRChunk(byte[] data) : base("IHDR", data) { }

        public byte[] WidthBytes
        {
            get
            {
                byte[] width = new byte[4];
                Array.Copy(Data, 0, width, 0, 4);
                return width;
            }
        }

        public byte[] HeightBytes
        {
            get
            {
                byte[] width = new byte[4];
                Array.Copy(Data, 4, width, 0, 4);
                return width;
            }
        }
    }
}
