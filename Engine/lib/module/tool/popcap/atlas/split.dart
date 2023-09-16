// ignore_for_file: camel_case_types, unused_local_variable, non_constant_identifier_names
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
    for (var subgroup_children in data['resources']) {
      if (subgroup_children['ax'] != null &&
          subgroup_children['ay'] != null &&
          subgroup_children['ah'] != null &&
          subgroup_children['aw'] != null &&
          subgroup_children['path'] != null) {
        for (var png in imgPath) {
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
              png,
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
}
