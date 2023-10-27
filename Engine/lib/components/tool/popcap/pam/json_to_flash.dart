import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/components/tool/popcap/pam/common.dart';
import 'package:sen_material_design/module/tool/popcap/popcap_re_animation/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapAnimationJsonConvertToFlash extends StatefulWidget {
  const PopCapAnimationJsonConvertToFlash({super.key});

  @override
  State<PopCapAnimationJsonConvertToFlash> createState() =>
      _PopCapAnimationJsonConvertToFlashState();
}

class _PopCapAnimationJsonConvertToFlashState
    extends State<PopCapAnimationJsonConvertToFlash> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  String text = '';

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

  int view = 1536;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText:
              AppLocalizations.of(context)!.popcap_animation_json_to_flash,
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
                controllerOutput.text = '${p.withoutExtension(path)}.xfl';
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
              final String? path = await FileSystem.pickDirectory();
              if (path != null) {
                controllerOutput.text = path;
              }
            },
            isDatafile: false,
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.flash_animation_resize,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: DropButtonContent<int>(
            toolTip: AppLocalizations.of(context)!
                .popcap_animation_flash_animation_resize_subtitle,
            value: view,
            choose: AppLocalizations.of(context)!.flash_animation_resize,
            onChanged: (value) => setState(() {
              if (value != null) {
                view = value;
              }
            }),
            items: convertItemListToDropDownMenuItemListView<int>(
              AnimationCommon.flashAnimationResize,
            ),
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
                      PopCapReAnimation.jsonToFlash(
                        controllerInput.text,
                        controllerOutput.text,
                        view,
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_animation_json_to_flash,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      view.toString(),
                      AppLocalizations.of(context)!.flash_animation_resize,
                      ArgumentType.file,
                    ),
                  ],
                  argumentOutput: [
                    ArgumentData(
                      controllerOutput.text,
                      AppLocalizations.of(context)!.argument_output,
                      ArgumentType.directory,
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
