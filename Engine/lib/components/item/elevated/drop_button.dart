import 'package:flutter/material.dart';
import 'package:sen_material_design/components/item/elevated/input.dart';

class DropButtonContent<T> extends StatelessWidget {
  const DropButtonContent({
    super.key,
    required this.toolTip,
    required this.value,
    required this.choose,
    required this.onChanged,
    required this.items,
  });

  final void Function(T? value)? onChanged;
  final String choose;
  final String? toolTip;
  final T? value;
  final List<DropdownMenuItem<T>> items;

  @override
  Widget build(BuildContext context) {
    return ElevatedInputBarContent(
      iconBegin: Icons.menu_outlined,
      iconEnd: Icons.info_outline,
      toolTip: toolTip,
      onSubmit: () {},
      child: DropdownButton<T>(
        value: value,
        hint: Text(choose),
        isExpanded: true,
        focusColor: Colors.transparent,
        borderRadius: const BorderRadius.all(Radius.circular(10)),
        underline: Container(),
        items: items,
        onChanged: onChanged,
      ),
    );
  }
}

List<DropdownMenuItem<T>> convertItemListToDropDownMenuItemListView<T>(
  List<T> list,
) =>
    list
        .map(
          (T value) => DropdownMenuItem<T>(
            value: value,
            child: Text(value.toString()),
          ),
        )
        .toList();

class DropDownChildren<T> {
  T value;
  String displayText;
  DropDownChildren(
    this.value,
    this.displayText,
  );
}

List<DropdownMenuItem<T>> convertDropDownListToDropDownMenuItemListView<T>(
  List<DropDownChildren<T>> list,
) =>
    list
        .map(
          (DropDownChildren<T> value) => DropdownMenuItem<T>(
            value: value.value,
            child: Text(value.displayText),
          ),
        )
        .toList();
