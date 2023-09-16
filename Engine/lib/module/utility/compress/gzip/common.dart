// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import 'dart:ffi';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

class Gzip {
  // Constructor
  Gzip();

  /// pass [dataStream] to compress
  static Uint8List compress(
    Uint8List dataStream,
  ) {
    final data = calloc<Uint8>(
      dataStream.length,
    )..asTypedList(
        dataStream.length,
      ).setAll(
        0,
        dataStream,
      );
    final data_size = dataStream.length;
    final compressed_data_size = calloc<Int32>();
    final Pointer<Uint8> compressedDataPtr = GZipCompress(
      data,
      data_size,
      compressed_data_size,
    );
    final compressedData = compressedDataPtr.asTypedList(
      compressed_data_size.value,
    );
    return Uint8List.fromList(
      compressedData,
    );
  }

  static Uint8List uncompress(
    Uint8List dataStream,
  ) {
    final data = calloc<Uint8>(
      dataStream.length,
    )..asTypedList(dataStream.length).setAll(
        0,
        dataStream,
      );
    final data_size = dataStream.length;
    final compressed_data_size = calloc<Int32>();
    final Pointer<Uint8> compressedDataPtr = GZipUncompress(
      data,
      data_size,
      compressed_data_size,
    );
    final compressedData = compressedDataPtr.asTypedList(
      compressed_data_size.value,
    );
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
      Gzip.compress(
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
      Gzip.uncompress(
        inFs.toBytes(),
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }
}
