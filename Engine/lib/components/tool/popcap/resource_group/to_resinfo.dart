import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/to_resinfo.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class ToResInfo extends StatefulWidget {
  const ToResInfo({super.key});

  @override
  State<ToResInfo> createState() => _ToResInfoState();
}

class _ToResInfoState extends State<ToResInfo> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  String view = 'old';

  ExpandPath exchangeViewValue(
    String value,
  ) {
    switch (value) {
      case 'old':
        {
          return ExpandPath.array;
        }
      case 'new':
        {
          return ExpandPath.string;
        }
      default:
        {
          throw Exception(AppLocalizations.of(context)!.invalid_resource_type);
        }
    }
  }

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
              AppLocalizations.of(context)!.popcap_resource_group_to_resinfo,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = p.join(p.dirname(path), 'res.json');
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
          displayText: AppLocalizations.of(context)!.using_popcap_resource_path,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: DropButtonContent<String>(
            toolTip: AppLocalizations.of(context)!
                .using_popcap_resource_path_subtitle,
            value: view,
            choose: AppLocalizations.of(context)!.using_popcap_resource_path,
            items: convertDropDownListToDropDownMenuItemListView<String>(
              [
                DropDownChildren<String>(
                  'old',
                  AppLocalizations.of(context)!.old_version_path,
                ),
                DropDownChildren<String>(
                  'new',
                  AppLocalizations.of(context)!.new_version_path,
                ),
              ],
            ),
            onChanged: (String? value) {
              if (value != null) {
                setState(() {
                  view = value;
                });
              }
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
                      ConvertToResInfo.process(
                        controllerInput.text,
                        controllerOutput.text,
                        exchangeViewValue(view),
                      );
                    });
                  },
                  AppLocalizations.of(context)!
                      .popcap_resource_group_to_resinfo,
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
