import 'package:flutter/widgets.dart';

class ApplicationInformation {
  static const String applicationName = 'Sen: Lotus Engine';
  static String commandPage = 'Commands';
  static String settingPage = 'Settings';
  static ValueNotifier<bool> isLightMode = ValueNotifier(true);
  static ValueNotifier<String> internalPath = ValueNotifier("");
}
