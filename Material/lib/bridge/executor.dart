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

var internal = Platform.isAndroid
    ? "libInternal.so"
    : path.join(
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

typedef GZipCompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
);

typedef GZipCompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
);

typedef GZipUncompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
);

typedef GZipUncompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
);

final ZlibUncompress = dylib
    .lookup<NativeFunction<ZlibUncompressC>>('ZlibUncompress')
    .asFunction<ZlibUncompressDart>();

final GZipCompress = dylib
    .lookup<NativeFunction<GZipCompressC>>('GZipCompress')
    .asFunction<GZipCompressDart>();

final GZipUncompress = dylib
    .lookup<NativeFunction<GZipUncompressC>>('GZipUncompress')
    .asFunction<GZipUncompressDart>();
