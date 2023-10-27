import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/drop_button.dart';
import 'package:sen_material_design/components/item/elevated/execute_button.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/components/tool/popcap/ptx/common.dart';
import 'package:sen_material_design/module/tool/popcap/sexy_texture/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class PopCapPTXEncode extends StatefulWidget {
  const PopCapPTXEncode({super.key});

  @override
  State<PopCapPTXEncode> createState() => _PopCapPTXEncodeState();
}

class _PopCapPTXEncodeState extends State<PopCapPTXEncode> {
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

  String format = 'argb_8888';

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SenGUI(
      hasGoBack: true,
      children: [
        TitleDisplay(
          displayText: AppLocalizations.of(context)!.popcap_ptx_encode,
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
                controllerOutput.text = '${p.withoutExtension(path)}.ptx';
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
                      SexyTexture.encode_fs(
                        controllerInput.text,
                        controllerOutput.text,
                        CommonTextureEncode.exchangeTextureFormat(
                          format,
                        ),
                        AppLocalizations.of(context)!,
                      );
                    });
                  },
                  AppLocalizations.of(context)!.popcap_ptx_encode,
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
