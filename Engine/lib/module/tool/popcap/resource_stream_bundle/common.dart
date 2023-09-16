import 'package:sen_material_design/module/utility/buffer/common.dart';
import "package:path/path.dart" as path;
import 'package:sen_material_design/module/utility/io/common.dart';
import "../resource_stream_group/common.dart";

class ResourceStreamBundle {
  dynamic unpackRSB(SenBuffer senFile, String outFolder) {
    final rsbHeadInfo = readRSBHead(senFile);
    if (rsbHeadInfo["version"] != 3 && rsbHeadInfo["version"] != 4) {
      throw new Exception("invaild_rsb_version");
    }
    if (rsbHeadInfo["version"] == 3 &&
        rsbHeadInfo["fileListBeginOffset"] != 0x6C) {
      throw new Exception("invaild_file_list_offset");
    }
    if (rsbHeadInfo["version"] == 4 &&
        rsbHeadInfo["fileListBeginOffset"] != 0x70) {
      throw new Exception("invaild_file_list_offset");
    }
    final fileList = fileListSplit(senFile, rsbHeadInfo["fileListBeginOffset"],
        rsbHeadInfo["fileListLength"]);
    final rsgList = fileListSplit(senFile, rsbHeadInfo["rsgListBeginOffset"],
        rsbHeadInfo["rsgListLength"]);
    final compositeInfo = readCompositeInfo(senFile, rsbHeadInfo);
    final compositeList = fileListSplit(
        senFile,
        rsbHeadInfo["compositeListBeginOffset"],
        rsbHeadInfo["compositeListLength"]);
    final rsgInfoList = readRSGInfo(senFile, rsbHeadInfo);
    // final autopoolInfoList = readAutoPool(senFile, rsbHeadInfo);
    final ptxInfoList = readPTXInfo(senFile, rsbHeadInfo);
    if (rsbHeadInfo["version"] == 3) {
      if (rsbHeadInfo["part1BeginOffset"] == 0 &&
          rsbHeadInfo["part2BeginOffset"] == 0 &&
          rsbHeadInfo["part2BeginOffset"] == 0) {
        throw new Exception("invaild_rsb_ver_3_resource_offset");
      }
      readResourcesDescription(senFile, rsbHeadInfo, outFolder);
    }
    final groupList = {};
    final compositeLength = compositeInfo.length;
    final rsgNameList = [];
    for (var i = 0; i < compositeLength; i++) {
      if (compositeInfo[i]["name"].toUpperCase() !=
          compositeList[i]["namePath"]
              .toUpperCase()
              .replaceAll("_COMPOSITESHELL", "")) {
        throw new Exception(
            "invaild_composite_name: ${compositeInfo[i]["name"]}");
      }
      final subGroupList = {};
      for (var k = 0; k < compositeInfo[i]["packetNumber"]; k++) {
        final packetIndex = compositeInfo[i]["packetInfo"][k]["packetIndex"];
        var rsgInfoCount = 0;
        var rsgListCount = 0;
        while (rsgInfoList[rsgInfoCount]["poolIndex"] != packetIndex) {
          if (rsgInfoCount >= rsgInfoList.length) {
            throw new Exception("out_of_range_1");
          }
          rsgInfoCount++;
        }
        while (rsgList[rsgListCount]["poolIndex"] != packetIndex) {
          if (rsgInfoCount >= rsgList.length) {
            throw new Exception("out_of_range_2");
          }
          rsgListCount++;
        }
        if (rsgInfoList[rsgInfoCount]["name"].toUpperCase() !=
            rsgList[rsgListCount]["namePath"].toUpperCase()) {
          throw new Exception(
              "invaild_rsg_name: ${rsgInfoList[rsgInfoCount]["name"]} | ${rsgList[rsgListCount]["name"]}. pool_index: $packetIndex");
        }
        rsgNameList.add(rsgInfoList[rsgInfoCount]["name"]);
        final packetFile = senFile.getBytes(
            rsgInfoList[rsgInfoCount]["rsgLength"],
            rsgInfoList[rsgInfoCount]["rsgOffset"]);
        final rsgFile = new SenBuffer.fromBytes(packetFile);
        final rsgFunction = ResourceStreamGroup();
        final packetInfo = rsgFunction.unpackRSG(rsgFile, "", false, true);
        final resInfoList = [];
        final fileListLength = fileList.length;
        final ptxBeforeNumber = rsgInfoList[rsgInfoCount]["ptxBeforeNumber"];
        for (var h = 0; h < fileListLength; h++) {
          if (fileList[h]["poolIndex"] == packetIndex) {
            final resInfo = {"path": fileList[h]["namePath"].split("\\")};
            final resInfoLength = packetInfo["res"].length;
            var existItemPacket = false;
            for (var m = 0; m < resInfoLength; m++) {
              if (packetInfo["res"][m]["path"].join("\\").toUpperCase() ==
                  fileList[h]["namePath"].toUpperCase()) {
                existItemPacket = true;
                if (fileList[h]["namePath"].toUpperCase().endsWith(".PTX") &&
                    compositeInfo[i]["isComposite"]) {
                  if (ptxInfoList[ptxBeforeNumber +
                          packetInfo["res"][m]["ptx_info"]["id"]]["width"] !=
                      packetInfo["res"][m]["ptx_info"]["width"]) {
                    throw new Exception(
                        "invaild_packet_width: ${fileList[h]["namePath"]}");
                  }
                  if (ptxInfoList[ptxBeforeNumber +
                          packetInfo["res"][m]["ptx_info"]["id"]]["height"] !=
                      packetInfo["res"][m]["ptx_info"]["height"]) {
                    throw new Exception(
                        "invaild_packet_height: ${fileList[h]["namePath"]}");
                  }
                  resInfo["ptx_info"] = {
                    "id": packetInfo["res"][m]["ptx_info"]["id"],
                    "width": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["width"],
                    "height": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["height"],
                  };
                  resInfo["ptx_property"] = {
                    "format": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["format"],
                    "pitch": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["pitch"],
                    "alpha_size": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["alpha_size"],
                    "alpha_format": ptxInfoList[ptxBeforeNumber +
                        packetInfo["res"][m]["ptx_info"]["id"]]["alpha_format"],
                  };
                }
                break;
              }
            }
            if (!existItemPacket) {
              throw new Exception("invaild_item_packet");
            }
            resInfoList.add(resInfo);
          }
          if (fileList[h]["poolIndex"] > packetIndex) break;
        }
        rsgFile.outFile(path.join(
            outFolder, "packet", "${rsgInfoList[rsgInfoCount]["name"]}.rsg"));
        final packetInfoList = {
          "version":
              senFile.readUInt32LE(rsgInfoList[rsgInfoCount]["rsgOffset"] + 4),
          "compression_flags":
              senFile.readUInt32LE(rsgInfoList[rsgInfoCount]["rsgOffset"] + 16),
          "res": resInfoList,
        };
        subGroupList[rsgInfoList[rsgInfoCount]["name"]] = {
          "category": [
            compositeInfo[i]["packetInfo"][k]["category"][0],
            compositeInfo[i]["packetInfo"][k]["category"][1] == ""
                ? null
                : compositeInfo[i]["packetInfo"][k]["category"][1]
          ],
          "packet_info": packetInfoList,
        };
      }
      groupList[compositeInfo[i]["name"]] = {
        "is_composite": compositeInfo[i]["isComposite"],
        "subgroup": subGroupList
      };
    }
    final mainfest = {
      "version": rsbHeadInfo["version"],
      "ptx_info_size": rsbHeadInfo["ptxInfoEachLength"],
      "group": groupList
    };
    senFile.clear();
    return mainfest;
  }

  void readResourcesDescription(
      SenBuffer senFile, dynamic rsbHeadInfo, String outFolder) {
    senFile.readOffset = rsbHeadInfo["part1BeginOffset"];
    final part2Offset = rsbHeadInfo["part2BeginOffset"];
    final part3Offset = rsbHeadInfo["part3BeginOffset"];
    final compositeResoucesInfo = [];
    final descriptionGroup = {};
    for (var i = 0; senFile.readOffset < part2Offset; i++) {
      final idOffsetPart3 = senFile.readUInt32LE();
      final id = senFile.getStringByEmpty(part3Offset + idOffsetPart3);
      final rsgNumber = senFile.readUInt32LE();
      final subgroup = {};
      if (senFile.readUInt32LE() != 0x10)
        throw new Exception("invaild_rsg_number");
      final rsgInfoList = [];
      for (var k = 0; k < rsgNumber; k++) {
        final resolutionRatio = senFile.readUInt32LE();
        final language = senFile.readString(4).replaceAll("\x00", "");
        final rsgIdOffsetPart3 = senFile.readUInt32LE();
        final resourcesNumber = senFile.readUInt32LE();
        final resourcesInfoList = [];
        for (var l = 0; l < resourcesNumber; l++) {
          final infoOffsetPart2 = senFile.readUInt32LE();
          resourcesInfoList.add({"infoOffsetPart2": infoOffsetPart2});
        }
        final rsgId = senFile.getStringByEmpty(part3Offset + rsgIdOffsetPart3);
        subgroup[rsgId] = {
          "res": "$resolutionRatio",
          "language": language,
          "resources": {}
        };
        rsgInfoList.add({
          "resolutionRatio": resolutionRatio,
          "language": language,
          "id": rsgId,
          "resourcesNumber": resourcesNumber,
          "resourcesInfoList": resourcesInfoList
        });
      }
      descriptionGroup[id] = {
        "composite": !id.endsWith("_CompositeShell"),
        "subgroups": subgroup
      };
      compositeResoucesInfo.add({
        "id": id,
        "rsgNumber": rsgNumber,
        "rsgInfoList": rsgInfoList,
      });
      senFile.backupReadOffset();
      final resourcesRsgNumber = compositeResoucesInfo[i]["rsgNumber"];
      final descriptionGroupKey = descriptionGroup.keys.toList();
      final subgroupKey = subgroup.keys.toList();
      for (var k = 0; k < resourcesRsgNumber; k++) {
        final resourcesNumber =
            compositeResoucesInfo[i]["rsgInfoList"][k]["resourcesNumber"];
        for (var h = 0; h < resourcesNumber; h++) {
          senFile.readOffset = part2Offset +
              compositeResoucesInfo[i]["rsgInfoList"][k]["resourcesInfoList"][h]
                  ["infoOffsetPart2"];
          {
            if (senFile.readUInt32LE() != 0x0)
              throw new Exception("invaild_part2_offset");
            final type = senFile.readUInt16LE();
            if (senFile.readUInt16LE() != 0x1C)
              throw new Exception("invaild_head_length");
            final ptxInfoEndOffsetPart2 = senFile.readUInt32LE();
            final ptxInfoBeginOffsetPart2 = senFile.readUInt32LE();
            final resIdOffsetPart3 = senFile.readUInt32LE();
            final partOffsetPart3 = senFile.readUInt32LE();
            final resId =
                senFile.getStringByEmpty(part3Offset + resIdOffsetPart3);
            final resPath =
                senFile.getStringByEmpty(part3Offset + partOffsetPart3);
            final propertiesNumber = senFile.readUInt32LE();
            var ptxInfoList = null;
            if (ptxInfoEndOffsetPart2 * ptxInfoBeginOffsetPart2 != 0) {
              ptxInfoList = {
                "imagetype": "${senFile.readUInt16LE()}",
                "aflags": "${senFile.readUInt16LE()}",
                "x": "${senFile.readUInt16LE()}",
                "y": "${senFile.readUInt16LE()}",
                "ax": "${senFile.readUInt16LE()}",
                "ay": "${senFile.readUInt16LE()}",
                "aw": "${senFile.readUInt16LE()}",
                "ah": "${senFile.readUInt16LE()}",
                "rows": "${senFile.readUInt16LE()}",
                "cols": "${senFile.readUInt16LE()}",
                "parent": senFile
                    .getStringByEmpty(part3Offset + senFile.readUInt32LE())
              };
            }
            final propertiesInfoList = {};
            for (var l = 0; l < propertiesNumber; l++) {
              final keyOffsetPart3 = senFile.readUInt32LE();
              if (senFile.readUInt32LE() != 0x0) {
                throw new Exception("rsb_is_corrupted");
              }
              final vauleOffsetPart3 = senFile.readUInt32LE();
              final key =
                  senFile.getStringByEmpty(part3Offset + keyOffsetPart3);
              final vaule =
                  senFile.getStringByEmpty(part3Offset + vauleOffsetPart3);
              propertiesInfoList[key] = vaule;
            }
            final descriptionResources = {
              "type": type,
              "path": resPath,
              "ptx_info": ptxInfoList,
              "properties": propertiesInfoList
            };
            descriptionGroup[descriptionGroupKey[i]]["subgroups"]
                [subgroupKey[k]]["resources"][resId] = descriptionResources;
          }
        }
      }
      senFile.restoreReadOffset();
    }
    final resourcesDescription = {
      "groups": descriptionGroup,
    };
    FileSystem.writeJson(
        path.join(outFolder, "description.json"), resourcesDescription, "\t");
    return;
  }

  dynamic fileListSplit(SenBuffer senFile, int tempOffset, int tempLength) {
    senFile.readOffset = tempOffset;
    var nameDict = [];
    var fileList = [];
    var namePath = "";
    var offsetLimit = tempOffset + tempLength;
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
        fileList
            .add({"namePath": namePath, "poolIndex": senFile.readUInt32LE()});
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
    fileList.sort((a, b) => a["poolIndex"].compareTo(b["poolIndex"]));
    checkEndOffset(senFile, offsetLimit);
    return fileList;
  }

  dynamic readCompositeInfo(SenBuffer senFile, dynamic rsbHeadInfo) {
    senFile.readOffset = rsbHeadInfo["compostieInfoBeginOffset"];
    final compositeInfoList = [];
    for (var i = 0; i < rsbHeadInfo["compositeNumber"]; i++) {
      final startOffset = senFile.readOffset;
      final compositeName = senFile.readStringByEmpty();
      final packetOffset =
          (startOffset + rsbHeadInfo["compositeInfoEachLength"] - 4).toInt();
      final packetNumber = senFile.readUInt32LE(packetOffset);
      senFile.backupReadOffset();
      senFile.readOffset = startOffset + 128;
      var packetInfo = [];
      for (var k = 0; k < packetNumber; k++) {
        packetInfo.add({
          "packetIndex": senFile.readUInt32LE(),
          "category": [
            senFile.readUInt32LE(),
            senFile.readString(4).replaceAll("\x00", "")
          ]
        });
        senFile.readOffset += 4;
      }
      compositeInfoList.add({
        "name": compositeName.replaceAll("_CompositeShell", ""),
        "isComposite": !compositeName.endsWith("_CompositeShell"),
        "packetNumber": packetNumber,
        "packetInfo": packetInfo,
      });
      senFile.restoreReadOffset();
    }
    final endOffset = rsbHeadInfo["compositeInfoEachLength"] *
            rsbHeadInfo["compositeNumber"] +
        rsbHeadInfo["compostieInfoBeginOffset"];
    checkEndOffset(senFile, endOffset);
    return compositeInfoList;
  }

  dynamic readRSGInfo(SenBuffer senFile, dynamic rsbHeadInfo) {
    senFile.readOffset = rsbHeadInfo["rsgInfoBeginOffset"];
    final rsgInfoList = [];
    for (var i = 0; i < rsbHeadInfo["rsgNumber"]; i++) {
      final startOffset = senFile.readOffset;
      final packetName = senFile.readStringByEmpty();
      senFile.readOffset = startOffset + 128;
      final rsgOffset = senFile.readUInt32LE();
      final rsgLength = senFile.readUInt32LE();
      final rsgIndex = senFile.readUInt32LE();
      final packetOffset =
          (startOffset + rsbHeadInfo["rsgInfoEachLength"] - 8).toInt();
      final ptxNumber = senFile.readUInt32LE(packetOffset);
      final ptxBeforeNumber = senFile.readUInt32LE();
      rsgInfoList.add({
        "name": packetName,
        "rsgOffset": rsgOffset,
        "rsgLength": rsgLength,
        "poolIndex": rsgIndex,
        "ptxNumber": ptxNumber,
        "ptxBeforeNumber": ptxBeforeNumber
      });
    }
    final endOffset =
        rsbHeadInfo["rsgInfoEachLength"] * rsbHeadInfo["rsgNumber"] +
            rsbHeadInfo["rsgInfoBeginOffset"];
    checkEndOffset(senFile, endOffset);
    return rsgInfoList;
  }

  dynamic readAutoPool(SenBuffer senFile, dynamic rsbHeadInfo) {
    senFile.readOffset = rsbHeadInfo["autopoolInfoBeginOffset"];
    final autopoolList = [];
    for (var i = 0; i < rsbHeadInfo["autopoolNumber"]; i++) {
      final startOffset = senFile.readOffset;
      final autopoolName = senFile.readStringByEmpty();
      senFile.readOffset = startOffset + 128;
      autopoolList.add({
        "name": autopoolName,
        "part0Size": senFile.readUInt32LE(),
        "part1Size": senFile.readUInt32LE(),
      });
      senFile.readOffset =
          (startOffset + rsbHeadInfo["autopoolInfoEachLength"]).toInt();
    }
    final endOffset =
        rsbHeadInfo["autopoolInfoEachLength"] * rsbHeadInfo["autopoolNumber"] +
            rsbHeadInfo["autopoolInfoBeginOffset"];
    checkEndOffset(senFile, endOffset);
    return autopoolList;
  }

  dynamic readPTXInfo(SenBuffer senFile, dynamic rsbHeadInfo) {
    senFile.readOffset = rsbHeadInfo["ptxInfoBeginOffset"];
    final ptxInfoList = [];
    if (rsbHeadInfo["ptxInfoEachLength"] != 0x10 &&
        rsbHeadInfo["ptxInfoEachLength"] != 0x14 &&
        rsbHeadInfo["ptxInfoEachLength"] != 0x18) {
      throw new Exception("invaild_ptx_info_eachlength");
    }
    for (var i = 0; i < rsbHeadInfo["ptxNumber"]; i++) {
      final width = senFile.readUInt32LE();
      final height = senFile.readUInt32LE();
      final pitch = senFile.readUInt32LE();
      final format = senFile.readUInt32LE();
      final ptxInfo = {
        "ptxIndex": i,
        "width": width,
        "height": height,
        "pitch": pitch,
        "format": format,
      };
      if (rsbHeadInfo["ptxInfoEachLength"] >= 0x14) {
        ptxInfo["alpha_size"] = senFile.readUInt32LE();
        ptxInfo["alpha_format"] = rsbHeadInfo["ptxInfoEachLength"] == 0x18
            ? senFile.readUInt32LE()
            : ptxInfo["alpha_size"] == 0
                ? 0x0
                : 0x64;
      }
      ptxInfoList.add(ptxInfo);
    }
    final endOffset =
        rsbHeadInfo["ptxInfoEachLength"] * rsbHeadInfo["ptxNumber"] +
            rsbHeadInfo["ptxInfoBeginOffset"];
    checkEndOffset(senFile, endOffset);
    return ptxInfoList;
  }

  void checkEndOffset(SenBuffer senFile, int endOffset) {
    if (senFile.readOffset != endOffset) {
      throw new Exception("invaild: offset: ${senFile.readOffset}, $endOffset");
    }
  }

  static dynamic readRSBHead(SenBuffer senFile) {
    final magic = senFile.readString(4);
    if (magic != "1bsr") throw new Exception("invaild_rsb_head");
    final version = senFile.readUInt32LE();
    senFile.readOffset += 4;
    var fileOffset = senFile.readUInt32LE();
    final fileListLength = senFile.readUInt32LE();
    final fileListBeginOffset = senFile.readUInt32LE();
    senFile.readOffset += 8;
    final rsgListLength = senFile.readUInt32LE();
    final rsgListBeginOffset = senFile.readUInt32LE();
    final rsgNumber = senFile.readUInt32LE();
    final rsgInfoBeginOffset = senFile.readUInt32LE();
    final rsgInfoEachLength = senFile.readUInt32LE();
    final compositeNumber = senFile.readUInt32LE();
    final compostieInfoBeginOffset = senFile.readUInt32LE();
    final compositeInfoEachLength = senFile.readUInt32LE();
    final compositeListLength = senFile.readUInt32LE();
    final compositeListBeginOffset = senFile.readUInt32LE();
    final autopoolNumber = senFile.readUInt32LE();
    final autopoolInfoBeginOffset = senFile.readUInt32LE();
    final autopoolInfoEachLength = senFile.readUInt32LE();
    final ptxNumber = senFile.readUInt32LE();
    final ptxInfoBeginOffset = senFile.readUInt32LE();
    final ptxInfoEachLength = senFile.readUInt32LE();
    final part1BeginOffset = senFile.readUInt32LE();
    final part2BeginOffset = senFile.readUInt32LE();
    final part3BeginOffset = senFile.readUInt32LE();
    if (version == 4) {
      fileOffset = senFile.readUInt32LE();
    }
    return {
      "version": version,
      "fileOffset": fileOffset,
      "fileListLength": fileListLength,
      "fileListBeginOffset": fileListBeginOffset,
      "rsgListLength": rsgListLength,
      "rsgListBeginOffset": rsgListBeginOffset,
      "rsgNumber": rsgNumber,
      "rsgInfoBeginOffset": rsgInfoBeginOffset,
      "rsgInfoEachLength": rsgInfoEachLength,
      "compositeNumber": compositeNumber,
      "compostieInfoBeginOffset": compostieInfoBeginOffset,
      "compositeInfoEachLength": compositeInfoEachLength,
      "compositeListLength": compositeListLength,
      "compositeListBeginOffset": compositeListBeginOffset,
      "autopoolNumber": autopoolNumber,
      "autopoolInfoBeginOffset": autopoolInfoBeginOffset,
      "autopoolInfoEachLength": autopoolInfoEachLength,
      "ptxNumber": ptxNumber,
      "ptxInfoBeginOffset": ptxInfoBeginOffset,
      "ptxInfoEachLength": ptxInfoEachLength,
      "part1BeginOffset": part1BeginOffset,
      "part2BeginOffset": part2BeginOffset,
      "part3BeginOffset": part3BeginOffset
    };
  }

  //Pack
  void packRSG(String inFolder, String outFile, dynamic manifest) {
    final senFile = new SenBuffer();
    senFile.writeString("1bsr");
    final version = manifest["version"];
    var fileListBeginOffset = 0;
    if (version == 3) {
      fileListBeginOffset = 0x6C;
    } else if (version == 4) {
      fileListBeginOffset = 0x70;
    } else {
      throw new Exception("invaild_rsb_version");
    }
    final rsbHeadInfo = {};
    senFile.writeInt32LE(version);
    senFile.writeNull(fileListBeginOffset - 8);
    final ptxInfoSize = manifest["ptx_info_size"];
    rsbHeadInfo["ptxInfoEachLength"] = ptxInfoSize;
    if (ptxInfoSize != 0x10 && ptxInfoSize != 0x14 && ptxInfoSize != 0x18) {
      throw new Exception("invaild_ptx_info_each_length");
    }
    final fileList = [];
    final rsgFileList = [];
    final compositeList = [];
    final compositeInfo = new SenBuffer();
    final rsgInfo = new SenBuffer();
    final autopoolInfo = new SenBuffer();
    final ptxInfo = new SenBuffer();
    final rsgFileBank = new SenBuffer();
    var rsgPacketIndex = 0;
    final groupKey = manifest["group"].keys.toList();
    final groupLength = groupKey.length;
    var ptxBeforeNumber = 0;
    for (var i = 0; i < groupLength; i++) {
      final kFirst = manifest["group"][groupKey[i]];
      final compositeName = kFirst["is_composite"]
          ? groupKey[i]
          : "${groupKey[i]}_CompositeShell";
      compositeList
          .add({"namePath": compositeName.toUpperCase(), "poolIndex": i});
      compositeInfo.writeString(compositeName);
      compositeInfo.writeOffset += (128 - compositeName.length).toInt();
      final subgroupKey = kFirst["subgroup"].keys.toList();
      final subgroupLength = subgroupKey.length;
      for (var k = 0; k < subgroupLength; k++) {
        final kSecond = kFirst["subgroup"][subgroupKey[k]];
        final rsgName = subgroupKey[k];
        var rsgComposite = false;
        rsgFileList.add(
            {"namePath": rsgName.toUpperCase(), "poolIndex": rsgPacketIndex});
        final rsgFile = new SenBuffer.OpenFile(
            path.join(inFolder, "packet", "${rsgName}.rsg"));
        comparePacketInfo(kSecond["packet_info"], rsgFile);
        var ptxNumber = 0;
        final resInfoLength = kSecond["packet_info"]["res"].length;
        for (var l = 0; l < resInfoLength; l++) {
          final kThird = kSecond["packet_info"]["res"][l];
          fileList.add({
            "namePath": kThird["path"].join("\\").toUpperCase(),
            "poolIndex": rsgPacketIndex
          });
          if (kThird["ptx_info"] != null) {
            ptxNumber++;
            rsgComposite = true;
            {
              final id = kThird["ptx_info"]["id"];
              final ptxOffset =
                  ((ptxBeforeNumber + id) * rsbHeadInfo["ptxInfoEachLength"])
                      .toInt();
              ptxInfo.writeUInt32LE(kThird["ptx_info"]["width"], ptxOffset);
              ptxInfo.writeUInt32LE(kThird["ptx_info"]["height"]);
              final format = kThird["ptx_property"]["format"];
              final pitch = kThird["ptx_property"]["pitch"];
              ptxInfo.writeUInt32LE(pitch);
              ptxInfo.writeUInt32LE(format);
              final alphaSize = kThird["ptx_property"]["alpha_size"];
              final alphaFormat = kThird["ptx_property"]["alpha_format"];
              if (rsbHeadInfo["ptxInfoEachLength"] != 0x10) {
                ptxInfo.writeUInt32LE(alphaSize ?? 0);
              }
              if (rsbHeadInfo["ptxInfoEachLength"] == 0x18) {
                ptxInfo.writeUInt32LE(alphaFormat ?? 0);
              }
            }
          }
        }
        {
          compositeInfo.writeUInt32LE(rsgPacketIndex);
          compositeInfo.writeUInt32LE(kSecond["category"][0]);
          if (kSecond["category"][1] != null && kSecond["category"][1] != "") {
            if (kSecond["category"][1].length != 4) {
              throw new Exception("category_out_of_length");
            }
            compositeInfo.writeString(kSecond["category"][1]);
          } else {
            compositeInfo.writeNull(4);
          }
          compositeInfo.writeNull(4);
        }
        {
          rsgInfo.writeString(rsgName);
          rsgInfo.writeOffset += (128 - rsgName.length).toInt();
          rsgInfo.writeUInt32LE(rsgFileBank.writeOffset);
          {
            rsgFileBank.writeBytes(rsgFile.toBytes());
          }
          rsgInfo.writeUInt32LE(rsgFile.length);
          rsgInfo.writeUInt32LE(rsgPacketIndex);
          rsgInfo.writeBytes(rsgFile.getBytes(56, 0x10));
          final rsgWriteOffset = rsgInfo.writeOffset;
          rsgInfo.writeUInt32LE(
              rsgFile.readUInt32LE(0x20), rsgWriteOffset - 36);
          rsgInfo.writeUInt32LE(ptxNumber, rsgWriteOffset);
          rsgInfo.writeUInt32LE(ptxBeforeNumber);
          ptxBeforeNumber += ptxNumber;
        }
        {
          final autopoolName = rsgName + "_AutoPool";
          autopoolInfo.writeString(autopoolName);
          autopoolInfo.writeOffset += (128 - autopoolName.length).toInt();
          if (rsgComposite) {
            autopoolInfo.writeUInt32LE(rsgFile.readUInt32LE(0x18));
            autopoolInfo.writeUInt32LE(rsgFile.readUInt32LE(0x30));
          } else {
            autopoolInfo.writeUInt32LE(
                rsgFile.readUInt32LE(0x18) + rsgFile.readUInt32LE(0x20));
            autopoolInfo.writeUInt32LE(0);
          }
          autopoolInfo.writeUInt32LE(1);
          autopoolInfo.writeNull(12);
        }
        rsgPacketIndex++;
        rsgFile.readOffset = 0;
      }
      compositeInfo.writeOffset += (1024 - (subgroupLength * 16)).toInt();
      compositeInfo.writeUInt32LE(subgroupLength);
    }
    {
      final fileListPathTemp = fileListPack(fileList);
      final rsgListPathTemp = fileListPack(rsgFileList);
      final compositeListPathTemp = fileListPack(compositeList);
      final fileListPathTempLength = fileListPathTemp.length;
      rsbHeadInfo["fileListBeginOffset"] = fileListBeginOffset;
      for (var i = 0; i < fileListPathTempLength; i++) {
        writeFileList(senFile, fileListPathTemp[i]);
      }
      rsbHeadInfo["fileListLength"] = senFile.writeOffset - fileListBeginOffset;
      final rsgListPathTempLength = rsgListPathTemp.length;
      rsbHeadInfo["rsgListBeginOffset"] = senFile.writeOffset;
      for (var i = 0; i < rsgListPathTempLength; i++) {
        writeFileList(senFile, rsgListPathTemp[i]);
      }
      rsbHeadInfo["rsgListLength"] =
          senFile.writeOffset - rsbHeadInfo["rsgListBeginOffset"];
      rsbHeadInfo["compositeNumber"] = groupLength;
      rsbHeadInfo["compostieInfoBeginOffset"] = senFile.writeOffset;
      senFile.writeBytes(compositeInfo.toBytes());
      compositeInfo.clear();
      final compositeListPathTempLength = compositeListPathTemp.length;
      rsbHeadInfo["compositeListBeginOffset"] = senFile.writeOffset;
      for (var i = 0; i < compositeListPathTempLength; i++) {
        writeFileList(senFile, compositeListPathTemp[i]);
      }
      rsbHeadInfo["compositeListLength"] =
          senFile.writeOffset - rsbHeadInfo["compositeListBeginOffset"];
      rsbHeadInfo["rsgInfoBeginOffset"] = senFile.writeOffset;
      rsbHeadInfo["rsgNumber"] = rsgPacketIndex;
      senFile.writeBytes(rsgInfo.toBytes());
      rsgInfo.clear();
      rsbHeadInfo["autopoolInfoBeginOffset"] = senFile.writeOffset;
      rsbHeadInfo["autopoolNumber"] = rsgPacketIndex;
      senFile.writeBytes(autopoolInfo.toBytes());
      autopoolInfo.clear();
      rsbHeadInfo["ptxInfoBeginOffset"] = senFile.writeOffset;
      rsbHeadInfo["ptxNumber"] = ptxBeforeNumber;
      senFile.writeBytes(ptxInfo.toBytes());
      ptxInfo.clear();
      if (version == 3) {
        print(senFile.length);
        writeResourcesDescription(senFile, rsbHeadInfo, inFolder);
      }
      var rsgFunction = ResourceStreamGroup();
      senFile.writeNull(rsgFunction.beautifyLength(senFile.writeOffset));
      final fileOffset = senFile.writeOffset;
      rsbHeadInfo["fileOffset"] = fileOffset;
      senFile.writeBytes(rsgFileBank.toBytes());
      rsgFileBank.clear();
      senFile.readOffset = rsbHeadInfo["rsgInfoBeginOffset"];
      for (var i = 0; i < rsbHeadInfo["rsgNumber"]; i++) {
        final rsgInfoFileOffset =
            (rsbHeadInfo["rsgInfoBeginOffset"] + i * 204) + 128;
        final packetOffset = senFile.readUInt32LE(rsgInfoFileOffset);
        senFile.writeUInt32LE(packetOffset + fileOffset, rsgInfoFileOffset);
      }
      rsbHeadInfo["version"] = version;
      writeHead(senFile, rsbHeadInfo);
    }
    senFile.outFile(outFile);
    return;
  }

  void writeResourcesDescription(
      SenBuffer senFile, dynamic rsgHeadInfo, String inFolder) {
    final resourcesDescription =
        FileSystem.readJson(path.join(inFolder, "description.json"));
    final groupKeys = resourcesDescription["groups"].keys.toList();
    final part1Res = new SenBuffer();
    final part2Res = new SenBuffer();
    final part3Res = new SenBuffer();
    Map<String, int> stringPool = <String, int>{};
    int throwInPool(String poolKey) {
      if (!stringPool.containsKey(poolKey)) {
        stringPool[poolKey] = part3Res.writeOffset;
        part3Res.writeStringByEmpty(poolKey);
      }
      return stringPool[poolKey]!;
    }

    part3Res.writeNull(1);
    stringPool[""] = 0;
    groupKeys.forEach((gkey) {
      var idOffsetPart3 = throwInPool(gkey);
      part1Res.writeUInt32LE(idOffsetPart3);
      final subgroupKeys =
          resourcesDescription["groups"][gkey]["subgroups"].keys.toList();
      part1Res.writeUInt32LE(subgroupKeys.length);
      part1Res.writeUInt32LE(0x10);
      subgroupKeys.forEach((gpKey) {
        part1Res.writeUInt32LE(int.parse(
            resourcesDescription["groups"][gkey]["subgroups"][gpKey]["res"]));
        final language = resourcesDescription["groups"][gkey]["subgroups"]
            [gpKey]["language"];
        if (language == "") {
          part1Res.writeUInt32LE(0x0);
        } else {
          part1Res.writeString((language + "    ").substring(0, 4));
        }
        final rsgIdOffsetPart3 = throwInPool(gpKey);
        part1Res.writeUInt32LE(rsgIdOffsetPart3);
        final rescourcesKeys = resourcesDescription["groups"][gkey]["subgroups"]
                [gpKey]["resources"]
            .keys
            .toList();
        part1Res.writeUInt32LE(rescourcesKeys.length);
        rescourcesKeys.forEach((rsKey) {
          final idOffsetPart2 = part2Res.writeOffset;
          part1Res.writeUInt32LE(idOffsetPart2);
          {
            part2Res.writeUInt32LE(0x0);
            final type = resourcesDescription["groups"][gkey]["subgroups"]
                [gpKey]["resources"][rsKey]["type"];
            part2Res.writeUInt16LE(type);
            part2Res.writeUInt16LE(0x1C);
            part2Res.backupWriteOffset();
            part2Res.writeOffset += 0x8;
            idOffsetPart3 = throwInPool(rsKey);
            final pathOffsetPart3 = throwInPool(resourcesDescription["groups"]
                [gkey]["subgroups"][gpKey]["resources"][rsKey]["path"]);
            part2Res.writeInt32LE(idOffsetPart3);
            part2Res.writeInt32LE(pathOffsetPart3);
            Map<String, dynamic> properties = resourcesDescription["groups"]
                [gkey]["subgroups"][gpKey]["resources"][rsKey]["properties"];
            final propertiesNumber = properties.length;
            part2Res.writeInt32LE(propertiesNumber);
            if (type == 0) {
              final ptxInfoBeginOffsetPart2 = part2Res.writeOffset;
              {
                final ptxInfo = resourcesDescription["groups"][gkey]
                    ["subgroups"][gpKey]["resources"][rsKey]["ptx_info"];
                part2Res.writeUInt16LE(int.parse(ptxInfo["imagetype"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["aflags"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["x"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["y"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["ax"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["ay"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["aw"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["ah"] ?? "0"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["rows"] ?? "1"));
                part2Res.writeUInt16LE(int.parse(ptxInfo["cols"] ?? "1"));
                final parentOffsetInPart3 =
                    throwInPool(ptxInfo["parent"] ?? "");
                part2Res.writeUInt32LE(parentOffsetInPart3);
              }
              final ptxInfoEndOffsetPart2 = part2Res.writeOffset;
              part2Res.restoreWriteOffset();
              part2Res.writeUInt32LE(ptxInfoEndOffsetPart2);
              part2Res.writeUInt32LE(ptxInfoBeginOffsetPart2);
              part2Res.writeOffset = ptxInfoEndOffsetPart2;
            }
            properties.forEach((key, value) {
              final keyOffsetInPart3 = throwInPool(key);
              final vauleOffsetInPart3 = throwInPool(value);
              part2Res.writeUInt32LE(keyOffsetInPart3);
              part2Res.writeUInt32LE(0x0);
              part2Res.writeUInt32LE(vauleOffsetInPart3);
            });
          }
        });
      });
    });
    rsgHeadInfo["part1BeginOffset"] = senFile.writeOffset;
    senFile.writeBytes(part1Res.toBytes());
    part1Res.clear();
    rsgHeadInfo["part2BeginOffset"] = senFile.writeOffset;
    senFile.writeBytes(part2Res.toBytes());
    part2Res.clear();
    rsgHeadInfo["part3BeginOffset"] = senFile.writeOffset;
    senFile.writeBytes(part3Res.toBytes());
    part3Res.clear();
    return;
  }

  dynamic fileListPack(List<dynamic> fileList) {
    fileList.sort((a, b) =>
        a['namePath'].toUpperCase().compareTo(b['namePath'].toUpperCase()));
    fileList.insert(0, {"namePath": "", "poolIndex": -1});
    final listLength = fileList.length - 1;
    var wPos = 0;
    final pathTemps = [];
    for (var i = 0; i < listLength; i++) {
      String path1 = fileList[i]["namePath"].toUpperCase();
      String path2 = fileList[i + 1]["namePath"].toUpperCase();
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
          wPos += path2.length - k + 2;
          pathTemps.add({
            "pathSlice": path2.substring(k),
            "key": k,
            "poolIndex": fileList[i + 1]["poolIndex"],
            "positions": []
          });
          break;
        }
      }
    }
    return pathTemps;
  }

  void writeHead(SenBuffer senFile, dynamic rsbHeadInfo) {
    senFile.writeUInt32LE(rsbHeadInfo["fileOffset"], 0x0C);
    senFile.writeUInt32LE(rsbHeadInfo["fileListLength"]);
    senFile.writeUInt32LE(rsbHeadInfo["fileListBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["rsgListLength"], 0x20);
    senFile.writeUInt32LE(rsbHeadInfo["rsgListBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["rsgNumber"]);
    senFile.writeUInt32LE(rsbHeadInfo["rsgInfoBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["rsgInfoEachLength"] ?? 204);
    senFile.writeUInt32LE(rsbHeadInfo["compositeNumber"]);
    senFile.writeUInt32LE(rsbHeadInfo["compostieInfoBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["compositeInfoEachLength"] ?? 1156);
    senFile.writeUInt32LE(rsbHeadInfo["compositeListLength"]);
    senFile.writeUInt32LE(rsbHeadInfo["compositeListBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["autopoolNumber"]);
    senFile.writeUInt32LE(rsbHeadInfo["autopoolInfoBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["autopoolInfoEachLength"] ?? 152);
    senFile.writeUInt32LE(rsbHeadInfo["ptxNumber"]);
    senFile.writeUInt32LE(rsbHeadInfo["ptxInfoBeginOffset"]);
    senFile.writeUInt32LE(rsbHeadInfo["ptxInfoEachLength"]);
    senFile.writeUInt32LE(rsbHeadInfo["part1BeginOffset"] ?? 0);
    senFile.writeUInt32LE(rsbHeadInfo["part2BeginOffset"] ?? 0);
    senFile.writeUInt32LE(rsbHeadInfo["part3BeginOffset"] ?? 0);
    if (rsbHeadInfo["version"] == 4) {
      senFile.writeUInt32LE(rsbHeadInfo["fileOffset"]);
    }
    return;
  }

  void writeFileList(SenBuffer senFile, dynamic pathTemp) {
    final beginOffset = senFile.writeOffset;
    senFile.writeStringFourByte(pathTemp["pathSlice"]);
    senFile.backupWriteOffset();
    for (var h = 0; h < pathTemp["positions"].length; h++) {
      senFile.writeUInt24LE(pathTemp["positions"][h]["position"],
          (beginOffset + pathTemp["positions"][h]["offset"] * 4 + 1).toInt());
    }
    senFile.restoreWriteOffset();
    senFile.writeUInt32LE(pathTemp["poolIndex"]);
    return;
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

  void comparePacketInfo(dynamic modifyPacket, SenBuffer rsgFile) {
    final rsgFunction = ResourceStreamGroup();
    dynamic oriPacket = rsgFunction.unpackRSG(rsgFile, "", false, true);
    if (oriPacket["version"] != modifyPacket["version"]) {
      throwError("version", oriPacket["version"], modifyPacket["version"],
          rsgFile.filePath);
    }
    if (oriPacket["compression_flags"] != modifyPacket["compression_flags"]) {
      throwError("compression_flags", oriPacket["compression_flags"],
          modifyPacket["compression_flags"], rsgFile.filePath);
    }
    if (oriPacket["res"].length != modifyPacket["res"].length) {
      throwError("item_number", oriPacket["res"].length,
          modifyPacket["res"].length, rsgFile.filePath);
    }
    List<dynamic> resOriPacket = oriPacket["res"];
    resOriPacket
        .sort((a, b) => a["path"].join("\\").compareTo(b["path"].join("\\")));
    List<dynamic> resModifyPacket = modifyPacket["res"];
    resModifyPacket
        .sort((a, b) => a["path"].join("\\").compareTo(b["path"].join("\\")));
    for (var i = 0; i < resModifyPacket.length; i++) {
      if (resOriPacket[i]["path"].join("\\").toUpperCase() !=
          resModifyPacket[i]["path"].join("\\").toUpperCase()) {
        throwError("item_path", resOriPacket[i]["path"].join("\\"),
            resModifyPacket[i]["path"].join("\\"), rsgFile.filePath);
      }
      if (resOriPacket[i]["ptx_info"] != null &&
          resModifyPacket[i]["ptx_info"] != null) {
        if (resOriPacket[i]["ptx_info"]["id"] !=
            resModifyPacket[i]["ptx_info"]["id"]) {
          throwError("item_id", resOriPacket[i]["ptx_info"]["id"],
              resModifyPacket[i]["ptx_info"]["id"], rsgFile.filePath);
        }
        if (resOriPacket[i]["ptx_info"]["width"] !=
            resModifyPacket[i]["ptx_info"]["width"]) {
          throwError("item_width", resOriPacket[i]["ptx_info"]["width"],
              resModifyPacket[i]["ptx_info"]["width"], rsgFile.filePath);
        }
        if (resOriPacket[i]["ptx_info"]["height"] !=
            resModifyPacket[i]["ptx_info"]["height"]) {
          throwError("item_height", resOriPacket[i]["ptx_info"]["height"],
              resModifyPacket[i]["ptx_info"]["height"], rsgFile.filePath);
        }
      }
    }
    return;
  }

  void throwError(String typeError, dynamic oriVaule, dynamic modifyVaule,
      String filePath) {
    throw new Exception(
        "RSG $typeError is not same. In Manifest: $modifyVaule | In RSGFile: $oriVaule. RSGPath: $filePath");
  }
}
