// ignore_for_file: depend_on_referenced_packages, constant_identifier_names

import 'dart:typed_data';
import 'dart:ffi';
import 'package:ffi/ffi.dart';
import 'package:sen_material_design/bridge/executor.dart';

/// Rijndael Mode from Internal

enum RijndaelMode {
  ECB,

  CBC,

  CFB,
}

/// Rijndael Encrypt/Decrypt call from Internal

class Rijndael {
  static Uint8List decrypt(
    Uint8List cipher,
    String key,
    String iv,
    RijndaelMode iMode,
  ) {
    Pointer<Int8> cipherPtr = calloc<Int8>(
      cipher.length,
    );
    cipherPtr.asTypedList(cipher.length).setAll(
          0,
          cipher,
        );
    Pointer<Int8> keyPtr = calloc<Int8>(
      key.length,
    );
    keyPtr.asTypedList(key.length).setAll(
          0,
          key.codeUnits,
        );
    Pointer<Int8> ivPtr = calloc<Int8>(
      iv.length,
    );
    ivPtr.asTypedList(iv.length).setAll(
          0,
          iv.codeUnits,
        );
    final Pointer<Int8> result = RijndaelDecrypt(
      cipherPtr,
      keyPtr,
      ivPtr,
      key.length,
      iv.length,
      cipher.length,
      1,
    );
    final resultData = result.asTypedList(cipher.length);
    return Uint8List.fromList(
      resultData,
    );
  }

  static Uint8List encrypt(
    Uint8List cipher,
    String key,
    String iv,
    RijndaelMode iMode,
  ) {
    Pointer<Int8> cipherPtr = calloc<Int8>(
      cipher.length,
    );
    cipherPtr.asTypedList(cipher.length).setAll(
          0,
          cipher,
        );
    Pointer<Int8> keyPtr = calloc<Int8>(
      key.length,
    );
    keyPtr.asTypedList(key.length).setAll(
          0,
          key.codeUnits,
        );
    Pointer<Int8> ivPtr = calloc<Int8>(
      iv.length,
    );
    ivPtr.asTypedList(iv.length).setAll(
          0,
          iv.codeUnits,
        );
    final Pointer<Int8> result = RijndaelEncrypt(
      cipherPtr,
      keyPtr,
      ivPtr,
      key.length,
      iv.length,
      cipher.length,
      1,
    );
    final resultData = result.asTypedList(cipher.length);
    return Uint8List.fromList(
      resultData,
    );
  }
}
