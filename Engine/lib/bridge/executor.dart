// ignore_for_file: require_trailing_commas, camel_case_types, depend_on_referenced_packages, non_constant_identifier_names, unused_import, constant_identifier_names

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:path/path.dart' as path;
import 'package:sen_material_design/common/default.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

String getExtension([AppLocalizations? localizations]) {
  if (Platform.isAndroid || Platform.isLinux) {
    return 'so';
  } else if (Platform.isIOS || Platform.isMacOS) {
    return 'dylib';
  } else if (Platform.isWindows) {
    return 'dll';
  } else {
    if (localizations != null) {
      throw Exception(localizations.architecture_is_not_supported);
    } else {
      throw Exception('Architecture is not supported');
    }
  }
}

final String internalFile = 'Internal.${getExtension()}';

var internal = Platform.isAndroid
    ? "libInternal.so"
    : path.join(
        ApplicationInformation.libraryPath.value,
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
  Pointer<NativeFunction<Callback>> callback,
);
typedef ZlibCompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int dataSize,
  int level,
  Pointer<Int32> compressedSize,
  Pointer<NativeFunction<Callback>> callback,
);

final ZlibCompress = dylib
    .lookup<NativeFunction<ZlibCompressC>>('ZlibCompress')
    .asFunction<ZlibCompressDart>();

typedef ZlibUncompressC = Void Function(
  Pointer<Uint8> data,
  Int32 dataSize,
  Pointer<Pointer<Uint8>> uncompressedData,
  Pointer<Int32> uncompressedDataSize,
  Pointer<NativeFunction<Callback>> callback,
);

typedef ZlibUncompressDart = void Function(
  Pointer<Uint8> data,
  int dataSize,
  Pointer<Pointer<Uint8>> uncompressedData,
  Pointer<Int32> uncompressedDataSize,
  Pointer<NativeFunction<Callback>> callback,
);

typedef GZipCompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
  Pointer<NativeFunction<Callback>> callback,
);

typedef GZipCompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
  Pointer<NativeFunction<Callback>> callback,
);

typedef GZipUncompressC = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Int32 data_size,
  Pointer<Int32> compressed_data_size,
  Pointer<NativeFunction<Callback>> callback,
);

typedef GZipUncompressDart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int data_size,
  Pointer<Int32> compressed_data_size,
  Pointer<NativeFunction<Callback>> callback,
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
  Pointer<NativeFunction<Callback>> callback,
);

typedef VCDiffDecodeFuncDart = Pointer<Uint8> Function(
  Pointer<Int8> before,
  int beforeSize,
  Pointer<Int8> patch,
  int patchSize,
  Pointer<Int32> afterSize,
  Pointer<NativeFunction<Callback>> callback,
);

typedef VCDiffEncodeFunc = Pointer<Uint8> Function(
  Pointer<Int8> before,
  Int32 beforeSize,
  Pointer<Int8> after,
  Int32 afterSize,
  Pointer<Int32> dataSize,
  Pointer<NativeFunction<Callback>> callback,
);

typedef VCDiffEncodeFuncDart = Pointer<Uint8> Function(
  Pointer<Int8> before,
  int beforeSize,
  Pointer<Int8> after,
  int afterSize,
  Pointer<Int32> dataSize,
  Pointer<NativeFunction<Callback>> callback,
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
  Pointer<NativeFunction<Callback>> callback,
);

typedef DeflateCompressFuncDart = void Function(
  Pointer<Int8> input,
  int inputSize,
  Pointer<Pointer<Int8>> output,
  Pointer<Int32> outputSize,
  Pointer<NativeFunction<Callback>> callback,
);

typedef DeflateUncompressFunc = Void Function(
  Pointer<Uint8> input,
  Int32 inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
  Pointer<NativeFunction<Callback>> callback,
);

typedef DeflateUncompressFuncDart = void Function(
  Pointer<Uint8> input,
  int inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
  Pointer<NativeFunction<Callback>> callback,
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
  Pointer<NativeFunction<Callback>> callback,
);

typedef lzmaCompressFuncDart = void Function(
  Pointer<Uint8> input,
  int inLen,
  Pointer<Pointer<Uint8>> out,
  Pointer<Int32> outLen,
  Pointer<NativeFunction<Callback>> callback,
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

base class Box extends Struct {
  @Int32()
  external int height;

  @Int32()
  external int width;

  @Int32()
  external int padding;
}

base class Sprite extends Struct {
  @Int32()
  external int width;

  @Int32()
  external int height;

  @Int32()
  external int x;

  @Int32()
  external int y;

  @Int32()
  external int imageIndex;

  @Bool()
  external bool hasOversized;

  external Pointer<Utf8> id;
  @Int32()
  external int infoX;

  @Int32()
  external int infoY;
  @Int32()
  external int cols;

  @Int32()
  external int rows;

  external Pointer<Pointer<Utf8>> path;

  @Int32()
  external int pathSize;
}

typedef PackSpritesFunc = Pointer<Sprite> Function(
  Pointer<Sprite> list,
  Int32 size,
  Pointer<Box> box,
);

/// [list] - [Sprite] list
/// [size] - array size
/// [box] the box

typedef PackSprites = Pointer<Sprite> Function(
  Pointer<Sprite> list,
  int size,
  Pointer<Box> box,
);

final PackSprites packAtlas = dylib
    .lookup<NativeFunction<PackSpritesFunc>>(
      'packAtlas',
    )
    .asFunction();

typedef EncodeETC1FastC = Void Function(
  Pointer<Uint32>,
  Pointer<Uint64>,
  Uint32,
  Int32,
  Pointer<NativeFunction<Callback>> callback,
);

typedef EncodeETC1FastDart = void Function(
  Pointer<Uint32>,
  Pointer<Uint64>,
  int,
  int,
  Pointer<NativeFunction<Callback>> callback,
);

final EncodeETC1FastDart CompressEtc1Rgb = dylib
    .lookup<NativeFunction<EncodeETC1FastC>>(
      'EncodeETC1Fast',
    )
    .asFunction();

typedef EncodeETC1SlowC = Void Function(
  Pointer<Uint32>,
  Pointer<Uint32>,
);

typedef EncodeETC1SlowDart = void Function(
  Pointer<Uint32>,
  Pointer<Uint32>,
);

final EncodeETC1SlowDart EncodeETC1Slow = dylib
    .lookup<NativeFunction<EncodeETC1SlowC>>(
      'EncodeETC1Slow',
    )
    .asFunction();

typedef RijndaelDecryptC = Pointer<Int8> Function(
  Pointer<Int8> cipher,
  Pointer<Int8> key,
  Pointer<Int8> iv,
  Int32 keyLength,
  Int32 ivLength,
  Int32 cipherLength,
  Int32 iMode,
);

typedef RijndaelDecryptDart = Pointer<Int8> Function(
  Pointer<Int8> cipher,
  Pointer<Int8> key,
  Pointer<Int8> iv,
  int keyLength,
  int ivLength,
  int cipherLength,
  int iMode,
);

final RijndaelDecryptDart RijndaelDecrypt = dylib
    .lookup<NativeFunction<RijndaelDecryptC>>(
      'RijndaelDecrypt',
    )
    .asFunction();

typedef RijndaelEncryptC = Pointer<Int8> Function(
  Pointer<Int8> cipher,
  Pointer<Int8> key,
  Pointer<Int8> iv,
  Int32 keyLength,
  Int32 ivLength,
  Int32 cipherLength,
  Int32 iMode,
);

typedef RijndaelEncryptDart = Pointer<Int8> Function(
  Pointer<Int8> cipher,
  Pointer<Int8> key,
  Pointer<Int8> iv,
  int keyLength,
  int ivLength,
  int cipherLength,
  int iMode,
);

final RijndaelEncryptDart RijndaelEncrypt = dylib
    .lookup<NativeFunction<RijndaelEncryptC>>(
      'RijndaelEncrypt',
    )
    .asFunction();

typedef DecodeETC1C = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  Uint64 size,
  Int32 width,
  Int32 height,
);

typedef DecodeETC1Dart = Pointer<Uint8> Function(
  Pointer<Uint8> data,
  int size,
  int width,
  int height,
);

final DecodeETC1Dart DecodeETC1Block = dylib
    .lookup<NativeFunction<DecodeETC1C>>(
      'DecodeETC1',
    )
    .asFunction();

typedef Callback = Void Function(Pointer<Utf8>);
typedef NativeCallback = Void Function(Pointer<Utf8>);

// Define the type for the C function.
typedef TestC = Void Function(Pointer<NativeFunction<Callback>> callback);
typedef TestDart = void Function(
    Pointer<NativeFunction<NativeCallback>> callback);
final cb = dylib.lookupFunction<TestC, TestDart>('test');

void testPrint(Pointer<Utf8> message) {
  // ignore: avoid_print
  print(message.toDartString());
  return;
}

void testError(Pointer<Utf8> message) {
  final String msg = message.toDartString();
  throw Exception(msg);
}
