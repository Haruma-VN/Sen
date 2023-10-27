// ignore_for_file: file_names

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/elevated/input.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/reflection_object_notation/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapRTONDecryptAndDecode extends StatefulWidget {
  const PopCapRTONDecryptAndDecode({super.key});

  @override
  State<PopCapRTONDecryptAndDecode> createState() =>
      _PopCapRTONDecryptAndDecodeState();
}

class _PopCapRTONDecryptAndDecodeState
    extends State<PopCapRTONDecryptAndDecode> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;
  late TextEditingController controllerKeyInput;

  @override
  void initState() {
    super.initState();
    controllerInput = TextEditingController();
    controllerOutput = TextEditingController();
    controllerKeyInput = TextEditingController(
      text: ApplicationInformation.encryptionKey.value,
    );
  }

  @override
  void dispose() {
    controllerInput.dispose();
    controllerOutput.dispose();
    controllerKeyInput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText:
              AppLocalizations.of(context)!.popcap_rton_decrypt_and_decode,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = '${p.withoutExtension(path)}.json';
              }
            },
            isDatafile: true,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedFileBarContent(
            controller: controllerOutput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerOutput.text = path;
              }
            },
            isDatafile: false,
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.encryption_key,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedInputTextField(
            icon: Icons.info_outline,
            labelText: AppLocalizations.of(context)!.encryption_key,
            controller: controllerKeyInput,
            toolTip: AppLocalizations.of(context)!.encryption_key,
            onChanged: (String encryptionKey) {
              controllerKeyInput.text = encryptionKey;
            },
          ),
        ),
        ExecuteButton(
          onPressed: () async {
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => Debug(
                  () async {
                    await Future.delayed(const Duration(seconds: 1), () {
                      ReflectionObjectNotation.decode_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        true,
                        RijndaelC.has(
                          controllerKeyInput.text,
                          controllerKeyInput.text.substring(4, 28),
                        ),
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_rton_decrypt_and_decode,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      controllerKeyInput.text,
                      AppLocalizations.of(context)!.encryption_key,
                      ArgumentType.any,
                    ),
                  ],
                  argumentOutput: [
                    ArgumentData(
                      controllerOutput.text,
                      AppLocalizations.of(context)!.argument_output,
                      ArgumentType.file,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
