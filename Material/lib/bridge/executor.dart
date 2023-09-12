// ignore_for_file: require_trailing_commas, camel_case_types, depend_on_referenced_packages, non_constant_identifier_names, unused_import

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:path/path.dart' as path;
import 'package:sen_material_design/common/basic.dart';

String getExtension() {
  if (Platform.isAndroid || Platform.isLinux) {
    return 'so';
  } else if (Platform.isIOS || Platform.isMacOS) {
    return 'dylib';
  } else if (Platform.isWindows) {
    return 'dll';
  } else {
    throw Exception(
      'Architecture is not supported',
    );
  }
}

final String internalFile = 'Internal.${getExtension()}';

var internal = path.join(
  ApplicationInformation.internalPath.value,
  internalFile,
);

final dylib = DynamicLibrary.open(
  internal,
);

typedef ZlibCompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 dataSize,
  Int32 level,
  Pointer<Int32> compressedSize,
);
typedef ZlibCompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int dataSize,
  int level,
  Pointer<Int32> compressedSize,
);

final ZlibCompress = dylib
    .lookup<NativeFunction<ZlibCompressC>>('ZlibCompress')
    .asFunction<ZlibCompressDart>();

typedef ZlibUncompressC = Void Function(
  Pointer<Uint8> data,
  Int32 dataSize,
  Pointer<Pointer<Uint8>> uncompressedData,
  Pointer<Int32> uncompressedDataSize,
);
typedef ZlibUncompressDart = void Function(
  Pointer<Uint8> data,
  int dataSize,
  Pointer<Pointer<Uint8>> uncompressedData,
  Pointer<Int32> uncompressedDataSize,
);

final ZlibUncompress = dylib
    .lookup<NativeFunction<ZlibUncompressC>>('ZlibUncompress')
    .asFunction<ZlibUncompressDart>();
