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
            return Colors.transparent;
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

// ignore: must_be_immutable
class ElevatedInputTextField extends StatelessWidget {
  ElevatedInputTextField({
    super.key,
    required this.icon,
    required this.labelText,
    required this.controller,
    required this.onChanged,
    this.iconSize,
    this.toolTip,
  });

  final IconData icon;
  final void Function(String value)? onChanged;
  double? iconSize;
  String? toolTip;
  final TextEditingController? controller;
  final String labelText;

  @override
  Widget build(BuildContext context) {
    return ElevatedInputBarContent(
      iconBegin: Icons.text_fields_outlined,
      iconEnd: icon,
      iconSize: iconSize,
      toolTip: toolTip,
      onSubmit: () {},
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          labelText: labelText,
          border: InputBorder.none,
        ),
        onChanged: onChanged,
      ),
    );
  }
}
