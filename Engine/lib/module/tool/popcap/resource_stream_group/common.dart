import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/compress/zlib/common.dart';
import "package:path/path.dart" as path;

class ResourceStreamGroup {
  // Unpack
  dynamic unpackRSG(SenBuffer senFile, String outFolder,
      [bool useResFolder = true, bool getPacketInfo = false]) {
    final rsgHeadInfo = readRSGHead(senFile);
    final fileList = fileListSplit(senFile, rsgHeadInfo);
    final resInfo = [];
    final part0List = fileList["part0List"];
    final part1List = fileList["part1List"];
    var senPart0 = new SenBuffer();
    var senPart1 = new SenBuffer();
    SenBuffer? fileData;
    if (part0List.length > 0) {
      if (!getPacketInfo) {
        senPart0 =
            new SenBuffer.fromBytes(checkZlib(senFile, rsgHeadInfo, false));
      }
      for (var i = 0; i < part0List.length; i++) {
        if (!getPacketInfo) {
          fileData = new SenBuffer.fromBytes(
              senPart0.getBytes(part0List[i]["size"], part0List[i]["offset"]));
          fileData.outFile(useResFolder
              ? path.join(outFolder, "res", part0List[i]["path"])
              : path.join(outFolder, part0List[i]["path"]));
        }
        resInfo.add({
          "path": part0List[i]["path"].split("\\"),
        });
      }
      senPart0.clear();
    }
    if (part1List.length > 0) {
      if (!getPacketInfo) {
        senPart1 =
            new SenBuffer.fromBytes(checkZlib(senFile, rsgHeadInfo, true));
      }
      for (var i = 0; i < part1List.length; i++) {
        if (!getPacketInfo) {
          fileData = new SenBuffer.fromBytes(
              senPart1.getBytes(part1List[i]["size"], part1List[i]["offset"]));
          fileData.outFile(useResFolder
              ? path.join(outFolder, "res", part1List[i]["path"])
              : path.join(outFolder, part1List[i]["path"]));
        }
        resInfo.add({
          "path": part1List[i]["path"].split("\\"),
          "ptx_info": {
            "id": part1List[i]["id"],
            "width": part1List[i]["width"],
            "height": part1List[i]["height"],
          }
        });
      }
      senPart1.clear();
    }
    if (!getPacketInfo) {
      senFile.clear();
    }
    return {
      "version": rsgHeadInfo["version"],
      "compression_flags": rsgHeadInfo["flag"],
      "res": resInfo
    };
  }

  Uint8List checkZlib(SenBuffer senFile, dynamic rsgHeadInfo, bool atlasInfo) {
    if (atlasInfo) {
      if (zlibHeadCheck(senFile.getBytes(2, rsgHeadInfo["part1Offset"])) ||
          rsgHeadInfo["flag"] == 0 ||
          rsgHeadInfo["flag"] == 2) {
        return senFile.getBytes(
            rsgHeadInfo["part1Size"], rsgHeadInfo["part1Offset"]);
      } else {
        return Zlib.uncompress(senFile.getBytes(
            rsgHeadInfo["part1Zlib"], rsgHeadInfo["part1Offset"]));
      }
    } else {
      if (zlibHeadCheck(senFile.getBytes(2, rsgHeadInfo["part0Offset"])) ||
          rsgHeadInfo["flag"] < 2) {
        return senFile.getBytes(
            rsgHeadInfo["part0Size"], rsgHeadInfo["part0Offset"]);
      } else {
        return Zlib.uncompress(senFile.getBytes(
            rsgHeadInfo["part0Zlib"], rsgHeadInfo["part0Offset"]));
      }
    }
  }

  bool zlibHeadCheck(Uint8List zlibData) {
    final zlibLevelHead = [
      [120, 1],
      [120, 94],
      [120, 156],
      [120, 218],
    ];
    for (var i = 0; i < zlibLevelHead.length; i++) {
      if (zlibData[0] == zlibLevelHead[i][0] &&
          zlibData[1] == zlibLevelHead[i][1]) {
        return false;
      }
    }
    return true;
  }

  dynamic fileListSplit(SenBuffer senFile, dynamic rsgHeadInfo) {
    final part1List = [];
    final part0List = [];
    var nameDict = [];
    var namePath = "";
    final tempOffset = rsgHeadInfo["fileListOffset"];
    senFile.readOffset = tempOffset;
    var offsetLimit = tempOffset + rsgHeadInfo["fileListLength"];
    while (senFile.readOffset < offsetLimit) {
      final characterByte = senFile.readString(1);
      final offsetByte = senFile.readUInt24LE() * 4;
      if (characterByte == "\x00") {
        if (offsetByte != 0) {
          nameDict.add({
            "namePath": namePath,
            "offsetByte": offsetByte,
          });
        }
        final typeByte = senFile.readUInt32LE() == 1;
        if (typeByte) {
          part1List.add({
            "path": namePath,
            "offset": senFile.readUInt32LE(),
            "size": senFile.readUInt32LE(),
            "id": senFile.readUInt32LE(),
            "width": senFile.readUInt32LE(senFile.readOffset + 8),
            "height": senFile.readUInt32LE()
          });
        } else {
          part0List.add({
            "path": namePath,
            "offset": senFile.readUInt32LE(),
            "size": senFile.readUInt32LE()
          });
        }
        for (var i = 0; i < nameDict.length; i++) {
          if (nameDict[i]["offsetByte"] + tempOffset == senFile.readOffset) {
            namePath = nameDict[i]["namePath"];
            nameDict.removeAt(i);
            break;
          }
        }
      } else {
        if (offsetByte != 0) {
          nameDict.add({
            "namePath": namePath,
            "offsetByte": offsetByte,
          });
          namePath += characterByte;
        } else {
          namePath += characterByte;
        }
      }
    }
    return {"part0List": part0List, "part1List": part1List};
  }

  dynamic readRSGHead(SenBuffer senFile) {
    final magic = senFile.readString(4);
    if (magic != "pgsr") {
      throw new Exception("invaild_rsg_magic");
    }
    final version = senFile.readUInt32LE();
    if (version != 3 && version != 4) {
      throw new Exception("invaild_rsg_version");
    }
    senFile.readOffset += 8;
    final flag = senFile.readUInt32LE();
    if (flag > 3 || flag < 0) {
      throw new Exception("invaild_rsg_compression_flag");
    }
    final fileOffset = senFile.readUInt32LE();
    final part0Offset = senFile.readUInt32LE();
    final part0Zlib = senFile.readUInt32LE();
    final part0Size = senFile.readUInt32LE();
    senFile.readOffset += 4;
    final part1Offset = senFile.readUInt32LE();
    final part1Zlib = senFile.readUInt32LE();
    final part1Size = senFile.readUInt32LE();
    senFile.readOffset += 20;
    final fileListLength = senFile.readUInt32LE();
    final fileListOffset = senFile.readUInt32LE();
    return {
      "version": version,
      "flag": flag,
      "fileOffset": fileOffset,
      "part0Offset": part0Offset,
      "part0Zlib": part0Zlib,
      "part0Size": part0Size,
      "part1Offset": part1Offset,
      "part1Zlib": part1Zlib,
      "part1Size": part1Size,
      "fileListLength": fileListLength,
      "fileListOffset": fileListOffset
    };
  }

  //Pack
  SenBuffer packRSG(String inFolder, dynamic packetInfo,
      [bool useResFolder = true]) {
    if (packetInfo["version"] != 3 && packetInfo["version"] != 4) {
      throw new Exception("invaild_rsg_version");
    }
    if (packetInfo["compression_flags"] < 0 ||
        packetInfo["compression_flags"] > 3) {
      throw new Exception("invaild_rsg_compression_flag");
    }
    final senFile = new SenBuffer();
    senFile.writeString("pgsr");
    senFile.writeUInt32LE(packetInfo["version"]);
    senFile.writeOffset += 8;
    senFile.writeUInt32LE(packetInfo["compression_flags"]);
    senFile.writeOffset += 72;
    final pathTemps = fileListPack(packetInfo["res"]);
    writeRSG(senFile, pathTemps, packetInfo["compression_flags"], inFolder,
        useResFolder);
    return senFile;
  }

  dynamic fileListPack(List<dynamic> resInfo) {
    final resInfoList = resInfo;
    resInfoList.insert(0, {
      "path": [""]
    });
    resInfoList.sort((a, b) => a["path"]
        .join("\\")
        .toUpperCase()
        .compareTo(b["path"].join("\\").toUpperCase()));
    final listLength = resInfoList.length - 1;
    final pathTemps = [];
    int wPos = 0;
    for (var i = 0; i < listLength; i++) {
      String path1 = resInfoList[i]["path"].join("\\").toUpperCase();
      String path2 = resInfoList[i + 1]["path"].join("\\").toUpperCase();
      if (isNotASCII(path2)) {
        throw new Exception("name_path_must_be_ascii: $path2");
      }
      final longestLength =
          path1.length >= path2.length ? path1.length : path2.length;
      for (var k = 0; k < longestLength; k++) {
        final path1Num = path1.codeUnits.toList();
        final path2Num = path2.codeUnits.toList();
        if (k >= path1.length ||
            k >= path2.length ||
            path1Num[k] != path2Num[k]) {
          for (var h = pathTemps.length; h > 0; h--) {
            if (k >= pathTemps[h - 1]["key"]) {
              pathTemps[h - 1]["positions"].add({
                "position": wPos,
                "offset": k - pathTemps[h - 1]["key"],
              });
              break;
            }
          }
          wPos += path2.endsWith(".PTX")
              ? path2.length - k + 9
              : path2.length - k + 4;
          pathTemps.add({
            "pathSlice": path2.substring(k),
            "key": k,
            "resInfo": resInfoList[i + 1],
            "isAtlas": path2.endsWith(".PTX"),
            "positions": []
          });
          break;
        }
      }
    }
    return pathTemps;
  }

  bool isNotASCII(String str) {
    final strNum = str.codeUnits.toList();
    for (var i = 0; i < strNum.length; i++) {
      if (strNum[i] > 127) {
        return true;
      }
    }
    return false;
  }

  void writeRSG(SenBuffer senFile, dynamic pathTemps, int compressionFlag,
      String inFolder, bool useResFolder) {
    final pathTempLength = pathTemps.length;
    final fileListBeginOffset = senFile.writeOffset;
    if (fileListBeginOffset != 0x5C) {
      throw new Exception("invalid_file_list_offset");
    }
    var dataGroup = new SenBuffer();
    var atlasGroup = new SenBuffer();
    int dataPos = 0;
    int atlasPos = 0;
    for (var i = 0; i < pathTempLength; i++) {
      final beginOffset = senFile.writeOffset;
      final packetResInfo = pathTemps[i]["resInfo"];
      senFile.writeStringFourByte(pathTemps[i]["pathSlice"]);
      senFile.backupWriteOffset();
      for (var h = 0; h < pathTemps[i]["positions"].length; h++) {
        final wOffset =
            (beginOffset + pathTemps[i]["positions"][h]["offset"] * 4 + 1)
                .toInt();
        senFile.writeUInt24LE(
            pathTemps[i]["positions"][h]["position"], wOffset);
      }
      final senPacket = new SenBuffer.OpenFile(useResFolder
          ? path.join(inFolder, "res", packetResInfo["path"].join("\\"))
          : path.join(inFolder, packetResInfo["path"].join("\\")));
      final dataItem = senPacket.toBytes();
      senPacket.clear();
      final appendBytes = beautifyLengthForFile(dataItem.length);
      if (pathTemps[i]["isAtlas"]) {
        atlasGroup.writeBytes(dataItem);
        atlasGroup.writeNull(appendBytes);
        senFile.restoreWriteOffset();
        senFile.writeUInt32LE(1);
        senFile.writeUInt32LE(atlasPos);
        senFile.writeUInt32LE(dataItem.length);
        senFile.writeUInt32LE(packetResInfo["ptx_info"]["id"]);
        senFile.writeNull(8);
        senFile.writeUInt32LE(packetResInfo["ptx_info"]["width"]);
        senFile.writeUInt32LE(packetResInfo["ptx_info"]["height"]);
        atlasPos += (dataItem.length + appendBytes);
      } else {
        dataGroup.writeBytes(dataItem);
        dataGroup.writeNull(appendBytes);
        senFile.restoreWriteOffset();
        senFile.writeUInt32LE(0);
        senFile.writeUInt32LE(dataPos);
        senFile.writeUInt32LE(dataItem.length);
        dataPos += (dataItem.length + appendBytes);
      }
    }
    final fileListLength = senFile.writeOffset - fileListBeginOffset;
    senFile.writeNull(beautifyLength(senFile.writeOffset));
    senFile.backupWriteOffset();
    senFile.writeUInt32LE(senFile.writeOffset, 0x14);
    senFile.writeUInt32LE(fileListLength, 0x48);
    senFile.writeUInt32LE(fileListBeginOffset);
    senFile.restoreWriteOffset();
    compressor(senFile, dataGroup, atlasGroup, compressionFlag);
    return;
  }

  void compressor(SenBuffer senFile, SenBuffer dataGroup, SenBuffer atlasGroup,
      int compressionFlag) {
    if (dataGroup.length != 0) {
      final dataBytes = dataGroup.toBytes();
      dataGroup.clear();
      writeData(senFile, dataBytes, compressionFlag, false);
    }
    if (atlasGroup.length != 0) {
      final atlasBytes = atlasGroup.toBytes();
      atlasGroup.clear();
      var part1Offset = 0;
      final part1Size = atlasBytes.length;
      final dataEmpty = new SenBuffer();
      dataEmpty.writeUInt32LE(252536);
      dataEmpty.writeUInt32BE(1);
      dataEmpty.writeNull(4088);
      if (compressionFlag == 0 || compressionFlag == 2) {
        if (compressionFlag == 2 && dataGroup.length == 0) {
          writeData(senFile, dataEmpty.toBytes(), 1, true);
        } else {
          writeData(senFile, new Uint8List(0), 1, true);
        }
        part1Offset = senFile.writeOffset;
        senFile.writeBytes(atlasBytes);
        senFile.backupWriteOffset();
        senFile.writeUInt32LE(part1Offset, 0x28);
        senFile.writeUInt32LE(part1Size);
        senFile.writeUInt32LE(part1Size);
        senFile.restoreWriteOffset();
      } else {
        if (compressionFlag == 3 && dataGroup.length == 0) {
          writeData(senFile, dataEmpty.toBytes(), 1, true);
        } else {
          writeData(senFile, new Uint8List(0), 1, true);
        }
        part1Offset = senFile.writeOffset;
        final zlibBytes =
            Zlib.compress(atlasBytes, compressionFlag == 3 ? 9 : 4);
        final zlibAppendLength = beautifyLength(zlibBytes.length);
        senFile.writeBytes(zlibBytes);
        senFile.writeNull(zlibAppendLength);
        final part1Zlib = zlibBytes.length + zlibAppendLength;
        senFile.backupWriteOffset();
        senFile.writeUInt32LE(part1Offset, 0x28);
        senFile.writeUInt32LE(part1Zlib);
        senFile.writeUInt32LE(part1Size);
        senFile.restoreWriteOffset();
      }
      dataEmpty.clear();
    } else {
      senFile.writeUInt32LE(senFile.length, 0x28);
    }
    return;
  }

  void writeData(
      SenBuffer senFile, Uint8List dataBytes, int flag, bool isAtlas) {
    final part0Offset = senFile.writeOffset;
    final part0Size = dataBytes.length;
    if (flag < 2) {
      senFile.writeBytes(dataBytes);
      senFile.backupWriteOffset();
      senFile.writeUInt32LE(part0Offset, 0x18);
      senFile.writeUInt32LE(part0Size);
      if (isAtlas) {
        senFile.writeUInt32LE(0);
      } else {
        senFile.writeUInt32LE(part0Size);
      }
      senFile.restoreWriteOffset();
    } else {
      final zlibBytes = Zlib.compress(dataBytes, flag == 3 ? 9 : 5);
      final zlibAppendLength = beautifyLength(zlibBytes.length);
      senFile.writeBytes(zlibBytes);
      senFile.writeNull(zlibAppendLength);
      final part0Zlib = zlibBytes.length + zlibAppendLength;
      senFile.backupWriteOffset();
      senFile.writeUInt32LE(part0Offset, 0x18);
      senFile.writeUInt32LE(part0Zlib);
      senFile.writeUInt32LE(part0Size);
      senFile.restoreWriteOffset();
    }
    return;
  }

  int beautifyLength(int length) {
    if (length % 4096 == 0) {
      return 4096;
    } else {
      return 4096 - (length % 4096);
    }
  }

  int beautifyLengthForFile(int length) {
    if (length % 4096 == 0) {
      return 0;
    } else {
      return 4096 - (length % 4096);
    }
  }
}
