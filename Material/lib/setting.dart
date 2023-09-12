import 'package:flutter/material.dart';
import 'package:sen_material_design/common/basic.dart';
import 'package:sen_material_design/common/custom.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;
import 'package:sen_material_design/bridge/executor.dart';

// ignore: must_be_immutable
class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  final customization = Customization.init();

  final TextEditingController _controller = TextEditingController(
    text: ApplicationInformation.internalPath.value,
  );

  void displayDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('DONE'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            child: const Text(
              'Sen: Workspace Directory',
              style: TextStyle(
                fontSize: 30,
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
                    controller: _controller,
                    textAlign: TextAlign.center,
                    onChanged: (text) {
                      ApplicationInformation.internalPath.value = text;
                      customization.write(
                        ApplicationInformation.isLightMode.value
                            ? 'light'
                            : 'dark',
                        ApplicationInformation.internalPath.value,
                      );
                      if (FileSystem.fileExists(
                        p.join(
                          text,
                          'Internal.${getExtension()}',
                        ),
                      )) {
                        displayDialog(
                          'Internal Module Found',
                          'Found Internal Module in this workspace',
                        );
                      } else {
                        displayDialog(
                          'Internal Module Not Found',
                          'Not Found Internal Module in this workspace, please select other workspace',
                        );
                      }
                    },
                  ),
                ),
                OutlinedButton(
                  onPressed: () async {
                    final String? path = await FileSystem.pickDirectory();
                    if (path != null) {
                      _controller.text = path;
                      ApplicationInformation.internalPath.value = path;
                      customization.write(
                        ApplicationInformation.isLightMode.value
                            ? 'light'
                            : 'dark',
                        ApplicationInformation.internalPath.value,
                      );
                      if (FileSystem.fileExists(
                        p.join(
                          path,
                          'Internal.${getExtension()}',
                        ),
                      )) {
                        displayDialog(
                          'Internal Module Found',
                          'Found Internal Module in this workspace',
                        );
                      } else {
                        displayDialog(
                          'Internal Module Not Found',
                          'Not Found Internal Module in this workspace, please select other workspace',
                        );
                      }
                    }
                  },
                  child: const Text('Browse'),
                ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ApplicationInformation.isLightMode.value =
              !ApplicationInformation.isLightMode.value;
        },
        child: ValueListenableBuilder(
          valueListenable: ApplicationInformation.isLightMode,
          builder: (context, value, child) {
            if (value) {
              customization.write(
                'light',
                ApplicationInformation.internalPath.value,
              );
              return const Icon(Icons.dark_mode);
            } else {
              customization.write(
                'dark',
                ApplicationInformation.internalPath.value,
              );
              return const Icon(Icons.light_mode);
            }
          },
        ),
      ),
    );
  }
}
