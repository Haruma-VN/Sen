// ignore_for_file: unused_import, unused_local_variable

import "package:path/path.dart" as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/from_resinfo.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/pack.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/unpack.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/unpack_for_modding.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_group/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/to_resinfo.dart';
import 'package:sen_material_design/module/tool/popcap/reflection_object_notation/common.dart';

class PackModding {
  static void process(
    String inputDirectory,
    String outputFile,
    bool useResInfo,
    bool encryptRton,
    AppLocalizations? localizations,
  ) {
    final dynamic manifest = FileSystem.readJson(
      p.join(
        inputDirectory,
        "manifest.json",
      ),
    );
    final String resInfoFile = p.join(
      inputDirectory,
      "res.json",
    );
    final String resourceDirectory = p.join(inputDirectory, 'resource');
    final List<dynamic> keys = manifest['group'].keys.toList();
    final String? manifestGroup = keys.firstWhere(
      (dynamic rsg) => RegExp(r'__MANIFESTGROUP__(.+)?', caseSensitive: false)
          .hasMatch(rsg.toString()),
      orElse: () => null,
    );
    if (manifestGroup == null) {
      throw Exception('MANIFESTGROUP cannot be null');
    }
    bool resourceHasNewton = false;
    bool resourceHasRton = false;
    bool hasConverted = false;
    for (var e in (manifest['group'][manifestGroup]['subgroup'][manifestGroup]
        ['packet_info']['res'] as List<dynamic>)) {
      final view =
          (e['path'] as List<dynamic>)[e['path'].length - 1].toString();
      if (view.endsWith('.NEWTON')) {
        resourceHasNewton = true;
      }
      if (view.endsWith('.RTON')) {
        resourceHasRton = true;
      }
    }
    if (!resourceHasRton && !resourceHasNewton) {
      throw Exception('Unsupported MANIFESTGROUP');
    }
    if (resourceHasNewton) {
      var newton = Newton();
      var newtonFile = UnpackModding.joinFs(
        resourceDirectory,
        (manifest['group'][manifestGroup]['subgroup'][manifestGroup]
                ['packet_info']['res'] as List<dynamic>)
            .firstWhere(
          (dynamic e) => (e['path'] as List<dynamic>)[e['path'].length - 1]
              .toString()
              .endsWith('.NEWTON'),
        )['path'],
      );
      var jsonFile = '${p.withoutExtension(newtonFile)}.json';
      if (useResInfo) {
        ConvertFromResInfo.process(resInfoFile, jsonFile);
        hasConverted = true;
      } else {
        ConvertToResInfo.process(
          jsonFile,
          resInfoFile,
          FileSystem.readJson(resInfoFile)['expand_path'].toString() == 'string'
              ? ExpandPath.string
              : ExpandPath.array,
        );
        hasConverted = true;
      }
      final SenBuffer newtonData = newton.encode(
        FileSystem.readJson(
          jsonFile,
        ),
        localizations,
      );
      newtonData.outFile('${p.withoutExtension(newtonFile)}.newton');
    }
    if (resourceHasRton) {
      var rton = ReflectionObjectNotation();
      var rtonFile = UnpackModding.joinFs(
        resourceDirectory,
        (manifest['group'][manifestGroup]['subgroup'][manifestGroup]
                ['packet_info']['res'] as List<dynamic>)
            .firstWhere(
          (dynamic e) => (e['path'] as List<dynamic>)[e['path'].length - 1]
              .toString()
              .endsWith('.RTON'),
        )['path'],
      );
      var jsonFile = '${p.withoutExtension(rtonFile)}.json';
      if (!hasConverted) {
        if (useResInfo) {
          ConvertFromResInfo.process(resInfoFile, jsonFile);
          hasConverted = true;
        } else {
          ConvertToResInfo.process(
            jsonFile,
            resInfoFile,
            FileSystem.readJson(resInfoFile)['expand_path'].toString() ==
                    'string'
                ? ExpandPath.string
                : ExpandPath.array,
          );
          hasConverted = true;
        }
      }
      final SenBuffer rtonData = rton.encodeRTON(
        FileSystem.readJson('${p.withoutExtension(rtonFile)}.json'),
        false,
        null,
        localizations,
      );
      rtonData.outFile(rtonFile);
    }
    final packages = keys.firstWhere(
      (dynamic rsg) => rsg.toString().toUpperCase() == 'PACKAGES',
      orElse: () => null,
    );
    if (packages != null) {
      final rsg = ResourceStreamGroup();
      final packagesPath = p.join(inputDirectory, 'resource', 'PACKAGES');
      FileSystem.readDirectory(packagesPath, true).forEach((element) {
        if (p.withoutExtension(element).endsWith('.JSON')) {
          ReflectionObjectNotation.encode_fs(
            element,
            '${p.withoutExtension(element)}.RTON',
            encryptRton,
            RijndaelC.has(
              ApplicationInformation.encryptionKey.value,
              ApplicationInformation.encryptionKey.value.substring(4, 28),
            ),
            localizations,
          );
        }
      });
      final SenBuffer packagesRSG = rsg.packRSG(
        packagesPath,
        manifest['group'][packages][packages],
        localizations,
        false,
      );
      packagesRSG.outFile(
        p.join(inputDirectory, 'packet', '$packages.rsg'),
      );
    }
    Pack.process(
      inputDirectory,
      outputFile,
      localizations,
    );
    return;
  }
}
