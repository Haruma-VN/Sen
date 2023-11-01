class MethodItem {
  String method;
  late int index;
  static int count = 0;

  MethodItem(this.method, this.index) {
    count++;
  }

  factory MethodItem.fromJson(Map<String, dynamic> json) {
    count++;
    return MethodItem(
      json['method'],
      json['index'],
    );
  }

  MethodItem.has(this.method) {
    index = count++;
  }
}
