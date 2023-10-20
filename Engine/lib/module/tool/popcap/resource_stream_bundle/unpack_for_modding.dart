import 'package:sen_material_design/module/tool/popcap/new_type_object_notation/common.dart';
import 'package:sen_material_design/module/tool/popcap/reflection_object_notation/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/to_resinfo.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_group/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:path/path.dart" as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum ExtendsTextureInformation {
  sz16,
  sz20,
  sz24,
}

class UnpackModding {
  static String joinFs(String source, List<dynamic> dst) {
    String destination = source;
    for (var e in dst) {
      destination = p.join(destination, e.toString());
    }
    return destination;
  }

  // ignore: non_constant_identifier_names
  static void process_fs(
    String inFile,
    String outputDirectory,
    ExtendsTextureInformation extendsTextureInformation,
    ExpandPath expandPath,
    AppLocalizations? localizations,
  ) {
    final unpack = UnpackModding();
    unpack.unpack_fs(
      inFile,
      outputDirectory,
      extendsTextureInformation,
      expandPath,
      localizations,
    );
    return;
  }

  // ignore: non_constant_identifier_names
  void unpack_fs(
    String inFile,
    String outputDirectory,
    ExtendsTextureInformation extendsTextureInformation,
    ExpandPath expandPath,
    AppLocalizations? localizations,
  ) {
    final senFile = SenBuffer.OpenFile(inFile);
    final String resourceDirectory = p.join(outputDirectory, 'resource');
    final rsb = ResourceStreamBundle();
    final manifestRaw = rsb.unpackRSB(
      senFile,
      outputDirectory,
      localizations,
    );
    final manifest = {
      'extends_texture_information_for_pvz2c': extendsTextureInformation.index,
      ...manifestRaw,
    };
    FileSystem.writeJson(
      p.join(outputDirectory, "manifest.json"),
      manifest,
      "\t",
    );
    final List<dynamic> keys = manifest['group'].keys.toList();
    final String? manifestGroup = keys.firstWhere(
      (dynamic rsg) => RegExp(r'__MANIFESTGROUP__(.+)?', caseSensitive: false)
          .hasMatch(rsg.toString()),
      orElse: () => null,
    );
    if (manifestGroup == null) {
      throw Exception('MANIFESTGROUP cannot be null');
    }
    final packages = keys.firstWhere(
      (dynamic rsg) => rsg.toString().toUpperCase() == 'PACKAGES',
      orElse: () => null,
    );
    final rsg = ResourceStreamGroup();
    rsg.unpackRSG(
      SenBuffer.OpenFile(
        p.join(outputDirectory, 'packet', '$manifestGroup.rsg'),
      ),
      resourceDirectory,
      false,
      false,
    );
    if (packages != null) {
      rsg.unpackRSG(
        SenBuffer.OpenFile(
          p.join(outputDirectory, 'packet', '$packages.rsg'),
        ),
        resourceDirectory,
        false,
        false,
      );
    }
    bool resourceHasNewton = false;
    bool resourceHasRton = false;
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
    dynamic json;
    String resourceDestination = '';
    if (resourceHasNewton && !resourceHasRton) {
      var newton = Newton();
      var resourceFile = joinFs(
        resourceDirectory,
        (manifest['group'][manifestGroup]['subgroup'][manifestGroup]
                ['packet_info']['res'] as List<dynamic>)
            .firstWhere(
          (dynamic e) => (e['path'] as List<dynamic>)[e['path'].length - 1]
              .toString()
              .endsWith('.NEWTON'),
        )['path'],
      );
      json = newton.decode(
        SenBuffer.OpenFile(
          resourceFile,
        ),
        localizations,
      );
      resourceDestination = '${p.withoutExtension(resourceFile)}.json';
    }
    if ((resourceHasNewton && resourceHasRton) ||
        (!resourceHasNewton && resourceHasRton)) {
      var rton = ReflectionObjectNotation();
      var resourceFile = joinFs(
        resourceDirectory,
        (manifest['group'][manifestGroup]['subgroup'][manifestGroup]
                ['packet_info']['res'] as List<dynamic>)
            .firstWhere(
          (dynamic e) => (e['path'] as List<dynamic>)[e['path'].length - 1]
              .toString()
              .endsWith('.RTON'),
        )['path'],
      );
      json = rton.decodeRTON(
        SenBuffer.OpenFile(resourceFile),
        false,
        null,
        localizations,
      );
      resourceDestination = '${p.withoutExtension(resourceFile)}.json';
    }
    FileSystem.writeJson(
      resourceDestination,
      json,
      '\t',
    );
    ConvertToResInfo.process(
      resourceDestination,
      p.join(outputDirectory, 'res.json'),
      expandPath,
    );
    return;
  }
}
