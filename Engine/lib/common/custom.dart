import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;

class Customization {
  // ignore: non_constant_identifier_names
  ThemeMode theme_data;

  Customization(this.theme_data);

  Customization.init()
      : this(
          ThemeMode.system,
        );

  // ignore: non_constant_identifier_names
  Future<String> getLocalData() async {
    if (Platform.isAndroid) {
      return '/storage/emulated/0/Android/data/com.haruma.sen.gui/interface/user.json';
    }
    var directory = await getApplicationDocumentsDirectory();
    final path = directory.path;
    return p.join(path, 'SenGUI', 'interface', 'user.json');
  }

  // ignore: non_constant_identifier_names
  Future<void> write(String theme_data, String libraryPath) async {
    final file = await getLocalData();
    var userData = <String, dynamic>{};
    userData['theme'] = theme_data;
    userData['libraryPath'] = libraryPath;
    FileSystem.writeJson(file, userData, '\t');
    return;
  }

  Future<void> read() async {
    try {
      final file = await getLocalData();
      final contents = FileSystem.readFile(file);
      // ignore: non_constant_identifier_names
      final decode_data = jsonDecode(contents);
      switch (decode_data['theme']) {
        case 'dark':
          {
            theme_data = ThemeMode.dark;
            break;
          }
        case 'light':
          {
            theme_data = ThemeMode.light;
            break;
          }
        case 'system':
          {
            theme_data = ThemeMode.system;
            break;
          }
      }
    } catch (e) {
      theme_data = ThemeMode.system;
      write('light', '');
    }
    return;
  }

  static Future<bool> getCurrentTheme() async {
    try {
      var custom = Customization.init();
      var path = await custom.getLocalData();
      var data = FileSystem.readJson(path);
      return data['theme'] == 'light';
    } catch (e) {
      return true;
    }
  }

  static Future<String> getWorkspace() async {
    try {
      var custom = Customization.init();
      var path = await custom.getLocalData();
      var data = FileSystem.readJson(path);
      return data['libraryPath'];
    } catch (e) {
      if (Platform.isAndroid) {
        return '/storage/emulated/0/SenGUI';
      } else {
        return p.join(
          (await getApplicationDocumentsDirectory()).path,
          'SenGUI',
        );
      }
    }
  }
}
