import 'dart:io';
import 'package:flutter/material.dart';
import 'package:sen_material_design/common/custom.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/common/version.dart';
import 'package:sen_material_design/components/item/widget/title.dart';
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

  void initializeCustomization() {
    customization.write(
      ApplicationInformation.isDarkMode.value ? 'dark' : 'light',
      ApplicationInformation.libraryPath.value,
      ApplicationInformation.language.value,
      ApplicationInformation.storagePermission.value,
      ApplicationInformation.allowNotification.value,
    );
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
      case 'zh':
        {
          return AppLocalizations.of(context)!.zh_chinese;
        }
      case 'ru':
        {
          return AppLocalizations.of(context)!.russian;
        }
      case 'pt':
        {
          return AppLocalizations.of(context)!.portuguese;
        }
      case 'es':
        {
          return AppLocalizations.of(context)!.spanish;
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
      body: ValueListenableBuilder(
        valueListenable: ApplicationInformation.language,
        builder: (context, value, child) => SingleChildScrollView(
          child: Column(
            children: [
              TitleDisplay(
                displayText: AppLocalizations.of(context)!.home,
                textStyle: Theme.of(context).textTheme.bodySmall!.copyWith(
                      fontWeight: FontWeight.w400,
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
                      height: 200,
                      child: LanguageSelectorDialog(),
                    ),
                    [
                      TextButton(
                        onPressed: () {
                          initializeCustomization();
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
                    initializeCustomization();
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
                              ApplicationInformation.libraryPath.value = value;
                              initializeCustomization();
                            },
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.folder_open),
                          onPressed: () async {
                            var path = await FileSystem.pickDirectory();
                            if (path != null) {
                              controller.text = path;
                              ApplicationInformation.libraryPath.value = path;
                              initializeCustomization();
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
              TitleDisplay(
                displayText: AppLocalizations.of(context)!.miscellaneous,
                textStyle: Theme.of(context).textTheme.bodySmall!.copyWith(
                      fontWeight: FontWeight.w400,
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
                  AppLocalizations.of(context)!.storage_permission_for_android,
                  style: theme.textTheme.bodySmall,
                ),
                trailing: SizedBox(
                  child: Platform.isAndroid
                      ? Icon(
                          Icons.open_in_new_outlined,
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
                      ApplicationInformation.allowNotification.value = value;
                    });
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
                  '${AppLocalizations.of(context)!.build_version}: ${Engine.version} & Engine: ${Engine.engineVersion} & Internal: ${Engine.Internal != -1 ? Engine.Internal : AppLocalizations.of(context)!.no_internal}',
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
        ),
      ),
    );
  }
}
