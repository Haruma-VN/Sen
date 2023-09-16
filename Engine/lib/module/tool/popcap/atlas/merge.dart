// ignore_for_file: camel_case_types, library_prefixes, non_constant_identifier_names
import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/utility/io/common.dart';

class requiresData {
  late int width;
  late int height;
  late int padding;
  requiresData();
  requiresData.has(
    this.width,
    this.height,
    this.padding,
  );
}

class mergeAtlas {
//   static List<dynamic> auto_conversion_to_packable_data(
//     dynamic atlasJson,
//     String? filepath,
//   ) {
//     final groups_member = atlasJson['groups'].keys.toList();
//     List<dynamic> data = [];
//     for (var member in groups_member) {
//         var value = {
//             'id': member,
//             'path': atlasJson['groups'][member]['path'],
//             'infoX':
//         }
//     }
//     return data;
//   }

  static process(
    String directoryPath,
    requiresData packData,
  ) {
    final String atlas_json_path = p.join(
      directoryPath,
      'atlas.json',
    );
    final String media_path = p.join(
      directoryPath,
      'media',
    );
    final dynamic atlasJson = FileSystem.readJson(
      atlas_json_path,
    );
    final bool isPath = atlasJson['method'] == 'path';
    final group_members = atlasJson['groups'].keys.toList();
    final images_name = isPath
        ? group_members
            .map(
              (member) => atlasJson['groups'][member]['path']
                  [atlasJson['groups'][member]['path'].length - 1],
            )
            .toList()
        : group_members;
  }
}
