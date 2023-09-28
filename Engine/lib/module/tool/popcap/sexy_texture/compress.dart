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
    final destinationBLock = calloc<Uint64>(width * height ~/ 16);
    EncodeETC1Fast(
        sourceBlock, destinationBLock, (width * height ~/ 16), width);
    final data = destinationBLock.asTypedList(destinationBLock.value);
    final imgFile = SenBuffer();
    for (var i = 0; i < data.length; i++) {
      imgFile.writeBigUInt64BE(data[i]);
    }
    return imgFile;
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

  static dynamic decodeETC1Block(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 4);
    for (var y = 0; y < height; y += 4) {
      for (var x = 0; x < width; x += 4) {
        final temp = senFile.readBigUInt64BE();
        final colorBuffer = image.Image(width: 4, height: 4, numChannels: 4);
        decodeETC1(temp, colorBuffer);
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
            if ((y + i) < height && (x + j) < width) {
              final color = colorBuffer.getPixel(j, i);
              print((x + j) * width | y + i);
              imageData.setPixel(x + j, y + i, color);
            }
          }
        }
      }
    }
    return imageData;
  }

  static dynamic decodeETC1(int temp, dynamic result) {
    final diffBit = ((temp >> 33) & 1) == 1;
    final flipBit = ((temp >> 32) & 1) == 1;
    var r1, r2, g1, g2, b1, b2;
    if (diffBit) {
      var r = (temp >> 59) & 0x1F;
      var g = (temp >> 51) & 0x1F;
      var b = (temp >> 43) & 0x1F;
      r1 = (r << 3) | ((r & 0x1C) >> 2);
      g1 = (g << 3) | ((g & 0x1C) >> 2);
      b1 = (b << 3) | ((b & 0x1C) >> 2);
      r += ((temp >> 56) & 0x7) << 29 >> 29;
      g += ((temp >> 48) & 0x7) << 29 >> 29;
      b += ((temp >> 40) & 0x7) << 29 >> 29;
      r2 = (r << 3) | ((r & 0x1C) >> 2);
      g2 = (g << 3) | ((g & 0x1C) >> 2);
      b2 = (b << 3) | ((b & 0x1C) >> 2);
    } else {
      r1 = ((temp >> 60) & 0xF) * 0x11;
      g1 = ((temp >> 52) & 0xF) * 0x11;
      b1 = ((temp >> 44) & 0xF) * 0x11;
      r2 = ((temp >> 56) & 0xF) * 0x11;
      g2 = ((temp >> 48) & 0xF) * 0x11;
      b2 = ((temp >> 40) & 0xF) * 0x11;
    }
    final table1 = ((temp >> 37) & 0x7);
    final table2 = ((temp >> 34) & 0x7);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        final val = ((temp >> ((j << 2) | i)) & 0x1);
        final neg = ((temp >> (((j << 2) | i) + 16)) & 0x1) == 1;
        if ((flipBit && i < 2) || (!flipBit && j < 2)) {
          final add = etc1Modifiters[table1][val] * (neg ? -1 : 1);
          final color = image.ColorUint8.rgba(colorClamp(r1 + add),
              colorClamp(g1 + add), colorClamp(b1 + add), 255);
          result.setPixel(j, i, color);
        } else {
          final add = etc1Modifiters[table2][val] * (neg ? -1 : 1);
          final color = image.ColorUint8.rgba(colorClamp(r2 + add),
              colorClamp(g2 + add), colorClamp(b2 + add), 255);
          result.setPixel(j, i, color);
        }
      }
    }
    return;
  }

  static int colorClamp(int color) {
    if (color > 255) return 255;
    if (color < 0) return 0;
    return color;
  }
}
