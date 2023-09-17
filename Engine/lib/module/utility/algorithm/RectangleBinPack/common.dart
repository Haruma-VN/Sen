// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';

class RectangleBox {
  int padding;
  int width;
  int height;
  RectangleBox(
    this.width,
    this.height,
    this.padding,
  );
}

class RectangleSprite {
  int width;

  int height;

  int x;

  int y;

  int imageIndex = 0;

  bool hasOversized = false;

  String id;

  int infoX;

  int infoY;

  int cols;

  int rows;

  List<String> path;

  late int pathSize;

  RectangleSprite(
    this.width,
    this.height,
    this.x,
    this.y,
    this.id,
    this.infoX,
    this.infoY,
    this.cols,
    this.rows,
    this.path,
  ) {
    pathSize = path.length;
  }

  RectangleSprite.append(
    this.width,
    this.height,
    this.x,
    this.y,
    this.id,
    this.infoX,
    this.infoY,
    this.cols,
    this.rows,
    this.path,
    this.imageIndex,
    this.hasOversized,
    this.pathSize,
  );
}

class RectangleBinPack {
  static List<RectangleSprite> process(
    RectangleBox box,
    List<RectangleSprite> sprite,
  ) {
    List<RectangleSprite> result = [];
    final int size = sprite.length;
    final Pointer<Sprite> spritePointer = calloc<Sprite>(size);
    for (var i = 0; i < size; i++) {
      var pathSize = sprite[i].path.length;
      Pointer<Pointer<Utf8>> path = calloc<Pointer<Utf8>>(pathSize);
      for (var j = 0; j < pathSize; ++j) {
        path[j] = sprite[i].path[j].toNativeUtf8();
      }
      spritePointer[i]
        ..x = sprite[i].x
        ..y = sprite[i].y
        ..hasOversized = sprite[i].hasOversized
        ..imageIndex = sprite[i].imageIndex
        ..width = sprite[i].width
        ..height = sprite[i].height
        ..id = sprite[i].id.toNativeUtf8()
        ..infoX = sprite[i].infoX
        ..infoY = sprite[i].infoY
        ..cols = sprite[i].cols
        ..path = path
        ..pathSize = pathSize
        ..rows = sprite[i].rows;
    }
    final Pointer<Box> boxPointer = calloc<Box>();
    boxPointer.ref
      ..width = box.width
      ..height = box.height
      ..padding = box.padding;
    var resultPtr = packAtlas(
      spritePointer,
      size,
      boxPointer,
    );
    for (var i = 0; i < size; ++i) {
      var current = resultPtr[i];
      List<String> actual_path = [];
      for (var j = 0; j < current.pathSize; ++j) {
        actual_path.add(
          resultPtr[i].path[j].toDartString(),
        );
      }
      result.add(
        RectangleSprite.append(
          current.width,
          current.height,
          current.x,
          current.y,
          current.id.toDartString(),
          current.infoX,
          current.infoY,
          current.cols,
          current.rows,
          actual_path,
          current.imageIndex,
          current.hasOversized,
          actual_path.length,
        ),
      );
    }
    calloc.free(
      spritePointer,
    );
    calloc.free(
      boxPointer,
    );
    calloc.free(
      resultPtr,
    );
    return result;
  }

  /// Example

  // var result = RectangleBinPack.process(RectangleBox(4096, 4096, 1), [
  //   RectangleSprite(8192, 1029, -1, -1, 'a.png', 0, 0, 1, 1, ['s', 's', 'cx']),
  //   RectangleSprite(13, 23, -1, -1, 'b.png', 0, 0, 1, 1, ['cx', 'bs', 'ss']),
  //   RectangleSprite(43, 23, -1, -1, 'c.png', 0, 0, 1, 1, ['9s', '7s', '0k']),
  // ]);
  // for (var i = 0; i < result.length; i++) {
  //   var current = result[i];
  //   debugPrint(
  //     'x: ${current.x}, y: ${current.y}, width: ${current.width}, height: ${current.height}, imageIndex: ${current.imageIndex}, hasOverSize: ${current.hasOversized}, id: ${current.id}, infoX: ${current.infoX}, infoY: ${current.infoY}, cols: ${current.cols}, rows: ${current.rows}, path: ${current.path.join('/')}',
  //   );
  // }
}
