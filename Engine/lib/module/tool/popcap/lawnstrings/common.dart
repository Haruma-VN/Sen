enum RawOption {
  oldInt,
  chinese,
  jsonMap,
  jsonText,
}

class Lawnstring {
  void testJsonText(
    dynamic information,
  ) {
    if (information['objects'][0]['objdata']['LocStringValues'].length % 2 !=
        0) {
      throw Exception(
        'lawnstrings text error, array size must be a number can divide to two',
      );
    }
    return;
  }

  String getExtension(
    RawOption output,
  ) {
    switch (output) {
      case RawOption.oldInt:
      case RawOption.chinese:
        {
          return '.txt';
        }
      case RawOption.jsonMap:
      case RawOption.jsonText:
        {
          return '.json';
        }
    }
  }

  List<String> extractFromText(
    String text,
  ) {
    final List<String> textList = text.split('\n');
    final List<String> dict = [];
    final int actualSize = textList.length;
    for (var i = 0; i < actualSize; i++) {
      if (RegExp(r'^\[.*\]\s*$').hasMatch(textList[i])) {
        dict.add(textList[i].substring(1, -1));
        var destination = -1;
        findNext:
        for (var j = i + 1; j < actualSize; ++j) {
          if (RegExp(r'^\[.*\]\s*$').hasMatch(textList[j])) {
            destination = j;
            break findNext;
          }
        }
        var textRipe = '';
        if (destination != -1) {
          for (var k = i + 1; k < destination - 1; ++k) {
            testCase:
            switch (textList[k]) {
              case '':
                {
                  textRipe = '$textRipe\r\n';
                  break testCase;
                }
              default:
                {
                  if (textRipe != '') {
                    textRipe = '$textRipe\r\n';
                  }
                  textRipe = textRipe + textList[k];
                  break testCase;
                }
            }
            ++i;
          }
        } else {
          findNext:
          for (var j = actualSize - 1; j > i; --j) {
            if (textList[j] == '') {
              destination = -1;
              break findNext;
            }
          }
          for (var k = i + 1; k < actualSize - 1; ++k) {
            expression:
            switch (textList[k]) {
              case '':
                {
                  textRipe = '$textRipe\r\n';
                  break expression;
                }
              default:
                {
                  textRipe = textRipe + textList[k];
                  break expression;
                }
            }
            ++i;
          }
        }
        dict.add(textRipe);
      }
    }
    return dict;
  }
}
