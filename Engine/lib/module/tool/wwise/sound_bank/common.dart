// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "package:path/path.dart" as path;
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:convert/convert.dart";

class WWiseSoundBank {
  static void decode_fs(
    String inFile,
    String outDirectory,
  ) {
    final wwise = WWiseSoundBank();
    wwise.decodeSoundBank(SenBuffer.OpenFile(inFile), outDirectory);
    return;
  }

  static void encode_fs(
    String inDirectory,
    String outFile,
  ) {
    final wwise = WWiseSoundBank();
    final soundbank = wwise.encodeSoundBank(inDirectory);
    soundbank.outFile(outFile);
    return;
  }

  void decodeSoundBank(SenBuffer senFile, String outFolder) {
    final jsonFile = {};
    final bankHeaderMagic = senFile.readString(4);
    if (bankHeaderMagic != "BKHD") {
      throw Exception("invaild_bnk_magic");
    }
    final bankHeaderLength = senFile.readUInt32LE();
    final version = senFile.readUInt32LE();
    if (version != 88 && version != 112 && version != 140) {
      throw Exception("non_supported_bnk_version");
    }
    final id = senFile.readUInt32LE();
    final dataLength = bankHeaderLength - 12;
    final language = senFile.readUInt32LE();
    final headExpand = createHexString(senFile.readBytes(dataLength));
    jsonFile["bank_header"] = {
      "version": version,
      "id": id,
      "language": language,
      "head_expand": headExpand,
    };
    final senLength = senFile.length;
    while (senFile.readOffset < senLength) {
      decodeType(senFile, jsonFile, outFolder);
    }
    if (senFile.readOffset != senLength) {
      throw Exception("invaild_bnk_reader");
    }
    senFile.clear();
    FileSystem.writeJson(
      path.join(outFolder, "definition.json"),
      jsonFile,
      "\t",
    );
    return;
  }

  void decodeType(SenBuffer senFile, dynamic jsonFile, String outFolder) {
    final type = senFile.readString(4);
    switch (type) {
      case "DIDX":
        decodeEmbeddedMedia(senFile, jsonFile, outFolder);
        return;
      case "INIT":
        decodeInitialization(senFile, jsonFile);
        return;
      case "STMG":
        decodeGameSynchronization(senFile, jsonFile);
        return;
      case "ENVS":
        decodeEnviroments(senFile, jsonFile);
        return;
      case "HIRC":
        decodeHierarchy(senFile, jsonFile);
        return;
      case "STID":
        decodeReference(senFile, jsonFile);
        return;
      case "PLAT":
        decodePlatformSetting(senFile, jsonFile);
        return;
      case "FXPR":
        throw Exception("unsupported_fxpr");
      default:
        throw Exception("invaild_bnk_in_offset: ${senFile.readOffset}");
    }
  }

  void decodeEmbeddedMedia(
    SenBuffer senFile,
    dynamic jsonFile,
    String outFolder,
  ) {
    final didxLength = senFile.readUInt32LE() + senFile.readOffset;
    final didxList = <int>[];
    final dataList = [];
    for (var i = 0; senFile.readOffset < didxLength; i++) {
      didxList.add(senFile.readUInt32LE());
      dataList.add(
        {"offset": senFile.readUInt32LE(), "length": senFile.readUInt32LE()},
      );
    }
    if (senFile.readString(4) != "DATA") {
      throw Exception("invaild_data_bank_section");
    }
    final dataLength = senFile.readUInt32LE();
    final senBank = SenBuffer.fromBytes(senFile.readBytes(dataLength));
    for (var i = 0; i < dataList.length; i++) {
      final senWem = SenBuffer.fromBytes(
        senBank.readBytes(dataList[i]["length"], dataList[i]["offset"]),
      );
      senWem.outFile(
        path.join(outFolder, "embedded_audio", "${didxList[i]}.wem"),
      );
    }
    jsonFile["embedded_media"] = didxList;
    return;
  }

  void decodeInitialization(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    final initNumber = senFile.readUInt32LE();
    final initList = [];
    for (var i = 0; i < initNumber; i++) {
      initList.add(
        {"id": senFile.readUInt32LE(), "name": senFile.readStringByEmpty()},
      );
    }
    jsonFile["initialization"] = initList;
    return;
  }

  void decodeGameSynchronization(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    final volumeThresHold = createHexString(senFile.readBytes(4));
    final maxVoiceInstances = createHexString(senFile.readBytes(2));
    var unknownType1 = 0;
    final version = jsonFile["bank_header"]["version"];
    if (version == 140) {
      unknownType1 = senFile.readUInt16LE();
    }
    final stmgStageNumber = senFile.readUInt32LE();
    final stageGroupList = [];
    for (var i = 0; i < stmgStageNumber; i++) {
      final id = senFile.readUInt32LE();
      final defaultTransitionTime = createHexString(senFile.readBytes(4));
      final numberMS = senFile.readUInt32LE();
      final customTranstion = <String>[];
      for (var k = 0; k < numberMS; k++) {
        customTranstion.add(createHexString(senFile.readBytes(12)));
      }
      stageGroupList.add({
        "id": id,
        "data": {
          "default_transition_time": defaultTransitionTime,
          "custom_transition": customTranstion,
        },
      });
    }
    final stmgSwitchNumber = senFile.readUInt32LE();
    final switchGroupList = [];
    for (var i = 0; i < stmgSwitchNumber; i++) {
      final id = senFile.readUInt32LE();
      final parameter = senFile.readUInt32LE();
      var parameterCategory = 0;
      if (version == 112 || version == 140) {
        parameterCategory = senFile.readUInt8();
      }
      final parameterNumber = senFile.readUInt32LE();
      final pointList = <String>[];
      for (var k = 0; k < parameterNumber; k++) {
        pointList.add(createHexString(senFile.readBytes(12)));
      }
      switchGroupList.add({
        "id": id,
        "data": {
          "parameter": parameter,
          "parameter_category": parameterCategory,
          "point": pointList,
        },
      });
    }
    final gameParamterNumber = senFile.readUInt32LE();
    final gameParamterList = [];
    for (var i = 0; i < gameParamterNumber; i++) {
      if (version == 112 || version == 140) {
        gameParamterList.add({
          "id": senFile.readUInt32LE(),
          "data": createHexString(senFile.readBytes(17)),
        });
      } else {
        gameParamterList.add({
          "id": senFile.readUInt32LE(),
          "data": createHexString(senFile.readBytes(4)),
        });
      }
    }
    var unknownType2 = 0;
    if (version == 140) unknownType2 = senFile.readUInt32LE();
    jsonFile["game_synchronization"] = {
      "volume_threshold": volumeThresHold,
      "max_voice_instances": maxVoiceInstances,
      "unknown_type_1": unknownType1,
      "stage_group": stageGroupList,
      "switch_group": switchGroupList,
      "game_parameter": gameParamterList,
      "unknown_type_2": unknownType2,
    };
    return;
  }

  void decodeEnviroments(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    jsonFile["environments"] = {
      "obstruction": decodeEnviromentsItem(senFile, jsonFile),
      "occlusion": decodeEnviromentsItem(senFile, jsonFile),
    };
    return;
  }

  dynamic decodeEnviromentsItem(SenBuffer senFile, dynamic jsonFile) {
    final version = jsonFile["bank_header"]["version"];
    final volumeValue = createHexString(senFile.readBytes(2));
    final volumeNumber = senFile.readUInt16LE();
    final volumePoint = <String>[];
    for (var i = 0; i < volumeNumber; i++) {
      volumePoint.add(createHexString(senFile.readBytes(12)));
    }
    final lowPassFilterValue = createHexString(senFile.readBytes(2));
    final lowPassFilterNumber = senFile.readUInt16LE();
    final lowPassFilterPoint = <String>[];
    for (var i = 0; i < lowPassFilterNumber; i++) {
      lowPassFilterPoint.add(createHexString(senFile.readBytes(12)));
    }
    if (version == 112 || version == 140) {
      final highPassFilterValue = createHexString(senFile.readBytes(12));
      final highPassFilterNumber = senFile.readUInt16LE();
      final highPassFilterPoint = <String>[];
      for (var i = 0; i < highPassFilterNumber; i++) {
        highPassFilterPoint.add(createHexString(senFile.readBytes(12)));
      }
      return {
        "volume": {
          "volume_value": volumeValue,
          "volume_point": volumePoint,
        },
        "low_pass_filter": {
          "low_pass_filter_vaule": lowPassFilterValue,
          "low_pass_filter_point": lowPassFilterPoint,
        },
        "high_pass_filter": {
          "high_pass_filter_vaule": highPassFilterValue,
          "high_pass_filter_point": highPassFilterPoint,
        },
      };
    } else {
      return {
        "volume": {"volume_value": volumeValue, "volume_point": volumePoint},
        "low_pass_filter": {
          "low_pass_filter_vaule": lowPassFilterValue,
          "low_pass_filter_point": lowPassFilterPoint,
        },
      };
    }
  }

  void decodeHierarchy(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    final hircNumber = senFile.readUInt32LE();
    final hircList = [];
    for (var i = 0; i < hircNumber; i++) {
      final type = senFile.readUInt8();
      final length = senFile.readUInt32LE();
      final id = senFile.readUInt32LE();
      final data = createHexString(senFile.readBytes(length - 4));
      hircList.add({"type": type, "id": id, "data": data});
    }
    jsonFile["hierarchy"] = hircList;
    return;
  }

  void decodeReference(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    final unknownType = senFile.readUInt32LE();
    final stidNumber = senFile.readUInt32LE();
    final dataList = [];
    for (var i = 0; i < stidNumber; i++) {
      dataList.add(
        {
          "id": senFile.readUInt32LE(),
          "name": senFile.readStringByUInt8(),
        },
      );
    }
    jsonFile["reference"] = {
      "data": dataList,
      "unknown_type": unknownType,
    };
    return;
  }

  void decodePlatformSetting(SenBuffer senFile, dynamic jsonFile) {
    senFile.readUInt32LE();
    jsonFile["platform_setting"] = {"platform": senFile.readStringByEmpty()};
    return;
  }

  String createHexString(Uint8List bytes) {
    final hexString = bytes
        .map((byte) => byte.toRadixString(16).padLeft(2, "0"))
        .join(" ")
        .toUpperCase();
    return hexString;
  }

  SenBuffer encodeSoundBank(String inFolder) {
    final senFile = SenBuffer();
    final bnkKeysList = [
      "bank_header",
      "embedded_media",
      "initialization",
      "game_synchronization",
      "environments",
      "hierarchy",
      "reference",
      "platform_setting",
    ];
    final jsonFile =
        FileSystem.readJson(path.join(inFolder, "definition.json"));
    final bnkKeys = jsonFile.keys.toList();
    bnkKeys.sort(
      (a, b) => bnkKeysList.indexOf(a).compareTo(bnkKeysList.indexOf(b)),
    );
    if (!bnkKeys.contains("bank_header")) {
      throw Exception("missing_bank_header");
    }
    bnkKeys.forEach((e) {
      encodeType(senFile, jsonFile, e, inFolder);
    });
    return senFile;
  }

  void encodeType(
    SenBuffer senFile,
    dynamic jsonFile,
    String objectKey,
    String inFolder,
  ) {
    switch (objectKey) {
      case "bank_header":
        encodeBankHeader(senFile, jsonFile["bank_header"]);
        return;
      case "embedded_media":
        encodeEmbeddedMedia(senFile, jsonFile["embedded_media"], inFolder);
        return;
      case "initialization":
        encodeInitialization(senFile, jsonFile["initialization"]);
        return;
      case "game_synchronization":
        encodeGameSynchronization(
          senFile,
          jsonFile["game_synchronization"],
          jsonFile["bank_header"]["version"],
        );
        return;
      case "environments":
        encodeEnviroments(
          senFile,
          jsonFile["environments"],
          jsonFile["bank_header"]["version"],
        );
        return;
      case "hierarchy":
        encodeHierarchy(senFile, jsonFile["hierarchy"]);
        return;
      case "reference":
        encodeReference(senFile, jsonFile["reference"]);
        return;
      case "platform_setting":
        encodePlatformSetting(senFile, jsonFile["platform_setting"]);
        return;
      default:
        throw Exception("invaild_bnk");
    }
  }

  void encodeBankHeader(SenBuffer senFile, dynamic jsonFile) {
    final version = jsonFile["version"];
    if (version != 88 && version != 112 && version != 140) {
      throw Exception("non_support_bnk_version");
    }
    final headExpand = convertHexString(jsonFile["head_expand"]);
    senFile.writeString("BKHD");
    senFile.writeUInt32LE(jsonFile["version"], 8);
    senFile.writeUInt32LE(jsonFile["id"]);
    senFile.writeUInt32LE(jsonFile["language"]);
    senFile.writeBytes(headExpand);
    insertTypeLength(senFile, 4);
    return;
  }

  void encodeEmbeddedMedia(
    SenBuffer senFile,
    dynamic jsonFile,
    String inFolder,
  ) {
    final senData = SenBuffer();
    senFile.writeString("DIDX");
    final didxLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    final didxLength = jsonFile.length;
    for (var i = 0; i < didxLength; i++) {
      final senWem = SenBuffer.OpenFile(
        path.join(inFolder, "embedded_audio", "${jsonFile[i]}.wem"),
      );
      senFile.writeUInt32LE(jsonFile[i]);
      senFile.writeUInt32LE(senData.writeOffset);
      senFile.writeUInt32LE(senWem.length);
      senData.writeBytes(senWem.toBytes());
      if (i < didxLength - 1) {
        senData.writeNull(dataBeautifyOffset(senWem.length));
      }
      senWem.clear();
    }
    insertTypeLength(senFile, didxLengthOffset);
    senFile.writeString("DATA");
    senFile.writeUInt32LE(senData.length);
    senFile.writeBytes(senData.toBytes());
    senData.clear();
    return;
  }

  int dataBeautifyOffset(int length) {
    if (length % 16 == 0) {
      return 0;
    } else {
      return 16 - (length % 16);
    }
  }

  void encodeInitialization(SenBuffer senFile, dynamic jsonFile) {
    senFile.writeString("INIT");
    final initLengthOffsrt = senFile.writeOffset;
    senFile.writeNull(4);
    final intLength = jsonFile.length;
    senFile.writeUInt32LE(intLength);
    for (var i = 0; i < intLength; i++) {
      senFile.writeUInt32LE(jsonFile[i]["id"]);
      senFile.writeStringByEmpty(jsonFile[i]["name"]);
    }
    insertTypeLength(senFile, initLengthOffsrt);
    return;
  }

  void encodeGameSynchronization(
    SenBuffer senFile,
    dynamic jsonFile,
    int version,
  ) {
    senFile.writeString("STMG");
    final stmgLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    final volumeThresHold = convertHexString(jsonFile["volume_threshold"]);
    if (volumeThresHold.length != 4) {
      throw Exception("invaild_volume_threshold");
    }
    final maxVoiceInstances = convertHexString(jsonFile["max_voice_instances"]);
    if (maxVoiceInstances.length != 2) {
      throw Exception("invaild_max_voice_instances");
    }
    senFile.writeBytes(volumeThresHold);
    senFile.writeBytes(maxVoiceInstances);
    if (version == 140) {
      senFile.writeUInt16LE(jsonFile["unknown_type_1"]);
    }
    final stageGroupLength = jsonFile["stage_group"].length;
    senFile.writeUInt32LE(stageGroupLength);
    for (var i = 0; i < stageGroupLength; i++) {
      senFile.writeUInt32LE(jsonFile["stage_group"][i]["id"]);
      final defaultTansitionTime = convertHexString(
        jsonFile["state_group"][i]["data"]["default_transition_time"],
      );
      if (defaultTansitionTime.length != 4) {
        throw Exception("invaild_default_transition_time");
      }
      senFile.writeBytes(defaultTansitionTime);
      final customTransitionLength =
          jsonFile["stage_group"][i]["data"]["custom_transition"].length;
      senFile.writeUInt32LE(customTransitionLength);
      for (var k = 0; k < customTransitionLength; k++) {
        senFile.writeBytes(
          convertHexString(
            jsonFile["stage_group"][i]["data"]["custom_transition"][k],
          ),
        );
      }
    }
    final switchGroupLength = jsonFile["switch_group"].length;
    senFile.writeUInt32LE(switchGroupLength);
    for (var i = 0; i < switchGroupLength; i++) {
      senFile.writeUInt32LE(jsonFile["switch_group"][i]["id"]);
      senFile.writeUInt32LE(jsonFile["switch_group"][i]["data"]["parameter"]);
      if (version == 112 || version == 140) {
        senFile.writeUInt8(
          jsonFile["switch_group"][i]["data"]["parameter_category"],
        );
      }
      final pointLength = jsonFile["switch_group"][i]["data"]["point"].length;
      senFile.writeUInt32LE(pointLength);
      for (var k = 0; k < pointLength; k++) {
        senFile.writeBytes(
          convertHexString(jsonFile["switch_group"][i]["data"]["point"][k]),
        );
      }
    }
    final gameparamterLength = jsonFile["game_paramenter"].length;
    senFile.writeUInt32LE(gameparamterLength);
    for (var i = 0; i < gameparamterLength; i++) {
      senFile.writeUInt32LE(jsonFile["game_parameter"][i]["id"]);
      final parameterData =
          convertHexString(jsonFile["game_paramenter"][i]["data"]);
      if (version == 112 && parameterData.length != 17 ||
          version == 140 && parameterData.length != 17) {
        throw Exception("invaild_parameter_data");
      }
      if (version == 88 && parameterData.length != 4) {
        throw Exception("invaild_parameter_data");
      }
      senFile.writeBytes(parameterData);
    }
    if (version == 140) {
      senFile.writeUInt32LE(jsonFile["unknown_type_2"]);
    }
    insertTypeLength(senFile, stmgLengthOffset);
    return;
  }

  void encodeEnviroments(SenBuffer senFile, dynamic jsonFile, int version) {
    senFile.writeString("ENVS");
    final envsLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    encodeEnviromentsItem(senFile, jsonFile["obstruction"], version);
    encodeEnviromentsItem(senFile, jsonFile["occlusion"], version);
    insertTypeLength(senFile, envsLengthOffset);
    return;
  }

  void encodeEnviromentsItem(SenBuffer senFile, dynamic jsonFile, int version) {
    senFile.writeBytes(convertHexString(jsonFile["volume"]["volume_vaule"]));
    final volumePointLength = jsonFile["volume"]["volume_point"].length;
    senFile.writeUInt16LE(volumePointLength);
    for (var i = 0; i < volumePointLength; i++) {
      senFile
          .writeBytes(convertHexString(jsonFile["volume"]["volume_point"][i]));
    }
    senFile.writeBytes(
      convertHexString(jsonFile["low_pass_filter"]["low_pass_filter_vaule"]),
    );
    final lowPassFilterNumber =
        jsonFile["low_pass_filter"]["low_pass_filter_point"].length;
    senFile.writeUInt16LE(lowPassFilterNumber);
    for (var i = 0; i < lowPassFilterNumber; i++) {
      senFile.writeBytes(
        convertHexString(
          jsonFile["low_pass_filter"]["low_pass_filter_point"][i],
        ),
      );
    }
    if (version == 112 || version == 140) {
      senFile.writeBytes(
        convertHexString(
          jsonFile["high_pass_filter"]["high_pass_filter_vaule"],
        ),
      );
      final highPassFilterNumber =
          jsonFile["high_pass_filter"]["high_pass_filter_point"].length;
      senFile.writeUInt16LE(highPassFilterNumber);
      for (var i = 0; i < highPassFilterNumber; i++) {
        senFile.writeBytes(
          convertHexString(
            jsonFile["high_pass_filter"]["high_pass_filter_point"][i],
          ),
        );
      }
    }
    return;
  }

  void encodeHierarchy(SenBuffer senFile, dynamic jsonFile) {
    senFile.writeString("HIRC");
    final hircLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    final hircLength = jsonFile.length;
    senFile.writeUInt32LE(hircLength);
    for (var i = 0; i < hircLength; i++) {
      final data = convertHexString(jsonFile[i]["data"]);
      senFile.writeUInt8(jsonFile[i]["type"]);
      senFile.writeUInt32LE(data.length + 4);
      senFile.writeUInt32LE(jsonFile[i]["id"]);
      senFile.writeBytes(data);
    }
    insertTypeLength(senFile, hircLengthOffset);
    return;
  }

  void encodeReference(SenBuffer senFile, dynamic jsonFile) {
    senFile.writeString("STID");
    final stidLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    senFile.writeUInt32LE(jsonFile["unknown_type"]);
    final stidDataLength = jsonFile["data"].length;
    senFile.writeUInt32LE(stidDataLength);
    for (var i = 0; i < stidDataLength; i++) {
      senFile.writeUInt32LE(jsonFile["data"][i]["id"]);
      senFile.writeUInt8(jsonFile["data"][i]["name"].length);
      senFile.writeStringBytUInt8(jsonFile["data"][i]["name"]);
    }
    insertTypeLength(senFile, stidLengthOffset);
    return;
  }

  void encodePlatformSetting(SenBuffer senFile, dynamic jsonFile) {
    senFile.writeString("PLAT");
    final platLengthOffset = senFile.writeOffset;
    senFile.writeNull(4);
    senFile.writeStringByEmpty(jsonFile["platform"]);
    insertTypeLength(senFile, platLengthOffset);
    return;
  }

  void insertTypeLength(SenBuffer senFile, int offset) {
    senFile.backupWriteOffset();
    senFile.writeUInt32LE(senFile.writeOffset - offset - 4, offset);
    senFile.restoreWriteOffset();
    return;
  }

  Uint8List convertHexString(String hexString) {
    return Uint8List.fromList(hex.decode(hexString.replaceAll(" ", "")));
  }
}
