import 'dart:io';
import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/http/connect.dart';
import 'package:sen_material_design/bridge/notification_service.dart';
import 'package:sen_material_design/bridge/service.dart';
import 'package:sen_material_design/common/version.dart';
import 'package:sen_material_design/components/command.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:sen_material_design/components/setting.dart';
import 'package:window_manager/window_manager.dart';
import 'common/custom.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:sen_material_design/l10n/l10n.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

Future<void> main(List<String> argument) async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
    await WindowManager.instance.ensureInitialized();
    await windowManager.center();
    await windowManager.waitUntilReadyToShow();
    await windowManager.show();
  }
  var setting = Customization.init();
  if (!await Customization.getCurrentTheme()) {
    ApplicationInformation.isDarkMode.value = false;
  }
  final String libraryPath = await Customization.getWorkspace();
  if (libraryPath != '') {
    ApplicationInformation.libraryPath.value = libraryPath;
    if (Platform.isWindows &&
        !FileSystem.fileExists(
          p.join(
            libraryPath,
            Connection.internalLibrary(null),
          ),
        )) {
      await Connection.downloadInternal(
        ApplicationInformation.libraryPath.value,
        null,
      );
    }
  }
  if (Platform.isAndroid) {
    ApplicationInformation.storagePermission.value =
        await MainActivity.checkStoragePermission();
  }
  final String language = await Customization.getLocalization();
  if (language != 'en') {
    ApplicationInformation.language.value = language;
  }
  ApplicationInformation.allowNotification.value =
      await Customization.getNotificationDetail();
  Engine.cast_internal_executor();
  await NotificationService.initialize();
  runApp(
    Application(
      setting: setting,
    ),
  );
}

class Application extends StatelessWidget {
  const Application({
    super.key,
    required this.setting,
  });

  final Customization setting;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: ApplicationInformation.isDarkMode,
      builder: (BuildContext context, bool isDarkMode, Widget? child) =>
          MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.light,
          appBarTheme: const AppBarTheme(
            centerTitle: false,
            elevation: 3,
            scrolledUnderElevation: 3,
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          brightness: isDarkMode ? Brightness.dark : Brightness.light,
          colorSchemeSeed: const Color(0xFF1750A4),
        ),
        supportedLocales: L10n.all,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        locale: Locale(ApplicationInformation.language.value),
        themeMode: setting.theme_data,
        home: const RootPage(),
      ),
    );
  }
}

class RootPage extends StatefulWidget {
  const RootPage({super.key});

  @override
  State<RootPage> createState() => _RootPageState();
}

class _RootPageState extends State<RootPage> {
  // ignore: non_constant_identifier_names
  int current_page = 0;

  /// Pages
  ///
  ///

  List<Widget> pages = const [
    HomePage(),
    Setting(),
  ];

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(
          ApplicationInformation.applicationName,
          style: theme.textTheme.titleLarge!,
        ),
        centerTitle: false,
        elevation: 3,
        scrolledUnderElevation: 2,
        actions: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              icon: Icon(
                ApplicationInformation.hasSearch.value
                    ? Icons.close_outlined
                    : Icons.search_outlined,
                color: ApplicationInformation.isDarkMode.value
                    ? Colors.white
                    : Colors.black,
              ),
              onPressed: () {
                setState(() {
                  ApplicationInformation.hasSearch.value =
                      !ApplicationInformation.hasSearch.value;
                });
              },
            ),
          ),
        ],
      ),
      body: OrientationBuilder(
        builder: (context, orientation) {
          return orientation == Orientation.portrait
              ? SingleChildScrollView(
                  child: ConstrainedBox(
                    constraints: BoxConstraints.tightFor(
                      height: MediaQuery.of(context).size.height,
                    ),
                    child: pages[current_page],
                  ),
                )
              : Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(10.0),
                      child: NavigationRail(
                        selectedIndex: current_page,
                        onDestinationSelected: (int index) {
                          setState(() {
                            current_page = index;
                          });
                        },
                        labelType: NavigationRailLabelType.selected,
                        destinations: [
                          NavigationRailDestination(
                            icon: const Icon(Icons.terminal_outlined),
                            selectedIcon: const Icon(Icons.terminal),
                            label: Text(
                              AppLocalizations.of(context)!.command_page,
                            ),
                          ),
                          NavigationRailDestination(
                            icon: const Icon(Icons.settings_outlined),
                            selectedIcon: const Icon(Icons.settings),
                            label: Text(
                              AppLocalizations.of(context)!.setting_page,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        child: ConstrainedBox(
                          constraints: BoxConstraints.tightFor(
                            height: MediaQuery.of(context).size.height,
                          ),
                          child: pages[current_page],
                        ),
                      ),
                    ),
                  ],
                );
        },
      ),
      bottomNavigationBar: OrientationBuilder(
        builder: (context, orientation) {
          return orientation == Orientation.portrait
              ? NavigationBarTheme(
                  data: NavigationBarThemeData(
                    backgroundColor: Theme.of(context)
                        .bottomNavigationBarTheme
                        .backgroundColor,
                  ),
                  child: NavigationBar(
                    selectedIndex: current_page,
                    onDestinationSelected: (int index) {
                      setState(() {
                        current_page = index;
                      });
                    },
                    animationDuration: const Duration(milliseconds: 1000),
                    elevation: 3.0,
                    destinations: [
                      NavigationDestination(
                        icon: const Icon(Icons.terminal_outlined),
                        selectedIcon: const Icon(Icons.terminal),
                        label: AppLocalizations.of(context)!.command_page,
                      ),
                      NavigationDestination(
                        icon: const Icon(Icons.settings_outlined),
                        selectedIcon: const Icon(Icons.settings),
                        label: AppLocalizations.of(context)!.setting_page,
                      ),
                    ],
                  ),
                )
              : const SizedBox.shrink();
        },
      ),
    );
  }
}
