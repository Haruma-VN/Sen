// ignore_for_file: depend_on_referenced_packages

import "dart:io";
import "dart:math";
import "package:path/path.dart" as path;
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:xml/xpath.dart';
import "package:xml/xml.dart";

class PopCapReAnimation {
  final xmlnsAttribute = {
    'http://www.w3.org/2001/XMLSchema-instance': 'xsi',
    'http://ns.adobe.com/xfl/2008/': '',
  };

  final initialTransform = <double>[1, 0, 0, 1, 0, 0];

  final initialColor = <double>[1, 1, 1, 1];

  void convertToFlash(dynamic jsonFile, String outFolder, int resolution) {
    final imageList = jsonFile["image"];
    final scaleResolution = 1200 / resolution;
    for (var i = 0; i < imageList.length; i++) {
      final sourceDocument =
          writeSourceDocument(i, imageList[i], scaleResolution);
      FileSystem.writeFile(
        path.join(outFolder, "library", "source", "source_${i + 1}.xml"),
        sourceDocument.toXmlString(pretty: true, indent: "\t"),
      );
      final imageDocument = writeImageDocument(i, imageList[i]);
      FileSystem.writeFile(
        path.join(outFolder, "library", "image", "image_${i + 1}.xml"),
        imageDocument.toXmlString(pretty: true, indent: "\t"),
      );
    }
    final spriteList = jsonFile["sprite"];
    for (var i = 0; i < spriteList.length; i++) {
      final spriteDocument = writeSpriteDocument(
        i,
        decodeFrameNodeList(spriteList[i], spriteList),
      );
      FileSystem.writeFile(
        path.join(outFolder, "library", "sprite", "sprite_${i + 1}.xml"),
        spriteDocument.toXmlString(pretty: true, indent: "\t"),
      );
    }
    final mainDocument = writeSpriteDocument(
        -1, decodeFrameNodeList(jsonFile["main_sprite"], spriteList));
    FileSystem.writeFile(
      path.join(outFolder, "library", "main.xml"),
      mainDocument.toXmlString(pretty: true, indent: "\t"),
    );
    final domDocument = writeDomDocument(jsonFile);
    FileSystem.writeFile(
      path.join(outFolder, "DomDocument.xml"),
      domDocument.toXmlString(pretty: true, indent: "\t"),
    );
    FileSystem.writeFile(path.join(outFolder, "main.xfl"), "PROXY-CS5");
    final structInfo = {
      "version": jsonFile["version"],
      "frame_rate": jsonFile["frame_rate"],
      "position": jsonFile["position"],
      "image": {},
      "sprite": {},
      "main_sprite": {
        "main_sprite": jsonFile["main_sprite"]["name"],
      },
    };
    for (var i = 0; i < jsonFile["image"].length; i++) {
      structInfo["image"]["image_${i + 1}"] = {
        "name": jsonFile["image"][i]["name"],
        "width": jsonFile["image"][i]["size"][0],
        "height": jsonFile["image"][i]["size"][1],
      };
    }
    for (var i = 0; i < jsonFile["sprite"].length; i++) {
      structInfo["sprite"]["sprite_${i + 1}"] = jsonFile["sprite"][i]["name"];
    }
    FileSystem.writeJson(path.join(outFolder, "struct.json"), structInfo, "\t");
    return;
  }

  XmlDocument writeDomDocument(dynamic jsonFile) {
    final prevEnd = {"flow": -1, "command": -1};
    final flowNode = [];
    final commandNode = [];
    var frameIndex = 0;
    jsonFile["main_sprite"]["frame"].map((frame) {
      if (frame["label"] != null || frame["stop"]) {
        if (prevEnd["flow"]! + 1 < frameIndex) {
          flowNode.add(
            XmlElement(XmlName("DOMFrame"), [
              XmlAttribute(XmlName("index"), "${prevEnd["flow"]! + 1}"),
              XmlAttribute(
                XmlName("duration"),
                "${frameIndex - (prevEnd["flow"]! + 1)}",
              ),
            ], {
              XmlElement(XmlName("elements")),
            }),
          );
        }
        var nodeElemnt = XmlElement(
            XmlName("DOMFrame"),
            [XmlAttribute(XmlName("index"), "$frameIndex")],
            {XmlElement(XmlName("elements"))});

        if (frame["label"] != null) {
          nodeElemnt.setAttribute("name", "${frame["label"]}");
          nodeElemnt.setAttribute("labelType", "name");
        }
        if (frame["stop"]) {
          nodeElemnt.children.insert(
              0,
              XmlElement(XmlName("Actionscript"), [], {
                XmlElement(XmlName("script"), [], {XmlCDATA("stop();")})
              }));
        }
        flowNode.add(nodeElemnt);
        prevEnd["flow"] = frameIndex;
      }
      if (frame["command"].length > 0) {
        if (prevEnd["command"]! + 1 < frameIndex) {
          commandNode.add(XmlElement(XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "${prevEnd["command"]! + 1}"),
            XmlAttribute(XmlName("duration"),
                "${frameIndex - (prevEnd["command"]! + 1)}")
          ]));
        }
        commandNode.add(XmlElement(XmlName("DOMFrame"), [
          XmlAttribute(XmlName("index"), "$frameIndex")
        ], {
          XmlElement(XmlName("Actionscript"), [], {
            XmlElement(XmlName("script"), [], {
              XmlCDATA(frame["command"]
                  .map((e) => "fscommand(\"${e[0]}\", \"${e[1]}\");")
                  .join("\n"))
            })
          })
        }));
        prevEnd["command"] = frameIndex;
      }
      frameIndex++;
      return "";
    }).toList();
    if (prevEnd["flow"]! + 1 < jsonFile["main_sprite"]["frame"].length) {
      flowNode.add(XmlElement(XmlName("DOMFrame"), [
        XmlAttribute(XmlName("index"), "${prevEnd["flow"]! + 1}"),
        XmlAttribute(XmlName("duration"),
            "${jsonFile["main_sprite"]["frame"].length - (prevEnd["flow"]! + 1)}")
      ]));
    }
    if (prevEnd["command"]! + 1 < jsonFile["main_sprite"]["frame"].length) {
      commandNode.add(XmlElement(XmlName("DOMFrame"), [
        XmlAttribute(XmlName("index"), "${prevEnd["command"]! + 1}"),
        XmlAttribute(XmlName("duration"),
            "${jsonFile["main_sprite"]["frame"].length - (prevEnd["command"]! + 1)}")
      ]));
    }
    var sourceIndex = 1;
    var imageIndex = 1;
    var spriteIndex = 1;
    final builder = XmlBuilder();
    builder.element("DOMDocument", namespaces: xmlnsAttribute, attributes: {
      "frameRate": "${jsonFile["main_sprite"]["frame_rate"]}",
      "width": "${jsonFile["size"][0]}",
      "height": "${jsonFile["size"][1]}",
      "xflVersion": "2.971",
    }, nest: () {
      builder.element("folders",
          nest: ["media", "source", "image", "sprite"]
              .map((e) => XmlElement(XmlName("DOMFolderItem"), [
                    XmlAttribute(XmlName("name"), e),
                    XmlAttribute(XmlName("isExpanded"), "true")
                  ]))
              .toList());
      builder.element("media",
          nest: jsonFile["image"]
              .map((e) => XmlElement(XmlName("DOMBitmapItem"), [
                    XmlAttribute(
                        XmlName("name"), "media/${e["name"].split("|")[0]}"),
                    XmlAttribute(
                        XmlName("href"), "media/${e["name"].split("|")[0]}.png")
                  ])));
      builder.element("symbols", nest: [
        jsonFile["image"]
            .map((e) => XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "source/source_${sourceIndex++}.xml"),
                ]))
            .toList(),
        jsonFile["image"]
            .map((e) => XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "image/image_${imageIndex++}.xml"),
                ]))
            .toList(),
        jsonFile["sprite"]
            .map((e) => XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "sprite/sprite_${spriteIndex++}.xml"),
                ]))
            .toList(),
        XmlElement(XmlName("Include"), [
          XmlAttribute(XmlName("href"), "main.xml"),
        ]),
      ]);
      builder.element("timelines", nest: () {
        builder.element("DOMTimeline", attributes: {"name": "animation"},
            nest: () {
          builder.element("layers", nest: () {
            builder.element("DOMLayer", attributes: {"name": "flow"}, nest: () {
              builder.element("frames", nest: flowNode);
            });
            builder.element("DOMLayer", attributes: {"name": "command"},
                nest: () {
              builder.element("frames", nest: commandNode);
            });
            builder.element("DOMLayer", attributes: {"name": "sprite"},
                nest: () {
              builder.element("frames", nest: () {
                builder.element("DOMFrame", attributes: {
                  "index": "0",
                  "duration": "${jsonFile["main_sprite"]["frame"].length}"
                }, nest: () {
                  builder.element("elements", nest: () {
                    builder.element("DOMSymbolInstance", attributes: {
                      "libraryItemName": "main",
                      "symbolType": "graphic",
                      "loop": "loop"
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    return builder.buildDocument();
  }

  XmlDocument writeSpriteDocument(int index, dynamic frameNodeList) {
    final spriteBuilder = XmlBuilder();
    for (var i = frameNodeList.keys.length - 1; i >= 0; i--) {
      spriteBuilder.element("DOMLayer", attributes: {"name": "$i"}, nest: () {
        spriteBuilder.element("frames", nest: frameNodeList[i]);
      });
    }
    final spriteDoc = spriteBuilder.buildFragment();
    final builder = XmlBuilder();
    builder.element("DOMSymbolItem", namespaces: xmlnsAttribute, attributes: {
      "name": index == -1 ? "main" : "sprite/sprite_${index + 1}",
      "symbolType": "graphic",
    }, nest: () {
      builder.element("timeline", nest: () {
        builder.element("DOMTimeline",
            attributes: {"name": index == -1 ? "main" : "sprite_${index + 1}"},
            nest: () {
          builder.element("layers", nest: spriteDoc);
        });
      });
    });
    return builder.buildDocument();
  }

  dynamic decodeFrameNodeList(dynamic sprite, dynamic subSprite) {
    final model = {};
    final frameNodeList = {};
    frameNodeList[0] = [
      XmlElement(XmlName("DOMFrame"), [
        XmlAttribute(XmlName("index"), "0"),
        XmlAttribute(XmlName("duration"), "${sprite["frame"].length}")
      ], {
        XmlElement(XmlName("elements"))
      })
    ];
    final frameLength = sprite["frame"].length;
    for (var i = 0; i < frameLength; i++) {
      final removes = sprite["frame"][i]["remove"];
      for (var k = 0; k < removes.length; k++) {
        model[removes[k]["index"]]["state"] = false;
      }
      final adds = sprite["frame"][i]["append"];
      for (var k = 0; k < adds.length; k++) {
        model[adds[k]["index"]] = {
          "resource": adds[k]["resource"],
          "sprite": adds[k]["sprite"],
          "transform": [...initialTransform],
          "color": [...initialColor],
          "frame_start": i,
          "frame_duration": i,
        };
        frameNodeList[adds[k]["index"] + 1] = [];
        if (i > 0) {
          frameNodeList[adds[k]["index"] + 1].add(XmlElement(
              XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "0"),
            XmlAttribute(XmlName("duration"), "$i")
          ], {
            XmlElement(XmlName("elements"))
          }));
        }
      }

      final moves = sprite["frame"][i]["change"];
      for (var k = 0; k < moves.length; k++) {
        final change = moves[k];
        final layer = model[change["index"]];
        layer["state"] = true;
        final ts = variantToStandard(change["transform"]);
        layer["transform"] = ts;
        if (change["color"] != null &&
            change["color"][0] != 0 &&
            change["color"][1] != 0) {
          layer["color"] = change["color"];
        }
      }

      final modelKeys = model.keys.toList();
      for (var k = 0; k < modelKeys.length; k++) {
        final layerIndex = modelKeys[k];
        final layer = model[layerIndex];
        final frameNode = frameNodeList[layerIndex + 1];
        if (layer["state"] != null) {
          if (frameNode.length > 0) {
            frameNode[frameNode.length - 1]
                .setAttribute("duration", "${layer["frame_duration"]}");
          }
        }

        if (layer["state"] == true) {
          var firstFrame = "0";
          try {
            firstFrame =
                "${(i - layer["frame_start"]) % subSprite[layer["resource"]]["frame"].length}";
          } catch (ex) {}
          frameNode.add(XmlElement(XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "$i"),
            XmlAttribute(XmlName("duration"), "")
          ], {
            XmlElement(XmlName("elements"), [], {
              XmlElement(
                  XmlName("DOMSymbolInstance"),
                  !layer["sprite"]
                      ? [
                          XmlAttribute(XmlName("libraryItemName"),
                              "image/image_${layer["resource"] + 1}"),
                          XmlAttribute(XmlName("symbolType"), "graphic"),
                          XmlAttribute(XmlName("loop"), "loop")
                        ]
                      : [
                          XmlAttribute(XmlName("libraryItemName"),
                              "sprite/sprite_${layer["resource"] + 1}"),
                          XmlAttribute(XmlName("symbolType"), "graphic"),
                          XmlAttribute(XmlName("loop"), "loop"),
                          XmlAttribute(XmlName("firstFrame"), firstFrame)
                        ],
                  {
                    XmlElement(XmlName("matrix"), [], {
                      XmlElement(XmlName("Matrix"), [
                        XmlAttribute(XmlName("a"),
                            exchangeFloaterFixed(layer["transform"][0])),
                        XmlAttribute(XmlName("b"),
                            exchangeFloaterFixed(layer["transform"][1])),
                        XmlAttribute(XmlName("c"),
                            exchangeFloaterFixed(layer["transform"][2])),
                        XmlAttribute(XmlName("d"),
                            exchangeFloaterFixed(layer["transform"][3])),
                        XmlAttribute(XmlName("tx"),
                            exchangeFloaterFixed(layer["transform"][4])),
                        XmlAttribute(XmlName("ty"),
                            exchangeFloaterFixed(layer["transform"][5]))
                      ])
                    }),
                    XmlElement(XmlName("color"), [], {
                      XmlElement(XmlName("Color"), [
                        XmlAttribute(XmlName("redMultiplier"),
                            exchangeFloaterFixed(layer["color"][0])),
                        XmlAttribute(XmlName("greenMultiplier"),
                            exchangeFloaterFixed(layer["color"][1])),
                        XmlAttribute(XmlName("blueMultiplier"),
                            exchangeFloaterFixed(layer["color"][2])),
                        XmlAttribute(XmlName("alphaMultiplier"),
                            exchangeFloaterFixed(layer["color"][3]))
                      ])
                    })
                  })
            })
          }));

          layer["state"] = null;
          layer["frame_duration"] = 0;
        }
        if (layer["state"] == false) {
          model.remove(layerIndex);
        }
        layer["frame_duration"]++;
      }
    }
    final modelKeys = model.keys.toList();
    for (var i = 0; i < modelKeys.length; i++) {
      final layerIndex = modelKeys[i];
      final layer = model[layerIndex];
      final frameNode = frameNodeList[layerIndex + 1];
      frameNode[frameNode.length - 1]
          .setAttribute("duration", "${layer["frame_duration"]}");
      model.remove(layerIndex);
    }
    return frameNodeList;
  }

  dynamic variantToStandard(dynamic transform) {
    if (transform.length == 2) {
      return [1, 0, 0, 1, transform[0], transform[1]];
    } else if (transform.length == 6) {
      return [...transform];
    } else if (transform.length == 3) {
      final cosValue = cos(transform[0]);
      final sinValue = sin(transform[0]);
      return [
        cosValue,
        sinValue,
        -sinValue,
        cosValue,
        transform[1],
        transform[2]
      ];
    } else {
      throw Exception("invaild_transform_size");
    }
  }

  XmlDocument writeImageDocument(int index, dynamic imageInfo) {
    final builder = XmlBuilder();
    builder.element("DOMSymbolItem", namespaces: xmlnsAttribute, attributes: {
      "name": "image/image_${index + 1}",
      "symbolType": "graphic",
    }, nest: () {
      builder.element("timeline", nest: () {
        builder.element("DOMTimeline",
            attributes: {"name": "image_${index + 1}"}, nest: () {
          builder.element("layers", nest: () {
            builder.element("DOMLayer", nest: () {
              builder.element("frames", nest: () {
                builder.element("DOMFrame", attributes: {"index": "0"},
                    nest: () {
                  builder.element("elements", nest: () {
                    builder.element("DOMSymbolInstance", attributes: {
                      "libraryItemName": "source/source_${index + 1}",
                      "symbolType": "graphic",
                      "loop": "loop"
                    }, nest: () {
                      builder.element("matrix", nest: () {
                        builder.element("Matrix", attributes: {
                          "a": exchangeFloaterFixed(imageInfo["transform"][0]),
                          "b": exchangeFloaterFixed(imageInfo["transform"][1]),
                          "c": exchangeFloaterFixed(imageInfo["transform"][2]),
                          "d": exchangeFloaterFixed(imageInfo["transform"][3]),
                          "tx": exchangeFloaterFixed(imageInfo["transform"][4]),
                          "ty": exchangeFloaterFixed(imageInfo["transform"][5]),
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    return builder.buildDocument();
  }

  XmlDocument writeSourceDocument(
      int index, dynamic imageInfo, double scaleResolution) {
    final builder = XmlBuilder();
    builder.element("DOMSymbolItem", namespaces: xmlnsAttribute, attributes: {
      "name": "source/source_${index + 1}",
      "symbolType": "graphic",
    }, nest: () {
      builder.element("timeline", nest: () {
        builder.element("DOMTimeline",
            attributes: {"name": "source_${index + 1}"}, nest: () {
          builder.element("layers", nest: () {
            builder.element("DOMLayer", nest: () {
              builder.element("frames", nest: () {
                builder.element("DOMFrame", attributes: {"index": "0"},
                    nest: () {
                  builder.element("elements", nest: () {
                    builder.element("DOMBitmapInstance", attributes: {
                      "libraryItemName":
                          "media/${imageInfo["name"].split("|")[0]}"
                    }, nest: () {
                      builder.element("matrix", nest: () {
                        builder.element("Matrix", attributes: {
                          "a": exchangeFloaterFixed(scaleResolution),
                          "d": exchangeFloaterFixed(scaleResolution)
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    return builder.buildDocument();
  }

  String exchangeFloaterFixed(dynamic num) {
    return num.toStringAsFixed(6);
  }

  dynamic convertFromFlash(String inFolder) {
    final structInfo = FileSystem.readJson(path.join(inFolder, "struct.json"));
    checkSource(structInfo, inFolder);
    final document = XmlDocument.parse(
        FileSystem.readFile(path.join(inFolder, "DomDocument.xml")));
    final pamRipe = {
      "struct": structInfo,
      "document": document,
      "library": {
        "main_sprite": XmlDocument.parse(
            FileSystem.readFile(path.join(inFolder, "library", "main.xml")))
      }
    };
    return parseMainDocument(
        pamRipe, inFolder, path.join(inFolder, "DomDocument.xml"));
  }

  void checkSource(dynamic struct, String inFolder) {
    final directory = Directory(path.join(inFolder, "library", "source"));
    final sourceFolder = directory.listSync();
    sourceFolder.map((e) => path.extension(e.path).toLowerCase() == ".xml");
    if (struct["image"].length != sourceFolder.length) {
      throwAnimationException(
          "image_count_is_not_same",
          "struct: ${struct["image"].length} | source: ${sourceFolder.length}",
          "library/source");
    }
    sourceFolder.sort((a, b) =>
        int.parse(a.path.split('_').last.replaceAll(".xml", "")).compareTo(
            int.parse(b.path.split('_').last.replaceAll(".xml", ""))));
    for (var i = 0; i < sourceFolder.length; i++) {
      final sourceXml =
          XmlDocument.parse(FileSystem.readFile(sourceFolder[i].path));
      final sourceName =
          parseSourceDocument(sourceXml.rootElement, i, sourceFolder[i].path);
      final imageName = struct["image"]["image_${i + 1}"]["name"].split("|")[0];
      if (sourceName != imageName) {
        throwAnimationException("image_name_is_not_same",
            "struct: $imageName | source: $sourceName", "source_${i + 1}.xml");
      }
    }
    return;
  }

  dynamic parseMainDocument(dynamic pamRipe, String inFolder, String mainPath) {
    XmlElement domDocument = pamRipe["document"].rootElement;
    if (domDocument.localName != "DOMDocument") {
      throwAnimationException(
          "invalid_domdocument", domDocument.localName, mainPath);
    }
    {
      final mediaList = domDocument.xpath("media").toList();
      if (mediaList.length != 1) {
        throwAnimationException(
            "invalid_domdocument_media_length", mediaList.length, mainPath);
      }
      final symbolsList = domDocument.xpath("symbols").toList();
      if (symbolsList.length != 1) {
        throwAnimationException(
            "invalid_domdocument_symbols_length", symbolsList.length, mainPath);
      }
    }
    final mainSpriteFrame = parseSpriteDocument(
        pamRipe["library"]["main_sprite"].rootElement, -1, mainPath);
    // final lastFrame = mainSpriteFrame.length;
    {
      final timelinesList = domDocument.xpath("timelines").toList();
      if (timelinesList.length != 1) {
        throwAnimationException("invalid_domdocument_timelines_length",
            timelinesList.length, mainPath);
      }
      final domTimelineList = timelinesList[0].xpath("DOMTimeline").toList();
      if (domTimelineList.length != 1) {
        throwAnimationException(
            "invalid_domtimeline_length", domTimelineList.length, mainPath);
      }
      final domTimeline = domTimelineList[0];
      if (domTimeline.getAttribute("name") != "animation") {
        throwAnimationException("invalid_domtimeline_name",
            domTimeline.getAttribute("name"), mainPath);
      }
      final layersList = domTimeline.xpath("layers").toList();
      if (layersList.length != 1) {
        throwAnimationException(
            "invalid_domtimeline_layers_length", layersList.length, mainPath);
      }
      final domLayerList = layersList[0].xpath("DOMLayer").toList();
      if (domLayerList.length != 3) {
        throwAnimationException(
            "invalid_domlayer_length", domLayerList.length, mainPath);
      }
      {
        final framesList = domLayerList[0].xpath("frames").toList();
        if (framesList.length != 1) {
          throwAnimationException(
              "invalid_domlayer_frames_length", framesList.length, mainPath);
        }
        final domFrameList = framesList[0].xpath("DOMFrame").toList();
        domFrameList.forEach((domFrame) {
          final frameIndex = int.parse(domFrame.getAttribute("index")!);
          if (domFrame.getAttribute("name") != null) {
            if (domFrame.getAttribute("labelType") != "name") {
              throwAnimationException("invalid_domframe_name",
                  domFrame.getAttribute("labelType"), mainPath);
            }
            mainSpriteFrame[frameIndex]["label"] =
                domFrame.getAttribute("name");
          }
          final actionscriptList = domFrame.xpath("Actionscript").toList();
          if (actionscriptList.length == 0) {
            return;
          }
          if (actionscriptList.length != 1) {
            throwAnimationException("invalid_domframe_actionscript_length",
                actionscriptList.length, mainPath);
          }
          final scriptList = actionscriptList[0].xpath("script").toList();
          if (scriptList.length != 1) {
            throwAnimationException(
                "invalid_actionscript_script", scriptList.length, mainPath);
          }
          final scriptText = scriptList[0].firstChild;
          if (scriptText!.nodeType != XmlNodeType.CDATA) {
            throwAnimationException(
                "invalid_script_cdata", scriptText.nodeType, mainPath);
          }
          if (scriptText.value!.trim() != "stop();") {
            throwAnimationException("invalid_script_cdata_value",
                scriptText.value!.trim(), mainPath);
          }
          mainSpriteFrame[frameIndex]["stop"] = true;
        });
      }
      {
        final domLayerCommand = domLayerList[1];
        final framesList = domLayerCommand.xpath("frames").toList();
        if (framesList.length != 1) {
          throwAnimationException(
              "invalid_domlayer_frames_length", framesList.length, mainPath);
        }
        final domFrameList = framesList[0].xpath("DOMFrame").toList();
        domFrameList.forEach((domFrame) {
          final frameIndex = int.parse(domFrame.getAttribute("index")!);
          final actionscriptList = domFrame.xpath("Actionscript").toList();
          if (actionscriptList.length == 0) {
            return;
          }
          if (actionscriptList.length != 1) {
            throwAnimationException("invalid_domframe_actionscript_length",
                actionscriptList.length, mainPath);
          }
          final scriptList = actionscriptList[0].xpath("script").toList();
          if (scriptList.length != 1) {
            throwAnimationException(
                "invalid_domframe_script_length", scriptList.length, mainPath);
          }
          final scriptText = scriptList[0].firstChild;
          if (scriptText!.nodeType != XmlNodeType.CDATA) {
            throwAnimationException(
                "invalid_script_cdata", scriptText.nodeType, mainPath);
          }
          final commandString = scriptText.value!.trim().split("\n").toList();
          commandString.forEach((e) {
            final regex = RegExp(r'fscommand\("(.*)", "(.*)"\);');
            final regexResult = regex.firstMatch(e.trim());
            if (regexResult == null) {
              throwAnimationException("invalid_command_string", "", mainPath);
            }
            mainSpriteFrame[frameIndex]["command"]
                .add([regexResult!.group(1), regexResult.group(2)]);
          });
        });
      }
    }
    var frameRate = 24;
    if (domDocument.getAttribute("frameRate") != null) {
      frameRate = int.parse(domDocument.getAttribute("frameRate")!);
    }
    if (domDocument.getAttribute("width") == null) {
      throwAnimationException("width_not_found", "", mainPath);
    }
    if (domDocument.getAttribute("height") == null) {
      throwAnimationException("height_not_found", "", mainPath);
    }
    final width = double.parse(domDocument.getAttribute("width")!);
    final height = double.parse(domDocument.getAttribute("height")!);
    final imageKeys = pamRipe["struct"]["image"].keys.toList();
    final imageList = [];
    for (var i = 0; i < imageKeys.length; i++) {
      imageList.add({
        "name": pamRipe["struct"]["image"][imageKeys[i]]["name"],
        "size": [
          pamRipe["struct"]["image"][imageKeys[i]]["width"],
          pamRipe["struct"]["image"][imageKeys[i]]["height"]
        ],
        "transform": parseImageDocument(
            XmlDocument.parse(FileSystem.readFile(path.join(
                    inFolder, "library", "image", "${imageKeys[i]}.xml")))
                .rootElement,
            i,
            "${imageKeys[i]}.xml")
      });
    }
    final spriteList = [];
    final spriteKeys = pamRipe["struct"]["sprite"].keys.toList();
    for (var i = 0; i < spriteKeys.length; i++) {
      spriteList.add({
        "name": pamRipe["struct"]["sprite"][spriteKeys[i]],
        "description": "",
      });
    }
    var spriteIndex = 0;
    final pamInfo = {
      "version": pamRipe["struct"]["version"],
      "frame_rate": frameRate,
      "position": pamRipe["struct"]["position"],
      "size": [width, height],
      "image": imageList,
      "sprite": spriteKeys.map((e) {
        final frame = parseSpriteDocument(
            XmlDocument.parse(FileSystem.readFile(
                    path.join(inFolder, "library", "sprite", "$e.xml")))
                .rootElement,
            spriteIndex++,
            "$e.xml");
        return {
          "name": e,
          "description": "",
          "frame_rate": frameRate,
          "work_area": [0, frame.length],
          "frame": frame
        };
      }).toList(),
      "main_sprite": {
        "name": pamRipe["struct"]["main_sprite"]["name"],
        "description": "",
        "frame_rate": frameRate,
        "work_area": [0, mainSpriteFrame.length],
        "frame": mainSpriteFrame
      }
    };
    return pamInfo;
  }

  dynamic parseImageDocument(
      XmlElement imageElement, int index, String imagePath) {
    if (imageElement.localName != "DOMSymbolItem") {
      throwAnimationException(
          "invalid_image_domsymbolitem", imageElement.localName, imagePath);
    }
    if (imageElement.getAttribute("name") != "image/image_${index + 1}") {
      throwAnimationException("invalid_image_domsymbolitem_name",
          imageElement.getAttribute("name"), imagePath);
    }
    final timelineList = imageElement.xpath("/DOMSymbolItem/timeline").toList();
    if (timelineList.length != 1) {
      throwAnimationException("invalid_image_domsymbolitem_timeline_length",
          timelineList.length, imagePath);
    }
    final domTimelineList = timelineList[0].xpath("DOMTimeline").toList();
    if (domTimelineList.length != 1) {
      throwAnimationException("invalid_image_domtimeline_length",
          domTimelineList.length, imagePath);
    }
    final domTimeline = domTimelineList[0];
    if (domTimeline.getAttribute("name") != "image_${index + 1}") {
      throwAnimationException("invalid_image_domtimeline_name",
          domTimeline.getAttribute("name"), imagePath);
    }
    final layersList = domTimeline.xpath("layers").toList();
    if (layersList.length != 1) {
      throwAnimationException("invalid_image_domtimeline_layers_length",
          layersList.length, imagePath);
    }
    final domLayerList = layersList[0].xpath("DOMLayer").toList();
    if (domLayerList.length != 1) {
      throwAnimationException(
          "invalid_image_domlayer_length", domLayerList.length, imagePath);
    }
    final frameList = domLayerList[0].xpath("frames").toList();
    if (frameList.length != 1) {
      throwAnimationException(
          "invalid_image_domlayer_frames_length", frameList.length, imagePath);
    }
    final domFrameList = frameList[0].xpath("DOMFrame").toList();
    if (domFrameList.length != 1) {
      throwAnimationException(
          "invalid_image_domframe_length", domFrameList.length, imagePath);
    }
    final elementsList = domFrameList[0].xpath("elements").toList();
    if (elementsList.length != 1) {
      throwAnimationException("invalid_image_domframe_elements_length",
          elementsList.length, imagePath);
    }
    final domSymbolInstanceList =
        elementsList[0].xpath("DOMSymbolInstance").toList();
    if (domSymbolInstanceList.length != 1) {
      throwAnimationException("invalid_image_dom_symbol_instance_length",
          domSymbolInstanceList.length, imagePath);
    }
    final imageName = domSymbolInstanceList[0].getAttribute("libraryItemName")!;
    if (imageName != "source/source_${index + 1}") {
      throwAnimationException(
          "invalid_image_dom_symbol_instance_name", imageName, imagePath);
    }
    final matrixList = domSymbolInstanceList[0].xpath("matrix").toList();
    if (matrixList.length == 0) {
      return [...initialTransform];
    }
    if (matrixList.length != 1) {
      throwAnimationException("invalid_image_dom_symbol_instance_matrix_length",
          matrixList.length, imagePath);
    }
    final matrixDList = matrixList[0].xpath("Matrix").toList();
    if (matrixDList.length != 1) {
      throwAnimationException(
          "invalid_image_matrix_length", matrixDList.length, imagePath);
    }
    final transform = parseTransform(matrixDList[0]);
    return transform;
  }

  dynamic parseSpriteDocument(
      XmlElement spriteElement, int index, String spritePath) {
    var model = null;
    final result = [];
    if (spriteElement.localName != "DOMSymbolItem") {
      throwAnimationException(
          "invalid_sprite_domsymbolitem", spriteElement.localName, spritePath);
    }
    if (spriteElement.getAttribute("name") !=
        (index == -1 ? "main" : "sprite/sprite_${index + 1}")) {
      throwAnimationException("invalid_sprite_domsymbolitem_name",
          spriteElement.getAttribute("name"), spritePath);
    }
    final timelineList = spriteElement.xpath("timeline").toList();
    if (timelineList.length != 1) {
      throwAnimationException("invalid_sprite_domsymbolitem_timeline_length",
          timelineList.length, spritePath);
    }
    final domTimelineList = timelineList[0].xpath("DOMTimeline").toList();
    if (domTimelineList.length != 1) {
      throwAnimationException("invalid_sprite_domtimeline_length",
          domTimelineList.length, spritePath);
    }
    final domTimeline = domTimelineList[0];
    if (domTimeline.getAttribute("name") !=
        (index == -1 ? "main" : "sprite_${index + 1}")) {
      throwAnimationException("invalid_sprite_domtimeline_name",
          domTimeline.getAttribute("name"), spritePath);
    }
    final layersList = domTimeline.xpath("layers").toList();
    if (layersList.length != 1) {
      throwAnimationException("invalid_sprite_domtimeline_layers_length",
          layersList.length, spritePath);
    }
    final domLayerList =
        layersList[0].xpath("DOMLayer").toList().reversed.toList();
    final domLayerCheck = domLayerList[0];
    domLayerList.removeAt(0);
    var layerCount = 0;
    if (domLayerCheck.getAttribute("name") != "0") {
      throwAnimationException("check_length_layer_is_missing",
          domLayerCheck.getAttribute("name"), spritePath);
    }
    final allFrames = int.parse(domLayerCheck
            .xpath("frames/DOMFrame")
            .toList()[0]
            .getAttribute("duration") ??
        "1");
    dynamic getFrameAt(int index) {
      if (result.length <= index) {
        final count = index - result.length + 1;
        for (var i = 0; i < count; i++) {
          result.add({
            "label": null,
            "stop": false,
            "command": [],
            "remove": [],
            "append": [],
            "change": []
          });
        }
      }
      if (result[index] == null) {
        result[index] = {
          "label": null,
          "stop": false,
          "command": [],
          "remove": [],
          "append": [],
          "change": []
        };
      }
      return result[index];
    }

    domLayerList.forEach((domLayer) {
      final framesList = domLayer.xpath("frames").toList();
      if (framesList.length != 1) {
        throwAnimationException("invalid_sprite_domtimeline_frames_length",
            framesList.length, spritePath);
      }
      final domFrameList = framesList[0].xpath("DOMFrame").toList();
      final closeCurrentModelIfNeed = () {
        if (model != null) {
          final targetFrame =
              getFrameAt(model["frame_start"] + model["frame_duration"]);
          targetFrame["remove"].add({"index": model["index"]});
          model = null;
        }
      };
      domFrameList.forEach((domFrame) {
        final frameIndex = int.parse(domFrame.getAttribute("index")!);
        final frameDuration =
            int.parse(domFrame.getAttribute("duration") ?? "1");
        var transform;
        var color;
        final elementList = domFrame.xpath("elements").toList();
        if (elementList.length == 0) {
          closeCurrentModelIfNeed();
          return;
        }
        if (elementList.length != 1) {
          throwAnimationException("invalid_sprite_domframe_elements_length",
              elementList.length, spritePath);
        }
        final domSymbolInstanceList =
            elementList[0].xpath("DOMSymbolInstance").toList();
        if (domSymbolInstanceList.length == 0) return;
        if (domSymbolInstanceList.length != 1) {
          throwAnimationException("invalid_sprite_dom_symbol_instance_length",
              domSymbolInstanceList.length, spritePath);
        }
        final domSymbolInstance = domSymbolInstanceList[0];
        final nameMatch = RegExp(r"(image|sprite)/(image|sprite)_([0-9]+)");
        final firstMatch = nameMatch
            .firstMatch(domSymbolInstance.getAttribute("libraryItemName")!);
        if (firstMatch == null) {
          throwAnimationException(
              "invalid_dom_symbol_instance", firstMatch, spritePath);
        }
        if (firstMatch!.group(1) != firstMatch.group(2)) {
          throwAnimationException(
              "invalid_sprite_dom_symbol_instance_x", firstMatch, spritePath);
        }
        final currentInstance = {
          "resource": int.parse(firstMatch.group(3)!) - 1,
          "sprite": firstMatch.group(1) == "sprite"
        };
        {
          final matrixList = domSymbolInstance.xpath("matrix").toList();
          if (matrixList.length == 0) {
            transform = [0, 0];
          } else if (matrixList.length == 1) {
            final matrixDList = matrixList[0].xpath("Matrix").toList();
            if (matrixDList.length != 1) {
              throwAnimationException("invalid_sprite_matrix_length",
                  matrixDList.length, spritePath);
            }
            transform = standardToVariant(parseTransform(matrixDList[0]));
          } else {
            throwAnimationException(
                "invalid_sprite_dom_symbol_instance_matrix_length",
                matrixList.length,
                spritePath);
          }
        }
        {
          final colorList = domSymbolInstance.xpath("color").toList();
          if (colorList.length == 0) {
            color = [...initialColor];
          } else if (colorList.length == 1) {
            final colorDList = colorList[0].xpath("Color").toList();
            if (colorDList.length != 1) {
              throwAnimationException(
                  "invalid_sprite_color_length", colorDList.length, spritePath);
            }
            color = parseColor(colorDList[0]);
          } else {
            throwAnimationException(
                "invalid_sprite_dom_symbol_instance_color_length",
                colorList.length,
                spritePath);
          }
        }
        final targetFrame = getFrameAt(frameIndex);
        if (model == null) {
          model = {
            "index": layerCount,
            "resource": currentInstance["resource"],
            "sprite": currentInstance["sprite"],
            "frame_start": frameIndex,
            "frame_duration": frameDuration,
            "color": [...initialColor],
            "transform": [0, 0]
          };
          targetFrame["append"].add({
            "index": model["index"],
            "name": null,
            "resource": currentInstance["resource"],
            "sprite": currentInstance["sprite"]
          });
          layerCount++;
        } else {
          if (currentInstance["resource"] != model["resource"] ||
              currentInstance["sprite"] != model["sprite"]) {
            throwAnimationException(
                "invalid_sprite_dom_resource", "", spritePath);
          }
        }
        model["frame_start"] = frameIndex;
        model["frame_duration"] = frameDuration;
        final colorChanged = !(model["color"][0] == color[0] &&
            model["color"][1] == color[1] &&
            model["color"][2] == color[2] &&
            model["color"][3] == color[3]);
        if (colorChanged) {
          model["color"] = color;
        }
        targetFrame["change"].add({
          "index": model["index"],
          "transform": transform,
          "color": colorChanged ? color : null
        });
      });
      closeCurrentModelIfNeed();
    });
    if (result.length <= allFrames) {
      for (var i = 0; i < index - result.length + 1; i++) {
        result.add({
          "label": null,
          "stop": false,
          "command": [],
          "remove": [],
          "append": [],
          "change": []
        });
      }
    }
    for (var i = 0; i < result.length; i++) {
      if (result[i] == null) {
        result[i] = {
          "label": null,
          "stop": false,
          "command": [],
          "remove": [],
          "append": [],
          "change": []
        };
      }
    }
    return result.take(result.length - 1).toList();
  }

  dynamic standardToVariant(dynamic data) {
    if (data[0] == data[3] && data[1] == -data[2]) {
      if (data[0] == 1.0 && data[1] == 0.0) {
        return [data[4], data[5]];
      }
      final acosValue = acos(data[0]);
      final asinValue = asin(data[1]);
      if ((acosValue.abs() - asinValue.abs()).abs() <= 1e-2) {
        return [asinValue, data[4], data[5]];
      }
    }
    return [...data];
  }

  dynamic parseTransform(XmlNode matrix) {
    return [
      double.parse(matrix.getAttribute("a") ?? "1"),
      double.parse(matrix.getAttribute("b") ?? "0"),
      double.parse(matrix.getAttribute("c") ?? "0"),
      double.parse(matrix.getAttribute("d") ?? "1"),
      double.parse(matrix.getAttribute("tx") ?? "0"),
      double.parse(matrix.getAttribute("ty") ?? "0"),
    ];
  }

  dynamic parseColorCompute(String? multiplier, String? offset) {
    return max(
            0,
            min(
                255,
                double.parse(multiplier ?? "1") * 255 +
                    double.parse(offset ?? "0"))) /
        255;
  }

  dynamic parseColor(XmlNode matrix) {
    return [
      parseColorCompute(matrix.getAttribute("redMultiplier"),
          matrix.getAttribute("redOffset")),
      parseColorCompute(matrix.getAttribute("greenMultiplier"),
          matrix.getAttribute("greenOffset")),
      parseColorCompute(matrix.getAttribute("blueMultiplier"),
          matrix.getAttribute("blueOffset")),
      parseColorCompute(matrix.getAttribute("alphaMultiplier"),
          matrix.getAttribute("blueOffset")),
    ];
  }

  String parseSourceDocument(
      XmlElement sourceElement, int index, String sourcePath) {
    if (sourceElement.localName != "DOMSymbolItem") {
      throwAnimationException(
          "invalid_source_domsymbolitem", sourceElement.localName, sourcePath);
    }
    if (sourceElement.getAttribute("name") != "source/source_${index + 1}") {
      throwAnimationException("invalid_source_domsymbolitem_name",
          sourceElement.getAttribute("name"), sourcePath);
    }
    final timelineList =
        sourceElement.xpath("/DOMSymbolItem/timeline").toList();
    if (timelineList.length != 1) {
      throwAnimationException("invalid_source_domsymbolitem_timeline_length",
          timelineList.length, sourcePath);
    }
    final domTimelineList = timelineList[0].xpath("DOMTimeline").toList();
    if (domTimelineList.length != 1) {
      throwAnimationException("invalid_source_domtimeline_length",
          domTimelineList.length, sourcePath);
    }
    final domTimeline = domTimelineList[0];
    if (domTimeline.getAttribute("name") != "source_${index + 1}") {
      throwAnimationException("invalid_source_domtimeline_name",
          domTimeline.getAttribute("name"), sourcePath);
    }
    final layersList = domTimeline.xpath("layers").toList();
    if (layersList.length != 1) {
      throwAnimationException("invalid_source_domtimeline_layers_length",
          layersList.length, sourcePath);
    }
    final domLayerList = layersList[0].xpath("DOMLayer").toList();
    if (domLayerList.length != 1) {
      throwAnimationException(
          "invalid_source_domlayer_length", domLayerList.length, sourcePath);
    }
    final frameList = domLayerList[0].xpath("frames").toList();
    if (frameList.length != 1) {
      throwAnimationException("invalid_source_domtimeline_frames_length",
          frameList.length, sourcePath);
    }
    final domFrameList = frameList[0].xpath("DOMFrame").toList();
    if (domFrameList.length != 1) {
      throwAnimationException(
          "invalid_source_domframe_length", domFrameList.length, sourcePath);
    }
    final elementsList = domFrameList[0].xpath("elements").toList();
    if (elementsList.length != 1) {
      throwAnimationException("invalid_source_domframe_elements_length",
          elementsList.length, sourcePath);
    }
    final domBitmapInstanceList =
        elementsList[0].xpath("DOMBitmapInstance").toList();
    if (domBitmapInstanceList.length != 1) {
      throwAnimationException("invalid_source_dom_bitmap_instance_length",
          domBitmapInstanceList.length, sourcePath);
    }
    final imageName = domBitmapInstanceList[0].getAttribute("libraryItemName")!;
    if (!imageName.contains("media")) {
      throwAnimationException(
          "invalid_source_dom_bitmap_instance_name", imageName, sourcePath);
    }
    return imageName.substring(6);
  }

  void throwAnimationException(String error, dynamic value, String path) {
    throw Exception("$error. value: $value. path: $path");
  }

  void flashAnimationResize(String inFolder, int resolution) {
    final scaleResolution = 1200 / resolution;
    final directory = Directory(path.join(inFolder, "library", "source"));
    final sourceFolder = directory.listSync();
    sourceFolder.map((e) => path.extension(e.path).toLowerCase() == ".xml");
    sourceFolder.sort((a, b) =>
        int.parse(a.path.split('_').last.replaceAll(".xml", "")).compareTo(
            int.parse(b.path.split('_').last.replaceAll(".xml", ""))));
    for (var i = 0; i < sourceFolder.length; i++) {
      final sourceXml =
          XmlDocument.parse(FileSystem.readFile(sourceFolder[i].path));
      final sourceName =
          parseSourceDocument(sourceXml.rootElement, i, sourceFolder[i].path);
      final sourceDocument = writeSourceDocument(
          i,
          {
            "name": sourceName,
            "size": [0, 0],
            "transform": [0, 0, 0, 0]
          },
          scaleResolution);
      FileSystem.writeFile(sourceFolder[i].path,
          sourceDocument.toXmlString(pretty: true, indent: "\t"));
    }
    return;
  }
}
