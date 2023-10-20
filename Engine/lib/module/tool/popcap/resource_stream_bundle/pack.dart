// ignore_for_file: unused_import, non_constant_identifier_names

import 'package:sen_material_design/module/utility/buffer/common.dart';
import "common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as path;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Pack {
  static void process(
    String inFolder,
    String outFile,
    AppLocalizations? localizations,
  ) {
    process_package(inFolder, outFile, localizations);
    return;
  }

  static void process_package(
    String inFolder,
    String outFile,
    AppLocalizations? localizations,
  ) {
    final rsb = ResourceStreamBundle();
    final manifest = FileSystem.readJson(path.join(inFolder, "manifest.json"));
    rsb.packRSB(inFolder, outFile, manifest, localizations);
    return;
  }
}
