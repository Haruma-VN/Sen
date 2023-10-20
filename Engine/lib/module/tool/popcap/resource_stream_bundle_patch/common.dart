// ignore_for_file: depend_on_referenced_packages

import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "../resource_stream_bundle/common.dart";
import 'package:crypto/crypto.dart';
import 'package:collection/collection.dart';
import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ResourceStreamBundlePatch {
  SenBuffer patchEncode(
    SenBuffer senBefore,
    SenBuffer senAfter,
    AppLocalizations? localizations, [
    bool useRawPacket = false,
  ]) {
    final rsbBeforeHead =
        ResourceStreamBundle.readRSBHead(senBefore, localizations);
    final rsbAfterHead = ResourceStreamBundle.readRSBHead(
      senAfter,
      localizations,
    );
    if (rsbBeforeHead["version"] != 4 && rsbAfterHead["version"] != 4) {
      throw Exception(
        localizations == null
            ? "RSB-Patch only support PvZ2"
            : localizations.rsbpatch_only_for_pvz2,
      );
    }
    final rsbBeforeHeadByte =
        senBefore.readBytes(rsbBeforeHead["fileOffset"], 0);
    final rsbAfterHeadByte = senAfter.readBytes(rsbAfterHead["fileOffset"], 0);
    final md5DigestOld = md5.convert(rsbBeforeHeadByte.toList());
    testHash(
      rsbBeforeHeadByte,
      md5DigestOld,
      localizations,
    );
    final patchExist =
        !const ListEquality().equals(rsbBeforeHeadByte, rsbAfterHeadByte);
    final senWriter = SenBuffer();
    {
      senWriter.writeString("PBSR");
      senWriter.writeInt32LE(1);
      senWriter.writeInt32LE(2);
      senWriter.writeInt32LE(senAfter.length);
      senWriter.writeNull(8);
      senWriter.writeBytes(Uint8List.fromList(md5DigestOld.bytes));
      senWriter.writeInt32LE(senAfter.readInt32LE(0x28));
      senWriter.writeInt32LE(0);
    }
    if (patchExist) {
      var rsbHeadDiff = vcDiffEncode(rsbBeforeHeadByte, rsbAfterHeadByte);
      senWriter.backupWriteOffset();
      senWriter.writeInt32LE(rsbHeadDiff.length, 0x14);
      senWriter.writeInt32LE(1, 0x2C);
      senWriter.restoreWriteOffset();
      senWriter.writeBytes(rsbHeadDiff);
    }
    final rsbFunc = ResourceStreamBundle();
    final rsbBeforeInfoList = rsbFunc.readRSGInfo(senBefore, rsbBeforeHead);
    final rsbAfterInfoList = rsbFunc.readRSGInfo(senAfter, rsbAfterHead);
    final packetBeforeSubGroupIndexing = <String>[];
    for (var i = 0; i < rsbBeforeInfoList.length; i++) {
      packetBeforeSubGroupIndexing.add(rsbBeforeInfoList[i]["name"]);
    }
    for (var i = 0; i < rsbAfterInfoList.length; i++) {
      final packetAfterName = rsbAfterInfoList[i]["name"];
      Uint8List packetBefore = Uint8List(1);
      if (packetBeforeSubGroupIndexing.contains(packetAfterName)) {
        final packetBeforeSubGroupIndex =
            packetBeforeSubGroupIndexing.indexOf(packetAfterName);
        if (!useRawPacket) {
          packetBefore = senBefore.readBytes(
            rsbBeforeInfoList[packetBeforeSubGroupIndex]["rsgLength"],
            rsbBeforeInfoList[packetBeforeSubGroupIndex]["rsgOffset"],
          );
        } else {
          throw Exception(
            localizations == null
                ? "Raw Packet is not supported"
                : localizations.raw_packet_is_not_supported,
          );
        }
      }
      Uint8List packetAfter = Uint8List(1);
      {
        if (!useRawPacket) {
          packetAfter = senAfter.readBytes(
            rsbAfterInfoList[i]["rsgLength"],
            rsbAfterInfoList[i]["rsgOffset"],
          );
        } else {
          throw Exception(
            localizations == null
                ? "Raw Packet is not supported"
                : localizations.raw_packet_is_not_supported,
          );
        }
      }
      {
        senWriter.writeNull(8);
        senWriter.writeString(packetAfterName);
        senWriter.writeNull((0x80 - packetAfterName.length).toInt());
        final digestAfter = md5.convert(packetAfter);
        senWriter.writeBytes(Uint8List.fromList(digestAfter.bytes));
      }
      if (!const ListEquality().equals(packetBefore, packetAfter)) {
        final subGroupDiff = vcDiffEncode(packetBefore, packetAfter);
        final pos = senWriter.writeOffset;
        senWriter.writeInt32LE(subGroupDiff.length, pos - 148);
        senWriter.writeBytes(subGroupDiff, pos);
      }
    }
    return senWriter;
  }

  Uint8List vcDiffEncode(Uint8List before, Uint8List after) {
    final beforePointer = calloc<Int8>(before.length)
      ..asTypedList(before.length).setAll(0, before);
    final afterPointer = calloc<Int8>(after.length)
      ..asTypedList(after.length).setAll(0, after);
    final sizePointer = calloc<Int32>();
    final vcPointer = VCDiffEncode(
      beforePointer,
      before.length,
      afterPointer,
      after.length,
      sizePointer,
    );
    final patchData = vcPointer.asTypedList(sizePointer.value);
    calloc.free(beforePointer);
    calloc.free(afterPointer);
    return Uint8List.fromList(patchData);
  }

  void testHash(
    Uint8List data,
    Digest hash,
    AppLocalizations? localizations,
  ) {
    final md5data = md5.convert(data.toList());
    if ("$md5data" != "$hash") {
      throw Exception(
        localizations == null
            ? "Invalid MD5 Data"
            : localizations.invalid_md5_data,
      );
    }
    return;
  }

  SenBuffer patchDecode(
    SenBuffer senBefore,
    SenBuffer senPatch,
    AppLocalizations? localizations, [
    bool useRawPacket = false,
  ]) {
    final rsbBeforeHead = ResourceStreamBundle.readRSBHead(
      senBefore,
      localizations,
    );
    final rsbPatchHead = readRSBPatchHead(
      senPatch,
      localizations,
    );
    final beforeHeadByte = senBefore.readBytes(rsbBeforeHead["fileOffset"], 0);
    final md5DigestOld = Digest(rsbPatchHead["md5Before"]);
    testHash(
      beforeHeadByte,
      md5DigestOld,
      localizations,
    );
    Uint8List rsbAfterByte;
    if (!rsbPatchHead["rsbNeedPatch"]) {
      rsbAfterByte = beforeHeadByte;
    } else {
      rsbAfterByte = vcDiffDecode(
        beforeHeadByte,
        senPatch.readBytes(rsbPatchHead["rsbHeadSize"]),
      );
    }
    final senWriter = SenBuffer();
    senWriter.writeBytes(rsbAfterByte);
    final rsbAfterHead = ResourceStreamBundle.readRSBHead(
      senWriter,
      localizations,
    );
    if (rsbAfterHead["rsgNumber"] != rsbPatchHead["rsgNumber"]) {
      throw Exception(
        localizations == null
            ? "Invalid RSG index"
            : localizations.invalid_rsg_number,
      );
    }
    final rsbFunc = ResourceStreamBundle();
    final rsbBeforeInfoList = rsbFunc.readRSGInfo(senBefore, rsbBeforeHead);
    final rsbAfterInfoList = rsbFunc.readRSGInfo(senWriter, rsbAfterHead);
    final packetBeforeSubGroupIndexing = <String>[];
    for (var i = 0; i < rsbBeforeInfoList.length; i++) {
      packetBeforeSubGroupIndexing.add(rsbBeforeInfoList[i]["name"]);
    }
    for (var i = 0; i < rsbAfterInfoList.length; i++) {
      final packetAfterName = rsbAfterInfoList[i]["name"];
      Uint8List packetBefore = Uint8List(1);
      Uint8List packetAfter = Uint8List(1);
      final rsbPatchPacketInfo = readSubGroupInfo(senPatch);
      if (packetAfterName != rsbPatchPacketInfo["packetName"]) {
        throw Exception(
          localizations == null
              ? "Invalid Packet Name"
              : localizations.invalid_packet_name,
        );
      }
      if (packetBeforeSubGroupIndexing.contains(packetAfterName)) {
        final packetBeforeSubGroupIndex =
            packetBeforeSubGroupIndexing.indexOf(packetAfterName);
        packetBefore = senBefore.readBytes(
          rsbBeforeInfoList[packetBeforeSubGroupIndex]["rsgLength"],
          rsbBeforeInfoList[packetBeforeSubGroupIndex]["rsgOffset"],
        );
        if (useRawPacket) {
          throw Exception(
            localizations == null
                ? "Raw Packet is not supported"
                : localizations.raw_packet_is_not_supported,
          );
        }
      }
      if (rsbPatchPacketInfo["packetPatchSize"] > 0) {
        packetAfter = vcDiffDecode(
          packetBefore,
          senPatch.readBytes(rsbPatchPacketInfo["packetPatchSize"]),
        );
      } else {
        packetAfter = packetBefore;
      }
      testHash(
        packetAfter,
        Digest(rsbPatchPacketInfo["md5Packet"]),
        localizations,
      );
      senWriter.writeBytes(packetAfter);
    }
    if (rsbPatchHead["rsbAfterSize"] != senWriter.length) {
      throw Exception(
        localizations == null
            ? "This RSB is invalid to use RSB-Patch"
            : localizations.this_rsb_is_invalid,
      );
    }
    return senWriter;
  }

  Uint8List vcDiffDecode(Uint8List before, Uint8List patch) {
    final beforePointer = calloc<Int8>(before.length)
      ..asTypedList(before.length).setAll(0, before);
    final patchPointer = calloc<Int8>(patch.length)
      ..asTypedList(patch.length).setAll(0, patch);
    final sizePointer = calloc<Int32>();
    final vcPointer = VCDiffDecode(
      beforePointer,
      before.length,
      patchPointer,
      patch.length,
      sizePointer,
    );
    final afterData = vcPointer.asTypedList(sizePointer.value);
    calloc.free(beforePointer);
    calloc.free(patchPointer);
    return Uint8List.fromList(afterData);
  }

  dynamic readRSBPatchHead(
    SenBuffer senFile,
    AppLocalizations? localizations,
  ) {
    final magic = senFile.readString(4);
    if (magic != "PBSR") {
      throw Exception(
        localizations == null
            ? "Invalid Diff Patch file"
            : localizations.invalid_patch_file,
      );
    }
    if (senFile.readUInt32LE() != 1 || senFile.readUInt32LE() != 2) {
      throw Exception(
        localizations == null
            ? "Invalid Diff Patch file"
            : localizations.invalid_patch_file,
      );
    }
    return {
      "rsbAfterSize": senFile.readInt32LE(0xC),
      "rsbHeadSize": senFile.readInt32LE(0x14),
      "md5Before": senFile.readBytes(16),
      "rsgNumber": senFile.readInt32LE(),
      "rsbNeedPatch": senFile.readInt32LE() == 1,
    };
  }

  dynamic readSubGroupInfo(SenBuffer senFile) {
    final startOffset = senFile.readOffset;
    return {
      "packetPatchSize": senFile.readInt32LE(startOffset + 4),
      "packetName": senFile.readStringByEmpty(),
      "md5Packet": senFile.readBytes(16, startOffset + 136),
    };
  }
}
