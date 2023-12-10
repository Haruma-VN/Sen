// ignore_for_file: unused_import, constant_identifier_names, non_constant_identifier_names

import 'dart:typed_data';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/compress/zlib/common.dart';
import 'package:image/image.dart' as image;
import "package:path/path.dart" as path;
import "package:sen_material_design/module/tool/popcap/sexy_texture/compress.dart";

enum TextureFormat {
  argb_8888,
  rgba_8888,
  rgba_4444,
  rgb_565,
  rgba_5551,
  rgba_4444_tiled,
  rgb_565_tiled,
  rgba_5551_tiled,
  rgb_etc1,
  rgb_etc1_a8,
  rgb_etc1_palette,
  rgba_pvrtc_4bpp,
  rgb_pvrtc_4bpp_a8,
}

class SexyTextureFormat {
  TextureFormat format;
  String textureFormat;
  String platform;
  int actualFormat;
  SexyTextureFormat(
    this.format,
    this.textureFormat,
    this.platform,
    this.actualFormat,
  );
}

abstract interface class PopCapSexyTexture {
  SenBuffer decodeARGB8888(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBA8888(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBA4444(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGB565(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBA5551(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBA4444Tiled(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGB565Tiled(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBA5551Tiled(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBETC1(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBETC1A8(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBETC1APalette(SenBuffer senFile, int width, int height);

  SenBuffer decodeRGBAPVRTC4BPP(
    SenBuffer senFile,
    int width,
    int height,
    AppLocalizations? localizations,
  );

  SenBuffer decodeRGBPVRTC4BPPA8(
    SenBuffer senFile,
    int width,
    int height,
    AppLocalizations? localizations,
  );

  SenBuffer encodeARGB8888(SenBuffer senFile);

  SenBuffer encodeRGBA8888(SenBuffer senFile);

  SenBuffer encodeRGBA4444(SenBuffer senFile);

  SenBuffer encodeRGB565(SenBuffer senFile);

  SenBuffer encodeRGBA5551(SenBuffer senFile);

  SenBuffer encodeRGBA4444Tiled(SenBuffer senFile);

  SenBuffer encodeRGB565Tiled(SenBuffer senFile);

  SenBuffer encodeRGBA5551Tiled(SenBuffer senFile);

  SenBuffer encodeRGBETC1(SenBuffer senFile);

  SenBuffer encodeRGBETC1A8(SenBuffer senFile);

  SenBuffer encodeRGBETC1APalette(SenBuffer senFile);

  SenBuffer encodeRGBAPVRTC4BPP(SenBuffer senFile);

  SenBuffer encodeRGBAPVRTC4BPPA8(SenBuffer senFile);
}

class SexyTexture implements PopCapSexyTexture {
  static void decode_fs(
    String inFile,
    String outFile,
    TextureFormat format,
    int width,
    int height,
    AppLocalizations? localizations,
  ) {
    final SenBuffer inStream = SenBuffer.OpenFile(inFile);
    SenBuffer outStream;
    final SexyTexture ptx = SexyTexture();
    switch (format) {
      case TextureFormat.argb_8888:
        {
          outStream = ptx.decodeARGB8888(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_8888:
        {
          outStream = ptx.decodeRGBA8888(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_4444:
        {
          outStream = ptx.decodeRGBA4444(inStream, width, height);
          break;
        }
      case TextureFormat.rgb_565:
        {
          outStream = ptx.decodeRGB565(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_5551:
        {
          outStream = ptx.decodeRGBA5551(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_4444_tiled:
        {
          outStream = ptx.decodeRGBA4444Tiled(inStream, width, height);
          break;
        }
      case TextureFormat.rgb_565_tiled:
        {
          outStream = ptx.decodeRGB565Tiled(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_5551_tiled:
        {
          outStream = ptx.decodeRGBA5551Tiled(inStream, width, height);
          break;
        }
      case TextureFormat.rgb_etc1:
        {
          outStream = ptx.decodeRGBETC1(inStream, width, height);
          break;
        }
      case TextureFormat.rgb_etc1_a8:
        {
          outStream = ptx.decodeRGBETC1A8(inStream, width, height);
          break;
        }
      case TextureFormat.rgb_etc1_palette:
        {
          outStream = ptx.decodeRGBETC1APalette(inStream, width, height);
          break;
        }
      case TextureFormat.rgba_pvrtc_4bpp:
        {
          outStream =
              ptx.decodeRGBAPVRTC4BPP(inStream, width, height, localizations);
          break;
        }
      case TextureFormat.rgb_pvrtc_4bpp_a8:
        {
          outStream =
              ptx.decodeRGBAPVRTC4BPP(inStream, width, height, localizations);
          break;
        }
      default:
        {
          throw Exception(
            localizations != null
                ? localizations.unsupported_texture_format
                : 'Unsupported texture format',
          );
        }
    }
    outStream.outFile(outFile);
    return;
  }

  static void encode_fs(
    String inFile,
    String outFile,
    TextureFormat format,
    AppLocalizations? localizations,
  ) {
    final SenBuffer inStream = SenBuffer.OpenFile(inFile);
    SenBuffer outStream;
    final SexyTexture ptx = SexyTexture();
    switch (format) {
      case TextureFormat.argb_8888:
        {
          outStream = ptx.encodeARGB8888(inStream);
          break;
        }
      case TextureFormat.rgba_8888:
        {
          outStream = ptx.encodeRGBA8888(inStream);
          break;
        }
      case TextureFormat.rgba_4444:
        {
          outStream = ptx.encodeRGBA4444(inStream);
          break;
        }
      case TextureFormat.rgb_565:
        {
          outStream = ptx.encodeRGB565(inStream);
          break;
        }
      case TextureFormat.rgba_5551:
        {
          outStream = ptx.encodeRGBA5551(inStream);
          break;
        }
      case TextureFormat.rgba_4444_tiled:
        {
          outStream = ptx.encodeRGBA4444Tiled(inStream);
          break;
        }
      case TextureFormat.rgb_565_tiled:
        {
          outStream = ptx.encodeRGB565Tiled(inStream);
          break;
        }
      case TextureFormat.rgba_5551_tiled:
        {
          outStream = ptx.encodeRGBA5551Tiled(inStream);
          break;
        }
      case TextureFormat.rgb_etc1:
        {
          outStream = ptx.encodeRGBETC1(inStream);
          break;
        }
      case TextureFormat.rgb_etc1_a8:
        {
          outStream = ptx.encodeRGBETC1A8(inStream);
          break;
        }
      case TextureFormat.rgb_etc1_palette:
        {
          outStream = ptx.encodeRGBETC1APalette(inStream);
          break;
        }
      case TextureFormat.rgba_pvrtc_4bpp:
        {
          outStream = ptx.encodeRGBAPVRTC4BPP(inStream);
          break;
        }
      case TextureFormat.rgb_pvrtc_4bpp_a8:
        {
          outStream = ptx.encodeRGBAPVRTC4BPP(inStream);
          break;
        }
      default:
        {
          throw Exception(
            localizations != null
                ? localizations.unsupported_texture_format
                : 'Unsupported texture format',
          );
        }
    }
    outStream.outFile(outFile);
    return;
  }

  @override
  SenBuffer decodeARGB8888(SenBuffer senFile, int width, int height) {
    final imgRaw = image.Image.fromBytes(
      width: width,
      height: height,
      bytes: senFile.toBytes().buffer,
      numChannels: 4,
      order: image.ChannelOrder.argb,
    );
    senFile.clear();
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBA8888(SenBuffer senFile, int width, int height) {
    final imgRaw = image.Image.fromBytes(
      width: width,
      height: height,
      bytes: senFile.toBytes().buffer,
      numChannels: 4,
      order: image.ChannelOrder.rgba,
    );
    senFile.clear();
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBA4444(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 4);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final tempPixels = senFile.readUInt16LE();
        final r = tempPixels >> 12;
        final g = (tempPixels & 0xF00) >> 8;
        final b = (tempPixels & 0xF0) >> 4;
        final a = tempPixels & 0xF;
        final color = image.ColorRgba8(
          ((r << 4) | r),
          ((g << 4) | g),
          ((b << 4) | b),
          ((a << 4) | a),
        );
        imageData.setPixel(x, y, color);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGB565(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 3);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final tempPixels = senFile.readUInt16LE();
        final r = tempPixels >> 12;
        final g = (tempPixels & 0x7E0) >> 5;
        final b = tempPixels & 0x1F;
        final color = image.ColorRgb8(
          ((r << 3) | (r >> 2)),
          ((g << 2) | (g >> 4)),
          ((b << 3) | (b >> 2)),
        );
        imageData.setPixel(x, y, color);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGBA5551(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 4);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final tempPixels = senFile.readUInt16LE();
        final r = (tempPixels & 0xF800) >> 11;
        final g = (tempPixels & 0x7E0) >> 5;
        final b = (tempPixels & 0x3E) >> 1;
        final color = image.ColorRgba8(
          ((r << 3) | (r >> 2)),
          ((g << 3) | (g >> 2)),
          ((b << 3) | (b >> 2)),
          -(tempPixels & 0x1),
        );
        imageData.setPixel(x, y, color);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGBA4444Tiled(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 4);
    for (var i = 0; i < height; i += 32) {
      for (var w = 0; w < width; w += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            final tempPixels = senFile.readUInt16LE();
            if ((i + j) < height && (w + k) < width) {
              final r = tempPixels >> 12;
              final g = (tempPixels & 0xF00) >> 8;
              final b = (tempPixels & 0xF0) >> 4;
              final a = tempPixels & 0xF;
              final color = image.ColorRgba8(
                ((r << 4) | r),
                ((g << 4) | g),
                ((b << 4) | b),
                ((a << 4) | a),
              );
              imageData.setPixel(w + k, i + j, color);
            }
          }
        }
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGB565Tiled(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 3);
    for (var i = 0; i < height; i += 32) {
      for (var w = 0; w < width; w += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            final tempPixels = senFile.readUInt16LE();
            if ((i + j) < height && (w + k) < width) {
              final r = (tempPixels & 0xF800) >> 8;
              final g = (tempPixels & 0x7E0) >> 3;
              final b = (tempPixels & 0x1F) << 3;
              final color = image.ColorRgb8(r, g, b);
              imageData.setPixel(w + k, i + j, color);
            }
          }
        }
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGBA5551Tiled(SenBuffer senFile, int width, int height) {
    final imageData = image.Image(width: width, height: height, numChannels: 4);
    for (var i = 0; i < height; i += 32) {
      for (var w = 0; w < width; w += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            final tempPixels = senFile.readUInt16LE();
            if ((i + j) < height && (w + k) < width) {
              final r = tempPixels >> 11;
              final g = (tempPixels & 0x7C0) >> 6;
              final b = (tempPixels & 0x3E) >> 1;
              final color = image.ColorRgba8(
                ((r << 3) | (r >> 2)),
                ((g << 3) | (g >> 2)),
                ((b << 3) | (b >> 2)),
                -(tempPixels & 0x1),
              );
              imageData.setPixel(w + k, i + j, color);
            }
          }
        }
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imageData));
    senFile.clear();
    return imgFile;
  }

  @override
  SenBuffer decodeRGBETC1(SenBuffer senFile, int width, int height) {
    final imageData = TextureCompress.decodeETC1(senFile, width, height);
    final imgRaw = image.Image.fromBytes(
      width: width,
      height: height,
      bytes: imageData.buffer,
      numChannels: 3,
      order: image.ChannelOrder.rgb,
    );
    senFile.clear();
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBETC1A8(SenBuffer senFile, int width, int height) {
    final imageData = TextureCompress.decodeETC1(senFile, width, height);
    final imgRaw = image.Image.fromBytes(
      width: width,
      height: height,
      bytes: imageData.buffer,
      numChannels: 4,
      order: image.ChannelOrder.rgba,
    );
    for (var y = 0; y < imgRaw.height; y++) {
      for (var x = 0; x < imgRaw.width; x++) {
        final pixel = imgRaw.getPixel(x, y);
        pixel.a = senFile.readUInt8();
        imgRaw.setPixel(x, y, pixel);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBETC1APalette(SenBuffer senFile, int width, int height) {
    final imageData = TextureCompress.decodeETC1(senFile, width, height);
    final imgRaw = image.Image.fromBytes(
      width: width,
      height: height,
      bytes: imageData.buffer,
      numChannels: 4,
      order: image.ChannelOrder.rgba,
    );
    final num = senFile.readUInt8();
    final indexTable = Uint8List(num == 0 ? 2 : num);
    int bitDepth;
    if (num == 0) {
      indexTable[0] = 0x0;
      indexTable[1] = 0xFF;
      bitDepth = 1;
    } else {
      for (var i = 0; i < num; i++) {
        final pByte = senFile.readUInt8();
        indexTable[i] = (pByte << 4) | pByte;
      }
      var tableSize = 2;
      for (bitDepth = 1; num > tableSize; bitDepth++) {
        tableSize *= 2;
      }
    }
    var bitPos = 0;
    var buffer = 0;
    int readOneBit() {
      if (bitPos == 0) {
        buffer = senFile.readUInt8();
      }
      bitPos = (bitPos + 7) & 7;
      return (buffer >> bitPos) & 1;
    }

    int readBits(int bits) {
      var ans = 0;
      for (var i = bits - 1; i >= 0; i--) {
        ans |= readOneBit() << i;
      }
      return ans;
    }

    for (var y = 0; y < imgRaw.height; y++) {
      for (var x = 0; x < imgRaw.width; x++) {
        final pixel = imgRaw.getPixel(x, y);
        pixel.a = indexTable[readBits(bitDepth)];
        imgRaw.setPixel(x, y, pixel);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBAPVRTC4BPP(
    SenBuffer senFile,
    int width,
    int height,
    AppLocalizations? localizations,
  ) {
    if (width != height) {
      throw Exception(
        localizations == null
            ? "PVRTC can only compress a square image"
            : localizations.pvrtc_can_only_compress_square_dimension,
      );
    }
    final decoder = image.PvrDecoder();
    final imgRaw = decoder.decode(senFile.toBytes());
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw!));
    return imgFile;
  }

  @override
  SenBuffer decodeRGBPVRTC4BPPA8(
    SenBuffer senFile,
    int width,
    int height,
    AppLocalizations? localizations,
  ) {
    if (width != height) {
      throw Exception(
        localizations == null
            ? "PVRTC can only compress a square image"
            : localizations.pvrtc_can_only_compress_square_dimension,
      );
    }
    final decoder = image.PvrDecoder();
    final imgRaw = decoder.decode(senFile.readBytes(width * height ~/ 2))!;
    for (var y = 0; y < imgRaw.height; y++) {
      for (var x = 0; x < imgRaw.width; x++) {
        final pixel = imgRaw.getPixel(x, y);
        pixel.a = senFile.readUInt8();
        imgRaw.setPixel(x, y, pixel);
      }
    }
    final imgFile = SenBuffer.fromBytes(image.encodePng(imgRaw));
    return imgFile;
  }

  @override
  SenBuffer encodeARGB8888(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    img.remapChannels(image.ChannelOrder.bgra);
    final imgRaw = img.buffer.asUint8List();
    return SenBuffer.fromBytes(imgRaw);
  }

  @override
  SenBuffer encodeRGBA8888(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final imgRaw = img.buffer.asUint8List();
    return SenBuffer.fromBytes(imgRaw);
  }

  @override
  SenBuffer encodeRGBA4444(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final pixel = img.getPixel(x, y);
        final color = (pixel.a.toInt() >> 4 |
            (pixel.b.toInt() & 0xF0) |
            ((pixel.g.toInt() & 0xF0) << 4) |
            ((pixel.r.toInt() & 0xF0) << 8));
        imgFile.writeUInt16LE(color);
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGB565(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final pixel = img.getPixel(x, y);
        final color = (pixel.b.toInt() >> 3 |
            ((pixel.g.toInt() & 0xFC) << 3) |
            ((pixel.r.toInt() & 0xF8) << 8));
        imgFile.writeUInt16LE(color);
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBA5551(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final pixel = img.getPixel(x, y);
        final color = (((pixel.a.toInt() & 0x80) >> 7) |
            ((pixel.b.toInt() & 0xF8) >> 2) |
            ((pixel.g.toInt() & 0xF8) << 3) |
            ((pixel.r.toInt() & 0xF8) << 8));
        imgFile.writeUInt16LE(color);
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBA4444Tiled(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y += 32) {
      for (var x = 0; x < width; x += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            if ((y + j) < height && (x + k) < width) {
              final pixel = img.getPixel(x + k, y + j);
              final color = (pixel.a.toInt() >> 4 |
                  pixel.b.toInt() & 0xF0 |
                  ((pixel.g.toInt() & 0xF0) << 4) |
                  ((pixel.r.toInt() & 0xF0) << 8));
              imgFile.writeUInt16LE(color);
            } else {
              imgFile.writeUInt16LE(0);
            }
          }
        }
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGB565Tiled(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y += 32) {
      for (var x = 0; x < width; x += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            if ((y + j) < height && (x + k) < width) {
              final pixel = img.getPixel(x + k, y + j);
              final color = ((pixel.b.toInt() & 0xF8 >> 3) |
                  ((pixel.g.toInt() & 0xFC) << 3) |
                  ((pixel.r.toInt() & 0xF8) << 8));
              imgFile.writeUInt16LE(color);
            } else {
              imgFile.writeUInt16LE(0);
            }
          }
        }
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBA5551Tiled(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = SenBuffer();
    for (var y = 0; y < height; y += 32) {
      for (var x = 0; x < width; x += 32) {
        for (var j = 0; j < 32; j++) {
          for (var k = 0; k < 32; k++) {
            if ((y + j) < height && (x + k) < width) {
              final pixel = img.getPixel(x + k, y + j);
              final color = (((pixel.a.toInt() & 0x80) >> 7) |
                  (pixel.b.toInt() & 0xF8 >> 2) |
                  ((pixel.g.toInt() & 0xF8) << 3) |
                  ((pixel.r.toInt() & 0xF8) << 8));
              imgFile.writeUInt16LE(color);
            } else {
              imgFile.writeUInt16LE(0);
            }
          }
        }
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBETC1(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = TextureCompress.encodeETC1Block(img, width, height);
    return imgFile;
  }

  @override
  SenBuffer encodeRGBETC1A8(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = TextureCompress.encodeETC1Block(img, width, height);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        imgFile.writeUInt8(img.getPixel(x, y).a.toInt());
      }
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBETC1APalette(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final width = img.width;
    final height = img.height;
    final imgFile = TextureCompress.encodeETC1Block(img, width, height);
    imgFile.writeUInt8(0x10);
    for (var i = 0; i < 16; i++) {
      imgFile.writeUInt8(i);
    }
    for (var y = 0; y < height / 2; y++) {
      for (var x = 0; x < width / 2; x++) {
        final color = img.getPixel(x << 1, y << 1).r.toInt() & 0xF0 |
            img.getPixel(x << 1 | 1, y << 1 | 1).r.toInt() >> 4;
        imgFile.writeUInt8(color);
      }
    }
    if ((width * height) & 1 == 1) {
      imgFile
          .writeUInt8(img.getPixel(width ~/ 2, height ~/ 2).r.toInt() & 0xF0);
    }
    return imgFile;
  }

  @override
  SenBuffer encodeRGBAPVRTC4BPP(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final encoder = image.PvrEncoder();
    final data = encoder.encodeRgba4bpp(img);
    final imgFile = SenBuffer.fromBytes(data);
    return imgFile;
  }

  @override
  SenBuffer encodeRGBAPVRTC4BPPA8(SenBuffer senFile) {
    final img = image.decodePng(senFile.toBytes())!;
    final encoder = image.PvrEncoder();
    final data = encoder.encodeRgba4bpp(img);
    final imgFile = SenBuffer.fromBytes(data);
    for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
        imgFile.writeUInt8(img.getPixel(x, y).a.toInt());
      }
    }
    return imgFile;
  }
}
