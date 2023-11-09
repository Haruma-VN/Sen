import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';

class SenGUI extends StatelessWidget {
  const SenGUI({
    super.key,
    required this.hasGoBack,
    required this.children,
    this.bottomNavigationBar,
    this.scrolledUnderElevation,
    this.mWidget,
    this.actions,
  });

  final List<Widget> children;
  final Widget? bottomNavigationBar;
  final bool hasGoBack;
  final double? scrolledUnderElevation;
  final Widget? mWidget;
  final List<Widget>? actions;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          ApplicationInformation.applicationName,
        ),
        centerTitle: false,
        elevation: 3,
        scrolledUnderElevation: scrolledUnderElevation ?? 3,
        automaticallyImplyLeading: hasGoBack,
        actions: actions,
      ),
      body: mWidget ??
          ListView(
            children: [...children],
          ),
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
