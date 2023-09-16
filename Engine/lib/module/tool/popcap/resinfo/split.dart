import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/utility/io/common.dart';

// ignore: camel_case_types
class splitResInfo {
  dynamic setDefaultInfo(
    dynamic resInfo,
  ) {
    dynamic result = {
      'information': {
        'expand_path': resInfo['expand_path'],
      },
      'groups': {},
    };
    final dynamic infoGroups = resInfo['groups'].keys.toList();
    for (var i = 0; i < infoGroups.length; i++) {
      result['groups'][infoGroups[i]] =
          generateSubgroup(resInfo['groups'][infoGroups[i]]);
    }
    return result;
  }

  dynamic generateSubgroup(
    dynamic resource,
  ) =>
      ({
        'is_composite': resource['is_composite'],
        'subgroups': resource['subgroup'].keys.toList(),
      });

  void processData(
    String inFile,
    String outDirectory,
  ) {
    final String groupDirectory = p.join(outDirectory, 'groups');
    final dynamic resInfo = FileSystem.readJson(inFile);
    dynamic info = setDefaultInfo(resInfo);
    FileSystem.createDirectory(outDirectory);
    FileSystem.writeJson(p.join(outDirectory, 'info.json'), info, '\t');
    FileSystem.createDirectory(groupDirectory);
    final dynamic groupKeys = info['groups'].keys.toList();
    for (var i = 0; i < groupKeys.length; i++) {
      final dynamic subgroupKeys =
          resInfo['groups'][groupKeys[i]]['subgroup'].keys.toList();
      for (var j = 0; j < subgroupKeys.length; j++) {
        FileSystem.writeJson(
          p.join(
            groupDirectory,
            '${subgroupKeys[j]}.json',
          ),
          resInfo['groups'][groupKeys[i]]['subgroup'][subgroupKeys[j]],
          '\t',
        );
      }
    }
    return;
  }

  static process(
    String inFile,
    String outDirectory,
  ) {
    final res = splitResInfo();
    res.processData(
      inFile,
      outDirectory,
    );
    return;
  }
}
