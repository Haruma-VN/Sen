// ignore_for_file: unused_local_variable

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
  final GlobalKey<AnimatedListState> _listKey = GlobalKey<AnimatedListState>();
  List<Message> messages = [
    Message(
      ApplicationInformation.applicationName,
      'Engine: ${Engine.engineVersion} & Internal: ${Engine.Internal}',
      false,
      Icon(
        Icons.album_outlined,
        color: ApplicationInformation.isDarkMode.value
            ? Colors.white70
            : Colors.black87,
      ),
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
        'Engine: ${Engine.engineVersion} & Internal: ${Engine.Internal}',
        false,
        Icon(
          Icons.album_outlined,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
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
        ApplicationInformation.applicationName,
        AppLocalizations.of(context)!.command_execute_finish,
        false,
        Icon(
          Icons.done_outlined,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
        ApplicationInformation.isDarkMode.value
            ? Colors.white70
            : Colors.black87,
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
        Icon(
          Icons.error_outline,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
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

    String filteredStackTrace = newLines.join('\n');

    add(
      Message(
        AppLocalizations.of(context)!.stack_for_trace_back,
        filteredStackTrace.toString(),
        false,
        Icon(
          Icons.settings_backup_restore_outlined,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
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
        Icon(
          Icons.info_outline,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
        const Color.fromARGB(255, 25, 193, 193),
      ),
    );
    add(
      Message(
        AppLocalizations.of(context)!.argument_obtained,
        input,
        true,
        Icon(
          Icons.info_outline,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
        Colors.green,
      ),
    );
    add(
      Message(
        AppLocalizations.of(context)!.argument_output,
        output,
        true,
        Icon(
          Icons.info_outline,
          color: ApplicationInformation.isDarkMode.value
              ? Colors.white70
              : Colors.black87,
        ),
        Colors.green,
      ),
    );
    return;
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return SingleChildScrollView(
      child: Container(
        width: double.infinity,
        height: 500,
        padding: const EdgeInsets.all(12.0),
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
                child: ListTile(
                  title: Text(
                    messages[index].title,
                    style: theme.textTheme.titleSmall!.copyWith(
                      color: ApplicationInformation.isDarkMode.value
                          ? Colors.white70
                          : Colors.black87,
                    ),
                  ),
                  leading: messages[index].icon,
                  subtitle: Text(
                    messages[index].message,
                    style: theme.textTheme.bodySmall!.copyWith(
                      color: ApplicationInformation.isDarkMode.value
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
    );
  }
}
