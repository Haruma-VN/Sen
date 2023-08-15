using Sen.Shell.Modules.Standards.IOModule.Buffer;
using NullFX.CRC;
using System.Text.RegularExpressions;

namespace Sen.Shell.Modules.Helper
{


    public abstract class APNGMaker_Abstract
    {
        public abstract void CreateAPNG(string[] imagePath, string outFile, uint[] delayFrames, uint loop, uint width, uint height, bool trimSize);
    }

    public class APNGMaker : APNGMaker_Abstract
    {

        private static readonly byte[] fileSignature = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        private static readonly byte[] imageTrailer = new byte[] { 0x49, 0x45, 0x4E, 0x44 };

        public class ImageData
        {
            public required List<byte[]> pixels { get; set; }

            public required ImageHeader metaData { get; set; }
        }
        public class ImageHeader
        {
            public required uint width { get; set; }
            public required uint height { get; set; }
            public required uint x { get; set; }
            public required uint y { get; set; }
            public required byte depth { get; set; }
            public required byte ctype { get; set; }
            public required byte compress { get; set; }
            public required byte filter { get; set; }
            public required byte interlace { get; set; }

        }
        public override void CreateAPNG(string[] imagePath, string outFile, uint[] delayFrames, uint loop = 0, uint width = 0, uint height = 0, bool trimSize = false)
        {
            var imageData = LoadImage(imagePath, trimSize);
            if (width == 0 || height == 0)
            {
                var maxWidth = new List<uint>();
                var naxHeight = new List<uint>();
                foreach (var img in imageData)
                {
                    maxWidth.Add(img.metaData.width);
                    naxHeight.Add(img.metaData.height);
                }
                if (width == 0) width = maxWidth.Max();
                if (height == 0) height = naxHeight.Max();
            }
            var APNGWriter = new SenBuffer();
            APNGWriter.writeBytes(fileSignature);
            //IHDR
            APNGWriter.writeUInt32BE(13);
            APNGWriter.writeString("IHDR");
            APNGWriter.writeUInt32BE(width);
            APNGWriter.writeUInt32BE(height);
            APNGWriter.writeUInt8(8);
            APNGWriter.writeUInt8(6);
            APNGWriter.writeNull(3);
            APNGWriter.writeUInt32BE(Crc32.ComputeChecksum(APNGWriter.readBytes(17, 12)));
            var isAnimated = imageData.Length > 1;
            if (isAnimated)
            {
                // acTL
                APNGWriter.writeUInt32BE(8);
                APNGWriter.writeString("acTL");
                APNGWriter.writeUInt32BE((uint)imageData.Length);
                APNGWriter.writeUInt32BE(loop);
                APNGWriter.writeUInt32BE(Crc32.ComputeChecksum(APNGWriter.readBytes(12, 37)));
            }
            uint frameIndex = 0;
            for (var i = 0; i < imageData.Length; i++)
            {
                if (isAnimated)
                {
                    APNGWriter.writeUInt32BE(26);
                    var APNGWriterWriteOffset = APNGWriter.writeOffset;
                    APNGWriter.writeString("fcTL");
                    APNGWriter.writeUInt32BE(frameIndex++);
                    APNGWriter.writeUInt32BE(imageData[i].metaData.width);
                    APNGWriter.writeUInt32BE(imageData[i].metaData.height);
                    APNGWriter.writeUInt32BE(imageData[i].metaData.x);
                    APNGWriter.writeUInt32BE(imageData[i].metaData.y);
                    APNGWriter.writeUInt16BE((ushort)delayFrames[i]);
                    APNGWriter.writeUInt16BE(1000);
                    APNGWriter.writeNull(2);
                    APNGWriter.writeUInt32BE(Crc32.ComputeChecksum(APNGWriter.readBytes(30, APNGWriterWriteOffset)));
                }
                if (i > 0)
                {

                    foreach (var imgData in imageData[i].pixels)
                    {
                        var frameData = new SenBuffer();

                        frameData.writeString("fdAT");
                        frameData.writeUInt32BE(frameIndex++);
                        var IDatByte = new byte[imgData.Length - 12];
                        Buffer.BlockCopy(imgData, 8, IDatByte, 0, IDatByte.Length);
                        frameData.writeBytes(IDatByte);
                        APNGWriter.writeUInt32BE((uint)IDatByte.Length + 4);
                        var fdATByte = frameData.toBytes();
                        frameData.Close();
                        APNGWriter.writeBytes(fdATByte);
                        APNGWriter.writeUInt32BE(Crc32.ComputeChecksum(fdATByte));
                    };
                }
                else
                {
                    foreach (var imgData in imageData[i].pixels)
                    {
                        APNGWriter.writeBytes(imgData);
                    }
                }
            }
            APNGWriter.writeNull(4);
            APNGWriter.writeBytes(imageTrailer);
            APNGWriter.writeUInt32BE(Crc32.ComputeChecksum(imageTrailer));
            APNGWriter.OutFile(outFile);
        }
        private ImageData[] LoadImage(string[] imagePath, bool trimSize)
        {
            var imageData = new ImageData[imagePath.Length];
            for (var i = 0; i < imagePath.Length; i++)
            {
                var SenImage = new SenBuffer();
                var bounds = new Rectangle();
                if (trimSize && i > 0)
                {
                    var image = Image.Load<Rgba32>(imagePath[i]);
                    bounds = FindNonTransparentBounds(image);
                    var croppedImage = image.Clone(ctx => ctx.Crop(bounds));
                    var stream = new MemoryStream();
                    croppedImage.SaveAsPng(stream);
                    SenImage = new SenBuffer(stream);
                }
                else
                {
                    SenImage = new SenBuffer(imagePath[i]);
                }
                if (SenImage.readString(4, 0xC) != "IHDR")
                {
                    throw new Exception("Invaild PNG");
                }
                var imageHeader = new ImageHeader()
                {
                    width = SenImage.readUInt32BE(),
                    height = SenImage.readUInt32BE(),
                    x = (trimSize && i > 0) ? (uint)bounds.Left : 0,
                    y = (trimSize && i > 0) ? (uint)bounds.Top : 0,
                    depth = SenImage.readUInt8(),
                    ctype = SenImage.readUInt8(),
                    compress = SenImage.readUInt8(),
                    filter = SenImage.readUInt8(),
                    interlace = SenImage.readUInt8(),
                };
                var IDATList = Find(SenImage.toStream(), "IDAT".ToCharArray());
                imageData[i] = new ImageData()
                {
                    pixels = IDATList,
                    metaData = imageHeader
                };
            }
            return imageData;
        }
        private static List<byte[]> Find(Stream png, Char[] search)
        {
            var result = new List<byte[]>();
            var searchBytes = search.Select(c => (byte)c).ToArray();
            var bytes = new byte[search.Length];
            int i = 0;
            int found = 0;
            while (i < png.Length - 4)
            {
                png.Flush();
                png.Position = i;
                var debug = png.Read(bytes, 0, search.Length);
                i++;
                if (bytes.SequenceEqual(searchBytes))
                {
                    var rawLength = new byte[4];
                    png.Position -= 8;
                    png.Read(rawLength, 0, 4);
                    Array.Reverse(rawLength);
                    var length = BitConverter.ToUInt32(rawLength, 0);
                    var item = new byte[length + 12];
                    result.Add(item);
                    png.Position -= 4;
                    png.Read(result[found], 0, (int)(length + 12));
                    found++;
                }
            }
            return result;
        }

        private static Rectangle FindNonTransparentBounds(Image<Rgba32> image)
        {
            var width = image.Width;
            var height = image.Height;

            int left = width, top = height, right = 0, bottom = 0;

            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    if (image[x, y].A != 0)
                    {
                        left = Math.Min(left, x);
                        top = Math.Min(top, y);
                        right = Math.Max(right, x);
                        bottom = Math.Max(bottom, y);
                    }
                }
            }

            return new Rectangle(left, top, right - left + 1, bottom - top + 1);
        }


    }

    public partial class AlphanumericStringComparer : IComparer<string>
    {
        private static readonly Regex _re = MyRegex();

        public int Compare(string? x, string? y)
        {
            if (x == y)
            {
                return 0;
            }

            if (x is null)
            {
                return -1;
            }

            if (y is null)
            {
                return 1;
            }

            var maxLen = Math.Max(x.Length, y.Length);

            var x1 = _re.Split(x);
            var y1 = _re.Split(y);

            for (var i = 0; i < x1.Length && i < y1.Length; i++)
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

        [GeneratedRegex(@"([0-9]+)")]
        private static partial Regex MyRegex();

    }
}