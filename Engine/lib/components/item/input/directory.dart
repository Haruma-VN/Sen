import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/text.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class InputDirectoryContent extends StatelessWidget {
  final TextEditingController? controller;
  final void Function()? onUpload;
  final bool isInputDirectory;
  final double? iconSize;

  const InputDirectoryContent({
    super.key,
    required this.controller,
    required this.onUpload,
    required this.isInputDirectory,
    this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    return InputBarContent(
      iconBegin: Icons.text_fields_outlined,
      iconEnd: Icons.open_in_new_outlined,
      onSubmit: onUpload,
      toolTip: AppLocalizations.of(context)!.browse,
      iconSize: iconSize,
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: isInputDirectory
              ? AppLocalizations.of(context)!.input_directory
              : AppLocalizations.of(context)!.output_directory,
          border: InputBorder.none,
        ),
      ),
    );
  }
}
