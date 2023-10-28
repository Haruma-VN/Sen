import 'package:flutter/material.dart';

// ignore: must_be_immutable
class InputBarContent extends StatelessWidget {
  InputBarContent({
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
  double? iconSize = 18;
  String? toolTip;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IgnorePointer(
          child: IconButton(
            icon: Icon(
              iconBegin,
              size: iconSize,
            ),
            onPressed: () {},
          ),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: child ?? const SizedBox(),
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: Icon(
            iconEnd,
            size: iconSize,
          ),
          onPressed: onSubmit,
          tooltip: toolTip,
        ),
      ],
    );
  }
}

// ignore: must_be_immutable
class InputBarContentExtendedBeginIcon extends StatelessWidget {
  InputBarContentExtendedBeginIcon({
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
  double? iconSize = 18;
  String? toolTip;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const SizedBox(width: 10),
        IgnorePointer(
          child: IconButton(
            icon: Icon(
              iconBegin,
              size: iconSize,
            ),
            onPressed: () {},
          ),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: child ?? const SizedBox(),
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: Icon(
            iconEnd,
            size: iconSize,
          ),
          onPressed: onSubmit,
          tooltip: toolTip,
        ),
      ],
    );
  }
}
