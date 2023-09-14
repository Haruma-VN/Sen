// ignore_for_file: camel_case_types, unused_local_variable, non_constant_identifier_names

import 'package:sen_material_design/module/utility/io/common.dart';
import 'dart:core';

class splitAtlas {
  static final RegExp jsonExpression = RegExp(
    r'\.json$',
    caseSensitive: false,
  );

  static final RegExp pngExpression = RegExp(
    r'\.json$',
    caseSensitive: false,
  );

  static void process(
    dynamic data,
    List<String> imgPath,
  ) {
    return;
  }

  static void process_fs(
    String inDirectory,
    String outDirectory,
  ) {
    final List<String> list = FileSystem.readDirectory(
      inDirectory,
      false,
    );
    final List<String> jsons = list
        .where(
          (
            String element,
          ) =>
              jsonExpression.hasMatch(
            element,
          ),
        )
        .toList();
    final List<String> pngs = list
        .where(
          (
            String element,
          ) =>
              pngExpression.hasMatch(
            element,
          ),
        )
        .toList();
    for (var element in jsons) {
      final dynamic jsonData = FileSystem.readJson(
        element,
      );
      if (jsonData['resources'] != null) {
        process(
          jsonData,
          pngs,
        );
      }
    }
    return;
  }
}
