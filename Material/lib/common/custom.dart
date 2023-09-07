import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

class Customization {
  // ignore: non_constant_identifier_names
  ThemeMode theme_data;

  Customization(this.theme_data);

  Customization.init()
      : this(
          ThemeMode.system,
        );

  // ignore: non_constant_identifier_names
  Future<String> get_local_data() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = directory.path;
    return '$path/Sen/user.json';
  }

  Future<void> write() async {
    final file = await get_local_data();
    var userData = <String, dynamic>{};
    switch (theme_data) {
      case ThemeMode.dark:
        {
          userData['theme'] = 'dark';
          break;
        }
      case ThemeMode.light:
        {
          userData['theme'] = 'light';
          break;
        }
      default:
        {
          userData['theme'] = 'system';
          break;
        }
    }
    FileSystem.writeFile(file, jsonEncode(userData));
    return;
  }

  Future<void> read() async {
    try {
      final file = await get_local_data();
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
      write();
    }
    return;
  }
}
