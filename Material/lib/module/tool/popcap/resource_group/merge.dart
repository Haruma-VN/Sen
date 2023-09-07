import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/utility/exception/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as path;

void mergeResourceGroup(String inDirectory, String outFile) {
  final dynamic content = FileSystem.readJson(
    path.join(
      inDirectory,
      'content.json',
    ),
  );
  dynamic resourceGroup = {
    'version': 1,
    'content_version': 1,
    'slot_count': 0,
    'groups': [],
  };
  final List<String> parents = content.keys.toList();
  for (var parent in parents) {
    final List<String> subgroups = content[parent]['subgroups'].keys.toList();
    if (content[parent]['is_composite']) {
      final dynamic compositeObject = {
        'id': parent,
        'type': "composite",
        'subgroups': [],
      };
      for (dynamic subgroup in subgroups) {
        var mObject = {
          'id': subgroup,
        };
        if (content[parent]['subgroups'][subgroup]['type'] != null) {
          mObject['res'] = content[parent]['subgroups'][subgroup]['type'];
        }
        compositeObject['subgroups'].add(mObject);
      }
      resourceGroup['groups'].add(compositeObject);
    }
    for (var subgroup in subgroups) {
      final String sub = path.join(
        inDirectory,
        'subgroup',
        '$subgroup.json',
      );
      final dynamic ripe = FileSystem.readJson(sub);
      assertTest(
        ripe['resources'] != null,
        'Resource inside Resources-Group cannot be null, path: $sub',
      );
      resourceGroup['groups'].add(ripe);
    }
  }
  rewriteSlot(resourceGroup);
  FileSystem.writeJson(outFile, resourceGroup, '\t');
  return;
}
