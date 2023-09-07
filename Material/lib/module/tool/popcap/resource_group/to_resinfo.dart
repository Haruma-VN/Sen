import 'package:sen_material_design/module/utility/exception/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

enum ExpandPath {
  string,
  array,
}

class ConvertToResInfo {
  ConvertToResInfo();

  dynamic convertAtlasData(dynamic subgroup, bool useString) {
    dynamic result = {
      'type': subgroup['res'],
      'packet': {},
    };
    final atlas = (subgroup['resources'] as List<dynamic>)
        .where((element) => element['atlas'] != null && element['atlas'])
        .toList();
    for (var parent in atlas) {
      result['packet'][parent['id']] = {
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
          .forEach(
        (element) {
          result['packet'][parent['id']]['data'][element['id']] = {
            'type': element['type'],
            'path': useString
                ? (element['path'] as String).split('\\')
                : element['path'] as List<String>,
            'default': {
              'ax': element['ax'],
              'ay': element['ay'],
              'aw': element['aw'],
              'ah': element['ah'],
              'x': element['x'] ?? 0,
              'y': element['y'] ?? 0,
            },
          };
          if (element['cols'] != null && element['cols'] != 1) {
            result['packet'][parent['id']]['data'][element['id']]['default']
                ['cols'] = element['cols'];
          }
          if (element['rows'] != null && element['rows'] != 1) {
            result['packet'][parent['id']]['data'][element['id']]['default']
                ['rows'] = element['rows'];
          }
        },
      );
    }
    return result;
  }

  dynamic convertCommonData(dynamic subgroup, bool useString) {
    dynamic result = {
      'type': null,
      'packet': {
        'type': 'File',
        'data': {},
      },
    };
    for (var element in (subgroup['resources'] as List<dynamic>)) {
      result['packet']['data'][element['id']] = {
        'type': element['type'],
        'path': useString
            ? (element['path'] as String).split('\\')
            : element['path'] as List<String>,
      };
      if (element['forceOriginalVectorSymbolSize'] != null) {
        result['packet']['data'][element['id']]
                ['forceOriginalVectorSymbolSize'] =
            element['forceOriginalVectorSymbolSize'];
      }
      if (element['srcpath'] != null) {
        result['packet']['data'][element['id']]['srcpath'] = useString
            ? (element['srcpath'] as String).split('\\')
            : element['srcpath'] as List<String>;
      }
    }
    return result;
  }

  dynamic convertWholeData(dynamic resourceGroup, ExpandPath expandPath) {
    assertTest(
      resourceGroup['groups'] != null,
      'Not resource-group, does not find property "groups"',
    );
    bool useString = expandPath == ExpandPath.string;
    var result = {
      'expand_path': useString ? "string" : "array",
      'groups': {},
    };
    for (var element in (resourceGroup['groups'] as List<dynamic>)) {
      if (element['subgroups'] != null) {
        var subgroup = {
          'is_composite': true,
          'subgroup': {},
        };
        for (var k in element['subgroups']) {
          if (k['res'] != null && k['res'] != '0') {
            (subgroup['subgroup'] as dynamic)[k['id']] = convertAtlasData(
              (resourceGroup['groups'] as List<dynamic>)
                  .firstWhere((m) => m['id'] == k['id']),
              useString,
            );
          } else {
            (subgroup['subgroup'] as dynamic)[k['id']] = convertCommonData(
              (resourceGroup['groups'] as List<dynamic>)
                  .firstWhere((m) => m['id'] == k['id']),
              useString,
            );
          }
        }
        (result['groups'] as dynamic)[element['id']] = subgroup;
      }
      if (element['parent'] == null && element['resources'] != null) {
        (result['groups'] as dynamic)[element['id']] = {
          'is_composite': false,
          'subgroup': {},
        };
        ((result['groups'] as dynamic)[element['id']] as dynamic)['subgroup'] =
            {};
        ((result['groups'] as dynamic)[element['id']] as dynamic)['subgroup']
            [element['id']] = convertCommonData(
          element,
          useString,
        );
        {}
        ;
      }
    }
    return result;
  }

  static void process(String inFile, String outFile, ExpandPath expandPath) {
    ConvertToResInfo convert = ConvertToResInfo();
    var data =
        convert.convertWholeData(FileSystem.readJson(inFile), expandPath);
    FileSystem.writeJson(outFile, data, '\t');
    return;
  }
}
