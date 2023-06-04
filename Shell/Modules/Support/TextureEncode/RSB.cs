using Sen.Shell.Modules.Support.TextureEncode.TextureCoder;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
namespace Sen.Shell.Modules.Support.TextureEncode.RSB
{


    public abstract class TextureFormatHandlerAbstract
    {

        public abstract byte[] EncodeRGBA8888(byte[] imagebytes);

        public abstract byte[] EncodeARGB8888(byte[] imageBytes);

        public abstract Image<Rgba32> DecodeARGB8888(byte[] encodedPixels, int width, int height);

        public abstract Image<Rgba32> DecodeRGBA8888(byte[] encodedPixels, int width, int height);


    }

    public class TextureFormatHandler : TextureFormatHandlerAbstract
    {

        public TextureFormatHandler() { }


        public override byte[] EncodeRGBA8888(byte[] imageBytes)
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


        public override byte[] EncodeARGB8888(byte[] imageBytes)
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

        public override Image<Rgba32> DecodeARGB8888(byte[] encodedPixels, int width, int height)
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


        public override Image<Rgba32> DecodeRGBA8888(byte[] encodedPixels, int width, int height)
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
    }



    public abstract class TextureEncoderFastAbstraction
    {
        public abstract void CreateRGBA8888Encode(string input_file, string output_file);

        public abstract void CreateARGB8888Encode(string input_file, string output_file);

        public abstract void CreateRGBA8888Decode(string input_file, string output_file, int width, int height);

        public abstract void CreateARGB8888Decode(string input_file, string output_file, int width, int height);

        public abstract void Decode_ETC1_RGB(string path_in, string path_out, int width, int height);

        public abstract void Decode_ETC1_RGB_A8(string path_in, string path_out, int width, int height);

        public abstract void Encode_ETC1_RGB(string path_in, string path_out);

        public abstract void Encode_ETC1_RGB_A8(string path_in, string path_out);

    }


    public class TextureEncoderFast : TextureEncoderFastAbstraction
    {

        public override void CreateRGBA8888Encode(string input_file, string output_file)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var encodedPixels = bitmap.EncodeRGBA8888(fs.ReadBytes(input_file));
            fs.WriteBytes(output_file, encodedPixels);
            return;
        }

        public override void CreateARGB8888Encode(string input_file, string output_file)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var encodedPixels = bitmap.EncodeARGB8888(fs.ReadBytes(input_file));
            fs.WriteBytes(output_file, encodedPixels);
            return;
        }

        public override void CreateRGBA8888Decode(string input_file, string output_file, int width, int height)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            using var image = bitmap.DecodeRGBA8888(fs.ReadBytes(input_file), width, height);
            {
                image.Save(output_file);
            };
            return;
        }

        public override void CreateARGB8888Decode(string input_file, string output_file, int width, int height)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            using var image = bitmap.DecodeARGB8888(fs.ReadBytes(input_file), width, height);
            {
                image.Save(output_file);
            }
            return;
        }

        public override void Decode_ETC1_RGB(string path, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path);
            var image_decode = ETC1Encoder.Decode_ETC1_RGB(image_bytes, width, height);
            image_decode.OutFile(path_out);
        }

        public override void Decode_ETC1_RGB_A8(string path_in, string path_out, int width, int height)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Decode_ETC1_RGB_A8(image_bytes, width, height);
            image_decode.OutFile(path_out);
            return;
        }


        public override void Encode_ETC1_RGB(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Encode_ETC1_RGB(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }


        public override void Encode_ETC1_RGB_A8(string path_in, string path_out)
        {
            var image_bytes = new SenBuffer(path_in);
            var image_decode = ETC1Encoder.Encode_ETC1_RGB_A8(image_bytes);
            image_decode.OutFile(path_out);
            return;
        }


    }

    public abstract class TextureEncoderAsyncAbstract
    {
        public abstract Task CreateRGBA8888EncodeAsync(string input_file, string output_file);

        public abstract Task CreateARGB8888EncodeAsync(string input_file, string output_file);

        public abstract Task CreateRGBA8888DecodeAsync(string input_file, string output_file, int width, int height);

        public abstract Task CreateARGB8888DecodeAsync(string input_file, string output_file, int width, int height);

        public abstract Task CreateDecodeAsync(dynamic[] images, TextureEncoderUnofficial format);

        public abstract void DecodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format);

        public abstract void EncodeAsyncImages(dynamic[] images, TextureEncoderUnofficial format);

        public abstract Task CreateEncodeAsync(dynamic[] images, TextureEncoderUnofficial format);

    }

    public enum TextureEncoderUnofficial
    {
        RGBA8888,
        ARGB8888,
    }

    public class TextureEncoderAsync : TextureEncoderAsyncAbstract
    {
        public override async Task CreateRGBA8888EncodeAsync(string input_file, string output_file)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var encodedPixels = await Task.Run(() => bitmap.EncodeRGBA8888(fs.ReadBytes(input_file)));
            await fs.WriteBytesAsync(output_file, encodedPixels);
            return;
        }

        public override async Task CreateARGB8888EncodeAsync(string input_file, string output_file)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var encodedPixels = await Task.Run(() => bitmap.EncodeARGB8888(fs.ReadBytes(input_file)));
            await fs.WriteBytesAsync(output_file, encodedPixels);
            return;
        }

        public override async Task CreateRGBA8888DecodeAsync(string input_file, string output_file, int width, int height)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            using var image = await Task.Run(() => bitmap.DecodeRGBA8888(fs.ReadBytes(input_file), width, height));
            await image.SaveAsync(output_file);
            return;
        }

        public override async Task CreateARGB8888DecodeAsync(string input_file, string output_file, int width, int height)
        {
            var bitmap = new Sen.Shell.Modules.Support.TextureEncode.RSB.TextureFormatHandler();
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            using var image = await Task.Run(() => bitmap.DecodeARGB8888(fs.ReadBytes(input_file), width, height));
            await image.SaveAsync(output_file);
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
                    TextureEncoderUnofficial.RGBA8888 => this.CreateRGBA8888DecodeAsync(sourceImagePath, outputImagePath, width, height),
                    TextureEncoderUnofficial.ARGB8888 => this.CreateARGB8888DecodeAsync(sourceImagePath, outputImagePath, width, height),
                    _ => throw new Exception($"Have not implemented"),
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
                    TextureEncoderUnofficial.RGBA8888 => this.CreateRGBA8888EncodeAsync(sourceImagePath, outputImagePath),
                    TextureEncoderUnofficial.ARGB8888 => this.CreateARGB8888EncodeAsync(sourceImagePath, outputImagePath),
                    _ => throw new Exception($"Have not implemented"),
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
            Rgba32[] imageData = new Rgba32[width * height];
            for (int y = 0; y < height; y += 4)
            {
                for (int x = 0; x < width; x += 4)
                {
                    ulong temp = image_bytes.readBigUInt64BE();
                    Rgba32[] color_buffer = new Rgba32[16];
                    ETC1.DecodeETC1(temp, color_buffer);
                    for (int i = 0; i < 4; i++)
                    {
                        for (int j = 0; j < 4; j++)
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

        private static SenBuffer Encode_ETC1_Block(Rgba32[] imageData, int width, int height)
        {
            SenBuffer image_encode = new SenBuffer();
            Rgba32[] color_buffer = new Rgba32[16];
            for (int y = 0; y < height; y += 4)
            {
                for (int x = 0; x < width; x += 4)
                {
                    for (int i = 0; i < 4; i++)
                    {
                        for (int j = 0; j < 4; j++)
                        {
                            color_buffer[(i << 2) | j] =
                                ((y + i) < height && (x + j) < width)
                                ? imageData[(y + i) * width + x + j]
                                : new Rgba32(0, 0, 0, 255);
                        }
                    }
                    ulong pixels_ulong = ETC1.VerticalETC1(color_buffer);
                    image_encode.writeBigUInt64BE(pixels_ulong);
                }
            }
            return image_encode;
        }
        public static SenBuffer Decode_ETC1_RGB(SenBuffer image_bytes, int width, int height)
        {
            Rgba32[] imageData = Decode_ETC1_Block(image_bytes, width, height);
            SenBuffer image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Decode_ETC1_RGB_A8(SenBuffer image_bytes, int width, int height)
        {
            Rgba32[] imageData = Decode_ETC1_Block(image_bytes, width, height);
            var square = width * height;
            for (var i = 0; i < square; i++)
            {
                imageData[i].A = image_bytes.readUInt8();
            }
            SenBuffer image_decode = new SenBuffer(imageData, width, height);
            return image_decode;
        }

        public static SenBuffer Encode_ETC1_RGB(SenBuffer image) {
            Rgba32[] imageData =  image.getImageData();
            var width = image.imageWidth;
            var height = image.imageHeight;
            SenBuffer image_encode = Encode_ETC1_Block(imageData, width, height);
            return image_encode;
        }

        public static SenBuffer Encode_ETC1_RGB_A8(SenBuffer image) {
            Rgba32[] imageData =  image.getImageData();
            var width = image.imageWidth;
            var height = image.imageHeight;
            var square = width * height;
            SenBuffer image_encode = Encode_ETC1_Block(imageData, width, height);
            for (var i = 0; i < square; i++) {
                image_encode.writeUInt8((sbyte)imageData[i].A);
            }
            return image_encode;
        }
    }
    // SaveImage: image_encode.SaveFile(new_path); || image_encode.OutFile(new_path);
}
