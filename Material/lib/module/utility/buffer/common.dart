// ignore_for_file: prefer_typing_uninitialized_variables, unnecessary_this, prefer_const_constructors

import "dart:io";
import "dart:convert";
import "dart:typed_data";

abstract interface class SenBuffer {
  factory SenBuffer() => _SenBuffer(
        Uint8List(
          0,
        ),
      );

  // ignore: non_constant_identifier_names
  factory SenBuffer.OpenFile(String path) {
    final file = File(
      (path),
    );
    final length = file.lengthSync();
    final bytes = Uint8List(
      length,
    );
    final raFile = file.openSync();
    int pos = 0;
    const chunkSize = 1000000000;
    while (pos < length) {
      raFile.readIntoSync(
        bytes,
        pos,
        (pos + chunkSize).clamp(
          0,
          length,
        ),
      );
      pos += chunkSize;
    }
    raFile.closeSync();
    return _SenBuffer(
      bytes,
    );
  }

  factory SenBuffer.fromBytes(
    Uint8List buffer,
  ) {
    return _SenBuffer(
      _copyBuffer(
        buffer,
      ),
    );
  }

  factory SenBuffer.fromLength(
    int length,
  ) {
    return _SenBuffer(
      Uint8List(
        length,
      ),
    );
  }

  int operator [](
    int index,
  );

  int get length;

  int get readOffset;

  set readOffset(
    int value,
  );

  int size();

  int get writeOffset;

  set writeOffset(
    int value,
  );

  Uint8List toBytes();

  Uint8List getBytes(
    int count,
    int offset,
  );

  Uint8List readBytes(
    int count, [
    int offset = -1,
  ]);

  String readString(
    int count, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]);

  int readUInt8([
    int offset = -1,
  ]);

  int readUInt16LE([
    int offset = -1,
  ]);

  int readUInt16BE([
    int offset = -1,
  ]);

  int readUInt24LE([
    int offset = -1,
  ]);

  int readUInt24BE([
    int offset = -1,
  ]);

  int readUInt32LE([
    int offset = -1,
  ]);

  int readUInt32BE([
    int offset = -1,
  ]);

  int readBigUInt64LE([
    int offset = -1,
  ]);

  int readBigUInt64BE([
    int offset = -1,
  ]);

  int readVarUInt32([
    int offset = -1,
  ]);

  int readInt8([
    int offset = -1,
  ]);

  int readInt16LE([
    int offset = -1,
  ]);

  int readInt16BE([
    int offset = -1,
  ]);

  int readInt32LE([
    int offset = -1,
  ]);

  int readInt32BE([
    int offset = -1,
  ]);

  int readBigInt64LE([
    int offset = -1,
  ]);

  int readBigInt64BE([
    int offset = -1,
  ]);

  double readFloatLE([
    int offset = -1,
  ]);

  double readFloatBE([
    int offset = -1,
  ]);

  double readDoubleLE([
    int offset = -1,
  ]);

  double readDoubleBE([
    int offset = -1,
  ]);

  bool readBool([
    int offset = -1,
  ]);

  int readVarInt32([
    int offset = -1,
  ]);

  String readStringByEmpty([
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]);

  String getStringByEmpty(
    int offset, [
    EncodingType encodingType = EncodingType.UTF8,
  ]);

  String readCharByInt16LE([
    int offset = -1,
  ]);

  String readStringByUInt8([
    int offset = -1,
  ]);

  String readStringByUInt16LE([
    int offset = -1,
  ]);

  String readStringByUInt16BE([
    int offset = -1,
  ]);

  String readStringByUInt32LE([
    int offset = -1,
  ]);

  String readStringByUInt32BE([
    int offset = -1,
  ]);

  String readStringByInt8([
    int offset = -1,
  ]);

  String readStringByInt16LE([
    int offset = -1,
  ]);

  String readStringByInt16BE([
    int offset = -1,
  ]);

  String readStringByInt32LE([
    int offset = -1,
  ]);

  String readStringByInt32BE([
    int offset = -1,
  ]);

  String readStringByVarInt32([
    int offset = -1,
  ]);

  int peekUInt8([
    int offset = -1,
  ]);

  int peekUInt16LE([
    int offset = -1,
  ]);

  int peekUInt16BE([
    int offset = -1,
  ]);

  int peekUInt24LE([
    int offset = -1,
  ]);

  int peekUInt24BE([
    int offset = -1,
  ]);

  int peekUInt32LE([
    int offset = -1,
  ]);

  int peekUInt32BE([
    int offset = -1,
  ]);

  int peekInt8([
    int offset = -1,
  ]);

  int peekInt16LE([
    int offset = -1,
  ]);

  int peekInt16BE([
    int offset = -1,
  ]);

  int peekInt32LE([
    int offset = -1,
  ]);

  int peekInt32BE([
    int offset = -1,
  ]);

  String peekString(
    int count, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]);

  void writeBytes(Uint8List buffer, [int offset = -1]);

  void writeString(
    String str, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]);

  void writeStringFourByte(
    String str, [
    int offset = -1,
    EncodingType encodingType = EncodingType.ASCII,
  ]);

  void writeUInt8(
    int number, [
    int offset = -1,
  ]);

  void writeUInt16LE(
    int number, [
    int offset = -1,
  ]);

  void writeUInt16BE(
    int number, [
    int offset = -1,
  ]);

  void writeUInt24LE(
    int number, [
    int offset = -1,
  ]);

  void writeUInt24BE(
    int number, [
    int offset = -1,
  ]);

  void writeUInt32LE(
    int number, [
    int offset = -1,
  ]);

  void writeUInt32BE(
    int number, [
    int offset = -1,
  ]);

  void writeBigUInt64LE(
    int number, [
    int offset = -1,
  ]);

  void writeBigUInt64BE(
    int number, [
    int offset = -1,
  ]);

  void writeFloatLE(
    double number, [
    int offset = -1,
  ]);

  void writeFloatBE(
    double number, [
    int offset = -1,
  ]);

  void writeDoubleLE(
    double number, [
    int offset = -1,
  ]);

  void writeDoubleBE(
    double number, [
    int offset = -1,
  ]);

  void writeUVarInt32(
    int number, [
    int offset = -1,
  ]);

  void writeInt8(
    int number, [
    int offset = -1,
  ]);

  void writeInt16LE(
    int number, [
    int offset = -1,
  ]);

  void writeInt16BE(
    int number, [
    int offset = -1,
  ]);

  void writeInt32LE(
    int number, [
    int offset = -1,
  ]);

  void writeInt32BE(
    int number, [
    int offset = -1,
  ]);

  void writeBigInt64LE(
    int number, [
    int offset = -1,
  ]);

  void writeBigInt64BE(
    int number, [
    int offset = -1,
  ]);

  void writeVarInt32(
    int number, [
    int offset = -1,
  ]);

  void writeVarInt64(int number, [int offset = -1]);

  void writeBool(
    bool value, [
    int offset = -1,
  ]);

  void writeCharByInt16LE(
    String charStr, [
    int offset = -1,
  ]);

  void writeStringBytUInt8(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytUInt16LE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytUInt16BE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytUInt32LE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytUInt32BE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytInt8(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytInt16LE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytInt16BE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytInt32LE(
    String? str, [
    int offset = -1,
  ]);

  void writeStringBytInt32BE(
    String? str, [
    int offset = -1,
  ]);

  void backupReadOffset();

  void restoreReadOffset();

  void backupWriteOffset();

  void restoreWriteOffset();

  void outFile(
    String outFile,
  );

  void outBytes(
    String outFile,
    int count,
    int offset,
  );

  void clear();
}

enum EncodingType {
  // ignore: constant_identifier_names
  UTF8,
  // ignore: constant_identifier_names
  ASCII,
  // ignore: constant_identifier_names
  LATIN1,
  // ignore: constant_identifier_names
  BASE64,
}

Uint8List _copyBuffer(
  buffer, [
  int? length,
  int? offset,
]) {
  return Uint8List.fromList(
    Uint8List.view(
      buffer.buffer,
      offset ?? buffer.offsetInBytes,
      length ?? buffer.length,
    ),
  );
}

// ignore

class _SenBuffer implements SenBuffer {
  var _buffer;
  int _readOffset = 0;
  int _writeOffset = 0;
  int _tempReadOffset = 0;
  int _tempWriteOffset = 0;

  _SenBuffer(
    Uint8List buffer,
  ) {
    this._buffer = _copyBuffer(
      buffer,
    );
    this._writeOffset = _buffer.length;
  }

  @override
  int operator [](
    int index,
  ) {
    return _buffer[index];
  }

  @override
  int size() {
    return this.length;
  }

  final _emptyList = Uint8List(0);

  @override
  int get length => _buffer.length;

  // ignore: unnecessary_getters_setters
  @override
  int get readOffset => _readOffset;

  // ignore: unnecessary_getters_setters
  @override
  int get writeOffset => _writeOffset;

  @override
  set readOffset(
    int value,
  ) {
    _readOffset = value;
  }

  @override
  set writeOffset(
    int value,
  ) {
    _writeOffset = value;
  }

  var _mBuffer = Uint8List(0);
  var _mNumber = ByteData(0);

  @override
  Uint8List toBytes() {
    if (_buffer.length == 0) return _emptyList;
    return _copyBuffer(_buffer);
  }

  @override
  Uint8List getBytes(
    int count,
    int offset,
  ) {
    if (offset + count > _buffer.length) {
      throw Exception(
        "Offset is outside the bounds of the DataView",
      );
    }
    return _copyBuffer(
      _buffer,
      count,
      offset,
    );
  }

  void _readOffsetPostion(
    int count,
  ) {
    _readOffset += count;
    return;
  }

  void _writeOffsetPostion(
    int count,
  ) {
    _writeOffset += count;
    return;
  }

  void _fixReadOffset(
    int offset,
  ) {
    if (offset != -1 && offset > -1) {
      _readOffset = offset;
    } else if (offset == -1) {
      return;
    } else {
      throw Exception(
        "Offset must larger than 0",
      );
    }
    return;
  }

  void _fixWriteOffset(
    int offset,
  ) {
    if (offset != -1 && offset > -1) {
      _writeOffset = offset;
    } else if (offset == -1) {
      return;
    } else {
      throw Exception(
        "Offset must larger than 0",
      );
    }
  }
  // ReadBuffer

  @override
  Uint8List readBytes(
    int count, [
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    final buffer = getBytes(
      count,
      readOffset,
    );
    _readOffsetPostion(
      count,
    );
    return buffer;
  }

  @override
  String readString(
    int count, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]) {
    _mBuffer = readBytes(
      count,
      offset,
    );
    final encoding = _setEncoding(
      encodingType,
    );
    final str = encoding.decode(
      _mBuffer,
    );
    return str;
  }

  void _readByteData(
    int count,
    int offset,
  ) {
    _mNumber = ByteData.sublistView(
      readBytes(
        count,
      ),
    );
    return;
  }

  @override
  int readUInt8([
    int offset = -1,
  ]) {
    _readByteData(
      1,
      offset,
    );
    return _mNumber.getUint8(
      0,
    );
  }

  @override
  int readUInt16LE([
    int offset = -1,
  ]) {
    _readByteData(
      2,
      offset,
    );
    return _mNumber.getUint16(
      0,
      Endian.little,
    );
  }

  @override
  int readUInt16BE([
    int offset = -1,
  ]) {
    _readByteData(2, offset);
    return _mNumber.getUint16(
      0,
      Endian.big,
    );
  }

  @override
  int readUInt24LE([
    int offset = -1,
  ]) {
    _mBuffer = readBytes(
      3,
      offset,
    );
    return _mBuffer[0] | _mBuffer[1] << 8 | _mBuffer[2] << 16;
  }

  @override
  int readUInt24BE([
    int offset = -1,
  ]) {
    _mBuffer = readBytes(
      3,
      offset,
    );
    return _mBuffer[2] | _mBuffer[1] << 8 | _mBuffer[0] << 16;
  }

  @override
  int readUInt32LE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getUint32(0, Endian.little);
  }

  @override
  int readUInt32BE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getUint32(
      0,
      Endian.big,
    );
  }

  @override
  int readBigUInt64LE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getUint64(
      0,
      Endian.little,
    );
  }

  @override
  int readBigUInt64BE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getUint64(
      0,
      Endian.big,
    );
  }

  @override
  int readVarUInt32([
    int offset = -1,
  ]) {
    final varInt32 = readVarInt32(
      offset,
    );
    _mNumber = ByteData(4);
    _mNumber.setInt32(
      0,
      varInt32,
      Endian.little,
    );
    return _mNumber.getUint32(
      0,
      Endian.little,
    );
  }

  @override
  int readInt8([
    int offset = -1,
  ]) {
    _readByteData(
      1,
      offset,
    );
    return _mNumber.getInt8(
      0,
    );
  }

  @override
  int readInt16LE([
    int offset = -1,
  ]) {
    _readByteData(
      2,
      offset,
    );
    return _mNumber.getInt16(
      0,
      Endian.little,
    );
  }

  @override
  int readInt16BE([
    int offset = -1,
  ]) {
    _readByteData(
      2,
      offset,
    );
    return _mNumber.getInt16(
      0,
      Endian.big,
    );
  }

  @override
  int readInt32LE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getInt32(
      0,
      Endian.little,
    );
  }

  @override
  int readInt32BE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getInt32(
      0,
      Endian.big,
    );
  }

  @override
  int readBigInt64LE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getInt64(
      0,
      Endian.little,
    );
  }

  @override
  int readBigInt64BE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getInt64(
      0,
      Endian.big,
    );
  }

  @override
  double readFloatLE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getFloat32(
      0,
      Endian.little,
    );
  }

  @override
  double readFloatBE([
    int offset = -1,
  ]) {
    _readByteData(
      4,
      offset,
    );
    return _mNumber.getFloat32(
      0,
      Endian.big,
    );
  }

  @override
  double readDoubleLE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getFloat64(
      0,
      Endian.little,
    );
  }

  @override
  double readDoubleBE([
    int offset = -1,
  ]) {
    _readByteData(
      8,
      offset,
    );
    return _mNumber.getFloat64(
      0,
      Endian.big,
    );
  }

  @override
  bool readBool([
    int offset = -1,
  ]) {
    return readUInt8(
          offset,
        ) ==
        1;
  }

  @override
  int readVarInt32([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    int num = 0;
    int num_2 = 0;
    int byte;
    do {
      if (num_2 == 35) {
        throw Exception('Invalid DataView');
      }
      byte = readUInt8();
      num |= (byte & 0x7F) << num_2;
      num_2 += 7;
    } while ((byte & 0x80) != 0);
    return num;
  }

  @override
  String readStringByEmpty([
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]) {
    _fixReadOffset(
      offset,
    );
    var length = 0;
    backupReadOffset();
    while (true) {
      if (readUInt8() == 0) {
        break;
      }
      length++;
    }
    restoreReadOffset();
    return readString(
      length,
      -1,
      encodingType,
    );
  }

  @override
  String getStringByEmpty(
    int offset, [
    EncodingType encodingType = EncodingType.UTF8,
  ]) {
    backupReadOffset();
    final str = readStringByEmpty(
      offset,
    );
    restoreReadOffset();
    return str;
  }

  @override
  String readCharByInt16LE([
    int offset = -1,
  ]) {
    return String.fromCharCode(
      readUInt16LE(),
    );
  }

  @override
  String readStringByUInt8([
    int offset = -1,
  ]) {
    return readString(
      readUInt8(
        offset,
      ),
    );
  }

  @override
  String readStringByUInt16LE([
    int offset = -1,
  ]) {
    return readString(
      readUInt16LE(
        offset,
      ),
    );
  }

  @override
  String readStringByUInt16BE([
    int offset = -1,
  ]) {
    return readString(
      readUInt16BE(
        offset,
      ),
    );
  }

  @override
  String readStringByUInt32LE([
    int offset = -1,
  ]) {
    return readString(
      readUInt32LE(
        offset,
      ),
    );
  }

  @override
  String readStringByUInt32BE([
    int offset = -1,
  ]) {
    return readString(
      readUInt32BE(
        offset,
      ),
    );
  }

  @override
  String readStringByInt8([
    int offset = -1,
  ]) {
    return readString(
      readInt8(
        offset,
      ),
    );
  }

  @override
  String readStringByInt16LE([
    int offset = -1,
  ]) {
    return readString(
      readInt16LE(
        offset,
      ),
    );
  }

  @override
  String readStringByInt16BE([
    int offset = -1,
  ]) {
    return readString(
      readInt16BE(
        offset,
      ),
    );
  }

  @override
  String readStringByInt32LE([
    int offset = -1,
  ]) {
    return readString(
      readInt32LE(
        offset,
      ),
    );
  }

  @override
  String readStringByInt32BE([
    int offset = -1,
  ]) {
    return readString(
      readUInt32BE(
        offset,
      ),
    );
  }

  @override
  String readStringByVarInt32([
    int offset = -1,
  ]) {
    return readString(
      readVarInt32(
        offset,
      ),
    );
  }

  @override
  int peekUInt8([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt8();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt16LE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt16LE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt16BE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt16BE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt24LE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt24LE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt24BE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt24BE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt32LE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt32LE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekUInt32BE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readUInt32BE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekInt8([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readInt8();
    restoreReadOffset();
    return num;
  }

  @override
  int peekInt16LE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readInt16LE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekInt16BE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readInt16BE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekInt32LE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readInt32LE();
    restoreReadOffset();
    return num;
  }

  @override
  int peekInt32BE([
    int offset = -1,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final num = readInt32BE();
    restoreReadOffset();
    return num;
  }

  @override
  String peekString(
    int count, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]) {
    _fixReadOffset(
      offset,
    );
    backupReadOffset();
    final str = readString(
      count,
    );
    restoreReadOffset();
    return str;
  }

  dynamic _setEncoding(
    EncodingType encodingType,
  ) {
    switch (encodingType) {
      case EncodingType.UTF8:
        return Utf8Codec();
      case EncodingType.ASCII:
        return AsciiCodec();
      case EncodingType.LATIN1:
        return Latin1Codec();
      case EncodingType.BASE64:
        return Base64Codec();
      default:
        throw Exception("Invaild encoding type");
    }
  }

  // WriteBuffer
  @override
  void writeBytes(
    Uint8List buffer, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    final bufferCount = buffer.length;
    final length = writeOffset + bufferCount;
    if (length > _buffer.length) {
      _grow(
        bufferCount,
      );
    }
    for (var i = 0; i < bufferCount; i++) {
      _buffer[writeOffset + i] = buffer[i];
    }
    _writeOffsetPostion(
      bufferCount,
    );
    return;
  }

  @override
  void writeString(
    String str, [
    int offset = -1,
    EncodingType encodingType = EncodingType.UTF8,
  ]) {
    final encoding = _setEncoding(
      encodingType,
    );
    final strBytes = encoding.encode(
      str,
    );
    writeBytes(
      strBytes,
      offset,
    );
    return;
  }

  @override
  void writeStringFourByte(
    String str, [
    int offset = -1,
    EncodingType encodingType = EncodingType.ASCII,
  ]) {
    final strLength = str.length;
    final codeUnits = str.codeUnits;
    final strBytes = Uint8List(strLength * 4 + 4);
    for (var i = 0; i < strLength; i++) {
      strBytes[i * 4] = codeUnits[i];
    }
    writeBytes(
      strBytes,
      offset,
    );
  }

  void _writeByteData(
    int count,
  ) {
    _mNumber = ByteData(
      count,
    );
    return;
  }

  @override
  void writeUInt8(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      1,
    );
    _mNumber.setUint8(
      0,
      number,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeUInt16LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      2,
    );
    _mNumber.setUint16(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeUInt16BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      2,
    );
    _mNumber.setUint16(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeUInt24LE(
    int number, [
    int offset = -1,
  ]) {
    _mBuffer = Uint8List(
      3,
    );
    _mBuffer[0] = number;
    _mBuffer[1] = number >> 8;
    _mBuffer[2] = number >> 16;
    writeBytes(
      _mBuffer,
      offset,
    );
    return;
  }

  @override
  void writeUInt24BE(
    int number, [
    int offset = -1,
  ]) {
    _mBuffer = Uint8List(
      3,
    );
    _mBuffer[2] = number;
    _mBuffer[1] = number >> 8;
    _mBuffer[0] = number >> 16;
    writeBytes(_mBuffer, offset);
    return;
  }

  @override
  void writeUInt32LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setUint32(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeUInt32BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setUint32(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeBigUInt64LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setUint64(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeBigUInt64BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setUint64(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeFloatLE(
    double number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setFloat32(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeFloatBE(
    double number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setFloat32(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeDoubleLE(
    double number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setFloat64(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeDoubleBE(
    double number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setFloat64(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeUVarInt32(
    int number, [
    int offset = -1,
  ]) {
    var num = number;
    List<int> bytes = [];
    for (; num >= 128; num >>= 7) {
      bytes.add(
        num | 0x80,
      );
    }
    bytes.add(
      num,
    );
    writeBytes(
      Uint8List.fromList(
        bytes,
      ),
      offset,
    );
    return;
  }

  @override
  void writeInt8(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      1,
    );
    _mNumber.setInt8(
      0,
      number,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeInt16LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      2,
    );
    _mNumber.setInt16(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeInt16BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      2,
    );
    _mNumber.setInt16(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeInt32LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setInt32(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeInt32BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      4,
    );
    _mNumber.setInt32(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeBigInt64LE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setInt64(
      0,
      number,
      Endian.little,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeBigInt64BE(
    int number, [
    int offset = -1,
  ]) {
    _writeByteData(
      8,
    );
    _mNumber.setInt64(
      0,
      number,
      Endian.big,
    );
    writeBytes(
      _mNumber.buffer.asUint8List(),
      offset,
    );
    return;
  }

  @override
  void writeVarInt32(
    int number, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    var num = number;
    for (; num >= 128; num >>= 7) {
      writeUInt8(
        number | 0x80,
      );
    }
    writeUInt8(
      number,
    );
    return;
  }

  // same varInt32
  @override
  void writeVarInt64(
    int number, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    var num = number;
    for (; num >= 128; num >>= 7) {
      writeUInt8(
        number | 0x80,
      );
    }
    writeUInt8(
      number,
    );
    return;
  }

  @override
  void writeBool(
    bool value, [
    int offset = -1,
  ]) {
    writeUInt8(
      value ? 1 : 0,
      offset,
    );
    return;
  }

  @override
  void writeCharByInt16LE(
    String charStr, [
    int offset = -1,
  ]) {
    final charBytes = charStr.codeUnitAt(
      0,
    );
    writeUInt16LE(
      charBytes,
    );
    return;
  }

  @override
  void writeStringBytUInt8(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeUInt8(
        0,
      );
      return;
    }
    writeUInt8(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytUInt16LE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeUInt16LE(
        0,
      );
      return;
    }
    writeUInt16LE(
      str.length,
    );
    writeString(str);
    return;
  }

  @override
  void writeStringBytUInt16BE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeUInt16BE(
        0,
      );
      return;
    }
    writeUInt16BE(
      str.length,
    );
    writeString(str);
    return;
  }

  @override
  void writeStringBytUInt32LE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeUInt32LE(
        0,
      );
      return;
    }
    writeUInt32LE(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytUInt32BE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeUInt32BE(
        0,
      );
      return;
    }
    writeUInt32BE(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytInt8(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeInt8(
        0,
      );
      return;
    }
    writeInt8(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytInt16LE(String? str, [int offset = -1]) {
    _fixWriteOffset(offset);
    if (str == null) {
      writeInt16LE(0);
      return;
    }
    writeInt16LE(str.length);
    writeString(str);
    return;
  }

  @override
  void writeStringBytInt16BE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeInt16BE(
        0,
      );
      return;
    }
    writeInt16BE(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytInt32LE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeInt32LE(
        0,
      );
      return;
    }
    writeInt32LE(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  @override
  void writeStringBytInt32BE(
    String? str, [
    int offset = -1,
  ]) {
    _fixWriteOffset(
      offset,
    );
    if (str == null) {
      writeInt32BE(
        0,
      );
      return;
    }
    writeInt32BE(
      str.length,
    );
    writeString(
      str,
    );
    return;
  }

  // Mics
  @override
  void backupReadOffset() {
    _tempReadOffset = _readOffset;
    return;
  }

  @override
  void restoreReadOffset() {
    _readOffset = _tempReadOffset;
    return;
  }

  @override
  void backupWriteOffset() {
    _tempWriteOffset = _writeOffset;
    return;
  }

  @override
  void restoreWriteOffset() {
    _writeOffset = _tempWriteOffset;
    return;
  }

  @override
  void outFile(
    String outFile,
  ) {
    var file = File(
      outFile,
    );
    file.createSync(
      recursive: true,
    );
    file.writeAsBytes(
      _buffer,
    );
    clear();
    return;
  }

  @override
  void outBytes(
    String outFile,
    int count,
    int offset,
  ) {
    var file = File(
      outFile,
    );
    file.createSync(
      recursive: true,
    );
    file.writeAsBytes(
      getBytes(
        count,
        offset,
      ),
    );
    return;
  }

  @override
  void clear() {
    _buffer = _emptyList;
    _readOffset = 0;
    _writeOffset = 0;
    return;
  }

  void _grow(
    int bufferCount,
  ) {
    int newSize = writeOffset + bufferCount;
    if (newSize < _buffer.length) {
      newSize = _buffer.length;
    }
    var newBuffer = Uint8List(
      newSize,
    );
    newBuffer.setRange(
      0,
      _buffer.length,
      _buffer,
    );
    _buffer = newBuffer;
    return;
  }
}
