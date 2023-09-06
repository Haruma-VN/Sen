import 'package:flutter/material.dart';

// ignore: must_be_immutable
class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  bool useLightMode = true;
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        children: [
          Center(
            child: Row(
              children: [],
            ),
          )
        ],
      ),
    );
  }
}
