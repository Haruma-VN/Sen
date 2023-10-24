// ignore_for_file: prefer_final_fields

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/item/elevated/directory.dart';
import 'package:sen_material_design/components/item/elevated/file.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/resource_stream_bundle/unpack.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapRSBUnpack extends StatefulWidget {
  const PopCapRSBUnpack({super.key});

  @override
  State<PopCapRSBUnpack> createState() => _PopCapRSBUnpackState();
}

class _PopCapRSBUnpackState extends State<PopCapRSBUnpack> {
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
                  margin: const EdgeInsets.all(10.0),
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
                Container(
                  margin: const EdgeInsets.all(10.0),
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
                SizedBox(
                  width: double.infinity,
                  child: Container(
                    padding: const EdgeInsets.all(8.0),
                    child: ElevatedButton(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => Debug(
                              () async {
                                await Future.delayed(const Duration(seconds: 1),
                                    () {
                                  Unpack.process(
                                    controllerInput.text,
                                    controllerOutput.text,
                                    AppLocalizations.of(context)!,
                                  );
                                });
                              },
                              AppLocalizations.of(context)!.popcap_rsb_unpack,
                              argumentGot: [
                                ArgumentData(
                                  controllerInput.text,
                                  AppLocalizations.of(context)!
                                      .argument_obtained,
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
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          vertical: 20,
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
