import 'package:sen_material_design/module/utility/buffer/common.dart';
import "common.dart";
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as path;

class Unpack {
  static void process(String inFile, String outFolder) {
    final senFile = new SenBuffer.OpenFile(inFile);
    process_package(senFile, outFolder);
    return;
  }

  static void process_package(SenBuffer senFile, String outFolder) {
    final rsg = ResourceStreamGroup();
    final packet = rsg.unpackRSG(senFile, outFolder);
    FileSystem.writeJson(path.join(outFolder, "packet.json"), packet, "\t");
    return;
  }
}
