import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/page/debug.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:sen_material_design/module/tool/popcap/atlas/merge.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PopCapAtlasMerge extends StatefulWidget {
  const PopCapAtlasMerge({super.key});

  @override
  State<PopCapAtlasMerge> createState() => _PopCapAtlasMergeState();
}

class _PopCapAtlasMergeState extends State<PopCapAtlasMerge> {
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

  String height = '4096';

  String width = '4096';

  final List<String> available = [
    '128',
    '256',
    '512',
    '1024',
    '2048',
    '4096',
    '8192',
    '16384',
  ];

  final List<String> paddings = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
  ];

  String padding = '1';

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
                      AppLocalizations.of(context)!
                          .popcap_resource_group_merge_atlas,
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
                              controllerOutput.text = p.dirname(path);
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
                      labelText: AppLocalizations.of(context)!.output_directory,
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
                              AppLocalizations.of(context)!.select_width,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!.select_width_subtitle,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: width,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: available
                                .map(
                                  (e) => DropdownMenuItem<String>(
                                    value: e,
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
                                                e,
                                              ),
                                              Text(
                                                e,
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
                                        width = e;
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
                              AppLocalizations.of(context)!.select_height,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!
                                .select_height_subtitle,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: height,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: available
                                .map(
                                  (e) => DropdownMenuItem<String>(
                                    value: e,
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
                                                e,
                                              ),
                                              Text(
                                                e,
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
                                        height = e;
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
                              AppLocalizations.of(context)!.select_padding,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!
                                .select_padding_subtitle,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: padding,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: paddings
                                .map(
                                  (e) => DropdownMenuItem<String>(
                                    value: e,
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
                                                e,
                                              ),
                                              Text(
                                                e,
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
                                        padding = e;
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
                                  mergeAtlas.process(
                                    controllerInput.text,
                                    requiresData.has(
                                      int.parse(width),
                                      int.parse(height),
                                      int.parse(padding),
                                    ),
                                    controllerOutput.text,
                                    AppLocalizations.of(context)!
                                        .cannot_merge_with_oversized,
                                  );
                                });
                              },
                              AppLocalizations.of(context)!
                                  .popcap_resource_group_merge_atlas,
                              argumentGot: [
                                ArgumentData(
                                  controllerInput.text,
                                  AppLocalizations.of(context)!
                                      .argument_obtained,
                                  ArgumentType.directory,
                                ),
                                ArgumentData(
                                  width,
                                  AppLocalizations.of(context)!.sheet_width,
                                  ArgumentType.any,
                                ),
                                ArgumentData(
                                  height,
                                  AppLocalizations.of(context)!.sheet_height,
                                  ArgumentType.any,
                                ),
                                ArgumentData(
                                  padding,
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
