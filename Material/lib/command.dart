// ignore_for_file: unused_local_variable, unused_element

import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/functions.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/widget.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/bridge/method.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

Future<void> refreshModule() async {
  await Future.delayed(
    const Duration(
      milliseconds: 500,
    ),
  );
  return;
}

class _HomePageState extends State<HomePage> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    Method exchangeFunction(
      String id,
    ) {
      switch (id) {
        case 'popcap.resource_group.split':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_split,
              AppLocalizations.of(context)!
                  .popcap_resource_group_split_subtitle,
              Icons.splitscreen,
            );
          }
        case 'popcap.resource_group.merge':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_merge,
              AppLocalizations.of(context)!
                  .popcap_resource_group_merge_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resource_group.to_resinfo':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_to_resinfo,
              AppLocalizations.of(context)!
                  .popcap_resource_group_to_resinfo_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resource_group.from_resinfo':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_from_resinfo,
              AppLocalizations.of(context)!
                  .popcap_resource_group_from_resinfo_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resinfo.split':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resinfo_split,
              AppLocalizations.of(context)!.popcap_resinfo_split_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resinfo.merge':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resinfo_merge,
              AppLocalizations.of(context)!.popcap_resinfo_merge_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resource_group.split_atlas':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_split_atlas,
              AppLocalizations.of(context)!
                  .popcap_resource_group_split_atlas_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resource_group.merge_atlas':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resource_group_merge_atlas,
              AppLocalizations.of(context)!
                  .popcap_resource_group_merge_atlas_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resinfo.split_atlas':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resinfo_split_atlas,
              AppLocalizations.of(context)!.popcap_resinfo_split_atlas_subtitle,
              Icons.terminal,
            );
          }
        case 'popcap.resinfo.merge_atlas':
          {
            return Method.hasIcon(
              AppLocalizations.of(context)!.popcap_resinfo_merge_atlas,
              AppLocalizations.of(context)!.popcap_resinfo_merge_atlas_subtitle,
              Icons.terminal,
            );
          }
        default:
          {
            return Method.hasIcon(
              'name',
              'subtitle',
              Icons.terminal,
            );
          }
      }
    }

    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      body: ListView(
        children: [
          Column(
            children: functionsName
                .map(
                  (e) => InkWell(
                    onHover: (value) {
                      setState(() {
                        isHovering = value;
                      });
                    },
                    child: Container(
                      height: 90,
                      margin: const EdgeInsets.symmetric(
                        vertical: 8.0,
                        horizontal: 15.0,
                      ),
                      decoration: BoxDecoration(
                        color: isHovering
                            ? ApplicationInformation.isLightMode.value
                                ? const Color.fromARGB(255, 255, 183, 207)
                                    .withOpacity(0.7)
                                : const Color.fromARGB(255, 66, 115, 140)
                                    .withOpacity(0.7)
                            : ApplicationInformation.isLightMode.value
                                ? const Color.fromARGB(255, 255, 183, 207)
                                : const Color.fromARGB(255, 66, 115, 140),
                        borderRadius: BorderRadius.circular(20.0),
                        boxShadow: !ApplicationInformation.isLightMode.value
                            ? null
                            : [
                                const BoxShadow(
                                  color: Colors.grey,
                                  blurRadius: 5,
                                  spreadRadius: 3,
                                  offset: Offset(4, 2),
                                ),
                              ],
                      ),
                      child: ListTile(
                        leading: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            Icon(
                              exchangeFunction(e).icon,
                              size: 30.0,
                            ),
                          ],
                        ),
                        title: Text(
                          (exchangeFunction(e).name),
                          style: const TextStyle(
                            fontSize: 25,
                          ),
                        ),
                        subtitle: Text(exchangeFunction(e).subtitle),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (BuildContext context) {
                                return FutureBuilder(
                                  future: refreshModule(),
                                  builder: (
                                    BuildContext context,
                                    AsyncSnapshot snapshot,
                                  ) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.done) {
                                      return materialWidget[e] ??
                                          Scaffold(
                                            appBar: AppBar(
                                              title: const Text(
                                                ApplicationInformation
                                                    .applicationName,
                                              ),
                                              centerTitle: false,
                                              elevation: 3,
                                              scrolledUnderElevation: 3,
                                            ),
                                            body: Text(
                                              AppLocalizations.of(context)!
                                                  .have_not_implemented,
                                            ),
                                          );
                                    } else {
                                      return Scaffold(
                                        appBar: AppBar(
                                          title: const Text(
                                            ApplicationInformation
                                                .applicationName,
                                          ),
                                          centerTitle: false,
                                          elevation: 3,
                                          scrolledUnderElevation: 3,
                                        ),
                                        body: const Center(
                                          child: CircularProgressIndicator(),
                                        ),
                                      );
                                    }
                                  },
                                );
                              },
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}
