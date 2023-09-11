import 'package:flutter/material.dart';
import 'package:sen_material_design/common/basic.dart';
import 'package:sen_material_design/common/custom.dart';

// ignore: must_be_immutable
class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  final customization = Customization.init();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ApplicationInformation.isLightMode.value =
              !ApplicationInformation.isLightMode.value;
        },
        child: ValueListenableBuilder(
          valueListenable: ApplicationInformation.isLightMode,
          builder: (context, value, child) {
            if (value) {
              customization.write('light');
              return const Icon(Icons.dark_mode);
            } else {
              customization.write('dark');
              return const Icon(Icons.light_mode);
            }
          },
        ),
      ),
    );
  }
}
