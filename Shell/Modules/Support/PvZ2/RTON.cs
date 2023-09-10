using Sen.Shell.Modules.Standards.IOModule.Buffer;
using System.Text;
using System.Text.Json;
using Sen.Shell.Modules.Standards;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using Sen.Shell.Modules.JavaScript;

namespace Sen.Shell.Modules.Support.PvZ2.RTON
{
#pragma warning disable CS0414
#pragma warning disable CS8603
#pragma warning disable CS0436
    public enum RTONListException
    {
        Magic,
        Version,
        Ends,
    }

    public class List
    {
        public class StringPool
        {
            Dictionary<string, PoolInfo> stringPool;
            long position;
            int index;
            readonly bool autoPool = false;

            public StringPool(bool autoPool)
            {
                stringPool = new Dictionary<string, PoolInfo>();
                position = 0;
                index = 0;
                this.autoPool = autoPool;
            }

            public StringPool()
            {
                stringPool = new Dictionary<string, PoolInfo>();
                position = 0;
                index = 0;
            }

            public int Length => index;

            public PoolInfo this[int index]
            {
                get
                {
                    if (index > this.index)
                    {
                        return null;
                    }
                    return stringPool.ElementAt(index).Value;
                }
            }

            public PoolInfo this[string id]
            {
                get
                {
                    if (!stringPool.TryGetValue(id, out PoolInfo? value))
                    {
                        if (autoPool)
                        {
                            return ThrowInPool(id);
                        }
                        return null;
                    }
                    return value;
                }
            }

            public bool Exist(string id)
            {
                return stringPool.ContainsKey(id);
            }

            public void Clear()
            {
                stringPool.Clear();
                position = 0;
                index = 0;
            }
            public PoolInfo ThrowInPool(string poolKey)
            {
                if (!stringPool.TryGetValue(poolKey, out PoolInfo? value))
                {
                    value = new PoolInfo(position, index++, poolKey);
                    stringPool.Add(poolKey, value);
                    position += poolKey.Length + 1;
                }
                return value;
            }
        }

        public class PoolInfo(long offset, int index, string value)
        {
            public long Offset = offset;
            public int Index = index;
            public string Value = value;
        }
    }

    public class RTONProcession
    {
        public static readonly string magic = "RTON";

        public static readonly uint version = 1;

        public static readonly string EOR = "DONE";

        public static readonly List<string> R0x90List = new List<string>();

        public static readonly List<string> R0x92List = new List<string>();

        public static readonly string Str_Null = "*";

        public static readonly string Str_RTID_Begin = "RTID(";

        public static readonly string Str_RTID_End = ")";

        public static readonly string Str_RTID_0 = "RTID(0)";

        public static readonly string Str_RTID_2 = "RTID({0}.{1}.{2:x8}@{3})";

        public static readonly string Str_RTID_3 = "RTID({0}@{1})";

        public static readonly string Str_Binary = "$BINARY(\"{0}\", {1})";

        public static readonly string Str_Binary_Begin = "$BINARY(\"";

        public static readonly string Str_Binary_End = ")";

        public static readonly string Str_Binary_Middle = "\", ";

        public static string? tempstring;

        public static readonly string RTONChineseKey = $"65bd1b2305f46eb2806b935aab7630bb";

        public static SenBuffer Decrypt(SenBuffer RtonFile, string encryptionKey)
        {
            var RijndaelCheck = RtonFile.readInt16LE();
            if (RijndaelCheck != 0x10)
            {
                throw new Exception($"rton_is_not_encrypted");
            }
            var Crypto = new ImplementCrypto();
            byte[] ivBytes = new byte[24];
            var keyBytes = Encoding.UTF8.GetBytes(encryptionKey);
            Array.Copy(keyBytes, 4, ivBytes, 0, 24);
            return new SenBuffer(Crypto.RTONRijndaelDecrypt(
                RtonFile.getBytes((int)(RtonFile.length - 2), 2), 
                ivBytes, 
                keyBytes,
                new Org.BouncyCastle.Crypto.Paddings.ZeroBytePadding())
            );
        }

        public struct RTONCipher
        {
            public required bool crypt;
            public required string key;
        }

        // Rton_to_Json

        public static SenBuffer Decode(SenBuffer RtonFile, RTONCipher decrypt)
        {
            R0x90List.Clear();
            R0x92List.Clear();
            var stream = new MemoryStream();
            var streamWriter = new StreamWriter(stream);
            var jsonWriter = new JsonTextWriter(streamWriter)
            {
                Formatting = Formatting.Indented,
                IndentChar = '\t',
                Indentation = 1,
            };
            if (decrypt.crypt)
            {
                RtonFile = Decrypt(RtonFile, decrypt.key);
            }
            var Rton_magic = RtonFile.readString(4);
            uint Rton_ver = RtonFile.readUInt32LE();
            if (Rton_magic != magic)
            {
                throw new RTONDecodeException(
                    $"wrong_rton_header",
                    RtonFile.filePath ??= "undefined",
                    $"begin_with_rton",
                    RTONListException.Magic
                    );
            }

            if (Rton_ver != version) throw new RTONDecodeException(
                $"wrong_rton_version",
                RtonFile.filePath ??= "undefined",
                $"version_must_be_1",
                RTONListException.Version
                );
            ReadObject(RtonFile, jsonWriter);
            var EOF = RtonFile.readString(4);
            if (EOF != EOR) throw new RTONDecodeException($"end_of_rton_file_wrong",
                RtonFile.filePath ??= "undefined",
                $"end_of_rton_must_be_done",
                RTONListException.Ends);
            jsonWriter.Flush();
            var JsonFile = new SenBuffer(stream);
            R0x90List.Clear();
            R0x92List.Clear();
            return JsonFile;
        }

        private static void ReadBytecode(byte bytecode, bool valueType, SenBuffer RtonFile, JsonTextWriter jsonWriter)
        {
            switch (bytecode)
            {
                case 0x0:
                    jsonWriter.WriteValue(false);
                    break;
                case 0x1:
                    jsonWriter.WriteValue(true);
                    break;
                case 0x2:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(Str_Null);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(Str_Null);
                    }
                    break;
                case 0x8:
                    jsonWriter.WriteValue(RtonFile.readInt8());
                    break;
                case 0x9:
                    jsonWriter.WriteValue(0);
                    break;
                case 0xA:
                    jsonWriter.WriteValue(RtonFile.readUInt8());
                    break;
                case 0xB:
                    jsonWriter.WriteValue(0);
                    break;
                case 0x10:
                    jsonWriter.WriteValue(RtonFile.readInt16LE());
                    break;
                case 0x11:
                    jsonWriter.WriteValue(0);
                    break;
                case 0x12:
                    jsonWriter.WriteValue(RtonFile.readUInt16LE());
                    break;
                case 0x13:
                    jsonWriter.WriteValue(0);
                    break;
                case 0x20:
                    jsonWriter.WriteValue(RtonFile.readInt32LE());
                    break;
                case 0x21:
                    jsonWriter.WriteValue(0);
                    break;
                case 0x22:
                    jsonWriter.WriteValue(RtonFile.readFloatLE());
                    break;
                case 0x23:
                    jsonWriter.WriteValue(0F);
                    break;
                case 0x24:
                    jsonWriter.WriteValue(RtonFile.readVarInt32());
                    break;
                case 0x25:
                    jsonWriter.WriteValue(RtonFile.readZigZag32());
                    break;
                case 0x26:
                    jsonWriter.WriteValue(RtonFile.readUInt32LE());
                    break;
                case 0x27:
                    jsonWriter.WriteValue(0U);
                    break;
                case 0x28:
                    jsonWriter.WriteValue(RtonFile.readVarUInt32());
                    break;
                case 0x40:
                    jsonWriter.WriteValue(RtonFile.readBigInt64LE());
                    break;
                case 0x41:
                    jsonWriter.WriteValue(0L);
                    break;
                case 0x42:
                    jsonWriter.WriteValue(RtonFile.readDoubleLE());
                    break;
                case 0x43:
                    jsonWriter.WriteValue(0D);
                    break;
                case 0x44:
                    jsonWriter.WriteValue(RtonFile.readVarInt64());
                    break;
                case 0x45:
                    jsonWriter.WriteValue(RtonFile.readZigZag64());
                    break;
                case 0x46:
                    jsonWriter.WriteValue(RtonFile.readBigUInt64LE());
                    break;
                case 0x47:
                    jsonWriter.WriteValue(0UL);
                    break;
                case 0x48:
                    jsonWriter.WriteValue(RtonFile.readVarUInt64());
                    break;
                case 0x81:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(RtonFile.readString(RtonFile.readVarInt32()));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(RtonFile.readString(RtonFile.readVarInt32()));
                    }
                    break;
                case 0x82:
                    RtonFile.readVarInt32();
                    if (valueType)
                    {
                        jsonWriter.WriteValue(RtonFile.readString(RtonFile.readVarInt32()));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(RtonFile.readString(RtonFile.readVarInt32()));
                    }
                    break;
                case 0x83:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(ReadRTID(RtonFile));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(ReadRTID(RtonFile));
                    }
                    break;
                case 0x84:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(Str_RTID_0);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(Str_RTID_0);
                    }
                    break;
                case 0x85:
                    ReadObject(RtonFile, jsonWriter);
                    break;
                case 0x86:
                    ReadArray(RtonFile, jsonWriter);
                    break;
                case 0x87:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(ReadBinary(RtonFile));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(ReadBinary(RtonFile));
                    }
                    break;
                case 0x90:
                    int num = RtonFile.readVarInt32();
                    tempstring = RtonFile.readString(num);
                    R0x90List.Add(tempstring);
                    if (valueType)
                    {
                        jsonWriter.WriteValue(tempstring);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(tempstring);
                    }
                    break;
                case 0x91:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(R0x90List[RtonFile.readVarInt32()]);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(R0x90List[RtonFile.readVarInt32()]);
                    }
                    break;
                case 0x92:
                    RtonFile.readVarInt32();
                    tempstring = RtonFile.readString(RtonFile.readVarInt32());
                    R0x92List.Add(tempstring);
                    if (valueType)
                    {
                        jsonWriter.WriteValue(tempstring);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(tempstring);
                    }
                    break;
                case 0x93:
                    if (valueType)
                    {
                        jsonWriter.WriteValue(R0x92List[RtonFile.readVarInt32()]);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(R0x92List[RtonFile.readVarInt32()]);
                    }
                    break;
                case 0xB0:
                case 0xB1:
                case 0xB2:
                case 0xB3:
                case 0xB4:
                case 0xB5:
                case 0xB6:
                case 0xB7:
                case 0xB8:
                case 0xB9:
                case 0xBA:
                case 0xBB:
                    throw new RTONException($"not_a_rton", RtonFile.filePath ??= "undefined");
                case 0xBC:
                    jsonWriter.WriteValue(RtonFile.readUInt8() != 0);
                    break;
                default:
                    throw new RTONException($"Bytecode Error: {bytecode} in offset: {RtonFile.readOffset}", RtonFile.filePath ??= "undefined");

            }

        }

        private static string ReadBinary(SenBuffer RtonFile)
        {
            RtonFile.readUInt8();
            string s = RtonFile.readStringByVarInt32();
            int i = RtonFile.readVarInt32();
            return string.Format(Str_Binary, s, i);
        }

        private static string ReadRTID(SenBuffer RtonFile)
        {
            byte temp = RtonFile.readUInt8();
            switch (temp)
            {
                case 0x00:
                    return Str_RTID_0;
                case 0x01:
                    int value_1_2 = RtonFile.readVarInt32();
                    int value_1_1 = RtonFile.readVarInt32();
                    uint x16_1 = RtonFile.readUInt32LE();
                    return string.Format(Str_RTID_2, value_1_1, value_1_2, x16_1, string.Empty);
                case 0x02:
                    RtonFile.readVarInt32();
                    string str = RtonFile.readStringByVarInt32();
                    int value_2_2 = RtonFile.readVarInt32();
                    int value_2_1 = RtonFile.readVarInt32();
                    uint x16_2 = RtonFile.readUInt32LE();
                    return string.Format(Str_RTID_2, value_2_1, value_2_2, x16_2, str);
                case 0x03:
                    RtonFile.readVarInt32();
                    string str2 = RtonFile.readStringByVarInt32();
                    RtonFile.readVarInt32();
                    string str1 = RtonFile.readStringByVarInt32();
                    return string.Format(Str_RTID_3, str1, str2);
                default:
                    throw new RTONException($"not_a_rton", RtonFile.filePath ??= "undefined");
            }
        }

        public static void ReadObject(SenBuffer RtonFile, JsonTextWriter jsonWriter)
        {
            jsonWriter.WriteStartObject();
            byte bytecode = RtonFile.readUInt8();
            while (bytecode != 0xFF)
            {
                ReadBytecode(bytecode, false, RtonFile, jsonWriter);
                ReadBytecode(RtonFile.readUInt8(), true, RtonFile, jsonWriter);
                bytecode = RtonFile.readUInt8();
            }
            jsonWriter.WriteEndObject();
        }

        private static void ReadArray(SenBuffer RtonFile, JsonTextWriter jsonWriter)
        {
            jsonWriter.WriteStartArray();
            byte bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFD)
            {
                throw new RTONException($"not_a_rton", RtonFile.filePath ??= "undefined");
            }
            int number = RtonFile.readVarInt32();
            for (var i = 0; i < number; i++)
            {
                bytecode = RtonFile.readUInt8();
                ReadBytecode(bytecode, true, RtonFile, jsonWriter);
            }
            bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFE)
            {
                throw new RTONException($"not_a_rton", RtonFile.filePath ??= "undefined");
            }
            jsonWriter.WriteEndArray();
        }

        public static SenBuffer Encrypt(SenBuffer RtonFile, string encryptionKey)
        {
            var Crypto = new ImplementCrypto();
            var keyBytes = Encoding.UTF8.GetBytes(encryptionKey);
            byte[] ivBytes = new byte[24];
            Array.Copy(keyBytes, 4, ivBytes, 0, 24);
            var padSize = (ivBytes.Length - ((RtonFile.length + ivBytes.Length - 1) % ivBytes.Length + 1));
            RtonFile.writeNull((int)padSize);
            var RTONEncrypt = new SenBuffer();
            RTONEncrypt.writeInt16LE(0x10);
            RTONEncrypt.writeBytes(Crypto.RTONRijndaelEncrypt(RtonFile.toBytes(), ivBytes, keyBytes, new Org.BouncyCastle.Crypto.Paddings.ZeroBytePadding()));
            return RTONEncrypt;
        }

        //Json to Rton
        public static SenBuffer Encode(byte[] JsonBuffer, RTONCipher EncryptFile)
        {
            var R0x90 = new List.StringPool();
            var R0x92 = new List.StringPool();
            var stream = new MemoryStream(JsonBuffer);
            var Json = JsonDocument.Parse(stream, new JsonDocumentOptions { AllowTrailingCommas = true });
            var root = Json.RootElement;
            var RtonFile = new SenBuffer();
            RtonFile.writeString(magic);
            RtonFile.writeUInt32LE(version);
            WriteObject(RtonFile, root, R0x90, R0x92);
            RtonFile.writeString(EOR);
            if (EncryptFile.crypt)
            {
                RtonFile = Encrypt(RtonFile, EncryptFile.key);
            }
            return RtonFile;
        }

        public static bool IsASCII(string str)
        {
            for (var i = 0; i < str.Length; i++)
            {
                if (str[i] > 127) return false;
            }
            return true;
        }

        private static void WriteString(SenBuffer RtonFile, string? str, List.StringPool R0x90, List.StringPool R0x92)
        {
            if (str == Str_Null)
            {
                RtonFile.writeUInt8(2);
            }
            else if (WriteRTID(RtonFile, str!)) { }
            else if (WriteBinary(RtonFile, str!)) { }
            else if (IsASCII(str!))
            {
                if (R0x90.Exist(str!))
                {
                    RtonFile.writeUInt8(0x91);
                    RtonFile.writeVarInt32(R0x90[str!].Index);
                }
                else
                {
                    RtonFile.writeUInt8(0x90);
                    RtonFile.writeStringByVarInt32(str!);
                    R0x90.ThrowInPool(str!);
                }
            }
            else
            {
                if (R0x92.Exist(str!))
                {
                    RtonFile.writeUInt8(0x93);
                    RtonFile.writeVarInt32(R0x92[str!].Index);
                }
                else
                {
                    RtonFile.writeUInt8(0x92);
                    RtonFile.writeVarInt32(str!.Length);
                    RtonFile.writeStringByVarInt32(str!);
                    R0x92.ThrowInPool(str!);
                }
            }
        }

        private static bool WriteBinary(SenBuffer RtonFile, string str)
        {
            if (str.StartsWith(Str_Binary_Begin) && str.EndsWith(Str_Binary_End))
            {
                int index = str.LastIndexOf(Str_Binary_Middle);
                if (index == -1) return false;
                int v;
                try
                {
                    v = Convert.ToInt32(str[(index + 3)..^1]);
                }
                catch (Exception)
                {
                    return false;
                }
                string mString = str[9..index];
                RtonFile.writeUInt8(0x87);
                RtonFile.writeUInt8(0);
                RtonFile.writeStringByVarInt32(mString);
                RtonFile.writeVarInt32(v);
            }
            return false;
        }

        private static bool WriteRTID(SenBuffer RtonFile, string str)
        {
            if (str.StartsWith(Str_RTID_Begin) && str.EndsWith(Str_RTID_End))
            {
                if (str == Str_RTID_0)
                {
                    RtonFile.writeUInt8(0x84);
                    return true;
                }
                string newstr = str[5..^1];
                if (newstr.IndexOf("@") != -1)
                {
                    var name_str = newstr.Split("@");
                    int dotCount = Regex.Matches(name_str[0], "\\.").Count;
                    RtonFile.writeUInt8(0x83);
                    if (dotCount == 2)
                    {
                        var intStr = name_str[0].Split(".");
                        RtonFile.writeUInt8(0x02);
                        RtonFile.writeVarInt32(name_str[1].Length);
                        RtonFile.writeStringByVarInt32(name_str[1]);
                        RtonFile.writeVarInt32(Convert.ToInt32(intStr[1]));
                        RtonFile.writeVarInt32(Convert.ToInt32(intStr[0]));
                        var hexBytes = Convert.FromHexString(intStr[2]);
                        Array.Reverse(hexBytes);
                        RtonFile.writeBytes(hexBytes);
                    }
                    else
                    {
                        RtonFile.writeUInt8(0x03);
                        RtonFile.writeVarInt32(name_str[1].Length);
                        RtonFile.writeStringByVarInt32(name_str[1]);
                        RtonFile.writeVarInt32(name_str[0].Length);
                        RtonFile.writeStringByVarInt32(name_str[0]);
                    }
                    return true;
                }
            }
            return false;
        }

        private static void WriteNumber(SenBuffer RtonFile, JsonElement value)
        {
            if (value.GetRawText().IndexOf('.') > -1)
            {
                double F64Val = value.GetDouble();
                if (F64Val == 0.0)
                {
                    RtonFile.writeUInt8(0x23);
                }
                else
                {
                    float F32Val = value.GetSingle();
                    if (((double)F32Val) == F64Val)
                    {
                        RtonFile.writeUInt8(0x22);
                        RtonFile.writeFloatLE(F32Val);
                    }
                    else
                    {
                        RtonFile.writeUInt8(0x42);
                        RtonFile.writeDoubleLE(F64Val);
                    }
                }
            }
            else
            {
                if (value.TryGetInt64(out long I64Val))
                {
                    if (I64Val == 0)
                    {
                        RtonFile.writeUInt8(0x21);
                    }
                    else if (I64Val > 0)
                    {
                        if (I64Val <= int.MaxValue)
                        {
                            RtonFile.writeUInt8(0x24);
                            RtonFile.writeVarInt32((int)I64Val);
                        }
                        else
                        {
                            RtonFile.writeUInt8(0x44);
                            RtonFile.writeVarInt64(I64Val);
                        }
                    }
                    else
                    {
                        if (I64Val + 0x40000000 >= 0)
                        {
                            RtonFile.writeUInt8(0x25);
                            RtonFile.writeZigZag32((int)I64Val);
                        }
                        else
                        {
                            RtonFile.writeUInt8(0x45);
                            RtonFile.writeZigZag64(I64Val);
                        }
                    }
                }
                else
                {
                    ulong v = value.GetUInt64();
                    RtonFile.writeUInt8(0x46);
                    RtonFile.writeBigUInt64LE(v);
                }
            }
        }

        private static void WriteValueJson(SenBuffer RtonFile, JsonElement value, List.StringPool R0x90, List.StringPool R0x92)
        {
            switch (value.ValueKind)
            {
                case JsonValueKind.Object:
                    RtonFile.writeUInt8(0x85);
                    WriteObject(RtonFile, value, R0x90, R0x92);
                    break;
                case JsonValueKind.Array:
                    RtonFile.writeUInt8(0x86);
                    WriteArray(RtonFile, value, R0x90, R0x92);
                    break;
                case JsonValueKind.Undefined:
                case JsonValueKind.Null:
                    RtonFile.writeUInt8(0x84);
                    break;
                case JsonValueKind.True:
                    RtonFile.writeBool(true);
                    break;
                case JsonValueKind.False:
                    RtonFile.writeBool(false);
                    break;
                case JsonValueKind.String:
                    WriteString(RtonFile, value.GetString(), R0x90, R0x92);
                    break;
                case JsonValueKind.Number:
                    WriteNumber(RtonFile, value);
                    break;
                default:
                    throw new RTONException($"not_a_rton", RtonFile.filePath ??= "undefined");
            }
        }

        private static void WriteObject(SenBuffer RtonFile, JsonElement json, List.StringPool R0x90, List.StringPool R0x92)
        {
            foreach (JsonProperty property in json.EnumerateObject())
            {
                WriteString(RtonFile, property.Name, R0x90, R0x92);
                WriteValueJson(RtonFile, property.Value, R0x90, R0x92);
            }
            RtonFile.writeUInt8(0xFF);
        }

        private static void WriteArray(SenBuffer RtonFile, JsonElement json, List.StringPool R0x90, List.StringPool R0x92)
        {
            RtonFile.writeUInt8(0xFD);
            int arrayLength = json.GetArrayLength();
            RtonFile.writeVarInt32(arrayLength);
            for (var i = 0; i < arrayLength; i++)
            {
                WriteValueJson(RtonFile, json[i], R0x90, R0x92);
            }
            RtonFile.writeUInt8(0xFE);
        }

    }
}
