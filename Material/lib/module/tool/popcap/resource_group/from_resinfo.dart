class ConvertFromResInfo {
  static Map<String, dynamic> generateFileInfo(
    // ignore: non_constant_identifier_names
    dynamic k_data,
    // ignore: non_constant_identifier_names
    dynamic image_info,
    // ignore: non_constant_identifier_names
    bool use_array,
  ) {
    Map<String, dynamic> composite = {
      'id': k_data['id'],
      'parent': k_data['parent'],
      'type': "simple",
      'resources': [],
    };
    final dynamic list = image_info['packet']['data'];
    for (final dynamic property in list.keys()) {
      var key = property;
      var value = list[property];
      var argument = {
        'type': value['type']!,
        'slot': 0,
        'id': key,
        'path': use_array
            ? value['path']!
            : (value['path'] as List<String>).join(
                '\\',
              ),
      };
      if (value['srcpath'] != null) {
        argument['srcpath'] = use_array
            ? value["srcpath"]!
            : (value["srcpath"] as List<String>).join(
                '\\',
              );
      }
      if (value['forceOriginalVectorSymbolSize'] != null) {
        argument['forceOriginalVectorSymbolSize'] =
            value["forceOriginalVectorSymbolSize"]!;
      }
      composite['resources'].add(argument);
    }
    return composite;
  }
}
