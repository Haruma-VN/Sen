import 'package:flutter/material.dart';
import 'package:sen_material_design/components/widget.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

Future<void> refreshModule() async {
  await Future.delayed(
    const Duration(
      seconds: 1,
    ),
  );
  return;
}

class _HomePageState extends State<HomePage> {
  final List<String> functionsName = const [
    'popcap.resource_group.split',
    'popcap.resource_group.merge',
  ];

  @override
  Widget build(BuildContext context) {
    final double devicePixelRatio = MediaQuery.of(context).devicePixelRatio;
    final double adjustedHeight = 50 / devicePixelRatio;
    return ListView.builder(
      itemCount: functionsName.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: SizedBox(
            width: double.infinity,
            height: adjustedHeight,
            child: TextButton(
              child: Text(functionsName[index]),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (BuildContext context) {
                      return FutureBuilder(
                        future: refreshModule(),
                        builder:
                            (BuildContext context, AsyncSnapshot snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.done) {
                            return materialWidget[index];
                          } else {
                            // WidgetsBinding.instance.addPostFrameCallback(
                            //   (_) {
                            //     ScaffoldMessenger.of(context).showSnackBar(
                            //       const SnackBar(
                            //         content: Center(
                            //           child: Text(
                            //             'Module is being loaded...',
                            //           ),
                            //         ),
                            //         duration: Duration(seconds: 1),
                            //       ),
                            //     );
                            //   },
                            // );
                            return Scaffold(
                              appBar: AppBar(
                                title: const Text('Sen: Material App'),
                                centerTitle: true,
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
        );
      },
    );
  }
}
