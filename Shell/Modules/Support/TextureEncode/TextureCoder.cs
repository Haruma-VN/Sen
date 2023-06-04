namespace Sen.Shell.Modules.Support.TextureEncode.TextureCoder
{
    public static class ETC1
    {
        public static readonly int[,] ETC1Modifiers =
            {
                { 2, 8 },
                { 5, 17 },
                { 9, 29 },
                { 13, 42 },
                { 18, 60 },
                { 24, 80 },
                { 33, 106 },
                { 47, 183 }
            };

        public static ulong VerticalETC1(Rgba32[] Colors)
        {
            ulong Vertical = GenVertical(Colors);
            return Vertical;
        }

        public static ulong GenETC1(Rgba32[] Colors)
        {
            ulong Horizontal = GenHorizontal(Colors);
            ulong Vertical = GenVertical(Colors);
            Rgba32[] source_color = new Rgba32[16];
            DecodeETC1(Horizontal, source_color);
            int HorizontalScore = GetScore(Colors, source_color);
            DecodeETC1(Vertical, source_color);
            int VerticalScore = GetScore(Colors, source_color);
            return (HorizontalScore < VerticalScore) ? Horizontal : Vertical;
        }

        public static void DecodeETC1(ulong temp, Rgba32[] Result)
        {
            bool diffbit = ((temp >> 33) & 1) == 1;
            bool flipbit = ((temp >> 32) & 1) == 1;
            int r1, r2, g1, g2, b1, b2;
            if (diffbit)
            {
                int r = (int)((temp >> 59) & 0x1F);
                int g = (int)((temp >> 51) & 0x1F);
                int b = (int)((temp >> 43) & 0x1F);
                r1 = (r << 3) | ((r & 0x1C) >> 2);
                g1 = (g << 3) | ((g & 0x1C) >> 2);
                b1 = (b << 3) | ((b & 0x1C) >> 2);
                r += (int)((temp >> 56) & 0x7) << 29 >> 29;
                g += (int)((temp >> 48) & 0x7) << 29 >> 29;
                b += (int)((temp >> 40) & 0x7) << 29 >> 29;
                r2 = (r << 3) | ((r & 0x1C) >> 2);
                g2 = (g << 3) | ((g & 0x1C) >> 2);
                b2 = (b << 3) | ((b & 0x1C) >> 2);
            }
            else
            {
                r1 = (int)((temp >> 60) & 0xF) * 0x11;
                g1 = (int)((temp >> 52) & 0xF) * 0x11;
                b1 = (int)((temp >> 44) & 0xF) * 0x11;
                r2 = (int)((temp >> 56) & 0xF) * 0x11;
                g2 = (int)((temp >> 48) & 0xF) * 0x11;
                b2 = (int)((temp >> 40) & 0xF) * 0x11;
            }
            int Table1 = (int)((temp >> 37) & 0x7);
            int Table2 = (int)((temp >> 34) & 0x7);
            for (int i = 0; i < 4; i++)
            {
                for (int j = 0; j < 4; j++)
                {
                    int val = (int)((temp >> ((j << 2) | i)) & 0x1);
                    bool neg = ((temp >> (((j << 2) | i) + 16)) & 0x1) == 1;
                    if ((flipbit && i < 2) || (!flipbit && j < 2))
                    {
                        int add = ETC1Modifiers[Table1, val] * (neg ? -1 : 1);
                        Result[(i << 2) | j] = new Rgba32(ColorClamp(r1 + add), ColorClamp(g1 + add), ColorClamp(b1 + add));
                    }
                    else
                    {
                        int add = ETC1Modifiers[Table2, val] * (neg ? -1 : 1);
                        Result[(i << 2) | j] = new Rgba32(ColorClamp(r2 + add), ColorClamp(g2 + add), ColorClamp(b2 + add));
                    }
                }
            }
        }

        private static int GetScore(Rgba32[] Original, Rgba32[] Encode)
        {
            int Diff = 0;
            for (int i = 0; i < 4 * 4; i++)
            {
                Diff += Math.Abs(Encode[i].R - Original[i].R);
                Diff += Math.Abs(Encode[i].G - Original[i].G);
                Diff += Math.Abs(Encode[i].B - Original[i].B);
            }
            return Diff;
        }

        public static void SetFlipMode(ref ulong Data, bool Mode)
        {
            Data &= ~(1ul << 32);
            Data |= (Mode ? 1ul : 0ul) << 32;
        }

        private static void SetDiffMode(ref ulong Data, bool Mode)
        {
            Data &= ~(1ul << 33);
            Data |= (Mode ? 1ul : 0ul) << 33;
        }

        public static Rgba32[] GetLeftColors(Rgba32[] Pixels)
        {
            Rgba32[] Left = new Rgba32[8];
            for (int y = 0; y < 4; y++)
            {
                for (int x = 0; x < 2; x++)
                {
                    Left[y * 2 + x] = Pixels[y * 4 + x];
                }
            }
            return Left;
        }

        public static Rgba32[] GetRightColors(Rgba32[] Pixels)
        {
            Rgba32[] Right = new Rgba32[8];
            for (int y = 0; y < 4; y++)
            {
                for (int x = 2; x < 4; x++)
                {
                    Right[y * 2 + x - 2] = Pixels[y * 4 + x];
                }
            }
            return Right;
        }

        public static Rgba32[] GetTopColors(Rgba32[] Pixels)
        {
            Rgba32[] Top = new Rgba32[8];
            for (int y = 0; y < 2; y++)
            {
                for (int x = 0; x < 4; x++)
                {
                    Top[y * 4 + x] = Pixels[y * 4 + x];
                }
            }
            return Top;
        }

        public static Rgba32[] GetBottomColors(Rgba32[] Pixels)
        {
            Rgba32[] Bottom = new Rgba32[8];
            for (int y = 2; y < 4; y++)
            {
                for (int x = 0; x < 4; x++)
                {
                    Bottom[(y - 2) * 4 + x] = Pixels[y * 4 + x];
                }
            }
            return Bottom;
        }

        public static ulong GenHorizontal(Rgba32[] Colors)
        {
            ulong data = 0;
            SetFlipMode(ref data, false);
            //Left
            Rgba32[] Left = GetLeftColors(Colors);
            Rgba32 basec1;
            int mod = GenModifier(out basec1, Left);
            SetTable1(ref data, mod);
            GenPixDiff(ref data, Left, basec1, mod, 0, 2, 0, 4);
            //Right
            Rgba32[] Right = GetRightColors(Colors);
            Rgba32 basec2;
            mod = GenModifier(out basec2, Right);
            SetTable2(ref data, mod);
            GenPixDiff(ref data, Right, basec2, mod, 2, 4, 0, 4);
            SetBaseColors(ref data, basec1, basec2);
            return data;
        }

        public static ulong GenVertical(Rgba32[] Colors)
        {
            ulong data = 0;
            SetFlipMode(ref data, true);
            //Top
            Rgba32[] Top = GetTopColors(Colors);
            Rgba32 basec1;
            int mod = GenModifier(out basec1, Top);
            SetTable1(ref data, mod);
            GenPixDiff(ref data, Top, basec1, mod, 0, 4, 0, 2);
            //Bottom
            Rgba32[] Bottom = GetBottomColors(Colors);
            Rgba32 basec2;
            mod = GenModifier(out basec2, Bottom);
            SetTable2(ref data, mod);
            GenPixDiff(ref data, Bottom, basec2, mod, 0, 4, 2, 4);
            SetBaseColors(ref data, basec1, basec2);
            return data;
        }

        public static void SetBaseColors(ref ulong Data, Rgba32 Color1, Rgba32 Color2)
        {
            int R1 = Color1.R;
            int G1 = Color1.G;
            int B1 = Color1.B;
            int R2 = Color2.R;
            int G2 = Color2.G;
            int B2 = Color2.B;
            int RDiff = (R2 - R1) / 8;
            int GDiff = (G2 - G1) / 8;
            int BDiff = (B2 - B1) / 8;
            if (RDiff > -4 && RDiff < 3 && GDiff > -4 && GDiff < 3 && BDiff > -4 && BDiff < 3)
            {
                SetDiffMode(ref Data, true);
                R1 /= 8;
                G1 /= 8;
                B1 /= 8;
                Data |= (ulong)R1 << 59;
                Data |= (ulong)G1 << 51;
                Data |= (ulong)B1 << 43;
                Data |= (ulong)(RDiff & 0x7) << 56;
                Data |= (ulong)(GDiff & 0x7) << 48;
                Data |= (ulong)(BDiff & 0x7) << 40;
            }
            else
            {
                Data |= (ulong)(R1 / 0x11) << 60;
                Data |= (ulong)(G1 / 0x11) << 52;
                Data |= (ulong)(B1 / 0x11) << 44;

                Data |= (ulong)(R2 / 0x11) << 56;
                Data |= (ulong)(G2 / 0x11) << 48;
                Data |= (ulong)(B2 / 0x11) << 40;
            }
        }

        public static void GenPixDiff(ref ulong Data, Rgba32[] Pixels, Rgba32 BaseColor, int Modifier, int XOffs, int XEnd, int YOffs, int YEnd)
        {
            int BaseMean = (BaseColor.R + BaseColor.G + BaseColor.B) / 3;
            int i = 0;
            for (int yy = YOffs; yy < YEnd; yy++)
            {
                for (int xx = XOffs; xx < XEnd; xx++)
                {
                    int Diff = ((Pixels[i].R + Pixels[i].G + Pixels[i].B) / 3) - BaseMean;

                    if (Diff < 0) Data |= 1ul << (xx * 4 + yy + 16);
                    int tbldiff1 = Math.Abs(Diff) - ETC1Modifiers[Modifier, 0];
                    int tbldiff2 = Math.Abs(Diff) - ETC1Modifiers[Modifier, 1];

                    if (Math.Abs(tbldiff2) < Math.Abs(tbldiff1)) Data |= 1ul << (xx * 4 + yy);
                    i++;
                }
            }
        }

        public static int GenModifier(out Rgba32 BaseColor, Rgba32[] Pixels)
        {
            Rgba32 Max = new Rgba32(255, 255, 255);
            Rgba32 Min = new Rgba32(0, 0, 0);
            int MinY = int.MaxValue;
            int MaxY = int.MinValue;
            for (int i = 0; i < 8; i++)
            {
                if (Pixels[i].A == 0) continue;
                int Y = (Pixels[i].R + Pixels[i].G + Pixels[i].B) / 3;
                if (Y > MaxY)
                {
                    MaxY = Y;
                    Max = Pixels[i];
                }
                if (Y < MinY)
                {
                    MinY = Y;
                    Min = Pixels[i];
                }
            }
            int DiffMean = (Max.R - Min.R + Max.G - Min.G + Max.B - Min.B) / 3;
            int ModDiff = int.MaxValue;
            int Modifier = -1;
            int Mode = -1;
            for (int i = 0; i < 8; i++)
            {
                int SS = ETC1Modifiers[i, 0] * 2;
                int SB = ETC1Modifiers[i, 0] + ETC1Modifiers[i, 1];
                int BB = ETC1Modifiers[i, 1] * 2;
                if (SS > 255) SS = 255;
                if (SB > 255) SB = 255;
                if (BB > 255) BB = 255;
                if (Math.Abs(DiffMean - SS) < ModDiff)
                {
                    ModDiff = Math.Abs(DiffMean - SS);
                    Modifier = i;
                    Mode = 0;
                }
                if (Math.Abs(DiffMean - SB) < ModDiff)
                {
                    ModDiff = Math.Abs(DiffMean - SB);
                    Modifier = i;
                    Mode = 1;
                }
                if (Math.Abs(DiffMean - BB) < ModDiff)
                {
                    ModDiff = Math.Abs(DiffMean - BB);
                    Modifier = i;
                    Mode = 2;
                }
            }
            if (Mode == 1)
            {
                float div1 = ETC1Modifiers[Modifier, 0] / (float)ETC1Modifiers[Modifier, 1];
                float div2 = 1f - div1;
                BaseColor = new Rgba32(ColorClamp(Min.R * div1 + Max.R * div2), ColorClamp(Min.G * div1 + Max.G * div2), ColorClamp(Min.B * div1 + Max.B * div2));
            }
            else
            {
                BaseColor = new Rgba32((byte)((Min.R + Max.R) >> 1), (byte)((Min.G + Max.G) >> 1), (byte)((Min.B + Max.B) >> 1));
            }
            return Modifier;
        }

        public static void SetTable1(ref ulong Data, int Table)
        {
            Data &= ~(7ul << 37);
            Data |= (ulong)(Table & 0x7) << 37;
        }

        public static void SetTable2(ref ulong Data, int Table)
        {
            Data &= ~(7ul << 34);
            Data |= (ulong)(Table & 0x7) << 34;
        }

        public static byte ColorClamp(float Color)
        {
            int color = (int)Color;
            if (color > 255) return 255;
            if (color < 0) return 0;
            return (byte)color;
        }

        public static byte ColorClamp(int Color)
        {
            if (Color > 255) return 255;
            if (Color < 0) return 0;
            return (byte)Color;
        }
    }
    public static class PVRTC
    {

    }
}