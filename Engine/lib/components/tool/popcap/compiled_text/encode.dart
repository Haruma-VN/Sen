import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/elevated/input.dart';
import 'package:sen_material_design/components/item/elevated/switch.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/compiled_text/common.dart';
import 'package:sen_material_design/module/tool/popcap/reflection_object_notation/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapCompiledTextEncode extends StatefulWidget {
  const PopCapCompiledTextEncode({super.key});

  @override
  State<PopCapCompiledTextEncode> createState() =>
      _PopCapCompiledTextEncodeState();
}

class _PopCapCompiledTextEncodeState extends State<PopCapCompiledTextEncode> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;
  late TextEditingController controllerKeyInput;

  String text = '';

  @override
  void initState() {
    super.initState();
    controllerInput = TextEditingController();
    controllerOutput = TextEditingController();
    controllerKeyInput = TextEditingController(
      text: ApplicationInformation.encryptionKey.value,
    );
  }

  bool use64bitVariant = false;

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
              AppLocalizations.of(context)!.popcap_compiled_text_encode,
          textStyle: theme.textTheme.titleMedium!,
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: ElevatedFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = '$path.bin';
              }
            },
            isDatafile: true,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
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
        Container(
          margin: const EdgeInsets.all(10.0),
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
        Container(
          margin: const EdgeInsets.all(10.0),
          child: SwitchContentBar(
            watchValue: use64bitVariant,
            onchanged: (bool? value) => setState(() {
              if (value != null) {
                use64bitVariant = value;
              }
            }),
            displayText: AppLocalizations.of(context)!.use_64bit_variant,
            subtitle:
                AppLocalizations.of(context)!.most_popcap_games_using_non_64bit,
            icon: Icons.question_mark_outlined,
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
                      CompiledText.encode_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        RijndaelC.has(
                          controllerKeyInput.text,
                          controllerKeyInput.text.substring(4, 28),
                        ),
                        use64bitVariant,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_compiled_text_encode,
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
                    ArgumentData(
                      use64bitVariant
                          ? AppLocalizations.of(context)!.true_val
                          : AppLocalizations.of(context)!.false_val,
                      AppLocalizations.of(context)!.use_64bit_variant,
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
