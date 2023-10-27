import 'package:flutter/material.dart';

class ContainerHasMargin extends StatelessWidget {
  const ContainerHasMargin({
    super.key,
    required this.child,
  });

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(10.0),
      child: child,
    );
  }
}
