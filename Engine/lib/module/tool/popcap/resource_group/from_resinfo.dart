import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

class ConvertFromResInfo {
  ConvertFromResInfo();

  dynamic generateComposite(
    String id,
    dynamic composite,
  ) {
    dynamic result = {
      'type': 'composite',
      'id': id,
      'subgroups': [],
    };
    for (var element
        in (composite['subgroup'].keys.toList() as List<dynamic>)) {
      dynamic sub = {
        'id': element,
      };
      if (composite['subgroup'][element]['type'] != null &&
          composite['subgroup'][element]['type'] != '0') {
        sub['res'] = composite['subgroup'][element]['type'];
      }
      result['subgroups'].add(sub);
    }
    return result;
  }

  dynamic generateFileInfo(
    SubInformation extra,
    dynamic fileInfo,
    bool useString,
  ) {
    dynamic result = {
      'type': 'simple',
      'id': extra.id,
      'parent': extra.parent,
      'resources': [],
    };
    if (result['parent'] == null) {
      result.remove('parent');
    }
    final List<dynamic> keys = fileInfo['packet']['data'].keys.toList();
    for (var key in keys) {
      final dynamic value = fileInfo['packet']['data'][key];
      final dynamic resource = {
        'type': value['type'],
        'slot': 0,
        'id': key,
        'path': useString
            ? (value['path'] as List<dynamic>).join('\\')
            : value['path'] as List<dynamic>,
      };
      if (value['srcpath'] != null) {
        resource['srcpath'] = useString
            ? (value['srcpath'] as List<dynamic>).join('\\')
            : value['srcpath'] as List<dynamic>;
      }
      if (value['forceOriginalVectorSymbolSize'] != null &&
          value['forceOriginalVectorSymbolSize']) {
        resource['forceOriginalVectorSymbolSize'] =
            value['forceOriginalVectorSymbolSize'] as bool;
      }
      result['resources'].add(resource);
    }
    return result;
  }

  dynamic generateImageInfo(
    SubInformation extra,
    dynamic imageInfo,
    bool useString,
  ) {
    dynamic result = {
      'type': 'simple',
      'id': extra.id,
      'res': imageInfo['type'],
      'parent': extra.parent,
      'resources': [],
    };
    final List<dynamic> keys = imageInfo['packet'].keys.toList();
    for (var key in keys) {
      final dynamic value = imageInfo['packet'][key];
      final dynamic resource = {
        'type': value['type'],
        'slot': 0,
        'id': key,
        'path': useString
            ? (value['path'] as List<dynamic>).join('\\')
            : value['path'] as List<dynamic>,
        'atlas': true,
        'runtime': true,
        'width': value['dimension']['width'],
        'height': value['dimension']['height'],
      };
      result['resources'].add(resource);
      for (var sub in value['data'].keys.toList()) {
        final dynamic subValue = value['data'][sub];
        dynamic subResource = {
          'type': subValue['type'],
          'slot': 0,
          'id': sub,
          'path': useString
              ? (subValue['path'] as List<dynamic>).join('\\')
              : subValue['path'] as List<dynamic>,
          'parent': key,
        };
        if (subValue['default']['x'] != null && subValue['default']['x'] != 0) {
          subResource['x'] = subValue['default']['x'];
        }
        if (subValue['default']['y'] != null && subValue['default']['y'] != 0) {
          subResource['y'] = subValue['default']['y'];
        }
        if (subValue['default']['cols'] != null &&
            subValue['default']['cols'] != 1) {
          subResource['cols'] = subValue['default']['cols'];
        }
        if (subValue['default']['rows'] != null &&
            subValue['default']['rows'] != 1) {
          subResource['rows'] = subValue['default']['rows'];
        }
        subResource['ax'] = subValue['default']['ax'];
        subResource['ay'] = subValue['default']['ay'];
        subResource['aw'] = subValue['default']['aw'];
        subResource['ah'] = subValue['default']['ah'];
        result['resources'].add(subResource);
      }
    }
    return result;
  }

  dynamic convertWholeData(
    dynamic resInfo,
  ) {
    dynamic result = {
      'version': 1,
      'content_version': 1,
      'slot_count': 0,
      'groups': [],
    };
    final bool useString = resInfo['expand_path'] == 'string';
    final List<dynamic> groups = resInfo['groups'].keys.toList();
    for (String compositeName in groups) {
      dynamic group = resInfo['groups'][compositeName];
      if (group['is_composite']) {
        result['groups'].add(generateComposite(compositeName, group));
        for (var subgroupName in group['subgroup'].keys.toList()) {
          final dynamic subgroup = group['subgroup'][subgroupName];
          if (subgroup['type'] != null && subgroup['type'] != "0") {
            result['groups'].add(
              generateImageInfo(
                SubInformation(
                  subgroupName,
                  compositeName,
                ),
                subgroup,
                useString,
              ),
            );
          } else {
            result['groups'].add(
              generateFileInfo(
                SubInformation(
                  subgroupName,
                  compositeName,
                ),
                subgroup,
                useString,
              ),
            );
          }
        }
      } else {
        for (var subgroupName in group['subgroup'].keys.toList()) {
          result['groups'].add(
            generateFileInfo(
              SubInformation(
                subgroupName,
                null,
              ),
              group['subgroup'][subgroupName],
              useString,
            ),
          );
        }
      }
    }
    rewriteSlot(result);
    return result;
  }

  static void process(String inFile, String outFile) {
    final convert = ConvertFromResInfo();
    final data = convert.convertWholeData(FileSystem.readJson(inFile));
    FileSystem.writeJson(outFile, data, '\t');
    return;
  }
}
