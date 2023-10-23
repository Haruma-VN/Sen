// ignore_for_file: unused_local_variable

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/common/version.dart';
import 'package:sen_material_design/components/page/message.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Console extends StatefulWidget {
  const Console({Key? key}) : super(key: key);

  @override
  ConsoleState createState() => ConsoleState();
}

class ConsoleState extends State<Console> {
  static IconData senIcon() {
    if (Platform.isAndroid) {
      return Icons.android_outlined;
    } else if (Platform.isIOS || Platform.isMacOS) {
      return Icons.apple_outlined;
    } else if (Platform.isWindows) {
      return Icons.window_outlined;
    } else {
      return Icons.device_unknown_outlined;
    }
  }

  static String platform() {
    if (Platform.isAndroid) {
      return 'Android';
    } else if (Platform.isIOS) {
      return 'iOS';
    } else if (Platform.isWindows) {
      return 'Windows';
    } else if (Platform.isLinux) {
      return 'Linux';
    } else if (Platform.isMacOS) {
      return 'Macintosh';
    } else {
      return 'Unknown';
    }
  }

  final GlobalKey<AnimatedListState> _listKey = GlobalKey<AnimatedListState>();
  List<Message> messages = [
    Message(
      ApplicationInformation.applicationName,
      'Build Version: ${Engine.version} | Engine: ${Engine.engineVersion} & Internal: ${Engine.Internal} | ${platform()}',
      false,
      senIcon(),
      ApplicationInformation.isDarkMode.value ? Colors.white70 : Colors.black87,
    ),
  ];

  void reset() {
    for (int i = messages.length - 1; i >= 0; i--) {
      Message removedItem = messages.removeAt(i);
      _listKey.currentState?.removeItem(
        i,
        (BuildContext context, Animation<double> animation) => Container(),
        duration: const Duration(milliseconds: 0),
      );
    }
    add(
      Message(
        ApplicationInformation.applicationName,
        '${AppLocalizations.of(context)!.build_version}: ${Engine.version} | Engine: ${Engine.engineVersion} & Internal: ${Engine.Internal} | ${platform()}',
        false,
        senIcon(),
        ApplicationInformation.isDarkMode.value
            ? Colors.white70
            : Colors.black87,
      ),
    );
  }

  void add(Message message) {
    int index = messages.length;
    setState(() {
      messages.add(message);
      _listKey.currentState?.insertItem(index);
    });
  }

  void done() {
    add(
      Message(
        AppLocalizations.of(context)!.all_arguments_have_been_executed,
        AppLocalizations.of(context)!.command_execute_finish,
        false,
        Icons.done_all_outlined,
        Colors.green,
      ),
    );
    return;
  }

  void error(Object reason, StackTrace stack) {
    add(
      Message(
        AppLocalizations.of(context)!.execution_error,
        (reason).toString(),
        false,
        Icons.done_outlined,
        Colors.red,
      ),
    );
    String stackTrace = stack.toString();
    List<String> lines = stackTrace.split('\n');
    List<String> newLines = [];

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].contains('package:sen_material_design')) {
        newLines.add(
          lines[i].replaceAll(RegExp(r'^#\d+', multiLine: true), '').trimLeft(),
        );
      }
    }
    final String filteredStackTrace = newLines.join('\n');
    add(
      Message(
        AppLocalizations.of(context)!.stack_for_trace_back,
        filteredStackTrace.toString(),
        false,
        Icons.error_outline,
        Colors.red,
      ),
    );
    return;
  }

  void sendRequest(
    String function,
    String input,
    String output,
  ) {
    add(
      Message(
        AppLocalizations.of(context)!.argument_load,
        function,
        true,
        Icons.done_outlined,
        const Color.fromARGB(255, 25, 193, 193),
      ),
    );
    add(
      Message(
        AppLocalizations.of(context)!.argument_obtained,
        input,
        true,
        Icons.done_outlined,
        Colors.green,
      ),
    );
    add(
      Message(
        AppLocalizations.of(context)!.argument_output,
        output,
        true,
        Icons.done_outlined,
        Colors.green,
      ),
    );
    return;
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Column(
      children: [
        Container(
          width: double.infinity,
          height: (MediaQuery.of(context).size.height) * 0.8,
          padding: const EdgeInsets.all(8.0),
          child: AnimatedList(
            key: _listKey,
            initialItemCount: messages.length,
            itemBuilder: (context, index, animation) {
              return SlideTransition(
                position: animation.drive(
                  Tween<Offset>(
                    begin: const Offset(-1, 0),
                    end: Offset.zero,
                  ),
                ),
                child: Card(
                  color: messages[index].color,
                  child: ListTile(
                    title: Text(
                      messages[index].title,
                      style: theme.textTheme.titleSmall!.copyWith(
                        color: messages[index].color == Colors.black87
                            ? Colors.white70
                            : Colors.black87,
                      ),
                    ),
                    leading: Icon(
                      messages[index].icon,
                      color: messages[index].color == Colors.black87
                          ? Colors.white70
                          : Colors.black87,
                    ),
                    subtitle: Text(
                      messages[index].message,
                      style: theme.textTheme.bodySmall!.copyWith(
                        color: messages[index].color == Colors.black87
                            ? Colors.white70
                            : Colors.black87,
                      ),
                    ),
                    enabled: false,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
