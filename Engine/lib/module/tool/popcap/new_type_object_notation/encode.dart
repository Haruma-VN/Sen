import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void encodeNewton(
  String inFile,
  String outFile,
  AppLocalizations? localizations,
) {
  var newton = Newton();
  var raw = newton.encode(
    FileSystem.readJson(
      inFile,
    ),
    localizations,
  );
  raw.outFile(
    outFile,
  );
  return;
}
