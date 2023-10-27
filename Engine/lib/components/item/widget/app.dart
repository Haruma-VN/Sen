import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';

class SenGUI extends StatelessWidget {
  const SenGUI({
    super.key,
    required this.hasGoBack,
    required this.children,
    this.bottomNavigationBar,
  });

  final List<Widget> children;
  final Widget? bottomNavigationBar;
  final bool hasGoBack;

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
        automaticallyImplyLeading: hasGoBack,
      ),
      body: ListView(
        children: [...children],
      ),
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}