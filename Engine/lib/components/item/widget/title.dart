import 'package:flutter/material.dart';

// ignore: must_be_immutable
class TitleDisplay extends StatelessWidget {
  TitleDisplay({
    super.key,
    required this.displayText,
    required this.textStyle,
  });

  final String displayText;
  TextStyle textStyle;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: FractionalOffset.bottomLeft,
      child: Container(
        margin: const EdgeInsets.fromLTRB(3, 0, 0, 0),
        padding: const EdgeInsets.all(10.0),
        child: Text(
          displayText,
          style: textStyle,
        ),
      ),
    );
  }
}
