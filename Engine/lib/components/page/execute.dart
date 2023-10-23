import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/notification_service.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/components/page/console.dart';
import 'package:sen_material_design/components/page/message.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

final ValueNotifier<bool> isLoading = ValueNotifier<bool>(false);

final ValueNotifier<bool> isDone = ValueNotifier<bool>(false);

void finishCall(ConsoleState? console) {
  if (console != null) {
    console.done();
  }
  return;
}

void callback(
  ConsoleState? console,
  String title,
  String message,
  bool sendByUser,
  IconData icon,
  Color color,
) {
  if (console != null) {
    console.add(
      Message(
        title,
        message,
        sendByUser,
        icon,
        color,
      ),
    );
  }
  return;
}

enum ArgumentType {
  file,
  directory,
  any,
}

class ArgumentData {
  ArgumentType type;
  String message;
  String title;
  ArgumentData(this.message, this.title, this.type);
}

class Argument {
  List<ArgumentData>? argumentGot;
  List<ArgumentData>? argumentOutput;
  Argument();
  Argument.has(this.argumentGot, this.argumentOutput);
}

Future<void> execute(
  Function task,
  String currentFunction,
  AppLocalizations? localizations,
  ConsoleState? console, {
  Argument? argument,
}) async {
  isLoading.value = true;
  final DateTime startTime = DateTime.now();
  callback(
    console,
    localizations != null ? localizations.argument_load : "Argument Loaded:",
    currentFunction,
    false,
    Icons.check_outlined,
    Colors.green,
  );
  if (argument != null) {
    if (argument.argumentGot != null) {
      for (var element in argument.argumentGot!) {
        callback(
          console,
          element.title,
          element.message,
          false,
          Icons.info_outline,
          Colors.cyan,
        );
      }
    }
    if (argument.argumentOutput != null) {
      for (var element in argument.argumentOutput!) {
        if (element.type == ArgumentType.file) {
          if (FileSystem.fileExists(element.message)) {
            callback(
              console,
              localizations == null
                  ? "Execution Warning: File already exists, Sen will override it"
                  : localizations.file_exists_sen_will_override_it,
              element.message,
              false,
              Icons.warning_amber_outlined,
              Colors.yellow,
            );
          }
        }
        if (element.type == ArgumentType.directory) {
          if (FileSystem.directoryExists(element.message)) {
            callback(
              console,
              localizations == null
                  ? "Execution Warning: Directory already exists, file inside will be override"
                  : localizations.folder_exists_sen_will_override_it,
              element.message,
              false,
              Icons.info_outline,
              Colors.yellow,
            );
          }
        }
        callback(
          console,
          element.title,
          element.message,
          false,
          Icons.info_outline,
          Colors.green,
        );
      }
    }
  }
  try {
    await task();
    final DateTime endTime = DateTime.now();
    final Duration difference = endTime.difference(startTime);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      String description = localizations!.command_execute_success(
        '${((difference.inMilliseconds + 1000) / 1000).toStringAsFixed(3)}s',
      );
      if (ApplicationInformation.allowNotification.value) {
        NotificationService.push(
          ApplicationInformation.applicationName,
          description,
        );
      }
      callback(
        console,
        // ignore: unnecessary_null_comparison
        localizations == null
            ? "Execution Finish:"
            : localizations.execution_finish,
        description,
        false,
        Icons.done_outlined,
        Colors.green,
      );
      finishCall(console);
      isLoading.value = false;
      isDone.value = true;
    });
  } catch (e, s) {
    String description = localizations!.command_execute_error(e);
    if (ApplicationInformation.allowNotification.value) {
      NotificationService.push(
        ApplicationInformation.applicationName,
        description,
      );
    }
    if (console != null) {
      console.error(e, s);
    }
    finishCall(console);
    isLoading.value = false;
    isDone.value = true;
  }
  return;
}
