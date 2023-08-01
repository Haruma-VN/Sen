using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;

namespace CMK
{
    public class AnimatedPngCreator : IDisposable
    {
        /// <summary>
        /// Creates an APNG.
        /// </summary>
        /// <param name="outputFilePath">File path for the output file.</param>
        /// <param name="images">Images to combine to a apng.</param>
        /// <param name="frameDelay">Frame delay for all images.</param>
        /// <param name="config">Configuration.</param>
        /// <param name="repeat">Count to repeat the animation. 0 means infinit.</param>
        public static void Create(string outputFilePath, IEnumerable<Image> images, short frameDelay, int repeat = 0, Config config = null)
        {
            var xMax = images.Max(x => x.Width);
            var yMax = images.Max(x => x.Height);
            using (var outpufFile = File.Create(outputFilePath))
            {
                using (var creator = new AnimatedPngCreator(outpufFile, xMax, yMax, config, frameDelay, repeat))
                {
                    foreach(var image in images)
                    {
                        creator.WriteFrame(image, frameDelay);
                    }
                }
            }
        }

        /// <summary>
        /// Creates an APNG.
        /// </summary>
        /// <param name="outputFilePath">File path for the output file.</param>
        /// <param name="frames">Images and delays to combine to a apng.</param>
        /// <param name="config">Configuration.</param>
        /// <param name="repeat">Count to repeat the animation. 0 means infinit.</param>
        public static void Create(string outputFilePath, IEnumerable<AnimatedPng.Frame> frames, int repeat = 0, Config config = null)
        {
            var xMax = frames.Max(x => x.Image.Width);
            var yMax = frames.Max(x => x.Image.Height);
            using (var outpufFile = File.Create(outputFilePath))
            {
                using (var creator = new AnimatedPngCreator(outpufFile, xMax, yMax, config, 500, repeat))
                {
                    foreach (var image in frames)
                    {
                        creator.WriteFrame(image.Image, image.Delay);
                    }
                }
            }
        }

        /// <summary>
        /// Creates an APNG.
        /// </summary>
        /// <param name="outputFilePath">File path for the output file.</param>
        /// <param name="imagePaths">Image paths to combine to a apng.</param>
        /// <param name="frameDelay">Frame delay for all images.</param>
        /// <param name="config">Configuration.</param>
        /// <param name="repeat">Count to repeat the animation. 0 means infinit.</param>
        public static void Create(string outputFilePath, IEnumerable<string> imagePaths, short frameDelay, int repeat = 0, Config config = null)
        {
            var images = new List<Image>();
            foreach(var imagePath in imagePaths)
            {
                images.Add(Image.FromFile(imagePath));
            }
            Create(outputFilePath, images, frameDelay);
        }

        /// <summary>
        /// Creates an frame object.
        /// </summary>
        /// <param name="image">File path for the output file.</param>
        /// <param name="delay">Frame delay for this image.</param>
        public static AnimatedPng.Frame Frame(Image image, short delay)
        {
            return new AnimatedPng.Frame
            {
                Image = image,
                Delay = delay
            };
        }

        public class Config
        {
            public bool? FilterUnchangedPixels { get; set; }
        }

        private readonly Creator creator;
        private readonly Config config;

        private ImageChangeAnalyser changeAnalyser;

        public AnimatedPngCreator(Stream stream, int x, int y, int defaultDelay = 500, int repeat = 0)
        {
            creator = new Creator(stream,x,y,defaultDelay,repeat);
            config = new Config { FilterUnchangedPixels = true };
            init();
        }

        private void init()
        {
            if (config.FilterUnchangedPixels == true)
                changeAnalyser = new ImageChangeAnalyser();
        }

        public AnimatedPngCreator(Stream stream, int x, int y, Config config, int defaultDelay = 500, int repeat = 0)
        {
            creator = new Creator(stream, x, y, defaultDelay, repeat);
            this.config = config ?? new Config { FilterUnchangedPixels = true };
            init();
        }

        public void WriteFrame(Image image, short frameDelay, int offsetX = 0, int offsetY = 0)
        {
            var img = config.FilterUnchangedPixels == true ?
                changeAnalyser.BlackoutImage(image, out bool b) : image;
            creator.WriteFrame(img, frameDelay, offsetX, offsetY);
        }

        public void Dispose()
        {
            creator.Dispose();
        }
    }
}
