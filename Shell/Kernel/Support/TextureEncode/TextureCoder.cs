namespace Sen.Shell.Kernel.Support.TextureEncode.TextureCoder
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
            for (var i = 0; i < 4; i++)
            {
                for (var j = 0; j < 4; j++)
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
            for (var i = 0; i < 4 * 4; i++)
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
            for (var y = 0; y < 4; y++)
            {
                for (var x = 0; x < 2; x++)
                {
                    Left[y * 2 + x] = Pixels[y * 4 + x];
                }
            }
            return Left;
        }

        public static Rgba32[] GetRightColors(Rgba32[] Pixels)
        {
            Rgba32[] Right = new Rgba32[8];
            for (var y = 0; y < 4; y++)
            {
                for (var x = 2; x < 4; x++)
                {
                    Right[y * 2 + x - 2] = Pixels[y * 4 + x];
                }
            }
            return Right;
        }

        public static Rgba32[] GetTopColors(Rgba32[] Pixels)
        {
            Rgba32[] Top = new Rgba32[8];
            for (var y = 0; y < 2; y++)
            {
                for (var x = 0; x < 4; x++)
                {
                    Top[y * 4 + x] = Pixels[y * 4 + x];
                }
            }
            return Top;
        }

        public static Rgba32[] GetBottomColors(Rgba32[] Pixels)
        {
            Rgba32[] Bottom = new Rgba32[8];
            for (var y = 2; y < 4; y++)
            {
                for (var x = 0; x < 4; x++)
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
            for (var yy = YOffs; yy < YEnd; yy++)
            {
                for (var xx = XOffs; xx < XEnd; xx++)
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
            for (var i = 0; i < 8; i++)
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
            for (var i = 0; i < 8; i++)
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
        public static Rgba32[] Decode_4BPP(PvrTcPacket[] packets, int width)
        {
            int blocks = width >> 2;
            int blockMask = blocks - 1;
            Rgba32[] result = new Rgba32[width * width];
            for (var y = 0; y < blocks; y++)
            {
                for (var x = 0; x < blocks; x++)
                {
                    PvrTcPacket packet = packets[GetMortonNumber(x, y)];
                    uint mod = packet.modulationData;
                    byte[] weights = PvrTcPacket.WEIGHTS;
                    int weightindex = packet.usePunchthroughAlpha ? 16 : 0;
                    byte[][] factorfather = PvrTcPacket.BILINEAR_FACTORS;
                    int factorindex = 0;
                    for (var py = 0; py < 4; py++)
                    {
                        int yOffset = (py < 2) ? -1 : 0;
                        int y0 = (y + yOffset) & blockMask;
                        int y1 = (y0 + 1) & blockMask;
                        for (var px = 0; px < 4; px++)
                        {
                            byte[] factor = factorfather[factorindex];
                            int xOffset = (px < 2) ? -1 : 0;
                            int x0 = (x + xOffset) & blockMask;
                            int x1 = (x0 + 1) & blockMask;
                            PvrTcPacket p0 = packets[GetMortonNumber(x0, y0)];
                            PvrTcPacket p1 = packets[GetMortonNumber(x1, y0)];
                            PvrTcPacket p2 = packets[GetMortonNumber(x0, y1)];
                            PvrTcPacket p3 = packets[GetMortonNumber(x1, y1)];
                            ColorRGBA ca = p0.GetColorA_ColorRGBA() * factor[0] + p1.GetColorA_ColorRGBA() * factor[1] + p2.GetColorA_ColorRGBA() * factor[2] + p3.GetColorA_ColorRGBA() * factor[3];
                            ColorRGBA cb = p0.GetColorB_ColorRGBA() * factor[0] + p1.GetColorB_ColorRGBA() * factor[1] + p2.GetColorB_ColorRGBA() * factor[2] + p3.GetColorB_ColorRGBA() * factor[3];
                            int index = weightindex + (((int)mod & 0b11) << 2);
                            result[(py + (y << 2)) * width + px + (x << 2)] = new Rgba32((byte)((ca.r * weights[index] + cb.r * weights[index + 1]) >> 7), (byte)((ca.g * weights[index] + cb.g * weights[index + 1]) >> 7), (byte)((ca.b * weights[index] + cb.b * weights[index + 1]) >> 7), (byte)((ca.a * weights[index + 2] + cb.a * weights[index + 3]) >> 7));
                            mod >>= 2;
                            factorindex++;
                        }
                    }
                }
            }
            return result;
        }

        public static PvrTcPacket[] Encode_RGBA_4BPP(Rgba32[] colors, int width)
        {
            int blocks = width >> 2;
            int blockMask = blocks - 1;
            PvrTcPacket[] packets = new PvrTcPacket[(width * width) >> 4];
            for (var y = 0; y < blocks; y++)
            {
                for (var x = 0; x < blocks; x++)
                {
                    CalculateBoundingBox(colors, width, x, y, out Rgba32 min, out Rgba32 max);
                    PvrTcPacket packet = new PvrTcPacket();
                    packet.usePunchthroughAlpha = false;
                    packet.SetColorA_RGBA(min);
                    packet.SetColorB_RGBA(max);
                    packets[GetMortonNumber(x, y)] = packet;
                }
            }
            for (var y = 0; y < blocks; y++)
            {
                for (var x = 0; x < blocks; x++)
                {
                    byte[][] factorfather = PvrTcPacket.BILINEAR_FACTORS;
                    int factorindex = 0;
                    int dataindex = (y << 2) * width + (x << 2);
                    uint modulationData = 0;
                    for (var py = 0; py < 4; py++)
                    {
                        int yOffset = (py < 2) ? -1 : 0;
                        int y0 = (y + yOffset) & blockMask;
                        int y1 = (y0 + 1) & blockMask;
                        for (var px = 0; px < 4; px++)
                        {
                            byte[] factor = factorfather[factorindex];
                            int xOffset = (px < 2) ? -1 : 0;
                            int x0 = (x + xOffset) & blockMask;
                            int x1 = (x0 + 1) & blockMask;
                            PvrTcPacket p0 = packets[GetMortonNumber(x0, y0)];
                            PvrTcPacket p1 = packets[GetMortonNumber(x1, y0)];
                            PvrTcPacket p2 = packets[GetMortonNumber(x0, y1)];
                            PvrTcPacket p3 = packets[GetMortonNumber(x1, y1)];
                            ColorRGBA ca = p0.GetColorA_ColorRGBA() * factor[0] + p1.GetColorA_ColorRGBA() * factor[1] + p2.GetColorA_ColorRGBA() * factor[2] + p3.GetColorA_ColorRGBA() * factor[3];
                            ColorRGBA cb = p0.GetColorB_ColorRGBA() * factor[0] + p1.GetColorB_ColorRGBA() * factor[1] + p2.GetColorB_ColorRGBA() * factor[2] + p3.GetColorB_ColorRGBA() * factor[3];
                            Rgba32 pixel = colors[dataindex + py * width + px];
                            ColorRGBA d = cb - ca;
                            ColorRGBA p = new ColorRGBA(pixel.R << 4, pixel.G << 4, pixel.B << 4, pixel.A << 4);
                            ColorRGBA v = p - ca;
                            int projection = (v % d) << 4;
                            int lengthSquared = d % d;
                            if (projection > 3 * lengthSquared) modulationData++;
                            if (projection > 8 * lengthSquared) modulationData++;
                            if (projection > 13 * lengthSquared) modulationData++;
                            modulationData = RotateRight(modulationData, 2);
                            factorindex++;
                        }
                    }
                    packets[GetMortonNumber(x, y)].modulationData = modulationData;
                }
            }
            return packets;
        }

        public static PvrTcPacket[] Encode_RGB_4BPP(Rgba32[] colors, int width)
        {
            int blocks = width >> 2;
            int blockMask = blocks - 1;
            PvrTcPacket[] packets = new PvrTcPacket[(width * width) >> 4];
            for (var y = 0; y < blocks; y++)
            {
                for (var x = 0; x < blocks; x++)
                {
                    CalculateBoundingBox(colors, width, x, y, out Rgba32 min, out Rgba32 max);
                    PvrTcPacket packet = new PvrTcPacket();
                    packet.usePunchthroughAlpha = false;
                    packet.SetColorA_RGB(min);
                    packet.SetColorB_RGB(max);
                    packets[GetMortonNumber(x, y)] = packet;
                }
            }
            for (var y = 0; y < blocks; y++)
            {
                for (var x = 0; x < blocks; x++)
                {
                    byte[][] factorfather = PvrTcPacket.BILINEAR_FACTORS;
                    int factorindex = 0;
                    int dataindex = (y << 2) * width + (x << 2);
                    uint modulationData = 0;
                    for (var py = 0; py < 4; py++)
                    {
                        int yOffset = (py < 2) ? -1 : 0;
                        int y0 = (y + yOffset) & blockMask;
                        int y1 = (y0 + 1) & blockMask;
                        for (var px = 0; px < 4; px++)
                        {
                            byte[] factor = factorfather[factorindex];
                            int xOffset = (px < 2) ? -1 : 0;
                            int x0 = (x + xOffset) & blockMask;
                            int x1 = (x0 + 1) & blockMask;
                            PvrTcPacket p0 = packets[GetMortonNumber(x0, y0)];
                            PvrTcPacket p1 = packets[GetMortonNumber(x1, y0)];
                            PvrTcPacket p2 = packets[GetMortonNumber(x0, y1)];
                            PvrTcPacket p3 = packets[GetMortonNumber(x1, y1)];
                            ColorRGB ca = p0.GetColorA_ColorRGB() * factor[0] + p1.GetColorA_ColorRGB() * factor[1] + p2.GetColorA_ColorRGB() * factor[2] + p3.GetColorA_ColorRGB() * factor[3];
                            ColorRGB cb = p0.GetColorB_ColorRGB() * factor[0] + p1.GetColorB_ColorRGB() * factor[1] + p2.GetColorB_ColorRGB() * factor[2] + p3.GetColorB_ColorRGB() * factor[3];
                            Rgba32 pixel = colors[dataindex + py * width + px];
                            ColorRGB d = cb - ca;
                            ColorRGB p = new ColorRGB(pixel.R << 4, pixel.G << 4, pixel.B << 4);
                            ColorRGB v = p - ca;
                            int projection = (v % d) << 4;
                            int lengthSquared = d % d;
                            if (projection > 3 * lengthSquared) modulationData++;
                            if (projection > 8 * lengthSquared) modulationData++;
                            if (projection > 13 * lengthSquared) modulationData++;
                            modulationData = RotateRight(modulationData, 2);
                            factorindex++;
                        }
                    }
                    packets[GetMortonNumber(x, y)].modulationData = modulationData;
                }
            }
            return packets;
        }

        static void CalculateBoundingBox(Rgba32[] colors, int width, int blockX, int blockY, out Rgba32 min, out Rgba32 max)
        {
            //same as DXT
            byte maxr = 0, maxg = 0, maxb = 0, maxa = 0;
            byte minr = 255, ming = 255, minb = 255, mina = 255;
            int beginindex = (blockY << 2) * width + (blockX << 2);
            for (var i = 0; i < 4; i++)
            {
                int nindex = beginindex + i * width;
                for (var j = 0; j < 4; j++)
                {
                    int index = nindex + j;
                    byte temp;
                    temp = colors[index].R;
                    if (temp > maxr) maxr = temp;
                    if (temp < minr) minr = temp;
                    temp = colors[index].G;
                    if (temp > maxg) maxg = temp;
                    if (temp < ming) ming = temp;
                    temp = colors[index].B;
                    if (temp > maxb) maxb = temp;
                    if (temp < minb) minb = temp;
                    temp = colors[index].A;
                    if (temp > maxa) maxa = temp;
                    if (temp < mina) mina = temp;
                }
            }
            min = new Rgba32(minr, ming, minb, mina);
            max = new Rgba32(maxr, maxg, maxb, maxa);
        }

        static uint RotateRight(uint value, int shift)
        {
            if ((shift &= 31) == 0)
            {
                return value;
            }
            return (value >> shift) | (value << (32 - shift));
        }

        static int GetMortonNumber(int x, int y)
        {
            return (MORTON_TABLE[x >> 8] << 17) | (MORTON_TABLE[y >> 8] << 16) | (MORTON_TABLE[x & 0xFF] << 1) | MORTON_TABLE[y & 0xFF];
        }

        static readonly int[] MORTON_TABLE = {
            0x0000, 0x0001, 0x0004, 0x0005, 0x0010, 0x0011, 0x0014, 0x0015,
            0x0040, 0x0041, 0x0044, 0x0045, 0x0050, 0x0051, 0x0054, 0x0055,
            0x0100, 0x0101, 0x0104, 0x0105, 0x0110, 0x0111, 0x0114, 0x0115,
            0x0140, 0x0141, 0x0144, 0x0145, 0x0150, 0x0151, 0x0154, 0x0155,
            0x0400, 0x0401, 0x0404, 0x0405, 0x0410, 0x0411, 0x0414, 0x0415,
            0x0440, 0x0441, 0x0444, 0x0445, 0x0450, 0x0451, 0x0454, 0x0455,
            0x0500, 0x0501, 0x0504, 0x0505, 0x0510, 0x0511, 0x0514, 0x0515,
            0x0540, 0x0541, 0x0544, 0x0545, 0x0550, 0x0551, 0x0554, 0x0555,
            0x1000, 0x1001, 0x1004, 0x1005, 0x1010, 0x1011, 0x1014, 0x1015,
            0x1040, 0x1041, 0x1044, 0x1045, 0x1050, 0x1051, 0x1054, 0x1055,
            0x1100, 0x1101, 0x1104, 0x1105, 0x1110, 0x1111, 0x1114, 0x1115,
            0x1140, 0x1141, 0x1144, 0x1145, 0x1150, 0x1151, 0x1154, 0x1155,
            0x1400, 0x1401, 0x1404, 0x1405, 0x1410, 0x1411, 0x1414, 0x1415,
            0x1440, 0x1441, 0x1444, 0x1445, 0x1450, 0x1451, 0x1454, 0x1455,
            0x1500, 0x1501, 0x1504, 0x1505, 0x1510, 0x1511, 0x1514, 0x1515,
            0x1540, 0x1541, 0x1544, 0x1545, 0x1550, 0x1551, 0x1554, 0x1555,
            0x4000, 0x4001, 0x4004, 0x4005, 0x4010, 0x4011, 0x4014, 0x4015,
            0x4040, 0x4041, 0x4044, 0x4045, 0x4050, 0x4051, 0x4054, 0x4055,
            0x4100, 0x4101, 0x4104, 0x4105, 0x4110, 0x4111, 0x4114, 0x4115,
            0x4140, 0x4141, 0x4144, 0x4145, 0x4150, 0x4151, 0x4154, 0x4155,
            0x4400, 0x4401, 0x4404, 0x4405, 0x4410, 0x4411, 0x4414, 0x4415,
            0x4440, 0x4441, 0x4444, 0x4445, 0x4450, 0x4451, 0x4454, 0x4455,
            0x4500, 0x4501, 0x4504, 0x4505, 0x4510, 0x4511, 0x4514, 0x4515,
            0x4540, 0x4541, 0x4544, 0x4545, 0x4550, 0x4551, 0x4554, 0x4555,
            0x5000, 0x5001, 0x5004, 0x5005, 0x5010, 0x5011, 0x5014, 0x5015,
            0x5040, 0x5041, 0x5044, 0x5045, 0x5050, 0x5051, 0x5054, 0x5055,
            0x5100, 0x5101, 0x5104, 0x5105, 0x5110, 0x5111, 0x5114, 0x5115,
            0x5140, 0x5141, 0x5144, 0x5145, 0x5150, 0x5151, 0x5154, 0x5155,
            0x5400, 0x5401, 0x5404, 0x5405, 0x5410, 0x5411, 0x5414, 0x5415,
            0x5440, 0x5441, 0x5444, 0x5445, 0x5450, 0x5451, 0x5454, 0x5455,
            0x5500, 0x5501, 0x5504, 0x5505, 0x5510, 0x5511, 0x5514, 0x5515,
            0x5540, 0x5541, 0x5544, 0x5545, 0x5550, 0x5551, 0x5554, 0x5555
        };

        public class ColorRGBA
        {
            public int r, g, b, a;

            public ColorRGBA()
            {
                r = g = b = a = 255;
            }

            public ColorRGBA(int r, int g, int b)
            {
                this.r = r;
                this.g = g;
                this.b = b;
                a = 255;
            }

            public ColorRGBA(int r, int g, int b, int a)
            {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }

            public static ColorRGBA operator *(ColorRGBA color, int x)
            {
                return new ColorRGBA(color.r * x, color.g * x, color.b * x, color.a * x);
            }

            public static ColorRGBA operator +(ColorRGBA color, ColorRGBA x)
            {
                return new ColorRGBA(color.r + x.r, color.g + x.g, color.b + x.b, color.a + x.a);
            }

            public static ColorRGBA operator -(ColorRGBA color, ColorRGBA x)
            {
                return new ColorRGBA(color.r - x.r, color.g - x.g, color.b - x.b, color.a - x.a);
            }

            public static int operator %(ColorRGBA color, ColorRGBA x)
            {
                return color.r * x.r + color.g * x.g + color.b * x.b + color.a * x.a;
            }
        }

        public class ColorRGB
        {
            public int r, g, b;

            public ColorRGB()
            {
                r = g = b = 255;
            }

            public ColorRGB(int r, int g, int b)
            {
                this.r = r;
                this.g = g;
                this.b = b;
            }

            public static ColorRGB operator *(ColorRGB color, int x)
            {
                return new ColorRGB(color.r * x, color.g * x, color.b * x);
            }

            public static ColorRGB operator +(ColorRGB color, ColorRGB x)
            {
                return new ColorRGB(color.r + x.r, color.g + x.g, color.b + x.b);
            }

            public static ColorRGB operator -(ColorRGB color, ColorRGB x)
            {
                return new ColorRGB(color.r - x.r, color.g - x.g, color.b - x.b);
            }

            public static int operator %(ColorRGB color, ColorRGB x)
            {
                return color.r * x.r + color.g * x.g + color.b * x.b;
            }
        }

        public  struct PvrTcPacket
        {
            public ulong PvrTcWord;

            public PvrTcPacket()
            {
                PvrTcWord = 0;

            }

            public PvrTcPacket(ulong PvrTcWord)
            {
                this.PvrTcWord = PvrTcWord;
            }

            public uint modulationData
            {
                get => (uint)(PvrTcWord & 0xFFFFFFFF);
                set => PvrTcWord |= value;
            }

            public bool usePunchthroughAlpha
            {
                get => ((PvrTcWord >> 32) & 0b1) == 1;
                set => PvrTcWord |= (value ? 1ul : 0ul) << 32;
            }

            public int colorA
            {
                get => (int)((PvrTcWord >> 33) & 0b11111111111111);
                set => PvrTcWord |= ((ulong)(value & 0b11111111111111)) << 33;
            }

            public bool colorAIsOpaque
            {
                get => ((PvrTcWord >> 47) & 0b1) == 1;
                set => PvrTcWord |= (value ? 1ul : 0ul) << 47;
            }

            public int colorB
            {
                get => (int)((PvrTcWord >> 48) & 0b111111111111111);
                set => PvrTcWord |= ((ulong)(value & 0b111111111111111)) << 48;
            }

            public bool colorBIsOpaque
            {
                get => (PvrTcWord >> 63) == 1;
                set => PvrTcWord |= (value ? 1ul : 0ul) << 63;
            }

            public Rgba32 GetColorA()
            {
                int colorA = this.colorA;
                if (colorAIsOpaque)
                {
                    int r = colorA >> 9;
                    int g = (colorA >> 4) & 0x1F;
                    int b = colorA & 0xF;
                    return new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 4) | b));
                }
                else
                {
                    int a = (colorA >> 11) & 0x7;
                    int r = (colorA >> 7) & 0xF;
                    int g = (colorA >> 3) & 0xF;
                    int b = colorA & 0x7;
                    return new Rgba32((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 5) | (b << 2) | (b >> 1)), (byte)((a << 5) | (a << 2) | (a >> 1)));
                }
            }

            public Rgba32 GetColorB()
            {
                int colorB = this.colorB;
                if (colorBIsOpaque)
                {
                    int r = colorB >> 10;
                    int g = (colorB >> 5) & 0x1F;
                    int b = colorB & 0x1F;
                    return new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)));
                }
                else
                {
                    int a = (colorB >> 12) & 0x7;
                    int r = (colorB >> 8) & 0xF;
                    int g = (colorB >> 4) & 0xF;
                    int b = colorB & 0xF;
                    return new Rgba32((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b), (byte)((a << 5) | (a << 2) | (a >> 1)));
                }
            }

            public ColorRGBA GetColorA_ColorRGBA()
            {
                int colorA = this.colorA;
                if (colorAIsOpaque)
                {
                    int r = colorA >> 9;
                    int g = (colorA >> 4) & 0x1F;
                    int b = colorA & 0xF;
                    return new ColorRGBA((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 4) | b));
                }
                else
                {
                    int a = (colorA >> 11) & 0x7;
                    int r = (colorA >> 7) & 0xF;
                    int g = (colorA >> 3) & 0xF;
                    int b = colorA & 0x7;
                    return new ColorRGBA((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 5) | (b << 2) | (b >> 1)), (byte)((a << 5) | (a << 2) | (a >> 1)));
                }
            }

            public ColorRGBA GetColorB_ColorRGBA()
            {
                int colorB = this.colorB;
                if (colorBIsOpaque)
                {
                    int r = colorB >> 10;
                    int g = (colorB >> 5) & 0x1F;
                    int b = colorB & 0x1F;
                    return new ColorRGBA((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)));
                }
                else
                {
                    int a = (colorB >> 12) & 0x7;
                    int r = (colorB >> 8) & 0xF;
                    int g = (colorB >> 4) & 0xF;
                    int b = colorB & 0xF;
                    return new ColorRGBA((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b), (byte)((a << 5) | (a << 2) | (a >> 1)));
                }
            }

            public ColorRGB GetColorA_ColorRGB()
            {
                int colorA = this.colorA;
                if (colorAIsOpaque)
                {
                    int r = colorA >> 9;
                    int g = (colorA >> 4) & 0x1F;
                    int b = colorA & 0xF;
                    return new ColorRGB((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 4) | b));
                }
                else
                {
                    int r = (colorA >> 7) & 0xF;
                    int g = (colorA >> 3) & 0xF;
                    int b = colorA & 0x7;
                    return new ColorRGB((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 5) | (b << 2) | (b >> 1)));
                }
            }

            public ColorRGB GetColorB_ColorRGB()
            {
                int colorB = this.colorB;
                if (colorBIsOpaque)
                {
                    int r = colorB >> 10;
                    int g = (colorB >> 5) & 0x1F;
                    int b = colorB & 0x1F;
                    return new ColorRGB((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)));
                }
                else
                {
                    int r = (colorB >> 8) & 0xF;
                    int g = (colorB >> 4) & 0xF;
                    int b = colorB & 0xF;
                    return new ColorRGB((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b));
                }
            }

            public void SetColorA_RGBA(Rgba32 color)
            {
                int a = color.A >> 5;
                if (a == 0x7)
                {
                    int r = color.R >> 3;
                    int g = color.G >> 3;
                    int b = color.B >> 4;
                    colorA = r << 9 | g << 4 | b;
                    colorAIsOpaque = true;
                }
                else
                {
                    int r = color.R >> 4;
                    int g = color.G >> 4;
                    int b = color.B >> 5;
                    colorA = a << 11 | r << 7 | g << 3 | b;
                    colorAIsOpaque = false;
                }
            }

            public void SetColorB_RGBA(Rgba32 color)
            {
                int a = color.A >> 5;
                if (a == 0x7)
                {
                    int r = color.R >> 3;
                    int g = color.G >> 3;
                    int b = color.B >> 3;
                    colorB = r << 10 | g << 5 | b;
                    colorBIsOpaque = true;
                }
                else
                {
                    int r = color.R >> 4;
                    int g = color.G >> 4;
                    int b = color.B >> 4;
                    colorB = a << 12 | r << 8 | g << 4 | b;
                    colorBIsOpaque = false;
                }
            }

            public void SetColorA_RGB(Rgba32 color)
            {
                int r = color.R >> 3;
                int g = color.G >> 3;
                int b = color.B >> 4;
                colorA = r << 9 | g << 4 | b;
                colorAIsOpaque = true;
            }

            public void SetColorB_RGB(Rgba32 color)
            {
                int r = color.R >> 3;
                int g = color.G >> 3;
                int b = color.B >> 3;
                colorB = r << 10 | g << 5 | b;
                colorBIsOpaque = true;
            }

            public static readonly byte[][] BILINEAR_FACTORS = {
                new byte[]{ 4, 4, 4, 4 },
                new byte[]{ 2, 6, 2, 6 },
                new byte[]{ 8, 0, 8, 0 },
                new byte[]{ 6, 2, 6, 2 },
                new byte[]{ 2, 2, 6, 6 },
                new byte[]{ 1, 3, 3, 9 },
                new byte[]{ 4, 0, 12, 0 },
                new byte[]{ 3, 1, 9, 3 },
                new byte[]{ 8, 8, 0, 0 },
                new byte[]{ 4, 12, 0, 0 },
                new byte[]{ 16, 0, 0, 0 },
                new byte[]{ 12, 4, 0, 0 },
                new byte[]{ 6, 6, 2, 2 },
                new byte[]{ 3, 9, 1, 3 },
                new byte[]{ 12, 0, 4, 0 },
                new byte[]{ 9, 3, 3, 1 },
            };

            public static readonly byte[] WEIGHTS = {
                 8, 0, 8, 0, 5, 3, 5, 3, 3, 5, 3, 5, 0, 8, 0, 8, 8, 0, 8, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 8, 0, 8
            };
        }
    }
}