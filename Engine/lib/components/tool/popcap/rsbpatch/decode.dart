import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/input/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle_patch/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapRSBPatchDecode extends StatefulWidget {
  const PopCapRSBPatchDecode({super.key});

  @override
  State<PopCapRSBPatchDecode> createState() => _PopCapRSBPatchEncodeState();
}

class _PopCapRSBPatchEncodeState extends State<PopCapRSBPatchDecode> {
  late TextEditingController controllerInput;
  late TextEditingController controllerAfter;
  late TextEditingController controllerOutput;

  @override
  void initState() {
    super.initState();
    controllerInput = TextEditingController();
    controllerOutput = TextEditingController();
    controllerAfter = TextEditingController();
  }

  @override
  void dispose() {
    controllerInput.dispose();
    controllerAfter.dispose();
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
          displayText: AppLocalizations.of(context)!.popcap_rsbpatch_decode,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedVCDiffFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = '${p.withoutExtension(path)}.patch.rsb';
              }
            },
            vcdiffFileType: VCDiffFileType.before,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedVCDiffFileBarContent(
            controller: controllerAfter,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerAfter.text = path;
              }
            },
            vcdiffFileType: VCDiffFileType.patch,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedVCDiffFileBarContent(
            controller: controllerOutput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerOutput.text = path;
              }
            },
            vcdiffFileType: VCDiffFileType.after,
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
                      ResourceStreamBundlePatch.decodeFs(
                        controllerInput.text,
                        controllerAfter.text,
                        controllerOutput.text,
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_rsbpatch_decode,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.before_file,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      controllerAfter.text,
                      AppLocalizations.of(context)!.patch_file,
                      ArgumentType.file,
                    ),
                  ],
                  argumentOutput: [
                    ArgumentData(
                      controllerOutput.text,
                      AppLocalizations.of(context)!.after_file,
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
