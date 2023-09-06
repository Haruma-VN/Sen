import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as path;

void splitResourceGroup(String inFile, String outDirectory) {
  final dynamic resourceGroup = FileSystem.readJson(inFile);
  for (var i = 0; i < resourceGroup['groups'].length; i++) {
    final dynamic current = resourceGroup['groups'][i];
    final String fileName = current['id'];
    FileSystem.writeJson(
      path.join(
        outDirectory,
        'subgroup',
        '$fileName.json',
      ),
      current,
      '\t',
    );
  }
  return;
}
