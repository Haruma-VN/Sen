import 'package:sen_material_design/module/tool/popcap/zlib/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

void popcapZlibCompress(String inFile, String outFile, bool use64BitVariant) {
  var raw = PopCapZlib.compress(SenBuffer.OpenFile(inFile), use64BitVariant);
  raw.outFile(outFile);
  return;
}
