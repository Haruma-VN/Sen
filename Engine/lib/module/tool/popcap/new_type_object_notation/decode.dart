import 'package:sen_material_design/components/page/console.dart';
import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void decodeNewton(
  String inFile,
  String outFile,
  ConsoleState? console,
  AppLocalizations? localizations,
) {
  if (console != null) {
    console.reset();
  }
  try {
    if (console != null) {
      console.sendRequest(
        localizations != null
            ? localizations.popcap_newton_decode
            : "PopCap Newton: Decode",
        inFile,
        outFile,
      );
    }
    var data = SenBuffer.OpenFile(inFile);
    var newton = Newton();
    var raw = newton.decode(data, localizations);
    FileSystem.writeJson(outFile, raw, '\t');
    if (console != null) {
      console.done();
    }
  } catch (e, s) {
    if (console != null) {
      console.error(e, s);
      rethrow;
    }
    rethrow;
  }
  return;
}
