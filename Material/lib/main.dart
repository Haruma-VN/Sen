import 'package:flutter/material.dart';
import 'package:sen_material_design/command.dart';
import 'package:sen_material_design/common/basic.dart';
import 'package:sen_material_design/setting.dart';
import 'common/custom.dart';

Future<void> main() async {
  var setting = Customization.init();
  if (!await Customization.getCurrentTheme()) {
    ApplicationInformation.isLightMode.value = false;
  }
  final String internalPath = await Customization.getWorkspace();
  if (internalPath != '') {
    ApplicationInformation.internalPath.value = internalPath;
  }
  // ignore: await_only_futures
  runApp(await Application(setting: setting));
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
      valueListenable: ApplicationInformation.isLightMode,
      builder: (context, isLightMode, child) => MaterialApp(
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
          brightness: isLightMode ? Brightness.light : Brightness.dark,
        ),
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

  List<Widget> pages = const [
    HomePage(),
    Setting(),
  ];

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
      body: pages[current_page],
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.terminal_rounded),
            label: 'Commands',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        onDestinationSelected: (value) => {
          setState(
            () => current_page = value,
          ),
        },
        selectedIndex: current_page,
      ),
    );
  }
}
