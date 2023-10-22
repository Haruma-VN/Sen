// ignore_for_file: depend_on_referenced_packages

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'dart:typed_data';

import 'package:sen_material_design/module/utility/buffer/common.dart';

class Zlib {
  static Uint8List uncompress(Uint8List dataStream) {
    final Pointer<Uint8> dataPointer = calloc<Uint8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    final Pointer<Pointer<Uint8>> uncompressedDataPointer =
        calloc<Pointer<Uint8>>();
    final Pointer<Int32> uncompressedDataSizePointer = calloc<Int32>();
    ZlibUncompress(
      dataPointer,
      dataStream.length,
      uncompressedDataPointer,
      uncompressedDataSizePointer,
    );
    final Uint8List uncompressedData = uncompressedDataPointer.value
        .asTypedList(uncompressedDataSizePointer.value);
    calloc.free(dataPointer);
    calloc.free(uncompressedDataPointer);
    calloc.free(uncompressedDataSizePointer);
    return Uint8List.fromList(uncompressedData);
  }

  static Uint8List compress(Uint8List dataStream, int compressionLevel) {
    final Pointer<Uint8> dataPointer = calloc<Uint8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    final Pointer<Int32> compressedSizePointer = calloc<Int32>();
    final Pointer<Uint8> compressedDataPointer = ZlibCompress(
      dataPointer,
      dataStream.length,
      compressionLevel,
      compressedSizePointer,
    );
    final Uint8List compressedData =
        compressedDataPointer.asTypedList(compressedSizePointer.value);
    calloc.free(dataPointer);
    calloc.free(compressedSizePointer);
    calloc.free(compressedDataPointer);
    return Uint8List.fromList(compressedData);
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
