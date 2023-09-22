// ignore_for_file: camel_case_types, library_prefixes, non_constant_identifier_names
import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/tool/popcap/atlas/common.dart';
import 'package:sen_material_design/module/utility/algorithm/RectangleBinPack/common.dart';
import 'package:sen_material_design/module/utility/image/common.dart';
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
  static List<dynamic> auto_conversion_to_packable_data(
    dynamic atlasJson,
    String? error,
  ) {
    final groups_member = atlasJson['groups'].keys.toList();
    List<dynamic> data = [];
    for (var member in groups_member) {
      var value = {
        'id': member,
        'path': atlasJson['groups'][member]['path'],
        'infoX': atlasJson['groups'][member]['default']['x'],
        'infoY': atlasJson['groups'][member]['default']['y'],
        'x': -1,
        'y': -1,
      };
      if (atlasJson['groups'][member]['default']['cols'] != null) {
        value['cols'] = atlasJson['groups'][member]['default']['cols'];
      } else {
        value['cols'] = 1;
      }
      if (atlasJson['groups'][member]['default']['rows'] != null) {
        value['rows'] = atlasJson['groups'][member]['default']['rows'];
      } else {
        value['rows'] = 1;
      }
      data.add(value);
    }
    return data;
  }

  static dynamic process(
    String directoryPath,
    requiresData packData,
    String outputDirectory,
    String? error,
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
    final List<dynamic> packable_datas =
        auto_conversion_to_packable_data(atlasJson, atlas_json_path);
    for (var data in packable_datas) {
      var file_name =
          '${isPath ? data['path'][data['path'].length - 1] : data['id']}.png';
      var dimension = ImageIO.getDimension(
        p.join(
          media_path,
          file_name,
        ),
      );
      data['width'] = dimension.width;
      data['height'] = dimension.height;
    }
    var mData = RectangleBinPack.process(
      RectangleBox(
        packData.width,
        packData.height,
        packData.padding,
      ),
      packable_datas.map((e) {
        List<String> path = [];
        e['path'].forEach((dynamic item) => path.add(item.toString()));
        return RectangleSprite(
          e['width'],
          e['height'],
          e['x'],
          e['y'],
          e['id'],
          e['infoX'],
          e['infoY'],
          e['cols'],
          e['rows'],
          path,
        );
      }).toList(),
    );
    List<List<RectangleSprite>> results = Texture2DAlgorithm.extract(
      mData,
      error,
    );
    dynamic subgroup = {
      'id': atlasJson['subgroup'],
      'parent': (atlasJson['subgroup'] as String)
          .replaceAll('_${atlasJson['res']}', ''),
      'res': atlasJson['res'],
      'type': 'simple',
      'resources': [],
    };
    // final bool trim = atlasJson['trim'];
    final bool isString = atlasJson['expand_path'] == 'string';
    for (var i = 0; i < results.length; ++i) {
      var dimension_output = Dimension(packData.width, packData.height);
      var parent_name = '${subgroup['id']}_${i < 10 ? '0$i' : i}';
      subgroup['resources'].add(
        {
          'id': 'ATLASIMAGE_ATLAS_${parent_name.toUpperCase()}',
          'path': isString ? 'atlases\\$parent_name' : ['atlases', parent_name],
          'type': 'Image',
          'atlas': true,
          'width': dimension_output.width,
          'height': dimension_output.height,
          'runtime': true,
        },
      );
      for (var j = 0; j < results[i].length; j++) {
        var value = {
          'id': results[i][j].id,
          'path': isString ? results[i][j].path.join('\\') : results[i][j].path,
          'type': 'Image',
          'parent': 'ATLASIMAGE_ATLAS_${parent_name.toUpperCase()}',
          'ax': results[i][j].x,
          'ay': results[i][j].y,
          'aw': results[i][j].width,
          'ah': results[i][j].height,
        };
        if (results[i][j].infoX != 0) {
          value['x'] = results[i][j].infoX;
        }
        if (results[i][j].infoY != 0) {
          value['y'] = results[i][j].infoY;
        }
        if (results[i][j].cols != 1) {
          value['cols'] = results[i][j].cols;
        }
        if (results[i][j].rows != 1) {
          value['rows'] = results[i][j].rows;
        }
        subgroup['resources'].add(value);
      }
      ImageIO.joinImage(
        results[i]
            .map(
              (RectangleSprite e) => ImageChild(
                e.width,
                e.height,
                !isPath
                    ? p.join(
                        media_path,
                        '${e.id}.png',
                      )
                    : p.join(media_path, '${e.path[e.path.length - 1]}.png'),
                e.x,
                e.y,
              ),
            )
            .toList(),
        DimensionExpand(
          dimension_output.width,
          dimension_output.height,
          p.join(
            outputDirectory,
            '${parent_name.toUpperCase()}.png',
          ),
        ),
      );
    }
    FileSystem.writeJson(
      p.join(outputDirectory, '${atlasJson['subgroup']}.json'),
      subgroup,
      '\t',
    );
    return subgroup;
  }

  static process_fs(
    String directoryPath,
    requiresData packData,
    String outputDirectory,
    String? error,
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
    final List<dynamic> packable_datas =
        auto_conversion_to_packable_data(atlasJson, atlas_json_path);
    for (var data in packable_datas) {
      var file_name =
          '${isPath ? data['path'][data['path'].length - 1] : data['id']}.png';
      var dimension = ImageIO.getDimension(
        p.join(
          media_path,
          file_name,
        ),
      );
      data['width'] = dimension.width;
      data['height'] = dimension.height;
    }
    var mData = RectangleBinPack.process(
      RectangleBox(
        packData.width,
        packData.height,
        packData.padding,
      ),
      packable_datas.map((e) {
        List<String> path = [];
        e['path'].forEach((dynamic item) => path.add(item.toString()));
        return RectangleSprite(
          e['width'],
          e['height'],
          e['x'],
          e['y'],
          e['id'],
          e['infoX'],
          e['infoY'],
          e['cols'],
          e['rows'],
          path,
        );
      }).toList(),
    );
    List<List<RectangleSprite>> results = Texture2DAlgorithm.extract(
      mData,
      error,
    );
    dynamic subgroup = {
      [atlasJson['subgroup']]: {
        'type': atlasJson['res'],
        'packet': {},
      },
    };
    for (var i = 0; i < results.length; ++i) {
      var dimension = Dimension(packData.width, packData.height);
      String parent_name = '${atlasJson['subgroup']}_${i < 10 ? '0$i' : i}';
      String parent_packet = 'ATLASIMAGE_ATLAS_${parent_name.toUpperCase()}';
      subgroup[atlasJson[['subgroup']]]['packet'][parent_packet] = {
        'type': 'Image',
        'path': ['atlases', parent_name],
        'dimension': {
          'width': dimension.width,
          'height': dimension.height,
        },
        'data': {},
      };
      for (var j = 0; j < results[i].length; ++j) {
        dynamic rawData = {
          'default': {
            'ax': results[i][j].x,
            'ay': results[i][j].y,
            'aw': results[i][j].width,
            'ah': results[i][j].height,
            'x': results[i][j].infoX,
            'y': results[i][j].infoY,
          },
          'path': results[i][j].path,
          'type': 'Image',
        };
        if (results[i][j].cols != 1) {
          rawData['default']['cols'] = results[i][j].cols;
        }
        if (results[i][j].rows != 1) {
          rawData['default']['rows'] = results[i][j].rows;
        }
        subgroup[atlasJson['subgroup']]['packet'][parent_packet]['data']
            [results[i][j].id] = rawData;
      }
      ImageIO.joinImage(
        results[i]
            .map(
              (RectangleSprite e) => ImageChild(
                e.width,
                e.height,
                !isPath
                    ? p.join(
                        media_path,
                        '${e.id}.png',
                      )
                    : p.join(media_path, '${e.path[e.path.length - 1]}.png'),
                e.x,
                e.y,
              ),
            )
            .toList(),
        DimensionExpand(
          dimension.width,
          dimension.height,
          p.join(
            outputDirectory,
            '${parent_name.toUpperCase()}.png',
          ),
        ),
      );
    }
    FileSystem.writeJson(
      p.join(outputDirectory, '${atlasJson['subgroup']}.json'),
      subgroup,
      '\t',
    );
    return;
  }
}
