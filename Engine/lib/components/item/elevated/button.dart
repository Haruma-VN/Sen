import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/input/template.dart';

class RawButton extends StatelessWidget {
  const RawButton({
    super.key,
    required this.onPressed,
    required this.text,
    required this.iconStart,
    required this.iconEnd,
    required this.description,
    this.width,
    this.height,
  });

  final void Function() onPressed;
  final String text;
  final IconData iconStart;
  final IconData iconEnd;
  final double? width;
  final double? height;
  final String description;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Container(
        margin: const EdgeInsets.all(4.0),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(
              vertical: 15,
            ),
          ),
          child: Container(
            margin: const EdgeInsets.all(4.0),
            child: InputBarContentExtendedBeginIcon(
              iconBegin: iconStart,
              iconEnd: iconEnd,
              onSubmit: onPressed,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                  ),
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
