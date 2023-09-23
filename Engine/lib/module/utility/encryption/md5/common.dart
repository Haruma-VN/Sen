// ignore_for_file: depend_on_referenced_packages

import "dart:ffi";
import "package:ffi/ffi.dart";
import "dart:typed_data";
import "package:sen_material_design/bridge/executor.dart";
import 'dart:convert';

import "package:sen_material_design/module/utility/buffer/common.dart";

/// MD5 Hash from Internal

class MD5 {
  /// pass [data] to hash
  static String hash(
    Uint8List data,
  ) {
    Pointer<Uint8> dataPtr = calloc<Uint8>(
      data.length,
    );
    dataPtr.asTypedList(data.length).setAll(
          0,
          data,
        );
    Pointer<Utf8> resultPtr = MD5Hash(
      dataPtr,
      data.length,
    );
    String result = resultPtr.toDartString();
    calloc.free(dataPtr);
    return result;
  }

  /// pass [data] to hash
  static String hashString(
    String data,
  ) =>
      (hash(
        Uint8List.fromList(
          utf8.encode(
            data,
          ),
        ),
      ));

  static String hashFile(
    String file,
  ) =>
      (hash(
        SenBuffer.OpenFile(file).toBytes(),
      ));
}
