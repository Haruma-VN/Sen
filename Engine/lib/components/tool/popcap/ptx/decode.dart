import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/elevated/input.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/components/tool/popcap/ptx/common.dart';
import 'package:sen_material_design/module/tool/popcap/sexy_texture/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapPTXDecode extends StatefulWidget {
  const PopCapPTXDecode({super.key});

  @override
  State<PopCapPTXDecode> createState() => _PopCapPTXDecodeState();
}

class _PopCapPTXDecodeState extends State<PopCapPTXDecode> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;
  late TextEditingController inputHeight;
  late TextEditingController inputWidth;

  String text = '';

  @override
  void initState() {
    super.initState();
    controllerInput = TextEditingController();
    controllerOutput = TextEditingController();
    inputHeight = TextEditingController();
    inputWidth = TextEditingController();
  }

  @override
  void dispose() {
    controllerInput.dispose();
    controllerOutput.dispose();
    inputWidth.dispose();
    inputHeight.dispose();
    super.dispose();
  }

  String format = 'argb_8888';

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.popcap_ptx_decode,
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
                controllerOutput.text = '${p.withoutExtension(path)}.png';
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
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.input_width,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: ElevatedInputTextField(
            controller: inputWidth,
            icon: Icons.info_outline,
            labelText: AppLocalizations.of(context)!.input_width,
            onChanged: (value) => setState(() {
              inputWidth.text = value;
            }),
            toolTip: AppLocalizations.of(context)!.input_width,
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.input_height,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: ElevatedInputTextField(
            controller: inputHeight,
            icon: Icons.info_outline,
            labelText: AppLocalizations.of(context)!.input_height,
            onChanged: (value) => setState(() {
              inputHeight.text = value;
            }),
            toolTip: AppLocalizations.of(context)!.input_height,
          ),
        ),
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.select_texture_format,
          textStyle: theme.textTheme.bodySmall!.copyWith(
            fontWeight: FontWeight.w400,
          ),
        ),
        Container(
          margin: const EdgeInsets.all(10.0),
          child: DropButtonContent<String>(
            toolTip: AppLocalizations.of(context)!.choose_fmt_to_process,
            value: format,
            choose: AppLocalizations.of(context)!.select_texture_format,
            onChanged: (value) => setState(() {
              if (value != null) {
                format = value;
              }
            }),
            items: convertItemListToDropDownMenuItemListView<String>(
              CommonTextureEncode.textureFormat
                  .map(
                    (e) => e.textureFormat,
                  )
                  .toList(),
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
                      SexyTexture.decode_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        CommonTextureEncode.exchangeTextureFormat(
                          format,
                        ),
                        int.parse(inputWidth.text),
                        int.parse(inputHeight.text),
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_ptx_decode,
                  argumentGot: [
                    ArgumentData(
                      controllerInput.text,
                      AppLocalizations.of(context)!.argument_obtained,
                      ArgumentType.file,
                    ),
                    ArgumentData(
                      format,
                      AppLocalizations.of(context)!.texture_format,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      inputWidth.text,
                      AppLocalizations.of(context)!.sheet_width,
                      ArgumentType.any,
                    ),
                    ArgumentData(
                      inputHeight.text,
                      AppLocalizations.of(context)!.sheet_height,
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
