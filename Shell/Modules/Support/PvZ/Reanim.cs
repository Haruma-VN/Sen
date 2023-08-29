using System;
using System.Xml.Linq;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
using static Sen.Shell.Modules.Support.PvZ2.PAM.FlashPackage;

namespace Sen.Shell.Modules.Support.PVZ.Reanim
{
    public enum ReanimVersion { 
      PC = 1,
      Phone_32,
      Phone_64
    }


    public class Reanim
    {
        public sbyte? do_scale;
        public float fps;
        public ReanimTrack[]? tracks;
    }

    public class ReanimTrack
    {
        public string? name;
        public ReanimTransform[]? transforms;
    }

    public class ReanimTransform
    {
        public float? x;
        public float? y;
        public float? kx;
        public float? ky;
        public float? sx;
        public float? sy;
        public float? f;
        public float? a;
        public object? i;
        public string? resource;
        public string? i2;
        public string? resource2;
        public string? font;
        public string? text;
    }

    public class Reanim_Function
    {
        public static Reanim ParseReanim(string inFile)
        {
            var reanim = new Reanim();
            foreach (ReanimVersion version in Enum.GetValues(typeof(ReanimVersion)))
            {
                try
                {
                    var rawFile = new SenBuffer(inFile);
                    reanim = version switch
                    {
                        ReanimVersion.PC => Reanim_PC.Decode(rawFile),
                        ReanimVersion.Phone_32 => Reanim_Phone_32.Decode(rawFile),
                        ReanimVersion.Phone_64 => Reanim_Phone_64.Decode(rawFile),
                        _ => throw new Exception(Localization.GetString("unsupported_reanim_platform"))
                    };
                }
                catch (Exception)
                {
                    reanim = null;
                }
                if (reanim is not null) break;
            }
            if (reanim is null)
            {
                throw new Exception(Localization.GetString("reanim_cannot_be_null"));
            }
            return reanim;
        }

        public static SenBuffer WriteReanim(Reanim reanim, ReanimVersion version)
        {
            var reanimFile = version switch
            {
                ReanimVersion.PC => Reanim_PC.Encode(reanim),
                ReanimVersion.Phone_32 => Reanim_Phone_32.Encode(reanim),
                ReanimVersion.Phone_64 => Reanim_Phone_64.Encode(reanim),
                _ => throw new Exception(Localization.GetString("unsupported_reanim_platform"))
            };
            return reanimFile;
        }
    }

    public class Reanim_PC
    {

        public static Reanim Decode(SenBuffer rawFile)
        {
            var SenFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 4;
                var size = rawFile.readInt32LE();
                SenFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                SenFile = rawFile;
            }
            var reanim = new Reanim();
            SenFile.readOffset = 8;
            var tracksNumber = SenFile.readInt32LE();
            reanim.tracks = new ReanimTrack[tracksNumber];
            reanim.fps = SenFile.readFloatLE();
            SenFile.readOffset += 4;
            if (SenFile.readInt32LE() != 0xC)
            {
                throw new Exception(Localization.GetString("invalid_reanim_magic"));
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.readOffset += 8;
                reanim.tracks[i] = new ReanimTrack()
                {
                    transforms = new ReanimTransform[SenFile.readInt32LE()],
                };
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                track.name = SenFile.readString(SenFile.readInt32LE());
                if (SenFile.readInt32LE() != 0x2C)
                {
                    throw new Exception(Localization.GetString("invalid_track"));
                }
                var times = track.transforms!.Length;
                for (var k = 0; k < times; k++)
                {
                    var ts = new ReanimTransform();
                    var tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.x = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.y = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.kx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.ky = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sy = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.f = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.a = tfloat;
                    }
                    SenFile.readOffset += 12;
                    track.transforms[k] = ts;
                }
                for (var k = 0; k < times; k++)
                {
                    var ts = track.transforms[k];
                    var tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.i = tstring;
                    }
                    tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.font = tstring;
                    }
                    tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.text = tstring;
                    }
                }
            }
            return reanim;
        }

        public static SenBuffer Encode(Reanim reanim)
        {
            var SenFile = new SenBuffer();
            SenFile.writeInt32LE(-1282165568);
            SenFile.writeInt32LE(0);
            var tracksNumber = reanim.tracks!.Length;
            SenFile.writeInt32LE(tracksNumber);
            SenFile.writeFloatLE(reanim.fps);
            SenFile.writeInt32LE(0);
            SenFile.writeInt32LE(0x0C);
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(reanim.tracks[i].transforms!.Length);
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                SenFile.writeStringByInt32LE(track.name!);
                SenFile.writeInt32LE(0x2C);
                var transformsNumber = track.transforms!.Length;
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    SenFile.writeFloatLE(transform.x ?? -10000F);
                    SenFile.writeFloatLE(transform.y ?? -10000F);
                    SenFile.writeFloatLE(transform.kx ?? -10000F);
                    SenFile.writeFloatLE(transform.ky ?? -10000F);
                    SenFile.writeFloatLE(transform.sx ?? -10000F);
                    SenFile.writeFloatLE(transform.sy ?? -10000F);
                    SenFile.writeFloatLE(transform.f ?? -10000F);
                    SenFile.writeFloatLE(transform.a ?? -10000F);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                }
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    SenFile.writeStringByInt32LE((string)transform.i!);
                    SenFile.writeStringByInt32LE(transform.font!);
                    SenFile.writeStringByInt32LE(transform.text!);
                }
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            rawFile.writeInt32LE((int)SenFile.length);
            rawFile.writeBytes(compress.CompressZlib(SenFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            SenFile.Close();
            return rawFile;
        }
    }

    public class Reanim_Phone_32
    {
        public static Reanim Decode(SenBuffer rawFile)
        {
            var SenFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 4;
                var size = rawFile.readInt32LE();
                SenFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                SenFile = rawFile;
            }
            var reanim = new Reanim();
            SenFile.readOffset = 8;
            var tracksNumber = SenFile.readInt32LE();
            reanim.tracks = new ReanimTrack[tracksNumber];
            reanim.fps = SenFile.readFloatLE();
            SenFile.readOffset += 4;
            if (SenFile.readInt32LE() != 0x10)
            {
                throw new Exception(Localization.GetString("invalid_reanim_magic"));
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.readOffset += 12;
                reanim.tracks[i] = new ReanimTrack()
                {
                    transforms = new ReanimTransform[SenFile.readInt32LE()],
                };
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                track.name = SenFile.readString(SenFile.readInt32LE());
                if (SenFile.readInt32LE() != 0x2C)
                {
                    throw new Exception(Localization.GetString("invalid_track"));
                }
                var times = track.transforms!.Length;
                for (var k = 0; k < times; k++)
                {
                    var ts = new ReanimTransform();
                    var tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.x = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.y = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.kx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.ky = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sy = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.f = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.a = tfloat;
                    }
                    SenFile.readOffset += 12;
                    track.transforms[k] = ts;
                }
                for (var k = 0; k < times; k++)
                {
                    var ts = track.transforms[k];
                    var tint = SenFile.readInt32LE();
                    if (tint != -1)
                    {
                        ts.i = tint;
                    }
                    var tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.font = tstring;
                    }
                    tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.text = tstring;
                    }
                }
            }
            return reanim;
        }

        public static SenBuffer Encode(Reanim reanim)
        {
            var SenFile = new SenBuffer();
            SenFile.writeInt32LE(-14326347);
            SenFile.writeInt32LE(0);
            var tracksNumber = reanim.tracks!.Length;
            SenFile.writeInt32LE(tracksNumber);
            SenFile.writeFloatLE(reanim.fps);
            SenFile.writeInt32LE(0);
            SenFile.writeInt32LE(0x10);
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(reanim.tracks[i].transforms!.Length);
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                SenFile.writeStringByInt32LE(track.name!);
                SenFile.writeInt32LE(0x2C);
                var transformsNumber = track.transforms!.Length;
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    SenFile.writeFloatLE(transform.x ?? -10000F);
                    SenFile.writeFloatLE(transform.y ?? -10000F);
                    SenFile.writeFloatLE(transform.kx ?? -10000F);
                    SenFile.writeFloatLE(transform.ky ?? -10000F);
                    SenFile.writeFloatLE(transform.sx ?? -10000F);
                    SenFile.writeFloatLE(transform.sy ?? -10000F);
                    SenFile.writeFloatLE(transform.f ?? -10000F);
                    SenFile.writeFloatLE(transform.a ?? -10000F);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                }
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    var i_type = Convert.ToInt32(transform.i ?? -1);
                    SenFile.writeInt32LE(i_type);
                    SenFile.writeStringByInt32LE(transform.font!);
                    SenFile.writeStringByInt32LE(transform.text!);
                }
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            rawFile.writeInt32LE((int)SenFile.length);
            rawFile.writeBytes(compress.CompressZlib(SenFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            SenFile.Close();
            return rawFile;
        }
    }

    public class Reanim_Phone_64
    {
        public static Reanim Decode(SenBuffer rawFile)
        {
            var SenFile = new SenBuffer();
            if (rawFile.peekInt32LE() == -559022380)
            {
                var compress = new Sen.Shell.Modules.Standards.Compress();
                rawFile.readOffset += 8;
                var size = rawFile.readInt32LE();
                rawFile.readOffset += 4;
                SenFile = new SenBuffer(compress.UncompressZlib(rawFile.readBytes((int)rawFile.length - 8)));
                rawFile.Close();
            }
            else
            {
                SenFile = rawFile;
            }
            var reanim = new Reanim();
            SenFile.readOffset = 12;
            var tracksNumber = SenFile.readInt32LE();
            reanim.tracks = new ReanimTrack[tracksNumber];
            reanim.fps = SenFile.readFloatLE();
            SenFile.readOffset += 8;
            if (SenFile.readInt32LE() != 0x20)
            {
                throw new Exception(Localization.GetString("invalid_reanim_magic"));
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.readOffset += 24;
                var size = SenFile.readInt32LE();
                reanim.tracks[i] = new ReanimTrack()
                {
                    transforms = new ReanimTransform[size],
                };
                SenFile.readOffset += 4;
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                track.name = SenFile.readString(SenFile.readInt32LE());
                if (SenFile.readInt32LE() != 0x38)
                {
                    throw new Exception(Localization.GetString("invalid_track"));
                }
                var times = track.transforms!.Length;
                for (var k = 0; k < times; k++)
                {
                    var ts = new ReanimTransform();
                    var tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.x = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.y = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.kx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.ky = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sx = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.sy = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.f = tfloat;
                    }
                    tfloat = SenFile.readFloatLE();
                    if (tfloat != -10000F)
                    {
                        ts.a = tfloat;
                    }
                    SenFile.readOffset += 24;
                    track.transforms[k] = ts;
                }
                for (var k = 0; k < times; k++)
                {
                    var ts = track.transforms[k];
                    var tint = SenFile.readInt32LE();
                    if (tint != -1)
                    {
                        ts.i = tint;
                    }
                    var tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.font = tstring;
                    }
                    tstring = SenFile.readStringByInt32LE();
                    if (!string.IsNullOrEmpty(tstring))
                    {
                        ts.text = tstring;
                    }
                }
            }
            return reanim;
        }

        public static SenBuffer Encode(Reanim reanim)
        {
            var SenFile = new SenBuffer();
            SenFile.writeInt32LE(-1069095568);
            SenFile.writeInt32LE(0);
            SenFile.writeInt32LE(0);
            var tracksNumber = reanim.tracks!.Length;
            SenFile.writeInt32LE(tracksNumber);
            SenFile.writeFloatLE(reanim.fps);
            SenFile.writeInt32LE(0);
            SenFile.writeInt32LE(0);
            SenFile.writeInt32LE(0x20);
            for (var i = 0; i < tracksNumber; i++)
            {
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(0);
                SenFile.writeInt32LE(reanim.tracks[i].transforms!.Length);
                SenFile.writeInt32LE(0);
            }
            for (var i = 0; i < tracksNumber; i++)
            {
                var track = reanim.tracks[i];
                SenFile.writeStringByInt32LE(track.name!);
                SenFile.writeInt32LE(0x38);
                var transformsNumber = track.transforms!.Length;
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    SenFile.writeFloatLE(transform.x ?? -10000F);
                    SenFile.writeFloatLE(transform.y ?? -10000F);
                    SenFile.writeFloatLE(transform.kx ?? -10000F);
                    SenFile.writeFloatLE(transform.ky ?? -10000F);
                    SenFile.writeFloatLE(transform.sx ?? -10000F);
                    SenFile.writeFloatLE(transform.sy ?? -10000F);
                    SenFile.writeFloatLE(transform.f ?? -10000F);
                    SenFile.writeFloatLE(transform.a ?? -10000F);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                    SenFile.writeInt32LE(0);
                }
                for (var k = 0; k < transformsNumber; k++)
                {
                    var transform = track.transforms[k];
                    var i_type = Convert.ToInt32(transform.i ?? -1);
                    SenFile.writeInt32LE(i_type);
                    SenFile.writeStringByInt32LE(transform.font!);
                    SenFile.writeStringByInt32LE(transform.text!);
                }
            }
            var rawFile = new SenBuffer();
            var compress = new Sen.Shell.Modules.Standards.Compress();
            rawFile.writeInt32LE(-559022380);
            SenFile.writeInt32LE(0);
            rawFile.writeInt32LE((int)SenFile.length);
            SenFile.writeInt32LE(0);
            rawFile.writeBytes(compress.CompressZlib(SenFile.toBytes(), ZlibCompressionLevel.DEFAULT_COMPRESSION));
            SenFile.Close();
            return rawFile;
        }

    }

    public class Reanim_Aniamtion
    {
        public const string k_xfl_content = "PROXY-CS5";

        public const string k_xfl_version = "2.971";

        public readonly static XAttribute k_xmlns_attribute = new(XNamespace.Xmlns + "xsi", "http://www.w3.org/2001/XMLSchema-instance");

        public readonly static XNamespace xflns = $"http://ns.adobe.com/xfl/2008/";

        private readonly static int UseLabelName = 0;

        private static string GetNameByID(string ID, string labelname, int labelindex)
        {
            if (UseLabelName > 0)
            {
                if (labelindex != 0)
                {
                    return labelname + "_" + labelindex;
                }
                return labelname;
            }
            else if (UseLabelName < 0)
            {
                return ID.ToLower();
            }
            else
            {
                string name = ID;
                if (name.StartsWith("IMAGE_REANIM_"))
                {
                    name = name[13..];
                }
                return name.ToLower();
            }
        }
        public static void Encode(Reanim reanim, string outFolder)
        {
            var path = new ImplementPath();
            var libraryFolder = path.Resolve(path.Join(outFolder, "library"));
            if (!Directory.Exists(libraryFolder)) Directory.CreateDirectory(libraryFolder);
            File.WriteAllText(path.Resolve(path.Join(outFolder, "main.xfl")), k_xfl_content);
            var media = new List<string>();
            var symbols = new List<string>();
            var Exist = new Dictionary<string, bool>();
            var frame = new List<XElement>();
            for (var i = reanim.tracks!.Length - 1; i >= 0; i--)
            {
                var defaultTransform = new ReanimTransform
                {
                    x = 0,
                    y = 0,
                    sx = 1,
                    sy = 1,
                    kx = 0,
                    ky = 0,
                    f = 0,
                    a = 1
                };
                var track = reanim.tracks[i];
                var transformNumber = track.transforms!.Length;
                var index = 0;
                var ImgList = new List<string>();
                var DomFrame = new List<XElement>();
                for (var k = 0; k < transformNumber; k++)
                {
                    var thisTransform = track.transforms[k];
                    defaultTransform.x = thisTransform.x ?? defaultTransform.x;
                    defaultTransform.y = thisTransform.y ?? defaultTransform.y;
                    defaultTransform.kx = thisTransform.kx ?? defaultTransform.kx;
                    defaultTransform.ky = thisTransform.ky ?? defaultTransform.ky;
                    defaultTransform.sx = thisTransform.sx ?? defaultTransform.sx;
                    defaultTransform.sy = thisTransform.sy ?? defaultTransform.sy;
                    defaultTransform.f = thisTransform.f ?? defaultTransform.f;
                    defaultTransform.a = thisTransform.a ?? defaultTransform.a;
                    if (thisTransform.i is not null)
                    {
                        string nid = GetNameByID(thisTransform.i.ToString()!, track.name!, index++);
                        if (!Exist.ContainsKey(nid))
                        {
                            ImgList.Add(nid);
                            media.Add(nid);
                            symbols.Add(nid);
                        }
                        defaultTransform.i = nid;
                    };
                    double dx = 180 / Math.PI;
                    double skewx = (defaultTransform.kx ?? 0) / dx;
                    double skewy = -(defaultTransform.ky ?? 0) / dx;
                    float sx = defaultTransform.sx ?? 1;
                    float sy = defaultTransform.sy ?? 1;
                    DomFrame.Add(new XElement("DOMFrame",
                        new XAttribute("index", k),
                        new XElement("elements",
                        (defaultTransform.i is not null && defaultTransform.f != -1) ?
                        new XElement("DOMSymbolInstance", new XAttribute("libraryItemName", defaultTransform.i),
                        new XElement("matrix",
                                                new XElement("Matrix",
                                                    new XAttribute("a", Math.Cos(skewx) * sx),
                                                    new XAttribute("b", Math.Sin(skewx) * sx),
                                                    new XAttribute("c", Math.Sin(skewy) * sy),
                                                    new XAttribute("d", Math.Cos(skewy) * sy),
                                                    new XAttribute("tx", defaultTransform.x),
                                                    new XAttribute("ty", defaultTransform.y)
                                                )
                                            ), defaultTransform.a != 1 ? new XElement("color", new XAttribute("alphaMultiplier", defaultTransform.a)) : "") : ""
                        )));
                }
                frame.Add(new XElement("DOMLayer", new XAttribute("name", track.name!), new XElement("frames", DomFrame.ToArray())));
                var num = ImgList.Count;
                for (var k = 0; k < num; k++)
                {
                    var name_img = ImgList[k];
                    var img_xml = new XElement("DOMSymbolItem",
                    k_xmlns_attribute,
                    new XAttribute("name", name_img),
                    new XElement("timeline",
                    new XElement("DOMTimeline",
                         new XAttribute("name", name_img),
                         new XElement("layers",
                            new XElement("DOMLayer",
                                new XAttribute("name", "1"),
                                new XAttribute("color", "#4FFF4F"),
                                new XAttribute("current", "true"),
                                new XAttribute("isSelected", "true"),
                                new XElement("frames",
                                    new XElement("DOMFrame",
                                        new XAttribute("index", "0"),
                                        new XElement("elements",
                                            new XElement("DOMBitmapInstance",
                                                new XAttribute("isSelected", "true"),
                                                new XAttribute("libraryItemName", $"{name_img}.png")
                                            )))))))));
                    var imgPath = path.Resolve(path.Join(libraryFolder, $"{name_img}.xml"));
                    SenBuffer.SaveXml(imgPath, img_xml, xflns);
                }
            }
            var media_list = new List<XElement>();
            var mediaNumber = media.Count;
            for (var i = 0; i < mediaNumber; i++)
            {
                media_list.Add(new XElement("DOMBitmapItem",
                new XAttribute("name", $"{media[i]}.png"),
                new XAttribute("href", $"{media[i]}.png")
                ));
            }
            var symbols_list = new List<XElement>();
            var symbolsNumber = symbols.Count;
            for (var i = 0; i < symbolsNumber; i++)
            {
                symbols_list.Add(
                    new XElement("Include",
                new XAttribute("href", $"{symbols[i]}.xml")
                ));
            }
            var document = new XElement("DOMDocument",
            new XAttribute("frameRate", reanim.fps),
            new XAttribute("width", 80),
            new XAttribute("height", 80),
            new XAttribute("xflVersion", k_xfl_version),
            k_xmlns_attribute,
                new XElement("media", media_list.ToArray()),
                    new XElement("symbols", symbols_list.ToArray()),
                        new XElement("timelines",
                            new XElement("DOMTimeline",
                        new XAttribute("name", "animation"),
                        new XElement("layers", frame.ToArray())
                    )
                )
            );
            SenBuffer.SaveXml(path.Resolve(path.Join(outFolder, "DOMDocument.xml")), document, xflns);
        }

        public static Reanim Decode(string inFolder)
        {
            var path = new ImplementPath();
            var x_DOMDocument = SenBuffer.ReadXml(path.Resolve(path.Join(inFolder, "DOMDocument.xml")));
            var reanim = new Reanim();
            reanim.fps = int.Parse(x_DOMDocument.Attribute("frameRate")!.Value);
            if (x_DOMDocument.Name.LocalName != "DOMDocument")
            {
                throw new Exception("invalid_domdocument");
            }
            {
                var x_media_list = x_DOMDocument.Elements("media").ToArray();
                if (x_media_list.Length != 1)
                {
                    throw new Exception("invalid_domdocument_media_length");
                }
                var x_media = x_media_list[0];
                var x_DOMBitmapItem_list = x_media.Elements("DOMBitmapItem").ToArray();
            }
            {
                var x_symbols_list = x_DOMDocument.Elements("symbols").ToArray();
                if (x_symbols_list.Length != 1)
                {
                    throw new Exception("invalid_domdocument_symbols_length");
                }
                var x_symbols = x_symbols_list[0];
                var x_Include_list = x_symbols.Elements("Include").ToArray();
            }
            {
                var x_timelines_list = x_DOMDocument.Elements("timelines").ToArray();
                if (x_timelines_list.Length != 1)
                {
                    throw new Exception("invalid_domdocument_timelines_length");
                }
                var x_timelines = x_timelines_list[0];
                var x_DOMTimeline_list = x_timelines.Elements("DOMTimeline").ToArray();
                if (x_DOMTimeline_list.Length != 1)
                {
                    throw new Exception("invalid_domtimeline_length");
                }
                var x_DOMTimeline = x_DOMTimeline_list[0];
                if (((string)x_DOMTimeline.Attribute("name")!) != "animation")
                {
                    throw new Exception("invalid_domtimeline_name");
                }
                var x_layers_list = x_DOMTimeline.Elements("layers").ToArray();
                if (x_layers_list.Length != 1)
                {
                    throw new Exception("invalid_domtimeline_layers_length");
                }
                var x_layers = x_layers_list[0];
                var x_DOMLayer_list = x_layers.Elements("DOMLayer").ToList();
                var frame_duration = 0;
                x_DOMLayer_list.Reverse();
                var tracks_list = new List<ReanimTrack>();
                x_DOMLayer_list.ForEach(x_DOMLayer =>
                {
                    var name = (string)x_DOMLayer.Attribute("name")!;
                    var x_frames_list = x_DOMLayer.Elements("frames").ToArray();
                    if (x_frames_list.Length != 1)
                    {
                        throw new Exception("invalid_sprite_domtimeline_frames_length");
                    }
                    var x_frames = x_frames_list[0];
                    var x_DOMFrame_list = x_frames.Elements("DOMFrame").ToList();
                    var frame_count = x_DOMFrame_list.Count;
                    var transforms = new List<ReanimTransform>();
                    if (frame_duration > 0)
                    {
                        if (frame_duration != frame_count) throw new Exception("Invaild frame length");
                    }
                    else
                    {
                        frame_duration = frame_count;
                    }
                    var defaultTransform = new ReanimTransform
                    {
                        x = 0,
                        y = 0,
                        sx = 1,
                        sy = 1,
                        kx = 0,
                        ky = 0,
                        f = 0,
                        a = 1
                    };
                    var temp_name = -1;
                    var frame_switch = false;
                    x_DOMFrame_list.ForEach(x_DOMFrame =>
                    {
                        var x_elements_list = x_DOMFrame.Elements("elements").ToArray();
                        var thisTransform = new ReanimTransform();
                        if (x_elements_list.Length == 0)
                        {
                            return;
                        }
                        if (x_elements_list.Length != 1)
                        {
                            throw new Exception("invalid_sprite_domframe_elements_length");
                        }
                        var x_elements = x_elements_list[0];
                        var x_DOMSymbolInstance_list = x_elements.Elements("DOMSymbolInstance").ToArray();
                        if (x_DOMSymbolInstance_list.Length == 0)
                        {
                            if (!frame_switch)
                            {
                                thisTransform.f = -1;
                                frame_switch = true;
                            }
                            transforms.Add(thisTransform);
                            return;
                        }
                        if (x_DOMSymbolInstance_list.Length != 1)
                        {
                            throw new Exception("invalid_sprite_dom_symbol_instance_length");
                        }
                        var x_DOMSymbolInstance = x_DOMSymbolInstance_list[0];
                        var name_item = (string)x_DOMSymbolInstance.Attribute("libraryItemName")!;
                        if (name_item is null)
                        {
                            throw new Exception("invalid_dom_symbol_instance");
                        }
                        var name_int = int.Parse(name_item);
                        if (temp_name != name_int)
                        {
                            thisTransform.i = name_int;
                            temp_name = name_int;
                        }
                        var x_matrix_list = x_DOMSymbolInstance.Elements("matrix").ToArray();
                        if (x_matrix_list.Length == 0)
                        {
                        }
                        else if (x_matrix_list.Length == 1)
                        {
                            var x_matrix = x_matrix_list[0];
                            var x_Matrix_list = x_matrix.Elements("Matrix").ToArray();
                            if (x_Matrix_list.Length != 1)
                            {
                                throw new Exception("invalid_sprite_matrix_length");
                            }
                            var x_Matrix = x_Matrix_list[0];
                            var a = double.Parse((string?)x_Matrix!.Attribute("a") ?? "1");
                            var b = double.Parse((string?)x_Matrix!.Attribute("b") ?? "0");
                            var c = double.Parse((string?)x_Matrix!.Attribute("c") ?? "0");
                            var d = double.Parse((string?)x_Matrix!.Attribute("d") ?? "1");
                            var tx = float.Parse((string?)x_Matrix!.Attribute("tx") ?? "0");
                            var ty = float.Parse((string?)x_Matrix!.Attribute("ty") ?? "0");

                            double skewX = Math.Atan2(b, a);
                            double skewY = Math.Atan2(c, d);
                            double dx = 180 / Math.PI;
                            var quarterPi = 0.785398163;
                            float sx;
                            float sy;
                            if (Math.Abs(skewX) < quarterPi || Math.Abs(skewX) > quarterPi * 3)
                            {
                                sx = (float)(a / Math.Cos(skewX));
                            }
                            else // need to switch way to get scale when cos() is near 0
                            {
                                sx = (float)(b / Math.Sin(skewX));
                            }
                            if (Math.Abs(skewY) < quarterPi || Math.Abs(skewY) > quarterPi * 3)
                            {
                                sy = (float)(d / Math.Cos(skewY));
                            }
                            else // need to switch way to get scale when cos() is near 0
                            {
                                sy = (float)(c / Math.Sin(skewY));
                            }
                            float kx = (float)(dx * skewX);
                            float ky = (float)(dx * skewY);
                            if (defaultTransform.x != tx)
                            {
                                defaultTransform.x = tx;
                                thisTransform.x = tx;
                            }
                            if (defaultTransform.y != ty)
                            {
                                defaultTransform.y = ty;
                                thisTransform.y = ty;
                            }
                            if (defaultTransform.kx != kx)
                            {
                                defaultTransform.kx = kx;
                                thisTransform.kx = kx;
                            }
                            if (defaultTransform.ky != ky)
                            {
                                defaultTransform.ky = ky;
                                thisTransform.ky = ky;
                            }
                            if (defaultTransform.sx != sx)
                            {
                                defaultTransform.sx = sx;
                                thisTransform.sx = sx;
                            }
                            if (defaultTransform.sy != sy)
                            {
                                defaultTransform.sy = sy;
                                thisTransform.sy = sy;
                            }
                            if (frame_switch)
                            {
                                thisTransform.f = 0;
                                frame_switch = false;
                            }

                        }
                        else
                        {
                            throw new Exception("invalid_sprite_dom_symbol_instance_matrix_length");
                        }
                        var x_color_list = x_DOMSymbolInstance.Elements("color").ToArray();
                        
                        if (x_color_list.Length == 0)
                        {
                        }
                        else if (x_color_list.Length == 1)
                        {
                            var x_color = x_color_list[0];
                            var x_Color_list = x_color.Elements("Color").ToArray();
                            if (x_Color_list.Length != 1)
                            {
                                throw new Exception("invalid_sprite_color_length");
                            }
                            var x_Color = x_Color_list[0];
                            var a = float.Parse((string)x_Color!.Attribute("alphaMultiplier")!);
                            if (defaultTransform.a != a) {
                                defaultTransform.a = a;
                                thisTransform.a = a;
                            }
                        }
                        else
                        {
                            throw new Exception("invalid_sprite_dom_symbol_instance_color_length");
                        }
                        transforms.Add(thisTransform);
                    });
                    tracks_list.Add(new ReanimTrack()
                    {
                        name = name,
                        transforms = transforms.ToArray(),
                    });
                });
                reanim.tracks = tracks_list.ToArray();
            }
            return reanim;
        }
    }
}