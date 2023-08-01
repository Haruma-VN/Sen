using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Image = System.Drawing.Image;

namespace CMK
{
    public class AnimatedPng
    {
        public class Frame
        {
            public Image Image { get; set; }
            public short Delay { get; set; }
        }

        internal class acTL
        {
            public uint num_frames { get; set; }
            public uint num_plays { get; set; }

            public acTL(byte[] array)
            {
                if (array.Length != 20)
                    throw new Exception("Invalid acTL array length. It has to be 20 bytes.");
            }

            public byte[] ToByteArray()
            {
                var array = new byte[20];
                EngineBase.getSwappedArray(8).CopyTo(array, 0);
                Encoding.Default.GetBytes("acTL").CopyTo(array, 4);
                EngineBase.getSwappedArray((int)num_frames).CopyTo(array, 8);
                EngineBase.getSwappedArray((int)num_plays).CopyTo(array, 12);
                EngineBase.getSwappedCrc(array.Skip(4).Take(12).ToArray()).CopyTo(array, 16);
                return array;
            }
        }

        internal class fcTL
        {
            public uint sequence_number { get; set; }
            public uint width { get; set; }
            public uint height { get; set; }
            public uint x_offset { get; set; }
            public uint y_offset { get; set; }
            public ushort delay_num { get; set; }
            public ushort delay_den { get; set; }
            public byte dispose_op { get; set; }
            public byte blend_op { get; set; }

            public fcTL(byte[] array)
            {
                if (array.Length != 38)
                    throw new Exception("Invalid fcTL array length. It has to be 38 bytes.");
            }

            public fcTL(IHDR ihdr)
            {

            }

            public byte[] ToByteArray()
            {
                var array = new byte[38];
                EngineBase.getSwappedArray(26).CopyTo(array, 0);
                Encoding.Default.GetBytes("fcTL").CopyTo(array, 4);
                EngineBase.getSwappedArray((int)sequence_number).CopyTo(array, 8);
                EngineBase.getSwappedArray((int)width).CopyTo(array, 12);
                EngineBase.getSwappedArray((int)height).CopyTo(array, 16);
                EngineBase.getSwappedArray((int)x_offset).CopyTo(array, 20);
                EngineBase.getSwappedArray((int)y_offset).CopyTo(array, 24);
                EngineBase.getSwappedArray((short)delay_num).CopyTo(array, 28);
                EngineBase.getSwappedArray((short)delay_den).CopyTo(array, 30);
                EngineBase.getSwappedArray(dispose_op).CopyTo(array, 32);
                EngineBase.getSwappedArray(blend_op).CopyTo(array, 33);
                EngineBase.getSwappedCrc(array.Skip(4).Take(26).ToArray()).CopyTo(array, 34);
                return array;
            }
        }

        internal class IHDR
        {
            public uint width { get; set; }
            public uint height { get; set; }
            public byte bit_depth { get; set; }
            public byte color_type { get; set; }
            public byte compression_method { get; set; }
            public byte filter_method { get; set; }
            public byte interlace_method { get; set; }

            public IHDR(byte[] array)
            {
                if (array.Length != 25)
                    throw new Exception("Invalid IHDR array length. It has to be 25 bytes.");
            }

            public IHDR(fcTL fctl)
            {

            }

            public byte[] ToByteArray()
            {
                var array = new byte[25];
                EngineBase.getSwappedArray(13).CopyTo(array, 0);
                Encoding.Default.GetBytes("IHDR").CopyTo(array, 4);
                EngineBase.getSwappedArray((int)width).CopyTo(array, 8);
                EngineBase.getSwappedArray((int)height).CopyTo(array, 12);
                EngineBase.getSwappedArray(bit_depth).CopyTo(array, 16);
                EngineBase.getSwappedArray(color_type).CopyTo(array, 17);
                EngineBase.getSwappedArray(compression_method).CopyTo(array, 18);
                EngineBase.getSwappedArray(filter_method).CopyTo(array, 19);
                EngineBase.getSwappedArray(interlace_method).CopyTo(array, 20);
                EngineBase.getSwappedCrc(array.Skip(4).Take(17).ToArray()).CopyTo(array, 21);
                return array;
            }
        }

        internal class IDAT
        {
            
        }

        public string FilePath { get; set; }
        public List<Frame> Frames { get; set; }
    }
}
