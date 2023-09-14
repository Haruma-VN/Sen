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

typedef MD5HashFunc = Pointer<Utf8> Function(
  Pointer<Uint8> data,
  Int32 size,
);

typedef MD5HashFuncDart = Pointer<Utf8> Function(
  Pointer<Uint8> data,
  int size,
);

typedef VCDiffDecodeFunc = Pointer<Uint8> Function(
  Pointer<Int8> before,
  Int32 beforeSize,
  Pointer<Int8> patch,
  Int32 patchSize,
  Pointer<Int32> afterSize,
);

typedef VCDiffDecodeFuncDart = Pointer<Uint8> Function(
  Pointer<Int8> before,
  int beforeSize,
  Pointer<Int8> patch,
  int patchSize,
  Pointer<Int32> afterSize,
);

typedef VCDiffEncodeFunc = Pointer<Uint8> Function(
  Pointer<Int8> before,
  Int32 beforeSize,
  Pointer<Int8> after,
  Int32 afterSize,
  Pointer<Int32> dataSize,
);

typedef VCDiffEncodeFuncDart = Pointer<Uint8> Function(
  Pointer<Int8> before,
  int beforeSize,
  Pointer<Int8> after,
  int afterSize,
  Pointer<Int32> dataSize,
);

final ZlibUncompress = dylib
    .lookup<NativeFunction<ZlibUncompressC>>(
      'ZlibUncompress',
    )
    .asFunction<ZlibUncompressDart>();

final GZipCompress = dylib
    .lookup<NativeFunction<GZipCompressC>>(
      'GZipCompress',
    )
    .asFunction<GZipCompressDart>();

final GZipUncompress = dylib
    .lookup<NativeFunction<GZipUncompressC>>(
      'GZipUncompress',
    )
    .asFunction<GZipUncompressDart>();

final MD5HashFuncDart MD5Hash = dylib
    .lookup<NativeFunction<MD5HashFunc>>(
      'MD5Hash',
    )
    .asFunction();

final VCDiffDecodeFuncDart VCDiffDecode = dylib
    .lookup<NativeFunction<VCDiffDecodeFunc>>(
      'VCDiffDecode',
    )
    .asFunction();

final VCDiffEncodeFuncDart VCDiffEncode = dylib
    .lookup<NativeFunction<VCDiffEncodeFunc>>(
      'VCDiffEncode',
    )
    .asFunction();

typedef DeflateCompressFunc = Void Function(
  Pointer<Int8> input,
  Int32 inputSize,
  Pointer<Pointer<Int8>> output,
  Pointer<Int32> outputSize,
);

typedef DeflateCompressFuncDart = void Function(
  Pointer<Int8> input,
  int inputSize,
  Pointer<Pointer<Int8>> output,
  Pointer<Int32> outputSize,
);

typedef DeflateUncompressFunc = Void Function(
  Pointer<Uint8> input,
  Int32 inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

typedef DeflateUncompressFuncDart = void Function(
  Pointer<Uint8> input,
  int inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

typedef InternalVersion = int Function();

typedef InternalVersionC = Int32 Function();

final DeflateCompressFuncDart DeflateCompress = dylib
    .lookup<NativeFunction<DeflateCompressFunc>>(
      'DeflateCompress',
    )
    .asFunction();

final DeflateUncompressFuncDart DeflateUncompress = dylib
    .lookup<NativeFunction<DeflateUncompressFunc>>(
      'DeflateUncompress',
    )
    .asFunction();

final InternalVersion internalVersion = dylib
    .lookup<NativeFunction<InternalVersionC>>(
      'InternalVersion',
    )
    .asFunction();

typedef BrotliUncompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
);

typedef BrotliUncompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
);

final BrotliUncompressDart BrotliUncompress = dylib
    .lookup<NativeFunction<BrotliUncompressC>>(
      'BrotliUncompress',
    )
    .asFunction();

typedef BrotliCompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
);

typedef BrotliCompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
);

final BrotliCompressDart BrotliCompress = dylib
    .lookup<NativeFunction<BrotliCompressC>>(
      'BrotliCompress',
    )
    .asFunction();

typedef lzmaCompressFunc = Void Function(
  Pointer<Uint8> input,
  Int32 inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

typedef lzmaCompressFuncDart = void Function(
  Pointer<Uint8> input,
  int inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

final lzmaCompressFuncDart lzmaCompress = dylib
    .lookup<NativeFunction<lzmaCompressFunc>>(
      'lzmaCompress',
    )
    .asFunction();

typedef lzmaUncompressFunc = Void Function(
  Pointer<Uint8> input,
  Int32 inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

typedef lzmaUncompressFuncDart = void Function(
  Pointer<Uint8> input,
  int inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
);

final lzmaUncompressFuncDart lzmaUncompress = dylib
    .lookup<NativeFunction<lzmaUncompressFunc>>(
      'lzmaUncompress',
    )
    .asFunction();
