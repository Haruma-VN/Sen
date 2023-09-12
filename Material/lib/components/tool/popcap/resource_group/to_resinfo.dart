import 'package:flutter/material.dart';
import 'package:sen_material_design/common/basic.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/to_resinfo.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:sen_material_design/module/tool/popcap/resource_group/common.dart';

class ToResInfo extends StatefulWidget {
  const ToResInfo({super.key});

  @override
  State<ToResInfo> createState() => _ToResInfoState();
}

class _ToResInfoState extends State<ToResInfo> {
  late TextEditingController controllerInput;
  late TextEditingController controllerOutput;

  String text = '';

  bool allowExecute = false;

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

  String dropDownDefault = '10.3 or below';

  bool customIcon = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          ApplicationInformation.applicationName,
        ),
        centerTitle: false,
        elevation: 3,
        scrolledUnderElevation: 3,
      ),
      body: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: const Center(
                child: Text(
                  'PopCap Resource-Group: Convert to Res-Info',
                  style: TextStyle(
                    fontSize: 25,
                  ),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: const Text(
                'Data File',
                style: TextStyle(
                  fontSize: 20,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controllerInput,
                      textAlign: TextAlign.center,
                      onChanged: (String text) {
                        this.text = text;
                      },
                    ),
                  ),
                  SizedBox(
                    width: 100,
                    height: 40,
                    child: OutlinedButton(
                      onPressed: () async {
                        final String? path = await FileSystem.pickFile();
                        if (path != null) {
                          controllerInput.text = path;
                          controllerOutput.text = p
                              .join(
                                p.dirname(
                                  path,
                                ),
                                'res.json',
                              )
                              .replaceAll(
                                '\\',
                                '/',
                              );
                          setState(() {
                            allowExecute = true;
                          });
                        }
                      },
                      child: const Text('Browse'),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: const Text(
                'Output File',
                style: TextStyle(
                  fontSize: 20,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controllerOutput,
                      textAlign: TextAlign.center,
                      onChanged: (String text) {
                        this.text = text;
                      },
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () async {
                      final String? path = await FileSystem.pickFile();
                      if (path != null) {
                        controllerOutput.text = path;
                      }
                    },
                    child: const Text('Browse'),
                  ),
                ],
              ),
            ),
            ExpansionTile(
              initiallyExpanded: customIcon,
              title: const Text(
                'Using PopCap Resource-Group path',
              ),
              trailing: Icon(
                customIcon
                    ? Icons.arrow_drop_down_rounded
                    : Icons.arrow_drop_up_rounded,
              ),
              children: <Widget>[
                const ListTile(
                  title: Text(
                    'There are two resources kind, set range in the version 10.4 of PvZ 2. The older version will use the older path, and newer version use the newer path.',
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: DropdownButton<String>(
                      value: dropDownDefault,
                      isExpanded: true,
                      focusColor: Colors.transparent,
                      underline: Container(),
                      items: const [
                        DropdownMenuItem(
                          value: '10.3 or below',
                          child: Center(
                            // Center the text
                            child: Text(
                              '10.3 or below',
                            ),
                          ),
                        ),
                        DropdownMenuItem(
                          value: '10.4 or above',
                          child: Center(
                            // Center the text
                            child: Text(
                              '10.4 or above',
                            ),
                          ),
                        ),
                      ],
                      onChanged: (String? value) {
                        setState(
                          () {
                            dropDownDefault = value!;
                          },
                        );
                      },
                    ),
                  ),
                ),
              ],
              onExpansionChanged: (bool value) {
                setState(() {
                  customIcon = value;
                });
              },
            ),
            SizedBox(
              width: 200,
              height: 50,
              child: Container(
                padding: const EdgeInsets.all(10.0),
                child: OutlinedButton(
                  onPressed: allowExecute
                      ? () async {
                          final DateTime startTime = DateTime.now();
                          try {
                            ConvertToResInfo.process(
                              controllerInput.text,
                              controllerOutput.text,
                              (dropDownDefault == '10.3 or below')
                                  ? ExpandPath.array
                                  : ExpandPath.string,
                            );
                            final DateTime endTime = DateTime.now();
                            final Duration difference =
                                endTime.difference(startTime);
                            WidgetsBinding.instance.addPostFrameCallback(
                              (_) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Center(
                                      child: Text(
                                        'Command execute success! Time spent: ${(difference.inMilliseconds / 1000).toStringAsFixed(3)}s',
                                      ),
                                    ),
                                    duration: const Duration(seconds: 2),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              },
                            );
                          } catch (e) {
                            WidgetsBinding.instance.addPostFrameCallback(
                              (_) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Center(
                                      child: Text(
                                        'Command execute failed! Error: $e',
                                      ),
                                    ),
                                    duration: const Duration(seconds: 2),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              },
                            );
                          }
                          return;
                        }
                      : null,
                  child: const Text(
                    'Execute',
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
