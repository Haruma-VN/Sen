// ignore_for_file: library_private_types_in_public_api, use_key_in_widget_constructors

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LanguageSelectorDialog extends StatefulWidget {
  @override
  _LanguageSelectorDialogState createState() => _LanguageSelectorDialogState();
}

class _LanguageSelectorDialogState extends State<LanguageSelectorDialog> {
  String groupValue = ApplicationInformation.language.value;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        RadioListTile(
          title: Text(AppLocalizations.of(context)!.english),
          value: 'en',
          groupValue: groupValue,
          onChanged: (value) {
            setState(() {
              groupValue = value.toString();
              ApplicationInformation.language.value = groupValue;
            });
          },
        ),
        RadioListTile(
          title: Text(AppLocalizations.of(context)!.vietnamese),
          value: 'vi',
          groupValue: groupValue,
          onChanged: (value) {
            setState(() {
              groupValue = value.toString();
              ApplicationInformation.language.value = groupValue;
            });
          },
        ),
      ],
    );
  }
}
