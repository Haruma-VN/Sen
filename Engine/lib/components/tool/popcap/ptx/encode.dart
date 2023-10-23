import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
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

  bool allowExecute = true;

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
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          ApplicationInformation.applicationName,
        ),
        centerTitle: false,
        elevation: 3,
        scrolledUnderElevation: 3,
      ),
      body: ListView(
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                  margin: const EdgeInsets.all(10.0),
                  child: Align(
                    alignment: FractionalOffset.bottomLeft,
                    child: Text(
                      AppLocalizations.of(context)!.popcap_ptx_encode,
                      style: theme.textTheme.titleLarge,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                  margin: const EdgeInsets.all(10.0),
                  child: TextField(
                    controller: controllerInput,
                    textAlign: TextAlign.center,
                    onChanged: (String text) {
                      this.text = text;
                    },
                    decoration: InputDecoration(
                      border: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(
                          Radius.circular(20.0),
                        ), // Rounded border
                      ),
                      labelText: AppLocalizations.of(context)!.data_file,
                      alignLabelWithHint: true,
                      suffixIcon: Container(
                        margin: const EdgeInsets.only(
                          right: 10.0,
                        ),
                        child: IconButton(
                          iconSize: 30.0,
                          icon: const Icon(Icons.open_in_new_outlined),
                          tooltip: AppLocalizations.of(context)!.browse,
                          onPressed: () async {
                            final String? path = await FileSystem.pickFile();
                            if (path != null) {
                              controllerInput.text = path;
                              controllerOutput.text =
                                  '${p.withoutExtension(path)}.ptx';
                              setState(() {
                                allowExecute = true;
                              });
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                  margin: const EdgeInsets.all(10.0),
                  child: TextField(
                    controller: controllerOutput,
                    textAlign: TextAlign.center,
                    onChanged: (String text) {
                      this.text = text;
                    },
                    decoration: InputDecoration(
                      border: const OutlineInputBorder(
                        borderRadius: BorderRadius.all(
                          Radius.circular(20.0),
                        ),
                      ),
                      labelText: AppLocalizations.of(context)!.output_file,
                      alignLabelWithHint: true,
                      suffixIcon: Container(
                        margin: const EdgeInsets.only(
                          right: 10.0,
                        ),
                        child: IconButton(
                          iconSize: 30.0,
                          icon: const Icon(Icons.open_in_new_outlined),
                          tooltip: AppLocalizations.of(context)!.browse,
                          onPressed: () async {
                            final String? path =
                                await FileSystem.pickDirectory();
                            if (path != null) {
                              controllerOutput.text = path;
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                  margin: const EdgeInsets.all(8.0),
                  child: Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Column(
                      children: <Widget>[
                        ListTile(
                          leading: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(
                                Icons.question_mark_outlined,
                                size: theme.iconTheme.size,
                                color: Colors.cyan,
                              ),
                            ],
                          ),
                          title: Text(
                            AppLocalizations.of(context)!.execution_argument(
                              AppLocalizations.of(context)!
                                  .select_texture_format,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!.choose_fmt_to_process,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: format,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: CommonTextureEncode.textureFormat
                                .map(
                                  (e) => DropdownMenuItem<String>(
                                    value: e.textureFormat,
                                    child: Row(
                                      children: <Widget>[
                                        const Icon(
                                          Icons
                                              .photo_size_select_actual_outlined,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Text(
                                                e.textureFormat,
                                              ),
                                              Text(
                                                '${e.platform}: ${e.actualFormat}',
                                                style:
                                                    theme.textTheme.bodySmall!,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    onTap: () {
                                      setState(() {
                                        format = e.textureFormat;
                                      });
                                    },
                                  ),
                                )
                                .toList(),
                            onChanged: (_) {},
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.5,
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: OutlinedButton(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => Debug(
                              () async {
                                await Future.delayed(const Duration(seconds: 1),
                                    () {
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
                                  AppLocalizations.of(context)!
                                      .argument_obtained,
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
                      style: OutlinedButton.styleFrom(
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(
                            Radius.circular(20),
                          ),
                        ),
                        padding: const EdgeInsets.all(
                          20.0,
                        ),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.execute,
                        style: theme.textTheme.titleSmall,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
