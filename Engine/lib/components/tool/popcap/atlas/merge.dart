import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/tool/popcap/atlas/merge.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

class PopCapAtlasMerge extends StatefulWidget {
  const PopCapAtlasMerge({super.key});

  @override
  State<PopCapAtlasMerge> createState() => _PopCapAtlasMergeState();
}

class _PopCapAtlasMergeState extends State<PopCapAtlasMerge> {
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
                  'PopCap Atlas: Merge',
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
                'Data Directory',
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
                        final String? path = await FileSystem.pickDirectory();
                        if (path != null) {
                          controllerInput.text = path;
                          controllerOutput.text = path.replaceAll(
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
                'Output Directory',
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
            SizedBox(
              width: 200,
              height: 50,
              child: Container(
                padding: const EdgeInsets.all(10.0),
                child: OutlinedButton(
                  onPressed: allowExecute
                      ? () async {
                          final DateTime startTime = DateTime.now();
                          mergeAtlas.process(
                            controllerInput.text,
                            requiresData.has(4096, 4096, 1),
                            controllerOutput.text,
                          );
                          try {
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
