import 'package:flutter/material.dart';

class Method {
  String name;

  String subtitle;

  IconData icon = Icons.terminal;

  Method(
    this.name,
    this.subtitle,
  );

  Method.hasIcon(
    this.name,
    this.subtitle,
    this.icon,
  );
}

final List<Map<String, dynamic>> defaultMethods = [
  {
    "method": "popcap.resource_group.split",
    "index": 0,
  },
  {
    "method": "popcap.resource_group.merge",
    "index": 1,
  },
  {
    "method": "popcap.resource_group.to_resinfo",
    "index": 2,
  },
  {
    "method": "popcap.resource_group.from_resinfo",
    "index": 3,
  },
  {
    "method": "popcap.resinfo.split",
    "index": 4,
  },
  {
    "method": "popcap.resinfo.merge",
    "index": 5,
  },
  {
    "method": "popcap.resource_group.split_atlas",
    "index": 6,
  },
  {
    "method": "popcap.resource_group.merge_atlas",
    "index": 7,
  },
  {
    "method": "popcap.resinfo.split_atlas",
    "index": 8,
  },
  {
    "method": "popcap.resinfo.merge_atlas",
    "index": 9,
  },
  {
    "method": "popcap.ptx.decode",
    "index": 10,
  },
  {
    "method": "popcap.ptx.encode",
    "index": 11,
  },
  {
    "method": "popcap.animation.decode_to_json",
    "index": 12,
  },
  {
    "method": "popcap.animation.encode_from_json",
    "index": 13,
  },
  {
    "method": "popcap.animation.pam_to_flash",
    "index": 14,
  },
  {
    "method": "popcap.animation.pam_from_flash",
    "index": 15,
  },
  {
    "method": "popcap.animation.json_to_flash",
    "index": 16,
  },
  {
    "method": "popcap.animation.json_from_flash",
    "index": 17,
  },
  {
    "method": "popcap.rton.decode",
    "index": 18,
  },
  {
    "method": "popcap.rton.encode",
    "index": 19,
  },
  {
    "method": "popcap.rton.decrypt",
    "index": 20,
  },
  {
    "method": "popcap.rton.encrypt",
    "index": 21,
  },
  {
    "method": "popcap.rton.decrypt_and_decode",
    "index": 22,
  },
  {
    "method": "popcap.rton.encode_and_encrypt",
    "index": 23,
  },
  {
    "method": "popcap.rsg.unpack",
    "index": 24,
  },
  {
    "method": "popcap.rsg.pack",
    "index": 25,
  },
  {
    "method": "popcap.rsb.unpack",
    "index": 26,
  },
  {
    "method": "popcap.rsb.pack",
    "index": 27,
  },
  {
    "method": "popcap.rsb.unpack_simple",
    "index": 28,
  },
  {
    "method": "popcap.rsb.pack_simple",
    "index": 29,
  },
  {
    "method": "popcap.rsb.unpack_by_loose_constraints",
    "index": 30,
  },
  {
    "method": "popcap.rsb.unpack_resource",
    "index": 31,
  },
  {
    "method": "popcap.rsb.pack_resource",
    "index": 32,
  },
  {
    "method": "popcap.zlib.compress",
    "index": 33,
  },
  {
    "method": "popcap.zlib.uncompress",
    "index": 34,
  },
  {
    "method": "wwise.soundbank.decode",
    "index": 35,
  },
  {
    "method": "wwise.soundbank.encode",
    "index": 36,
  },
  {
    "method": "popcap.animation.flash_animation_resize",
    "index": 37,
  },
  {
    "method": "popcap.rsbpatch.decode",
    "index": 38,
  },
  {
    "method": "popcap.rsbpatch.encode",
    "index": 39,
  },
  {
    "method": "popcap.lawnstring.convert",
    "index": 40,
  },
  {
    "method": "popcap.newton.decode",
    "index": 41,
  },
  {
    "method": "popcap.newton.encode",
    "index": 42,
  },
  {
    "method": "popcap.compiled_text.decode",
    "index": 43,
  },
  {
    "method": "popcap.compiled_text.encode",
    "index": 44,
  },
  {
    "method": "popcap.render.effects.decode",
    "index": 45,
  },
  {
    "method": "popcap.render.effects.encode",
    "index": 46,
  },
];
