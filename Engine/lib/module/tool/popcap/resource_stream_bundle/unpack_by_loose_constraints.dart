import 'package:sen_material_design/module/tool/popcap/resource_stream_group/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as path;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class UnpackLooseConstraints {
  static void process(
    String inFile,
    String outDirectory,
    AppLocalizations? localizations,
  ) {
    final rsb = UnpackLooseConstraints();
    final manifest = rsb.unpack(
      SenBuffer.OpenFile(inFile),
      outDirectory,
      localizations,
    );
    FileSystem.writeJson(
      path.join(
        outDirectory,
        'manifest.json',
      ),
      manifest,
      '\t',
    );
    return;
  }

  dynamic unpack(
    SenBuffer senFile,
    String outFolder,
    AppLocalizations? localizations,
  ) {
    final rsbFunc = ResourceStreamBundle();
    final rsbHeadInfo = ResourceStreamBundle.readRSBHead(
      senFile,
      localizations,
    );
    if (rsbHeadInfo["version"] != 4) {
      rsbHeadInfo["version"] = 4;
    }
    final rsgList = rsbFunc.fileListSplit(
      senFile,
      rsbHeadInfo["rsgListBeginOffset"],
      rsbHeadInfo["rsgListLength"],
    );
    final compositeInfo = rsbFunc.readCompositeInfo(senFile, rsbHeadInfo);
    final rsgInfoList = readRSGInfo(senFile, rsbHeadInfo);
    // final autopoolInfoList = readAutoPool(senFile, rsbHeadInfo);
    final ptxInfoList =
        rsbFunc.readPTXInfo(senFile, rsbHeadInfo, localizations);
    if (rsbHeadInfo["version"] == 3) {
      if (rsbHeadInfo["part1BeginOffset"] == 0 &&
          rsbHeadInfo["part2BeginOffset"] == 0 &&
          rsbHeadInfo["part2BeginOffset"] == 0) {
        throw Exception("Invalid RSB ver 3 resource offset");
      }
      rsbFunc.readResourcesDescription(
        senFile,
        rsbHeadInfo,
        outFolder,
        localizations,
      );
    }
    final groupList = {};
    final compositeLength = compositeInfo.length;
    for (var i = 0; i < compositeLength; i++) {
      final subGroupList = {};
      for (var k = 0; k < compositeInfo[i]["packetNumber"]; k++) {
        final packetIndex = compositeInfo[i]["packetInfo"][k]["packetIndex"];
        var rsgInfoCount = 0;
        var rsgListCount = 0;
        while (rsgInfoList[rsgInfoCount]["poolIndex"] != packetIndex) {
          if (rsgInfoCount >= rsgInfoList.length) {
            throw Exception(
              localizations == null
                  ? "Out of range for poolIndex"
                  : localizations.out_of_range_1,
            );
          }
          rsgInfoCount++;
        }
        while (rsgList[rsgListCount]["poolIndex"] != packetIndex) {
          if (rsgInfoCount >= rsgList.length) {
            throw Exception(
              localizations == null
                  ? "Out of range for packet index"
                  : localizations.out_of_range_2,
            );
          }
          rsgListCount++;
        }
        if (rsgInfoList[rsgInfoCount]["name"] == "break") {
          continue;
        }
        final packetFile = senFile.getBytes(
          rsgInfoList[rsgInfoCount]["rsgLength"],
          rsgInfoList[rsgInfoCount]["rsgOffset"],
        );
        final rsgFile = SenBuffer.fromBytes(packetFile);
        fixRSG(
          rsgFile,
          rsbHeadInfo["version"],
          SenBuffer.fromBytes(rsgInfoList[rsgInfoCount]["packetHeadInfo"]),
        );
        final rsgFunction = ResourceStreamGroup();
        final packetInfo = rsgFunction.unpackRSG(
          rsgFile,
          path.join(outFolder, "unpack"),
          localizations,
          false,
          false,
        );
        final resInfoList = [];
        final ptxBeforeNumber = rsgInfoList[rsgInfoCount]["ptxBeforeNumber"];
        for (var h = 0; h < packetInfo["res"].length; h++) {
          final resInfo = {"path": packetInfo["res"][h]["path"]};
          if (packetInfo["res"][h]["ptx_info"] != null) {
            resInfo["ptx_info"] = packetInfo["res"][h]["ptx_info"];
            resInfo["ptx_property"] = {
              "format": ptxInfoList[ptxBeforeNumber +
                  packetInfo["res"][h]["ptx_info"]["id"]]["format"],
              "pitch": ptxInfoList[ptxBeforeNumber +
                  packetInfo["res"][h]["ptx_info"]["id"]]["pitch"],
              "alpha_size": ptxInfoList[ptxBeforeNumber +
                  packetInfo["res"][h]["ptx_info"]["id"]]["alpha_size"],
              "alpha_format": ptxInfoList[ptxBeforeNumber +
                  packetInfo["res"][h]["ptx_info"]["id"]]["alpha_format"],
            };
          }
          resInfoList.add(resInfo);
        }
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
                : compositeInfo[i]["packetInfo"][k]["category"][1],
          ],
          "packet_info": packetInfoList,
        };
      }
      groupList[compositeInfo[i]["name"]] = {
        "is_composite": compositeInfo[i]["isComposite"],
        "subgroup": subGroupList,
      };
    }
    final mainfest = {
      "version": rsbHeadInfo["version"],
      "ptx_info_size": rsbHeadInfo["ptxInfoEachLength"],
      "group": groupList,
    };
    senFile.clear();
    return mainfest;
  }

  void fixRSG(SenBuffer senFile, int version, SenBuffer senInfo) {
    final rsgMagic = senFile.readString(4);
    final rsbVersion = senFile.readUInt32LE();
    final compressionFlag = senFile.readUInt32LE(0x10);
    senFile.readOffset = 0;
    if (rsgMagic == "pgsr" &&
        rsbVersion == version &&
        compressionFlag >= 0 &&
        compressionFlag <= 3 &&
        compressionFlag == senInfo.readUInt32LE()) {
      return;
    } else {
      senFile.writeString("pgsr");
      senFile.writeUInt32LE(version);
      senFile.writeNull(8);
      senFile.writeBytes(senInfo.toBytes());
      senFile.writeNull(16);
      senInfo.clear();
    }
    if (compressionFlag < 0 || compressionFlag > 3) {
      final part0Zlib = senFile.readUInt32LE(0x1C);
      final part0Size = senFile.readUInt32LE();
      final part1Zlib = senFile.readUInt32LE(0x1C);
      final part1Size = senFile.readUInt32LE();
      senFile.readOffset = 0;
      int flag = 0;
      if ((part0Zlib == part0Size && part1Zlib == 0) ||
          (part1Zlib != part1Size && part0Size == 0)) {
        flag = 1;
      } else if ((part0Zlib != part0Size && part1Zlib == 0) ||
          (part1Zlib == part1Size && part0Size == 0)) {
        flag = 2;
      } else {
        flag = 3;
      }
      senFile.writeUInt32LE(flag, 0x10);
    }
    return;
  }

  dynamic readRSGInfo(SenBuffer senFile, dynamic rsbHeadInfo) {
    final rsgInfoList = [];
    senFile.readOffset = rsbHeadInfo["rsgInfoBeginOffset"];
    for (var i = 0; i < rsbHeadInfo["rsgNumber"]; i++) {
      final startOffset = senFile.readOffset;
      final rsgOffset = senFile.readUInt32LE(startOffset + 128);
      final rsgIndex = senFile.readUInt32LE(startOffset + 136);
      if (isNotRSG(senFile, rsgOffset)) {
        rsgInfoList.add({
          "name": "break",
          "rsgOffset": 0,
          "rsgLength": 0,
          "poolIndex": rsgIndex,
          "ptxNumber": 0,
          "ptxBeforeNumber": 0,
        });
        senFile.readOffset =
            (startOffset + rsbHeadInfo["rsgInfoEachLength"]).toInt();
      }
      final packetHeadInfo = senFile.readBytes(32, startOffset + 140);
      var rsgLength = senFile.readUInt32LE(startOffset + 148) +
          senFile.readUInt32LE(startOffset + 152) +
          senFile.readUInt32LE(startOffset + 168);
      if (rsgLength <= 1024) rsgLength = 4096;
      final ptxNumber = senFile.readUInt32LE(
        (startOffset + rsbHeadInfo["rsgInfoEachLength"] - 8).toInt(),
      );
      final ptxBeforeNumber = senFile.readUInt32LE();
      rsgInfoList.add({
        "name": "",
        "rsgOffset": rsgOffset,
        "rsgLength": rsgLength,
        "poolIndex": rsgIndex,
        "ptxNumber": ptxNumber,
        "ptxBeforeNumber": ptxBeforeNumber,
        "packetHeadInfo": packetHeadInfo,
      });
    }
    final endOffset =
        rsbHeadInfo["rsgInfoEachLength"] * rsbHeadInfo["rsgNumber"] +
            rsbHeadInfo["rsgInfoBeginOffset"];
    final rsbFunc = ResourceStreamBundle();
    rsbFunc.checkEndOffset(senFile, endOffset);
    return rsgInfoList;
  }

  bool isNotRSG(SenBuffer senFile, int rsgOffset) {
    senFile.backupReadOffset();
    final fileListOffset = senFile.readUInt32LE(rsgOffset + 76);
    senFile.restoreReadOffset();
    if (fileListOffset != 0x5C && fileListOffset != 0x1000) return true;
    return false;
  }
}
