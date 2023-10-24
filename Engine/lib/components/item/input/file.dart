import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/text.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class InputFileContent extends StatelessWidget {
  final TextEditingController? controller;
  final void Function()? onUpload;
  final bool isDatafile;
  final double? iconSize;

  const InputFileContent({
    super.key,
    required this.controller,
    required this.onUpload,
    required this.isDatafile,
    this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    return InputBarContent(
      iconBegin: Icons.text_fields_outlined,
      iconEnd: Icons.file_upload_outlined,
      onSubmit: onUpload,
      iconSize: iconSize,
      toolTip: AppLocalizations.of(context)!.browse,
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: isDatafile
              ? AppLocalizations.of(context)!.data_file
              : AppLocalizations.of(context)!.output_file,
          border: InputBorder.none,
        ),
      ),
    );
  }
}
