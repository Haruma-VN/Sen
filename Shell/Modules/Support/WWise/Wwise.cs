using Sen.Shell.Modules.Standards.IOModule.Buffer;

namespace Sen.Shell.Modules.Support.WWise
{
    public class WWiseInfoSimple
    {
        public required BKHD bank_header { get; set; }
        public INIT[]? initialization { get; set; }
        public STMG? game_synchronization { get; set; }
        public int[]? embedded_media { get; set; }
        public HIRC[]? hierarchy { get; set; }
        public ENVS? environments { get; set; }
        public STID? reference { get; set; }
        public PLAT? platform_setting { get; set; }
    }

    public class BKHD
    {
        public required int version { get; set; }
        public required int id { get; set; }
        public required string head_expand { get; set; }
    }

    public class INIT
    {
        public required int id { get; set; }
        public required string name { get; set; }
    }

    public class STMG
    {
        public required string volume_threshold { get; set; }
        public required string max_voice_instances { get; set; }
        public int unknown_type_1 { get; set; }
        public required STMGStageGroup[] stage_group { get; set; }
        public required STMGSwitchGroup[] switch_group { get; set; }
        public required STMGGameParameter[] game_parameter { get; set; }
        public int unknown_type_2 { get; set; }

    }

    public class STMGStageGroup
    {
        public required int id { get; set; }
        public required STMGStageGroupData data { get; set; }
    }

    public class STMGStageGroupData
    {
        public required string default_transition_time { get; set; }
        public required string[] custom_transition { get; set; }
    }

    public class STMGSwitchGroup
    {
        public required int id { get; set; }
        public required STMGSwitchGroupData data { get; set; }
    }

    public class STMGSwitchGroupData
    {
        public required int parameter { get; set; }
        public int parameter_category { get; set; }
        public required string[] point { get; set; }
    }

    public class STMGGameParameter
    {
        public required int id { get; set; }
        public required string data { get; set; }
    }

    public class HIRC
    {
        public required int id { get; set; }
        public required int type { get; set; }
        public required string data { get; set; }
    }

    public class ENVS
    {
        public required ENVSItem obstruction { get; set; }
        public required ENVSItem occlusion { get; set; }
    }


    public class ENVSItem
    {
        public required ENVSVolume volume { get; set; }
        public required ENVSLowPassFilter low_pass_filter { get; set; }
        public ENVSHighPassFilter? high_pass_filter { get; set; }
    }

    public class ENVSVolume
    {
        public required string volume_value { get; set; }
        public required string[] volume_point { get; set; }
    }

    public class ENVSLowPassFilter
    {
        public required string low_pass_filter_vaule { get; set; }
        public required string[] low_pass_filter_point { get; set; }
    }
    public class ENVSHighPassFilter
    {
        public required string high_pass_filter_vaule { get; set; }
        public required string[] high_pass_filter_point { get; set; }
    }

    public class STID
    {
        public required STIDData[] data { get; set; }
        public int unknown_type { get; set; }
    }

    public class STIDData
    {
        public required int id { get; set; }
        public required string name { get; set; }
    }

    public class PLAT
    {
        public required string platform { get; set; }
    }

    public class WEMDATATemp
    {
        public required int offset { get; set; }
        public required int length { get; set; }
    }

    public class WwiseFunction
    {
        public static WWiseInfoSimple DecodeSimple(SenBuffer BNKFile, string outFolder)
        {
            string BKHD_magic = BNKFile.readString(4);
            if (BKHD_magic != "BKHD") throw new Exception("Invalid bnk magic");
            var BKHD_length = BNKFile.readInt32LE();
            var version = BNKFile.readInt32LE();
            if (version != 88 && version != 112 && version != 140)
            {
                throw new Exception("Only support bnk version 88, 112, 140");
            }
            var id = BNKFile.readInt32LE();
            var dataLength = BKHD_length - 8;
            var head_expand = CreateHexString(BNKFile.readBytes(dataLength));
            var WwiseInfo = new WWiseInfoSimple
            {
                bank_header = new BKHD
                {
                    version = version,
                    id = id,
                    head_expand = head_expand,
                }
            };
            var BNKFileLength = BNKFile.length;
            while (BNKFile.readOffset < BNKFileLength) DecodeType(BNKFile, WwiseInfo, outFolder);
            if (BNKFile.readOffset != BNKFileLength) throw new Exception("Invalid BNKFile Reader");
            BNKFile.Close();
            return WwiseInfo; // definition.json;
        }

        private static string CreateHexString(byte[] buffer)
        {
            string hexString = BitConverter.ToString(buffer);
            return hexString.Replace("-", "");
        }

        private static void DecodeType(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo, string outFolder)
        {
            var BNKType = BNKFile.readString(4);
            switch (BNKType)
            {
                case "DIDX":
                    DecodeDIDX(BNKFile, WwiseInfo, outFolder);
                    return;
                case "INIT":
                    DecodeINIT(BNKFile, WwiseInfo);
                    return;
                case "STMG":
                    DecodeSTMG(BNKFile, WwiseInfo);
                    return;
                case "ENVS":
                    DecodeENVS(BNKFile, WwiseInfo);
                    return;
                case "HIRC":
                    DecodeHIRC(BNKFile, WwiseInfo);
                    return;
                case "STID":
                    DecodeSTID(BNKFile, WwiseInfo);
                    return;
                case "PLAT":
                    DecodePLAT(BNKFile, WwiseInfo);
                    return;
                case "FXPR":
                    throw new Exception("unsupported_fxpr");
                default:
                    throw new Exception("invalid_bnk");

            }
        }
        private static void DecodeDIDX(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo, string outFolder)
        {
            var DIDXLength = BNKFile.readInt32LE() + BNKFile.readOffset;
            var DIDX = new int[DIDXLength];
            var DATAList = new List<WEMDATATemp>();
            for (var i = 0; BNKFile.readOffset < DIDXLength; i++)
            {
                DIDX[i] = BNKFile.readInt32LE();
                DATAList.Add(new WEMDATATemp
                {
                    offset = BNKFile.readInt32LE(),
                    length = BNKFile.readInt32LE(),
                });
            }
            if (BNKFile.readString(4) != "DATA") throw new Exception("Invalid Wem Data Bank");
            var DATALength = BNKFile.readInt32LE();
            var WemDATAStartOffset = BNKFile.readOffset;
            var WemLength = 0;
            for (WemLength = 0; BNKFile.readOffset < DATALength; WemLength++)
            {
                var WemFile = new SenBuffer(BNKFile.readBytes(DATAList[WemLength].length));
                WemFile.OutFile($"{outFolder}/embedded_audio/{DIDX[WemLength]}");
                if (BNKFile.readOffset != WemDATAStartOffset + DATAList[WemLength].offset)
                {
                    throw new Exception("Invalid Data Offset: {BNKFile.readOffset}");
                }
            }
            if (WemLength != DIDX.Length) throw new Exception("Invalid DIDX Items Count");
            WwiseInfo.embedded_media = DIDX;
        }

        private static void DecodeINIT(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // INITLength;
            var INITNumber = BNKFile.readInt32LE();
            var INITList = new INIT[INITNumber];
            for (var i = 0; i < INITNumber; i++)
            {
                INITList[i] = new INIT
                {
                    id = BNKFile.readInt32LE(),
                    name = BNKFile.readStringByEmpty(),
                };
            }
            WwiseInfo.initialization = INITList;
        }

        private static void DecodeSTMG(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // STMGLength;
            var volumeThresHold = CreateHexString(BNKFile.readBytes(4));
            var maxVoiceInstances = CreateHexString(BNKFile.readBytes(2));
            var unknown_type_1 = 0;
            if (WwiseInfo.bank_header.version == 140)
            {
                unknown_type_1 = BNKFile.readInt16LE();
            }
            var STMGStageNumber = BNKFile.readInt32LE();
            var stageGroupList = new STMGStageGroup[STMGStageNumber];
            for (var i = 0; i < STMGStageNumber; i++)
            {
                var id = BNKFile.readInt32LE();
                var defaultTransitionTime = CreateHexString(BNKFile.readBytes(4));
                var numberMS = BNKFile.readInt32LE();
                var customTransiton = new string[numberMS];
                for (var k = 0; k < numberMS; k++)
                {
                    customTransiton[i] = CreateHexString(BNKFile.readBytes(12));
                }
                stageGroupList[i] = new STMGStageGroup
                {
                    id = id,
                    data = new STMGStageGroupData
                    {
                        default_transition_time = defaultTransitionTime,
                        custom_transition = customTransiton
                    }
                };
            }
            var STMGSwitchNumber = BNKFile.readInt32LE();
            var switchGroupList = new STMGSwitchGroup[STMGSwitchNumber];
            for (var i = 0; i < STMGSwitchNumber; i++)
            {
                var id = BNKFile.readInt32LE();
                var parameter = BNKFile.readInt32LE();
                var parameterCategoty = 0;
                if (WwiseInfo.bank_header.version == 112 || WwiseInfo.bank_header.version == 140)
                {
                    parameterCategoty = BNKFile.readInt8();
                }
                var parameterNumber = BNKFile.readInt32LE();
                var pointList = new string[parameterNumber];
                for (var k = 0; k < parameterNumber; k++)
                {
                    pointList[i] = CreateHexString(BNKFile.readBytes(12));
                }
                switchGroupList[i] = new STMGSwitchGroup
                {
                    id = id,
                    data = new STMGSwitchGroupData
                    {
                        parameter = parameter,
                        parameter_category = parameterCategoty,
                        point = pointList
                    }
                };
            }
            var gameParameterNumber = BNKFile.readInt32LE();
            var gameParameterList = new STMGGameParameter[gameParameterNumber];
            for (var i = 0; i < gameParameterNumber; i++)
            {
                if (WwiseInfo.bank_header.version == 112 || WwiseInfo.bank_header.version == 140)
                {
                    gameParameterList[i] = new STMGGameParameter
                    {
                        id = BNKFile.readInt32LE(),
                        data = CreateHexString(BNKFile.readBytes(17)),
                    };
                }
                else
                {
                    gameParameterList[i] = new STMGGameParameter
                    {
                        id = BNKFile.readInt32LE(),
                        data = CreateHexString(BNKFile.readBytes(4)),
                    };
                }
            }
            var unknown_type_2 = 0;
            if (WwiseInfo.bank_header.version == 140) unknown_type_2 = BNKFile.readInt32LE();
            WwiseInfo.game_synchronization = new STMG
            {
                volume_threshold = volumeThresHold,
                max_voice_instances = maxVoiceInstances,
                unknown_type_1 = unknown_type_1,
                stage_group = stageGroupList,
                switch_group = switchGroupList,
                game_parameter = gameParameterList,
                unknown_type_2 = unknown_type_2,
            };
        }

        private static void DecodeENVS(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // ENVSLength;
            WwiseInfo.environments = new ENVS
            {
                obstruction = DecodeENVSItem(BNKFile, WwiseInfo),
                occlusion = DecodeENVSItem(BNKFile, WwiseInfo)
            };
        }

        private static ENVSItem DecodeENVSItem(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            var volumeValue = CreateHexString(BNKFile.readBytes(2));
            var volumeNumber = BNKFile.readInt16LE();
            var volumePointPoint = new string[volumeNumber];
            for (var i = 0; i < volumeNumber; i++)
            {
                volumePointPoint[i] = CreateHexString(BNKFile.readBytes(12));
            }
            var lowPassFilterValue = CreateHexString(BNKFile.readBytes(2));
            var lowPassFilterNumber = BNKFile.readInt16LE();
            var lowPassFilterPoint = new string[volumeNumber];
            for (var i = 0; i < volumeNumber; i++)
            {
                lowPassFilterPoint[i] = CreateHexString(BNKFile.readBytes(12));
            }
            if (WwiseInfo.bank_header.version == 112 || WwiseInfo.bank_header.version == 140)
            {
                var highPassFilterValue = CreateHexString(BNKFile.readBytes(2));
                var highPassFilterNumber = BNKFile.readInt16LE();
                var highPassFilterPoint = new string[volumeNumber];
                for (var i = 0; i < volumeNumber; i++)
                {
                    highPassFilterPoint[i] = CreateHexString(BNKFile.readBytes(12));
                }
                return new ENVSItem
                {
                    volume = new ENVSVolume
                    {
                        volume_value = volumeValue,
                        volume_point = volumePointPoint
                    },
                    low_pass_filter = new ENVSLowPassFilter
                    {
                        low_pass_filter_vaule = lowPassFilterValue,
                        low_pass_filter_point = lowPassFilterPoint
                    },
                    high_pass_filter = new ENVSHighPassFilter
                    {
                        high_pass_filter_vaule = highPassFilterValue,
                        high_pass_filter_point = highPassFilterPoint
                    }
                };
            }
            else
            {
                return new ENVSItem
                {
                    volume = new ENVSVolume
                    {
                        volume_value = volumeValue,
                        volume_point = volumePointPoint
                    },
                    low_pass_filter = new ENVSLowPassFilter
                    {
                        low_pass_filter_vaule = lowPassFilterValue,
                        low_pass_filter_point = lowPassFilterPoint
                    }
                };
            }
        }

        private static void DecodeHIRC(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // HIRCLength;
            var HIRCNumber = BNKFile.readInt32LE();
            var HIRCList = new HIRC[HIRCNumber];
            for (var i = 0; i < HIRCNumber; i++)
            {
                var type = (int)BNKFile.readInt8();
                var length = BNKFile.readInt32LE();
                var id = BNKFile.readInt32LE();
                var data = CreateHexString(BNKFile.readBytes(length - 4));
                HIRCList[i] = new HIRC
                {
                    type = type,
                    id = id,
                    data = data,
                };
            }
            WwiseInfo.hierarchy = HIRCList;
        }

        private static void DecodeSTID(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // STIDLength;
            var unknown_type = BNKFile.readInt32LE();
            var STIDNumber = BNKFile.readInt32LE();
            var dataList = new STIDData[STIDNumber];
            for (var i = 0; i < STIDNumber; i++)
            {
                dataList[i] = new STIDData
                {
                    id = BNKFile.readInt32LE(),
                    name = BNKFile.readString(BNKFile.readInt8()),
                };
            }
            WwiseInfo.reference = new STID
            {
                data = dataList,
                unknown_type = unknown_type,
            };
        }
        private static void DecodePLAT(SenBuffer BNKFile, WWiseInfoSimple WwiseInfo)
        {
            BNKFile.readInt32LE(); // PLATLength;
            WwiseInfo.platform_setting = new PLAT
            {
                platform = BNKFile.readStringByEmpty(),
            };
        }

        // Encode 
        public static SenBuffer EncodeSimple(WWiseInfoSimple WwiseInfo, string inFolder)
        {
            var BNKFile = new SenBuffer();
            foreach (var WwiseProperty in WwiseInfo.GetType().GetProperties())
            {
                var WwiseValue = WwiseProperty.GetValue(WwiseInfo);
                if (WwiseValue != null)
                {
                    EncodeType(BNKFile, WwiseValue, WwiseInfo, inFolder);
                }
            }
            return BNKFile;
        }

        private static byte[] ConvertHexString(string hexString)
        {
            return Convert.FromHexString(hexString.Replace(" ", ""));
        }

        private static void EncodeType<T>(SenBuffer BNKFile, T WWiseType, WWiseInfoSimple WWiseInfo, string inFolder)
        {
            switch (WWiseType)
            {
                case BKHD:
                    EncodeBKHD(BNKFile, WWiseInfo.bank_header);
                    return;
                case int[]:
                    EncodeDIDX(BNKFile, WWiseInfo.embedded_media!, inFolder);
                    return;
                case INIT[]:
                    EncodeINIT(BNKFile, WWiseInfo.initialization!);
                    return;
                case STMG:
                    EncodeSTMG(BNKFile, WWiseInfo.game_synchronization!, WWiseInfo.bank_header.version);
                    return;
                case ENVS:
                    EncodeENVS(BNKFile, WWiseInfo.environments!, WWiseInfo.bank_header.version);
                    return;
                case HIRC[]:
                    EncodeHIRC(BNKFile, WWiseInfo.hierarchy!);
                    return;
                case STID:
                    EncodeSTID(BNKFile, WWiseInfo.reference!);
                    return;
                case PLAT:
                    EncodePLAT(BNKFile, WWiseInfo.platform_setting!);
                    return;
                default:
                    throw new Exception("invalid_bnk_type");
            }
        }

        private static void InsertTypeLength(SenBuffer BNKFile, long lengthOffset)
        {

            BNKFile.BackupWriteOffset();
            BNKFile.writeInt32LE((int)(BNKFile.writeOffset - lengthOffset), lengthOffset);
            BNKFile.RestoreWriteOffset();
        }

        private static void EncodeBKHD(SenBuffer BNKFile, BKHD BKHDInfo)
        {
            if (BKHDInfo.version != 88 && BKHDInfo.version != 112 && BKHDInfo.version != 140)
            {
                throw new Exception("Only support BNK version 88, 112, 140");
            }
            var head_expand = ConvertHexString(BKHDInfo.head_expand);
            BNKFile.writeString("BKHD");
            BNKFile.writeInt32LE(BKHDInfo.version, 8);
            BNKFile.writeInt32LE(BKHDInfo.id);
            BNKFile.writeBytes(head_expand);
            InsertTypeLength(BNKFile, 4);
        }

        private static void EncodeDIDX(SenBuffer BNKFile, int[] DIDXInfo, string inFolder)
        {
            var DATABank = new SenBuffer();
            BNKFile.writeString("DIDX");
            var DIDXLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            var DIDXLength = DIDXInfo.Length;
            Array.Sort(DIDXInfo);
            for (var i = 0; i < DIDXLength; i++)
            {
                var WemSen = new SenBuffer($"{inFolder}/embedded_audio/{DIDXInfo[i]}.wem");
                BNKFile.writeInt32LE(DIDXInfo[i]);
                BNKFile.writeInt32LE((int)DATABank.writeOffset);
                BNKFile.writeInt32LE((int)WemSen.length);
                DATABank.writeBytes(WemSen.toBytes());
                DATABank.writeNull(DATABeautifyOffset((int)WemSen.length));
                WemSen.Close();
            }
            InsertTypeLength(BNKFile, DIDXLengthOffset);
            BNKFile.writeString("DATA");
            BNKFile.writeInt32LE((int)DATABank.length);
            BNKFile.writeBytes(DATABank.toBytes());
            DATABank.Close();
        }

        private static int DATABeautifyOffset(int length)
        {
            if (length % 16 == 0) return 16;
            else
            {
                var newLength = length % 16;
                for (var i = 0; i < 8; i++)
                {
                    if ((length + newLength) % 16 != 0)
                    {
                        newLength += 1;
                    }
                }
                return newLength;
            }
        }

        private static void EncodeINIT(SenBuffer BNKFile, INIT[] INITInfo)
        {
            BNKFile.writeString("INIT");
            var INITLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            var INITLength = INITInfo.Length;
            for (var i = 0; i < INITLength; i++)
            {
                BNKFile.writeInt32LE(INITInfo[i].id);
                BNKFile.writeStringByEmpty(INITInfo[i].name);
            }
        }

        private static void EncodeSTMG(SenBuffer BNKFile, STMG STMGInfo, int version)
        {
            BNKFile.writeString("STMG");
            var STMGLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            var volumeThresHold = ConvertHexString(STMGInfo.volume_threshold);
            if (volumeThresHold.Length != 4) throw new Exception("Invalid volume threshold");
            var maxVoiceInstances = ConvertHexString(STMGInfo.max_voice_instances);
            if (maxVoiceInstances.Length != 2) throw new Exception("Invalid max voice instances");
            BNKFile.writeBytes(volumeThresHold);
            BNKFile.writeBytes(maxVoiceInstances);
            if (version == 140)
            {
                BNKFile.writeInt16LE((short)STMGInfo.unknown_type_1);
            }
            var stageGroupLength = STMGInfo.stage_group.Length;
            BNKFile.writeInt32LE(stageGroupLength);
            for (var i = 0; i < stageGroupLength; i++)
            {
                BNKFile.writeInt32LE(STMGInfo.stage_group[i].id);
                var defaultTransitionTime = ConvertHexString(STMGInfo.stage_group[i].data.default_transition_time);
                if (defaultTransitionTime.Length != 4) throw new Exception("Invalid default transition time");
                BNKFile.writeBytes(defaultTransitionTime);
                var customTransitonLength = STMGInfo.stage_group[i].data.custom_transition.Length;
                BNKFile.writeInt32LE(customTransitonLength);
                for (var k = 0; k < customTransitonLength; k++)
                {
                    BNKFile.writeBytes(ConvertHexString(STMGInfo.stage_group[i].data.custom_transition[k]));
                }
            }
            var switchGroupLength = STMGInfo.switch_group.Length;
            BNKFile.writeInt32LE(switchGroupLength);
            for (var i = 0; i < switchGroupLength; i++)
            {
                BNKFile.writeInt32LE(STMGInfo.switch_group[i].id);
                BNKFile.writeInt32LE(STMGInfo.switch_group[i].data.parameter);
                if (version == 112 || version == 140) BNKFile.writeInt8((sbyte)STMGInfo.switch_group[i].data.parameter_category);
                var pointLength = STMGInfo.switch_group[i].data.point.Length;
                for (var k = 0; k < pointLength; k++)
                {
                    BNKFile.writeBytes(ConvertHexString(STMGInfo.switch_group[i].data.point[k]));
                }
            }
            var gameParameterLength = STMGInfo.game_parameter.Length;
            BNKFile.writeInt32LE(gameParameterLength);
            for (var i = 0; i < gameParameterLength; i++)
            {
                BNKFile.writeInt32LE(STMGInfo.game_parameter[i].id);
                var parameterData = ConvertHexString(STMGInfo.game_parameter[i].data);
                if (version == 112 && parameterData.Length != 17 || version == 140 && parameterData.Length != 17)
                {
                    throw new Exception("Invalid parameter data");
                }
                if (version == 88 && parameterData.Length != 4) throw new Exception("Invalid parameter data");
                BNKFile.writeBytes(parameterData);
            }
            if (version == 140) BNKFile.writeInt32LE(STMGInfo.unknown_type_2);
            InsertTypeLength(BNKFile, STMGLengthOffset);
        }

        private static void EncodeENVS(SenBuffer BNKFile, ENVS ENVSInfo, int version)
        {
            BNKFile.writeString("ENVS");
            var ENVSLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            EncodeENVSItem(BNKFile, ENVSInfo.obstruction, version);
            EncodeENVSItem(BNKFile, ENVSInfo.obstruction, version);
            InsertTypeLength(BNKFile, ENVSLengthOffset);
        }

        private static void EncodeENVSItem(SenBuffer BNKFile, ENVSItem ENVSItemInfo, int version)
        {
            BNKFile.writeBytes(ConvertHexString(ENVSItemInfo.volume.volume_value));
            var volumePointLength = ENVSItemInfo.volume.volume_point.Length;
            BNKFile.writeInt16LE((short)volumePointLength);
            for (var i = 0; i < volumePointLength; i++)
            {
                BNKFile.writeBytes(ConvertHexString(ENVSItemInfo.volume.volume_point[i]));
            }
            BNKFile.writeBytes(ConvertHexString(ENVSItemInfo.volume.volume_value));
            var lowPassFilterNumber = ENVSItemInfo.low_pass_filter.low_pass_filter_point.Length;
            BNKFile.writeInt16LE((short)lowPassFilterNumber);
            for (var i = 0; i < lowPassFilterNumber; i++)
            {
                BNKFile.writeBytes(ConvertHexString(ENVSItemInfo.low_pass_filter.low_pass_filter_point[i]));
            }
            if (version == 112 || version == 140)
            {
                var highPassFilterNumber = ENVSItemInfo.high_pass_filter!.high_pass_filter_point.Length;
                BNKFile.writeInt16LE((short)highPassFilterNumber);
                for (var i = 0; i < highPassFilterNumber; i++)
                {
                    BNKFile.writeBytes(ConvertHexString(ENVSItemInfo.high_pass_filter.high_pass_filter_point[i]));
                }
            }
        }

        private static void EncodeHIRC(SenBuffer BNKFile, HIRC[] HIRCInfo)
        {
            BNKFile.writeString("HIRC");
            var HIRCLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            var HIRCLength = HIRCInfo.Length;
            for (var i = 0; i < HIRCLength; i++)
            {
                var data = ConvertHexString(HIRCInfo[i].data);
                BNKFile.writeInt8((sbyte)HIRCInfo[i].type);
                BNKFile.writeInt32LE(data.Length + 4);
                BNKFile.writeInt32LE(HIRCInfo[i].id);
                BNKFile.writeBytes(data);
            }
            InsertTypeLength(BNKFile, HIRCLengthOffset);
        }

        private static void EncodeSTID(SenBuffer BNKFile, STID STIDInfo)
        {
            BNKFile.writeString("STID");
            var STIDLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            BNKFile.writeInt32LE(STIDInfo.unknown_type);
            var STIDDataLength = STIDInfo.data.Length;
            BNKFile.writeInt32LE(STIDDataLength);
            for (var i = 0; i < STIDDataLength; i++)
            {
                BNKFile.writeInt32LE(STIDInfo.data[i].id);
                BNKFile.writeInt8((sbyte)STIDInfo.data[i].name.Length);
                BNKFile.writeString(STIDInfo.data[i].name);
            }
            InsertTypeLength(BNKFile, STIDLengthOffset);
        }

        private static void EncodePLAT(SenBuffer BNKFile, PLAT PLATInfo)
        {
            BNKFile.writeString("PLAT");
            var PLATLengthOffset = BNKFile.writeOffset;
            BNKFile.writeNull(4);
            BNKFile.writeStringByEmpty(PLATInfo.platform);
            InsertTypeLength(BNKFile, PLATLengthOffset);
        }
    }

}