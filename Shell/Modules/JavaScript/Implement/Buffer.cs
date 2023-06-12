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

        public Buffer(string input, Encoding encoding = null)
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

        public string ToString(Encoding encoding = null)
        {
            encoding ??= Encoding.UTF8;
            return encoding.GetString(data);
        }

        public static Buffer From(string input, Encoding encoding = null)
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

    }
}