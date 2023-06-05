using Sen.Shell.Modules.Standards.IOModule.Buffer;
using System.Text.Json;
namespace Sen.Shell.Modules.Support.PvZ2.RTON
{
    public abstract class RTONHandlerAbstract
    {
        public abstract void Create_RTON_Decode(string inFile, string outFile);
    }
    public class RTONHandler : RTONHandlerAbstract
    {
        public override void Create_RTON_Decode(string inFile, string outFile)
        {
            SenBuffer RtonFile = new SenBuffer(inFile);
            SenBuffer JsonFile = RTONProcession.Decode(RtonFile, false);
            JsonFile.SaveFile(outFile);
        }
    }

    public abstract class RTONHandlerAsyncAbstract
    {
        public abstract Task Create_RTON_Decode_Async(string inFile, string outFile);
    }
    public class RTONHandlerAsync : RTONHandlerAsyncAbstract
    {
        public override async Task Create_RTON_Decode_Async(string inFile, string outFile)
        {
            var RtonFile = new SenBuffer(inFile);
            {
                var JsonFile = await Task.Run(() => RTONProcession.Decode(RtonFile, false));
                await JsonFile.SaveFileAsync(outFile);
            }
        }
    }

    public class RTONProcession
    {
        static readonly string magic = "RTON";

        static readonly uint version = 1;

        static readonly string EOR = "DONE";

        static readonly List<byte[]> R0x90List = new List<byte[]>();

        static readonly List<byte[]> R0x92List = new List<byte[]>();

        static readonly byte[] NULL = new byte[] { 0x2A };

        static readonly byte[] RTID0 = new byte[] { 0x52, 0x54, 0x49, 0x44, 0x28, 0x30, 0x29 };

        static readonly string Str_Null = "*";

        static readonly string Str_RTID_Begin = "RTID(";

        static readonly string Str_RTID_End = ")";

        static readonly string Str_RTID_0 = "RTID(0)";

        static readonly string Str_RTID_2 = "RTID({0}.{1}.{2:x8}@{3})";

        static readonly string Str_RTID_3 = "RTID({0}@{1})";

        static readonly string Str_Binary = "$BINARY(\"{0}\", {1})";

        static readonly string Str_Binary_Begin = "$BINARY(\"";

        static readonly string Str_Binary_End = ")";

        static readonly string Str_Binary_Middle = "\", ";

        static byte[]? tempstring;

        public static void Decrypt(SenBuffer RtonFile)
        {

        }

        public static SenBuffer Decode(SenBuffer RtonFile, bool DecryptFile)
        {
            Stream stream = new MemoryStream();
            Utf8JsonWriter jsonWriter = new Utf8JsonWriter(stream);
            if (DecryptFile)
            {
                Decrypt(RtonFile);
            }
            string Rton_magic = RtonFile.readString(4);
            uint Rton_ver = RtonFile.readUInt32LE();
            if (Rton_magic != magic) throw new Exception();
            if (Rton_ver != version) throw new Exception();
            ReadObject(RtonFile, jsonWriter);
            string EOF = RtonFile.readString(4);
            if (EOF != EOR) throw new Exception();
            SenBuffer JsonFile = new SenBuffer(stream);
            return JsonFile;
        }

        private static void ReadBytecode(byte bytecode, bool valueType, SenBuffer RtonFile, Utf8JsonWriter jsonWriter)
        {
            switch (bytecode)
            {
                case 0x0:
                    jsonWriter.WriteBooleanValue(false);
                    break;
                case 0x1:
                    jsonWriter.WriteBooleanValue(true);
                    break;
                case 0x2:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(NULL);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(NULL);
                    }
                    break;
                case 0x8:
                    jsonWriter.WriteNumberValue(RtonFile.readInt8());
                    break;
                case 0x9:
                    jsonWriter.WriteNumberValue(0);
                    break;
                case 0xA:
                    jsonWriter.WriteNumberValue(RtonFile.readUInt8());
                    break;
                case 0xB:
                    jsonWriter.WriteNumberValue(0);
                    break;
                case 0x10:
                    jsonWriter.WriteNumberValue(RtonFile.readInt16LE());
                    break;
                case 0x11:
                    jsonWriter.WriteNumberValue(0);
                    break;
                case 0x12:
                    jsonWriter.WriteNumberValue(RtonFile.readUInt16LE());
                    break;
                case 0x13:
                    jsonWriter.WriteNumberValue(0);
                    break;
                case 0x20:
                    jsonWriter.WriteNumberValue(RtonFile.readInt32LE());
                    break;
                case 0x21:
                    jsonWriter.WriteNumberValue(0);
                    break;
                case 0x22:
                    jsonWriter.WriteNumberValue(RtonFile.readFloatLE());
                    break;
                case 0x23:
                    jsonWriter.WriteNumberValue(0F);
                    break;
                case 0x24:
                    jsonWriter.WriteNumberValue(RtonFile.readVarInt32());
                    break;
                case 0x25:
                    jsonWriter.WriteNumberValue(RtonFile.readZigZag32());
                    break;
                case 0x26:
                    jsonWriter.WriteNumberValue(RtonFile.readUInt32LE());
                    break;
                case 0x27:
                    jsonWriter.WriteNumberValue(0U);
                    break;
                case 0x28:
                    jsonWriter.WriteNumberValue(RtonFile.readVarUInt32());
                    break;
                case 0x40:
                    jsonWriter.WriteNumberValue(RtonFile.readBigInt64LE());
                    break;
                case 0x41:
                    jsonWriter.WriteNumberValue(0L);
                    break;
                case 0x42:
                    jsonWriter.WriteNumberValue(RtonFile.readDoubleLE());
                    break;
                case 0x43:
                    jsonWriter.WriteNumberValue(0D);
                    break;
                case 0x44:
                    jsonWriter.WriteNumberValue(RtonFile.readVarInt64());
                    break;
                case 0x45:
                    jsonWriter.WriteNumberValue(RtonFile.readZigZag64());
                    break;
                case 0x46:
                    jsonWriter.WriteNumberValue(RtonFile.readBigUInt64LE());
                    break;
                case 0x47:
                    jsonWriter.WriteNumberValue(0UL);
                    break;
                case 0x48:
                    jsonWriter.WriteNumberValue(RtonFile.readVarUInt64());
                    break;
                case 0x81:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(RtonFile.readBytes(RtonFile.readVarInt32()));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(RtonFile.readBytes(RtonFile.readVarInt32()));
                    }
                    break;
                case 0x82:
                    RtonFile.readVarInt32();
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(RtonFile.readBytes(RtonFile.readVarInt32()));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(RtonFile.readBytes(RtonFile.readVarInt32()));
                    }
                    break;
                case 0x83:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(ReadRTID(RtonFile));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(ReadRTID(RtonFile));
                    }
                    break;
                case 0x84:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(RTID0);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(RTID0);
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
                        jsonWriter.WriteStringValue(ReadBinary(RtonFile));
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(ReadBinary(RtonFile));
                    }
                    break;
                case 0x90:
                    tempstring = RtonFile.readBytes(RtonFile.readVarInt32());
                    R0x90List.Add(tempstring);
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(tempstring);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(tempstring);
                    }
                    break;
                case 0x91:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(R0x90List[RtonFile.readVarInt32()]);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(R0x90List[RtonFile.readVarInt32()]);
                    }
                    break;
                case 0x92:
                    RtonFile.readVarInt32();
                    tempstring = RtonFile.readBytes(RtonFile.readVarInt32());
                    R0x92List.Add(tempstring);
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(tempstring);
                    }
                    else
                    {
                        jsonWriter.WritePropertyName(tempstring);
                    }
                    break;
                case 0x93:
                    if (valueType)
                    {
                        jsonWriter.WriteStringValue(R0x92List[RtonFile.readVarInt32()]);
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
                    throw new Exception("0xb0-0xbb is not supported!");
                case 0xBC:
                    jsonWriter.WriteBooleanValue(RtonFile.readUInt8() != 0);
                    break;
                default:
                    throw new Exception();

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
                case 0x01: //Not sure
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
                    throw new Exception($"No such type in 0x83: {temp}");
            }
        }

        private static void ReadObject(SenBuffer RtonFile, Utf8JsonWriter jsonWriter)
        {
            jsonWriter.WriteStartObject();
            byte bytecode;
            do
            {
                bytecode = RtonFile.readUInt8();
                ReadBytecode(bytecode, false, RtonFile, jsonWriter);
                ReadBytecode(RtonFile.readUInt8(), true, RtonFile, jsonWriter);
            }
            while (bytecode != 0xFF);
            jsonWriter.WriteEndObject();
        }

        private static void ReadArray(SenBuffer RtonFile, Utf8JsonWriter jsonWriter)
        {
            jsonWriter.WriteStartArray();
            byte bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFD) throw new Exception();
            int number = RtonFile.readVarInt32();
            for (var i = 0; i < number; i++)
            {
                bytecode = RtonFile.readUInt8();
                ReadBytecode(bytecode, true, RtonFile, jsonWriter);
            }
            bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFE) throw new Exception();
            jsonWriter.WriteEndArray();
        }
    }
}