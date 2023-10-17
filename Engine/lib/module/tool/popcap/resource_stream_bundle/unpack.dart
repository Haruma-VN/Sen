// ignore_for_file: non_constant_identifier_names

import 'package:sen_material_design/module/utility/buffer/common.dart';
import "common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as path;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Unpack {
  static void process(
    String inFile,
    String outFolder,
    AppLocalizations? localizations,
  ) {
    final senFile = SenBuffer.OpenFile(inFile);
    process_package(
      senFile,
      outFolder,
      localizations,
    );
    return;
  }

  static void process_package(
    SenBuffer senFile,
    String outFolder,
    AppLocalizations? localizations,
  ) {
    final rsb = ResourceStreamBundle();
    dynamic manifest = rsb.unpackRSB(senFile, outFolder, localizations);
    FileSystem.writeJson(path.join(outFolder, "manifest.json"), manifest, "\t");
    return;
  }
}
