import 'package:sen_material_design/bridge/executor.dart';

class Engine {
  static const int engineVersion = 1;

  static int internal = -1;

  static String version = '1.0.0';

  // ignore: non_constant_identifier_names
  static void cast_internal_executor() {
    try {
      Engine.internal = internalVersion();
    } catch (e) {
      Engine.internal = -1;
    }
    return;
  }
}
