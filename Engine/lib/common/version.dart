// ignore_for_file: unused_import

import 'dart:io';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

class Engine {
  static const int engineVersion = 1;

  // ignore: non_constant_identifier_names
  static int Internal = -1;

  static String version = '1.0.0';

  // ignore: non_constant_identifier_names
  static void cast_internal_executor() {
    try {
      if (Platform.isAndroid || Platform.isWindows) {
        Engine.Internal = internalVersion();
      } else {
        if (FileSystem.fileExists(internal)) {
          Engine.Internal = internalVersion();
        }
      }
    } catch (e) {
      Engine.Internal = -1;
    }
    return;
  }
}
