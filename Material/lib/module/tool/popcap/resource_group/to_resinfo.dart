import 'package:sen_material_design/module/utility/exception/common.dart';

enum ExpandPath {
  string,
  array,
}

class ConvertToResInfo {
  ConvertToResInfo();

  dynamic convertAtlasData(dynamic subgroup, ExpandPath expandPath) {
    dynamic result = {
      'type': subgroup['type'],
      'packet': {},
    };
    bool useString = expandPath == ExpandPath.string;
    List<dynamic> atlas = (subgroup['resources'] as List<dynamic>)
        .where((element) => element['atlas'] != null && element['atlas'])
        .toList();
    for (var parent in atlas) {
      result['packet'][parent] = {
        'type': parent['type'],
        'path': useString
            ? (parent['path'] as String).split('\\')
            : parent['path'] as List<String>,
        'dimension': {
          'width': parent['width'],
          'height': parent['height'],
        },
        'data': {},
      };
      (subgroup['resources'] as List<dynamic>)
          .where((element) => element['parent'] == parent['id'])
          .forEach((element) {
        result['packet'][parent]['data'][element['id']] = {
          'type': element['type'],
          'path': useString
              ? (element['path'] as String).split('\\')
              : element['path'] as List<String>,
          'default': {
            'ax': element['ax'],
            'ay': element['ay'],
            'aw': element['aw'],
            'ah': element['ah'],
            'x': element['x'],
            'y': element['y'],
          },
        };
      });
    }
    return result;
  }

  dynamic convertWholeData(dynamic resourceGroup, ExpandPath expandPath) {
    assertTest(
      resourceGroup['groups'] != null,
      'Not resource-group, does not find property "groups"',
    );
    var result = {
      'expand_path': expandPath == ExpandPath.string ? "string" : "array",
      'groups': {},
    };
    for (var element in (resourceGroup['groups'] as List<dynamic>)) {
      if (element['subgroups'] != null) {
        var subgroup = {};
        for (var k in element['subgroups']) {
          if (k['res'] != null && k['res'] != '0') {
            subgroup[k['id']] = convertAtlasData(
              (resourceGroup['groups'] as List<dynamic>)
                  .firstWhere((m) => m['id'] == k['id']),
              expandPath,
            );
          } else {
            subgroup[k['id']] = {};
          }
        }
        (result['groups'] as dynamic)[element['id']] = subgroup;
      }
    }
    return result;
  }
}
