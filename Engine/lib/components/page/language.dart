// ignore_for_file: library_private_types_in_public_api, use_key_in_widget_constructors

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LanguageSupport {
  late String languageCode;
  late String languageValue;

  LanguageSupport();

  LanguageSupport.has(
    this.languageCode,
    this.languageValue,
  );
}

class LanguageSelectorDialog extends StatefulWidget {
  @override
  _LanguageSelectorDialogState createState() => _LanguageSelectorDialogState();
}

class _LanguageSelectorDialogState extends State<LanguageSelectorDialog> {
  String groupValue = ApplicationInformation.language.value;

  @override
  Widget build(BuildContext context) {
    final List<LanguageSupport> languages = [
      LanguageSupport.has('en', AppLocalizations.of(context)!.english),
      LanguageSupport.has('vi', AppLocalizations.of(context)!.vietnamese),
      LanguageSupport.has('es', AppLocalizations.of(context)!.spanish),
    ];
    return Column(
      children: languages
          .map(
            (LanguageSupport e) => RadioListTile(
              title: Text(e.languageValue),
              value: e.languageCode,
              groupValue: groupValue,
              onChanged: (value) {
                setState(() {
                  groupValue = value.toString();
                  ApplicationInformation.language.value = groupValue;
                });
              },
            ),
          )
          .toList(),
    );
  }
}
