import 'dart:convert';
import 'dart:typed_data';

import 'package:sen_material_design/module/utility/buffer/common.dart';

// Base 64 Decode/Encode support in Dart

class Base64 {
  static Uint8List encode(
    Uint8List input,
  ) {
    return Uint8List.fromList(
      utf8.encode(
        base64.encode(
          input,
        ),
      ),
    );
  }

  static Uint8List decode(
    Uint8List input,
  ) {
    return base64.decode(
      utf8.decode(
        input,
      ),
    );
  }

  static encodeFile(
    String inFile,
    String outFile,
  ) {
    var inFS = SenBuffer.OpenFile(
      inFile,
    );
    var outFS = SenBuffer.fromBytes(
      Base64.encode(
        inFS.toBytes(),
      ),
    );
    outFS.outFile(
      outFile,
    );
    return;
  }

  static decodeFile(
    String inFile,
    String outFile,
  ) {
    var inFS = SenBuffer.OpenFile(
      inFile,
    );
    var outFS = SenBuffer.fromBytes(
      Base64.decode(
        inFS.toBytes(),
      ),
    );
    outFS.outFile(
      outFile,
    );
    return;
  }
}
