// ignore_for_file: unused_local_variable

import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart' as p;
import 'package:http/http.dart' as http;

class Connection {
  Future<String> get(
    String link,
    String path,
  ) async {
    var url = Uri.https(
      link,
      path,
    );
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to load data');
    }
  }

  Future<void> download(
    String url,
    String filepath,
  ) async {
    var response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      var bytes = response.bodyBytes;
      File file = File(filepath);
      await file.writeAsBytes(bytes);
    }
    return;
  }

  Connection();

  Future<void> post(
    String link,
    Map<String, String> data,
  ) async {
    await http.post(
      Uri.parse(link),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(data),
    );
    return;
  }

  static String internalLibrary() {
    if (Platform.isAndroid || Platform.isLinux) {
      return 'Internal.so';
    } else if (Platform.isWindows) {
      return 'Internal.dll';
    } else if (Platform.isIOS || Platform.isMacOS) {
      return 'Internal.dylib';
    } else {
      throw Exception('Unsupproted platform');
    }
  }

  static Future<void> downloadInternal(
    String savePath,
  ) async {
    var connect = Connection();
    final dynamic data = jsonDecode(
      await connect.get(
        'api.github.com',
        '/repos/Haruma-VN/Sen/releases/tags/internal',
      ),
    );
    final List<dynamic> assets = data['assets'];
    String? downloadLink;
    final String saveFile = internalLibrary();
    for (var i = 0; i < assets.length; ++i) {
      var current = assets[i];
      if (current['name'].toString().endsWith(saveFile)) {
        downloadLink = current['browser_download_url'];
        break;
      }
    }
    if (downloadLink != null) {
      await connect.download(
        downloadLink,
        p.join(
          savePath,
          saveFile,
        ),
      );
    }
    return;
  }
}
