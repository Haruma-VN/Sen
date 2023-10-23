import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
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
                          .popcap_resource_group_split_atlas,
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
                              controllerOutput.text = p.withoutExtension(path);
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
                              AppLocalizations.of(context)!
                                  .using_popcap_resource_path,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!
                                .using_popcap_resource_path_subtitle,
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
                                value: 'old',
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
                                                .old_version_path,
                                          ),
                                          Text(
                                            AppLocalizations.of(context)!
                                                .old_version_path_subtitle,
                                            style: theme.textTheme.bodySmall!,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    view = 'old';
                                  });
                                },
                              ),
                              DropdownMenuItem<String>(
                                value: 'new',
                                child: Row(
                                  children: <Widget>[
                                    const Icon(
                                      Icons.assignment_outlined,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            AppLocalizations.of(context)!
                                                .new_version_path,
                                          ),
                                          Text(
                                            AppLocalizations.of(context)!
                                                .new_version_path_subtitle,
                                            style: theme.textTheme.bodySmall!,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    view = 'new';
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
                              AppLocalizations.of(context)!.split_method,
                            ),
                            style: theme.textTheme.titleMedium!
                                .copyWith(color: Colors.cyan),
                          ),
                          subtitle: Text(
                            AppLocalizations.of(context)!.split_method_subtitle,
                            style: theme.textTheme.bodySmall,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          margin: const EdgeInsets.all(8.0),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: splitMethod,
                            focusColor: Colors.transparent,
                            underline: Container(),
                            items: [
                              DropdownMenuItem<String>(
                                value: 'id',
                                child: ListView(
                                  children: [
                                    Row(
                                      children: <Widget>[
                                        const Icon(
                                          Icons.data_object_outlined,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Text(
                                                AppLocalizations.of(context)!
                                                    .split_by_id,
                                              ),
                                              Text(
                                                AppLocalizations.of(context)!
                                                    .split_by_id_subtitle,
                                                style:
                                                    theme.textTheme.bodySmall!,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    splitMethod = 'id';
                                  });
                                },
                              ),
                              DropdownMenuItem<String>(
                                value: 'path',
                                child: ListView(
                                  children: [
                                    Row(
                                      children: <Widget>[
                                        const Icon(
                                          Icons.data_object_outlined,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Text(
                                                AppLocalizations.of(context)!
                                                    .split_by_path,
                                              ),
                                              Text(
                                                AppLocalizations.of(context)!
                                                    .split_by_path_subtitle,
                                                style:
                                                    theme.textTheme.bodySmall!,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  setState(() {
                                    splitMethod = 'path';
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
                  width: double.infinity,
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
                                  AppLocalizations.of(context)!
                                      .argument_obtained,
                                  ArgumentType.file,
                                ),
                                ArgumentData(
                                  exchangeViewValue(view),
                                  AppLocalizations.of(context)!
                                      .using_popcap_resource_path,
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
