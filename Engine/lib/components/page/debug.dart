import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/page/console.dart';
import 'package:sen_material_design/components/page/execute.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

// ignore: must_be_immutable
class Debug extends StatefulWidget {
  final Function executeTask;
  String functionName;
  List<ArgumentData>? argumentGot;
  List<ArgumentData>? argumentOutput;
  Debug(
    this.executeTask,
    this.functionName, {
    Key? key,
    this.argumentGot,
    this.argumentOutput,
  }) : super(key: key);

  @override
  State<Debug> createState() => _DebugState();
}

class _DebugState extends State<Debug> {
  GlobalKey<ConsoleState> consoleKey = GlobalKey<ConsoleState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (mounted) {
        await execute(
          widget.executeTask,
          widget.functionName,
          AppLocalizations.of(context)!,
          consoleKey.currentState,
          argument: Argument.has(widget.argumentGot, widget.argumentOutput),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          ApplicationInformation.applicationName,
        ),
        centerTitle: false,
        elevation: 3,
        scrolledUnderElevation: 3,
      ),
      body: Column(
        children: [
          Console(
            key: consoleKey,
          ),
        ],
      ),
    );
  }
}
