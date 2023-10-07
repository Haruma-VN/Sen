// ignore_for_file: unused_import, depend_on_referenced_packages, prefer_typing_uninitialized_variables

import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "package:path/path.dart" as path;
import "package:sen_material_design/module/utility/encryption/Rijndael/common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:convert/convert.dart";

class ReflectionObjectNotation {
  SenBuffer decryptRTON(
    SenBuffer raw,
    String key,
    String iv,
  ) {
    return SenBuffer.fromBytes(
      Rijndael.decrypt(
        raw.getBytes(raw.length - 2, 2),
        key,
        iv,
        RijndaelMode.CBC,
      ),
    );
  }

  void fillRijndaelBlock(SenBuffer raw) {
    while (raw.length % 32 != 0x00) {
      raw.writeNull(0x01);
    }
    return;
  }

  SenBuffer encryptRTON(
    SenBuffer raw,
    RijndaelC rijndael,
  ) {
    print(raw.length);
    fillRijndaelBlock(raw);
    print(raw.length);
    var ripe = SenBuffer.fromBytes(Uint8List.fromList([0x10, 0x00]));
    ripe.writeBytes(
      Rijndael.encrypt(
        raw.toBytes(),
        rijndael.key,
        rijndael.iv,
        RijndaelMode.CBC,
      ),
    );
    return ripe;
  }

  final r0x90List = <String>[];
  final r0x92List = <String>[];
  dynamic jsonFile = {};
  var propertyName = "";
  var tempString = "";
  // Decode
  dynamic decodeRTON(
    SenBuffer senFile,
    bool decrypt,
    RijndaelC? rijndael,
  ) {
    r0x90List.clear();
    r0x92List.clear();
    jsonFile = {};
    if (decrypt) {
      senFile = decryptRTON(
        senFile,
        rijndael!.key,
        rijndael.iv,
      );
    }
    final magic = senFile.readString(4);
    if (magic != "RTON") {
      throw Exception("invalid_rton_magic");
    }
    final version = senFile.readUInt32LE();
    if (version != 0x1) {
      throw Exception("invalid_rton_version");
    }
    jsonFile = readObject(senFile);
    final endRton = senFile.readString(4);
    if (endRton != "DONE") {
      throw Exception("invalid_rton_end");
    }
    return jsonFile;
  }

  dynamic readObject(SenBuffer senFile) {
    final objectTemp = {};
    var bytecode = senFile.readUInt8();
    while (bytecode != 0xFF) {
      readByteCodeProperty(senFile, bytecode);
      objectTemp[propertyName] = readByteCode(senFile, senFile.readUInt8());
      bytecode = senFile.readUInt8();
    }
    return objectTemp;
  }

  dynamic readArray(SenBuffer senFile) {
    final arrayTemp = [];
    var bytecode = senFile.readUInt8();
    if (bytecode != 0xFD) {
      throw Exception("invalid_rton_array_end");
    }
    final numArray = senFile.readVarInt32();
    for (var i = 0; i < numArray; i++) {
      arrayTemp.add(readByteCode(senFile, senFile.readUInt8()));
    }
    bytecode = senFile.readUInt8();
    if (bytecode != 0xFE) {
      throw Exception("invalid_rton_array_end");
    }
    return arrayTemp;
  }

  void readByteCodeProperty(SenBuffer senFile, int byteCode) {
    switch (byteCode) {
      case 0x02:
        propertyName = "*";
        return;
      case 0x81:
        propertyName = senFile.readStringByVarInt32();
        return;
      case 0x82:
        senFile.readVarInt32();
        propertyName = senFile.readStringByVarInt32();
        return;
      case 0x83:
        propertyName = readRTID(senFile);
        return;
      case 0x84:
        propertyName = "RTID(0)";
        return;
      case 0x87:
        propertyName = readBinary(senFile);
        return;
      case 0x90:
        tempString = senFile.readStringByVarInt32();
        r0x90List.add(tempString);
        propertyName = tempString;
        return;
      case 0x91:
        propertyName = r0x90List[senFile.readVarInt32()];
        return;
      case 0x92:
        senFile.readVarInt32();
        tempString = senFile.readStringByVarInt32();
        r0x92List.add(tempString);
        propertyName = tempString;
        return;
      case 0x93:
        propertyName = r0x92List[senFile.readVarInt32()];
        return;
      default:
        throw Exception(
          "invalid_bytecode: $byteCode | offset: ${senFile.readOffset} | path: ${senFile.filePath}",
        );
    }
  }

  dynamic readByteCode(SenBuffer senFile, int byteCode) {
    switch (byteCode) {
      case 0x0:
        return false;
      case 0x1:
        return true;
      case 0x2:
        return "*";
      case 0x8:
        return senFile.readInt8();
      case 0x9:
      case 0xB:
      case 0x11:
      case 0x13:
      case 0x21:
      case 0x23:
      case 0x27:
      case 0x41:
      case 0x43:
      case 0x47:
        return 0;
      case 0xA:
        return senFile.readInt8();
      case 0x10:
        return senFile.readInt16LE();
      case 0x12:
        return senFile.readUInt16LE();
      case 0x20:
        return senFile.readInt32LE();
      case 0x22:
        return senFile.readFloatLE();
      case 0x24:
        return senFile.readVarInt32();
      case 0x25:
        return senFile.readZigZag32();
      case 0x26:
        return senFile.readUInt32LE();
      case 0x28:
        return senFile.readUVarInt32();
      case 0x40:
        return senFile.readBigInt64LE();
      case 0x42:
        return senFile.readDoubleLE();
      case 0x44:
        return senFile.readVarInt64();
      case 0x45:
        return senFile.readZigZag64();
      case 0x46:
        return senFile.readBigUInt64LE();
      case 0x48:
        return senFile.readUVarInt64();
      case 0x81:
        return senFile.readStringByVarInt32();
      case 0x82:
        senFile.readVarInt32();
        return senFile.readStringByVarInt32();
      case 0x83:
        return readRTID(senFile);
      case 0x84:
        return "RTID(0)";
      case 0x85:
        return readObject(senFile);
      case 0x86:
        return readArray(senFile);
      case 0x87:
        return readBinary(senFile);
      case 0x90:
        tempString = senFile.readStringByVarInt32();
        r0x90List.add(tempString);
        return tempString;
      case 0x91:
        return r0x90List[senFile.readVarInt32()];
      case 0x92:
        senFile.readVarInt32();
        tempString = senFile.readStringByVarInt32();
        r0x92List.add(tempString);
        return tempString;
      case 0x93:
        return r0x92List[senFile.readVarInt32()];
      default:
        throw Exception(
          "invalid_bytecode: $byteCode | offset: ${senFile.readOffset} | path: ${senFile.filePath}",
        );
    }
  }

  dynamic readBinary(SenBuffer senFile) {
    senFile.readUInt8();
    final str = senFile.readStringByVarInt32();
    final num = senFile.readVarInt32();
    return "\$BINARY($str, $num)";
  }

  dynamic readRTID(SenBuffer senFile) {
    final tempByte = senFile.readUInt8();
    switch (tempByte) {
      case 0x0:
        return "RTID(0)";
      case 0x1:
        final value0x01_2 = senFile.readVarInt32();
        final value0x01_1 = senFile.readVarInt32();
        final x16_1 = senFile.readUInt32LE();
        return "RTID($value0x01_1.$value0x01_2.$x16_1@)";
      case 0x2:
        senFile.readVarInt32();
        final str = senFile.readStringByVarInt32();
        final value0x02_2 = senFile.readVarInt32();
        final value0x02_1 = senFile.readVarInt32();
        final x16_2 = senFile.readUInt32LE();
        return "RTID($value0x02_2.$value0x02_1.$x16_2@$str)";
      case 0x3:
        senFile.readVarInt32();
        final str2 = senFile.readStringByVarInt32();
        senFile.readVarInt32();
        final str1 = senFile.readStringByVarInt32();
        return "RTID($str1@$str2)";
      default:
        throw Exception("invalid_RTID");
    }
  }

  //pack
  final r0x90Object = <String, int>{};
  final r0x92Object = <String, int>{};
  var r0x90Index = 0;
  var r0x92Index = 0;

  SenBuffer encodeRTON(
    dynamic jsonFile,
    bool encrypt,
    RijndaelC? rijndael,
  ) {
    r0x90Object.clear();
    r0x92Object.clear();
    final senFile = SenBuffer();
    senFile.writeString("RTON");
    senFile.writeUInt32LE(0x01);
    writeObject(senFile, jsonFile);
    senFile.writeString("DONE");
    if (!encrypt) {
      return senFile;
    } else {
      return encryptRTON(
        senFile,
        rijndael!,
      );
    }
  }

  void writeObject(SenBuffer senFile, Map<String, dynamic> jsonFile) {
    jsonFile.forEach((key, value) {
      writeString(senFile, key);
      writeValue(senFile, value);
    });
    senFile.writeUInt8(0xFF);
    return;
  }

  void writeArray(SenBuffer senFile, dynamic jsonFile) {
    senFile.writeUInt8(0xFD);
    final arrayLength = jsonFile.length;
    senFile.writeVarInt32(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
      writeValue(senFile, jsonFile[i]);
    }
    senFile.writeUInt8(0xFE);
    return;
  }

  dynamic writeValue(SenBuffer senFile, dynamic value) {
    if (value == null) {
      senFile.writeUInt8(0x84);
      return;
    }
    if (value is Map) {
      senFile.writeUInt8(0x85);
      writeObject(senFile, value as dynamic);
      return;
    }
    switch (value.runtimeType) {
      case Object:
        senFile.writeUInt8(0x85);
        writeObject(senFile, value);
        return;
      case List:
        senFile.writeUInt8(0x86);
        writeArray(senFile, value);
        return;
      case bool:
        senFile.writeBool(value);
        return;
      case String:
        writeString(senFile, value);
      case int:
      case double:
      case num:
        writeNumber(senFile, value);
      default:
        throw Exception("invalid_value_type | ${value.runtimeType}");
    }
  }

  bool checkInfinity(double dec) {
    final infCheck = ByteData(4);
    infCheck.setFloat32(0, dec, Endian.little);
    final decNum = infCheck.getFloat32(0, Endian.little);
    if (decNum == double.infinity || decNum == double.negativeInfinity) {
      return false;
    } else {
      return true;
    }
  }

  void writeNumber(SenBuffer senFile, num number) {
    if (number is double) {
      if (number == 0.0) {
        senFile.writeUInt8(0x23);
      } else if (-9223372036854775807 <= number &&
              number <= 9223372036854775807 ||
          checkInfinity(number)) {
        senFile.writeUInt8(0x22);
        senFile.writeFloatLE(number);
      } else {
        senFile.writeUInt8(0x42);
        senFile.writeDoubleLE(number);
      }
    } else {
      number as int;
      if (number == 0) {
        senFile.writeUInt8(0x21);
      } else if (0 <= number && number <= 2097151) {
        senFile.writeUInt8(0x24);
        senFile.writeVarInt32(number);
      } else if (-1048576 <= number && number <= 0) {
        senFile.writeUInt8(0x25);
        senFile.writeZigZag32(number);
      } else if (-2147483648 <= number && number <= 2147483647) {
        senFile.writeUInt8(0x20);
        senFile.writeInt32LE(number);
      } else if (0 <= number && number <= 4294967295) {
        senFile.writeUInt8(0x26);
        senFile.writeUInt32LE(number);
      } else if (0 <= number && number <= 562949953421311) {
        senFile.writeUInt8(0x44);
        senFile.writeVarInt64(number);
      } else if (-281474976710656 <= number && number <= 0) {
        senFile.writeUInt8(0x45);
        senFile.writeZigZag64(number);
      } else if (-9223372036854775808 <= number &&
          number <= 9223372036854775807) {
        senFile.writeUInt8(0x40);
        senFile.writeBigInt64LE(number);
      } else if (0 <= number && number > 9223372036854775807) {
        senFile.writeUInt8(0x46);
        senFile.writeBigUInt64LE(number);
      } else if (0 <= number) {
        senFile.writeUInt8(0x44);
        senFile.writeZigZag32(number);
      } else {
        senFile.writeUInt8(0x45);
        senFile.writeZigZag64(number);
      }
    }
    return;
  }

  void writeString(SenBuffer senFile, String? str) {
    if (str == "*") {
      senFile.writeUInt8(2);
    } else if (writeBinary(senFile, str!)) {
      return;
    } else if (writeRTID(senFile, str)) {
      return;
    } else if (isASCII(str)) {
      if (r0x90Object.containsKey(str)) {
        senFile.writeUInt8(0x91);
        senFile.writeVarInt32(r0x90Object[str]!);
      } else {
        senFile.writeUInt8(0x90);
        senFile.writeStringByVarInt32(str);
        r0x90Object[str] = r0x90Index++;
      }
    } else {
      if (r0x92Object.containsKey(str)) {
        senFile.writeUInt8(0x93);
        senFile.writeVarInt32(r0x92Object[str]!);
      } else {
        senFile.writeUInt8(0x92);
        senFile.writeVarInt32(str.length);
        senFile.writeStringByVarInt32(str);
        r0x92Object[str] = r0x92Index++;
      }
    }
    return;
  }

  bool writeBinary(SenBuffer senFile, String str) {
    if (str.endsWith("\$BINARY(") && str.endsWith(")")) {
      final index = str.lastIndexOf("\", ");
      if (index == -1) return false;
      var v;
      try {
        v = int.parse(str.substring(index + 3, str.length - 1));
      } catch (ex) {
        return false;
      }
      final mString = str.substring(9, index);
      senFile.writeUInt8(0x87);
      senFile.writeUInt8(0);
      senFile.writeStringByVarInt32(mString);
      senFile.writeVarInt32(v);
    }
    return false;
  }

  bool writeRTID(SenBuffer senFile, String str) {
    if (str.endsWith("RTID(") && str.endsWith(")")) {
      if (str == "RTID(0)") {
        senFile.writeUInt8(0x84);
        return true;
      }
      final newstr = str.substring(5, str.length - 1);
      if (newstr.contains("@")) {
        final nameList = newstr.split("@");
        int dotCount = RegExp(r".").allMatches(nameList[0]).length;
        senFile.writeUInt8(0x83);
        if (dotCount == 2) {
          final intStr = nameList[0].split(".");
          senFile.writeUInt8(0x02);
          senFile.writeVarInt32(nameList[1].length);
          senFile.writeStringByVarInt32(nameList[1]);
          senFile.writeVarInt32(int.parse(intStr[1]));
          senFile.writeVarInt32(int.parse(intStr[0]));
          var hexBytes = hex.decode(intStr[2]);
          hexBytes = hexBytes.reversed.toList();
          senFile.writeBytes(Uint8List.fromList(hexBytes));
        } else {
          senFile.writeUInt8(0x03);
          senFile.writeVarInt32(nameList[1].length);
          senFile.writeStringByVarInt32(nameList[1]);
          senFile.writeVarInt32(nameList[0].length);
          senFile.writeStringByVarInt32(nameList[0]);
        }
        return true;
      }
    }
    return false;
  }

  bool isASCII(String str) {
    final strNum = str.codeUnits.toList();
    for (var i = 0; i < strNum.length; i++) {
      if (strNum[i] > 127) {
        return false;
      }
    }
    return true;
  }

  // ignore: non_constant_identifier_names
  static void decode_fs(
    String inFile,
    String outFile,
    bool decrypt,
    RijndaelC? rijndael,
  ) {
    var rton = ReflectionObjectNotation();
    dynamic json = rton.decodeRTON(
      SenBuffer.OpenFile(inFile),
      decrypt,
      rijndael,
    );
    FileSystem.writeJson(outFile, json, '\t');
    return;
  }

  // ignore: non_constant_identifier_names
  static void encode_fs(
    String inFile,
    String outFile,
    bool encrypt,
    RijndaelC? rijndael,
  ) {
    var rton = ReflectionObjectNotation();
    dynamic json = rton.encodeRTON(
      FileSystem.readJson(inFile),
      encrypt,
      rijndael,
    );
    FileSystem.writeJson(outFile, json, '\t');
    return;
  }

  // ignore: non_constant_identifier_names
  static void decrypt_fs(
    String inFile,
    String outFile,
    RijndaelC rijndael,
  ) {
    var rton = ReflectionObjectNotation();
    SenBuffer plain = rton.decryptRTON(
      SenBuffer.OpenFile(inFile),
      rijndael.key,
      rijndael.iv,
    );
    plain.outFile(outFile);
    return;
  }

  // ignore: non_constant_identifier_names
  static void encrypt_fs(
    String inFile,
    String outFile,
    RijndaelC rijndael,
  ) {
    var rton = ReflectionObjectNotation();
    SenBuffer plain = rton.encryptRTON(SenBuffer.OpenFile(inFile), rijndael);
    plain.outFile(outFile);
    return;
  }
}

class RijndaelC {
  late String key;
  late String iv;
  RijndaelC();
  RijndaelC.has(this.key, this.iv);
}
