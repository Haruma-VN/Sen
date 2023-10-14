import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum RawOption {
  oldInt,
  chinese,
  jsonMap,
  jsonText,
}

class Lawnstring {
  void testJsonText(dynamic information, AppLocalizations? localizations) {
    if (information['objects'][0]['objdata']['LocStringValues'].length % 2 !=
        0) {
      throw Exception(
        localizations == null
            ? "Lawnstrings text error, array size must be a number can divide to two"
            : localizations.lawnstring_text_test_error,
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

  dynamic textToJsonText(
    String text,
  ) {
    final dynamic jsonText = {
      'version': 1,
      'objects': [
        {
          'aliases': ["LawnStringsData"],
          'objclass': "LawnStringsData",
          'objdata': {
            'LocStringValues': extractFromText(text),
          },
        },
      ],
    };
    return jsonText;
  }

  dynamic textToJsonMap(String text) {
    final dynamic jsonMap = {
      'version': 1,
      'objects': [
        {
          'aliases': ["LawnStringsData"],
          'objclass': "LawnStringsData",
          'objdata': {
            'LocStringValues': {},
          },
        },
      ],
    };
    List<String> data = extractFromText(text);
    for (var i = 0; i < data.length; ++i) {
      jsonMap['objects'][0]['objdata']['LocStringValues'][data[i]] =
          data[i + 1];
      ++i;
    }
    return jsonMap;
  }

  String jsonMapToText(
    dynamic information,
  ) {
    var text = '';
    final keys =
        information['objects'][0]['objdata']['LocStringValues'].keys().toList();
    for (var key in keys) {
      text = '$text[$key]';
      text = '$text\n';
      text =
          '$text${information['objects'][0]['objdata']['LocStringValues'][key].replaceAll(RegExp(r'\r'), '')}';
      text = '$text\n';
      text = '$text\n';
    }
    return text;
  }

  String jsonTextToText(
    dynamic information,
  ) {
    var text = '';
    for (var i = 0;
        i < information['objects'][0]['objdata']['LocStringValues'].length;
        ++i) {
      text =
          '$text[${information['objects'][0]['objdata']['LocStringValues'][i]}]';
      text = '$text\n';
      text =
          '$text${information['objects'][0]['objdata']['LocStringValues'][i + 1].replaceAll(RegExp(r'\r'), '')}';
      text = '$text\n';
      text = '$text\n';
      i++;
    }
    return text;
  }

  dynamic jsonTextToJsonMap(
    dynamic jsonText,
    AppLocalizations? localizations,
  ) {
    testJsonText(
      jsonText,
      localizations,
    );
    dynamic jsonMap = {
      'version': 1,
      'objects': [
        {
          'aliases': ["LawnStringsData"],
          'objclass': "LawnStringsData",
          'objdata': {
            'LocStringValues': {},
          },
        },
      ],
    };
    for (var i = 0;
        i < jsonText['objects'][0]['objdata']['LocStringValues'].length;
        ++i) {
      jsonMap['objects'][0]['objdata']['LocStringValues']
              [jsonText['objects'][0]['objdata']['LocStringValues'][i]] =
          jsonText['objects'][0]['objdata']['LocStringValues'][i + 1];
      i++;
    }
    return jsonMap;
  }

  dynamic jsonMapToJsonText(dynamic jsonMap) {
    dynamic jsonText = {
      'version': 1,
      'objects': [
        {
          'aliases': ["LawnStringsData"],
          'objclass': "LawnStringsData",
          'objdata': {
            'LocStringValues': [],
          },
        },
      ],
    };
    final keys =
        jsonMap['objects'][0]['objdata']['LocStringValues'].keys.toList();
    final values =
        jsonMap['objects'][0]['objdata']['LocStringValues'].values.toList();
    for (var i = 0; i < keys.length; ++i) {
      jsonText['objects'][0]['objdata']['LocStringValues'].add(keys[i]);
      jsonText['objects'][0]['objdata']['LocStringValues'].add(values[i]);
    }
    return jsonText;
  }

  static void execute(
    String inFile,
    String outFile,
    RawOption mInput,
    RawOption mOutput,
    AppLocalizations localizations,
  ) {
    return;
  }
}
