// ignore_for_file: unused_import, unused_local_variable

import "package:path/path.dart" as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

class PackModding {
  static void process(String inputDirectory) {
    final dynamic manifest = FileSystem.readJson(
      p.join(inputDirectory, "manifest.json"),
    );
    return;
  }
}
