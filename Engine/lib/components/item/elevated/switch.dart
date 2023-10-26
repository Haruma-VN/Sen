import 'package:flutter/material.dart';

// ignore: must_be_immutable
class SwitchContentBar extends StatelessWidget {
  SwitchContentBar({
    super.key,
    required this.watchValue,
    required this.onchanged,
    required this.displayText,
    required this.subtitle,
    required this.icon,
    this.iconSize,
  });

  final bool watchValue;
  final void Function(bool? value) onchanged;
  final String displayText;
  final String subtitle;
  double? iconSize = 18;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      child: Container(
        padding: const EdgeInsets.fromLTRB(0.0, 8.0, 8.0, 8.0),
        child: Row(
          children: [
            IgnorePointer(
              child: IconButton(
                icon: Icon(
                  icon,
                  size: iconSize,
                ),
                onPressed: () {},
              ),
            ),
            const SizedBox(width: 4),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayText,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
            const Expanded(
              child: SizedBox(),
            ),
            const SizedBox(width: 8),
            Switch(
              value: watchValue,
              onChanged: onchanged,
            ),
          ],
        ),
      ),
      onPressed: () {},
    );
  }
}
