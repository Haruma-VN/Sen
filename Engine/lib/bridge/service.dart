import 'package:flutter/services.dart';

class MainActivity {
  static const platform = MethodChannel(
    'com.haruma.sen.gui.flutter_method_channel',
  );

  static Future<String?> pickPath(
    bool typeIsDirectory,
    String? fallbackDirectory,
  ) async {
    try {
      final String? path = await platform.invokeMethod(
        'pickPath',
        <String, dynamic>{
          'typeIsDirectory': typeIsDirectory,
          'fallbackDirectory': fallbackDirectory,
        },
      ) as String?;
      return path;
    } catch (e) {
      return 'false';
    }
  }

  static Future<bool> requestStoragePermission() async {
    try {
      final bool state = await platform.invokeMethod(
        'REQUEST_STORAGE_PERMISSION',
      );
      return state;
    } catch (e) {
      return false;
    }
  }

  static Future<bool> checkStoragePermission() async {
    var result = (await platform
        .invokeMethod('checkStoragePermission', <String, dynamic>{}) as bool);
    return result;
  }
}
