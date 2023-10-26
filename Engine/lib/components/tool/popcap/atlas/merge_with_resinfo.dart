import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/components/tool/popcap/atlas/common.dart';
import 'package:sen_material_design/module/tool/popcap/atlas/merge.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MergeWithResInfo extends StatefulWidget {
  const MergeWithResInfo({super.key});

  @override
  State<MergeWithResInfo> createState() => _MergeWithResInfoState();
}

class _MergeWithResInfoState extends State<MergeWithResInfo> {
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

  int height = 4096;

  int width = 4096;

  int padding = 1;

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.popcap_resinfo_merge_atlas,
          textStyle: theme.textTheme.titleMedium!,
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: ElevatedDirectoryBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickDirectory();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = p.dirname(path);
              }
            },
            isInputDirectory: true,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
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
          displayText: AppLocalizations.of(context)!.select_width,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: DropButtonContent<int>(
            toolTip: AppLocalizations.of(context)!.select_width_subtitle,
            value: width,
            choose: AppLocalizations.of(context)!.select_width,
            onChanged: (value) => setState(() {
              if (value != null) {
                width = value;
              }
            }),
            items: convertItemListToDropDownMenuItemListView<int>(
              ArgumentInputRequires.dimensionSz,
            ),
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.select_height,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: DropButtonContent<int>(
            toolTip: AppLocalizations.of(context)!.select_height_subtitle,
            value: height,
            choose: AppLocalizations.of(context)!.select_height,
            onChanged: (value) => setState(() {
              if (value != null) {
                height = value;
              }
            }),
            items: convertItemListToDropDownMenuItemListView<int>(
              ArgumentInputRequires.dimensionSz,
            ),
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.select_padding,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: DropButtonContent<int>(
            toolTip: AppLocalizations.of(context)!.select_padding_subtitle,
            value: padding,
            choose: AppLocalizations.of(context)!.select_padding,
            onChanged: (value) => setState(() {
              if (value != null) {
                padding = value;
              }
            }),
            items: convertItemListToDropDownMenuItemListView<int>(
              ArgumentInputRequires.paddings,
            ),
          ),
        ),
        ExecuteButton(
          onPressed: () async {
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (BuildContext context) => Debug(
                  () async {
                    await Future.delayed(const Duration(seconds: 1), () {
                      mergeAtlas.process_fs(
                        controllerInput.text,
                        requiresData.has(
                          width,
                          height,
                          padding,
                        ),
                        controllerOutput.text,
                        AppLocalizations.of(context)!
                            .cannot_merge_with_oversized,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_resinfo_merge_atlas,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.directory,
                    ),
                    ArgumentData(
                      width.toString(),
                      AppLocalizations.of(context)!.sheet_width,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      height.toString(),
                      AppLocalizations.of(context)!.sheet_height,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      padding.toString(),
                      AppLocalizations.of(context)!.sheet_padding,
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
