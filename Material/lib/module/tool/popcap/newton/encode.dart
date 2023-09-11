import 'package:sen_material_design/module/tool/popcap/newton/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

void encodeNewton(
  String inFile,
  String outFile,
) {
  var newton = Newton();
  var raw = newton.encode(
    FileSystem.readJson(
      inFile,
    ),
  );
  raw.outFile(
    outFile,
  );
  return;
}
