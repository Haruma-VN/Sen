import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/button.dart';
import 'package:sen_material_design/components/item/rsb_workspace/list.dart';
import 'package:sen_material_design/components/test.dart';
import 'package:sen_material_design/components/tool/popcap/ptx/decode.dart';

class RSBWorkspace extends StatefulWidget {
  const RSBWorkspace({super.key});

  @override
  State<RSBWorkspace> createState() => _RSBWorkspaceState();
}

class _RSBWorkspaceState extends State<RSBWorkspace> {
  List<Widget> mainBox = [];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: double.infinity,
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 3,
            child: Container(
              color: Colors.transparent,
              child: ListView(
                children: ripe.keys
                    .map(
                      (e1) => RSBWorkspaceItemList(
                        text: e1,
                        onPressed: () {
                          setState(() {
                            mainBox = [
                              ...ripe[e1].keys.map(
                                    (e) => RawButton(
                                      onPressed: () {
                                        if (e.endsWith('_1536') ||
                                            e.endsWith('_768') ||
                                            e.endsWith('_1200')) {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) =>
                                                  PopCapPTXDecode(
                                                dataFile: 'test',
                                                outputFile: 'test1111',
                                                format: 'rgba_8888',
                                                inputWidth: ripe[e1][e]
                                                        ['packet_info']['res']
                                                    [0]['ptx_info']['width'],
                                                inputHeight: ripe[e1][e]
                                                        ['packet_info']['res']
                                                    [0]['ptx_info']['height'],
                                              ),
                                            ),
                                          );
                                        }
                                      },
                                      description: "",
                                      iconStart: Icons.data_object_outlined,
                                      iconEnd: Icons.arrow_right_outlined,
                                      text: e,
                                    ),
                                  ),
                            ];
                          });
                        },
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
          const Divider(
            color: Colors.white,
            thickness: 3,
          ),
          Expanded(
            flex: 7,
            child: Container(
              color: Colors.transparent,
              child: ListView(
                children: mainBox,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
