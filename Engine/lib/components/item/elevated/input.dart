import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/template.dart';

// ignore: must_be_immutable
class ElevatedInputBarContent extends StatelessWidget {
  ElevatedInputBarContent({
    super.key,
    required this.iconBegin,
    required this.iconEnd,
    required this.child,
    required this.onSubmit,
    this.iconSize,
    this.toolTip,
  });

  final IconData iconBegin;
  final IconData iconEnd;
  final Widget? child;
  final void Function()? onSubmit;
  double? iconSize;
  String? toolTip;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      style: ButtonStyle(
        overlayColor: MaterialStateProperty.resolveWith<Color>(
          (Set<MaterialState> states) {
            if (states.contains(MaterialState.pressed)) {
              return Colors.transparent;
            }
            return Colors.transparent; // Transparent otherwise
          },
        ),
      ),
      child: InputBarContent(
        iconBegin: iconBegin,
        iconEnd: iconEnd,
        onSubmit: onSubmit,
        toolTip: toolTip,
        iconSize: iconSize,
        child: child,
      ),
    );
  }
}
