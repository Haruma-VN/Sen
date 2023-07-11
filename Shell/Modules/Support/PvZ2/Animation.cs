using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards;
using System.Text.Json;
using System.Xml;
using System.Xml.Linq;
using System.Text.RegularExpressions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Sen.Shell.Modules.Support.PvZ2.PAM
{

    public class PAMInfo
    {
        public int version { get; set; } = 6;
        public int frame_rate { get; set; } = 30;
        public required double[] position { get; set; }
        public required double[] size { get; set; }
        public required ImageInfo[] image { get; set; }
        public required SpriteInfo[] sprite { get; set; }
        public required SpriteInfo main_sprite { get; set; }
    }


    public class ImageInfo
    {
        public required string name { get; set; }
        public required int[] size { get; set; }
        public required double[] transform { get; set; }
    }

    public class SpriteInfo
    {
        public string? name { get; set; }
        public string? description { get; set; }
        public double frame_rate { get; set; }
        public int[]? work_area { get; set; }
        public FrameInfo[]? frame { get; set; }

    }

    public class ExtraInfo
    {
        public int version { get; set; } = 6;
        public int frame_rate { get; set; } = 30;
        public required double[] position { get; set; }
        public ExtraImageInfo[]? image { get; set; }
        public ExtraSpriteInfo[]? sprite { get; set; }
        public ExtraSpriteInfo? main_sprite { get; set; }
    }

    public class ExtraImageInfo
    {
        public string? name { get; set; }
        public required int[] size { get; set; }
    }

    public class ExtraSpriteInfo
    {
        public string? name { get; set; }
    }

    [Flags]
    public enum FrameFlags : byte
    {
        Removes = 1,
        Adds = 2,
        Moves = 4,
        FrameName = 8,
        Stop = 16,
        Commands = 32
    }


    public static class Magic
    {
        public static readonly uint MagicNumber = 0xBAF01954;
    }

    public class FrameInfo
    {
        public string? label { get; set; }
        public bool stop { get; set; }
        public List<string[]>? command { get; set; }
        public List<RemovesInfo>? remove { get; set; }
        public List<AddsInfo>? append { get; set; }
        public List<MovesInfo>? change { get; set; }

        public static void WriteCommand(SenBuffer PamFile, int version, string[] command)
        {
            PamFile.writeStringByInt16LE(command[0]);
            PamFile.writeStringByInt16LE(command[1]);
        }

        public static string[] ReadCommand(SenBuffer PamFile, int version)
        {
            string[] command = new string[2];
            command[0] = PamFile.readStringByInt16LE();
            command[1] = PamFile.readStringByInt16LE();
            return command;
        }

        public class RemovesInfo
        {
            public int index { get; set; }

            public void Write(SenBuffer PamFile, int version)
            {
                if (index >= 2047)
                {
                    PamFile.writeInt16LE(2047);
                    PamFile.writeInt32LE(index);
                }
                else
                {
                    PamFile.writeInt16LE((short)index);
                }
            }

            public RemovesInfo Read(SenBuffer PamFile, int version)
            {
                index = PamFile.readInt16LE();
                if (index >= 2047)
                {
                    index = PamFile.readInt32LE();
                }
                return this;
            }
        }

        public class AddsInfo
        {
            public int index { get; set; }
            public string? name { get; set; }
            public int resource { get; set; }
            public bool sprite { get; set; }
            public bool additive { get; set; }
            public int preload_frame { get; set; }
            public float time_scale { get; set; } = 1;

            public void Write(SenBuffer PamFile, int version)
            {
                long beginPos = PamFile.writeOffset;
                PamFile.writeOffset += 2;
                int flags = 0;
                if (index >= 2047 || index < 0)
                {
                    flags |= 2047;
                    PamFile.writeInt32LE(index);
                }
                else
                {
                    flags |= index;
                }
                flags |= sprite ? 32768 : 0;
                flags |= additive ? 16384 : 0;
                if (version >= 6)
                {
                    if (resource >= 255 || resource < 0)
                    {
                        PamFile.writeUInt8(0xFF);
                        PamFile.writeInt16LE((short)resource);
                    }
                    else
                    {
                        PamFile.writeUInt8((byte)resource);
                    }
                }
                else
                {
                    PamFile.writeUInt8((byte)resource);
                }
                if (preload_frame != 0)
                {
                    flags |= 8192;
                    PamFile.writeInt16LE((short)preload_frame);
                }
                if (name != null)
                {
                    flags |= 4096;
                    PamFile.writeStringByInt16LE(name);
                }
                if (time_scale != 1)
                {
                    flags |= 2048;
                    PamFile.writeInt32LE((int)(time_scale * 65536));
                }
                long endPos = PamFile.writeOffset;
                PamFile.writeOffset = beginPos;
                PamFile.writeUInt16LE((ushort)flags);
                PamFile.writeOffset = endPos;
            }
            public AddsInfo Read(SenBuffer PamFile, int version)
            {
                ushort num = PamFile.readUInt16LE();
                index = num & 2047;
                if (index == 2047)
                {
                    index = PamFile.readInt32LE();
                }
                sprite = (num & 32768) != 0;
                additive = (num & 16384) != 0;
                resource = PamFile.readUInt8();
                if (version >= 6 && resource == 255)
                {
                    resource = PamFile.readInt16LE();
                }
                if ((num & 8192) != 0)
                {
                    preload_frame = PamFile.readInt16LE();
                }
                else
                {
                    preload_frame = 0;
                }
                if ((num & 4096) != 0)
                {
                    name = PamFile.readStringByInt16LE();
                }
                if ((num & 2048) != 0)
                {
                    time_scale = PamFile.readInt32LE() / 65536f;
                }
                else
                {
                    time_scale = 1;
                }
                return this;
            }

        }
        public class MovesInfo
        {
            [Flags]
            public enum MoveFlags
            {
                SrcRect = 32768,
                Rotate = 16384,
                Color = 8192,
                Matrix = 4096,
                LongCoords = 2048,
                AnimFrameNum = 1024
            }

            public int index { get; set; }
            public double[] transform { get; set; } = new double[2];
            public double[]? color { get; set; }
            public int[]? source_rectangle { get; set; }
            public int sprite_frame_number { get; set; }

            public void Write(SenBuffer PamFile, int version)
            {
                long beginPos = PamFile.writeOffset;
                PamFile.writeOffset += 2;
                int flags = 0;
                if (index >= 1023 || index < 0)
                {
                    flags |= 1023;
                    PamFile.writeInt32LE(index);
                }
                else
                {
                    flags |= index;
                }
                MoveFlags f7 = 0;
                if (transform.Length == 6)
                {
                    f7 |= MoveFlags.Matrix;
                    PamFile.writeInt32LE((int)(transform[0] * 65536));
                    PamFile.writeInt32LE((int)(transform[2] * 65536));
                    PamFile.writeInt32LE((int)(transform[1] * 65536));
                    PamFile.writeInt32LE((int)(transform[3] * 65536));
                }
                else if (transform.Length == 3)
                {
                    f7 |= MoveFlags.Rotate;
                    PamFile.writeInt16LE((short)(transform[0] * 1000));
                }
                int v0 = (int)(transform[^2] * 20);
                int v1 = (int)(transform[^1] * 20);
                if (version >= 5)
                {
                    PamFile.writeInt32LE(v0);
                    PamFile.writeInt32LE(v1);
                    f7 |= MoveFlags.LongCoords;
                }
                else
                {
                    PamFile.writeInt16LE((short)v0);
                    PamFile.writeInt16LE((short)v1);
                }
                if (source_rectangle != null && source_rectangle.Length >= 4)
                {
                    f7 |= MoveFlags.SrcRect;
                    PamFile.writeInt16LE((short)(source_rectangle[0] * 20));
                    PamFile.writeInt16LE((short)(source_rectangle[1] * 20));
                    PamFile.writeInt16LE((short)(source_rectangle[2] * 20));
                    PamFile.writeInt16LE((short)(source_rectangle[3] * 20));
                }
                if (color != null && color.Length >= 4)
                {
                    f7 |= MoveFlags.Color;
                    PamFile.writeUInt8((byte)(color[0] * 255));
                    PamFile.writeUInt8((byte)(color[1] * 255));
                    PamFile.writeUInt8((byte)(color[2] * 255));
                    PamFile.writeUInt8((byte)(color[3] * 255));
                }
                if (sprite_frame_number != 0)
                {
                    f7 |= MoveFlags.AnimFrameNum;
                    PamFile.writeInt16LE((short)sprite_frame_number);
                }
                flags |= (int)f7;
                long endPos = PamFile.writeOffset;
                PamFile.writeOffset = beginPos;
                PamFile.writeUInt16LE((ushort)flags);
                PamFile.writeOffset = endPos;
            }

            public MovesInfo Read(SenBuffer PamFile, int version)
            {
                ushort num7 = PamFile.readUInt16LE();
                int num8 = num7 & 1023;
                if (num8 == 1023)
                {
                    num8 = PamFile.readInt32LE();
                }
                index = num8;
                MoveFlags f7 = (MoveFlags)num7;
                if ((f7 & MoveFlags.Matrix) != 0)
                {
                    transform = new double[6];
                    transform[0] = PamFile.readInt32LE() / 65536d;
                    transform[2] = PamFile.readInt32LE() / 65536d;
                    transform[1] = PamFile.readInt32LE() / 65536d;
                    transform[3] = PamFile.readInt32LE() / 65536d;
                }
                else if ((f7 & MoveFlags.Rotate) != 0)
                {
                    transform = new double[3];
                    double num9 = PamFile.readInt16LE() / 1000d;
                    transform[0] = num9;
                }
                else
                {
                    transform = new double[2];
                }
                if ((f7 & MoveFlags.LongCoords) != 0)
                {
                    transform[^2] = PamFile.readInt32LE() / 20d;
                    transform[^1] = PamFile.readInt32LE() / 20d;
                }
                else
                {
                    transform[^2] = PamFile.readInt16LE() / 20d;
                    transform[^1] = PamFile.readInt16LE() / 20d;
                }
                if ((f7 & MoveFlags.SrcRect) != 0)
                {
                    source_rectangle = new int[4];
                    source_rectangle[0] = PamFile.readInt16LE() / 20;
                    source_rectangle[1] = PamFile.readInt16LE() / 20;
                    source_rectangle[2] = PamFile.readInt16LE() / 20;
                    source_rectangle[3] = PamFile.readInt16LE() / 20;
                }
                if ((f7 & MoveFlags.Color) != 0)
                {
                    color = new double[4];
                    color[0] = PamFile.readUInt8() / 255d;
                    color[1] = PamFile.readUInt8() / 255d;
                    color[2] = PamFile.readUInt8() / 255d;
                    color[3] = PamFile.readUInt8() / 255d;
                }
                if ((f7 & MoveFlags.AnimFrameNum) != 0)
                {
                    sprite_frame_number = PamFile.readInt16LE();
                }
                else
                {
                    sprite_frame_number = 0;
                }
                return this;
            }
        }
    }



    public class PAM_Binary
    {
        // Decode
        public static PAMInfo Decode(SenBuffer PamFile)
        {
            uint PAM_magic = PamFile.readUInt32LE();
            if (PAM_magic != Magic.MagicNumber)
            {
                throw new PAMException("invalid_pam_magic", PamFile.filePath ?? "undefined");
            }
            int version = PamFile.readInt32LE();
            if (version > 6 || version < 1)
            {
                throw new PAMException("pam_version_out_of_range", PamFile.filePath ?? "undefined");
            }
            int frame_rate = (int)PamFile.readUInt8();
            double[] position = new double[2];
            for (var i = 0; i < 2; i++)
            {
                position[i] = PamFile.readInt16LE() / 20d;
            }
            double[] size = new double[2];
            for (var i = 0; i < 2; i++)
            {
                size[i] = PamFile.readInt16LE() / 20d;
            }
            int imagesCount = PamFile.readInt16LE();
            var image = new ImageInfo[imagesCount];
            for (var i = 0; i < imagesCount; i++)
            {
                image[i] = ReadImageInfo(PamFile, version);
            }
            int spritesCount = PamFile.readInt16LE();
            var sprite = new SpriteInfo[spritesCount];
            for (var i = 0; i < spritesCount; i++)
            {
                sprite[i] = ReadSpriteInfo(PamFile, version);
                if (version < 4)
                {
                    sprite[i].frame_rate = frame_rate;
                }
            }
            var main_sprite = new SpriteInfo();
            if (version <= 3 || PamFile.readBool())
            {
                main_sprite = ReadSpriteInfo(PamFile, version);
                if (version < 4)
                {
                    main_sprite.frame_rate = frame_rate;
                }
            }
            var AnimationJson = new PAMInfo
            {
                version = version,
                frame_rate = frame_rate,
                position = position,
                size = size,
                image = image,
                sprite = sprite,
                main_sprite = main_sprite,
            };
            return AnimationJson;
        }
        private static ImageInfo ReadImageInfo(SenBuffer PamFile, int version)
        {
            var name = PamFile.readStringByInt16LE();
            var size = new int[2];
            if (version >= 4)
            {
                for (int i = 0; i < 2; i++)
                {
                    size[i] = PamFile.readInt16LE();
                }
            }
            else
            {
                for (int i = 0; i < 2; i++)
                {
                    size[i] = -1;
                }
            }
            var transform = new double[6];
            if (version == 1)
            {
                double num = PamFile.readInt16LE() / 1000d;
                transform[0] = Math.Cos(num);
                transform[2] = -Math.Sin(num);
                transform[1] = Math.Sin(num);
                transform[3] = Math.Cos(num);
                transform[4] = PamFile.readInt16LE() / 20d;
                transform[5] = PamFile.readInt16LE() / 20d;
            }
            else
            {
                transform[0] = PamFile.readInt32LE() / 1310720d;
                transform[2] = PamFile.readInt32LE() / 1310720d;
                transform[1] = PamFile.readInt32LE() / 1310720d;
                transform[3] = PamFile.readInt32LE() / 1310720d;
                transform[4] = PamFile.readInt16LE() / 20d;
                transform[5] = PamFile.readInt16LE() / 20d;
            }
            return new ImageInfo
            {
                name = name,
                size = size,
                transform = transform
            };
        }

        private static SpriteInfo ReadSpriteInfo(SenBuffer PamFile, int version)
        {
            SpriteInfo sprite = new SpriteInfo();
            if (version >= 4)
            {
                sprite.name = PamFile.readStringByInt16LE();
                if (version >= 6)
                {
                    sprite.description = PamFile.readStringByInt16LE();
                }
                sprite.frame_rate = PamFile.readInt32LE() / 65536d;
            }
            else
            {
                sprite.name = null;
                sprite.frame_rate = -1;
            }
            int framesCount = PamFile.readInt16LE();
            sprite.work_area = new int[2];
            if (version >= 5)
            {
                sprite.work_area[0] = PamFile.readInt16LE();
                sprite.work_area[1] = PamFile.readInt16LE();
            }
            else
            {
                sprite.work_area[0] = 0;
                sprite.work_area[1] = framesCount - 1;
            }
            sprite.work_area[1] = framesCount;
            sprite.frame = new FrameInfo[framesCount];
            for (var i = 0; i < framesCount; i++)
            {
                sprite.frame[i] = ReadFrameInfo(PamFile, version);
            }
            return sprite;
        }

        private static FrameInfo ReadFrameInfo(SenBuffer PamFile, int version)
        {
            FrameInfo frameInfo = new FrameInfo();
            FrameFlags flags = (FrameFlags)PamFile.readUInt8();
            frameInfo.remove = new List<FrameInfo.RemovesInfo>();
            if ((flags & FrameFlags.Removes) != 0)
            {
                int count = PamFile.readUInt8();
                if (count == 255)
                {
                    count = PamFile.readInt16LE();
                }
                for (int i = 0; i < count; i++)
                {
                    frameInfo.remove.Add(new FrameInfo.RemovesInfo().Read(PamFile, version));
                }
            }
            frameInfo.append = new List<FrameInfo.AddsInfo>();
            if ((flags & FrameFlags.Adds) != 0)
            {
                int count = PamFile.readUInt8();
                if (count == 255)
                {
                    count = PamFile.readInt16LE();
                }
                for (int i = 0; i < count; i++)
                {
                    frameInfo.append.Add(new FrameInfo.AddsInfo().Read(PamFile, version));
                }
            }
            frameInfo.change = new List<FrameInfo.MovesInfo>();
            if ((flags & FrameFlags.Moves) != 0)
            {
                int count = PamFile.readUInt8();
                if (count == 255)
                {
                    count = PamFile.readInt16LE();
                }
                for (int i = 0; i < count; i++)
                {
                    frameInfo.change.Add(new FrameInfo.MovesInfo().Read(PamFile, version));
                }
            }
            if ((flags & FrameFlags.FrameName) != 0)
            {
                frameInfo.label = PamFile.readStringByInt16LE();
            }
            if ((flags & FrameFlags.Stop) != 0)
            {
                frameInfo.stop = true;
            }
            frameInfo.command = new List<string[]>();
            if ((flags & FrameFlags.Commands) != 0)
            {
                int num12 = PamFile.readUInt8();
                for (int m = 0; m < num12; m++)
                {
                    frameInfo.command.Add(FrameInfo.ReadCommand(PamFile, version));
                }
            }
            return frameInfo;
        }
        //Encode
        public static SenBuffer Encode(PAMInfo AnimationJson)
        {
            SenBuffer PamBinary = new SenBuffer();
            int version = AnimationJson.version;
            PamBinary.writeUInt32LE(Magic.MagicNumber);
            PamBinary.writeInt32LE(version);
            if (version > 6 || version < 1)
            {
                throw new PAMException("pam_version_out_of_range", "undefined");
            }
            PamBinary.writeUInt8((byte)(AnimationJson.frame_rate));
            if (AnimationJson.position == null || AnimationJson.position.Length < 2)
            {
                PamBinary.writeInt16LE(0);
                PamBinary.writeInt16LE(0);
            }
            else
            {
                PamBinary.writeInt16LE((short)(AnimationJson.position[0] * 20));
                PamBinary.writeInt16LE((short)(AnimationJson.position[1] * 20));
            }
            if (AnimationJson.size == null || AnimationJson.size.Length < 2)
            {
                PamBinary.writeInt16LE(-1);
                PamBinary.writeInt16LE(-1);
            }
            else
            {
                PamBinary.writeInt16LE((short)(AnimationJson.size[0] * 20));
                PamBinary.writeInt16LE((short)(AnimationJson.size[1] * 20));
            }
            if (AnimationJson.image == null || AnimationJson.image.Length == 0)
            {
                PamBinary.writeInt16LE(0);
            }
            else
            {
                int imagesCount = AnimationJson.image.Length;
                PamBinary.writeInt16LE((short)imagesCount);
                for (var i = 0; i < imagesCount; i++)
                {
                    ImageInfo image = AnimationJson.image[i];
                    WriteImageInfo(PamBinary, version, image);
                }
            }
            if (AnimationJson.sprite == null || AnimationJson.sprite.Length == 0)
            {
                PamBinary.writeInt16LE(0);
            }
            else
            {
                int spritesCount = AnimationJson.sprite.Length;
                PamBinary.writeInt16LE((short)spritesCount);
                for (var i = 0; i < spritesCount; i++)
                {
                    SpriteInfo sprite = AnimationJson.sprite[i];
                    WriteSpriteInfo(PamBinary, version, sprite);
                }
            }
            if (version <= 3)
            {
                SpriteInfo mainSprite = AnimationJson.main_sprite ?? new SpriteInfo();
                WriteSpriteInfo(PamBinary, version, mainSprite);
            }
            else
            {
                if (AnimationJson.main_sprite == null)
                {
                    PamBinary.writeBool(false);
                }
                else
                {
                    PamBinary.writeBool(true);
                    WriteSpriteInfo(PamBinary, version, AnimationJson.main_sprite);
                }
            }
            return PamBinary;
        }

        private static void WriteImageInfo(SenBuffer PamBinary, int version, ImageInfo image)
        {
            PamBinary.writeStringByInt16LE(image.name);
            if (version >= 4)
            {
                if (image.size != null && image.size.Length >= 2)
                {
                    for (var i = 0; i < 2; i++)
                    {
                        PamBinary.writeInt16LE((short)image.size[i]);
                    }
                }
            }
            else
            {
                for (var i = 0; i < 2; i++)
                {
                    PamBinary.writeInt16LE(-1);
                }
            }
            if (version == 1)
            {
                if (image.transform == null || image.transform.Length < 2)
                {
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                }
                else if (image.transform.Length >= 6)
                {
                    double Rcos = Math.Acos(image.transform[0]);
                    if (image.transform[1] * (version == 2 ? -1 : 1) < 0)
                    {
                        Rcos = -Rcos;
                    }
                    PamBinary.writeInt16LE((short)Rcos);
                    PamBinary.writeInt16LE((short)(image.transform[4] * 20));
                    PamBinary.writeInt16LE((short)(image.transform[5] * 20));
                }
                else if (image.transform.Length >= 4)
                {
                    double Rcos = Math.Acos(image.transform[0]);
                    if (image.transform[1] * (version == 2 ? -1 : 1) < 0)
                    {
                        Rcos = -Rcos;
                    }
                    PamBinary.writeInt16LE((short)Rcos);
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                }
                else if (image.transform.Length >= 2)
                {
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE((short)(image.transform[0] * 20));
                    PamBinary.writeInt16LE((short)(image.transform[1] * 20));
                }
            }
            else
            {
                if (image.transform == null || image.transform.Length < 2)
                {
                    PamBinary.writeInt32LE(1310720);
                    PamBinary.writeInt32LE(0);
                    PamBinary.writeInt32LE(0);
                    PamBinary.writeInt32LE(1310720);
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                }
                else if (image.transform.Length >= 6)
                {
                    PamBinary.writeInt32LE((int)(image.transform[0] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[2] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[1] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[3] * 1310720));
                    PamBinary.writeInt16LE((short)(image.transform[4] * 20));
                    PamBinary.writeInt16LE((short)(image.transform[5] * 20));
                }
                else if (image.transform.Length >= 4)
                {
                    PamBinary.writeInt32LE((int)(image.transform[0] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[2] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[1] * 1310720));
                    PamBinary.writeInt32LE((int)(image.transform[3] * 1310720));
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                }
                else if (image.transform.Length >= 2)
                {
                    PamBinary.writeInt32LE(1310720);
                    PamBinary.writeInt32LE(0);
                    PamBinary.writeInt32LE(0);
                    PamBinary.writeInt32LE(1310720);
                    PamBinary.writeInt16LE((short)(image.transform[0] * 20));
                    PamBinary.writeInt16LE((short)(image.transform[1] * 20));
                }
            }
        }

        private static void WriteSpriteInfo(SenBuffer PamBinary, int version, SpriteInfo sprite)
        {
            if (version >= 4)
            {
                PamBinary.writeStringByInt16LE(sprite.name);
                if (version >= 6)
                {
                    PamBinary.writeStringByInt16LE(sprite.description);
                }
                PamBinary.writeInt32LE(((int)(sprite.frame_rate * 65536d)));
            }
            if (version >= 5)
            {
                if (sprite.work_area == null || sprite.work_area.Length < 2)
                {
                    PamBinary.writeInt16LE(1);
                    PamBinary.writeInt16LE(0);
                    PamBinary.writeInt16LE(0);
                }
                else
                {
                    PamBinary.writeInt16LE((short)sprite.work_area[1]);
                    PamBinary.writeInt16LE((short)sprite.work_area[0]);
                    PamBinary.writeInt16LE((short)(sprite.work_area[0] + sprite.work_area[1] - 1));
                }
            }
            else
            {
                if (sprite.work_area == null || sprite.work_area.Length < 2)
                {
                    PamBinary.writeInt16LE(1);
                }
                else
                {
                    PamBinary.writeInt16LE((short)sprite.work_area[1]);
                }
            }
            int framesCount = sprite.frame!.Length;
            for (int i = 0; i < framesCount; i++)
            {
                FrameInfo frame = sprite.frame[i];
                WriteFrameInfo(PamBinary, version, frame);
            }
        }
        private static void WriteFrameInfo(SenBuffer PamBinary, int version, FrameInfo frame)
        {
            FrameFlags flags = 0;
            if (frame.remove != null && frame.remove.Count > 0) flags |= FrameFlags.Removes;
            if (frame.append != null && frame.append.Count > 0) flags |= FrameFlags.Adds;
            if (frame.change != null && frame.change.Count > 0) flags |= FrameFlags.Moves;
            if (frame.label != null) flags |= FrameFlags.FrameName;
            if (frame.stop) flags |= FrameFlags.Stop;
            if (frame.command != null && frame.command.Count > 0) flags |= FrameFlags.Commands;
            PamBinary.writeUInt8((byte)flags);
            if ((flags & FrameFlags.Removes) != 0)
            {
                int count = frame.remove!.Count;
                if (count < 255 && count >= 0)
                {
                    PamBinary.writeUInt8((byte)count);
                }
                else
                {
                    PamBinary.writeUInt8(255);
                    PamBinary.writeInt16LE((short)count);
                }
                for (int i = 0; i < count; i++)
                {
                    frame.remove[i].Write(PamBinary, version);
                }
            }
            if ((flags & FrameFlags.Adds) != 0)
            {
                int count = frame.append!.Count;
                if (count < 255 && count >= 0)
                {
                    PamBinary.writeUInt8((byte)count);
                }
                else
                {
                    PamBinary.writeUInt8(255);
                    PamBinary.writeInt16LE((short)count);
                }
                for (int i = 0; i < count; i++)
                {
                    frame.append[i].Write(PamBinary, version);
                }
            }
            if ((flags & FrameFlags.Moves) != 0)
            {
                int count = frame.change!.Count;
                if (count < 255 && count >= 0)
                {
                    PamBinary.writeUInt8((byte)count);
                }
                else
                {
                    PamBinary.writeUInt8(255);
                    PamBinary.writeInt16LE((short)count);
                }
                for (int i = 0; i < count; i++)
                {
                    frame.change[i].Write(PamBinary, version);
                }
            }
            if ((flags & FrameFlags.FrameName) != 0)
            {
                PamBinary.writeStringByInt16LE(frame.label);
            }
            if ((flags & FrameFlags.Stop) != 0)
            {
                //nothing to do
            }
            if ((flags & FrameFlags.Commands) != 0)
            {
                int count = frame.command!.Count;
                if (count > 255) count = 255;
                PamBinary.writeUInt8((byte)count);
                for (int i = 0; i < count; i++)
                {
                    FrameInfo.WriteCommand(PamBinary, version, frame.command[i]);
                }
            }
        }
    }

    public class Model
    {
        public bool? state { get; set; }
        public int index { get; set; }
        public int resource { get; set; }
        public bool sprite { get; set; }
        public int frame_start { get; set; }
        public int frame_duration { get; set; }
        public required double[] color { get; set; }
        public required double[] transform { get; set; }
    }

    public class FlashPackage
    {
        public class Library
        {
            public required XElement[] image { get; set; }
            public required XElement[] sprite { get; set; }
            public required XElement main_sprite { get; set; }
        }
        public required ExtraInfo extra { get; set; }
        public required XElement document { get; set; }
        public required Library library { get; set; }
    }

    public class PrevEnd
    {
        public int flow { get; set; }
        public int command { get; set; }
    }


    public class PAM_Animation
    {
        public const int k_standard_resolution = 1200;

        public const string k_xfl_content = "PROXY-CS5";

        public const string k_xfl_version = "2.971";

        public readonly static XAttribute k_xmlns_attribute = new(XNamespace.Xmlns + "xsi", "http://www.w3.org/2001/XMLSchema-instance");

        public readonly static XNamespace xflns = $"http://ns.adobe.com/xfl/2008/";

        public static readonly double[] k_initial_transform = { 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 };

        public static readonly double[] k_initial_color = { 1.0, 1.0, 1.0, 1.0 };

        public static ExtraInfo Decode(PAMInfo AnimationJson, string outFolder, int resolution, bool splitLabel = true)
        {
            var fs = new FileSystem();
            var path = new ImplementPath();
            fs.CreateDirectory(path.Resolve(path.Join(outFolder, "library", "source")));
            fs.CreateDirectory(path.Resolve(path.Join(outFolder, "library", "image")));
            fs.CreateDirectory(path.Resolve(path.Join(outFolder, "library", "sprite")));
            fs.CreateDirectory(path.Resolve(path.Join(outFolder, "library", "media")));
            var imageLength = AnimationJson.image.Length;
            for (var i = 0; i < imageLength; i++)
            {
                var sourceDocument = WriteSourceDocument(i, AnimationJson.image[i], resolution);
                var imageDocument = WriteImageDocument(i, AnimationJson.image[i]);
                
                SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "library", "source", $"source_{i + 1}.xml")), sourceDocument, xflns);
                SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "library", "image", $"image_{i + 1}.xml")), imageDocument, xflns);
            }
            var spriteLength = AnimationJson.sprite.Length;
            for (var i = 0; i < spriteLength; i++)
            {
                var spriteDocument = WriteSpriteDocument(i, DecodeFrameNodeList(i, AnimationJson.sprite[i], AnimationJson.sprite));
                SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "library", "sprite", $"sprite_{i + 1}.xml")), spriteDocument, xflns);
            }
            SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "library", "main_sprite.xml")), WriteSpriteDocument(-1, DecodeFrameNodeList(-1, AnimationJson.main_sprite, AnimationJson.sprite)), xflns);
            SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "DomDocument.xml")), WriteDomDocument(AnimationJson), xflns);
            fs.WriteText(path.Resolve(path.Join(outFolder, "main.xfl")), k_xfl_content, EncodingType.ASCII);
            var extraInfo = new ExtraInfo()
            {
                version = AnimationJson.version,
                position = AnimationJson.position,
                image = AnimationJson.image.Select((e) => new ExtraImageInfo
                {
                    name = e.name,
                    size = e.size,
                }).ToArray(),
                sprite = AnimationJson.sprite.Select((e) => new ExtraSpriteInfo
                {
                    name = e.name,
                }).ToArray(),
                main_sprite = new()
                {
                    name = AnimationJson.main_sprite.name,
                },
            };
            return extraInfo;
        }

        public static Dictionary<int, List<XElement>> DecodeFrameNodeList(int index, SpriteInfo sprite, SpriteInfo[] sub_sprite)
        {
            Dictionary<int, Model> model = new();
            Dictionary<int, List<XElement>> frame_node_list = new();
            var frameLength = sprite.frame!.Length;
            for (var i = 0; i < frameLength; i++)
            {
                foreach (var remove in sprite.frame[i].remove!)
                {
                    model[remove.index].state = false;
                }
                foreach (var append in sprite.frame[i].append!)
                {
                    model[append.index] = new()
                    {
                        state = null,
                        resource = append.resource,
                        sprite = append.sprite,
                        transform = k_initial_transform,
                        color = k_initial_color,
                        frame_start = i,
                        frame_duration = i,
                    };
                    frame_node_list[append.index] = new();
                    if (i > 0)
                    {
                        frame_node_list[append.index].Add(
                            new XElement("DOMFrame",
                                new XAttribute("index", "0"),
                                new XAttribute("duration", i),
                                new XElement("elements")
                            )
                        );
                    }
                }
                foreach (var change in sprite.frame[i].change!)
                {
                    var layer = model[change.index];
                    layer.state = true;
                    layer.transform = VariantToStandard(change.transform, change.index);
                    if (change.color != null && change.color[0] != 0 && change.color[1] != 0)
                    {
                        layer.color = change.color;
                    }
                }
                foreach (var layer_index in model.Keys)
                {
                    var layer = model[layer_index];
                    var frame_node = frame_node_list[layer_index];
                    if (layer.state != null)
                    {
                        if (frame_node.Count > 0)
                        {
                            (frame_node[frame_node.Count - 1] as XElement).SetAttributeValue("duration", layer.frame_duration);
                        }
                    }
                    if (layer.state == true)
                    {
                        frame_node.Add(
                            new XElement("DOMFrame",
                                new XAttribute("index", i),
                                    new XAttribute("duration", ""),
                                    new XElement("elements",
                                        new XElement("DOMSymbolInstance",
                                            !layer.sprite ?
                                            new XAttribute[]
                                            {
                                                new XAttribute("libraryItemName", $"image/image_{layer.resource + 1}"),
                                                new XAttribute("symbolType", "graphic"),
                                                new XAttribute("loop", "loop"),
                                            }
                                            :
                                            new XAttribute[]
                                            {
                                                new XAttribute("libraryItemName", $"sprite/sprite_{layer.resource + 1}"),
                                                new XAttribute("symbolType", "graphic"),
                                                new XAttribute("loop", "loop"),
                                                new XAttribute("firstFrame", (i - (layer.frame_start)) % (sub_sprite[(layer.resource)].frame!.Length)),
                                            },
                                            new XElement("matrix",
                                                new XElement("Matrix",
                                                    new XAttribute("a", ExchangeFloaterFixed(layer.transform[0])),
                                                    new XAttribute("b", ExchangeFloaterFixed(layer.transform[1])),
                                                    new XAttribute("c", ExchangeFloaterFixed(layer.transform[2])),
                                                    new XAttribute("d", ExchangeFloaterFixed(layer.transform[3])),
                                                    new XAttribute("tx", ExchangeFloaterFixed(layer.transform[4])),
                                                    new XAttribute("ty", ExchangeFloaterFixed(layer.transform[5]))
                                                )
                                            ),
                                            new XElement("color",
                                                new XElement("Color",
                                                    new XAttribute("redMultiplier", ExchangeFloaterFixed(layer.color[0])),
                                                    new XAttribute("greenMultiplier", ExchangeFloaterFixed(layer.color[1])),
                                                    new XAttribute("blueMultiplier", ExchangeFloaterFixed(layer.color[2])),
                                                    new XAttribute("alphaMultiplier", ExchangeFloaterFixed(layer.color[3]))
                                                )
                                            )
                                        )
                                    )
                                )
                            );
                        layer.state = null;
                        layer.frame_duration = 0;
                    }
                    if (layer.state == false)
                    {
                        model.Remove(layer_index);
                    }
                    layer.frame_duration++;
                }
            }
            foreach (var layer_index in model.Keys)
            {
                var layer = model[layer_index];
                var frame_node = frame_node_list[layer_index];
                frame_node[frame_node.Count - 1].SetAttributeValue("duration", layer.frame_duration);
                model.Remove(layer_index);
            }
            return frame_node_list;
        }

        private static XElement WriteSpriteDocument(int index, Dictionary<int, List<XElement>> frame_node_list)
        {
            return new XElement("DOMSymbolItem",
                k_xmlns_attribute,
                new XAttribute("name", index == -1 ? "main_sprite" : $"sprite/sprite_{index + 1}"),
                new XAttribute("symbolType", "graphic"),
                new XElement("timeline",
                    new XElement("DOMTimeline",
                        new XAttribute("name", index == -1 ? "main_sprite" : $"sprite_{index + 1}"),
                        new XElement("layers", frame_node_list.Keys.OrderByDescending(i => i).Select((layer_index) =>
                            new XElement("DOMLayer",
                                new XAttribute("name", layer_index + 1),
                                new XElement("frames", frame_node_list[layer_index].ToArray())
                            )
                        ).ToArray())
                    )
                )
            );
        }

        private static XElement WriteDomDocument(PAMInfo AnimationJson)
        {
            PrevEnd prev_end = new()
            {
                flow = -1,
                command = -1
            };
            List<XElement> flow_node = new();
            List<XElement> command_node = new();
            AnimationJson.main_sprite.frame!.Select((frame, frame_index) =>
            {
                if (frame.label != null || frame.stop)
                {
                    if (prev_end.flow + 1 < frame_index)
                    {
                        flow_node.Add(new XElement("DOMFrame",
                                        new XAttribute("index", prev_end.flow + 1),
                                        new XAttribute("duration", frame_index - (prev_end.flow + 1)),
                                        new XElement("elements")
                                    ));
                    }
                    var node = new XElement("DOMFrame",
                        new XAttribute("index", frame_index),
                        new XElement("elements")
                    );
                    var node_element = node;
                    if (frame.label != null)
                    {
                        node_element.SetAttributeValue("name", frame.label);
                        node_element.SetAttributeValue("labelType", "name");
                    }
                    if (frame.stop)
                    {
                        node_element.AddFirst(new XElement("Actionscript",
                            new XElement("script",
                                new XCData("stop();")
                                            )
                                        ));
                    }
                    flow_node.Add(node);
                    prev_end.flow = frame_index;
                }
                if (frame.command!.Count > 0)
                {
                    if (prev_end.command + 1 < frame_index)
                    {
                        command_node.Add(new XElement("DOMFrame",
                        new XAttribute("index", prev_end.command + 1),
                                        new XAttribute("duration", frame_index - (prev_end.command + 1))
                                    ));
                    }
                    command_node.Add(new XElement("DOMFrame",
                        new XAttribute("index", frame_index),
                                    new XElement("Actionscript",
                                        new XElement("script",
                                            new XCData(string.Join("\n", frame.command.Select((e) => $"fscommand(\"{e[0]}\", \"{e[1]}\");")))
                                        )
                                    )
                                ));
                    prev_end.command = frame_index;
                }
                return string.Empty;
            }).ToArray();
            if (prev_end.flow + 1 < AnimationJson.main_sprite.frame!.Length)
            {
                flow_node.Add(new XElement("DOMFrame",
                new XAttribute("index", prev_end.flow + 1),
                            new XAttribute("duration", AnimationJson.main_sprite.frame.Length - (prev_end.flow + 1))
                        ));
            }
            if (prev_end.command + 1 < AnimationJson.main_sprite.frame.Length)
            {
                command_node.Add(new XElement("DOMFrame",
                new XAttribute("index", prev_end.command + 1),
                            new XAttribute("duration", AnimationJson.main_sprite.frame.Length - (prev_end.command + 1))
                        ));
            }
            return new XElement("DOMDocument",
                k_xmlns_attribute,
                new XAttribute("frameRate", AnimationJson.main_sprite.frame_rate),
                new XAttribute("width", AnimationJson.size[0]),
                new XAttribute("height", AnimationJson.size[1]),
                new XAttribute("xflVersion", k_xfl_version),
                new XElement("folders",
                    new[] { "media", "source", "image", "sprite" }.Select((e) => new XElement("DOMFolderItem",
                        new XAttribute("name", e),
                        new XAttribute("isExpanded", "true")
                    )).ToArray()
                ),
                new XElement("media", AnimationJson.image.Select((e) =>
                    new XElement("DOMBitmapItem",
                    new XAttribute("name", $"media/{e.name.Split("|")[0]}"),
                    new XAttribute("href", $"media/{e.name.Split("|")[0]}.png")
                )).ToArray()
                ),
                new XElement("symbols",
                    AnimationJson.image.Select((e, i) =>
                        new XElement("Include",
                            new XAttribute("href", $"source/source_{i + 1}.xml")
                        )
                    ).ToArray(),
                    AnimationJson.image.Select((e, i) =>
                        new XElement("Include",
                            new XAttribute("href", $"image/image_{i + 1}.xml")
                        )
                    ).ToArray(),
                    AnimationJson.sprite.Select((e, i) =>
                        new XElement("Include",
                            new XAttribute("href", $"sprite/sprite_{i + 1}.xml")
                        )
                    ).ToArray(),
                    new XElement("Include",
                        new XAttribute("href", "main_sprite.xml")
                    )
                ),
                new XElement("timelines",
                    new XElement("DOMTimeline",
                        new XAttribute("name", "animation"),
                        new XElement("layers",
                            new XElement("DOMLayer",
                                new XAttribute("name", "flow"),
                                new XElement("frames", flow_node)
                            ),
                            new XElement("DOMLayer",
                                new XAttribute("name", "command"),
                                new XElement("frames", command_node)
                            ),
                            new XElement("DOMLayer",
                                new XAttribute("name", "sprite"),
                                new XElement("frames",
                                    new XElement("DOMFrame",
                                        new XAttribute("index", "0"),
                                        new XAttribute("duration", AnimationJson.main_sprite.frame.Length),
                                        new XElement("elements",
                                            new XElement("DOMSymbolInstance",
                                                new XAttribute("libraryItemName", "main_sprite"),
                                                new XAttribute("symbolType", "graphic"),
                                                new XAttribute("loop", "loop")
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }

        public static XElement WriteSourceDocument(int index, ImageInfo image, int resolution)
        {
            var sourceDocument = new XElement("DOMSymbolItem",
                k_xmlns_attribute,
                new XAttribute("name", $"source/source_{index + 1}"),
                new XAttribute("symbolType", "graphic"),
                new XElement("timeline",
                    new XElement("DOMTimeline",
                        new XAttribute("name", $"source_{index + 1}"),
                        new XElement("layers",
                            new XElement("DOMLayer",
                                new XElement("frames",
                                    new XElement("DOMFrame",
                                        new XAttribute("index", "0"),
                                        new XElement("elements",
                                            new XElement("DOMBitmapInstance",
                                                new XAttribute("libraryItemName", $"media/{image.name.Split("|")[0]}"),
                                                new XElement("matrix",
                                                    new XElement("Matrix", ScaleMatrix(resolution))
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
            return sourceDocument;
        }
        public static XElement WriteImageDocument(int index, ImageInfo image)
        {
            var imageDocument = new XElement("DOMSymbolItem",
                k_xmlns_attribute,
                new XAttribute("name", $"image/image_{index + 1}"),
                new XAttribute("symbolType", "graphic"),
                new XElement("timeline",
                    new XElement("DOMTimeline",
                        new XAttribute("name", $"image_{index + 1}"),
                        new XElement("layers",
                            new XElement("DOMLayer",
                                new XElement("frames",
                                    new XElement("DOMFrame",
                                        new XAttribute("index", "0"),
                                        new XElement("elements",
                                            new XElement("DOMSymbolInstance",
                                                new XAttribute("libraryItemName", $"source/source_{index + 1}"),
                                                new XAttribute("symbolType", "graphic"),
                                                new XAttribute("loop", "loop"),
                                             new XElement("matrix",
                                                    new XElement("Matrix",
                                                        new XAttribute("a", ExchangeFloaterFixed(image.transform[0])),
                                                        new XAttribute("b", ExchangeFloaterFixed(image.transform[1])),
                                                        new XAttribute("c", ExchangeFloaterFixed(image.transform[2])),
                                                        new XAttribute("d", ExchangeFloaterFixed(image.transform[3])),
                                                        new XAttribute("tx", ExchangeFloaterFixed(image.transform[4])),
                                                        new XAttribute("ty", ExchangeFloaterFixed(image.transform[5]))
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
            return imageDocument;
        }

        public static string ExchangeFloaterFixed(double num) {
            return num.ToString("F6", System.Globalization.CultureInfo.InvariantCulture);
        }

        private static double[] VariantToStandard(double[] transform, int index)
        {
            if (transform.Length == 2)
            {

                return new double[] {
                    1.0, 0.0, 0.0, 1.0,
                    transform[0],
                    transform[1]
                };
            }
            else if (transform.Length == 6)
            {

                return (double[])transform.Clone();
            }
            else if (transform.Length == 3)
            {
                double cos_value = Math.Cos(transform[0]);
                double sin_value = Math.Sin(transform[0]);
                return new double[] {
                    cos_value,
                    sin_value,
                    -sin_value,
                    cos_value,
                    transform[1],
                    transform[2],
                };
            }
            else
            {
                throw new PAMException("invalid_transform_size", "undefined");
            }
        }

        private static XAttribute[] ScaleMatrix(int resolution)
        {
            double scale = (double)(k_standard_resolution) / resolution;
            return new XAttribute[] {
                new XAttribute("a", ExchangeFloaterFixed(scale)),
                new XAttribute("d", ExchangeFloaterFixed(scale))
            };
        }

        public static PAMInfo Encode(string inFolder, ExtraInfo extra)
        {
            var json = new JsonImplement();
            var fs = new FileSystem();
            var path = new ImplementPath();
            XElement document = SenBuffer.ReadXml(path.Resolve(path.Join(inFolder, "DomDocument.xml")));
            FlashPackage PAMRipe = new FlashPackage
            {
                extra = extra,
                document = document,
                library = new FlashPackage.Library
                {
                    image = extra.image!.Select((e, i) => (SenBuffer.ReadXml(path.Resolve(path.Join(inFolder, "library", "image", $"image_{i + 1}.xml"))))).ToArray(),
                    sprite = extra.sprite!.Select((e, i) => (SenBuffer.ReadXml(path.Resolve(path.Join(inFolder, "library", "sprite", $"sprite_{i + 1}.xml"))))).ToArray(),
                    main_sprite = SenBuffer.ReadXml(path.Resolve(path.Join(inFolder, "library", "main_sprite.xml")))
                }
            };
            PAMInfo AnimationJson = ParseMainDocument(PAMRipe);
            return AnimationJson;
        }

        private static PAMInfo ParseMainDocument(FlashPackage PAMRipe)
        {
            XElement x_DOMDocument = PAMRipe.document;
            if (x_DOMDocument.Name.LocalName != "DOMDocument")
            {
                throw new PAMException("invalid_domdocument", x_DOMDocument.Name.LocalName);
            }
            {
                var x_media_list = x_DOMDocument.Elements("media").ToArray();
                if (x_media_list.Length != 1)
                {
                    throw new PAMException("invalid_domdocument_media_length", $"Media length: {x_media_list.Length}");
                }
                var x_media = x_media_list[0];
                var x_DOMBitmapItem_list = x_media.Elements("DOMBitmapItem").ToArray();
            }
            {
                var x_symbols_list = x_DOMDocument.Elements("symbols").ToArray();
                if (x_symbols_list.Length != 1)
                {
                    throw new PAMException("invalid_domdocument_symbols_length", $"Symbols length: {x_symbols_list.Length}");
                }
                var x_symbols = x_symbols_list[0];
                var x_Include_list = x_symbols.Elements("Include").ToArray();
            }
            var main_sprite_frame = ParseSpriteDocument(PAMRipe.library.main_sprite, -1);
            var lastFrame = main_sprite_frame.Length;
            {
                var x_timelines_list = x_DOMDocument.Elements("timelines").ToArray();
                if (x_timelines_list.Length != 1)
                {
                    throw new PAMException("invalid_domdocument_timelines_length", $"Timelines length: {x_timelines_list.Length}");
                }
                var x_timelines = x_timelines_list[0];
                var x_DOMTimeline_list = x_timelines.Elements("DOMTimeline").ToArray();
                if (x_DOMTimeline_list.Length != 1)
                {
                    throw new PAMException("invalid_domtimeline_length", $"DOMTimeline length: {x_DOMTimeline_list.Length}");
                }
                var x_DOMTimeline = x_DOMTimeline_list[0];
                if (((string)x_DOMTimeline.Attribute("name")!) != "animation")
                {
                    throw new PAMException("invalid_domtimeline_name", (string)x_DOMTimeline.Attribute("name")!);
                }
                var x_layers_list = x_DOMTimeline.Elements("layers").ToArray();
                if (x_layers_list.Length != 1)
                {
                    throw new PAMException("invalid_domtimeline_layers_length", $"Layers length: {x_layers_list.Length}");
                }
                var x_layers = x_layers_list[0];
                var x_DOMLayer_list = x_layers.Elements("DOMLayer").ToArray();
                if (x_DOMLayer_list.Length != 3)
                {
                    throw new PAMException("invalid_domlayer_length", $"DOMLayer length: {x_DOMLayer_list.Length}");
                }
                {
                    var x_DOMLayer_flow = x_DOMLayer_list[0];
                    var x_frames_list = x_DOMLayer_flow.Elements("frames").ToArray();
                    if (x_frames_list.Length != 1)
                    {
                        throw new PAMException("invalid_domlayer_frames_length", $"Frames length: {x_frames_list.Length}");
                    }
                    var x_frames = x_frames_list[0];
                    var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToList();
                    x_DOMFrame_list.ForEach((x_DOMFrame) =>
                    {
                        int frame_index = int.Parse(x_DOMFrame.Attribute("index")!.Value);
                        if (x_DOMFrame.Attribute("name") != null)
                        {
                            if (((string)x_DOMFrame.Attribute("labelType")!) != "name")
                            {
                                throw new PAMException("invalid_domframe_name", (string)x_DOMFrame.Attribute("labelType")!);
                            }
                            main_sprite_frame[frame_index].label = ((string)x_DOMFrame.Attribute("name")!);
                        }
                        var x_Actionscript_list = x_DOMFrame.Elements("Actionscript").ToArray();
                        if (x_Actionscript_list.Length == 0)
                        {
                            return;
                        }
                        if (x_Actionscript_list.Length != 1)
                        {
                            throw new PAMException("invalid_domframe_actionscript_length", $"Actionscript length: {x_Actionscript_list.Length}");
                        }
                        var x_Actionscript = x_Actionscript_list[0];
                        if (x_Actionscript.Elements().Count() != 1)
                        {
                            throw new PAMException("invalid_actionscript_length", $"Actionscript length: {x_Actionscript.Elements().Count()}");
                        }
                        var x_script_list = x_Actionscript.Elements("script").ToArray();
                        if (x_script_list.Length != 1)
                        {
                            throw new PAMException("invalid_actionscript_script", $"Script length: {x_script_list.Length}");
                        }
                        var x_script = x_script_list[0];
                        if (x_script.Nodes().Count() != 1)
                        {
                            throw new PAMException("invalid_script_length", $"Actionscript length: {x_script.Nodes().Count()}");
                        }
                        var x_script_text = x_script.FirstNode;
                        if (x_script_text!.NodeType != XmlNodeType.CDATA)
                        {
                            throw new PAMException("invalid_script_cdata", "undefined");
                        }
                        if (((XCData)x_script_text).Value.Trim() != "stop();")
                        {
                            throw new PAMException("invalid_script_cdata_value", ((XCData)x_script_text).Value.Trim());
                        }
                        if (frame_index < lastFrame)
                        {
                            main_sprite_frame[frame_index].stop = true;
                        }
                        else if (frame_index >= lastFrame)
                        {
                            main_sprite_frame[lastFrame - 1].stop = true;
                        }
                    });
                }
                {
                    var x_DOMLayer_command = x_DOMLayer_list[1];
                    var x_frames_list = x_DOMLayer_command.Elements("frames").ToArray();
                    if (x_frames_list.Length != 1)
                    {
                        throw new PAMException("invalid_domlayer_frames_length", $"Frames length: {x_frames_list.Length}");
                    }
                    var x_frames = x_frames_list[0];
                    var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToList();
                    x_DOMFrame_list.ForEach((x_DOMFrame) =>
                    {
                        int frame_index = int.Parse(x_DOMFrame.Attribute("index")!.Value);
                        var x_Actionscript_list = x_DOMFrame.Elements("Actionscript").ToArray();
                        if (x_Actionscript_list.Length == 0)
                        {
                            return;
                        }
                        if (x_Actionscript_list.Length != 1)
                        {
                            throw new PAMException("invalid_domframe_actionscript_length", $"Actionscript length: {x_Actionscript_list.Length}");
                        }
                        var x_Actionscript = x_Actionscript_list[0];
                        if (x_Actionscript.Elements().Count() != 1)
                        {
                            throw new PAMException("invalid_actionscript_elements_length", $"Actionscript elements length: {x_Actionscript.Elements().Count()}");
                        }
                        var x_script_list = x_Actionscript.Elements("script").ToArray();
                        if (x_script_list.Length != 1)
                        {
                            throw new PAMException("invalid_domframe_script_length", $"Script length: {x_script_list.Length}");
                        }
                        var x_script = x_script_list[0];
                        if (x_script.Nodes().Count() != 1)
                        {
                            throw new PAMException("invalid_domframe_script_node_length", $"Script nodes length: {x_script.Nodes().Count()}");
                        }
                        var x_script_text = x_script.FirstNode;
                        if (x_script_text!.NodeType != XmlNodeType.CDATA)
                        {
                            throw new PAMException("invalid_domframe_cdata", "undefined");
                        }
                        var command_string = ((XCData)x_script_text).Value.Trim().Split("\n");
                        foreach (var e in command_string)
                        {
                            var regex_result = Regex.Matches(e.Trim(), "fscommand\\(\"(.*)\", \"(.*)\"\\);").First();
                            if (regex_result == null)
                            {
                                throw new PAMException("invalid_command_string", "undefined");
                            }
                            main_sprite_frame[frame_index].command!.Add(new string[2] { regex_result.Groups[1].Value, regex_result.Groups[2].Value });
                        }
                    });
                }
                {
                    var x_DOMLayer_sprite = x_DOMLayer_list[2];
                }
            }
            int frame_rate = int.Parse(x_DOMDocument.Attribute("frameRate")!.Value);
            int width = int.Parse(x_DOMDocument.Attribute("width")!.Value);
            int height = int.Parse(x_DOMDocument.Attribute("height")!.Value);
            PAMInfo PamInfo = new PAMInfo
            {
                version = PAMRipe.extra.version,
                frame_rate = frame_rate,
                position = PAMRipe.extra.position,
                size = new double[] { width, height },
                image = PAMRipe.extra.image!.Select((e, i) => new ImageInfo { name = e.name!, size = e.size, transform = ParseImageDocument(PAMRipe.library.image[i], i) }).ToArray(),
                sprite = PAMRipe.extra.sprite!.Select((e, i) =>
                {
                    var frame = ParseSpriteDocument(PAMRipe.library.sprite[i], i);
                    return new SpriteInfo { name = e.name, frame_rate = frame_rate, work_area = new int[] { 0, frame.Length }, frame = frame };
                }).ToArray(),
                main_sprite = new() { name = PAMRipe.extra.main_sprite!.name, frame_rate = frame_rate, work_area = new int[] { 0, main_sprite_frame.Length }, frame = main_sprite_frame },
            };
            return PamInfo;
        }

        private static FrameInfo[] ParseSpriteDocument(XElement x_DOMSymbolItem, int index)
        {
            Model? model = null;
            List<FrameInfo> result = new();
            if (x_DOMSymbolItem.Name.LocalName != "DOMSymbolItem")
            {
                throw new PAMException("invalid_sprite_domsymbolitem", x_DOMSymbolItem.Name.LocalName);
            }
            if ((string)x_DOMSymbolItem.Attribute("name")! != (index == -1 ? "main_sprite" : $"sprite/sprite_{index + 1}"))
            {
                throw new PAMException("invalid_sprite_domsymbolitem_name", (string)x_DOMSymbolItem.Attribute("name")!);
            }
            var x_timeline_list = x_DOMSymbolItem.Elements("timeline").ToArray();
            if (x_timeline_list.Length != 1)
            {
                throw new PAMException("invalid_sprite_domsymbolitem_timeline_length", $"Timeline length: {x_timeline_list.Length}");
            }
            var x_timeline = x_timeline_list[0];
            var x_DOMTimeline_list = x_timeline.Elements("DOMTimeline").ToArray();
            if (x_DOMTimeline_list.Length != 1)
            {
                throw new PAMException("invalid_sprite_domtimeline_length", $"DOMTimeline length: {x_DOMTimeline_list.Length}");
            }
            var x_DOMTimeline = x_DOMTimeline_list[0];
            if ((string)x_DOMTimeline.Attribute("name")! != (index == -1 ? "main_sprite" : $"sprite_{index + 1}"))
            {
                throw new PAMException("invalid_sprite_domtimeline_name", (string)x_DOMTimeline.Attribute("name")!);
            }
            var x_layers_list = x_DOMTimeline.Elements("layers").ToArray();
            if (x_layers_list.Length != 1)
            {
                throw new PAMException("invalid_sprite_domtimeline_layers_length", $"Layers length: {x_layers_list.Length}");
            }
            var x_layers = x_layers_list[0];
            var x_DOMLayer_list = x_layers.Elements("DOMLayer").ToList();
            x_DOMLayer_list.Reverse();
            int layer_count = 0;
            var get_frame_at = (int index) =>
            {
                if (result.Count <= index)
                {
                    result.AddRange(new FrameInfo[index - result.Count + 1]);
                }
                if (result[index] == null)
                {
                    result[index] = new()
                    {
                        label = null,
                        stop = false,
                        command = new(),
                        remove = new(),
                        append = new(),
                        change = new(),
                    };
                }
                return result[index];
            };
            x_DOMLayer_list.ForEach((x_DOMLayer) =>
            {
                var x_frames_list = x_DOMLayer.Elements("frames").ToArray();
                if (x_frames_list.Length != 1)
                {
                    throw new PAMException("invalid_sprite_domtimeline_frames_length", $"Frames length: {x_frames_list.Length}");
                }
                var x_frames = x_frames_list[0];
                var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToList();
                var colse_current_model_if_need = () =>
                {
                    if (model != null)
                    {
                        var target_frame = get_frame_at(model.frame_start + model.frame_duration);
                        target_frame.remove!.Add(new FrameInfo.RemovesInfo
                        {
                            index = model.index,
                        });
                        model = null;
                    }
                };
                x_DOMFrame_list.ForEach((x_DOMFrame) =>
                {
                    int frame_index = (int)x_DOMFrame.Attribute("index")!;
                    int frame_duration = int.Parse((string)x_DOMFrame.Attribute("duration")! ?? "1");
                    double[] transform;
                    double[] color;
                    var x_elements_list = x_DOMFrame.Elements("elements").ToArray();
                    if (x_elements_list.Length == 0)
                    {
                        colse_current_model_if_need();
                        return;
                    }
                    if (x_elements_list.Length != 1)
                    {
                        throw new PAMException("invalid_sprite_domframe_elements_length", $"Elements length: {x_elements_list.Length}");
                    }
                    var x_elements = x_elements_list[0];
                    var x_DOMSymbolInstance_list = x_elements.Elements("DOMSymbolInstance").ToArray();
                    if (x_DOMSymbolInstance_list.Length == 0)
                    {
                        return;
                    }
                    if (x_DOMSymbolInstance_list.Length != 1)
                    {
                        throw new PAMException("invalid_sprite_dom_symbol_instance_length", $"DOMSymbolInstance length: {x_DOMSymbolInstance_list.Length}");
                    }
                    var x_DOMSymbolInstance = x_DOMSymbolInstance_list[0];
                    var name_match = Regex.Matches((string)x_DOMSymbolInstance.Attribute("libraryItemName")!, "(image|sprite)/(image|sprite)_([0-9]+)").First();
                    if (name_match == null)
                    {
                        throw new PAMException("invalid_dom_symbol_instance", "undefined");
                    }
                    if (name_match.Groups[1].Value != name_match.Groups[2].Value)
                    {
                        throw new PAMException("invalid_sprite_dom_symbol_instance_x", "undefined");
                    }
                    FrameInfo.AddsInfo current_instance = new()
                    {
                        resource = int.Parse(name_match.Groups[3].Value) - 1,
                        sprite = name_match.Groups[1].Value == "sprite"
                    };
                    {
                        var x_matrix_list = x_DOMSymbolInstance.Elements("matrix").ToArray();
                        if (x_matrix_list.Length == 0)
                        {
                            transform = new double[] { 0.0, 0.0 };
                        }
                        else if (x_matrix_list.Length == 1)
                        {
                            var x_matrix = x_matrix_list[0];
                            var x_Matrix_list = x_matrix.Elements("Matrix").ToArray();
                            if (x_Matrix_list.Length != 1)
                            {
                                throw new PAMException("invalid_sprite_matrix_length", $"Matrix length: {x_Matrix_list.Length}");
                            }
                            var x_Matrix = x_Matrix_list[0];
                            transform = StandardToVariant(ParseTransform(x_Matrix));
                        }
                        else
                        {
                            throw new PAMException("invalid_sprite_dom_symbol_instance_matrix_length", $"Matrix length: {x_matrix_list.Length}");
                        }
                    }
                    {
                        var x_color_list = x_DOMSymbolInstance.Elements("color").ToArray();
                        if (x_color_list.Length == 0)
                        {
                            color = (double[])k_initial_color.Clone();
                        }
                        else if (x_color_list.Length == 1)
                        {
                            var x_color = x_color_list[0];
                            var x_Color_list = x_color.Elements("Color").ToArray();
                            if (x_Color_list.Length != 1)
                            {
                                throw new PAMException("invalid_sprite_color_length", $"Color length: {x_Color_list.Length}");
                            }
                            var x_Color = x_Color_list[0];
                            color = ParseColor(x_Color);
                        }
                        else
                        {
                            throw new PAMException("invalid_sprite_dom_symbol_instance_color_length", $"Color length: {x_color_list.Length}");
                        }
                    }
                    var target_frame = get_frame_at(frame_index);
                    if (model == null)
                    {
                        model = new()
                        {
                            index = layer_count,
                            resource = current_instance.resource,
                            sprite = current_instance.sprite,
                            frame_start = frame_index,
                            frame_duration = frame_duration,
                            color = (double[])k_initial_color.Clone(),
                            transform = new double[2],
                        };
                        target_frame.append!.Add(new FrameInfo.AddsInfo
                        {
                            index = model.index,
                            name = null,
                            resource = current_instance.resource,
                            sprite = current_instance.sprite,
                        });
                        ++layer_count;
                    }
                    else
                    {
                        if (current_instance.resource != model.resource || current_instance.sprite != model.sprite)
                        {
                            throw new PAMException("invalid_sprite_dom_resource", "undefined");
                        }
                    }
                    model.frame_start = frame_index;
                    model.frame_duration = frame_duration;
                    bool color_is_changed = !(model.color[0] == color[0] && model.color[1] == color[1] && model.color[2] == color[2] && model.color[3] == color[3]);
                    if (color_is_changed)
                    {
                        model.color = color;
                    }
                    target_frame.change!.Add(new FrameInfo.MovesInfo
                    {
                        index = model.index,
                        transform = transform,
                        color = color_is_changed ? color : null,
                    });
                });
                colse_current_model_if_need();
            });
            for (int i = 0; i < result.Count; ++i)
            {
                if (result[i] == null)
                {
                    result[i] = new()
                    {
                        label = null,
                        stop = false,
                        command = new(),
                        remove = new(),
                        append = new(),
                        change = new(),
                    };
                }
            }
            return result.Take(result.Count - 1).ToArray();
        }

        private static double[] ParseImageDocument(XElement x_DOMSymbolItem, int index)
        {

            if (x_DOMSymbolItem.Name.LocalName != "DOMSymbolItem")
            {
                throw new PAMException("invalid_image_domsymbolitem", x_DOMSymbolItem.Name.LocalName);
            }
            if ((string)x_DOMSymbolItem.Attribute("name")! != $"image/image_{index + 1}")
            {
                throw new PAMException("invalid_image_domsymbolitem_name", (string)x_DOMSymbolItem.Attribute("name")!);
            }
            var x_timeline_list = x_DOMSymbolItem.Elements("timeline").ToArray();
            if (x_timeline_list.Length != 1)
            {
                throw new PAMException("invalid_image_domsymbolitem_timeline_length", $"Timeline length: {x_timeline_list.Length}");
            }
            var x_timeline = x_timeline_list[0];
            var x_DOMTimeline_list = x_timeline.Elements("DOMTimeline").ToArray();
            if (x_DOMTimeline_list.Length != 1)
            {
                throw new PAMException("invalid_image_domtimeline_length", $"Color length: {x_DOMTimeline_list.Length}");
            }
            var x_DOMTimeline = x_DOMTimeline_list[0];
            if ((string)x_DOMTimeline.Attribute("name")! != $"image_{index + 1}")
            {
                throw new PAMException("invalid_image_domtimeline_name", (string)x_DOMTimeline.Attribute("name")!);
            }
            var x_layers_list = x_DOMTimeline.Elements("layers").ToArray();
            if (x_layers_list.Length != 1)
            {
                throw new PAMException("invalid_image_domtimeline_layers_length", $"Layers length: {x_layers_list.Length}");
            }
            var x_layers = x_layers_list[0];
            var x_DOMLayer_list = x_layers.Elements("DOMLayer").ToArray();
            if (x_DOMLayer_list.Length != 1)
            {
                throw new PAMException("invalid_image_domlayer_length", $"DOMLayer length: {x_DOMLayer_list.Length}");
            }
            var x_DOMLayer = x_DOMLayer_list[0];
            var x_frames_list = x_DOMLayer.Elements("frames").ToArray();
            if (x_frames_list.Length != 1)
            {
                throw new PAMException("invalid_image_domlayer_frames_length", $"Frames length: {x_frames_list.Length}");
            }
            var x_frames = x_frames_list[0];
            var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToArray();
            if (x_DOMFrame_list.Length != 1)
            {
                throw new PAMException("invalid_image_domframe_length", $"DOMFrame length: {x_DOMFrame_list.Length}");
            }
            var x_DOMFrame = x_DOMFrame_list[0];
            var x_elements_list = x_DOMFrame.Elements("elements").ToArray();
            if (x_elements_list.Length != 1)
            {
                throw new PAMException("invalid_image_domframe_elements_length", $"Elements length: {x_elements_list.Length}");
            }
            var x_elements = x_elements_list[0];
            var x_DOMSymbolInstance_list = x_elements.Elements("DOMSymbolInstance").ToArray();
            if (x_DOMSymbolInstance_list.Length != 1)
            {
                throw new PAMException("invalid_image_dom_symbol_instance_length", $"DOMSymbolInstance length: {x_DOMSymbolInstance_list.Length}");
            }
            var x_DOMSymbolInstance = x_DOMSymbolInstance_list[0];
            if ((string)x_DOMSymbolInstance.Attribute("libraryItemName")! != $"source/source_{index + 1}")
            {
                throw new PAMException("invalid_image_dom_symbol_instance_name", (string)x_DOMSymbolInstance.Attribute("libraryItemName")!);
            }
            var x_matrix_list = x_DOMSymbolInstance.Elements("matrix").ToArray();
            if (x_matrix_list.Length != 1)
            {
                throw new PAMException("invalid_image_dom_symbol_instance_matrix_length", $"Matrix length: {x_matrix_list.Length}");
            }
            var x_matrix = x_matrix_list[0];
            var x_Matrix_list = x_matrix.Elements("Matrix").ToArray();
            if (x_Matrix_list.Length != 1)
            {
                throw new PAMException("invalid_image_matrix_length", $"Matrix length: {x_Matrix_list.Length}");
            }
            var x_Matrix = x_Matrix_list[0];
            double[] transform = ParseTransform(x_Matrix);
            return transform;
        }

        private static string ParseSourceDocument(XElement x_DOMSymbolItem, int index)
        {
            if (x_DOMSymbolItem.Name.LocalName != "DOMSymbolItem")
            {
                throw new PAMException("invalid_source_domsymbolitem", x_DOMSymbolItem.Name.LocalName);
            }
            if ((string)x_DOMSymbolItem.Attribute("name")! != $"source/source_{index + 1}")
            {
                throw new PAMException("invalid_source_domsymbolitem_name", (string)x_DOMSymbolItem.Attribute("name")!);
            }
            var x_timeline_list = x_DOMSymbolItem.Elements("timeline").ToArray();
            if (x_timeline_list.Length != 1)
            {
                throw new PAMException("invalid_source_domsymbolitem_timeline_length", $"Timeline length: {x_timeline_list.Length}");
            }
            var x_timeline = x_timeline_list[0];
            var x_DOMTimeline_list = x_timeline.Elements("DOMTimeline").ToArray();
            if (x_DOMTimeline_list.Length != 1)
            {
                throw new PAMException("invalid_source_domtimeline_length", $"Color length: {x_DOMTimeline_list.Length}");
            }
            var x_DOMTimeline = x_DOMTimeline_list[0];
            if ((string)x_DOMTimeline.Attribute("name")! != $"source_{index + 1}")
            {
                throw new PAMException("invalid_source_domtimeline_name", (string)x_DOMTimeline.Attribute("name")!);
            }
            var x_layers_list = x_DOMTimeline.Elements("layers").ToArray();
            if (x_layers_list.Length != 1)
            {
                throw new PAMException("invalid_source_domtimeline_layers_length", $"Layers length: {x_layers_list.Length}");
            }
            var x_layers = x_layers_list[0];
            var x_DOMLayer_list = x_layers.Elements("DOMLayer").ToArray();
            if (x_DOMLayer_list.Length != 1)
            {
                throw new PAMException("invalid_source_domlayer_length", $"DOMLayer length: {x_DOMLayer_list.Length}");
            }
            var x_DOMLayer = x_DOMLayer_list[0];
            var x_frames_list = x_DOMLayer.Elements("frames").ToArray();
            if (x_frames_list.Length != 1)
            {
                throw new PAMException("invalid_source_domtimeline_frames_length", $"Frames length: {x_frames_list.Length}");
            }
            var x_frames = x_frames_list[0];
            var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToArray();
            if (x_DOMFrame_list.Length != 1)
            {
                throw new PAMException("invalid_source_domframe_length", $"DOMFrame length: {x_DOMFrame_list.Length}");
            }
            var x_DOMFrame = x_DOMFrame_list[0];
            var x_elements_list = x_DOMFrame.Elements("elements").ToArray();
            if (x_elements_list.Length != 1)
            {
                throw new PAMException("invalid_source_domframe_elements_length", $"Elements length: {x_elements_list.Length}");
            }
            var x_elements = x_elements_list[0];
            var x_DOMBitmapInstance_list = x_elements.Elements("DOMBitmapInstance").ToArray();
            if (x_DOMBitmapInstance_list.Length != 1)
            {
                throw new PAMException("invalid_source_dom_bitmap_instance_length", $"DOMBitmapInstance length: {x_DOMBitmapInstance_list.Length}");
            }
            var x_DOMBitmapInstance = x_DOMBitmapInstance_list[0];
            var imageName = ((string)x_DOMBitmapInstance.Attribute("libraryItemName")!);
            if (!imageName.Contains("media"))
            {
                throw new PAMException("invalid_source_dom_bitmap_instance_name", imageName);
            }
            return imageName.Substring(6);
        }

        public static double[] StandardToVariant(double[] data)
        {
            if (data[0] == data[3] && data[1] == -data[2])
            {
                if (data[0] == 1.0 && data[1] == 0.0)
                {
                    return new double[] { data[4], data[5] };
                }
                double acos_value = Math.Acos(data[0]);
                double asin_value = Math.Asin(data[1]);
                if (Math.Abs(Math.Abs(acos_value) - Math.Abs(asin_value)) <= 1e-2)
                {
                    return new double[] { asin_value, data[4], data[5] };
                }
            }
            return (double[])data.Clone();
        }

        private static double[] ParseTransformOriginal(XElement x_Matrix)
        {
            return new double[] {
                double.Parse((string?)x_Matrix!.Attribute("x") ?? "0"),
                double.Parse((string?)x_Matrix!.Attribute("y") ?? "0"),
            };
        }

        public static double[] ParseTransform(XElement x_Matrix)
        {
            return new double[] {
                double.Parse((string?)x_Matrix!.Attribute("a") ?? "1"),
                double.Parse((string?)x_Matrix!.Attribute("b") ?? "0"),
                double.Parse((string?)x_Matrix!.Attribute("c") ?? "0"),
                double.Parse((string?)x_Matrix!.Attribute("d") ?? "1"),
                double.Parse((string?)x_Matrix!.Attribute("tx") ?? "0"),
                double.Parse((string?)x_Matrix!.Attribute("ty") ?? "0"),
            };
        }
        private static double ParseColorCompute(string? multiplier_s, string? offset_s)
        {
            return Math.Max(0, Math.Min(255, double.Parse(multiplier_s ?? "1") * 255 + double.Parse(offset_s ?? "0"))) / 255;
        }
        public static double[] ParseColor(XElement x_Matrix)
        {
            return new double[] {
                ParseColorCompute((string?)x_Matrix!.Attribute("redMultiplier"), (string?)x_Matrix!.Attribute("redOffset")),
                ParseColorCompute((string?)x_Matrix!.Attribute("greenMultiplier"), (string?)x_Matrix!.Attribute("greenOffset")),
                ParseColorCompute((string?)x_Matrix!.Attribute("blueMultiplier"), (string?)x_Matrix!.Attribute("blueOffset")),
                ParseColorCompute((string?)x_Matrix!.Attribute("alphaMultiplier"), (string?)x_Matrix.Attribute("alphaOffset")),
            };
        }

        // Misc
        public static void FlashAnimationResize(string inFolder, int resolution)
        {
            var fs = new FileSystem();
            var path = new ImplementPath();
            var sourceFolder = fs.ReadDirectory(path.Resolve(path.Join(inFolder, "library", "source")), ReadDirectory.OnlyCurrentDirectory).ToList();
            sourceFolder.Sort(new AlphanumericStringComparer());
            for (var i = 0; i < sourceFolder.Count; i++)
            {
                var sourceXml = SenBuffer.ReadXml(sourceFolder[i]);
                var imageName = ParseSourceDocument(sourceXml, i);
                var e = WriteSourceDocument(i, new ImageInfo
                {
                    name = imageName,
                    size = new int[2],
                    transform = new double[6],
                }, resolution);
                SenBuffer.SaveXml(sourceFolder[i], e, xflns);
            }
            return;
        }
    }
    public class AlphanumericStringComparer : IComparer<string>
    {
        private static readonly Regex _re = new Regex(@"([0-9]+)");

        public int Compare(string? x, string? y)
        {
            if (x == y)
            {
                return 0;
            }

            if (x == null)
            {
                return -1;
            }

            if (y == null)
            {
                return 1;
            }

            var maxLen = Math.Max(x.Length, y.Length);

            var x1 = _re.Split(x);
            var y1 = _re.Split(y);

            for (int i = 0; i < x1.Length && i < y1.Length; i++)
            {
                if (x1[i] != y1[i])
                {
                    if (int.TryParse(x1[i], out int nx) && int.TryParse(y1[i], out int ny))
                    {
                        return nx.CompareTo(ny);
                    }

                    return x1[i].CompareTo(y1[i]);
                }
            }

            return x.Length.CompareTo(y.Length);
        }
    }

    public class AnimationHelperSetting
    {
        public required string frameName = "frame";
        public bool imageByPath = false;
        public int appendWidth = 0;
        public int appendHeight = 0;
        public int posX = 0;
        public int posY = 0;
        public int[] disableSprite = new int[0];
    }

    public class ImageSequenceList
    {
        public int imageWidth { get; set; }
        public int imageHeight { get; set; }
        public required double[] matrix { get; set; }
        public required string imageName { get; set; }
        public required int imageIndex { get; set; }
        public bool disableSprite { get; set; }
        public List<double[]> transform = new List<double[]>();
        public List<double[]> color = new List<double[]>();
    }

    public class AnimationHelper
    {


        public static void GenerateImageSequence(PAMInfo AnimationJson, string outFolder, string mediaPath, int resolution, AnimationHelperSetting setting)
        {
            var imageSequenceList = new Dictionary<int, List<ImageSequenceList>>();
            var imageList = new Image[AnimationJson.image.Length];
            for (var i = 0; i < AnimationJson.image.Length; i++)
            {
                var imageInfo = ReadImage(AnimationJson.image[i], i, resolution, setting.imageByPath);
                var SixLaborsImage = LoadImage(imageInfo, mediaPath);
                imageSequenceList[i].Add(imageInfo);
                imageList[i] = SixLaborsImage;
            }
            var spriteList = new Dictionary<int, List<ImageSequenceList>>();
            for (var i = 0; i < AnimationJson.sprite.Length; i++) {
               var spriteImageList = ReadSprite(i, AnimationJson.sprite[i], AnimationJson.sprite, imageSequenceList, spriteList, setting.disableSprite);
               spriteList[i] = spriteImageList;
            }
        }

        private static ImageSequenceList ReadImage(ImageInfo image, int index, int resolution, bool imageByPath)
        {
            var imageName = imageByPath ? image.name.Split("|")[0] : image.name.Split("|")[1];
            var scale = 1200 / resolution;
            var imageWidth = (int)(scale * image.size[0]);
            var imageHeight = (int)(scale * image.size[1]);
            return new ImageSequenceList
            {
                imageWidth = imageWidth,
                imageHeight = imageHeight,
                matrix = image.transform,
                imageName = imageName,
                imageIndex = index,
            };
        }

        private static Image LoadImage(ImageSequenceList imageInfo, string mediaPath)
        {
            using (var SixLaborsImage = Image.Load($"{mediaPath}/{imageInfo.imageName}.png"))
            {
                SixLaborsImage.Mutate(x => x.Resize(imageInfo.imageWidth, imageInfo.imageHeight));
                return SixLaborsImage;
            }
        }

        private static List<ImageSequenceList> ReadSprite(int index, SpriteInfo sprite, SpriteInfo[] sub_sprite, Dictionary<int, List<ImageSequenceList>> imageSequenceList, Dictionary<int, List<ImageSequenceList>> spriteList, int[] disableSprite)
        {
            var frame_node_list = PAM_Animation.DecodeFrameNodeList(index, sprite, sub_sprite);
            var spriteImageList = new List<ImageSequenceList>();
            foreach (var layer_index in frame_node_list.Keys)
            {
                var DOMLayer = frame_node_list[layer_index];
                foreach (var frameElement in DOMLayer)
                {
                    var frame_index = (int)frameElement.Attribute("index")!;
                    var frame_duration = int.Parse((string)frameElement.Attribute("duration")! ?? "1");
                    for (var i = 0; i < frame_duration; i++)
                    {
                        var x_elements_list = frameElement.Elements("elements").ToArray();
                        if (x_elements_list.Length != 1)
                        {
                            throw new PAMException("invalid_sprite_domframe_elements_length", $"Elements length: {x_elements_list.Length}");
                        }
                        var x_elements = x_elements_list[0];
                        var x_DOMSymbolInstance_list = x_elements.Elements("DOMSymbolInstance").ToArray();
                        if (x_DOMSymbolInstance_list.Length == 0)
                        {
                            continue;
                        }
                        if (x_DOMSymbolInstance_list.Length != 1)
                        {
                            throw new PAMException("invalid_sprite_dom_symbol_instance_length", $"DOMSymbolInstance length: {x_DOMSymbolInstance_list.Length}");
                        }
                        var x_DOMSymbolInstance = x_DOMSymbolInstance_list[0];
                        var name_match = Regex.Matches((string)x_DOMSymbolInstance.Attribute("libraryItemName")!, "(image|sprite)/(image|sprite)_([0-9]+)").First();
                        if (name_match is null)
                        {
                            throw new PAMException("invalid_dom_symbol_instance", "undefined");
                        }
                        if (name_match.Groups[1].Value != name_match.Groups[2].Value)
                        {
                            throw new PAMException("invalid_sprite_dom_symbol_instance_x", "undefined");
                        }
                        var resourceIndex = int.Parse(name_match.Groups[3].Value) - 1;
                        var isSprite = name_match.Groups[1].Value == "sprite";
                        double[] transform;
                        double[] color;
                        var x_matrix_list = x_DOMSymbolInstance.Elements("matrix").ToArray();
                        {
                            if (x_matrix_list.Length == 0)
                            {
                                transform = new double[] { 0.0, 0.0 };
                            }
                            else if (x_matrix_list.Length == 1)
                            {
                                var x_matrix = x_matrix_list[0];
                                var x_Matrix_list = x_matrix.Elements("Matrix").ToArray();
                                if (x_Matrix_list.Length != 1)
                                {
                                    throw new PAMException("invalid_sprite_matrix_length", $"Matrix length: {x_Matrix_list.Length}");
                                }
                                var x_Matrix = x_Matrix_list[0];
                                transform = PAM_Animation.StandardToVariant(PAM_Animation.ParseTransform(x_Matrix));
                            }
                            else
                            {
                                throw new PAMException("invalid_sprite_dom_symbol_instance_matrix_length", $"Matrix length: {x_matrix_list.Length}");
                            }
                        }
                        {
                            var x_color_list = x_DOMSymbolInstance.Elements("color").ToArray();
                            if (x_color_list.Length == 0)
                            {
                                color = (double[])PAM_Animation.k_initial_color.Clone();
                            }
                            else if (x_color_list.Length == 1)
                            {
                                var x_color = x_color_list[0];
                                var x_Color_list = x_color.Elements("Color").ToArray();
                                if (x_Color_list.Length != 1)
                                {
                                    throw new PAMException("invalid_sprite_color_length", $"Color length: {x_Color_list.Length}");
                                }
                                var x_Color = x_Color_list[0];
                                color = PAM_Animation.ParseColor(x_Color);
                            }
                            else
                            {
                                throw new PAMException("invalid_sprite_dom_symbol_instance_color_length", $"Color length: {x_color_list.Length}");
                            }
                        };
                        var frameSpriteList = isSprite ? spriteList[resourceIndex] : imageSequenceList[resourceIndex];
                        for (var k = 0; k < frameSpriteList.Count; k++)
                        {
                            var frameSprite = frameSpriteList[k];
                            if (isSprite && disableSprite.Contains(resourceIndex + 1) && disableSprite.Length > 0)
                            {
                                frameSprite.disableSprite = true;
                            }
                            frameSprite.transform.Add(transform);
                            frameSprite.color.Add(color);
                            spriteImageList.Add(frameSprite);
                        }
                    }
                }
            }
            return spriteImageList;
        }
    }
}
