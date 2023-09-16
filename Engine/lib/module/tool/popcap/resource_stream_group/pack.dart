// ignore_for_file: unused_import

import 'package:sen_material_design/module/utility/buffer/common.dart';
import "common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as path;

class Pack {
  static void process(String inFolder, String outFile,
      [bool useResFolder = true]) {
    final packet = FileSystem.readJson(path.join(inFolder, "packet.json"));
    process_package(inFolder, outFile, packet, useResFolder);
    return;
  }

  static void process_package(
      String inFolder, String outFile, dynamic packet, bool useResFolder) {
    final rsg = ResourceStreamGroup();
    final senFile = rsg.packRSG(inFolder, packet, useResFolder);
    senFile.outFile(outFile);
    return;
  }
}
