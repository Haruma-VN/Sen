using Sen.Shell.Kernel.Standards.IOModule.Buffer;

namespace Sen.Shell.Kernel.Support.PvZ.CharacterFontWidget2
{
    public class CharacterFontWidget2
    {
        public int ascent;
        public int ascent_padding;
        public int height;
        public int line_sepacing_offset;
        public bool initialized;
        public int default_point_size;
        public CharacterItem[]? character;
        public FontLayer[]? layer;
        public string? source_file;
        public string? error_header;
        public int point_size;
        public string[]? tag;
        public double scale;
        public bool force_scaled_image_white;
        public bool activate_all_layer;
    }

    public class FontCharacter 
    {
        public char index;
        public int image_rect_x;
        public int image_rect_y;
        public int image_rect_width;
        public int image_rect_height;
        public int image_offset_x;
        public int image_offset_y;
        public ushort kerning_first;
        public ushort kerning_count;
        public int width;
        public int order;
    }

    public class FontLayer 
    {
        public string? name;
        public string[]? tag_require;
        public string[]? tag_exclude;
        public FontKerning[]? kerning;
        public FontCharacter[]? character;
        public int multiply_red;
        public int multiply_green;
        public int multiply_blue;
        public int multiply_alpha;
        public int add_red;
        public int add_green;
        public int add_blue;
        public int add_alpha;
        public string? image_file;
        public int draw_mode;
        public int offset_x;
        public int offset_y;
        public int spacing;
        public int minimum_point_size;
        public int maximum_point_size;
        public int point_size;
        public int ascent;
        public int ascent_padding;
        public int height;
        public int default_height;
        public int line_spacing_offset;
        public int base_order;
    }

    public class CharacterItem {
        public char index;
        public char vaule;
    }

    public class FontKerning {
        public char index;
        public ushort offset;
    }

    public class CharacterFontWidget2_Function
    {
        public static CharacterFontWidget2 Decode(SenBuffer senFile) 
        {
            senFile.readOffset = 16;
            var cfw2_json = new CharacterFontWidget2();
            cfw2_json.ascent = senFile.readInt32LE();
            cfw2_json.ascent_padding = senFile.readInt32LE();
            cfw2_json.height = senFile.readInt32LE();
            cfw2_json.line_sepacing_offset = senFile.readInt32LE();
            cfw2_json.initialized = senFile.readBool();
            cfw2_json.default_point_size = senFile.readInt32LE();
            var characterCount = senFile.readUInt32LE();
            cfw2_json.character = new CharacterItem[characterCount];
            for (var i = 0; i < characterCount; i++) {
                cfw2_json.character[i] = new CharacterItem {
                    index = senFile.readCharByInt16LE(),
                    vaule = senFile.readCharByInt16LE()
                };
            }
            var layerCount = senFile.readUInt32LE();
            cfw2_json.layer = new FontLayer[layerCount];
            for (var i = 0; i < layerCount; i++) {
                var name = senFile.readStringByInt32LE();
                var tag_require_count = senFile.readUInt32LE();
                var tag_require = new string[tag_require_count];
                for (var k = 0; k < tag_require_count; k++) {
                    tag_require[k] = senFile.readStringByInt32LE();
                }
                var tag_exclude_count = senFile.readUInt32LE();
                var tag_exclude = new string[tag_exclude_count];
                for (var k = 0; k < tag_exclude_count; k++) {
                    tag_exclude[k] = senFile.readStringByInt32LE();
                }
                var kerning_count = senFile.readUInt32LE();
                var kerning = new FontKerning[kerning_count];
                for (var k = 0; k < kerning_count; k++) {
                    kerning[k] = new FontKerning {
                        offset = senFile.readUInt16LE(),
                        index = senFile.readCharByInt16LE()
                    };
                }
                var character_count = senFile.readUInt32LE();
                var character = new FontCharacter[character_count];
                for (var k = 0; k < character_count; k++) {
                    character[k] = new FontCharacter{
                        index = senFile.readCharByInt16LE(),
                        image_rect_x = senFile.readInt32LE(),
                        image_rect_y = senFile.readInt32LE(),
                        image_rect_width = senFile.readInt32LE(),
                        image_rect_height = senFile.readInt32LE(),
                        image_offset_x = senFile.readInt32LE(),
                        image_offset_y = senFile.readInt32LE(),
                        kerning_count = senFile.readUInt16LE(),
                        kerning_first = senFile.readUInt16LE(),
                        width = senFile.readInt32LE(),
                        order = senFile.readInt32LE(),
                    };
                }
                cfw2_json.layer[i] = new FontLayer {
                    name = name,
                    tag_require = tag_require,
                    tag_exclude = tag_exclude,
                    kerning = kerning,
                    character = character,
                    multiply_red = senFile.readInt32LE(),
                    multiply_green = senFile.readInt32LE(),
                    multiply_blue = senFile.readInt32LE(),
                    multiply_alpha = senFile.readInt32LE(),
                    add_red = senFile.readInt32LE(),
                    add_green = senFile.readInt32LE(),
                    add_blue = senFile.readInt32LE(),
                    add_alpha = senFile.readInt32LE(),
                    image_file = senFile.readStringByInt32LE(),
                    draw_mode = senFile.readInt32LE(),
                    offset_x = senFile.readInt32LE(),
                    offset_y = senFile.readInt32LE(),
                    spacing = senFile.readInt32LE(),
                    minimum_point_size = senFile.readInt32LE(),
                    maximum_point_size = senFile.readInt32LE(),
                    point_size = senFile.readInt32LE(),
                    ascent = senFile.readInt32LE(),
                    ascent_padding = senFile.readInt32LE(),
                    height = senFile.readInt32LE(),
                    default_height = senFile.readInt32LE(),
                    line_spacing_offset = senFile.readInt32LE(),
                    base_order = senFile.readInt32LE(),
                };
            }
            cfw2_json.source_file = senFile.readStringByInt32LE();
            cfw2_json.error_header = senFile.readStringByInt32LE();
            cfw2_json.point_size = senFile.readInt32LE();
            var tagCount = senFile.readUInt32LE();
            cfw2_json.tag = new string[tagCount];
            for (var i = 0 ; i < tagCount; i++) {
                cfw2_json.tag[i] = senFile.readStringByInt32LE();
            }
            cfw2_json.scale = senFile.readDoubleLE();
            cfw2_json.force_scaled_image_white = senFile.readBool();
            cfw2_json.activate_all_layer = senFile.readBool();
            return cfw2_json;
        }

        public static SenBuffer Encode(CharacterFontWidget2 cfw2_json) {
            var senFile = new SenBuffer();
            senFile.writeOffset = 16;
            senFile.writeInt32LE(cfw2_json.ascent);
            senFile.writeInt32LE(cfw2_json.ascent_padding);
            senFile.writeInt32LE(cfw2_json.height);
            senFile.writeInt32LE(cfw2_json.line_sepacing_offset);
            senFile.writeBool(cfw2_json.initialized);
            senFile.writeInt32LE(cfw2_json.default_point_size);
            var characterCount = cfw2_json.character!.Length;
            senFile.writeUInt32LE((uint)characterCount);
            for (var i = 0; i < characterCount; i++) {
                senFile.writeCharByInt16LE(cfw2_json.character[i].index);
                senFile.writeCharByInt16LE(cfw2_json.character[i].vaule);
            }
            var layerCount = cfw2_json.layer!.Length;
            senFile.writeUInt32LE((uint)layerCount);
            for (var i = 0; i < layerCount; i++) {
                var layer = cfw2_json.layer[i];
                senFile.writeStringByInt32LE(layer.name);
                var tag_require_count = layer.tag_require!.Length;
                senFile.writeUInt32LE((uint)tag_require_count);
                for (var k = 0; k < tag_require_count; k++) {
                    senFile.writeStringByInt32LE(layer.tag_require[k]);
                }
                var tag_exclude_count = layer.tag_exclude!.Length;
                senFile.writeUInt32LE((uint)tag_exclude_count);
                for (var k = 0; k < tag_exclude_count; k++) {
                    senFile.writeStringByInt32LE(layer.tag_exclude[k]);
                }
                var kerning_count = layer.kerning!.Length;
                senFile.writeUInt32LE((uint)kerning_count);
                for (var k = 0; k < kerning_count; k++) {
                    senFile.writeUInt16LE(layer.kerning[k].offset);
                    senFile.writeCharByInt16LE(layer.kerning[k].index);
                }
                var character_count = layer.character!.Length;
                senFile.writeUInt32LE((uint)character_count);
                for (var k = 0; k < character_count; k++) {
                    var character = layer.character[k];
                    senFile.writeCharByInt16LE(character.index);
                    senFile.writeInt32LE(character.image_rect_x);
                    senFile.writeInt32LE(character.image_rect_y);
                    senFile.writeInt32LE(character.image_rect_width);
                    senFile.writeInt32LE(character.image_rect_height);
                    senFile.writeInt32LE(character.image_offset_x);
                    senFile.writeInt32LE(character.image_offset_y);
                    senFile.writeUInt16LE(character.kerning_count);
                    senFile.writeUInt16LE(character.kerning_first);
                    senFile.writeInt32LE(character.width);
                    senFile.writeInt32LE(character.order);
                }
                senFile.writeInt32LE(layer.multiply_red);
                senFile.writeInt32LE(layer.multiply_green);
                senFile.writeInt32LE(layer.multiply_blue);
                senFile.writeInt32LE(layer.multiply_alpha);
                senFile.writeInt32LE(layer.add_red);
                senFile.writeInt32LE(layer.add_green);
                senFile.writeInt32LE(layer.add_blue);
                senFile.writeInt32LE(layer.add_alpha);
                senFile.writeStringByInt32LE(layer.image_file);
                senFile.writeInt32LE(layer.draw_mode);
                senFile.writeInt32LE(layer.offset_x);
                senFile.writeInt32LE(layer.offset_y);
                senFile.writeInt32LE(layer.spacing);
                senFile.writeInt32LE(layer.minimum_point_size);
                senFile.writeInt32LE(layer.maximum_point_size);
                senFile.writeInt32LE(layer.point_size);
                senFile.writeInt32LE(layer.ascent);
                senFile.writeInt32LE(layer.ascent_padding);
                senFile.writeInt32LE(layer.height);
                senFile.writeInt32LE(layer.default_height);
                senFile.writeInt32LE(layer.line_spacing_offset);
                senFile.writeInt32LE(layer.base_order);
            }
            senFile.writeStringByInt32LE(cfw2_json.source_file);
            senFile.writeStringByInt32LE(cfw2_json.error_header);
            senFile.writeInt32LE(cfw2_json.point_size);
            var tagCount = cfw2_json.tag!.Length;
            senFile.writeUInt32LE((uint)tagCount);
            for (var i = 0; i < tagCount; i++) {
                senFile.writeStringByInt32LE(cfw2_json.tag[i]);
            }
            senFile.writeDoubleLE(cfw2_json.scale);
            senFile.writeBool(cfw2_json.force_scaled_image_white);
            senFile.writeBool(cfw2_json.activate_all_layer);
            return senFile; // unfinished, need add 16 bytes in head;
        }
    }
}