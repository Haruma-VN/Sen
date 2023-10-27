import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/container.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/unpack_for_modding.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapRSBUnpackForModding extends StatefulWidget {
  const PopCapRSBUnpackForModding({super.key});

  @override
  State<PopCapRSBUnpackForModding> createState() =>
      _PopCapRSBUnpackForModdingState();
}

class _PopCapRSBUnpackForModdingState extends State<PopCapRSBUnpackForModding> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  final List<ExtendsTextureInformation> extendForPvZ2C = [
    ExtendsTextureInformation.sz0,
    ExtendsTextureInformation.sz1,
    ExtendsTextureInformation.sz2,
    ExtendsTextureInformation.sz3,
  ];

  ExtendsTextureInformation extendTextureInformationForPvZ2C =
      ExtendsTextureInformation.sz0;

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

  String view = 'old';

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
          displayText: AppLocalizations.of(context)!.popcap_rsb_unpack_simple,
          textStyle: theme.textTheme.titleMedium!,
        ),
        ContainerHasMargin(
          child: ElevatedFileBarContent(
            controller: controllerInput,
            onUpload: () async {
              final String? path = await FileSystem.pickFile();
              if (path != null) {
                controllerInput.text = path;
                controllerOutput.text = '${(path)}.bundle';
              }
            },
            isDatafile: true,
          ),
        ),
        ContainerHasMargin(
          child: ElevatedDirectoryBarContent(
            controller: controllerOutput,
            isInputDirectory: false,
            onUpload: () async {
              final String? path = await FileSystem.pickDirectory();
              if (path != null) {
                controllerOutput.text = path;
              }
            },
          ),
        ),
        TitleDisplay(
          displayText:
              AppLocalizations.of(context)!.extend_pvz2c_texture_information,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        ContainerHasMargin(
          child: DropButtonContent<ExtendsTextureInformation>(
            toolTip: AppLocalizations.of(context)!
                .do_not_select_if_you_not_modding_2c,
            value: extendTextureInformationForPvZ2C,
            choose:
                AppLocalizations.of(context)!.extend_pvz2c_texture_information,
            items: extendForPvZ2C
                .map(
                  (ExtendsTextureInformation e) =>
                      DropdownMenuItem<ExtendsTextureInformation>(
                    value: e,
                    child: Text(e.index.toString()),
                  ),
                )
                .toList(),
            onChanged: (ExtendsTextureInformation? value) {
              if (value != null) {
                setState(() {
                  extendTextureInformationForPvZ2C = value;
                });
              }
            },
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
                      UnpackModding.process_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        extendTextureInformationForPvZ2C,
                        exchangeViewValue(view),
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_rsb_unpack_simple,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      extendTextureInformationForPvZ2C.index.toString(),
                      AppLocalizations.of(context)!
                          .extend_pvz2c_texture_information,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      view,
                      AppLocalizations.of(context)!.using_popcap_resource_path,
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
