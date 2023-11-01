import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/widget/app.dart';
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
    return SenGUI(
      hasGoBack: false,
      children: [
        Column(
          children: [
            ValueListenableBuilder<bool>(
              valueListenable: isLoading,
              builder: (context, value, child) {
                if (value) {
                  return const LinearProgressIndicator();
                } else {
                  return const SizedBox.shrink();
                }
              },
            ),
            Console(
              key: consoleKey,
            ),
            ValueListenableBuilder<bool>(
              valueListenable: isDone,
              builder: (context, value, child) {
                if (value) {
                  return Container(
                    width: double.infinity,
                    margin: const EdgeInsets.fromLTRB(8.0, 0, 8.0, 30.0),
                    height: MediaQuery.of(context).size.height * 0.05,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          vertical: 20,
                        ),
                      ),
                      onPressed: () {
                        Navigator.of(context).pop();
                        isDone.value = false;
                      },
                      child: Text(
                        AppLocalizations.of(context)!.done,
                        style: Theme.of(context).textTheme.bodySmall!.copyWith(
                              fontWeight: FontWeight.w500,
                            ), // Increase font size
                      ),
                    ),
                  );
                } else {
                  return const SizedBox.shrink();
                }
              },
            ),
          ],
        ),
      ],
    );
  }
}
