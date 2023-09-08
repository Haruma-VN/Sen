/// [data] the resources group data

void rewriteSlot(dynamic data) {
  Map<String, int> map = {};
  for (var e in data['groups']) {
    if (e['resources'] != null) {
      for (var resource in e['resources']) {
        if (map[resource['id']] != null) {
          resource['slot'] = map[resource['id']];
        } else {
          var slot = data['slot_count'];
          ++data['slot_count'];
          resource['slot'] = slot;
          map[resource['id']] = slot;
        }
      }
    }
  }
  return;
}

enum ExpandPath {
  string,
  array,
}

class SubInformation {
  String id;
  dynamic parent;

  SubInformation(this.id, this.parent);
}
