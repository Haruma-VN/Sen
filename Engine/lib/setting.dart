import 'dart:io';

import 'package:flutter/material.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/common/custom.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

// ignore: must_be_immutable
class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  final customization = Customization.init();

  void displayDialog(String title, String message, List<Widget>? widget) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            title,
            style: Theme.of(context).textTheme.titleMedium!,
          ),
          content: Text(
            message,
            style: Theme.of(context).textTheme.titleSmall!,
          ),
          actions: widget,
        );
      },
    );
  }

  String getCurrentArchitecture() {
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

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Scaffold(
      body: ListView(
        children: [
          Container(
            padding: const EdgeInsets.all(10.0),
            margin: const EdgeInsets.all(10.0),
            child: Column(
              children: [
                Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      child: Text(
                        AppLocalizations.of(context)!.home,
                        style: theme.textTheme.titleMedium!,
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.architecture_sharp,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.architecture),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!.current_platform,
                        style: theme.textTheme.bodySmall,
                      ),
                      trailing: SizedBox(
                        child: Text(
                          getCurrentArchitecture(),
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.language,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.language),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!.current_language,
                        style: theme.textTheme.bodySmall,
                      ),
                      onTap: () {},
                      trailing: SizedBox(
                        child: Text(
                          AppLocalizations.of(context)!.english,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.auto_graph,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.theme),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!.switch_current_theme,
                        style: theme.textTheme.bodySmall,
                      ),
                      onTap: () {},
                      trailing: SizedBox(
                        child: Text(
                          ApplicationInformation.isLightMode.value
                              ? AppLocalizations.of(context)!.light
                              : AppLocalizations.of(context)!.dark,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.library_add_rounded,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.library),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!.current_workspace,
                        style: theme.textTheme.bodySmall,
                      ),
                      onTap: () {},
                      trailing: SizedBox(
                        child: Text(
                          ApplicationInformation.libraryPath.value != ''
                              ? '~'
                              : '?',
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      child: Text(
                        AppLocalizations.of(context)!.miscellaneous,
                        style: theme.textTheme.titleMedium!,
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.sd_storage_rounded,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.storage_permission),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!
                            .storage_permission_for_android,
                        style: theme.textTheme.bodySmall,
                      ),
                      onTap: () {},
                      trailing: SizedBox(
                        child: Text(
                          AppLocalizations.of(context)!.granted,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.notifications,
                            size: theme.iconTheme.size,
                          ),
                        ],
                      ),
                      title: Text(
                        (AppLocalizations.of(context)!.allow_notification),
                        style: theme.textTheme.titleMedium,
                      ),
                      subtitle: Text(
                        AppLocalizations.of(context)!
                            .allow_notification_subtitle,
                        style: theme.textTheme.bodySmall,
                      ),
                      onTap: () {},
                      trailing: SizedBox(
                        child: Text(
                          AppLocalizations.of(context)!.granted,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Align(
            alignment: FractionalOffset.bottomCenter,
            child: Column(
              children: [
                Text(
                  AppLocalizations.of(context)!.sen_subtitle,
                  style: theme.textTheme.bodyMedium!,
                ),
                Container(
                  padding: const EdgeInsets.all(10.0),
                  child: Text(
                    AppLocalizations.of(context)!.copyright_sen,
                    style: theme.textTheme.titleSmall!,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
