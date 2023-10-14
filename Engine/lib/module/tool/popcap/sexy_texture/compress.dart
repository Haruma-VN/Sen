// ignore_for_file: unused_import, depend_on_referenced_packages

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:image/image.dart' as image;
import "package:path/path.dart" as path;

class TextureCompress {
  static SenBuffer encodeETC1Block(image.Image img, int width, int height) {
    final uintArray = Uint32List(width * height);
    var index = 0;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final pixel = img.getPixel(x, y);
        uintArray[index++] = (pixel.a.toInt() << 24 |
            pixel.r.toInt() << 16 |
            pixel.g.toInt() << 8 |
            pixel.b.toInt());
      }
    }
    final sourceBlock = calloc<Uint32>(uintArray.length)
      ..asTypedList(uintArray.length).setAll(0, uintArray);
    final currentSize = width * height ~/ 16;
    final destinationBLock = calloc<Uint64>(currentSize);
    CompressEtc1Rgb(
      sourceBlock,
      destinationBLock,
      (currentSize),
      width,
    );
    final data = destinationBLock.asTypedList(currentSize);
    final imgFile = SenBuffer();
    for (var i = 0; i < data.length; i++) {
      imgFile.writeBigUInt64LE(data[i]);
    }
    calloc.free(sourceBlock);
    calloc.free(destinationBLock);
    return imgFile;
  }

  static Uint8List decodeETC1(SenBuffer senFile, int width, int height) {
    Pointer<Uint8> dataPtr = calloc.allocate(senFile.length);
    dataPtr.asTypedList(senFile.length).setAll(0, senFile.toBytes());
    Pointer<Uint8> resultPtr =
        DecodeETC1Block(dataPtr, senFile.length, width, height);
    return Uint8List.fromList(resultPtr.asTypedList(width * height * 4));
  }

  static final etc1Modifiters = [
    [2, 8],
    [5, 17],
    [9, 29],
    [13, 42],
    [18, 60],
    [24, 80],
    [33, 106],
    [47, 183],
  ];

  static int colorClamp(int color) {
    if (color > 255) return 255;
    if (color < 0) return 0;
    return color;
  }
}
