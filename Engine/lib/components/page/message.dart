import 'package:flutter/material.dart';

class Message {
  bool sendByUser;
  String message;
  String title;
  IconData icon;
  Color color;
  Message(
    this.title,
    this.message,
    this.sendByUser,
    this.icon,
    this.color,
  );
}
