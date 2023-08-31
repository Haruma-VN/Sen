using Newtonsoft.Json;
using Sen.Shell.Modules.Support.PvZ2.RSB;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Sen.Shell.Modules.Standards.IOModule.Buffer
{

    #pragma warning disable IDE1006
    #pragma warning disable IDE0063
    #pragma warning disable IDE0079
    #pragma warning disable IDE0060

    public abstract class BufferM
    {

    }

    public class SenBuffer : BufferM
    {

        public Stream baseStream;
        public long length { get => baseStream.Length; set => baseStream.SetLength(value); }
        public long writeOffset { get; set; }
        public long readOffset { get; set; }
        public int imageWidth;
        public int imageHeight;
        public long tempReadOffset;
        public long tempWriteOffset;
        public string? filePath;
        private byte[]? m_buffer;


        public long size() => this.length;


        public Encoding Encode = Encoding.UTF8;

        //Constructors
        /// <summary>
        /// Creates a new SenBuffer instance.
        /// <param name="stream"> { Stream } The FileStream of the internal Buffer.</param>
        /// </summary>

        public SenBuffer(Stream stream)
        {
            baseStream = stream;
        }

        /// <summary>
        /// Creates a new empty SenBuffer instance.
        /// </summary>
        /// 
        public SenBuffer() : this(new MemoryStream())
        {
        }

        /// <summary>
        /// Creates a new  SenBuffer instance.
        /// <param name="bytes"> { Bytes } The Bytes to use as the internal Bytes value.</param>
        /// </summary>
        
        public SenBuffer(byte[] bytes) : this(new MemoryStream(bytes))
        {
        }

        /// <summary>
        /// Creates a new  SenBuffer instance.
        /// <param name="size"> { Size } The size to create length of SenBuffer.</param>
        /// </summary>


        public SenBuffer(int size)
        {
            byte[] bytes = new byte[size];
            baseStream = new MemoryStream(bytes);
        }

        /// <summary>
        /// Creates a new SenBuffer instance.
        /// <param name="path"> { Path } The Path to use access the file value.</param>
        /// </summary>

        public SenBuffer(string filepath)
        {
            var newPath = checkPath(filepath);
            filePath = newPath;
            byte[] bytes = File.ReadAllBytes(newPath);
            baseStream = new MemoryStream(bytes);
        }

        /// <summary>
        /// Creates a new SenBuffer apply imagePixels.
        /// <param name="imageData"> { ImageData } The RGBA32[] to apply SenBuffer.</param>
        /// <param name="width"> { Width } The width of the image.</param>
        /// <param name="height"> { Height } The height of the image.</param>
        /// </summary>

        public SenBuffer(Rgba32[] imageData, int width, int height)
        {
            using (var image = Image.LoadPixelData<Rgba32>(imageData, width, height))
            {
                baseStream = new MemoryStream();
                image.SaveAsPng(baseStream);
            }
        }

        private string checkPath(string filepath) {
            var path = new ImplementPath();
            var newStringDir = path.GetDirectoryName(filepath.Replace("\\", "/")).Split("/");
            for (var i = 0; i < newStringDir.Length; i++) {
                var oldString = newStringDir[i];
                if (!oldString.EndsWith(" ")) continue;
                var stringLength = oldString.Length;
                for (var k = 1; k <= stringLength; k++) {
                    if (oldString[^k] != 0x20) break;
                    stringLength--;
                }
                if (stringLength < oldString.Length) newStringDir[i] = oldString.Substring(0, stringLength);
            }
            var newFilePath = path.GetFileName(filepath.Replace("\\", "/"));
            var newPath = path.Join(string.Join("/", newStringDir), newFilePath);
            return newPath;
        } 

        public Rgba32[] getImageData(int width = 0, int height = 0)
        {
            Image<Rgba32> image = getImage();
            imageWidth = image.Width;
            imageHeight = image.Height;
            Rgba32[] pixelArray = new Rgba32[(width != 0 ? width : imageWidth) * (height != 0 ? height : imageHeight)];
            image.CopyPixelDataTo(pixelArray);
            return pixelArray;
        }

        public Image<Rgba32> getImage() {
            Image<Rgba32> image = Image.Load<Rgba32>(baseStream);
            return image;
        }

        private void fixReadOffset(long offset)
        {
            if (offset != -1 && offset > -1)
            {
                readOffset = offset;
                baseStream.Position = readOffset;
            }

            else if (offset == -1)
            {
                baseStream.Position = readOffset;
            }
            
            else
            {
                // 
                throw new Exception("Offset not found");
            }

        }

        private void fixWriteOffset(long offset)
        {
            if (offset != -1 && offset > -1)
            {
                writeOffset = offset;
                baseStream.Position = writeOffset;
            }
            else if (offset == -1)
            {
                baseStream.Position = writeOffset;
            }
            else
            {
                //
                throw new Exception();
            }
        }

        public byte[] readBytes(int count, long offset = -1)
        {
            fixReadOffset(offset);
            if (readOffset + count > length)
            {
                throw new ArgumentException($"Offset is outside the bounds of the DataView");
            }   
            byte[] array = new byte[count];
            baseStream.Read(array, 0, count);
            readOffset += count;
            return array;
        }

        public byte readByte(long offset = -1)
        {
            fixReadOffset(offset);
            if (readOffset + 1 > length)
            {
                throw new ArgumentException($"Offset is outside the bounds of the DataView");
            }
            byte[] array = new byte[1];
            baseStream.Read(array, 0, 1);
            readOffset += 1;
            return array[0];
        }

        public long current() => this.readOffset;

        public string readString(int count, long offset = -1, string EncodingType = "UTF-8")
        {
            fixReadOffset(offset);
            byte[] array = readBytes(count);
            Encoding encoding = Encoding.GetEncoding(EncodingType);
            return encoding.GetString(array);
        }

        public byte[] getBytes(int count, long offset)
        {
            baseStream.Position = offset;
            if (offset + count > length) throw new ArgumentException($"Offset is outside the bounds of the DataView");
            byte[] array = new byte[count];
            baseStream.Read(array, 0, count);
            baseStream.Position = readOffset;
            return array;
        }

        public byte readUInt8(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return (byte)m_buffer[0];
        }


        public ushort readUInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (ushort)(m_buffer[0] | (m_buffer[1] << 8));
        }

        public ushort readUInt16BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (ushort)(m_buffer[1] | (m_buffer[0] << 8));
        }

        public uint readUInt24LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(3);
            return (uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16));
        }

        public uint readUInt24BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(3);
            return (uint)(m_buffer[2] | (m_buffer[1] << 8) | (m_buffer[0] << 16));
        }

        public uint readUInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return (uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24));
        }

        public uint readUInt32BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return (uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24));
        }

        public ulong readBigUInt64LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (((ulong)(uint)(m_buffer[4] | (m_buffer[5] << 8) | (m_buffer[6] << 16) | (m_buffer[7] << 24))) << 32) | ((uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24)));
        }

        public ulong readBigUInt64BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (((ulong)(uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24))) << 32) | ((uint)(m_buffer[7] | (m_buffer[6] << 8) | (m_buffer[5] << 16) | (m_buffer[4] << 24)));
        }

        public uint readVarUInt32(long offset = -1)
        {
            fixReadOffset(offset);
            return (uint)readVarInt32();
        }

        public long readP(long? value)
        {
            return value is null ? this.readOffset : this.readOffset = (long)value;
        }

        public ulong readVarUInt64(long offset = -1)
        {
            fixReadOffset(offset);
            return (ulong)readVarInt64();
        }

        public sbyte readInt8(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return (sbyte)m_buffer[0];
        }

        public short readInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (short)(m_buffer[0] | (m_buffer[1] << 8));
        }
        
        public short readInt16BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(2);
            return (short)(m_buffer[1] | (m_buffer[0] << 8));
        }


        public int readInt24LE(long offset = -1)
        {
            fixReadOffset(offset);
            uint num = readUInt24LE();
            if ((num & 0x800000) != 0) num |= 0xff000000;
            return (int)num;
        }

        public int readInt24BE(long offset = -1)
        {
            fixReadOffset(offset);
            uint num = readUInt24BE();
            if ((num & 0x800000) != 0) num |= 0xff000000;
            return (int)num;
        }

        public int readInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24);
        }

        public int readInt32BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24);
        }

        public long readBigInt64LE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (long)((((ulong)(uint)(m_buffer[4] | (m_buffer[5] << 8) | (m_buffer[6] << 16) | (m_buffer[7] << 24))) << 32) | ((uint)(m_buffer[0] | (m_buffer[1] << 8) | (m_buffer[2] << 16) | (m_buffer[3] << 24))));
        }

        public long readBigInt64BE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return (long)((((ulong)(uint)(m_buffer[3] | (m_buffer[2] << 8) | (m_buffer[1] << 16) | (m_buffer[0] << 24))) << 32) | ((uint)(m_buffer[7] | (m_buffer[6] << 8) | (m_buffer[5] << 16) | (m_buffer[4] << 24))));
        }

        public int readVarInt32(long offset = -1)
        {
            fixReadOffset(offset);
            int num = 0;
            int num2 = 0;
            byte b;
            do
            {
                if (num2 == 35)
                {
                    throw new Exception();
                }
                b = readUInt8();
                num |= (b & 0x7F) << num2;
                num2 += 7;
            }
            while ((b & 0x80) != 0);
            return num;
        }

        public long readVarInt64(long offset = -1)
        {
            fixReadOffset(offset);
            long num = 0;
            int num2 = 0;
            byte b;
            do
            {
                if (num2 == 70)
                {
                    throw new Exception();
                }
                b = readUInt8();
                num |= ((long)(b & 0x7F)) << num2;
                num2 += 7;
            }
            while ((b & 0x80) != 0);
            return num;
        }

        public int readZigZag32(long offset = -1)
        {
            fixReadOffset(offset);
            uint n = (uint)readVarInt32();
            return (((int)(n << 31)) >> 31) ^ ((int)(n >> 1));
        }

        public long readZigZag64(long offset = -1)
        {
            fixReadOffset(offset);
            ulong n = (ulong)readVarInt64();
            return ((long)(n >> 1)) ^ (-(long)(n & 0b1));
        }

        public float readFloatLE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            return BitConverter.ToSingle(m_buffer, 0);
        }

        public float readFloatBE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(4);
            Array.Reverse(m_buffer);
            return BitConverter.ToSingle(m_buffer, 0);
        }

        public double readDoubleLE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            return BitConverter.ToDouble(m_buffer, 0);
        }

        public double readDoubleBE(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(8);
            Array.Reverse(m_buffer);
            return BitConverter.ToDouble(m_buffer, 0);
        }

        public bool readBool(long offset = -1)
        {
            fixReadOffset(offset);
            m_buffer = readBytes(1);
            return m_buffer[0] != 0;
        }

        public string readStringByEmpty(long offset = -1)
        {
            fixReadOffset(offset);
            var bytes = new List<byte>();
            byte tp;
            while (true)
            {
                if ((tp = readUInt8()) == 0)
                {
                    break;
                }
                bytes.Add(tp);
            }
            byte[] byte_str = bytes.ToArray();
            return Encode.GetString(byte_str);
        }

        public string getStringByEmpty(long offset)
        {
            long tempOffset = readOffset;
            readOffset = offset;
            string str = readStringByEmpty();
            readOffset = tempOffset;
            return str;
        }
        public string readStringByUInt8(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readUInt8());
        }

        public string readStringByInt8(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readInt8());
        }
        public string readStringByUInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readUInt16LE());
        }

        public string readStringByInt16LE(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readInt16LE());
        }

        public string readStringByUInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readInt32LE());
        }

        public string readStringByInt32LE(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readInt32LE());
        }

        public string readStringByVarInt32(long offset = -1)
        {
            fixReadOffset(offset);
            return readString(readVarInt32());
        }

        public byte peekUInt8(long offset = -1) {
            byte num = readUInt8(offset);
            readOffset--;
            return num;
        }

        public sbyte peekInt8(long offset = -1) {
            sbyte num = readInt8(offset);
            readOffset--;
            return num;
        }

        public ushort peekUInt16LE(long offset = -1) {
            ushort num = readUInt16LE(offset);
            readOffset -= 2;
            return num;
        }

        public ushort peekUInt16BE(long offset = -1) {
            ushort num = readUInt16BE(offset);
            readOffset -= 2;
            return num;
        }

        public short peekInt16LE(long offset = -1) {
            short num = readInt16LE(offset);
            readOffset -= 2;
            return num;
        }

        public short peekInt16BE(long offset = -1) {
            short num = readInt16BE(offset);
            readOffset -= 2;
            return num;
        }

        public uint peekUInt24LE(long offset = -1) {
            uint num = readUInt24LE(offset);
            readOffset -= 3;
            return num;
        }

        public uint peekUInt24BE(long offset = -1) {
            uint num = readUInt24BE(offset);
            readOffset -= 3;
            return num;
        }

        public int peekInt24LE(long offset = -1) {
            int num = readInt24LE(offset);
            readOffset -= 3;
            return num;
        }

        public int peekInt24BE(long offset = -1) {
            int num = readInt24BE(offset);
            readOffset -= 3;
            return num;
        }

        public uint peekUInt32LE(long offset = -1) {
            uint num = readUInt32LE(offset);
            readOffset -= 4;
            return num;
        }

        public uint peekUInt32BE(long offset = -1) {
            uint num = readUInt32BE(offset);
            readOffset -= 4;
            return num;
        }

        public int peekInt32LE(long offset = -1) {
            int num = readInt32LE(offset);
            readOffset -= 4;
            return num;
        }

        public int peekInt32BE(long offset = -1) {
            int num = readInt32BE(offset);
            readOffset -= 4;
            return num;
        }

        public string peekString(int count, long offset = -1, string EncodingType = "UTF-8") {
            string str = readString(count, offset, EncodingType);
            readOffset -= count;
            return str;
        }

        // Write
        public void writeBytes(byte[] array, long offset = -1)
        {
            fixWriteOffset(offset);
            int length = array.Length;
            baseStream.Write(array, 0, length);
            writeOffset += length;
        }

        public void writeByte(byte byte_t, long offset = -1)
        {
            fixWriteOffset(offset);
            baseStream.Write(new byte[] { byte_t}, 0, 1);
            writeOffset += 1;
        }

        public void writeString(string str, long offset = -1, string EncodingType = "UTF-8")
        {
            fixWriteOffset(offset);
            Encoding encoding = Encoding.GetEncoding(EncodingType);
            byte[] str_bytes = encoding.GetBytes(str);
            writeBytes(str_bytes);
        }

        public void writeStringByEmpty(string str, long offset = -1) {
            if (str is null) {
                writeUInt8(0);
                return;
            }
            writeString(str, offset);
            writeUInt8(0);
        }
        
        public void writeNull(int count, long offset = -1)
        {
            if (count < 0) throw new Exception();
            if (count == 0) return;
            fixWriteOffset(offset);
            byte[] nullbytes = new byte[count];
            writeBytes(nullbytes);
        }
        
        public void writeStringFourByte(string str, long offset = -1) {
            fixWriteOffset(offset);
            var strLength = str.Length;
            byte[] str_bytes = new byte[strLength * 4 + 4];
            for (var i = 0; i < strLength; i++) {
                str_bytes[i * 4] = (byte)str[i];
            }
            writeBytes(str_bytes);
        }

        public void setBytes(byte[] array, long offset, bool overwriteOffset)
        {
            int length = array.Length;
            if (overwriteOffset)
            {
                fixWriteOffset(offset);
            }
            else
            {
                baseStream.Position = offset;
            }
            baseStream.Write(array, 0, length);
            baseStream.Position = writeOffset;
        }

        public void writeUInt8(byte number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[1];
            m_buffer[0] = number;
            writeBytes(m_buffer);
        }

        public void writeUInt16LE(ushort number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeUInt16BE(ushort number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[1] = (byte)number;
            m_buffer[0] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeUInt24LE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            writeBytes(m_buffer);
        }

        public void writeUInt24BE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[2] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[0] = (byte)(number >> 16);
            writeBytes(m_buffer);
            return;
        }

        public void writeUInt32LE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            writeBytes(m_buffer);
            return;
        }

        public void writeUInt32BE(uint number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[3] = (byte)number;
            m_buffer[2] = (byte)(number >> 8);
            m_buffer[1] = (byte)(number >> 16);
            m_buffer[0] = (byte)(number >> 24);
            writeBytes(m_buffer);
        }

        public void writeBigUInt64LE(ulong number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            m_buffer[4] = (byte)(number >> 32);
            m_buffer[5] = (byte)(number >> 40);
            m_buffer[6] = (byte)(number >> 48);
            m_buffer[7] = (byte)(number >> 56);
            writeBytes(m_buffer);
        }

        public void writeBigUInt64BE(ulong number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[7] = (byte)number;
            m_buffer[6] = (byte)(number >> 8);
            m_buffer[5] = (byte)(number >> 16);
            m_buffer[4] = (byte)(number >> 24);
            m_buffer[3] = (byte)(number >> 32);
            m_buffer[2] = (byte)(number >> 40);
            m_buffer[1] = (byte)(number >> 48);
            m_buffer[0] = (byte)(number >> 56);
            writeBytes(m_buffer);
            return;
        }

        public void writeFloatLE(float number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
            return;

        }

        public void writeFloatBE(float number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            Array.Reverse(m_buffer);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
            return;

        }

        public void writeDoubleLE(double number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeDoubleBE(double number, long offset = -1)
        {
            m_buffer = BitConverter.GetBytes(number);
            Array.Reverse(m_buffer);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }
        public void writeUVarInt32(uint number, long offset = -1)
        {
            uint num;
            var bytes = new List<byte>();
            for (num = number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }


        public void writeUVarInt64(ulong number, long offset = -1)
        {
            ulong num;
            var bytes = new List<byte>();
            for (num = number; num >= 128; num >>= 7)
            {
                bytes.Add((byte)(num | 0x80));
            }
            bytes.Add((byte)num);
            m_buffer = bytes.ToArray();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeInt8(sbyte number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[1];
            m_buffer[0] = (byte)number;
            writeBytes(m_buffer);
        }

        public void writeInt16LE(short number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeInt16BE(short number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[2];
            m_buffer[1] = (byte)number;
            m_buffer[0] = (byte)(number >> 8);
            writeBytes(m_buffer);
        }

        public void writeInt24LE(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            writeBytes(m_buffer);
        }

        public void writeInt24BE(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[3];
            m_buffer[2] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[0] = (byte)(number >> 16);
            writeBytes(m_buffer);
        }

        public void writeInt32LE(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            writeBytes(m_buffer);
        }

        public void writeInt32BE(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[4];
            m_buffer[3] = (byte)number;
            m_buffer[2] = (byte)(number >> 8);
            m_buffer[1] = (byte)(number >> 16);
            m_buffer[0] = (byte)(number >> 24);
            writeBytes(m_buffer);
        }

        public void writeBigInt64LE(long number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[0] = (byte)number;
            m_buffer[1] = (byte)(number >> 8);
            m_buffer[2] = (byte)(number >> 16);
            m_buffer[3] = (byte)(number >> 24);
            m_buffer[4] = (byte)(number >> 32);
            m_buffer[5] = (byte)(number >> 40);
            m_buffer[6] = (byte)(number >> 48);
            m_buffer[7] = (byte)(number >> 56);
            writeBytes(m_buffer);
        }

        public void writeBigInt64BE(long number, long offset = -1)
        {
            fixWriteOffset(offset);
            m_buffer = new byte[8];
            m_buffer[7] = (byte)number;
            m_buffer[6] = (byte)(number >> 8);
            m_buffer[5] = (byte)(number >> 16);
            m_buffer[4] = (byte)(number >> 24);
            m_buffer[3] = (byte)(number >> 32);
            m_buffer[2] = (byte)(number >> 40);
            m_buffer[1] = (byte)(number >> 48);
            m_buffer[0] = (byte)(number >> 56);
            writeBytes(m_buffer);
        }

        public void writeVarInt32(int number, long offset = -1)
        {
            uint num;
            fixWriteOffset(offset);
            for (num = (uint)number; num >= 128; num >>= 7)
            {
                writeUInt8((byte)(num | 0x80));
            }
            writeUInt8((byte)num);
        }

        public void writeVarInt64(long number, long offset = -1)
        {
            ulong num;
            fixWriteOffset(offset);
            for (num = (ulong)number; num >= 128; num >>= 7)
            {
                writeUInt8((byte)(num | 0x80));
            }
            writeUInt8((byte)num);
        }

        public unsafe void writeBool(bool value, long offset = -1)
        {
            m_buffer = new byte[1];
            m_buffer[0] = (byte)(value ? 1u : 0u);
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public void writeZigZag32(int number, long offset = -1)
        {
            fixWriteOffset(offset);
            writeVarInt32((number << 1) ^ (number >> 31));
        }

        public unsafe void slice(long begin, long end)
        {
            if (begin < 0 || end < begin || end > this.baseStream.Length)
            {
                throw new ArgumentOutOfRangeException("Invalid Buffer Slice");
            }
            var length = end - begin;
            byte[] buffer = new byte[length];
            this.baseStream.Seek(begin, SeekOrigin.Begin);
            this.baseStream.Read(buffer, 0, (int)length);
            this.baseStream = new MemoryStream(buffer);
            return;
        }


        public void writeZigZag64(long number, long offset = -1)
        {
            fixWriteOffset(offset);
            writeVarInt64((number << 1) ^ (number >> 63));
        }

        public void writeStringByUInt8(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeUInt8(0);
                return;
            }
            writeUInt8((byte)str!.Length);
            writeString(str!);
        }

        public void writeStringByInt8(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeInt8(0);
                return;
            }
            writeInt8((sbyte)str!.Length);
            writeString(str!);
        }

        public void writeStringByUInt16LE(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeInt16LE(0);
                return;
            }
            writeUInt16LE((ushort)str!.Length);
            writeString(str!);
        }

        public void writeStringByInt16LE(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeInt16LE(0);
                return;
            }
            writeInt16LE((short)str!.Length);
            writeString(str!);
        }

        public void writeStringByUInt32LE(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeUInt32LE(0);
                return;
            }
            writeUInt32LE((uint)str!.Length);
            writeString(str!);
        }

        public void writeStringByInt32LE(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeInt32LE(0);
                return;
            }
            writeInt32LE(str!.Length);
            writeString(str!);
        }

        public void writeStringByVarInt32(string? str, long offset = -1)
        {
            fixWriteOffset(offset);
            if (str is null)
            {
                writeVarInt32(0);
                return;
            }
            byte[] ary =  Encode.GetBytes(str!);
            writeVarInt32(ary.Length);
            writeBytes(ary);
        }

        public void writeSenBuffer(SenBuffer input, long offset = -1)
        {
            m_buffer = input.toBytes();
            fixWriteOffset(offset);
            writeBytes(m_buffer);
        }

        public byte[] toBytes()
        {
            long temp_offset = baseStream.Position;
            byte[] bytes;
            if (baseStream is MemoryStream ms)
            {
                bytes = ms.ToArray();
            }
            else
            {
                bytes = new byte[baseStream.Length - baseStream.Position];
                using var ms2 = new MemoryStream(bytes);
                {
                    baseStream.CopyTo(ms2);
                }
            }
            baseStream.Position = temp_offset;
            return bytes;
        }

        public Stream toStream() {
            Flush();
            return baseStream;
        }

        public string toString(string EncodingType = "UTF-8") {
            Encoding encoding = Encoding.GetEncoding(EncodingType);
            byte[] array = toBytes();
            return encoding.GetString(array);
        }

        public void BackupReadOffset() {
            tempReadOffset = readOffset;
        }

        public void RestoreReadOffset() {
            readOffset = tempReadOffset;
        }

        public void BackupWriteOffset() {
            tempWriteOffset = writeOffset;
        }

        public void RestoreWriteOffset() {
            writeOffset = tempWriteOffset;
        }

        public virtual void CreateDirectory(string output_path)
        {
            var fs = new FileSystem();
            var path = new ImplementPath();
            if (!fs.DirectoryExists(path.GetDirectoryName(output_path)))
            {
                fs.CreateDirectory(path.GetDirectoryName(output_path));
            }
        }

        public virtual void OutFile(string output_path)
        {
            var newPath = checkPath(output_path);
            CreateDirectory(newPath);
            SaveFile(newPath);
        }

        public void copy(SenBuffer s)
        {
            byte[] array = new byte[81920];
            int count;
            while ((count = Read(array, 0, array.Length)) != 0)
            {
                s.Write(array, 0, count);
            }
        }

        public int Read(byte[] buffer, int offset, int count)
        {
            return this.baseStream.Read(buffer, offset, count);
        }

        public void Write(byte[] buffer, int offset, int count)
        {
            this.baseStream.Write(buffer, offset, count);
            return;
        }

        public virtual void SaveFile(string path)
        {
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                baseStream.Seek(0, SeekOrigin.Begin);
                baseStream.CopyTo(fileStream);
            }
            Close();
        }

        public static XElement ReadXml(string path) {
            XElement data = XDocument.Load(path).Root!;
            foreach (var e in data.DescendantsAndSelf())
            {
                e.Name = e.Name.LocalName;
            }
            return data;
        }

        public static void SaveXml(string outPath, XElement document, XNamespace xflns) {
            foreach (var e in document.DescendantsAndSelf())
            {
                e.Name = xflns + e.Name.LocalName;
            }
            XmlWriterSettings settings = new()
            {
                Indent = true,
                IndentChars = "\t",
                OmitXmlDeclaration = true,
            };
            using var writer = XmlWriter.Create(outPath, settings);
            XDocument XDdocument = new(new XDeclaration("1.0", "utf-8", null), document);
            XDdocument.Save(writer);
            return;
        }

        public virtual async Task SaveFileAsync(string path)
        {
            using (var fileStream = new FileStream(path, FileMode.Create, FileAccess.Write))
            {
                await baseStream.CopyToAsync(fileStream);
            }
            Flush();
        }

        public virtual async Task OutFileAsync(string output_path)
        {
            CreateDirectory(output_path);
            using (var fileStream = new FileStream(output_path, FileMode.Create, FileAccess.Write))
            {
                await baseStream.CopyToAsync(fileStream);
            }
            Flush();
        }


        public virtual void Close()
        {
            baseStream.Close();
        }

        public virtual void Flush()
        {
            baseStream.Flush();
        }

        public virtual string SerializeJson(object json, char indent = '\t')
        {

            return RSBFunction.JsonPrettify(JsonConvert.SerializeObject(json), indent);
        }
    }
}