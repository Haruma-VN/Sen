import 'package:sen_material_design/components/page/console.dart';
import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void encodeNewton(
  String inFile,
  String outFile,
  ConsoleState? console,
  AppLocalizations? localizations,
) {
  if (console != null) {
    console.reset();
  }
  try {
    var newton = Newton();
    if (console != null) {
      console.sendRequest(
        localizations != null
            ? localizations.popcap_newton_encode
            : "PopCap Newton: Encode",
        inFile,
        outFile,
      );
    }
    var raw = newton.encode(
      FileSystem.readJson(
        inFile,
      ),
      localizations,
    );
    raw.outFile(
      outFile,
    );
    if (console != null) {
      console.done();
    }
  } catch (e, s) {
    if (console != null) {
      console.error(e, s);
      rethrow;
    }
  }
  return;
}
