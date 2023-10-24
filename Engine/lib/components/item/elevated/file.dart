import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/file.dart';

class ElevatedFileBarContent extends StatelessWidget {
  const ElevatedFileBarContent({
    super.key,
    required this.controller,
    required this.onUpload,
    required this.isDatafile,
    this.iconSize,
  });

  final TextEditingController? controller;
  final void Function()? onUpload;
  final bool isDatafile;
  final double? iconSize;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      child: InputFileContent(
        controller: controller,
        onUpload: onUpload,
        isDatafile: isDatafile,
      ),
    );
  }
}
