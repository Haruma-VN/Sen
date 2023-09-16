import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/tool/popcap/zlib/uncompress.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

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

  String dropDownDefault = 'Set the default argument to false';

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
                  'PopCap Zlib: Uncompress',
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
                          controllerOutput.text = '$path.bin'.replaceAll(
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
                'Use 64-bit Variant',
              ),
              trailing: Icon(
                customIcon
                    ? Icons.arrow_drop_down_rounded
                    : Icons.arrow_drop_up_rounded,
              ),
              children: <Widget>[
                const ListTile(
                  title: Text(
                    'There are two kind of PopCap Zlib, 64bit and 32bit. Most of PopCap Games using 32bit, such PvZ 2 Chinese ".rsb.smf" or PvZ-Free ".compiled"',
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
                          value: 'Set the default argument to false',
                          child: Center(
                            // Center the text
                            child: Text(
                              'Set the default argument to false',
                            ),
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'Set the default argument to true',
                          child: Center(
                            // Center the text
                            child: Text(
                              'Set the default argument to true',
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
                            popcapZlibUncompress(
                              controllerInput.text,
                              controllerOutput.text,
                              (dropDownDefault ==
                                  'Set the default argument to true'),
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
