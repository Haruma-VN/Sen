import 'package:sen_material_design/module/utility/algorithm/RectangleBinPack/common.dart';
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

  static List<List<RectangleSprite>> extract(
    List<RectangleSprite> data,
    String? error,
  ) {
    Map<int, List<RectangleSprite>> groupedData = {};
    List<List<RectangleSprite>> result = [];
    for (var item in data) {
      if (!groupedData.containsKey(item.imageIndex)) {
        groupedData[item.imageIndex] = [];
      }
      groupedData[item.imageIndex]!.add(item);
    }
    final list = groupedData.keys.toList();
    for (var element in list) {
      groupedData[element]?.forEach((element) {
        if (element.hasOversized) {
          throw Exception(
            '$error: ${element.width} & ${element.height}',
          );
        }
      });
      result.add(groupedData[element]!);
    }
    return result;
  }
}
