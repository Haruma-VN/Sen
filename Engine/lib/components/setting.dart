import 'dart:io';
import 'package:flutter/material.dart';
import 'package:sen_material_design/common/custom.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/common/version.dart';
import 'package:sen_material_design/components/page/language.dart';
import 'package:sen_material_design/bridge/service.dart';
import 'package:sen_material_design/module/utility/io/common.dart';

// ignore: must_be_immutable
class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  final customization = Customization.init();
  final TextEditingController controller = TextEditingController(
    text: ApplicationInformation.libraryPath.value,
  );

  void displayDialog(
    Widget? title,
    Widget? content,
    List<Widget>? widget,
  ) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: title,
          content: content,
          actions: widget,
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
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

  void showSnackbar(
    String message,
  ) {
    final snackBar = SnackBar(
      backgroundColor: Theme.of(context).brightness == Brightness.dark
          ? Colors.grey[800]
          : Colors.white,
      content: Text(
        message,
        style: TextStyle(
          color: Theme.of(context).brightness == Brightness.dark
              ? Colors.white
              : Colors.black,
        ),
      ),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
    return;
  }

  String exchangeLanguageCode(
    String languageCode,
  ) {
    switch (languageCode) {
      case 'vi':
        {
          return AppLocalizations.of(context)!.vietnamese;
        }
      case 'en':
        {
          return AppLocalizations.of(context)!.english;
        }
      case 'ru':
        {
          return AppLocalizations.of(context)!.russian;
        }
      default:
        {
          return languageCode;
        }
    }
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Scaffold(
      body: ListView(
        children: [
          Column(
            children: [
              Column(
                children: [
                  Align(
                    alignment: FractionalOffset.bottomLeft,
                    child: Container(
                      margin: const EdgeInsets.fromLTRB(3, 0, 0, 0),
                      padding: const EdgeInsets.all(10.0),
                      child: Text(
                        AppLocalizations.of(context)!.home,
                        style: theme.textTheme.bodySmall!
                            .copyWith(fontWeight: FontWeight.w400),
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.memory_outlined,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.platform),
                      style: theme.textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      getCurrentArchitecture(),
                      style: theme.textTheme.bodySmall,
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.language_outlined,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.language),
                      style: theme.textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      exchangeLanguageCode(
                        ApplicationInformation.language.value,
                      ),
                      style: theme.textTheme.bodySmall!,
                    ),
                    onTap: () {
                      displayDialog(
                        Text(AppLocalizations.of(context)!.language),
                        SizedBox(
                          height: 100,
                          child: LanguageSelectorDialog(),
                        ),
                        [
                          TextButton(
                            onPressed: () {
                              setState(() {});
                              customization.write(
                                ApplicationInformation.isDarkMode.value
                                    ? 'dark'
                                    : 'light',
                                ApplicationInformation.libraryPath.value,
                                ApplicationInformation.language.value,
                                ApplicationInformation.storagePermission.value,
                                ApplicationInformation.allowNotification.value,
                              );
                              showSnackbar(
                                AppLocalizations.of(context)!
                                    .new_language_will_be_applied_after_the_application_is_restarted,
                              );
                              Navigator.of(context).pop();
                            },
                            child: Text(AppLocalizations.of(context)!.done),
                          ),
                        ],
                      );
                    },
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.groups_2_outlined,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.translator),
                      style: theme.textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      AppLocalizations.of(context)!.translator_author,
                      style: theme.textTheme.bodySmall,
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.dark_mode_outlined,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.dark_mode),
                      style: theme.textTheme.titleMedium,
                    ),
                    trailing: Switch(
                      value: ApplicationInformation.isDarkMode.value,
                      onChanged: (bool value) {
                        ApplicationInformation.isDarkMode.value = value;
                        customization.write(
                          ApplicationInformation.isDarkMode.value
                              ? 'dark'
                              : 'light',
                          ApplicationInformation.libraryPath.value,
                          ApplicationInformation.language.value,
                          ApplicationInformation.storagePermission.value,
                          ApplicationInformation.allowNotification.value,
                        );
                      },
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.storage_outlined,
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
                    onTap: () {
                      displayDialog(
                        Text(AppLocalizations.of(context)!.library),
                        Row(
                          children: <Widget>[
                            Expanded(
                              child: TextField(
                                controller: controller,
                                decoration: InputDecoration(
                                  labelText: AppLocalizations.of(context)!
                                      .input_library_path,
                                ),
                                onChanged: (String value) {
                                  controller.text = value;
                                  ApplicationInformation.libraryPath.value =
                                      value;
                                  customization.write(
                                    ApplicationInformation.isDarkMode.value
                                        ? 'dark'
                                        : 'light',
                                    ApplicationInformation.libraryPath.value,
                                    ApplicationInformation.language.value,
                                    ApplicationInformation
                                        .storagePermission.value,
                                    ApplicationInformation
                                        .allowNotification.value,
                                  );
                                },
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.folder_open),
                              onPressed: () async {
                                var path = await FileSystem.pickDirectory();
                                if (path != null) {
                                  controller.text = path;
                                  ApplicationInformation.libraryPath.value =
                                      path;
                                  customization.write(
                                    ApplicationInformation.isDarkMode.value
                                        ? 'dark'
                                        : 'light',
                                    ApplicationInformation.libraryPath.value,
                                    ApplicationInformation.language.value,
                                    ApplicationInformation
                                        .storagePermission.value,
                                    ApplicationInformation
                                        .allowNotification.value,
                                  );
                                }
                              },
                            ),
                          ],
                        ),
                        [
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: Text(AppLocalizations.of(context)!.done),
                          ),
                        ],
                      );
                    },
                  ),
                  Container(
                    margin: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                    padding: const EdgeInsets.all(5.0),
                    child: const Divider(
                      thickness: 0.9,
                    ),
                  ),
                  Align(
                    alignment: FractionalOffset.bottomLeft,
                    child: Container(
                      margin: const EdgeInsets.fromLTRB(3, 10, 0, 0),
                      padding: const EdgeInsets.all(10.0),
                      child: Text(
                        AppLocalizations.of(context)!.miscellaneous,
                        style: theme.textTheme.bodySmall!.copyWith(
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.sd_storage_outlined,
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
                    trailing: SizedBox(
                      child: Platform.isAndroid
                          ? Icon(
                              Icons.open_in_new,
                              size: theme.iconTheme.size,
                            )
                          : null,
                    ),
                    onTap: Platform.isAndroid
                        ? () async {
                            ApplicationInformation.storagePermission.value =
                                await MainActivity.requestStoragePermission();
                          }
                        : null,
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.notifications_outlined,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.allow_notification),
                      style: theme.textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      AppLocalizations.of(context)!.allow_notification_subtitle,
                      style: theme.textTheme.bodySmall,
                    ),
                    trailing: Switch(
                      value: ApplicationInformation.allowNotification.value,
                      onChanged: (bool value) {
                        setState(() {
                          ApplicationInformation.allowNotification.value =
                              value;
                        });
                        customization.write(
                          ApplicationInformation.isDarkMode.value
                              ? 'dark'
                              : 'light',
                          ApplicationInformation.libraryPath.value,
                          ApplicationInformation.language.value,
                          ApplicationInformation.storagePermission.value,
                          ApplicationInformation.allowNotification.value,
                        );
                      },
                    ),
                  ),
                  ListTile(
                    leading: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(
                          Icons.info_outline,
                          size: theme.iconTheme.size,
                        ),
                      ],
                    ),
                    title: Text(
                      (AppLocalizations.of(context)!.about),
                      style: theme.textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      'Build version: ${Engine.version} & Engine: ${Engine.engineVersion} & Internal: ${Engine.internal}',
                      style: theme.textTheme.bodySmall,
                    ),
                    onTap: () {
                      displayDialog(
                        Text(AppLocalizations.of(context)!.about),
                        SizedBox(
                          height: 200,
                          child: Column(
                            children: [
                              ListTile(
                                leading: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: <Widget>[
                                    Icon(
                                      Icons.view_in_ar_outlined,
                                      size: theme.iconTheme.size,
                                    ),
                                  ],
                                ),
                                title: Text(
                                  'Haruma-VN',
                                  style: theme.textTheme.titleLarge,
                                ),
                                subtitle: Align(
                                  alignment: FractionalOffset.topLeft,
                                  child: Column(
                                    children: [
                                      Text(
                                        'https://github.com/Haruma-VN/Sen',
                                        style: theme.textTheme.bodyMedium,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        [
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: Text(AppLocalizations.of(context)!.done),
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
