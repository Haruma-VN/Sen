import 'package:flutter/material.dart';

class MergePopCapResourceGroup extends StatefulWidget {
  const MergePopCapResourceGroup({super.key});

  @override
  State<MergePopCapResourceGroup> createState() =>
      _MergePopCapResourceGroupState();
}

class _MergePopCapResourceGroupState extends State<MergePopCapResourceGroup> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sen: Material App'),
        centerTitle: true,
        elevation: 3,
        scrolledUnderElevation: 3,
      ),
      body: Container(),
    );
  }
}
