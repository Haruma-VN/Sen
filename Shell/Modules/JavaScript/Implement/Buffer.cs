using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sen.Shell.Modules.JavaScript.Implement
{

    public class Buffer
    {
        private readonly byte[] data;


        public Buffer(int size)
        {
            data = new byte[size];
        }

        public Buffer(byte[] source)
        {
            data = new byte[source.Length];
            Array.Copy(source, data, source.Length);
        }

        public Buffer(string input, Encoding? encoding = null)
        {
            encoding ??= Encoding.UTF8;
            data = encoding.GetBytes(input);
        }

        public int Length => data.Length;

        public byte this[int index]
        {
            get => data[index];
            set => data[index] = value;
        }

        public byte[] ToArray()
        {
            return data;
        }

        public string ToString(Encoding? encoding = null)
        {
            encoding ??= Encoding.UTF8;
            return encoding.GetString(data);
        }

        public static Buffer From(string input, Encoding? encoding = null)
        {
            return new Buffer(input, encoding);
        }

        public static Buffer From(byte[] source)
        {
            return new Buffer(source);
        }

        public static Buffer Alloc(int size)
        {
            return new Buffer(size);
        }

        public int Compare(Buffer otherBuffer)
        {
            if (otherBuffer == null)
                throw new ArgumentNullException(nameof(otherBuffer));

            return Compare(data, otherBuffer.data);
        }

        public bool Includes(Buffer value)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            return Includes(data, value.data);
        }

        public int IndexOf(Buffer value, int startIndex = 0, int? endIndex = null)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            endIndex ??= data.Length;

            return IndexOf(data, value.data, startIndex, endIndex.Value);
        }

        public int LastIndexOf(Buffer value, int? startIndex = null, int? endIndex = null)
        {
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            startIndex ??= data.Length - 1;
            endIndex ??= 0;

            return LastIndexOf(data, value.data, startIndex.Value, endIndex.Value);
        }

        public Buffer Slice(int start = 0, int? end = null)
        {
            end ??= data.Length;

            if (start < 0)
                start = Math.Max(0, data.Length + start);

            if (end < 0)
                end = Math.Max(0, (int)(data.Length + end));

            if (end <= start)
                return new Buffer(0);

            int length = end.Value - start;
            byte[] slicedData = new byte[length];
            Array.Copy(data, start, slicedData, 0, length);

            return new Buffer(slicedData);
        }

        private static int Compare(byte[] buffer1, byte[] buffer2)
        {
            if (buffer1 == buffer2)
                return 0;

            int minLength = Math.Min(buffer1.Length, buffer2.Length);

            for (int i = 0; i < minLength; i++)
            {
                if (buffer1[i] < buffer2[i])
                    return -1;

                if (buffer1[i] > buffer2[i])
                    return 1;
            }

            if (buffer1.Length < buffer2.Length)
                return -1;

            if (buffer1.Length > buffer2.Length)
                return 1;

            return 0;
        }

        private static bool Includes(byte[] buffer, byte[] value)
        {
            if (buffer.Length < value.Length)
                return false;

            for (int i = 0; i <= buffer.Length - value.Length; i++)
            {
                bool match = true;

                for (int j = 0; j < value.Length; j++)
                {
                    if (buffer[i + j] != value[j])
                    {
                        match = false;
                        break;
                    }
                }

                if (match)
                    return true;
            }

            return false;
        }

        private static int IndexOf(byte[] buffer, byte[] value, int startIndex, int endIndex)
        {
            if (startIndex < 0)
                startIndex = Math.Max(0, buffer.Length + startIndex);

            if (endIndex < 0)
                endIndex = Math.Max(0, buffer.Length + endIndex);

            if (startIndex >= endIndex)
                return -1;

            for (int i = startIndex; i < endIndex; i++)
            {
                bool match = true;

                for (int j = 0; j < value.Length; j++)
                {
                    if (buffer[i + j] != value[j])
                    {
                        match = false;
                        break;
                    }
                }

                if (match)
                    return i;
            }

            return -1;
        }

        private static int LastIndexOf(byte[] buffer, byte[] value, int startIndex, int endIndex)
        {
            if (startIndex >= buffer.Length)
                startIndex = buffer.Length - 1;

            if (endIndex < 0)
                endIndex = Math.Max(0, buffer.Length + endIndex);

            if (startIndex <= endIndex)
                return -1;

            for (int i = startIndex; i >= endIndex; i--)
            {
                bool match = true;

                for (int j = 0; j < value.Length; j++)
                {
                    if (buffer[i - j] != value[value.Length - 1 - j])
                    {
                        match = false;
                        break;
                    }
                }

                if (match)
                    return i - value.Length + 1;
            }

            return -1;
        }

        public static byte[] Concat(params byte[][] arrays)
        {
            int totalLength = arrays.Sum(a => a.Length);
            byte[] result = new byte[totalLength];
            int offset = 0;

            foreach (byte[] array in arrays)
            {
                System.Buffer.BlockCopy(array, 0, result, offset, array.Length);
                offset += array.Length;
            }

            return result;
        }

        public static byte[] Slice(byte[] source, int start, int length)
        {
            byte[] slicedBytes = new byte[length];
            Array.Copy(source, start, slicedBytes, 0, length);
            return slicedBytes;
        }
    }
}