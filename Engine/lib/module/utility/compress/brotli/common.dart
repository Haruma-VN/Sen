// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import 'dart:ffi';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

class Brotli {
  // Constructor
  Brotli();

  /// pass [dataStream] to compress
  static Uint8List compress(
    Uint8List dataStream,
  ) {
    final Pointer<Uint8> data = calloc<Uint8>(
      dataStream.length,
    )..asTypedList(
        dataStream.length,
      ).setAll(
        0,
        dataStream,
      );
    final int data_size = dataStream.length;
    final Pointer<Int32> compressed_data_size = calloc<Int32>();
    final Pointer<Uint8> compressedDataPtr = BrotliCompress(
      data,
      data_size,
      compressed_data_size,
    );
    final compressedData = compressedDataPtr.asTypedList(
      compressed_data_size.value,
    );
    calloc.free(data);
    calloc.free(compressed_data_size);
    calloc.free(compressedDataPtr);
    return Uint8List.fromList(
      compressedData,
    );
  }

  static Uint8List uncompress(
    Uint8List dataStream,
  ) {
    final Pointer<Uint8> data = calloc<Uint8>(
      dataStream.length,
    )..asTypedList(dataStream.length).setAll(
        0,
        dataStream,
      );
    final int data_size = dataStream.length;
    final Pointer<Int32> compressed_data_size = calloc<Int32>();
    final Pointer<Uint8> compressedDataPtr = BrotliUncompress(
      data,
      data_size,
      compressed_data_size,
    );
    final compressedData = compressedDataPtr.asTypedList(
      compressed_data_size.value,
    );
    calloc.free(data);
    calloc.free(compressed_data_size);
    calloc.free(compressedDataPtr);
    return Uint8List.fromList(
      compressedData,
    );
  }

  static compressFile(
    String inFile,
    String outFile,
  ) {
    var inFs = SenBuffer.OpenFile(
      inFile,
    );
    var outFs = SenBuffer.fromBytes(
      Brotli.compress(
        inFs.toBytes(),
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
      Brotli.uncompress(
        inFs.toBytes(),
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }
}
