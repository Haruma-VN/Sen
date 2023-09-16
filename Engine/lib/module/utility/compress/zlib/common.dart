// ignore_for_file: depend_on_referenced_packages

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'dart:typed_data';

import 'package:sen_material_design/module/utility/buffer/common.dart';

class Zlib {
  /// Pass [dataStream] and [compressionLevel] to compress zlib
  static Uint8List compress(
    Uint8List dataStream,
    int compressionLevel,
  ) {
    final dataPointer = calloc<Uint8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    final compressedSizePointer = calloc<Int32>();

    final compressedDataPointer = ZlibCompress(
      dataPointer,
      dataStream.length,
      compressionLevel,
      compressedSizePointer,
    );

    final compressedData =
        compressedDataPointer.asTypedList(compressedSizePointer.value);

    return Uint8List.fromList(compressedData);
  }

  /// Pass [dataStream] to uncompress zlib
  static Uint8List uncompress(
    Uint8List dataStream,
  ) {
    final dataPointer = calloc<Uint8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    final uncompressedDataPointer = calloc<Pointer<Uint8>>();
    final uncompressedDataSizePointer = calloc<Int32>();

    ZlibUncompress(
      dataPointer,
      dataStream.length,
      uncompressedDataPointer,
      uncompressedDataSizePointer,
    );

    final uncompressedData = uncompressedDataPointer.value
        .asTypedList(uncompressedDataSizePointer.value);

    calloc.free(dataPointer);
    calloc.free(uncompressedDataPointer);
    calloc.free(uncompressedDataSizePointer);

    return Uint8List.fromList(uncompressedData);
  }

  static compressFile(
    String inFile,
    String outFile,
    int level,
  ) {
    var inFs = SenBuffer.OpenFile(
      inFile,
    );
    var outFs = SenBuffer.fromBytes(
      Zlib.compress(
        inFs.toBytes(),
        level,
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }

  static uncompressFile(
    String inFile,
    String outFile,
  ) {
    var inFs = SenBuffer.OpenFile(
      inFile,
    );
    var outFs = SenBuffer.fromBytes(
      Zlib.uncompress(
        inFs.toBytes(),
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }
}
