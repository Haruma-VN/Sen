import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

/// File System for Sen: UI

class FileSystem {
  /// Constructor
  FileSystem();

  /// [path] - Provide file path to read
  ///
  /// return: Read file as string, false will throw an exception file not found

  static String readFile(String path) {
    var file = File(path);
    if (file.existsSync()) {
      return file.readAsStringSync();
    } else {
      throw 'File not found: $path';
    }
  }

  /// Provide [data] to write in [path]
  ///
  /// return

  static void writeFile(String path, String data) {
    var file = File(path);
    file.createSync(recursive: true);
    file.writeAsStringSync(data);
    return;
  }

  /// [path] - Provide path to read
  ///
  /// Return: Uint 8 List

  static Uint8List readBuffer(String path) {
    var file = File(path);
    if (file.existsSync()) {
      return file.readAsBytesSync();
    } else {
      throw 'File not found: $path';
    }
  }

  /// Provide [data] to write in [path]
  ///
  /// Write file as buffer

  static void writeBuffer(String path, Uint8List data) {
    var file = File(path);
    file.createSync(recursive: true);
    file.writeAsBytesSync(data);
    return;
  }

  /// Provide [path] to check if file exists
  ///

  static bool fileExists(String path) {
    var file = File(path);
    return file.existsSync();
  }

  /// Provide [path] to create
  ///
  /// Return: Created directory

  static void createDirectory(String path) {
    var directory = Directory(path);
    directory.createSync(recursive: true);
    return;
  }

  /// Pass [path] to check
  ///
  /// If directory exists return true, else false

  static bool directoryExists(String path) {
    var directory = Directory(path);
    return directory.existsSync();
  }

  /// Provide [data] to write in [path]
  ///
  /// return an async function

  static Future<void> writeFileAsync(String path, String data) async {
    var file = File(path);
    await file.create(recursive: true);
    await file.writeAsString(data);
    return;
  }

  /// Provide [data] to write in [path]
  ///
  /// Write file as buffer in Async task

  static Future<void> writeBufferAsync(String path, Uint8List data) async {
    var file = File(path);
    await file.create(recursive: true);
    await file.writeAsBytes(data);
    return;
  }

  /// Provide [path] to read json
  ///
  /// Return: JSON Decode

  static dynamic readJson(String path) {
    return jsonDecode(readFile(path));
  }

  /// Provide [data] in [path] to write json
  ///
  /// Return: JSON Decode

  static void writeJson(String path, dynamic data, String? indent) {
    var encoder = JsonEncoder.withIndent(indent ?? '\t');
    writeFile(path, encoder.convert(data));
    return;
  }

  ///
  ///
  /// Return: File Path or Null

  static Future<String?> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      if (Platform.isAndroid) {
        File tempFile = File(result.files.single.path!);
        final tempDir = await getTemporaryDirectory();
        final file = await tempFile
            .copy('${tempDir.path}/${tempFile.path.split('/').last}');
        return file.path;
      } else {
        return result.files.single.path;
      }
    }
    return null;
  }

  ///
  ///
  /// Return: Directory Path or Null

  static Future<String?> pickDirectory() async {
    String? selectedDirectory = await FilePicker.platform.getDirectoryPath();
    if (selectedDirectory != null) {
      return selectedDirectory.replaceAll('\\', '/');
    }
    return null;
  }
}
