// ignore_for_file: depend_on_referenced_packages

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

  int imageIndex = -1;

  bool hasOversized = false;

  RectangleSprite(
    this.width,
    this.height,
    this.x,
    this.y,
  );

  RectangleSprite.append(
    this.width,
    this.height,
    this.x,
    this.y,
    this.imageIndex,
    this.hasOversized,
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
      spritePointer[i]
        ..x = sprite[i].x
        ..y = sprite[i].y
        ..hasOversized = sprite[i].hasOversized
        ..imageIndex = sprite[i].imageIndex
        ..width = sprite[i].width
        ..height = sprite[i].height;
    }
    final Pointer<Box> boxPointer = calloc<Box>();
    boxPointer.ref
      ..height = box.height
      ..width = box.width
      ..padding = box.padding;
    var resultPtr = packAtlas(spritePointer, size, boxPointer);
    for (var i = 0; i < size; ++i) {
      var current = resultPtr[i];
      result.add(
        RectangleSprite.append(
          current.width,
          current.height,
          current.x,
          current.y,
          current.imageIndex,
          current.hasOversized,
        ),
      );
    }
    calloc.free(spritePointer);
    calloc.free(boxPointer);
    calloc.free(resultPtr);
    return result;
  }

  /// Example
  ///
  //   var result = RectangleBinPack.process(RectangleBox(4096, 4096, 1), [
  //     RectangleSprite(8192, 1029, -1, -1),
  //     RectangleSprite(13, 23, -1, -1),
  //     RectangleSprite(43, 23, -1, -1),
  //   ]);
  //   for (var i = 0; i < result.length; i++) {
  //     var current = result[i];
  //     debugPrint(
  //       'x: ${current.x}, y: ${current.y}, width: ${current.width}, height: ${current.height}, imageIndex: ${current.imageIndex}, hasOverSize: ${current.hasOversized}',
  //     );
  //   }
}
