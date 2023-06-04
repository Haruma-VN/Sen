using Jint.Native;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Jint;
using Sen.Shell.Modules.Standards;
using System.Numerics;
using SixLabors.ImageSharp.PixelFormats;
using System.IO;
using SixLabors.ImageSharp.Advanced;

namespace Sen.Shell.Modules.Standards.Bitmap
{
    public class RawStreamWrite
    {
        public static void WriteUIntArrayToFile(uint[] array, string filePath)
        {
            var bytes = new byte[array.Length * sizeof(uint)];
            Buffer.BlockCopy(array, 0, bytes, 0, bytes.Length);

            using var stream = new FileStream(filePath, FileMode.Create);
            {
                stream.Write(bytes, 0, bytes.Length);
            }
        }

        public static void WriteEncodedPixelsToFile(uint[] encodedPixels, string filePath)
        {
            byte[] bytes = new byte[encodedPixels.Length * sizeof(uint)];
            Buffer.BlockCopy(encodedPixels, 0, bytes, 0, bytes.Length);

            File.WriteAllBytes(filePath, bytes);
        }

    }

    public class Dimension<Generic_T>
    {
        protected Generic_T _width;

        protected Generic_T _height;

        #pragma warning disable IDE1006

        public Dimension(Generic_T width, Generic_T height) {
            this._width = width;
            this._height = height;
        }

        public Generic_T width {
            get { return this._width; }
            set {
                if(value != null)
                {
                    this._width = value;
                }
            }
        }

        public Generic_T height
        {
            get { return this._height; }
            set
            {
                if (value != null)
                {
                    this._height = value;
                }
            }
        }
    }

    public class ImageInfo<Generic_T> : Dimension<Generic_T>
    {
        private string _file_path;

        public string file_path
        {
            get { return this._file_path; }
            set
            {
                if(value != null)
                {
                    this._file_path = value;
                }
            }
        }

        public ImageInfo(Generic_T width, Generic_T height, string file_path ) : base(width, height)
        {
                this._file_path = file_path;
        }
    }

    public abstract class Abstract_Bitmap
    {
        public abstract ImageInfo<int> GetDimension(string imagePath);

        public abstract byte[] ExtractAlphaChannel(string image_path);

        public abstract byte[] ExtractRedChannel(string image_path);

        public abstract byte[] ExtractGreenChannel(string image_path);

        public abstract byte[] ExtractBlueChannel(string image_path);

        public abstract Image<Rgba32> JoinImages(Image<Rgba32>[] images, int width, int height);


        public abstract Image<Rgba32> ResizeImage(Sen.Shell.Modules.Standards.Bitmap.ImageInfo<int> original, Sen.Shell.Modules.Standards.Bitmap.ImageInfo<int> output);

        public abstract void SaveImage(string image_path, Image<Rgba32> image_byte);

        public abstract Image<Rgba32> CreateRgbaImage(byte[] alphaBuffer, byte[] redBuffer, byte[] greenBuffer, byte[] blueBuffer, int width, int height);

        public abstract Image<Argb32> CreateArgbImage(byte[] alphaBuffer, byte[] redBuffer, byte[] greenBuffer, byte[] blueBuffer, int width, int height);

        public abstract void RotateImage(string imagePath, string outputPath, float degrees);

        public abstract void ConvertPngToJpeg(string pngImagePath, string jpegImagePath);

        public abstract void ConvertJpegToPng(string jpegImagePath, string pngImagePath);

        public abstract void ExportGifToPngs(string gifImagePath, string outputDirectory, string frame_name);

        public abstract Task SaveImageAsync(string image_path, Image<Rgba32> image_byte);

        public abstract void CompositeImages(dynamic[] image, string filename, string output_directory, int width, int height);

        public abstract void CropAndSaveImage(string sourceImagePath, string outputImagePath, int x, int y, int width, int height);

        public abstract Task CropAndSaveImageAsync(string sourceImagePath, string outputImagePath, int x, int y, int width, int height);

        public abstract void CropAndSaveImages(dynamic[] images);

        public abstract void CreateRGBAOutput(string input_file, string output_file);

        public abstract Task CropAndSaveImagesAsync(dynamic[] images);


    }

    public class Bitmap_Implement : Abstract_Bitmap
    {
        public override ImageInfo<int> GetDimension(string imagePath)
        {
            using var image = Image.Load<Rgba32>(imagePath);
            return new ImageInfo<int>(image.Width, image.Height, imagePath);
        }


        public override byte[] ExtractAlphaChannel(string image_path)
        {

            using var image = Image.Load<Rgba32>(image_path);
            {
                var alphaBuffer = new byte[image.Width * image.Height];

                var index = 0;
                for (var y = 0; y < image.Height; y++)
                {
                    for (var x = 0; x < image.Width; x++)
                    {
                        var pixel = image[x, y];
                        alphaBuffer[index] = pixel.A;
                        index++;
                    }
                }

                return alphaBuffer;
            }
        }

        public override Image<Rgba32> CreateRgbaImage(byte[] alphaBuffer, byte[] redBuffer, byte[] greenBuffer, byte[] blueBuffer, int width, int height)
        {

            var rgbaImage = new Image<Rgba32>(width, height);

            var index = 0;
            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var alpha = alphaBuffer[index];
                    var red = redBuffer[index];
                    var green = greenBuffer[index];
                    var blue = blueBuffer[index];


                    var pixel = new Rgba32(red, green, blue, alpha);
                    rgbaImage[x, y] = pixel;

                    index++;
                }
            }

            return rgbaImage;
        }

        public override Image<Argb32> CreateArgbImage(byte[] alphaBuffer, byte[] redBuffer, byte[] greenBuffer, byte[] blueBuffer, int width, int height)
        {
            var argbImage = new Image<Argb32>(width, height);

            var index = 0;
            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var alpha = alphaBuffer[index];
                    var red = redBuffer[index];
                    var green = greenBuffer[index];
                    var blue = blueBuffer[index];

                    var pixel = new Argb32(alpha, red, green, blue);
                    argbImage[x, y] = pixel;

                    index++;
                }
            }

            return argbImage;
        }

        public override byte[] ExtractRedChannel(string image_path)
        {

            using var image = Image.Load<Rgba32>(image_path);
            {
                var redBuffer = new byte[image.Width * image.Height];

                var index = 0;
                for (var y = 0; y < image.Height; y++)
                {
                    for (var x = 0; x < image.Width; x++)
                    {
                        var pixel = image[x, y];
                        redBuffer[index] = pixel.R;
                        index++;
                    }
                }

                return redBuffer;
            }
        }

        public override byte[] ExtractGreenChannel(string image_path)
        {

            using var image = Image.Load<Rgba32>(image_path);
            {
                var greenBuffer = new byte[image.Width * image.Height];

                var index = 0;
                for (var y = 0; y < image.Height; y++)
                {
                    for (var x = 0; x < image.Width; x++)
                    {
                        var pixel = image[x, y];
                        greenBuffer[index] = pixel.G;
                        index++;
                    }
                }

                return greenBuffer;
            }
        }

        public override byte[] ExtractBlueChannel(string image_path)
        {

            using var image = Image.Load<Rgba32>(image_path);
            {
                var blueBuffer = new byte[image.Width * image.Height];

                var index = 0;
                for (var y = 0; y < image.Height; y++)
                {
                    for (var x = 0; x < image.Width; x++)
                    {
                        var pixel = image[x, y];
                        blueBuffer[index] = pixel.G;
                        index++;
                    }
                }

                return blueBuffer;
            }
        }

        public override Image<Rgba32> ResizeImage(Sen.Shell.Modules.Standards.Bitmap.ImageInfo<int> original, Sen.Shell.Modules.Standards.Bitmap.ImageInfo<int> output)
        {
            using var image = Image.Load<Rgba32>(original.file_path);
            {
                var resizedImage = image.Clone(ctx => ctx.Resize(new ResizeOptions
                {
                    Size = new Size(output.width, output.height),
                    Mode = ResizeMode.Stretch,
                }));

                return resizedImage;
            }
        }

        public override Image<Rgba32> JoinImages(Image<Rgba32>[] images, int width, int height)
        {
            var columns = width / images[0].Width;
            var rows = height / images[0].Height;

            Image<Rgba32> result = new (width, height);

            var index = 0;
            for (var y = 0; y < rows; y++)
            {
                for (var x = 0; x < columns; x++)
                {
                    if (index < images.Length)
                    {
                        var currentImage = images[index];
                        result.Mutate(ctx => ctx
                            .DrawImage(currentImage, new Point(x * currentImage.Width, y * currentImage.Height), 1.0f));
                        index++;
                    }
                }
            }

            return result;
        }

        public override void SaveImage(string image_path, Image<Rgba32> image_byte)
        {
            image_byte.Save(image_path);
            return;
        }

        public override void RotateImage(string imagePath, string outputPath, float degrees)
        {
            using var image = Image.Load<Rgba32>(imagePath);
            {
                var rotatedImage = image.Clone(x => x.Rotate(degrees));
                rotatedImage.Save(outputPath);
                return;
            }
        }

        public override void ConvertPngToJpeg(string pngImagePath, string jpegImagePath)
        {
            using var image = Image.Load<Rgba32>(pngImagePath);
            {
                image.Save(jpegImagePath, new JpegEncoder());
            }
            return;
        }

        public override void ConvertJpegToPng(string jpegImagePath, string pngImagePath)
        {
            using var image = Image.Load<Rgba32>(jpegImagePath);
            {
                image.Save(pngImagePath, new PngEncoder());
            }
            return;
        }


        public override void ExportGifToPngs(string gifImagePath, string outputDirectory, string frame_name)
        {
             var fs = new IOModule.FileSystem();
             var path = new IOModule.Implement_Path();
             using var gifImage = Image.Load<Rgba32>(gifImagePath);
             {
                if(!fs.DirectoryExists(outputDirectory))
                {
                    fs.CreateDirectory(outputDirectory);
                }

                for (var frameIndex = 0; frameIndex < gifImage.Frames.Count; frameIndex++)
                {
                    using var frameImage = gifImage.Clone();
                    {
                        frameImage.Frames.RemoveFrame(frameIndex);
                        var outputPath = path.Join(outputDirectory, $"{frame_name}_{frameIndex}.png");
                        frameImage.Save(outputPath);
                    }
                }
             }
            return;
        }


        public override Task SaveImageAsync(string outputPath, Image<Rgba32> image)
        {
            using var outputStream = File.OpenWrite(outputPath);
            {
                this.SaveImage(outputPath, image);
            }

            return Task.CompletedTask;
        }


        public override void CompositeImages(dynamic[] images, string filename, string outputDirectory, int width, int height)
        {
            using var compositeImage = new Image<Rgba32>(width, height);
            {
                var path = new IOModule.Implement_Path();
                foreach (var jsImage in images)
                {
                    var x = (int)jsImage.x;
                    var y = (int)jsImage.y;
                    var imageWidth = (int)jsImage.width;
                    var imageHeight = (int)jsImage.height;
                    var filePath = jsImage.file_path;

                    var objectImage =  Image.Load<Rgba32>((string)filePath);
                    objectImage.Mutate(ctx => ctx.Resize(new ResizeOptions
                    {
                        Size = new Size(imageWidth, imageHeight),
                        Mode = ResizeMode.Stretch
                    }));

                    compositeImage.Mutate(ctx => ctx.DrawImage(objectImage, new Point(x, y), 1f));
                }

                var outputPath = path.Join(outputDirectory, filename);
                 compositeImage.Save(outputPath);
            }
            return;
        }





        public override void CropAndSaveImage(string sourceImagePath, string outputImagePath, int x, int y, int width, int height)
        {
            using var sourceImage = Image.Load<Rgba32>(sourceImagePath);
            {
                var cropRectangle = new Rectangle(x, y, width, height);
                sourceImage.Mutate(c => c.Crop(cropRectangle));
                sourceImage.Save(outputImagePath);
            }
            return;
        }

        public override async Task CropAndSaveImageAsync(string sourceImagePath, string outputImagePath, int x, int y, int width, int height)
        {
            using var sourceImage = await Image.LoadAsync<Rgba32>(sourceImagePath);
            var cropRectangle = new Rectangle(x, y, width, height);
            sourceImage.Mutate(c => c.Crop(cropRectangle));
            await sourceImage.SaveAsync(outputImagePath);
        }

        public override async Task CropAndSaveImagesAsync(dynamic[] images)
        {
            var tasks = new List<Task>();

            foreach (var image in images)
            {
                var sourceImagePath = image.sourceImagePath;
                var outputImagePath = image.outputImagePath;
                var x = (int)image.x;
                var y = (int)image.y;
                var width = (int)image.width;
                var height = (int)image.height;

                var task = CropAndSaveImageAsync(sourceImagePath, outputImagePath, x, y, width, height);
                tasks.Add(task);
            }

            await Task.WhenAll(tasks);
            return;
        }


        public override void CropAndSaveImages(dynamic[] images)
        {
            var task = CropAndSaveImagesAsync(images);
            task.Wait();
            return;
        }

        public override void CreateRGBAOutput(string input_file, string output_file)
        {

            var dimension = this.GetDimension(input_file);
            var alpha_channel = this.ExtractAlphaChannel(input_file);
            var red_channel = this.ExtractRedChannel(input_file);
            var blue_channel = this.ExtractBlueChannel(input_file);
            var green_channel = this.ExtractGreenChannel(input_file);

            this.SaveImage(output_file, this.CreateRgbaImage(alpha_channel, red_channel, green_channel, blue_channel, dimension.width, dimension.height));
            
            return;
        }
    }

}
