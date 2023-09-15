import 'package:flutter/material.dart';
import 'package:sen_material_design/components/tool/popcap/atlas/split.dart';
import 'package:sen_material_design/components/tool/popcap/newton/decode.dart';
import 'package:sen_material_design/components/tool/popcap/newton/encode.dart';
import 'package:sen_material_design/components/tool/popcap/resinfo/merge.dart';
import 'package:sen_material_design/components/tool/popcap/resinfo/split.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/from_resinfo.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/merge.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/split.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/to_resinfo.dart';
import 'package:sen_material_design/components/tool/popcap/zlib/compress.dart';
import 'package:sen_material_design/components/tool/popcap/zlib/uncompress.dart';

Map<String, Widget> materialWidget = const {
  'popcap.resource_group.split': SplitPopCapResourceGroup(),
  'popcap.resource_group.merge': MergePopCapResourceGroup(),
  'popcap.resource_group.to_resinfo': ToResInfo(),
  'popcap.resource_group.from_resinfo': FromResInfo(),
  'popcap.resinfo.split': SplitResInfo(),
  'popcap.resinfo.merge': MergeResInfo(),
  'popcap.zlib.compress': PopCapZlibCompress(),
  'popcap.zlib.uncompress': PopCapZlibUncompress(),
  'popcap.newton.decode': PopCapNewtonDecode(),
  'popcap.newton.encode': PopCapNewtonEncode(),
  'popcap.resource_group.split_atlas': PopCapAtlasSplit(),
};
