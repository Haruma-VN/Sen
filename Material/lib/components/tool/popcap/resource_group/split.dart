import 'package:flutter/material.dart';
import 'package:sen_material_design/module/tool/popcap/resource_group/split.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;

class SplitPopCapResourceGroup extends StatefulWidget {
  const SplitPopCapResourceGroup({super.key});

  @override
  State<SplitPopCapResourceGroup> createState() =>
      _SplitPopCapResourceGroupState();
}

class _SplitPopCapResourceGroupState extends State<SplitPopCapResourceGroup> {
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sen: Material App'),
        centerTitle: true,
        elevation: 3,
        scrolledUnderElevation: 3,
      ),
      body: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: const Text(
                'PopCap Resource: Split',
                style: TextStyle(
                  fontSize: 20,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10.0),
              margin: const EdgeInsets.all(10.0),
              child: const Text(
                'Data File',
                style: TextStyle(
                  fontSize: 15,
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
                      onSubmitted: (text) {
                        this.text = text;
                      },
                    ),
                  ),
                  TextButton(
                    onPressed: () async {
                      final String? path = await FileSystem.pickFile();
                      if (path != null) {
                        controllerInput.text = path;
                        controllerOutput.text =
                            '${p.withoutExtension(path)}.res';
                      }
                    },
                    child: const Text('Browse'),
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
                  fontSize: 15,
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
                      onSubmitted: (text) {
                        this.text = text;
                      },
                    ),
                  ),
                  TextButton(
                    onPressed: () async {
                      final String? path = await FileSystem.pickDirectory();
                      if (path != null) {
                        controllerOutput.text = path;
                      }
                    },
                    child: const Text('Browse'),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: () {
                splitResourceGroup(controllerInput.text, controllerOutput.text);
              },
              child: const Text(
                'Execute',
                style: TextStyle(
                  fontSize: 20,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
