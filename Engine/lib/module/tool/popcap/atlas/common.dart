import 'package:sen_material_design/module/utility/image/common.dart';
import 'dart:math';
import 'package:sen_material_design/module/utility/math/common.dart';

/// Implement 2D Packing algorithm

class Texture2DAlgorithm {
  static Dimension reduceTrim(
    List<dynamic> datas,
  ) {
    var maxWidth = 0;
    var maxHeight = 0;

    for (var rect in datas) {
      maxWidth = max(
        maxWidth,
        rect['x'] + rect['width'],
      );
      maxHeight = max(
        maxHeight,
        rect['y'] + rect['height'],
      );
    }

    return Dimension(
      maxWidth,
      maxHeight,
    );
  }

  static Dimension squareTrim(
    List<dynamic> datas,
  ) {
    var maxWidth = 0;
    var maxHeight = 0;

    for (var rect in datas) {
      maxWidth = max(
        maxWidth,
        rect['x'] + rect['width'],
      );
      maxHeight = max(
        maxHeight,
        rect['y'] + rect['height'],
      );
    }

    return Dimension(
      Math.create2nSquareRoot(
        maxWidth,
      ).toInt(),
      Math.create2nSquareRoot(
        maxHeight,
      ).toInt(),
    );
  }
}
