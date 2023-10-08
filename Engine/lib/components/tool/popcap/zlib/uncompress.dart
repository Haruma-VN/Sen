import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/notification_service.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/tool/popcap/zlib/uncompress.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapZlibUncompress extends StatefulWidget {
  const PopCapZlibUncompress({super.key});

  @override
  State<PopCapZlibUncompress> createState() => _PopCapZlibUncompressState();
}

class _PopCapZlibUncompressState extends State<PopCapZlibUncompress> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  String text = '';

  bool allowExecute = true;

  String view = '32bit';

  bool exchangeBitVariant(
    String value,
  ) {
    switch (value) {
      case '32bit':
        {
          return false;
        }
      case '64bit':
        {
          return true;
        }
      default:
        {
          throw Exception('Unknown');
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
                      AppLocalizations.of(context)!.popcap_zlib_uncompress,
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
                              controllerOutput.text = '$path.bin';
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
                              AppLocalizations.of(context)!.use_64bit_variant,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!
                                .most_popcap_games_using_non_64bit,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: view,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: [
                              DropdownMenuItem<String>(
                                value: '32bit',
                                child: Row(
                                  children: <Widget>[
                                    const Icon(
                                      Icons.data_array_outlined,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            AppLocalizations.of(context)!
                                                .false_argument,
                                          ),
                                          Text(
                                            AppLocalizations.of(context)!
                                                .false_val,
                                            style: theme.textTheme.bodySmall!,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    view = '32bit';
                                  });
                                },
                              ),
                              DropdownMenuItem<String>(
                                value: '64bit',
                                child: Row(
                                  children: <Widget>[
                                    const Icon(
                                      Icons.data_array_outlined,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            AppLocalizations.of(context)!
                                                .true_argument,
                                          ),
                                          Text(
                                            AppLocalizations.of(context)!
                                                .true_val,
                                            style: theme.textTheme.bodySmall!,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    view = '64bit';
                                  });
                                },
                              ),
                            ],
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
                      onPressed: allowExecute
                          ? () async {
                              final DateTime startTime = DateTime.now();
                              try {
                                popcapZlibUncompress(
                                  controllerInput.text,
                                  controllerOutput.text,
                                  exchangeBitVariant(view),
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
