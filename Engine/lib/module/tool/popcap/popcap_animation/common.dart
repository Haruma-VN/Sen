// ignore_for_file: unused_import, depend_on_referenced_packages

import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "package:path/path.dart" as path;
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:convert/convert.dart";
import "dart:math";

class PopCapAnimation {
  final frameFlags = <String, int>{
    "removes": 1,
    "adds": 2,
    "moves": 4,
    "frameName": 8,
    "stop": 16,
    "commands": 32,
  };

  final moveFlags = <String, int>{
    "srcRect": 32768,
    "rotate": 16384,
    "color": 8192,
    "matrix": 4096,
    "longCoords": 2048,
    "animFrameNum": 1024,
  };

  dynamic decodeAnimation(SenBuffer senFile) {
    final magic = senFile.readUInt32LE();
    if (magic != 0xBAF01954) {
      throw Exception("invaild_animation_magic");
    }
    final version = senFile.readUInt32LE();
    if (version > 6 || version < 1) {
      throw Exception("invaild_animation_version");
    }
    final frameRate = senFile.readUInt8();
    final position = <double>[0, 0];
    for (var i = 0; i < 2; i++) {
      position[i] = senFile.readUInt16LE() / 20;
    }
    final size = <double>[0, 0];
    for (var i = 0; i < 2; i++) {
      size[i] = senFile.readUInt16LE() / 20;
    }
    final imageCount = senFile.readUInt16LE();
    final imageList = [];
    for (var i = 0; i < imageCount; i++) {
      imageList.add(readImageInfo(senFile, version));
    }
    final spritesCount = senFile.readUInt16LE();
    final spriteList = [];
    for (var i = 0; i < spritesCount; i++) {
      spriteList.add(readSpriteInfo(senFile, version));
      if (version < 4) {
        spriteList[i]["frame_rate"] = frameRate;
      }
    }
    var mainSprite = {};
    if (version <= 3 || senFile.readBool()) {
      mainSprite = readSpriteInfo(senFile, version);
      if (version < 4) {
        mainSprite["frame_rate"] = frameRate;
      }
    }
    return {
      "version": version,
      "frame_rate": frameRate,
      "position": position,
      "size": size,
      "image": imageList,
      "sprite": spriteList,
      "main_sprite": mainSprite,
    };
  }

  dynamic readImageInfo(SenBuffer senFile, int version) {
    final name = senFile.readStringByInt16LE();
    final size = <int>[0, 0];
    if (version >= 4) {
      for (var i = 0; i < 2; i++) {
        size[i] = senFile.readUInt16LE();
      }
    } else {
      for (var i = 0; i < 2; i++) {
        size[i] = -1;
      }
    }
    final transform = <double>[0, 0, 0, 0, 0, 0];
    if (version == 1) {
      final dec = senFile.readUInt16LE() / 1000;
      transform[0] = cos(dec);
      transform[2] = -sin(dec);
      transform[1] = sin(dec);
      transform[3] = cos(dec);
      transform[4] = senFile.readInt16LE() / 20;
      transform[5] = senFile.readInt16LE() / 20;
    } else {
      transform[0] = senFile.readInt32LE() / 1310720;
      transform[2] = senFile.readInt32LE() / 1310720;
      transform[1] = senFile.readInt32LE() / 1310720;
      transform[3] = senFile.readInt32LE() / 1310720;
      transform[4] = senFile.readInt16LE() / 20;
      transform[5] = senFile.readInt16LE() / 20;
    }
    return {"name": name, "size": size, "transform": transform};
  }

  dynamic readSpriteInfo(SenBuffer senFile, int version) {
    // ignore: cast_from_null_always_fails
    final spriteInfo = {"name": "", "description": "", "frame_rate": -1};
    if (version >= 4) {
      spriteInfo["name"] = senFile.readStringByInt16LE();
      if (version >= 6) {
        spriteInfo["description"] = senFile.readStringByInt16LE();
      }
      spriteInfo["frame_rate"] = senFile.readUInt32LE() ~/ 65536;
    }
    final framesCount = senFile.readUInt16LE();
    final workArea = <int>[0, framesCount - 1];
    if (version >= 5) {
      workArea[0] = senFile.readUInt16LE();
      workArea[1] = senFile.readUInt16LE();
    }
    workArea[1] = framesCount;
    spriteInfo["work_area"] = workArea;
    final frame = [];
    for (var i = 0; i < framesCount; i++) {
      frame.add(readFrameInfo(senFile, version));
    }
    spriteInfo["frame"] = frame;
    return spriteInfo;
  }

  dynamic readFrameInfo(SenBuffer senFile, int version) {
    final frameInfo = {
      "label": "",
      "stop": false,
      "command": <String>[],
      "remove": [],
      "append": [],
      "change": [],
    };
    final flags = senFile.readUInt8();
    var count = 0;
    if (flags & frameFlags["removes"]! != 0) {
      count = senFile.readUInt8();
      if (count == 255) {
        count = senFile.readUInt16LE();
      }
      final remove = [];
      for (var i = 0; i < count; i++) {
        remove.add(readRemoves(senFile));
      }
      frameInfo["remove"] = remove;
    }
    if (flags & frameFlags["adds"]! != 0) {
      count = senFile.readUInt8();
      if (count == 255) {
        count = senFile.readUInt16LE();
      }
      final add = [];
      for (var i = 0; i < count; i++) {
        add.add(readAdds(senFile, version));
      }
      frameInfo["append"] = add;
    }
    if (flags & frameFlags["moves"]! != 0) {
      count = senFile.readUInt8();
      if (count == 255) {
        count = senFile.readUInt16LE();
      }
      final move = [];
      for (var i = 0; i < count; i++) {
        move.add(readMoves(senFile));
      }
      frameInfo["change"] = move;
    }
    if (flags & frameFlags["frameName"]! != 0) {
      frameInfo["label"] = senFile.readStringByInt16LE();
    }
    if (flags & frameFlags["stop"]! != 0) {
      frameInfo["stop"] = true;
    }
    if (flags & frameFlags["commands"]! != 0) {
      count = senFile.readUInt8();
      final command = [];
      for (var i = 0; i < count; i++) {
        command.add(readCommand(senFile));
      }
      frameInfo["command"] = command;
    }
    return frameInfo;
  }

  dynamic readRemoves(SenBuffer senFile) {
    var index = senFile.readUInt16LE();
    if (index >= 2047) {
      index = senFile.readUInt32LE();
    }
    return {"index": index};
  }

  dynamic readAdds(SenBuffer senFile, int version) {
    final appendInfo = {};
    final count = senFile.readUInt16LE();
    var index = count & 2047;
    if (index == 2047) {
      index = senFile.readUInt32LE();
    }
    appendInfo["index"] = index;
    final sprite = (count & 32768) != 0;
    final additive = (count & 16384) != 0;
    var resource = senFile.readUInt8();
    if (version >= 6 && resource == 255) {
      resource = senFile.readUInt16LE();
    }
    appendInfo["resource"] = resource;
    var preloadFrame = 0;
    if (count & 8192 != 0) {
      preloadFrame = senFile.readUInt16LE();
    }
    appendInfo["sprite"] = sprite;
    appendInfo["additive"] = additive;
    appendInfo["preload_frame"] = preloadFrame;
    if (count & 4096 != 0) {
      appendInfo["name"] = senFile.readStringByInt16LE();
    }
    var timeScale = 1.0;
    if (count & 2048 != 0) {
      timeScale = senFile.readInt32LE() / 65536;
    }
    appendInfo["time_scale"] = timeScale;
    return appendInfo;
  }

  dynamic readMoves(SenBuffer senFile) {
    final changeInfo = {};
    final count = senFile.readUInt16LE();
    var index = count & 1023;
    if (index == 1023) {
      index = senFile.readUInt32LE();
    }
    changeInfo["index"] = index;
    var transform = <double>[0, 0, 0, 0, 0, 0];
    if (count & moveFlags["matrix"]! != 0) {
      transform[0] = senFile.readInt32LE() / 65536;
      transform[2] = senFile.readInt32LE() / 65536;
      transform[1] = senFile.readInt32LE() / 65536;
      transform[3] = senFile.readInt32LE() / 65536;
    } else if (count & moveFlags["rotate"]! != 0) {
      transform = <double>[0, 0, 0];
      transform[0] = senFile.readInt16LE() / 1000;
    } else {
      transform = <double>[0, 0];
    }
    final tranformLength = transform.length;
    if (count & moveFlags["longCoords"]! != 0) {
      transform[tranformLength - 2] = senFile.readInt32LE() / 20;
      transform[tranformLength - 1] = senFile.readInt32LE() / 20;
    } else {
      transform[tranformLength - 2] = senFile.readInt16LE() / 20;
      transform[tranformLength - 1] = senFile.readInt16LE() / 20;
    }
    changeInfo["transform"] = transform;
    if (count & moveFlags["srcRect"]! != 0) {
      final sourceReact = <int>[0, 0, 0, 0];
      sourceReact[0] = senFile.readInt16LE() ~/ 20;
      sourceReact[1] = senFile.readInt16LE() ~/ 20;
      sourceReact[2] = senFile.readInt16LE() ~/ 20;
      sourceReact[3] = senFile.readInt16LE() ~/ 20;
      changeInfo["source_rectangle"] = sourceReact;
    }
    if (count & moveFlags["color"]! != 0) {
      final color = <int>[0, 0, 0, 0];
      color[0] = senFile.readUInt8() ~/ 255;
      color[1] = senFile.readUInt8() ~/ 255;
      color[2] = senFile.readUInt8() ~/ 255;
      color[3] = senFile.readUInt8() ~/ 255;
      changeInfo["color"] = color;
    }
    var spriteFrameNumber = 0;
    if (count & moveFlags["animFrameNum"]! != 0) {
      spriteFrameNumber = senFile.readUInt16LE();
    }
    changeInfo["sprite_frame_number"] = spriteFrameNumber;
    return changeInfo;
  }

  dynamic readCommand(SenBuffer senFile) {
    final command = <String>[
      senFile.readStringByInt16LE(),
      senFile.readStringByInt16LE(),
    ];
    return command;
  }

  // encode
  SenBuffer encodeAnimation(dynamic jsonFile) {
    final senFile = SenBuffer();
    final version = jsonFile["version"];
    senFile.writeUInt32LE(0xBAF01954);
    senFile.writeUInt32LE(version);
    if (version > 6 || version < 1) {
      throw Exception("invaild_animation_version");
    }
    senFile.writeUInt8(jsonFile["frame_rate"]);
    final position = jsonFile["position"];
    if (position == null || position.length < 2) {
      senFile.writeUInt16LE(0);
      senFile.writeUInt16LE(0);
    } else {
      senFile.writeUInt16LE((position[0] * 20).toInt());
      senFile.writeUInt16LE((position[1] * 20).toInt());
    }
    final size = jsonFile["size"];
    if (size == null || size.length < 2) {
      senFile.writeUInt16LE(-1);
      senFile.writeUInt16LE(-1);
    } else {
      senFile.writeUInt16LE((size[0] * 20).toInt());
      senFile.writeUInt16LE((size[1] * 20).toInt());
    }
    if (jsonFile["image"] == null || jsonFile["image"].length == 0) {
      senFile.writeUInt16LE(0);
    } else {
      final imageCount = jsonFile["image"].length;
      senFile.writeUInt16LE(imageCount);
      for (var i = 0; i < imageCount; i++) {
        writeImageInfo(senFile, version, jsonFile["image"][i]);
      }
    }
    if (jsonFile["sprite"] == null || jsonFile["sprite"].length == 0) {
      senFile.writeUInt16LE(0);
    } else {
      final spriteCount = jsonFile["sprite"].length;
      senFile.writeUInt16LE(spriteCount);
      for (var i = 0; i < spriteCount; i++) {
        writeSpriteInfo(senFile, version, jsonFile["sprite"][i]);
      }
    }
    if (version <= 3) {
      final mainSprite = jsonFile["main_sprite"] ?? {};
      writeSpriteInfo(senFile, version, mainSprite);
    } else {
      if (jsonFile["main_sprite"] == null) {
        senFile.writeBool(false);
      } else {
        senFile.writeBool(true);
        writeSpriteInfo(senFile, version, jsonFile["main_sprite"]);
      }
    }
    return senFile;
  }

  void writeImageInfo(SenBuffer senFile, int version, dynamic imageList) {
    senFile.writeStringBytInt16LE(imageList["name"]);
    if (version >= 4) {
      if (imageList["size"] != null && imageList["size"].length >= 2) {
        for (var i = 0; i < 2; i++) {
          senFile.writeInt16LE(imageList["size"][i]);
        }
      }
    } else {
      for (var i = 0; i < 2; i++) {
        senFile.writeInt16LE(-1);
      }
    }
    if (version == 1) {
      if (imageList["transform"] != null || imageList["transform"].length < 2) {
        senFile.writeInt16LE(0);
        senFile.writeInt16LE(0);
        senFile.writeInt16LE(0);
      } else if (imageList["transform"].length >= 6) {
        var rCos = acos(imageList["transform"][0]);
        if (imageList["transform"][1] * (version == 2 ? -1 : 1) < 0) {
          rCos = -rCos;
        }
        senFile.writeInt16LE(rCos.toInt());
        senFile.writeInt16LE(imageList["transform"][4] * 20);
        senFile.writeInt16LE(imageList["transform"][5] * 20);
      } else if (imageList["transform"].length >= 4) {
        var rCos = acos(imageList["transform"][0]);
        if (imageList["transform"][1] * (version == 2 ? -1 : 1) < 0) {
          rCos = -rCos;
        }
        senFile.writeInt16LE(rCos.toInt());
        senFile.writeInt16LE(0);
        senFile.writeInt16LE(0);
      } else if (imageList["transform"].length >= 2) {
        senFile.writeInt16LE(0);
        senFile.writeInt16LE((imageList["transform"][0] * 20).toInt());
        senFile.writeInt16LE((imageList["transform"][1] * 20).toInt());
      }
    } else {
      if (imageList["transform"] == null || imageList["transform"].length < 2) {
        senFile.writeInt32LE(1310720);
        senFile.writeInt32LE(0);
        senFile.writeInt32LE(0);
        senFile.writeInt32LE(1310720);
        senFile.writeInt16LE(0);
        senFile.writeInt16LE(0);
      } else if (imageList["transform"].length >= 6) {
        senFile.writeInt32LE((imageList["transform"][0] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][2] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][1] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][3] * 1310720).toInt());
        senFile.writeInt16LE((imageList["transform"][4] * 20).toInt());
        senFile.writeInt16LE((imageList["transform"][5] * 20).toInt());
      } else if (imageList["transform"].length >= 4) {
        senFile.writeInt32LE((imageList["transform"][0] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][2] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][1] * 1310720).toInt());
        senFile.writeInt32LE((imageList["transform"][3] * 1310720).toInt());
        senFile.writeInt16LE(0);
        senFile.writeInt16LE(0);
      } else if (imageList["transform"].length >= 2) {
        senFile.writeInt32LE(1310720);
        senFile.writeInt32LE(0);
        senFile.writeInt32LE(0);
        senFile.writeInt32LE(1310720);
        senFile.writeInt16LE((imageList["transform"][0] * 20).toInt());
        senFile.writeInt16LE((imageList["transform"][1] * 20).toInt());
      }
    }
    return;
  }

  void writeSpriteInfo(SenBuffer senFile, int version, dynamic spriteInfo) {
    if (version >= 4) {
      senFile.writeStringBytInt16LE(spriteInfo["name"]);
      if (version >= 6) {
        senFile.writeStringBytInt16LE(spriteInfo["description"]);
      }
      senFile.writeUInt32LE((spriteInfo["frame_rate"] * 65536).toInt());
    }
    final workArea = spriteInfo["work_area"];
    if (version >= 5) {
      if (workArea == null || workArea.length < 2) {
        senFile.writeUInt16LE(1);
        senFile.writeUInt16LE(0);
        senFile.writeUInt16LE(0);
      } else {
        senFile.writeUInt16LE(workArea[1]);
        senFile.writeUInt16LE(workArea[0]);
        senFile.writeUInt16LE(workArea[0] + workArea[1] - 1);
      }
    } else {
      if (workArea == null || workArea.length < 2) {
        senFile.writeUInt16LE(1);
      } else {
        senFile.writeUInt16LE(workArea[1]);
      }
    }
    final frameCount = spriteInfo["frame"].length;
    for (var i = 0; i < frameCount; i++) {
      writeFrameInfo(senFile, version, spriteInfo["frame"][i]);
    }
    return;
  }

  void writeFrameInfo(SenBuffer senFile, int version, dynamic frameInfo) {
    var flags = 0;
    final frameCheck = {
      "removes": false,
      "adds": false,
      "moves": false,
      "frameName": false,
      "stop": false,
      "commands": false,
    };
    if (frameInfo["remove"] != null && frameInfo["remove"].length > 0) {
      flags |= frameFlags["removes"]!;
      frameCheck["removes"] = true;
    }
    if (frameInfo["append"] != null && frameInfo["append"].length > 0) {
      flags |= frameFlags["adds"]!;
      frameCheck["adds"] = true;
    }
    if (frameInfo["change"] != null && frameInfo["change"].length > 0) {
      flags |= frameFlags["moves"]!;
      frameCheck["moves"] = true;
    }
    if (frameInfo["label"] != null) {
      flags |= frameFlags["frameName"]!;
      frameCheck["frameName"] = true;
    }
    if (frameInfo["stop"]) {
      flags |= frameFlags["stop"]!;
      frameCheck["stop"] = true;
    }
    if (frameInfo["command"] != null && frameInfo["command"].length > 0) {
      flags |= frameFlags["commands"]!;
      frameCheck["commands"] = true;
    }
    senFile.writeUInt8(flags);
    var count = 0;
    if (frameCheck["removes"]!) {
      count = frameInfo["remove"].length;
      if (count < 255 && count >= 0) {
        senFile.writeUInt8(count);
      } else {
        senFile.writeUInt8(255);
        senFile.writeUInt16LE(count);
      }
      for (var i = 0; i < count; i++) {
        writeRemove(senFile, frameInfo["remove"][i]["index"]);
      }
    }
    if (frameCheck["adds"]!) {
      count = frameInfo["append"].length;
      if (count < 255 && count > 0) {
        senFile.writeUInt8(count);
      } else {
        senFile.writeUInt8(255);
        senFile.writeUInt16LE(count);
      }
      for (var i = 0; i < count; i++) {
        writeAdds(senFile, version, frameInfo["append"][i]);
      }
    }
    if (frameCheck["moves"]!) {
      count = frameInfo["change"].length;
      if (count < 255 && count > 0) {
        senFile.writeUInt8(count);
      } else {
        senFile.writeUInt8(255);
        senFile.writeUInt16LE(count);
      }
      for (var i = 0; i < count; i++) {
        writeMoveInfo(senFile, version, frameInfo["change"][i]);
      }
    }
    if (frameCheck["frameName"]!) {
      senFile.writeStringBytInt16LE(frameInfo["label"]);
    }
    if (frameCheck["commands"]!) {
      count = frameInfo["command"].length;
      if (count > 255) {
        count = 255;
      }
      senFile.writeUInt8(count);
      for (var i = 0; i < count; i++) {
        writeCommand(senFile, frameInfo["command"][i]);
      }
    }
    return;
  }

  void writeRemove(SenBuffer senFile, int index) {
    if (index >= 2047) {
      senFile.writeUInt16LE(2047);
      senFile.writeUInt32LE(index);
    } else {
      senFile.writeUInt16LE(index);
    }
    return;
  }

  void writeAdds(SenBuffer senFile, int version, dynamic addInfo) {
    senFile.backupWriteOffset();
    senFile.writeOffset += 2;
    var flags = 0;
    final index = addInfo["index"];
    if (index >= 2047 || index < 0) {
      flags |= 2047;
      senFile.writeUInt32LE(index);
    } else {
      flags |= index;
    }
    flags |= addInfo["sprite"] ? 32768 : 0;
    flags |= addInfo["additive"] ? 16384 : 0;
    final resource = addInfo["resource"];
    if (version >= 6) {
      if (resource >= 255 || resource < 0) {
        senFile.writeUInt8(0xFF);
        senFile.writeUInt16LE(resource);
      } else {
        senFile.writeUInt8(resource);
      }
    } else {
      senFile.writeUInt8(resource);
    }
    if (addInfo["preload_frame"] != 0) {
      flags |= 8192;
      senFile.writeUInt16LE(addInfo["preload_frame"]);
    }
    if (addInfo["name"] != null) {
      flags |= 4096;
      senFile.writeStringBytInt16LE(addInfo["name"]);
    }
    if (addInfo["time_scale"] != 1) {
      flags |= 2048;
      senFile.writeInt32LE((addInfo["time_scale"] * 65536).toInt());
    }
    final endPos = senFile.writeOffset;
    senFile.restoreWriteOffset();
    senFile.writeUInt16LE(flags);
    senFile.writeOffset = endPos;
    return;
  }

  void writeMoveInfo(SenBuffer senFile, int version, dynamic moveInfo) {
    senFile.backupWriteOffset();
    senFile.writeOffset += 2;
    var flags = 0;
    final index = moveInfo["index"];
    if (index >= 1023 || index < 0) {
      flags |= 1023;
      senFile.writeUInt32LE(index);
    } else {
      flags |= index;
    }
    var f7 = 0;
    final transform = moveInfo["transform"];
    if (transform.length == 6) {
      f7 |= moveFlags["matrix"]!;
      senFile.writeInt32LE((transform[0] * 65536).toInt());
      senFile.writeInt32LE((transform[2] * 65536).toInt());
      senFile.writeInt32LE((transform[1] * 65536).toInt());
      senFile.writeInt32LE((transform[3] * 65536).toInt());
    } else if (transform.length == 3) {
      f7 |= moveFlags["rotate"]!;
      senFile.writeInt16LE((transform[0] * 1000).toInt());
    }
    final v0 = (transform[transform.length - 2] * 20).toInt();
    final v1 = (transform[transform.length - 1] * 20).toInt();
    if (version >= 5) {
      f7 |= moveFlags["longCoords"]!;
      senFile.writeInt32LE(v0);
      senFile.writeInt32LE(v1);
    } else {
      senFile.writeInt16LE(v0);
      senFile.writeInt16LE(v1);
    }
    final sourceRect = moveInfo["source_rectangle"];
    if (sourceRect != null && sourceRect.length >= 4) {
      f7 |= moveFlags["srcRect"]!;
      senFile.writeInt16LE((sourceRect[0] * 20).toInt());
      senFile.writeInt16LE((sourceRect[1] * 20).toInt());
      senFile.writeInt16LE((sourceRect[2] * 20).toInt());
      senFile.writeInt16LE((sourceRect[3] * 20).toInt());
    }
    final color = moveInfo["color"];
    if (color != null && color.length >= 4) {
      f7 |= moveFlags["color"]!;
      senFile.writeUInt8((color[0] * 255).toInt());
      senFile.writeUInt8((color[1] * 255).toInt());
      senFile.writeUInt8((color[2] * 255).toInt());
      senFile.writeUInt8((color[3] * 255).toInt());
    }
    if (moveInfo["sprite_frame_number"] != 0) {
      f7 |= moveFlags["animFrameNum"]!;
      senFile.writeInt16LE(moveInfo["sprite_frame_number"]);
    }
    flags |= f7;
    final endPos = senFile.writeOffset;
    senFile.restoreWriteOffset();
    senFile.writeUInt16LE(flags);
    senFile.writeOffset = endPos;
    return;
  }

  void writeCommand(SenBuffer senFile, dynamic command) {
    senFile.writeStringBytInt16LE(command[0]);
    senFile.writeStringBytInt16LE(command[1]);
    return;
  }

  static void toJson(
    String inFile,
    String outFile,
  ) {
    final anim = PopCapAnimation();
    final data = anim.decodeAnimation(SenBuffer.OpenFile(inFile));
    FileSystem.writeJson(
      outFile,
      data,
      '\t',
    );
    return;
  }

  static void fromJson(
    String inFile,
    String outFile,
  ) {
    final anim = PopCapAnimation();
    final data = anim.encodeAnimation(FileSystem.readJson(inFile));
    data.outFile(outFile);
    return;
  }
}
