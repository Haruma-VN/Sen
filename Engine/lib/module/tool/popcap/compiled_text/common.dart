// ignore_for_file: non_constant_identifier_names

import 'dart:typed_data';
import 'package:sen_material_design/module/tool/popcap/reflection_object_notation/common.dart';
import 'package:sen_material_design/module/tool/popcap/zlib/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/compress/base64/common.dart';
import 'package:sen_material_design/module/utility/encryption/Rijndael/common.dart';

class CompiledText {
  SenBuffer decode(
    SenBuffer raw,
    RijndaelC rijndael,
    bool use64BitVariant,
  ) {
    final SenBuffer decodedBase64 =
        SenBuffer.fromBytes(Base64.decode(raw.toBytes()));
    final SenBuffer ripe = PopCapZlib.uncompress(
      SenBuffer.fromBytes(
        Rijndael.decrypt(
          decodedBase64.getBytes(decodedBase64.length - 2, 2),
          rijndael.key,
          rijndael.iv,
          RijndaelMode.CBC,
        ),
      ),
      use64BitVariant,
    );
    return ripe;
  }

  SenBuffer encode(
    SenBuffer raw,
    RijndaelC rijndael,
    bool use64BitVariant,
  ) {
    final SenBuffer compressedData = PopCapZlib.compress(raw, use64BitVariant);
    ReflectionObjectNotation.fillRijndaelBlock(
      compressedData,
      SenBuffer.fromBytes(Uint8List.fromList(rijndael.iv.codeUnits)),
    );
    final SenBuffer ripe =
        SenBuffer.fromBytes(Uint8List.fromList([0x10, 0x00]));
    ripe.writeBytes(
      Rijndael.encrypt(
        compressedData.toBytes(),
        rijndael.key,
        rijndael.iv,
        RijndaelMode.CBC,
      ),
    );
    final SenBuffer result = SenBuffer.fromBytes(Base64.encode(ripe.toBytes()));
    return result;
  }

  static void encode_fs(
    String inFile,
    String outFile,
    RijndaelC rijndael,
    bool use64BitVariant,
  ) {
    final CompiledText compiledText = CompiledText();
    final SenBuffer data = compiledText.encode(
      SenBuffer.OpenFile(inFile),
      rijndael,
      use64BitVariant,
    );
    data.outFile(outFile);
    return;
  }

  static void decode_fs(
    String inFile,
    String outFile,
    RijndaelC rijndael,
    bool use64BitVariant,
  ) {
    final CompiledText compiledText = CompiledText();
    final SenBuffer data = compiledText.decode(
      SenBuffer.OpenFile(inFile),
      rijndael,
      use64BitVariant,
    );
    data.outFile(outFile);
    return;
  }
}
