import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/split.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SplitPopCapResourceGroup extends StatefulWidget {
  const SplitPopCapResourceGroup({super.key});

  @override
  State<SplitPopCapResourceGroup> createState() =>
      _SplitPopCapResourceGroupState();
}

class _SplitPopCapResourceGroupState extends State<SplitPopCapResourceGroup> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

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
          displayText:
              AppLocalizations.of(context)!.popcap_resource_group_split,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = '${p.withoutExtension(path)}.res';
              }
            },
            isDatafile: true,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedDirectoryBarContent(
            controller: controllerOutput,
            onUpload: () async {
              final String? path = await FileSystem.pickDirectory();
              if (path != null) {
                controllerOutput.text = path;
              }
            },
            isInputDirectory: false,
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
                      splitResourceGroup(
                        controllerInput.text,
                        controllerOutput.text,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_resource_group_split,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
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
