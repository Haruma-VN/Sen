import 'dart:io';

import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/http/connect.dart';
import 'package:sen_material_design/bridge/service.dart';
import 'package:sen_material_design/command.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:sen_material_design/setting.dart';
import 'common/custom.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:sen_material_design/l10n/l10n.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path/path.dart' as p;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  var setting = Customization.init();
  if (!await Customization.getCurrentTheme()) {
    ApplicationInformation.isDarkMode.value = false;
  }
  final String libraryPath = await Customization.getWorkspace();
  if (libraryPath != '') {
    ApplicationInformation.libraryPath.value = libraryPath;
    if (!Platform.isAndroid &&
        !FileSystem.fileExists(
          p.join(
            libraryPath,
            Connection.internalLibrary(),
          ),
        )) {
      await Connection.downloadInternal(
        ApplicationInformation.libraryPath.value,
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
  build(BuildContext context) {
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
        scrolledUnderElevation: 3,
      ),
      body: pages[current_page],
      bottomNavigationBar: BottomNavigationBar(
        showSelectedLabels: true,
        showUnselectedLabels: false,
        elevation: 3,
        type: BottomNavigationBarType.fixed,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: const Icon(Icons.terminal_rounded),
            label: AppLocalizations.of(context)!.command_page,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.settings),
            label: AppLocalizations.of(context)!.setting_page,
          ),
        ],
        currentIndex: current_page,
        onTap: (int value) {
          setState(() {
            current_page = value;
          });
        },
      ),
    );
  }
}