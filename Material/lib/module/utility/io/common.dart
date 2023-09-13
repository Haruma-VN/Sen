// ignore_for_file: body_might_complete_normally_nullable, non_constant_identifier_names, unnecessary_cast

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:sen_material_design/bridge/service.dart';

/// File System for Sen: UI

class FileSystem {
  /// Constructor
  FileSystem();

  /// [path] - Provide file path to read
  ///
  /// return: Read file as string, false will throw an exception file not found

  static String readFile(
    String path,
  ) {
    var file = File(
      path,
    );
    if (file.existsSync()) {
      return file.readAsStringSync();
    } else {
      throw Exception(
        'File not found: $path',
      );
    }
  }

  /// Provide [data] to write in [path]
  ///
  /// return

  static void writeFile(
    String path,
    String data,
  ) {
    var file = File(
      path,
    );
    file.createSync(
      recursive: true,
    );
    file.writeAsStringSync(
      data,
    );
    return;
  }

  /// [path] - Provide path to read
  ///
  /// Return: Uint 8 List

  static Uint8List readBuffer(
    String path,
  ) {
    var file = File(
      path,
    );
    if (file.existsSync()) {
      return file.readAsBytesSync();
    } else {
      throw Exception(
        'File not found: $path',
      );
    }
  }

  /// Provide [data] to write in [path]
  ///
  /// Write file as buffer

  static void writeBuffer(
    String path,
    Uint8List data,
  ) {
    var file = File(
      path,
    );
    file.createSync(
      recursive: true,
    );
    file.writeAsBytesSync(
      data,
    );
    return;
  }

  /// Provide [path] to check if file exists
  ///

  static bool fileExists(
    String path,
  ) {
    var file = File(
      path,
    );
    return file.existsSync();
  }

  /// Provide [path] to create
  ///
  /// Return: Created directory

  static void createDirectory(
    String path,
  ) {
    var directory = Directory(
      path,
    );
    directory.createSync(
      recursive: true,
    );
    return;
  }

  /// Pass [path] to check
  ///
  /// If directory exists return true, else false

  static bool directoryExists(
    String path,
  ) {
    var directory = Directory(
      path,
    );
    return directory.existsSync();
  }

  /// Provide [data] to write in [path]
  ///
  /// return an async function

  static Future<void> writeFileAsync(
    String path,
    String data,
  ) async {
    var file = File(
      path,
    );
    await file.create(
      recursive: true,
    );
    await file.writeAsString(
      data,
    );
    return;
  }

  /// Provide [data] to write in [path]
  ///
  /// Write file as buffer in Async task

  static Future<void> writeBufferAsync(
    String path,
    Uint8List data,
  ) async {
    var file = File(
      path,
    );
    await file.create(
      recursive: true,
    );
    await file.writeAsBytes(
      data,
    );
    return;
  }

  /// Provide [path] to read json
  ///
  /// Return: JSON Decode

  static dynamic readJson(
    String path,
  ) {
    return jsonDecode(
      readFile(
        path,
      ),
    );
  }

  /// Provide [data] in [path] to write json
  ///
  /// Return: JSON Decode

  static void writeJson(
    String path,
    dynamic data,
    String? indent,
  ) {
    var encoder = JsonEncoder.withIndent(
      indent ?? '\t',
    );
    writeFile(
      path,
      encoder.convert(
        data,
      ),
    );
    return;
  }

  ///
  ///
  /// Return: File Path or Null

  static Future<String?> pickFile() async {
    var result = null as String?;
    if (Platform.isAndroid) {
      result = await MainActivity.pickPath(
        false,
        '',
      );
    } else {
      FilePickerResult? m_result = await FilePicker.platform.pickFiles();
      if (m_result != null) {
        result = m_result.files.single.path;
      }
    }
    return result;
  }

  ///
  ///
  /// Return: Directory Path or Null

  static Future<String?> pickDirectory() async {
    String? selectedDirectory = await FilePicker.platform.getDirectoryPath();
    if (selectedDirectory != null) {
      return selectedDirectory.replaceAll(
        '\\',
        '/',
      );
    }
    return null;
  }

  /// Support Old Pvz2 Lawnstrings

  static String readUTF16LE(
    String inFile,
  ) {
    var file = File(
      inFile,
    );
    var bytes = file.readAsBytesSync();
    var utf16leData = Uint16List.view(
      bytes.buffer,
    );
    var contents = String.fromCharCodes(
      utf16leData,
    );
    return contents;
  }

  /// Support Old Pvz2 Lawnstrings

  static void writeUTF16LE(String outFile, String data) {
    var outputFile = File(
      outFile,
    );
    outputFile.createSync(
      recursive: true,
    );
    var dataToWrite = Uint8List.fromList(
      data.codeUnits,
    );
    outputFile.writeAsBytesSync(
      dataToWrite.buffer.asUint8List(),
    );
    return;
  }
}
