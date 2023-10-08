import 'dart:io';

import 'package:flutter/widgets.dart';

class ApplicationInformation {
  static const String applicationName = 'Sen: Lotus Engine';
  static ValueNotifier<bool> isDarkMode = ValueNotifier(true);
  static ValueNotifier<String> libraryPath = ValueNotifier('');
  static ValueNotifier<String> language = ValueNotifier('en');
  static ValueNotifier<bool> storagePermission =
      ValueNotifier(!Platform.isAndroid);
  static ValueNotifier<bool> allowNotification = ValueNotifier(true);
  static ValueNotifier<String> encryptionKey =
      ValueNotifier('65bd1b2305f46eb2806b935aab7630bb');
}
