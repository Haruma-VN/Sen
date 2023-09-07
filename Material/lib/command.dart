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
      milliseconds: 500,
    ),
  );
  return;
}

class _HomePageState extends State<HomePage> {
  final List<String> functionsName = const [
    'popcap.resource_group.split',
    'popcap.resource_group.merge',
    'popcap.resource_group.to_resinfo',
    'popcap.resource_group.from_resinfo',
    'popcap.resinfo.split',
    'popcap.resinfo.merge',
    'popcap.resource_group.split_atlas',
    'popcap.resource_group.merge_atlas',
    'popcap.resinfo.split_atlas',
    'popcap.resinfo.merge_atlas',
    'popcap.ptx.decode',
    'popcap.ptx.encode',
    'popcap.animation.decode_to_json',
    'popcap.animation.encode_from_json',
    'popcap.animation.pam_to_flash',
    'popcap.animation.pam_from_flash',
    'popcap.animation.json_to_flash',
    'popcap.animation.json_from_flash',
    'popcap.rton.decode',
    'popcap.rton.encode',
    'popcap.rton.decrypt',
    'popcap.rton.encrypt',
    'popcap.rton.decrypt_and_decode',
    'popcap.rton.encode_and_encrypt',
    'popcap.rsg.unpack',
    'popcap.rsg.pack',
    'popcap.rsb.unpack',
    'popcap.rsb.pack',
    'popcap.rsb.unpack_simple',
    'popcap.rsb.pack_simple',
    'popcap.rsb.unpack_by_loose_constraints',
    'popcap.rsb.unpack_resource',
    'popcap.rsb.pack_resource',
    'popcap.zlib.compress',
    'popcap.zlib.uncompress',
    'wwise.soundbank.decode',
    'wwise.soundbank.encode',
    'popcap.animation.flash_animation_resize',
    'popcap.rsbpatch.decode',
    'popcap.rsbpatch.encode',
    'popcap.lawnstring.convert',
    'popcap.newton.decode',
    'popcap.newton.encode',
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
                            return Scaffold(
                              appBar: AppBar(
                                title: const Text('Sen: Material App'),
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
        );
      },
    );
  }
}
