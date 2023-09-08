import 'package:flutter/material.dart';
import 'package:sen_material_design/components/tool/popcap/resinfo/split.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/from_resinfo.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/merge.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/split.dart';
import 'package:sen_material_design/components/tool/popcap/resource_group/to_resinfo.dart';

List<Widget> materialWidget = const [
  SplitPopCapResourceGroup(),
  MergePopCapResourceGroup(),
  ToResInfo(),
  FromResInfo(),
  SplitResInfo(),
];
