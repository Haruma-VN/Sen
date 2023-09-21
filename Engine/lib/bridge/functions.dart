class MethodItem {
  String method;
  int index;

  MethodItem(this.method, this.index);

  factory MethodItem.fromJson(Map<String, dynamic> json) {
    return MethodItem(
      json['method'],
      json['index'],
    );
  }
}
