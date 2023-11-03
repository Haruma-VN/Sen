import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/button.dart';

class RSBWorkspaceItemList extends StatelessWidget {
  const RSBWorkspaceItemList({
    super.key,
    required this.text,
    required this.onPressed,
  });

  final void Function() onPressed;
  final String text;

  @override
  Widget build(BuildContext context) {
    return RawButton(
      onPressed: onPressed,
      description: '',
      iconStart: Icons.data_object_outlined,
      iconEnd: Icons.arrow_right_outlined,
      text: text,
    );
  }
}
