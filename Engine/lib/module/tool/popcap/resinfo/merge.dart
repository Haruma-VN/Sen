// ignore_for_file: camel_case_types, unused_import, non_constant_identifier_names

import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/utility/io/common.dart';

class mergeResInfo {
  static void process(
    String inDirectory,
    String outFile,
  ) {
    final dynamic info = FileSystem.readJson(
      p.join(
        inDirectory,
        'info.json',
      ),
    );
    dynamic resInfo = {
      'expand_path': info['information']['expand_path'],
      'groups': {},
    };
    List<dynamic> group_array = [];
    final List<String> groups_collection = info['groups'].keys.toList();
    for (var i = 0; i < groups_collection.length; ++i) {
      final String group = groups_collection[i];
      final dynamic data = info['groups'][group];
      group_array.add(
        {
          ...data as Map,
          'group_parent': group,
        },
      );
    }
    for (var i = 0; i < group_array.length; ++i) {
      resInfo['groups'][group_array[i]['group_parent']] = {
        'is_composite': group_array[i]['is_composite'],
        'subgroup': {},
      };
      for (var j = 0; j < group_array[i]['subgroups'].length; ++j) {
        resInfo['groups'][group_array[i]['group_parent']]['subgroup']
            [group_array[i]['subgroups'][j]] = FileSystem.readJson(
          p.join(
            inDirectory,
            'groups',
            '${group_array[i]['subgroups'][j]}.json',
          ),
        );
      }
    }
    FileSystem.writeJson(
      outFile,
      resInfo,
      '\t',
    );
    return;
  }
}
