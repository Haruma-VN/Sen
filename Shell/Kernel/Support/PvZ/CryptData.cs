using Sen.Shell.Kernel.Standards;
using Sen.Shell.Kernel.Standards.IOModule.Buffer;
using System.Text;

namespace Sen.Shell.Kernel.Support.PvZ
{
    public class CryptData
    {

        public static byte[] magic = new byte[] { 0x43, 0x52, 0x59, 0x50, 0x54, 0x5F, 0x52, 0x45, 0x53, 0x0A, 0x00 };
        

        public static SenBuffer Encrypt(string inFile, string key)
        {
            var sen = new SenBuffer(inFile);
            var bs2 = new SenBuffer();
            var size = sen.length;
            var code = Encoding.UTF8.GetBytes(key);
            bs2.writeString(Encoding.UTF8.GetString(magic));
            bs2.writeBigInt64LE(size);
            if (size >= 0x100)
            {
                var index = 0;
                var arysize = key.Length;
                for (var i = 0; i < 0x100; i++)
                {
                    bs2.writeByte((byte)(sen.readByte() ^ code[index++]));
                    index %= arysize;
                }
            }
            sen.copy(bs2);
            return bs2;
        }

        public static SenBuffer Decrypt(string inFile, string key)
        {
            var sen = new SenBuffer(inFile);
            var bs2 = new SenBuffer();

            var code = Encoding.UTF8.GetBytes(key);
            if(!(sen.readString(magic.Length) == Encoding.UTF8.GetString(magic)))
            {
                throw new Exception(Localization.GetString("invalid_crypt_data_magic"));
            }
            var size = sen.readBigInt64LE();
            if(sen.length >= 0x112)
            {
                var index = 0;
                var arysize = key.Length;
                for (int i = 0; i < 0x100; i++)
                {
                    bs2.writeByte((byte)(sen.readByte() ^ code[index++]));
                    index %= arysize;
                }
            }
            sen.copy(bs2);
            return bs2;
        }
    }
}
