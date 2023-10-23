import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void decodeNewton(
  String inFile,
  String outFile,
  AppLocalizations? localizations,
) {
  var data = SenBuffer.OpenFile(inFile);
  var newton = Newton();
  var raw = newton.decode(data, localizations);
  FileSystem.writeJson(outFile, raw, '\t');
  return;
}
