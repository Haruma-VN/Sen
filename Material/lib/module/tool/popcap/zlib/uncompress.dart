import 'package:sen_material_design/module/tool/popcap/zlib/common.dart';
import 'package:sen_material_design/module/utility/buffer/common.dart';

void popcapZlibUncompress(String inFile, String outFile, bool use64BitVariant) {
  var raw = PopCapZlib.uncompress(SenBuffer.OpenFile(inFile), use64BitVariant);
  raw.outFile(outFile);
  return;
}
