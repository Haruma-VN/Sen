// ignore_for_file: camel_case_types, unused_local_variable, non_constant_identifier_names
import 'package:image/image.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'dart:core';
import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/utility/image/common.dart';

class splitAtlas {
  static final RegExp jsonExpression = RegExp(
    r'\.json$',
    caseSensitive: false,
  );

  static final RegExp pngExpression = RegExp(
    r'\.png$',
    caseSensitive: false,
  );

  static dynamic convertFromResourceGroup(
    dynamic resource,
    String method,
    String expand_path,
  ) {
    dynamic atlas_json = {
      'method': method,
      'expand_path': expand_path,
      'subgroup': resource['id'],
      'trim': false,
      'res': resource['res'],
      'groups': {},
    };
    for (var subgroup in resource['resources']) {
      if (subgroup['ax'] != null &&
          subgroup['ay'] != null &&
          subgroup['ah'] != null &&
          subgroup['aw'] != null &&
          subgroup['path'] != null) {
        dynamic wrapper = {
          'default': {
            'x': (subgroup['x'] ??= 0),
            'y': (subgroup['x'] ??= 0),
          },
          'path': subgroup['path'],
        };
        if (subgroup['cols'] != null && subgroup['cols'] != 1) {
          wrapper['default']['cols'] = subgroup['cols'];
        }
        if (subgroup['rows'] != null && subgroup['rows'] != 1) {
          wrapper['default']['rows'] = subgroup['rows'];
        }
        atlas_json['groups'][subgroup['id']] = wrapper;
      }
    }
    return atlas_json;
  }

  static void process(
    dynamic data,
    List<String> imgPath,
    String method,
    String expandPath,
    String outputDirectory,
  ) {
    final dynamic resources_used = {
      ...data as Map,
      'resources': [],
    };
    final String spriteDirectory = p.join(
      outputDirectory,
      'media',
    );
    bool splitByPath = method == 'path';
    FileSystem.createDirectory(
      spriteDirectory,
    );
    Map<String, Image> pngMap = {};
    for (var subgroup_children in data['resources']) {
      if (subgroup_children['ax'] != null &&
          subgroup_children['ay'] != null &&
          subgroup_children['ah'] != null &&
          subgroup_children['aw'] != null &&
          subgroup_children['path'] != null) {
        for (var png in imgPath) {
          if (!pngMap.containsKey(png)) {
            pngMap[png] = decodeImage(FileSystem.readBuffer(png))!;
          }
          var currentParent =
              png.replaceAll(pngExpression, '').toUpperCase().toString();
          if (subgroup_children['parent'] != null &&
              currentParent.endsWith(
                (subgroup_children['parent'] as String).replaceAll(
                  'ATLASIMAGE_ATLAS_',
                  '',
                ),
              )) {
            subgroup_children['path'] = expandPath == 'string'
                ? (subgroup_children['path'] as String).split('\\')
                : subgroup_children['path'];
            ImageIO.cropImage(
              pngMap[png]!,
              subgroup_children['ax'],
              subgroup_children['ay'],
              subgroup_children['aw'],
              subgroup_children['ah'],
              p.join(
                spriteDirectory,
                '${splitByPath ? subgroup_children['path'][subgroup_children['path'].length - 1] : subgroup_children['id']}.png',
              ),
            );
            resources_used['resources'].add(
              subgroup_children,
            );
          }
        }
      }
    }
    FileSystem.writeJson(
      p.join(
        outputDirectory,
        'atlas.json',
      ),
      convertFromResourceGroup(
        resources_used,
        method,
        expandPath,
      ),
      '\t',
    );
    return;
  }

  static void process_fs(
    String inDirectory,
    String outDirectory,
    String expandPath,
    String method,
  ) {
    final List<String> list = FileSystem.readDirectory(
      inDirectory,
      false,
    );
    final List<String> jsons = list
        .where(
          (
            String element,
          ) =>
              jsonExpression.hasMatch(
            element,
          ),
        )
        .toList();
    final List<String> pngs = list
        .where(
          (
            String element,
          ) =>
              pngExpression.hasMatch(
            element,
          ),
        )
        .toList();
    for (var element in jsons) {
      final dynamic jsonData = FileSystem.readJson(
        element,
      );
      if (jsonData['resources'] != null) {
        process(
          jsonData,
          pngs,
          method,
          expandPath,
          p.join(
            outDirectory,
            '${jsonData['id']}.sprite',
          ),
        );
      }
    }
    return;
  }

  static dynamic create_from_resinfo(
    dynamic resInfo,
    String method,
    String filePath,
  ) {
    dynamic atlasJson = {
      'method': method,
      'subgroup': p.withoutExtension(
        p.basename(filePath),
      ),
      'trim': false,
      'res': resInfo['type'],
      'groups': {},
    };
    final List<dynamic> parents = resInfo['packet'].keys.toList();
    for (var parent in parents) {
      final List<dynamic> datas =
          resInfo['packet'][parent]['data'].keys.toList();
      for (var data in datas) {
        dynamic rawData = {
          'default': {
            'x': (resInfo['packet'][parent]['data'][data]['default']['x'] ??=
                0),
            'y': (resInfo['packet'][parent]['data'][data]['default']['y'] ??=
                0),
          },
          'path': [...resInfo['packet'][parent]['data'][data]['path']],
        };
        if ((resInfo['packet'][parent]['data'][data]['default']['cols'] !=
                null) &&
            (resInfo['packet'][parent]['data'][data]['default']['cols'] != 1)) {
          rawData['default']['cols'] =
              resInfo['packet'][parent]['data'][data]['default']['cols'];
        }
        if ((resInfo['packet'][parent]['data'][data]['default']['rows'] !=
                null) &&
            (resInfo['packet'][parent]['data'][data]['default']['rows'] != 1)) {
          rawData['default']['rows'] =
              resInfo['packet'][parent]['data'][data]['default']['rows'];
        }
        atlasJson['groups'][data] = rawData;
      }
    }
    return atlasJson;
  }

  static void process_resinfo(
    dynamic data,
    List<String> imgPath,
    String method,
    String filePath,
    String outputDirectory,
  ) {
    dynamic resource_used = {
      ...data as Map,
      'packet': {},
    };
    final List<dynamic> parents = data['packet'].keys.toList();
    FileSystem.createDirectory(
      outputDirectory,
    );
    final String mediaPath = p.join(
      outputDirectory,
      'media',
    );
    FileSystem.createDirectory(
      mediaPath,
    );
    Map<String, Image> pngMap = {};
    for (var parent in parents) {
      final List<dynamic> id_collection =
          data['packet'][parent]['data'].keys.toList();
      resource_used['packet'][parent] = {
        ...data['packet'][parent] as Map,
        data: {},
      };
      for (var id in id_collection) {
        var rawData = data['packet'][parent]['data'][id]['default'];
        if (rawData['ax'] != null &&
            rawData['ay'] != null &&
            rawData['aw'] != null &&
            rawData['ah'] != null) {
          for (var png in imgPath) {
            if (!pngMap.containsKey(png)) {
              pngMap[png] = decodeImage(FileSystem.readBuffer(png))!;
            }
            var currentParent =
                png.replaceAll(pngExpression, '').toUpperCase().toString();
            if (currentParent.toString().endsWith(
                  p.basename(parent).replaceFirst('ATLASIMAGE_ATLAS_', ''),
                )) {
              ImageIO.cropImage(
                pngMap[png]!,
                rawData['ax'],
                rawData['ay'],
                rawData['aw'],
                rawData['ah'],
                p.join(
                  mediaPath,
                  '${method == 'path' ? data['packet'][parent]['data'][id]['path'][data['packet'][parent]['data'][id]['path'].length - 1] : id}.png',
                ),
              );
              resource_used['packet'][parent]['data'][id] = {
                'default': {
                  ...rawData as Map,
                },
                'path': [...data['packet'][parent]['data'][id]['path']],
                'type': data['packet'][parent]['data'][id]['type'],
              };
            }
          }
        }
      }
    }
    FileSystem.writeJson(
      p.join(outputDirectory, 'atlas.json'),
      create_from_resinfo(resource_used, method, filePath),
      '\t',
    );
    return;
  }

  static void process_raw_has_fs(
    String inDirectory,
    String outDirectory,
    String method,
  ) {
    final List<String> list = FileSystem.readDirectory(
      inDirectory,
      false,
    );
    final List<String> jsons = list
        .where(
          (
            String element,
          ) =>
              jsonExpression.hasMatch(
            element,
          ),
        )
        .toList();
    final List<String> pngs = list
        .where(
          (
            String element,
          ) =>
              pngExpression.hasMatch(
            element,
          ),
        )
        .toList();
    for (var element in jsons) {
      final dynamic jsonData = FileSystem.readJson(
        element,
      );
      if (jsonData['packet'] != null) {
        process_resinfo(
          jsonData,
          pngs,
          method,
          element,
          p.join(
            outDirectory,
            '${p.withoutExtension(p.basename(element))}.sprite',
          ),
        );
      }
    }
    return;
  }
}
