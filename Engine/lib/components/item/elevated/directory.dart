import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/directory.dart';

class ElevatedDirectoryBarContent extends StatelessWidget {
  const ElevatedDirectoryBarContent({
    super.key,
    required this.controller,
    required this.onUpload,
    required this.isInputDirectory,
    this.iconSize,
  });

  final double? iconSize;
  final TextEditingController? controller;
  final void Function()? onUpload;
  final bool isInputDirectory;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      child: InputDirectoryContent(
        controller: controller,
        onUpload: onUpload,
        isInputDirectory: isInputDirectory,
        iconSize: iconSize,
      ),
    );
  }
}
