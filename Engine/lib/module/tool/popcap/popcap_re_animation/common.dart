// ignore_for_file: depend_on_referenced_packages, unused_import

import "dart:math";
import "dart:typed_data";
import 'package:sen_material_design/module/utility/buffer/common.dart';
import "package:path/path.dart" as path;
import 'package:sen_material_design/module/utility/io/common.dart';
import "package:convert/convert.dart";
import "package:xml/xml.dart";

class PopCapReAnimation {
  final xmlnsAttribute = {
    'http://www.w3.org/2001/XMLSchema-instance': 'xsi',
    'http://ns.adobe.com/xfl/2008/': ''
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
          sourceDocument.toXmlString(pretty: true, indent: "\t"));
      final imageDocument = writeImageDocument(i, imageList[i]);
      FileSystem.writeFile(
          path.join(outFolder, "library", "image", "image_${i + 1}.xml"),
          imageDocument.toXmlString(pretty: true, indent: "\t"));
    }
    final spriteList = jsonFile["sprite"];
    for (var i = 0; i < spriteList.length; i++) {
      final spriteDocument = writeSpriteDocument(
          i, decodeFrameNodeList(spriteList[i], spriteList));
      FileSystem.writeFile(
          path.join(outFolder, "library", "sprite", "sprite_${i + 1}.xml"),
          spriteDocument.toXmlString(pretty: true, indent: "\t"));
    }
    final mainDocument = writeSpriteDocument(
        -1, decodeFrameNodeList(jsonFile["main_sprite"], spriteList));
    FileSystem.writeFile(path.join(outFolder, "library", "main.xml"),
        mainDocument.toXmlString(pretty: true, indent: "\t"));
    final domDocument = writeDomDocument(jsonFile);
    FileSystem.writeFile(path.join(outFolder, "DomDocument.xml"),
        domDocument.toXmlString(pretty: true, indent: "\t"));
    FileSystem.writeFile(path.join(outFolder, "main.xfl"), "PROXY-CS5");
    final structInfo = {
      "version": jsonFile["version"],
      "frame_rate": jsonFile["frame_rate"],
      "position": jsonFile["position"],
      "image": {},
      "sprite": {},
      "main_sprite": {"main_sprite": jsonFile["main_sprite"]["name"]}
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
          flowNode.add(new XmlElement(XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "${prevEnd["flow"]! + 1}"),
            XmlAttribute(
                XmlName("duration"), "${frameIndex - (prevEnd["flow"]! + 1)}")
          ], {
            new XmlElement(XmlName("elements"))
          }));
        }
        var nodeElemnt = new XmlElement(
            XmlName("DOMFrame"),
            [XmlAttribute(XmlName("index"), "$frameIndex")],
            {new XmlElement(XmlName("elements"))});

        if (frame["label"] != null) {
          nodeElemnt.setAttribute("name", "${frame["label"]}");
          nodeElemnt.setAttribute("labelType", "name");
        }
        if (frame["stop"]) {
          nodeElemnt.children.insert(
              0,
              new XmlElement(XmlName("Actionscript"), [], {
                new XmlElement(XmlName("script"), [], {XmlCDATA("stop();")})
              }));
        }
        flowNode.add(nodeElemnt);
        prevEnd["flow"] = frameIndex;
      }
      if (frame["command"].length > 0) {
        if (prevEnd["command"]! + 1 < frameIndex) {
          commandNode.add(new XmlElement(XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "${prevEnd["command"]! + 1}"),
            XmlAttribute(XmlName("duration"),
                "${frameIndex - (prevEnd["command"]! + 1)}")
          ]));
        }
        commandNode.add(new XmlElement(XmlName("DOMFrame"), [
          XmlAttribute(XmlName("index"), "$frameIndex")
        ], {
          new XmlElement(XmlName("Actionscript"), [], {
            new XmlElement(XmlName("script"), [], {
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
      flowNode.add(new XmlElement(XmlName("DOMFrame"), [
        XmlAttribute(XmlName("index"), "${prevEnd["flow"]! + 1}"),
        XmlAttribute(XmlName("duration"),
            "${jsonFile["main_sprite"]["frame"].length - (prevEnd["flow"]! + 1)}")
      ]));
    }
    if (prevEnd["command"]! + 1 < jsonFile["main_sprite"]["frame"].length) {
      commandNode.add(new XmlElement(XmlName("DOMFrame"), [
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
              .map((e) => new XmlElement(XmlName("DOMFolderItem"), [
                    XmlAttribute(XmlName("name"), e),
                    XmlAttribute(XmlName("isExpanded"), "true")
                  ]))
              .toList());
      builder.element("media",
          nest: jsonFile["image"]
              .map((e) => new XmlElement(XmlName("DOMBitmapItem"), [
                    XmlAttribute(
                        XmlName("name"), "media/${e["name"].split("|")[0]}"),
                    XmlAttribute(
                        XmlName("href"), "media/${e["name"].split("|")[0]}.png")
                  ])));
      builder.element("symbols", nest: [
        jsonFile["image"]
            .map((e) => new XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "source/source_${sourceIndex++}.xml"),
                ]))
            .toList(),
        jsonFile["image"]
            .map((e) => new XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "image/image_${imageIndex++}.xml"),
                ]))
            .toList(),
        jsonFile["sprite"]
            .map((e) => new XmlElement(XmlName("Include"), [
                  XmlAttribute(
                      XmlName("href"), "sprite/sprite_${spriteIndex++}.xml"),
                ]))
            .toList(),
        new XmlElement(XmlName("Include"), [
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
      new XmlElement(XmlName("DOMFrame"), [
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
          "transform": initialTransform,
          "color": initialColor,
          "frame_start": i,
          "frame_duration": i,
        };
        frameNodeList[adds[k]["index"] + 1] = [];
        if (i > 0) {
          frameNodeList[adds[k]["index"] + 1].add(new XmlElement(
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
          frameNode.add(new XmlElement(XmlName("DOMFrame"), [
            XmlAttribute(XmlName("index"), "$i"),
            XmlAttribute(XmlName("duration"), "")
          ], {
            new XmlElement(XmlName("elements"), [], {
              new XmlElement(
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
                          XmlAttribute(XmlName("firstFrame"),
                              "${(i - layer["frame_start"]) % subSprite[layer["resource"]]["frame"].length}")
                        ],
                  {
                    new XmlElement(XmlName("matrix"), [], {
                      new XmlElement(XmlName("Matrix"), [
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
                    new XmlElement(XmlName("color"), [], {
                      new XmlElement(XmlName("Color"), [
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
      throw new Exception("invaild_transform_size");
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
}
