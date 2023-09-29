using Sen.Shell.Kernel.Support.TextureEncode.TextureCoder;
using Sen.Shell.Kernel.Standards.IOModule.Buffer;
using Sen.Shell.Kernel.Internal;
namespace Sen.Shell.Kernel.Support.TextureEncode.RSB
{


    public abstract class TextureFormatHandlerAbstract
    {
        public abstract SenBuffer Decode_A8(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_ARGB1555(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_ARGB4444(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_L8(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_LA44(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_LA88(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGB565(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGB565_Block(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGBA4444(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGBA4444_Block(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGBA5551(SenBuffer encodedPixels, int width, int height);

        public abstract SenBuffer Decode_RGBA5551_Block(SenBuffer encodedPixels, int width, int height);

        public abstract Image<Rgba32> Decode_ARGB8888(byte[] encodedPixels, int width, int height);

        public abstract Image<Rgba32> Decode_RGBA8888(byte[] encodedPixels, int width, int height);

        //Encode
        public abstract SenBuffer Encode_A8(SenBuffer imageBytes);

        public abstract SenBuffer Encode_ARGB1555(SenBuffer imageBytes);

        public abstract SenBuffer Encode_ARGB4444(SenBuffer imageBytes);

        public abstract SenBuffer Encode_L8(SenBuffer imageBytes);

        public abstract SenBuffer Encode_LA44(SenBuffer imageBytes);

        public abstract SenBuffer Encode_LA88(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGB565(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGB565_Block(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGBA4444(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGBA4444_Block(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGBA5551(SenBuffer imageBytes);

        public abstract SenBuffer Encode_RGBA5551_Block(SenBuffer imageBytes);

        public abstract byte[] Encode_ARGB8888(byte[] imageBytes);

        public abstract byte[] Encode_RGBA8888(byte[] imagebytes);

    }

    public class TextureFormatHandler : TextureFormatHandlerAbstract
    {
        public TextureFormatHandler() { }
        public override SenBuffer Decode_A8(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                imageData[i].R = 255;
                imageData[i].G = 255;
                imageData[i].B = 255;
                imageData[i].A = encodedPixels.readUInt8();
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_ARGB1555(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var r = (temp_pixels & 0x7C00) >> 10;
                var g = (temp_pixels & 0x3E0) >> 5;
                var b = temp_pixels & 0x1F;
                imageData[i] = new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)), (byte)-(temp_pixels >> 15));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_ARGB4444(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var a = temp_pixels >> 12;
                var r = (temp_pixels & 0xF00) >> 8;
                var g = (temp_pixels & 0xF0) >> 4;
                var b = temp_pixels & 0xF;
                imageData[i] = new Rgba32((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b), (byte)((a << 4) | a));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override Image<Rgba32> Decode_ARGB8888(byte[] encodedPixels, int width, int height)
        {
            var image = new Image<Rgba32>(width, height);
            var index = 0;
            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var b = encodedPixels[index++];
                    var g = encodedPixels[index++];
                    var r = encodedPixels[index++];
                    var a = encodedPixels[index++];

                    image[x, y] = new Rgba32(r, g, b, a);
                }
            }

            return image;
        }

        public override SenBuffer Decode_L8(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var l = encodedPixels.readUInt8();
                imageData[i].R = l;
                imageData[i].G = l;
                imageData[i].B = l;
                imageData[i].A = 255;
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_LA44(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt8();
                var a = temp_pixels & 0xF;
                temp_pixels >>= 4;
                var l = (byte)(temp_pixels | (temp_pixels << 4));
                imageData[i].R = l;
                imageData[i].G = l;
                imageData[i].B = l;
                imageData[i].A = (byte)(a | (a << 4));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_LA88(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var l = (byte)(temp_pixels >> 8);
                imageData[i].R = l;
                imageData[i].G = l;
                imageData[i].B = l;
                imageData[i].A = (byte)(temp_pixels & 0xFF);
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGB565(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var r = temp_pixels >> 11;
                var g = (temp_pixels & 0x7E0) >> 5;
                var b = temp_pixels & 0x1F;
                imageData[i] = new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 2) | (g >> 4)), (byte)((b << 3) | (b >> 2)));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGB565_Block(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            var temp_pixels = encodedPixels.readUInt16LE();
                            if ((i + j) < height && (w + k) < width)
                            {
                                imageData[(i + j) * width + w + k] = new Rgba32((byte)((temp_pixels & 0xF800) >> 8), (byte)((temp_pixels & 0x7E0) >> 3), (byte)((temp_pixels & 0x1F) << 3), 255);
                            }
                        }
                    }
                }
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGBA4444(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var r = temp_pixels >> 12;
                var g = (temp_pixels & 0xF00) >> 8;
                var b = (temp_pixels & 0xF0) >> 4;
                var a = temp_pixels & 0xF;
                imageData[i] = new Rgba32((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b), (byte)((a << 4) | a));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGBA4444_Block(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            var temp_pixels = encodedPixels.readUInt16LE();
                            if ((i + j) < height && (w + k) < width)
                            {
                                var r = temp_pixels >> 12;
                                var g = (temp_pixels & 0xF00) >> 8;
                                var b = (temp_pixels & 0xF0) >> 4;
                                var a = temp_pixels & 0xF;
                                imageData[(i + j) * width + w + k] = new Rgba32((byte)((r << 4) | r), (byte)((g << 4) | g), (byte)((b << 4) | b), (byte)((a << 4) | a));
                            }
                        }
                    }
                }
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGBA5551(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < square; i++)
            {
                var temp_pixels = encodedPixels.readUInt16LE();
                var r = (temp_pixels & 0xF800) >> 11;
                var g = (temp_pixels & 0x7C0) >> 6;
                var b = (temp_pixels & 0x3E) >> 1;
                imageData[i] = new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)), (byte)-(temp_pixels & 0x1));
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public override SenBuffer Decode_RGBA5551_Block(SenBuffer encodedPixels, int width, int height)
        {
            var square = width * height;
            var imageData = new Rgba32[square];
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            var temp_pixels = encodedPixels.readUInt16LE();
                            if ((i + j) < height && (w + k) < width)
                            {
                                var r = temp_pixels >> 11;
                                var g = (temp_pixels & 0x7C0) >> 6;
                                var b = (temp_pixels & 0x3E) >> 1;
                                imageData[(i + j) * width + w + k] = new Rgba32((byte)((r << 3) | (r >> 2)), (byte)((g << 3) | (g >> 2)), (byte)((b << 3) | (b >> 2)), (byte)-(temp_pixels & 0x1));
                            }
                        }
                    }
                }
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }


        public override Image<Rgba32> Decode_RGBA8888(byte[] encodedPixels, int width, int height)
        {
            var image = new Image<Rgba32>(width, height);
            var index = 0;
            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var r = encodedPixels[index++];
                    var g = encodedPixels[index++];
                    var b = encodedPixels[index++];
                    var a = encodedPixels[index++];
                    image[x, y] = new Rgba32(r, g, b, a);
                }
            }

            return image;
        }

        public override SenBuffer Encode_A8(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            SenBuffer image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt8(imageData[i].A);
            }
            return image_encode;
        }

        public override SenBuffer Encode_ARGB1555(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)(((imageData[i].A & 0x80) << 8) | (imageData[i].B >> 3) | ((imageData[i].G & 0xF8) << 2) | ((imageData[i].R & 0xF8) << 7)));
            }
            return image_encode;
        }

        public override SenBuffer Encode_ARGB4444(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)((imageData[i].B >> 4) | (imageData[i].G & 0xF0) | ((imageData[i].R & 0xF0) << 4) | ((imageData[i].A & 0xF0) << 8)));
            }
            return image_encode;
        }

        public override byte[] Encode_ARGB8888(byte[] imageBytes)
        {
            using var ms = new MemoryStream(imageBytes);
            {
                using var image = Image.Load<Rgba32>(ms);
                {
                    var width = image.Width;
                    var height = image.Height;

                    var encodedPixels = new byte[width * height * 4];

                    var index = 0;
                    for (var y = 0; y < height; y++)
                    {
                        for (var x = 0; x < width; x++)
                        {
                            var pixel = image[x, y];
                            encodedPixels[index++] = pixel.B;
                            encodedPixels[index++] = pixel.G;
                            encodedPixels[index++] = pixel.R;
                            encodedPixels[index++] = pixel.A;
                        }
                    }

                    return encodedPixels;
                }
            }
        }

        public override SenBuffer Encode_L8(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt8(Max(imageData[i].R * 0.299 + imageData[i].G * 0.587 + imageData[i].B * 0.114));
            }
            return image_encode;
        }

        public override SenBuffer Encode_LA44(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt8((byte)(((Max(imageData[i].R * 0.299 + imageData[i].G * 0.587 + imageData[i].B * 0.114)) & 0xF0) | ((imageData[i].A) >> 4)));
            }
            return image_encode;
        }

        public override SenBuffer Encode_LA88(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)(((Max(imageData[i].R * 0.299 + imageData[i].G * 0.587 + imageData[i].B * 0.114)) << 8) | imageData[i].A));
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGB565(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)((imageData[i].B >> 3) | ((imageData[i].G & 0xFC) << 3) | ((imageData[i].R & 0xF8) << 8)));
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGB565_Block(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var image_encode = new SenBuffer();
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            if ((i + j) < height && (w + k) < width)
                            {
                                var temp = (i + j) * width + w + k;
                                image_encode.writeUInt16LE((ushort)(((imageData[temp].B & 0xF8) >> 3) | ((imageData[temp].G & 0xFC) << 3) | ((imageData[temp].R & 0xF8) << 8)));
                            }
                            else
                            {
                                image_encode.writeUInt16LE(0);
                            }
                        }
                    }
                }
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGBA4444(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            SenBuffer image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)((imageData[i].A >> 4) | (imageData[i].B & 0xF0) | ((imageData[i].G & 0xF0) << 4) | ((imageData[i].R & 0xF0) << 8)));
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGBA4444_Block(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            SenBuffer image_encode = new SenBuffer();
            var newwidth = width;
            if ((newwidth & 31) != 0)
            {
                newwidth |= 31;
                newwidth++;
            }
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            if ((i + j) < height && (w + k) < width)
                            {
                                var temp = (i + j) * width + w + k;
                                image_encode.writeUInt16LE((ushort)((imageData[temp].A >> 4) | (imageData[temp].B & 0xF0) | ((imageData[temp].G & 0xF0) << 4) | ((imageData[temp].R & 0xF0) << 8)));
                            }
                            else
                            {
                                image_encode.writeUInt16LE(0);
                            }
                        }
                    }
                }
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGBA5551(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var square = width * height;
            var image_encode = new SenBuffer();
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt16LE((ushort)(((imageData[i].A & 0x80) >> 7) | ((imageData[i].B & 0xF8) >> 2) | ((imageData[i].G & 0xF8) << 3) | ((imageData[i].R & 0xF8) << 8)));
            }
            return image_encode;
        }

        public override SenBuffer Encode_RGBA5551_Block(SenBuffer imageBytes)
        {
            var imageData = imageBytes.getImageData();
            var width = imageBytes.imageWidth;
            var height = imageBytes.imageHeight;
            var image_encode = new SenBuffer();
            for (var i = 0; i < height; i += 32)
            {
                for (var w = 0; w < width; w += 32)
                {
                    for (var j = 0; j < 32; j++)
                    {
                        for (var k = 0; k < 32; k++)
                        {
                            if ((i + j) < height && (w + k) < width)
                            {
                                var temp = (i + j) * width + w + k;
                                image_encode.writeUInt16LE((ushort)(((imageData[temp].A & 0x80) >> 7) | ((imageData[temp].B & 0xF8) >> 2) | ((imageData[temp].G & 0xF8) << 3) | ((imageData[temp].R & 0xF8) << 8)));
                            }
                            else
                            {
                                image_encode.writeUInt16LE(0);
                            }
                        }
                    }
                }
            }
            return image_encode;
        }

        public override byte[] Encode_RGBA8888(byte[] imageBytes)
        {
            using var ms = new MemoryStream(imageBytes);
            {
                using var image = Image.Load<Rgba32>(ms);
                {
                    var width = image.Width;
                    var height = image.Height;

                    var encodedPixels = new byte[width * height * 4];

                    var index = 0;
                    for (var y = 0; y < height; y++)
                    {
                        for (var x = 0; x < width; x++)
                        {
                            var pixel = image[x, y];
                            encodedPixels[index++] = pixel.R;
                            encodedPixels[index++] = pixel.G;
                            encodedPixels[index++] = pixel.B;
                            encodedPixels[index++] = pixel.A;
                        }
                    }

                    return encodedPixels;
                }
            }
        }

        public static byte Max(double a)
        {
            var k = (int)a;
            if (k >= 255) return 255;
            return (byte)k;
        }

    }



    public abstract class TextureEncoderFastAbstraction
    {

        // Decode
        public abstract void Create_A8_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_ARGB1555_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_ARGB4444_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_L8_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_LA44_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_LA88_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGB565_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGB565_Block_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGBA4444_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGBA4444_Block_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGBA5551_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGBA5551_Block_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_ARGB8888_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_RGBA8888_Decode(string input_file, string output_file, int width, int height);

        public abstract void Create_ETC1_RGB_Decode(string path_in, string path_out, int width, int height);

        public abstract void Create_ETC1_RGB_A8_Decode(string path_in, string path_out, int width, int height);

        public abstract void Create_ETC1_RGB_A_Palette_Decode(string path_in, string path_out, int width, int height);

        public abstract void Create_PVRTC1_4BPP_RGB_Decode(string path_in, string path_out, int width, int height);

        public abstract void Create_PVRTC1_4BPP_RGBA_Decode(string path_in, string path_out, int width, int height);

        public abstract void Create_PVRTC1_4BPP_RGBA_A8_Decode(string path_in, string path_out, int width, int height);

        // Encode
        public abstract void Create_A8_Encode(string input_file, string output_file);

        public abstract void Create_ARGB1555_Encode(string input_file, string output_file);

        public abstract void Create_ARGB4444_Encode(string input_file, string output_file);

        public abstract void Create_RGBA8888_Encode(string input_file, string output_file);

        public abstract void Create_L8_Encode(string input_file, string output_file);

        public abstract void Create_LA44_Encode(string input_file, string output_file);

        public abstract void Create_LA88_Encode(string input_file, string output_file);

        public abstract void Create_RGB565_Encode(string input_file, string output_file);

        public abstract void Create_RGB565_Block_Encode(string input_file, string output_file);

        public abstract void Create_RGBA4444_Encode(string input_file, string output_file);

        public abstract void Create_RGBA4444_Block_Encode(string input_file, string output_file);

        public abstract void Create_RGBA5551_Encode(string input_file, string output_file);

        public abstract void Create_RGBA5551_Block_Encode(string input_file, string output_file);

        public abstract void Create_ARGB8888_Encode(string input_file, string output_file);

        public abstract void Create_ETC1_RGB_Encode(string path_in, string path_out);

        public abstract void Create_ETC1_RGB_A8_Encode(string path_in, string path_out);

        public abstract void Create_ETC1_RGB_A_Palette_Encode(string path_in, string path_out);

        public abstract void Create_PVRTC1_4BPP_RGB_Encode(string path_in, string path_out);

        public abstract void Create_PVRTC1_4BPP_RGBA_Encode(string path_in, string path_out);

        public abstract void Create_PVRTC1_4BPP_RGBA_A8_Encode(string path_in, string path_out);

    }


    public unsafe sealed class TextureEncoderFast : TextureEncoderFastAbstraction
    {

        public unsafe sealed override void Create_A8_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_A8(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB1555_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_ARGB1555(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB4444_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_ARGB4444(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB8888_Decode(string input_file, string output_file, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            using var image = bitmap.Decode_ARGB8888(fs.ReadBytes(input_file), width, height);
            {
                image.Save(output_file);
            }
            return;
        }

        public unsafe sealed override void Create_L8_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_L8(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_LA44_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_LA44(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_LA88_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_LA88(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGB565_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGB565(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGB565_Block_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGB565_Block(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA4444_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGBA4444(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA4444_Block_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGBA4444_Block(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA5551_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGBA5551(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA5551_Block_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Decode_RGBA5551_Block(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA8888_Decode(string input_file, string output_file, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            using var image = bitmap.Decode_RGBA8888(fs.ReadBytes(input_file), width, height);
            {
                image.Save(output_file);
            };
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_Decode(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var image_decode = ETC1Encoder.Decode_ETC1_RGB(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_A8_Decode(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Decode_ETC1_RGB_A8(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_A_Palette_Decode(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Decode_ETC1_RGB_A_Palette(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_PVRTC1_4BPP_RGB_Decode(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Decode_PVRTC1_4BPP_RGB(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }
        public unsafe sealed override void Create_PVRTC1_4BPP_RGBA_Decode(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Decode_PVRTC1_4BPP_RGBA(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }
        public unsafe sealed override void Create_PVRTC1_4BPP_RGBA_A8_Decode(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Decode_PVRTC1_4BPP_RGBA_A8(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }

        // Encode

        public unsafe sealed override void Create_A8_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_A8(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB1555_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_ARGB1555(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB4444_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_ARGB4444(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ARGB8888_Encode(string input_file, string output_file)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            var encodedPixels = bitmap.Encode_ARGB8888(fs.ReadBytes(input_file));
            fs.WriteBytes(output_file, encodedPixels);
            return;
        }

        public unsafe sealed override void Create_L8_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_L8(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_LA44_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_LA44(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_LA88_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_LA88(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGB565_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGB565(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGB565_Block_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGB565_Block(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA4444_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGBA4444(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA4444_Block_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGBA4444_Block(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA5551_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGBA5551(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA5551_Block_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var bitmap = new TextureFormatHandler();
            var image_decode = bitmap.Encode_RGBA5551_Block(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_RGBA8888_Encode(string input_file, string output_file)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            var encodedPixels = bitmap.Encode_RGBA8888(fs.ReadBytes(input_file));
            fs.WriteBytes(output_file, encodedPixels);
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Encode_ETC1_RGB(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_A8_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Encode_ETC1_RGB_A8(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_ETC1_RGB_A_Palette_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Encode_ETC1_RGB_A_Palette(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_PVRTC1_4BPP_RGB_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Encode_PVRTC1_4BPP_RGB(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_PVRTC1_4BPP_RGBA_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Encode_PVRTC1_4BPP_RGBA(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }

        public unsafe sealed override void Create_PVRTC1_4BPP_RGBA_A8_Encode(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = PVRTC1Encoder.Encode_PVRTC1_4BPP_RGBA_A8(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }


    }

    public abstract class TextureEncoderAsyncAbstract
    {
        //Encode
        public abstract Task Create_A8_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ARGB1555_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ARGB4444_Encode_Async(string input_file, string output_file);

        public abstract Task Create_L8_Encode_Async(string input_file, string output_file);

        public abstract Task Create_LA44_Encode_Async(string input_file, string output_file);

        public abstract Task Create_LA88_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGB565_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGB565_Block_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGBA4444_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGBA4444_Block_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGBA5551_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGBA5551_Block_Encode_Async(string input_file, string output_file);

        public abstract Task Create_RGBA8888_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ARGB8888_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ETC1_RGB_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ETC1_RGB_A8_Encode_Async(string input_file, string output_file);

        public abstract Task Create_ETC1_RGB_A_Palette_Encode_Async(string input_file, string output_file);

        public abstract Task Create_PVRTC1_4BPP_RGB_Encode_Async(string input_file, string output_file);

        public abstract Task Create_PVRTC1_4BPP_RGBA_Encode_Async(string input_file, string output_file);

        public abstract Task Create_PVRTC1_4BPP_RGBA_A8_Encode_Async(string input_file, string output_file);

        //Decode

        public abstract Task Create_A8_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ARGB1555_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ARGB4444_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_L8_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_LA44_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_LA88_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGB565_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGB565_Block_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGBA4444_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGBA4444_Block_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGBA5551_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGBA5551_Block_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_RGBA8888_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ARGB8888_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ETC1_RGB_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ETC1_RGB_A8_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_ETC1_RGB_A_Palette_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_PVRTC1_4BPP_RGB_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_PVRTC1_4BPP_RGBA_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task Create_PVRTC1_4BPP_RGBA_A8_Decode_Async(string input_file, string output_file, int width, int height);

        public abstract Task CreateDecodeAsync(dynamic[] images, TextureEncoderUnofficial format);

        public abstract void DecodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format);

        public abstract void EncodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format);

        public abstract Task CreateEncodeAsync(dynamic[] images, TextureEncoderUnofficial format);

    }

    public enum TextureEncoderUnofficial
    {
        A8,
        ARGB8888,

        ARGB1555,

        ARGB4444,

        ATC_RGB,

        ATC_RGBA4,

        DXT1_RGB,

        DXT3_RGBA,

        DXT5_RGBA,

        DTX5_RGBA_Morton,

        DTX_RGBA_MortonBlock,

        DXT_RGBA_Padding,

        ETC1_RGB,

        ETC1_RGB_A_Palette,

        ETC1_RGB_A8,

        L8,

        LA44,

        LA88,

        PVRTC1_4BPP_RGB,

        PVRTC1_4BPP_RGBA,

        PVRTC1_4BPP_RGBA_A8,

        RGB565,

        RGB565_Block,

        RGBA4444,
        RGBA4444_Block,

        RGBA5551,

        RGBA5551_Block,

        RGBA8888,

    }

    public class TextureEncoderAsync : TextureEncoderAsyncAbstract
    {

        public override async Task Create_A8_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_A8(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ARGB1555_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_ARGB1555(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ARGB4444_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_ARGB4444(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_L8_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_L8(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_LA44_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_LA44(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }
        public override async Task Create_LA88_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_LA88(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }
        public override async Task Create_RGB565_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGB565(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }
        public override async Task Create_RGB565_Block_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGB565_Block(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA4444_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGBA4444(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }
        public override async Task Create_RGBA4444_Block_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGBA4444_Block(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }
        public override async Task Create_RGBA5551_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGBA5551(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA5551_Block_Decode_Async(string path, string path_out, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => bitmap.Decode_RGBA5551_Block(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA8888_Decode_Async(string input_file, string output_file, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            using var image = await Task.Run(() => bitmap.Decode_RGBA8888(fs.ReadBytes(input_file), width, height));
            await image.SaveAsync(output_file);
            return;
        }

        public override async Task Create_ARGB8888_Decode_Async(string input_file, string output_file, int width, int height)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            using var image = await Task.Run(() => bitmap.Decode_ARGB8888(fs.ReadBytes(input_file), width, height));
            await image.SaveAsync(output_file);
            return;
        }

        public override async Task Create_ETC1_RGB_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Decode_ETC1_RGB(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ETC1_RGB_A8_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Decode_ETC1_RGB_A8(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ETC1_RGB_A_Palette_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Decode_ETC1_RGB_A_Palette(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGB_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Decode_PVRTC1_4BPP_RGB(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGBA_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Decode_PVRTC1_4BPP_RGBA(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGBA_A8_Decode_Async(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Decode_PVRTC1_4BPP_RGBA_A8(image_bytes, width, height));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_A8_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_A8(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ARGB1555_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_ARGB1555(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ARGB4444_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_ARGB4444(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_L8_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_L8(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_LA44_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_LA44(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_LA88_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_LA88(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGB565_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGB565(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGB565_Block_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGB565_Block(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA4444_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGBA4444(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA4444_Block_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGBA4444_Block(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA5551_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGBA5551(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA5551_Block_Encode_Async(string path_in, string path_out)
        {
            var bitmap = new TextureFormatHandler();
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => bitmap.Encode_RGBA5551_Block(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_RGBA8888_Encode_Async(string input_file, string output_file)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            var encodedPixels = await Task.Run(() => bitmap.Encode_RGBA8888(fs.ReadBytes(input_file)));
            await fs.WriteBytesAsync(output_file, encodedPixels);
            return;
        }

        public override async Task Create_ARGB8888_Encode_Async(string input_file, string output_file)
        {
            var bitmap = new TextureFormatHandler();
            var fs = new Sen.Shell.Kernel.Standards.IOModule.FileSystem();
            var encodedPixels = await Task.Run(() => bitmap.Encode_ARGB8888(fs.ReadBytes(input_file)));
            await fs.WriteBytesAsync(output_file, encodedPixels);
            return;
        }

        public override async Task Create_ETC1_RGB_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Encode_ETC1_RGB(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ETC1_RGB_A8_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Encode_ETC1_RGB_A8(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_ETC1_RGB_A_Palette_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => ETC1Encoder.Encode_ETC1_RGB_A_Palette(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGB_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Encode_PVRTC1_4BPP_RGB(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGBA_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Encode_PVRTC1_4BPP_RGBA(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task Create_PVRTC1_4BPP_RGBA_A8_Encode_Async(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            {
                var image_decode = await Task.Run(() => PVRTC1Encoder.Encode_PVRTC1_4BPP_RGBA_A8(image_bytes));
                await image_decode.OutFileAsync(path_out);
            }
            return;
        }

        public override async Task CreateDecodeAsync(dynamic[] images, TextureEncoderUnofficial format)
        {
            var tasks = new List<Task>();

            foreach (var image in images)
            {
                var sourceImagePath = image.source;
                var outputImagePath = image.output;
                var width = (int)image.width;
                var height = (int)image.height;

                var task = format switch
                {

                    TextureEncoderUnofficial.A8 => this.Create_A8_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ARGB4444 => this.Create_ARGB1555_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ARGB1555 => this.Create_ARGB1555_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ARGB8888 => this.Create_ARGB8888_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.L8 => this.Create_L8_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.LA44 => this.Create_LA44_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.LA88 => this.Create_LA88_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGB565 => this.Create_RGB565_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGB565_Block => this.Create_RGB565_Block_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGBA4444 => this.Create_RGBA4444_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGBA4444_Block => this.Create_RGBA4444_Block_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGBA5551 => this.Create_RGBA5551_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGBA5551_Block => this.Create_RGBA5551_Block_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ETC1_RGB => this.Create_ETC1_RGB_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ETC1_RGB_A8 => this.Create_ETC1_RGB_A8_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ETC1_RGB_A_Palette => this.Create_ETC1_RGB_A_Palette_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGB => this.Create_PVRTC1_4BPP_RGB_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGBA => this.Create_PVRTC1_4BPP_RGBA_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8 => this.Create_PVRTC1_4BPP_RGBA_A8_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.RGBA8888 => this.Create_RGBA8888_Decode_Async(sourceImagePath, outputImagePath, width, height),
                    _ => throw new Exception($"invalid_ptx_format"),
                };
                tasks.Add(task);
            }

            await Task.WhenAll(tasks);
            return;
        }


        public override void EncodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format)
        {
            var task = this.CreateEncodeAsync(images, format);
            task.Wait();
            return;
        }

        public override async Task CreateEncodeAsync(dynamic[] images, TextureEncoderUnofficial format)
        {
            var tasks = new List<Task>();

            foreach (var image in images)
            {
                var sourceImagePath = image.source;
                var outputImagePath = image.output;

                var task = format switch
                {
                    TextureEncoderUnofficial.ARGB8888 => this.Create_ARGB8888_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.A8 => this.Create_A8_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ARGB1555 => this.Create_ARGB1555_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ARGB4444 => this.Create_ARGB4444_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.L8 => this.Create_L8_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.LA44 => this.Create_LA44_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.LA88 => this.Create_LA88_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGB565 => this.Create_RGB565_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGB565_Block => this.Create_RGB565_Block_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGBA4444 => this.Create_RGBA4444_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGBA4444_Block => this.Create_RGBA4444_Block_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGBA5551 => this.Create_RGBA5551_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGBA5551_Block => this.Create_RGBA5551_Block_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ETC1_RGB => this.Create_ETC1_RGB_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ETC1_RGB_A8 => this.Create_ETC1_RGB_A8_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ETC1_RGB_A_Palette => this.Create_ETC1_RGB_A_Palette_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGB => this.Create_PVRTC1_4BPP_RGB_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGBA => this.Create_PVRTC1_4BPP_RGBA_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8 => this.Create_PVRTC1_4BPP_RGBA_A8_Encode_Async(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.RGBA8888 => this.Create_RGBA8888_Encode_Async(sourceImagePath, outputImagePath),
                    _ => throw new Exception($"invalid_ptx_format"),
                };
                tasks.Add(task);
            }

            await Task.WhenAll(tasks);
            return;
        }


        public override void DecodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format)
        {
            var task = this.CreateDecodeAsync(images, format);
            task.Wait();
            return;
        }

    }

    public class ETC1Encoder
    {

        private static Rgba32[] Decode_ETC1_Block(SenBuffer image_bytes, int width, int height)
        {
            var imageData = new Rgba32[width * height];
            for (var y = 0; y < height; y += 4)
            {
                for (var x = 0; x < width; x += 4)
                {
                    var temp = image_bytes.readBigUInt64BE();
                    var color_buffer = new Rgba32[16];
                    ETC1.DecodeETC1(temp, color_buffer);
                    for (var i = 0; i < 4; i++)
                    {
                        for (var j = 0; j < 4; j++)
                        {
                            if ((y + i) < height && (x + j) < width)
                            {
                                imageData[(y + i) * width + x + j] = color_buffer[(i << 2) | j];
                            }
                        }
                    }
                }
            }
            return imageData;
        }

        private unsafe static SenBuffer Encode_ETC1_Block(Rgba32[] imageData, int width, int height)
        {
            var uintArray = new uint[width * height];
            var index = 0;
            for (var i = 0; i < imageData.Length; i++)
            {
                uintArray[index++] = (uint)(imageData[i].A << 24 | imageData[i].R << 16 | imageData[i].G << 8 | imageData[i].B);
            }
            var data = new ulong[width * height / 16];
            fixed (uint* source_block = uintArray)
            {
                fixed (ulong* destination_block = data)
                {
                    LotusAPI.EncodeETC1Fast(source_block, destination_block, (uint)(width * height / 16), (uint)width);
                }
            }
            var image_encode = new SenBuffer();
            for (var i = 0; i < data.Length; i++)
            {
                image_encode.writeBigUInt64LE(data[i]);
            }
            return image_encode;
        }


        public static SenBuffer Decode_ETC1_RGB(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_ETC1_Block(image_bytes, width, height);
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Decode_ETC1_RGB_A8(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_ETC1_Block(image_bytes, width, height);
            var square = width * height;
            for (var i = 0; i < square; i++)
            {
                imageData[i].A = image_bytes.readUInt8();
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Decode_ETC1_RGB_A_Palette(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_ETC1_Block(image_bytes, width, height);
            int num = image_bytes.readUInt8();
            byte[] index_table = new byte[num == 0 ? 2 : num];
            int bit_depth;
            if (num == 0)
            {
                index_table[0] = 0x0;
                index_table[1] = 0xFF;
                bit_depth = 1;
            }
            else
            {
                for (var i = 0; i < num; i++)
                {
                    var p_byte = image_bytes.readUInt8();
                    index_table[i] = (byte)((p_byte << 4) | p_byte);
                }
                var tableSize = 2;
                for (bit_depth = 1; num > tableSize; bit_depth++)
                {
                    tableSize *= 2;
                }

            }
            int square = width * height;
            int bitPostion = 0;
            byte buffer = 0;
            int readOneBit()
            {
                if (bitPostion == 0)
                {
                    buffer = image_bytes.readUInt8();
                }
                bitPostion = (bitPostion + 7) & 7;
                return ((int)buffer >> bitPostion) & 0b1;
            }
            int readBits(int bits)
            {
                int ans = 0;
                for (var i = bits - 1; i >= 0; i--)
                {
                    ans |= readOneBit() << i;
                }
                return ans;
            }
            for (var k = 0; k < square; k++)
            {
                imageData[k].A = index_table[readBits(bit_depth)];
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Encode_ETC1_RGB(SenBuffer image)
        {
            var imageData = image.getImageData();
            var width = image.imageWidth;
            var height = image.imageHeight;
            var image_encode = Encode_ETC1_Block(imageData, width, height);
            return image_encode;
        }

        public static SenBuffer Encode_ETC1_RGB_A8(SenBuffer image)
        {
            var imageData = image.getImageData();
            var width = image.imageWidth;
            var height = image.imageHeight;
            var square = width * height;
            var image_encode = Encode_ETC1_Block(imageData, width, height);
            for (var i = 0; i < square; i++)
            {
                image_encode.writeUInt8(imageData[i].A);
            }
            return image_encode;
        }

        public static SenBuffer Encode_ETC1_RGB_A_Palette(SenBuffer image)
        {
            var imageData = image.getImageData();
            var width = image.imageWidth;
            var height = image.imageHeight;
            var square = width * height;
            var image_encode = Encode_ETC1_Block(imageData, width, height);
            image_encode.writeUInt8(0x10);
            for (byte i = 0; i < 16; i++)
            {
                image_encode.writeUInt8(i);
            }
            int half_s = square / 2;
            for (var k = 0; k < half_s; k++)
            {
                image_encode.writeUInt8((byte)(imageData[(k << 1)].R & 0xF0 | imageData[(k << 1) | 1].R >> 4));
            }
            if ((square & 1) == 1)
            {
                image_encode.writeUInt8((byte)(imageData[(half_s << 1)].R & 0xF0));
            }
            return image_encode;
        }


    }
    public class PVRTC1Encoder
    {
        private static Rgba32[] Decode_PVRTC1_4BPP_Block(SenBuffer image_bytes, int width, int height)
        {
            var newWidth = width;
            var newHeight = height;
            if (newWidth < 8)
            {
                newWidth = 8;
            }
            if (newHeight < 8)
            {
                newHeight = 8;
            }
            if ((newWidth & (newWidth - 1)) != 0)
            {
                newWidth = 0b10 << ((int)Math.Floor(Math.Log2(newWidth)));
            }
            if ((newHeight & (newHeight - 1)) != 0)
            {
                newHeight = 0b10 << ((int)Math.Floor(Math.Log2(newHeight)));
            }
            if (newWidth != newHeight)
            {
                newWidth = newHeight = Math.Max(newWidth, newHeight);
            }
            var packets = new PVRTC.PvrTcPacket[(newWidth * newHeight) >> 4];
            var packets_length = packets.Length;
            for (var i = 0; i < packets_length; i++)
            {
                packets[i] = new PVRTC.PvrTcPacket(image_bytes.readBigUInt64LE());
            }
            var imageData = PVRTC.Decode_4BPP(packets, newWidth);
            if (newWidth != width || newHeight != height)
            {
                var paddedImage = Image.LoadPixelData<Rgba32>(imageData, newWidth, newHeight);
                paddedImage.Mutate(ctx => ctx.Crop(new Rectangle(0, 0, width, height)));
                imageData = new Rgba32[width * height];
                paddedImage.CopyPixelDataTo(imageData);
            }
            return imageData;
        }

        private static Rgba32[] Encode_PVRTC1_4BPP_Block(SenBuffer inFile, ref int newWidth, int newHeight)
        {
            var image = inFile.getImage();
            newWidth = image.Width;
            newHeight = image.Height;
            if (newWidth < 8)
            {
                newWidth = 8;
            }
            if (newHeight < 8)
            {
                newHeight = 8;
            }
            if ((newWidth & (newWidth - 1)) != 0)
            {
                newWidth = 0b10 << ((int)Math.Floor(Math.Log2(newWidth)));
            }
            if ((newHeight & (newHeight - 1)) != 0)
            {
                newHeight = 0b10 << ((int)Math.Floor(Math.Log2(newHeight)));
            }
            if (newWidth != newHeight)
            {
                newWidth = newHeight = Math.Max(newWidth, newHeight);
            };
            var paddedImage = new Image<Rgba32>(newWidth, newHeight);
            paddedImage.Mutate(ctx => ctx.DrawImage(image, new Point(0, 0), 1f));
            var imageData = new Rgba32[newWidth * newHeight];
            paddedImage.CopyPixelDataTo(imageData);
            return imageData;
        }

        public static SenBuffer Decode_PVRTC1_4BPP_RGB(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_PVRTC1_4BPP_Block(image_bytes, width, height);
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Decode_PVRTC1_4BPP_RGBA(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_PVRTC1_4BPP_Block(image_bytes, width, height);
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Decode_PVRTC1_4BPP_RGBA_A8(SenBuffer image_bytes, int width, int height)
        {
            var imageData = Decode_PVRTC1_4BPP_Block(image_bytes, width, height);
            var square = width * height;
            for (var i = 0; i < square; i++)
            {
                imageData[i].A = image_bytes.readUInt8();
            }
            var image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }


        public static SenBuffer Encode_PVRTC1_4BPP_RGB(SenBuffer image)
        {
            var width = 0;
            var height = 0;
            var imageData = Encode_PVRTC1_4BPP_Block(image, ref width, height);
            var packets = PVRTC.Encode_RGB_4BPP(imageData, width);
            var packets_length = packets.Length;
            var image_encode = new SenBuffer();
            for (var i = 0; i < packets_length; i++)
            {
                image_encode.writeBigUInt64LE(packets[i].PvrTcWord);
            }
            return image_encode;
        }

        public static SenBuffer Encode_PVRTC1_4BPP_RGBA(SenBuffer image)
        {
            var width = 0;
            var height = 0;
            var imageData = Encode_PVRTC1_4BPP_Block(image, ref width, height);
            var packets = PVRTC.Encode_RGBA_4BPP(imageData, width);
            var packets_length = packets.Length;
            var image_encode = new SenBuffer();
            for (var i = 0; i < packets_length; i++)
            {
                image_encode.writeBigUInt64LE(packets[i].PvrTcWord);
            }
            return image_encode;
        }

        public static SenBuffer Encode_PVRTC1_4BPP_RGBA_A8(SenBuffer image)
        {
            var width = 0;
            var height = 0;
            var imageData = Encode_PVRTC1_4BPP_Block(image, ref width, height);
            var packets = PVRTC.Encode_RGBA_4BPP(imageData, width);
            var packets_length = packets.Length;
            var image_encode = new SenBuffer();
            for (var i = 0; i < packets_length; i++)
            {
                image_encode.writeBigUInt64LE(packets[i].PvrTcWord);
            }
            for (var k = 0; k < imageData.Length; k++)
            {
                image_encode.writeUInt8(imageData[k].A);
            }
            return image_encode;
        }
    }
}
