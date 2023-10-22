// ignore_for_file: depend_on_referenced_packages, non_constant_identifier_names

import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'dart:typed_data';
import 'package:sen_material_design/bridge/executor.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

// Open-VCDiff from Google : C++ API

class VCDiff {
  static Uint8List decode(
    Uint8List before,
    Uint8List patch,
  ) {
    Pointer<Int8> beforePtr = calloc(before.length);
    beforePtr.asTypedList(before.length).setAll(0, before);
    Pointer<Int8> patchPtr = calloc(patch.length);
    patchPtr.asTypedList(patch.length).setAll(0, patch);
    final Pointer<Int32> afterPointer = calloc<Int32>();
    Pointer<Uint8> resultPtr = VCDiffDecode(
      beforePtr,
      before.length,
      patchPtr,
      patch.length,
      afterPointer,
    );
    final data = resultPtr.asTypedList(afterPointer.value);
    calloc.free(beforePtr);
    calloc.free(patchPtr);
    calloc.free(afterPointer);
    calloc.free(resultPtr);
    return Uint8List.fromList(data);
  }

  static Uint8List encode(
    Uint8List before,
    Uint8List after,
  ) {
    Pointer<Int8> beforePtr = calloc(before.length);
    beforePtr.asTypedList(before.length).setAll(0, before);
    Pointer<Int8> afterPtr = calloc(after.length);
    afterPtr.asTypedList(after.length).setAll(0, after);
    final patchPointer = calloc<Int32>();
    Pointer<Uint8> resultPtr = VCDiffEncode(
      beforePtr,
      before.length,
      afterPtr,
      after.length,
      patchPointer,
    );
    final data = resultPtr.asTypedList(patchPointer.value);
    calloc.free(beforePtr);
    calloc.free(afterPtr);
    calloc.free(patchPointer);
    calloc.free(resultPtr);
    return Uint8List.fromList(data);
  }

  static void decodeFile(
    String before_file,
    String patch_file,
    String out_file,
  ) {
    var before = SenBuffer.OpenFile(before_file);
    var patch = SenBuffer.OpenFile(patch_file);
    var after = SenBuffer.fromBytes(
      VCDiff.decode(
        before.toBytes(),
        patch.toBytes(),
      ),
    );
    after.outFile(
      out_file,
    );
    return;
  }

  static void encodeFile(
    String before_file,
    String after_file,
    String out_file,
  ) {
    var before = SenBuffer.OpenFile(before_file);
    var after = SenBuffer.OpenFile(after_file);
    var patch_file = SenBuffer.fromBytes(
      VCDiff.encode(
        before.toBytes(),
        after.toBytes(),
      ),
    );
    patch_file.outFile(
      out_file,
    );
    return;
  }
}
