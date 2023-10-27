import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/elevated/switch.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/pack_for_modding.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapRSBPackForModding extends StatefulWidget {
  const PopCapRSBPackForModding({super.key});

  @override
  State<PopCapRSBPackForModding> createState() =>
      _PopCapRSBPackForModdingState();
}

class _PopCapRSBPackForModdingState extends State<PopCapRSBPackForModding> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  bool useResInfoView = true;

  bool encryptRtonFs = false;

  @override
  void initState() {
    super.initState();
    controllerInput = TextEditingController();
    controllerOutput = TextEditingController();
  }

  @override
  void dispose() {
    controllerInput.dispose();
    controllerOutput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.popcap_rsb_pack_simple,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedDirectoryBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickDirectory();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = p.withoutExtension(path);
              }
            },
            isInputDirectory: true,
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
          displayText: AppLocalizations.of(context)!.encrypt_rton,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: SwitchContentBar(
            watchValue: encryptRtonFs,
            onchanged: (bool? value) => setState(() {
              if (value != null) {
                encryptRtonFs = value;
              }
            }),
            displayText: AppLocalizations.of(context)!.encrypt_rton,
            subtitle: AppLocalizations.of(context)!.encrypt_rton_title,
            icon: Icons.info_outline,
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.use_res_info,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: SwitchContentBar(
            watchValue: useResInfoView,
            onchanged: (bool? value) => setState(() {
              if (value != null) {
                useResInfoView = value;
              }
            }),
            displayText: AppLocalizations.of(context)!.use_res_info,
            subtitle: AppLocalizations.of(context)!.use_res_info_title,
            icon: Icons.info_outline,
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
                      PackModding.process(
                        controllerInput.text,
                        controllerOutput.text,
                        useResInfoView,
                        encryptRtonFs,
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_rsb_pack_simple,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.directory,
                    ),
                    ArgumentData(
                      encryptRtonFs
                          ? AppLocalizations.of(context)!.true_val
                          : AppLocalizations.of(context)!.false_val,
                      AppLocalizations.of(context)!.encrypt_rton,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      useResInfoView
                          ? AppLocalizations.of(context)!.true_val
                          : AppLocalizations.of(context)!.false_val,
                      AppLocalizations.of(context)!.use_res_info,
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
