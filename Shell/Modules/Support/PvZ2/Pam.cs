using Sen.Shell.Modules.Standards.IOModule.Buffer;
using System.Text;
using Sen.Shell.Modules.Standards;

namespace Sen.Shell.Modules.Support.PvZ2.PAM
{

    #pragma warning disable IDE0090
    #pragma warning disable IDE1006
    #pragma warning disable CS0414
    #pragma warning disable IDE0060
    #pragma warning disable CS8602

    internal class PAMInfo
    {
        public static readonly uint Magic = 0xBAF01954;
        public int version { get; set; } = 6;
        public byte frame_rate { get; set; } = 30;
        public double[]? position { get; set; }
        public double[]? size { get; set; }
        public ImageInfo[]? image { get; set; }
        public SpriteInfo[]? sprite { get; set; }
        public SpriteInfo? main_sprite { get; set; }
    }

    internal class ImageInfo
    {
        public string? name { get; set; }
        public int[]? size { get; set; }
        public double[]? transform { get; set; }
    }

    internal class SpriteInfo
    {
        public string? name { get; set; }
        public string? description { get; set; }
        public double frame_rate { get; set; }
        public int[]? work_area { get; set; }
        public FrameInfo[]? frame { get; set; }

    }

    [Flags]
    internal enum FrameFlags : byte
    {
        Removes = 1,
        Adds = 2,
        Moves = 4,
        FrameName = 8,
        Stop = 16,
        Commands = 32
    }

    internal class FrameInfo
    {
        public string? label { get; set; }
        public bool stop { get; set; }
        public List<CommandsInfo>? command { get; set; }
        public List<RemovesInfo>? remove { get; set; }
        public List<AddsInfo>? append { get; set; }
        public List<MovesInfo>? change { get; set; }

        public class CommandsInfo
        {
            public string[] command { get; set; } = new string[2];
            public void Write(SenBuffer PamFile, int version)
            {
                PamFile.writeStringByInt16LE(command[0]);
                PamFile.writeStringByInt16LE(command[1]);
            }
            public CommandsInfo Read(SenBuffer PamFile, int version)
            {
                command[0] = PamFile.readStringByInt16LE();
                command[1] = PamFile.readStringByInt16LE();
                return this;
            }
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
            public static readonly int LongCoordsMinVersion = 5;
            public static readonly int MatrixMinVersion = 2;
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
                if (version >= LongCoordsMinVersion)
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
        public static SenBuffer Decode(SenBuffer PamFile)
        {
            PAMInfo PamInfo = new PAMInfo();
            uint PAM_magic = PamFile.readUInt32LE();
            if (PAM_magic != PAMInfo.Magic) throw new ArgumentException();
            int version = PamFile.readInt32LE();
            PamInfo.version = version;
            if (version > 6 || version < 1)
            {
                throw new ArgumentException();
            }
            byte frame_rate = PamFile.readUInt8();
            PamInfo.frame_rate = frame_rate;
            PamInfo.position = new double[2];
            for (var i = 0; i < 2; i++)
            {
                PamInfo.position[i] = PamFile.readInt16LE() / 20d;
            }
            PamInfo.size = new double[2];
            for (var i = 0; i < 2; i++)
            {
                PamInfo.size[i] = PamFile.readInt16LE() / 20d;
            }
            int imagesCount = PamFile.readInt16LE();
            PamInfo.image = new ImageInfo[imagesCount];
            for (var i = 0; i < imagesCount; i++)
            {
                PamInfo.image[i] = ReadImageInfo(PamFile, version);
            }
            int spritesCount = PamFile.readInt16LE();
            PamInfo.sprite = new SpriteInfo[spritesCount];
            for (var i = 0; i < spritesCount; i++)
            {
                PamInfo.sprite[i] = ReadSpriteInfo(PamFile, version);
                if (version < 4) {
                    PamInfo.sprite[i].frame_rate = PamInfo.frame_rate;
                }
            }
            if (version <= 3 || PamFile.readBool())
            {
                PamInfo.main_sprite = ReadSpriteInfo(PamFile, version);
                if (version < 4)
                {
                    PamInfo.main_sprite.frame_rate = frame_rate;
                }
            }
            var json = new JsonImplement();
            byte[] bytes = Encoding.UTF8.GetBytes(json.StringifyJson(PamInfo, null));
            SenBuffer PAMJson = new SenBuffer(bytes);
            return PAMJson;
        }
        private static ImageInfo ReadImageInfo(SenBuffer PamFile, int version)
        {
            ImageInfo image = new ImageInfo();
            image.name = PamFile.readStringByInt16LE();
            image.size = new int[2];
            if (version >= 4)
            {
                for (int i = 0; i < 2; i++)
                {
                    image.size[i] = PamFile.readInt16LE();
                }
            }
            else
            {
                for (int i = 0; i < 2; i++)
                {
                    image.size[i] = -1;
                }
            }
            image.transform = new double[6];
            if (version == 1)
            {
                double num = PamFile.readInt16LE() / 1000d;
                image.transform[0] = Math.Cos(num);
                image.transform[2] = -Math.Sin(num);
                image.transform[1] = Math.Sin(num);
                image.transform[3] = Math.Cos(num);
                image.transform[4] = PamFile.readInt16LE() / 20d;
                image.transform[5] = PamFile.readInt16LE() / 20d;
            }
            else
            {
                image.transform[0] = PamFile.readInt32LE() / 1310720d;
                image.transform[2] = PamFile.readInt32LE() / 1310720d;
                image.transform[1] = PamFile.readInt32LE() / 1310720d;
                image.transform[3] = PamFile.readInt32LE() / 1310720d;
                image.transform[4] = PamFile.readInt16LE() / 20d;
                image.transform[5] = PamFile.readInt16LE() / 20d;
            }
            return image;
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
            frameInfo.command = new List<FrameInfo.CommandsInfo>();
            if ((flags & FrameFlags.Commands) != 0)
            {
                int num12 = PamFile.readUInt8();
                for (int m = 0; m < num12; m++)
                {
                    frameInfo.command.Add(new FrameInfo.CommandsInfo().Read(PamFile, version));
                }
            }
            return frameInfo;
        }
        //Encode
        public static SenBuffer Encode(SenBuffer PamFile)
        {
            string JsonString = PamFile.toString();
            var json = new JsonImplement();
            PAMInfo PamJson = json.ParseJson<PAMInfo>(JsonString);
            SenBuffer PamBinary = new SenBuffer();
            int version = PamJson.version;
            PamBinary.writeUInt32LE(PAMInfo.Magic);
            PamBinary.writeInt32LE(version);
            if (version > 6 || version < 1)
            {
                throw new ArgumentException();
            }
            PamBinary.writeUInt8(PamJson.frame_rate);
            if (PamJson.position == null || PamJson.position.Length < 2)
            {
                PamBinary.writeInt16LE(0);
                PamBinary.writeInt16LE(0);
            }
            else
            {
                PamBinary.writeInt16LE((short)(PamJson.position[0] * 20));
                PamBinary.writeInt16LE((short)(PamJson.position[1] * 20));
            }
            if (PamJson.size == null || PamJson.size.Length < 2)
            {
                PamBinary.writeInt16LE(-1);
                PamBinary.writeInt16LE(-1);
            }
            else
            {
                PamBinary.writeInt16LE((short)(PamJson.size[0] * 20));
                PamBinary.writeInt16LE((short)(PamJson.size[1] * 20));
            }
            if (PamJson.image == null || PamJson.image.Length == 0)
            {
                PamBinary.writeInt16LE(0);
            }
            else
            {
                int imagesCount = PamJson.image.Length;
                PamBinary.writeInt16LE((short)imagesCount);
                for (var i = 0; i < imagesCount; i++)
                {
                    ImageInfo image = PamJson.image[i];
                    WriteImageInfo(PamBinary, version, image);
                }
            }
            if (PamJson.sprite == null || PamJson.sprite.Length == 0)
            {
                PamBinary.writeInt16LE(0);
            }
            else
            {
                int spritesCount = PamJson.sprite.Length;
                PamBinary.writeInt16LE((short)spritesCount);
                for (var i = 0; i < spritesCount; i++)
                {
                    SpriteInfo sprite = PamJson.sprite[i];
                    WriteSpriteInfo(PamBinary, version, sprite);
                }
            }
            if (version <= 3)
            {
                SpriteInfo mainSprite = PamJson.main_sprite ?? new SpriteInfo();
                WriteSpriteInfo(PamBinary, version, mainSprite);
            }
            else
            {
                if (PamJson.main_sprite == null)
                {
                    PamBinary.writeBool(false);
                }
                else
                {
                    PamBinary.writeBool(true);
                    WriteSpriteInfo(PamBinary, version, PamJson.main_sprite);
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
                PamBinary.writeInt32LE((int)(sprite.frame_rate * 65536d));
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
            int framesCount = sprite.frame.Length;
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
                int count = frame.remove.Count;
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
                int count = frame.append.Count;
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
                int count = frame.change.Count;
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
                int count = frame.command.Count;
                if (count > 255) count = 255;
                PamBinary.writeUInt8((byte)count);
                for (int i = 0; i < count; i++)
                {
                    frame.command[i].Write(PamBinary, version);
                }
            }
        }
    }

    public class PAM_Animation
    {

    }
}