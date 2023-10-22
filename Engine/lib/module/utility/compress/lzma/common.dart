// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names, camel_case_types

import 'dart:ffi';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

class lzma {
  static Uint8List compress(Uint8List dataStream) {
    final Pointer<Uint8> data = calloc<Uint8>(dataStream.length)
      ..asTypedList(dataStream.length).setAll(0, dataStream);
    Pointer<Pointer<Uint8>> outputPtr = calloc<Pointer<Uint8>>();
    Pointer<Int32> outputSizePtr = calloc<Int32>();
    lzmaCompress(
      data,
      dataStream.length,
      outputPtr,
      outputSizePtr,
      Pointer.fromFunction(testError),
    );
    Pointer<Uint8> resultPtr = outputPtr.value;
    int resultSize = outputSizePtr.value;
    final Uint8List result = resultPtr.asTypedList(resultSize);
    calloc.free(data);
    calloc.free(outputPtr);
    calloc.free(outputSizePtr);
    return Uint8List.fromList(result);
  }

  static Uint8List uncompress(Uint8List data) {
    Pointer<Uint8> dataPtr = calloc(data.length);
    dataPtr.asTypedList(data.length).setAll(0, data);
    Pointer<Pointer<Uint8>> outputPtr = calloc<Pointer<Uint8>>();
    Pointer<Int32> outputSizePtr = calloc<Int32>();
    lzmaUncompress(dataPtr, data.length, outputPtr, outputSizePtr);
    Pointer<Uint8> resultPtr = outputPtr.value;
    int resultSize = outputSizePtr.value;
    final Uint8List result = resultPtr.asTypedList(resultSize);
    calloc.free(dataPtr);
    calloc.free(outputPtr);
    calloc.free(outputSizePtr);
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
      lzma.compress(
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
      lzma.uncompress(
        inFs.toBytes(),
      ),
    );
    outFs.outFile(
      outFile,
    );
    return;
  }
}
