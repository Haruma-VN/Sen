using Sen.Shell.Modules.Standards.IOModule.Buffer;
using System.Text.Json;
using System.Text.Encodings.Web;
using Sen.Shell.Modules.Standards;

namespace Sen.Shell.Modules.Support.PvZ2.RTON
{
    [Flags]
    public enum RTONListException
    {
        Magic,
        Version,
        Ends,
    }

    #pragma warning disable IDE0090
    #pragma warning disable IDE0230
    #pragma warning disable CS0414
    #pragma warning disable IDE0060

    public class RTONProcession
    {
        public static readonly string magic = "RTON";

        public static readonly uint version = 1;

        public static readonly string EOR = "DONE";

        public static readonly List<byte[]> R0x90List = new List<byte[]>();

        public static readonly List<byte[]> R0x92List = new List<byte[]>();

        public static readonly List<string> R0x90WriteList = new List<string>();

        public static readonly List<string> R0x92WriteList = new List<string>();


        public static readonly byte[] NULL = new byte[] { 0x2A };

        public static readonly byte[] RTID0 = new byte[] { 0x52, 0x54, 0x49, 0x44, 0x28, 0x30, 0x29 };

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

        public static byte[]? tempstring;

        public static void Decrypt(SenBuffer RtonFile)
        {

        }
        // Rton_to_Json
        public static SenBuffer Decode(SenBuffer RtonFile, bool DecryptFile)
        {
            R0x90List.Clear();
            R0x92List.Clear();
            Stream stream = new MemoryStream();
            Utf8JsonWriter jsonWriter = new Utf8JsonWriter(stream, new JsonWriterOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                Indented = true
            });
            if (DecryptFile)
            {
                Decrypt(RtonFile);
            }
            string Rton_magic = RtonFile.readString(4);
            uint Rton_ver = RtonFile.readUInt32LE();
            if (Rton_magic != magic) throw new RTONDecodeException(
                $"wrong_rton_header", 
                RtonFile.filePath ??= "undefined", 
                $"begin_with_rton",
                RTONListException.Magic
                );

            if (Rton_ver != version) throw new RTONDecodeException(
                $"wrong_rton_version",
                RtonFile.filePath ??= "undefined",
                $"version_must_be_1", 
                RTONListException.Version
                );
            ReadObject(RtonFile, jsonWriter);
            string EOF = RtonFile.readString(4);
            if (EOF != EOR) throw new RTONDecodeException($"end_of_rton_file_wrong",
                RtonFile.filePath ??= "undefined", 
                $"end_of_rton_must_be_done", 
                RTONListException.Ends);
            jsonWriter.Flush();
            SenBuffer JsonFile = new SenBuffer(stream);
            R0x90List.Clear();
            R0x92List.Clear();
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
                    int num = RtonFile.readVarInt32();
                    tempstring = RtonFile.readBytes(num);
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
                    throw new RTONException($"Not a RTON", RtonFile.filePath ??= "undefined");
                case 0xBC:
                    jsonWriter.WriteBooleanValue(RtonFile.readUInt8() != 0);
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
                    throw new RTONException($"Not a RTON", RtonFile.filePath ??= "undefined");
            }
        }

        private static void ReadObject(SenBuffer RtonFile, Utf8JsonWriter jsonWriter)
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

        private static void ReadArray(SenBuffer RtonFile, Utf8JsonWriter jsonWriter)
        {
            jsonWriter.WriteStartArray();
            byte bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFD) throw new RTONException($"Not a RTON", RtonFile.filePath ??= "undefined");
            int number = RtonFile.readVarInt32();
            for (var i = 0; i < number; i++)
            {
                bytecode = RtonFile.readUInt8();
                ReadBytecode(bytecode, true, RtonFile, jsonWriter);
            }
            bytecode = RtonFile.readUInt8();
            if (bytecode != 0xFE) throw new RTONException($"Not a RTON", RtonFile.filePath ??= "undefined");
            jsonWriter.WriteEndArray();
        }

        //Json to Rton
        public static SenBuffer Encode(byte[] JsonBuffer, bool EncryptFile)
        {
            R0x90WriteList.Clear();
            R0x92WriteList.Clear();
            Stream stream = new MemoryStream(JsonBuffer);
            JsonDocument Json = JsonDocument.Parse(stream, new JsonDocumentOptions { AllowTrailingCommas = true });
            JsonElement root = Json.RootElement;
            SenBuffer RtonFile = new SenBuffer();
            RtonFile.writeString(magic);
            RtonFile.writeUInt32LE(version);
            WriteObject(RtonFile, root);
            RtonFile.writeString(EOR);
            R0x90WriteList.Clear();
            R0x92WriteList.Clear();
            return RtonFile;
        }

        private static bool IsASCII(string str)
        {
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] > 127) return false;
            }
            return true;
        }

        private static void WriteString(SenBuffer RtonFile, string? str)
        {
            if (str == Str_Null)
            {
                RtonFile.writeUInt8(2);
            }
            else if (WriteRTID(RtonFile, str!)) { }
            else if (WriteBinary(RtonFile, str!)) { }
            else if (IsASCII(str!))
            {
                if (R0x90WriteList.Contains(str!))
                {
                    RtonFile.writeUInt8(0x91);
                    RtonFile.writeVarInt32(R0x90WriteList.IndexOf(str!));
                }
                else
                {
                    RtonFile.writeUInt8(0x90);
                    RtonFile.writeStringByVarInt32(str!);
                    R0x90WriteList.Add(str!);
                }
            }
            else
            {
                if (R0x90WriteList.Contains(str!))
                {
                    RtonFile.writeUInt8(0x93);
                    RtonFile.writeVarInt32(R0x92WriteList.IndexOf(str!));
                }
                else
                {
                    RtonFile.writeUInt8(0x92);
                    RtonFile.writeStringByVarInt32(str!);
                    R0x92WriteList.Add(str!);
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
                int index;
                if ((index = newstr.IndexOf('@')) > -1)
                {
                    RtonFile.writeUInt8(0x83);
                    string str1 = newstr[..index];
                    string str2 = newstr[(index + 1)..];
                    bool isr8302 = true;
                    int dot1index = 0, dot2index = 0, dindex = 0;
                    for (int i = 0; i < str1.Length; i++)
                    {
                        if (str1[i] == '.')
                        {
                            switch (dindex)
                            {
                                case 0:
                                    dot1index = i;
                                    break;
                                case 1:
                                    dot2index = i;
                                    break;
                                default:
                                    isr8302 = false;
                                    break;
                            }
                            dindex++;
                        }
                        else if (str1[i] > '9' && str1[i] < '0' && (!(dindex == 2 && ((str1[i] >= 'a' && str1[i] <= 'f') || (str1[i] >= 'A' && str1[i] <= 'F')))))
                        {
                            isr8302 = false;
                        }
                        if (!isr8302) break;
                    }
                    if (dindex != 2)
                    {
                        isr8302 = false;
                    }
                    if (isr8302)
                    {
                        RtonFile.writeUInt8(0x02);
                        RtonFile.writeVarInt32(str2.Length);
                        RtonFile.writeStringByVarInt32(str2);
                        RtonFile.writeVarInt32(Convert.ToInt32(str1[(dot1index + 1)..dot2index]));
                        RtonFile.writeVarInt32(Convert.ToInt32(str1[..dot1index]));
                        RtonFile.writeUVarInt32(Convert.ToUInt32(str1[(dot2index + 1)..]));
                    }
                    else
                    {
                        RtonFile.writeUInt8(0x03);
                        RtonFile.writeVarInt32(str2.Length);
                        RtonFile.writeStringByVarInt32(str2);
                        RtonFile.writeVarInt32(str1.Length);
                        RtonFile.writeStringByVarInt32(str1);
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
                            //rton24
                            RtonFile.writeUInt8(0x24);
                            RtonFile.writeVarInt32((int)I64Val);
                        }
                        else
                        {
                            //rton44
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

        private static void WriteVauleJson(SenBuffer RtonFile, JsonElement value) {
            switch (value.ValueKind)
                {
                    case JsonValueKind.Object:
                        RtonFile.writeUInt8(0x85);
                        WriteObject(RtonFile, value);
                        break;
                    case JsonValueKind.Array:
                        RtonFile.writeUInt8(0x86);
                        WriteArray(RtonFile, value);
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
                        WriteString(RtonFile, value.GetString());
                        break;
                    case JsonValueKind.Number:
                        WriteNumber(RtonFile, value);
                        break;
                    default:
                        throw new RTONException($"Not a RTON", RtonFile.filePath ??= "undefined");
                }
        }

        private static void WriteObject(SenBuffer RtonFile, JsonElement json)
        {
            foreach (JsonProperty property in json.EnumerateObject())
            {
                WriteString(RtonFile, property.Name);
                WriteVauleJson(RtonFile, property.Value);
            }
            RtonFile.writeUInt8(0xFF);
        }

        private static void WriteArray(SenBuffer RtonFile, JsonElement json)
        {
            RtonFile.writeUInt8(0xFD);
            int arrayLength = json.GetArrayLength();
            RtonFile.writeVarInt32(arrayLength);
            for (var i = 0; i < arrayLength; i++) {
                WriteVauleJson(RtonFile, json[i]);
            }
            RtonFile.writeUInt8(0xFE);
        }

    }
}
