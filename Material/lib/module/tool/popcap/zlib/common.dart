import 'dart:typed_data';
import 'package:sen_material_design/module/utility/buffer/common.dart';
import 'package:sen_material_design/module/utility/compress/zlib/common.dart';

class PopCapZlib {
  static final Uint8List magic = Uint8List.fromList(
    [
      0xD4,
      0xFE,
      0xAD,
      0xDE,
    ],
  );

  static final Uint8List blank = Uint8List.fromList(
    [
      0x00,
      0x00,
      0x00,
      0x00,
    ],
  );

  static SenBuffer compress(
    SenBuffer data,
    bool use64BitVariant,
  ) {
    var result = SenBuffer();
    result.writeBytes(
      magic,
    );
    if (use64BitVariant) {
      result.writeBytes(
        blank,
      );
    }
    result.writeUInt32LE(
      data.size(),
    );
    if (use64BitVariant) {
      result.writeBytes(
        blank,
      );
    }
    result.writeBytes(
      Zlib.compress(
        data.toBytes(),
        9,
      ),
    );
    return result;
  }

  static SenBuffer uncompress(
    SenBuffer data,
    bool use64BitVariant,
  ) {
    final magic = data.readUInt32LE();
    if (magic != 0xDEADFED4) {
      throw Exception(
        "Mismatch PopCap Zlib magic, should begins with 0xDEADFED4, received 0x${(magic.toRadixString(16)).toUpperCase()}",
      );
    }
    var header = 8;
    data.readUInt32LE();
    if (use64BitVariant) {
      header += 8;
      data.readUInt32LE();
      data.readUInt32LE();
    }
    var result = SenBuffer.fromBytes(
      Zlib.uncompress(
        data.readBytes(
          data.size() - header,
        ),
      ),
    );
    return result;
  }
}
