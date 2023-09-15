import 'package:image/image.dart';
import 'dart:io';
import 'dart:async';
import 'package:sen_material_design/module/utility/io/common.dart';

/// Document : https://github.com/brendan-duncan/image/blob/main/doc/README.md

class ImageIO {
  /// Provide [filepath] to read and obtain dimension
  /// Return : Image Dimension + file path
  ///

  static DimensionExpand getDimension(
    String filepath,
  ) {
    final file = File(filepath);
    final bytes = file.readAsBytesSync();
    final image = decodeImage(bytes)!;
    return DimensionExpand(image.width, image.height, filepath);
  }

  static void saveImage(
    String filepath,
    Image data,
  ) {
    FileSystem.writeBuffer(filepath, encodePng(data));
    return;
  }

  static Future<void> saveImageAsync(
    String filepath,
    Image data,
  ) async {
    await FileSystem.writeBufferAsync(filepath, encodePng(data));
    return;
  }

  static void resizeImage(
    String sourceFile,
    DimensionExpand newDimension,
    String newFile,
  ) {
    final file = File(
      sourceFile,
    );
    final bytes = file.readAsBytesSync();
    final image = decodeImage(
      bytes,
    )!;
    final result = copyResize(
      image,
      width: newDimension.width,
      height: newDimension.height,
    );
    saveImage(
      newFile,
      result,
    );
    return;
  }

  static Future<void> resizeImageAsync(
    String sourceFile,
    DimensionExpand newDimension,
    String newFile,
  ) async {
    final file = File(
      sourceFile,
    );
    final bytes = file.readAsBytesSync();
    final image = decodeImage(
      bytes,
    )!;
    final result = copyResize(
      image,
      width: newDimension.width,
      height: newDimension.height,
    );
    await saveImageAsync(
      newFile,
      result,
    );
    return;
  }

  static Image readImage(
    String filepath,
  ) =>
      decodeImage(
        FileSystem.readBuffer(
          filepath,
        ),
      )!;

  static void cropImage(
    String originalFile,
    int x,
    int y,
    int width,
    int height,
    String outputFile,
  ) {
    Image original = readImage(
      originalFile,
    );
    final destination = copyCrop(
      original,
      x: x,
      y: y,
      width: width,
      height: height,
    );
    saveImage(
      outputFile,
      destination,
    );
    return;
  }

  static Future<void> cropImageAsync(
    String originalFile,
    int x,
    int y,
    int width,
    int height,
    String outputFile,
  ) async {
    Image original = readImage(
      originalFile,
    );
    final destination = copyCrop(
      original,
      x: x,
      y: y,
      width: width,
      height: height,
    );
    await saveImageAsync(
      originalFile,
      destination,
    );
    return;
  }

  static void joinImage(
    List<ImageChild> list,
    DimensionExpand outputData,
  ) {
    var outputFile = Image(
      width: outputData.width,
      height: outputData.height,
      numChannels: 4,
    );
    for (var element in list) {
      final src = readImage(
        element.filepath,
      );
      compositeImage(
        outputFile,
        src,
        dstX: element.x,
        dstY: element.y,
        dstW: element.width,
        dstH: element.height,
      );
    }
    saveImage(
      outputData.filepath,
      outputFile,
    );
    return;
  }
}

class Dimension {
  int width;
  int height;
  Dimension(
    this.width,
    this.height,
  );
}

class DimensionExpand extends Dimension {
  String filepath;
  DimensionExpand(
    super.width,
    super.height,
    this.filepath,
  );
}

class ImageChild extends DimensionExpand {
  int x;
  int y;
  ImageChild(
    super.width,
    super.height,
    super.filepath,
    this.x,
    this.y,
  );
}
