// ignore_for_file: constant_identifier_names, non_constant_identifier_names, constant_pattern_never_matches_value_type, unused_local_variable
import 'package:flutter/material.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/exception/common.dart';
import 'dart:core';

class Newton {
  static const int Image = 1;
  static const int PopAnim = 2;
  static const int SoundBank = 3;
  static const int File = 4;
  static const int PrimeFont = 5;
  static const int RenderEffect = 6;
  static const int DecodedSoundBank = 7;

  String readString(
    SenBuffer data,
  ) {
    var length = data.readUInt32LE();
    var str = "";
    for (var i = 0; i < length; i++) {
      str += data.readString(
        1,
      );
    }
    return str;
  }

  dynamic decode(
    SenBuffer data,
  ) {
    dynamic result = {
      'version': 1,
      'content_version': 1,
      'slot_count': data.readUInt32LE(),
      'groups': [],
    };
    var groups_count = data.readUInt32LE();
    for (var groups_index = 0; groups_index < groups_count; groups_index++) {
      var group = {};
      var group_type = data.readUInt8();
      switch (group_type) {
        case 0x01:
          {
            group['type'] = 'composite';
            break;
          }
        case 0x02:
          {
            {
              group['type'] = 'simple';
              break;
            }
          }
        default:
          {
            throw Exception(
              'Unknown group type',
            );
          }
      }
      var res = data.readUInt32LE();
      if (res != 0x00) {
        group['res'] = '$res';
      }
      var subgroups_count = data.readUInt32LE();
      var resources_count = data.readUInt32LE();
      var version = data.readUInt8();
      if (version != 0x01) {
        throw Exception(
          'Invalid version',
        );
      }
      var group_has_parent = data.readUInt8();
      group['id'] = readString(
        data,
      );
      if (group_has_parent != 0x00) {
        group['parent'] = readString(
          data,
        );
      }
      if (group_type == 0x01) {
        assertTest(
          resources_count == 0x00,
          'resources must have size 0 with composite',
        );
        group['subgroups'] = [];
        for (var subgroups_index = 0;
            subgroups_index < subgroups_count;
            ++subgroups_index) {
          var subgroup = {};
          var sub_res = data.readUInt32LE();
          if (sub_res != 0x00) {
            subgroup['res'] = '$sub_res';
          }
          subgroup['id'] = readString(
            data,
          );
          group['subgroups'].add(
            subgroup,
          );
        }
      }
      if (group_type == 0x02) {
        assertTest(
          subgroups_count == 0x00,
          'subgroups must have size 0 with simple',
        );
        group['resources'] = [];
        for (var resources_index = 0;
            resources_index < resources_count;
            ++resources_index) {
          var resource_x = {};
          var resource_type = data.readUInt8();
          switch (resource_type) {
            case Image:
              {
                resource_x['type'] = 'Image';
                break;
              }
            case PopAnim:
              {
                resource_x['type'] = 'PopAnim';
                break;
              }
            case SoundBank:
              {
                resource_x['type'] = 'SoundBank';
                break;
              }
            case File:
              {
                resource_x['type'] = 'File';
                break;
              }
            case PrimeFont:
              {
                resource_x['type'] = 'PrimeFont';
                break;
              }
            case RenderEffect:
              {
                resource_x['type'] = 'RenderEffect';
                break;
              }
            case DecodedSoundBank:
              {
                resource_x['type'] = 'DecodedSoundBank';
                break;
              }
            default:
              {
                throw Exception('Unknown Resource Type');
              }
          }
          final Map<String, int> wrapper = {
            'slot': data.readUInt32LE(),
            'width': data.readUInt32LE(),
            'height': data.readUInt32LE(),
            'x': data.readInt32LE(),
            'y': data.readInt32LE(),
            'ax': data.readUInt32LE(),
            'ay': data.readUInt32LE(),
            'aw': data.readUInt32LE(),
            'ah': data.readUInt32LE(),
            'cols': data.readUInt32LE(),
            'rows': data.readUInt32LE(),
            'atlas': data.readUInt8(),
          };
          final bool is_sprite = wrapper['aw'] != 0x00 && wrapper['ah'] != 0x00;
          resource_x['slot'] = wrapper['slot']!;
          if (wrapper['width'] != 0x00) {
            resource_x['width'] = wrapper['width']!;
          }
          if (wrapper['height'] != 0x00) {
            resource_x['height'] = wrapper['height']!;
          }
          if (wrapper['x'] != 0x00 && wrapper['x'] != 2147483647) {
            resource_x['x'] = wrapper['x']!;
          }
          if (wrapper['y'] != 0x00 && wrapper['y'] != 2147483647) {
            resource_x['y'] = wrapper['y']!;
          }
          if (is_sprite) {
            resource_x['ax'] = wrapper['ax']!;
            resource_x['ay'] = wrapper['ay']!;
            resource_x['aw'] = wrapper['aw']!;
            resource_x['ah'] = wrapper['ah']!;
          }
          if (wrapper['cols'] != 0x01) {
            resource_x['cols'] = wrapper['cols']!;
          }
          if (wrapper['rows'] != 0x01) {
            resource_x['rows'] = wrapper['rows']!;
          }
          data.readUInt8();
          data.readUInt8();
          final bool resource_has_parent = data.readUInt8() != 0x00;
          resource_x['id'] = readString(
            data,
          );
          resource_x['path'] = readString(
            data,
          );
          if (resource_has_parent) {
            resource_x['parent'] = readString(
              data,
            );
          }
          switch (resource_type) {
            case PopAnim:
              {
                resource_x['forceOriginalVectorSymbolSize'] = true;
                break;
              }
            case RenderEffect:
              {
                resource_x['srcpath'] = 'res\\common\\${resource_x['path']}';
                break;
              }
            default:
              {
                if (wrapper['atlas'] != 0x00) {
                  resource_x['atlas'] = true;
                  resource_x['runtime'] = true;
                }
              }
          }
          group['resources'].add(
            resource_x,
          );
        }
      }
      result['groups'].add(
        group,
      );
    }
    return result;
  }

  SenBuffer encode(
    dynamic resource,
  ) {
    var newton = SenBuffer();
    assertTest(
      resource['slot_count'] != null,
      'slot_count cannot be null',
    );
    newton.writeUInt32LE(
      resource['slot_count'],
    );
    var groups_count = resource['groups'].length;
    newton.writeUInt32LE(groups_count);
    for (var group_index = 0; group_index < groups_count; ++group_index) {
      var m_data = resource['groups'][group_index];
      switch (m_data['type']) {
        case 'composite':
          {
            newton.writeUInt8(
              0x01,
            );
            break;
          }
        case 'simple':
          {
            newton.writeUInt8(
              0x02,
            );
            break;
          }
        default:
          {
            throw Exception(
              'Unknown group type',
            );
          }
      }
      var subgroups_count =
          m_data['subgroups'] == null ? 0x00 : m_data['subgroups'].length;
      var resources_count =
          m_data['resources'] == null ? 0x00 : m_data['resources'].length;
      newton.writeUInt32LE(
        m_data['res'] == null ? 0x00 : int.parse(m_data['res']!),
      );
      newton.writeUInt32LE(
        subgroups_count,
      );
      newton.writeUInt32LE(
        resources_count,
      );
      newton.writeUInt8(
        0x01,
      );
      if (m_data['parent'] != null) {
        newton.writeUInt8(
          0x01,
        );
      } else {
        newton.writeUInt8(
          0x00,
        );
      }
      newton.writeUInt32LE(
        m_data['id'].length,
      );
      newton.writeString(
        m_data['id'],
      );
      if (m_data['parent'] != null) {
        newton.writeUInt32LE(
          m_data['parent'].length,
        );
        newton.writeString(
          m_data['parent'],
        );
      }
      if (m_data['type'] == 'composite') {
        assertTest(
          m_data['resources'] == null,
          'resources must be null in composite object',
        );
        for (var i = 0; i < subgroups_count; ++i) {
          var current = m_data['subgroups'][i]!;
          if (current['res'] != null) {
            newton.writeUInt32LE(
              int.parse(
                current['res'],
              ),
            );
          } else {
            newton.writeUInt32LE(
              0x00,
            );
          }
          newton.writeUInt32LE(
            current['id'].length,
          );
          newton.writeString(
            current['id'],
          );
        }
      }
      if (m_data['type'] == 'simple') {
        for (var resources_index = 0;
            resources_index < resources_count;
            ++resources_index) {
          var resource_x = m_data['resources'][resources_index];
          switch (resource_x['type']) {
            case 'Image':
              {
                newton.writeUInt8(
                  0x01,
                );
                break;
              }
            case 'PopAnim':
              {
                newton.writeUInt8(
                  0x02,
                );
                break;
              }
            case 'SoundBank':
              {
                newton.writeUInt8(
                  0x03,
                );
                break;
              }
            case 'File':
              {
                newton.writeUInt8(
                  0x04,
                );
                break;
              }
            case 'PrimeFont':
              {
                newton.writeUInt8(
                  0x05,
                );
                break;
              }
            case 'RenderEffect':
              {
                newton.writeUInt8(
                  0x06,
                );
                break;
              }
            case 'DecodedSoundBank':
              {
                newton.writeUInt8(
                  0x07,
                );
                break;
              }
            default:
              {
                throw Exception(
                  'Unknown group type: ${resource_x['type']}',
                );
              }
          }
          newton.writeUInt32LE(
            resource_x['slot'],
          );
          if (resource_x['width'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(resource_x['width']);
          }
          if (resource_x['height'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(resource_x['height']);
          }
          if (resource_x['x'] == null) {
            if (resource_x['aw'] != null &&
                resource_x['aw'] != 0 &&
                resource_x['ah'] != null &&
                resource_x['ah'] != 0) {
              newton.writeUInt32LE(
                0x00,
              );
            } else {
              newton.writeInt32LE(
                0x7FFFFFFF,
              );
            }
          } else {
            newton.writeUInt32LE(
              resource_x['x'],
            );
          }
          if (resource_x['y'] == null) {
            if (resource_x['aw'] != null &&
                resource_x['aw'] != 0 &&
                resource_x['ah'] != null &&
                resource_x['ah'] != 0) {
              newton.writeUInt32LE(
                0x00,
              );
            } else {
              newton.writeInt32LE(
                0x7FFFFFFF,
              );
            }
          } else {
            newton.writeUInt32LE(
              resource_x['y'],
            );
          }
          if (resource_x['ax'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['ax'],
            );
          }
          if (resource_x['ay'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['ay'],
            );
          }
          if (resource_x['aw'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['aw'],
            );
          }
          if (resource_x['ah'] == null) {
            newton.writeUInt32LE(
              0x00,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['ah'],
            );
          }
          if (resource_x['cols'] == null) {
            newton.writeUInt32LE(
              0x01,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['cols'],
            );
          }
          if (resource_x['rows'] == null) {
            newton.writeUInt32LE(
              0x01,
            );
          } else {
            newton.writeUInt32LE(
              resource_x['rows'],
            );
          }
          if (resource_x['atlas'] != null && resource_x['atlas']!) {
            newton.writeUInt8(
              0x01,
            );
          } else {
            newton.writeUInt8(
              0x00,
            );
          }
          newton.writeUInt8(
            0x01,
          );
          newton.writeUInt8(
            0x01,
          );
          var resource_has_parent = resource_x['parent'] != null;
          if (resource_has_parent) {
            newton.writeUInt8(
              0x01,
            );
          } else {
            newton.writeUInt8(
              0x00,
            );
          }
          newton.writeUInt32LE(
            resource_x['id'].length,
          );
          newton.writeString(
            resource_x['id'],
          );
          var path = resource_x['path'].toString();
          newton.writeUInt32LE(
            path.length,
          );
          newton.writeString(
            path,
          );
          if (resource_has_parent) {
            newton.writeUInt32LE(
              resource_x['parent']!.length,
            );
            newton.writeString(
              resource_x['parent']!,
            );
          }
          debugPrint(group_index.toString());
        }
      }
    }
    return newton;
  }
}
