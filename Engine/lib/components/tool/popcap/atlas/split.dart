import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/atlas/split.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapAtlasSplit extends StatefulWidget {
  const PopCapAtlasSplit({super.key});

  @override
  State<PopCapAtlasSplit> createState() => _PopCapAtlasSplitState();
}

class _PopCapAtlasSplitState extends State<PopCapAtlasSplit> {
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

  String view = 'old';

  String exchangeViewValue(
    String value,
  ) {
    switch (value) {
      case 'old':
        {
          return 'array';
        }
      case 'new':
        {
          return 'string';
        }
      default:
        {
          throw Exception(AppLocalizations.of(context)!.invalid_resource_type);
        }
    }
  }

  String splitMethod = 'path';

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText:
              AppLocalizations.of(context)!.popcap_resource_group_split_atlas,
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
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.split_method,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: DropButtonContent<String>(
            toolTip: AppLocalizations.of(context)!.split_method_subtitle,
            value: splitMethod,
            choose: AppLocalizations.of(context)!.split_method,
            items: convertDropDownListToDropDownMenuItemListView<String>(
              [
                DropDownChildren<String>(
                  'id',
                  AppLocalizations.of(context)!.split_by_id,
                ),
                DropDownChildren<String>(
                  'path',
                  AppLocalizations.of(context)!.split_by_path,
                ),
              ],
            ),
            onChanged: (String? value) {
              if (value != null) {
                setState(() {
                  splitMethod = value;
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
                      splitAtlas.process_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        exchangeViewValue(view),
                        splitMethod,
                      );
                    });
                  },
                  AppLocalizations.of(context)!
                      .popcap_resource_group_split_atlas,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      exchangeViewValue(view),
                      AppLocalizations.of(context)!.using_popcap_resource_path,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      splitMethod,
                      AppLocalizations.of(context)!.split_method,
                      ArgumentType.any,
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
