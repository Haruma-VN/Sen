import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/notification_service.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/tool/wwise/sound_bank/common.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

class WWiseSoundBankEncode extends StatefulWidget {
  const WWiseSoundBankEncode({super.key});

  @override
  State<WWiseSoundBankEncode> createState() => _WWiseSoundBankEncodeState();
}

class _WWiseSoundBankEncodeState extends State<WWiseSoundBankEncode> {
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
                      AppLocalizations.of(context)!.wwise_soundbank_encode,
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
                      labelText: AppLocalizations.of(context)!.input_directory,
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
                              controllerInput.text = path;
                              controllerOutput.text =
                                  '${p.withoutExtension(path)}.bnk';
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
                            final String? path = await FileSystem.pickFile();
                            if (path != null) {
                              controllerOutput.text = path;
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.5,
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: OutlinedButton(
                      onPressed: allowExecute
                          ? () async {
                              final DateTime startTime = DateTime.now();
                              try {
                                WWiseSoundBank.encode_fs(
                                  controllerInput.text,
                                  controllerOutput.text,
                                  AppLocalizations.of(context)!,
                                );
                                final DateTime endTime = DateTime.now();
                                final Duration difference =
                                    endTime.difference(startTime);
                                WidgetsBinding.instance.addPostFrameCallback(
                                  (_) {
                                    String description =
                                        AppLocalizations.of(context)!
                                            .command_execute_success(
                                      '${(difference.inMilliseconds / 1000).toStringAsFixed(3)}s',
                                    );
                                    if (ApplicationInformation
                                        .allowNotification.value) {
                                      NotificationService.push(
                                        ApplicationInformation.applicationName,
                                        description,
                                      );
                                    }
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          description,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(color: Colors.white),
                                          textAlign: TextAlign.center,
                                        ),
                                        duration: const Duration(seconds: 2),
                                        backgroundColor:
                                            Theme.of(context).brightness ==
                                                    Brightness.dark
                                                ? Colors.green[600]
                                                : Colors.green[500],
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12.0),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              } catch (e) {
                                WidgetsBinding.instance.addPostFrameCallback(
                                  (_) {
                                    String description =
                                        AppLocalizations.of(context)!
                                            .command_execute_error(e);
                                    if (ApplicationInformation
                                        .allowNotification.value) {
                                      NotificationService.push(
                                        ApplicationInformation.applicationName,
                                        description,
                                      );
                                    }
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          description,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(color: Colors.white),
                                          textAlign: TextAlign.center,
                                        ),
                                        duration: const Duration(seconds: 2),
                                        backgroundColor:
                                            Theme.of(context).brightness ==
                                                    Brightness.dark
                                                ? Colors.red[300]
                                                : Colors.red[900],
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12.0),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              }
                              return;
                            }
                          : null,
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