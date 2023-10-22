// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import 'dart:ffi';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

class Deflate {
  static Uint8List compress(Uint8List dataStream) {
    final data = calloc<Int8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    Pointer<Pointer<Int8>> outputPtr = calloc<Pointer<Int8>>();
    Pointer<Int32> outputSizePtr = calloc<Int32>();
    DeflateCompress(data, dataStream.length, outputPtr, outputSizePtr);
    Pointer<Int8> resultPtr = outputPtr.value;
    final result = resultPtr.asTypedList(outputSizePtr.value);
    calloc.free(data);
    calloc.free(outputPtr);
    calloc.free(outputSizePtr);
    calloc.free(resultPtr);
    return Uint8List.fromList(result);
  }

  static Uint8List uncompress(Uint8List data) {
    Pointer<Uint8> dataPtr = calloc(data.length);
    dataPtr.asTypedList(data.length).setAll(0, data);
    Pointer<Pointer<Uint8>> outputPtr = calloc<Pointer<Uint8>>();
    Pointer<Int32> outputSizePtr = calloc<Int32>();
    DeflateUncompress(dataPtr, data.length, outputPtr, outputSizePtr);
    Pointer<Uint8> resultPtr = outputPtr.value;
    int resultSize = outputSizePtr.value;
    final result = resultPtr.asTypedList(resultSize);
    calloc.free(dataPtr);
    calloc.free(outputPtr);
    calloc.free(outputSizePtr);
    calloc.free(resultPtr);
    return Uint8List.fromList(result);
  }

  static compressFile(
    String inFile,
    String outFile,
  ) {
    var inFs = SenBuffer.OpenFile(
      inFile,
    );
    var outFs = SenBuffer.fromBytes(
      Deflate.compress(
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
      Deflate.uncompress(
        inFs.toBytes(),
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }
}
