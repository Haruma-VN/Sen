import 'package:sen_material_design/module/utility/exception/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as path;

void splitResourceGroup(String inFile, String outDirectory) {
  final dynamic resourceGroup = FileSystem.readJson(inFile);
  assertTest(
    resourceGroup['groups'] != null,
    'Not resource-group, does not find property "groups"',
  );
  Map<String, Object> content = {};
  for (var i = 0; i < resourceGroup['groups'].length; i++) {
    dynamic current = resourceGroup['groups'][i];
    if (current['resources'] != null) {
      current['resources'].forEach(
        (element) => element.remove('slot'),
      );
    }
    final String id = current['id'];
    if ((current['resources'] != null) && (current['parent'] != null)) {
      FileSystem.writeJson(
        path.join(
          outDirectory,
          'subgroup',
          '$id.json',
        ),
        current,
        '\t',
      );
    }
    if (current['subgroups'] != null ||
        (current['resources'] != null) && (current['parent'] == null)) {
      if (current['subgroups'] != null) {
        content[id] = {
          'is_composite': true,
          'subgroups': {},
        };
        dynamic mCurrent = content[id];
        for (var sub in current['subgroups']) {
          mCurrent['subgroups'][sub['id']] = {
            // ignore: unnecessary_null_aware_assignments
            'type': (sub['res'] ??= null),
          };
        }
      } else {
        content[id] = {
          'is_composite': false,
          'subgroups': {},
        };
        dynamic mCurrent = content[id];
        mCurrent['subgroups'][id] = {
          // ignore: unnecessary_null_aware_assignments
          'type': null,
        };
        FileSystem.writeJson(
          path.join(
            outDirectory,
            'subgroup',
            '$id.json',
          ),
          current,
          '\t',
        );
      }
    }
  }
  FileSystem.writeJson(
    path.join(
      outDirectory,
      'content.json',
    ),
    content,
    '\t',
  );
  return;
}
