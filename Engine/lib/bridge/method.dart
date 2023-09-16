import 'package:flutter/material.dart';

class Method {
  String name;

  String subtitle;

  IconData icon = Icons.terminal;

  Method(
    this.name,
    this.subtitle,
  );

  Method.hasIcon(
    this.name,
    this.subtitle,
    this.icon,
  );
}
