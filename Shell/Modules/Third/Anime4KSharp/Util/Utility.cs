using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp;
using System;
using System.Threading.Tasks;

namespace Anime4k.Util
{
    /// <summary>
    /// Contains useful extension methods
    /// </summary>
    public static class Utility
    {
        #region String Manipulation
        /// <summary>
        /// Does the string start with any of the given sub strings?
        /// </summary>
        /// <param name="str">the string to check</param>
        /// <param name="startWiths">the list of sub strings</param>
        /// <returns>deos the string start with any of the sub strings?</returns>
        public static bool StartsWithAny(this string str, params char[] startWiths)
        {
            foreach (char c in startWiths)
            {
                if (str.StartsWith(c.ToString())) return true;
            }

            return false;
        }
        #endregion

        #region Math, int
        /// <summary>
        /// Clamp a int to be between the min and max value
        /// </summary>
        /// <param name="val">the value to clamp</param>
        /// <param name="min">the minimum value to clamp to</param>
        /// <param name="max">the maximum value to clamp to</param>
        /// <returns>the clamped value</returns>
        public static int Clamp(int val, int min, int max)
        {
            return (val < min) ? min : (val > max) ? max : val;
        }
        #endregion

        #region Math, float
        /// <summary>
        /// Clamp a float to be between the min and max value
        /// </summary>
        /// <param name="val">the value to clamp</param>
        /// <param name="min">the minimum value to clamp to</param>
        /// <param name="max">the maximum value to clamp to</param>
        /// <returns>the clamped value</returns>
        public static float Clamp(float val, float min, float max)
        {
            return (val < min) ? min : (val > max) ? max : val;
        }

        /// <summary>
        /// Get the smallest value of three
        /// </summary>
        /// <param name="a">the first value</param>
        /// <param name="b">the second value</param>
        /// <param name="c">the third value</param>
        /// <returns>the smallest value of three</returns>
        public static float Min3(float a, float b, float c)
        {
            return Math.Min(a, Math.Min(b, c));
        }

        /// <summary>
        /// Get the biggest value of three
        /// </summary>
        /// <param name="a">the first value</param>
        /// <param name="b">the second value</param>
        /// <param name="c">the third value</param>
        /// <returns>the biggest value of three</returns>
        public static float Max3(float a, float b, float c)
        {
            return Math.Max(a, Math.Max(b, c));
        }

        /// <summary>
        /// Get the average of three
        /// </summary>
        /// <param name="a">the first value</param>
        /// <param name="b">the second value</param>
        /// <param name="c">the third value</param>
        /// <returns>the average of three</returns>
        public static float Average3(float a, float b, float c)
        {
            return (a + b + c) / 3f;
        }
        #endregion

        #region Pixels
        /// <summary>
        /// Calculate the luminance of a pixel (same as .NET Color.GetBrighness())
        /// </summary>
        /// <param name="p">the color to get the brightness of</param>
        /// <returns>the brightness, range 0.0 - 1.0</returns>
        public static float GetLuminance(this Rgba32 p)
        {
            float r = p.R / 255.0f;
            float g = p.G / 255.0f;
            float b = p.B / 255.0f;

            float max = r;
            float min = r;
            if (g > max) max = g;
            if (b > max) max = b;

            if (g < min) min = g;
            if (b < min) min = b;

            return (max + min) / 2;
        }
        #endregion

        #region Image Manipulation
        /// <summary>
        /// a function executed on a pixel
        /// </summary>
        /// <typeparam name="T">the pixel format to use</typeparam>
        /// <param name="x">the x coord of the pixel</param>
        /// <param name="y">the y coord of the pixel</param>
        /// <param name="pixel">the current color of the pixel</param>
        /// <returns>the color the pixel should be set to</returns>
        public delegate Rgba32 PixelFunc<Rgba32>(int x, int y, Rgba32 pixel);

        /// <summary>
        /// Execute a function for every pixel in the image and apply changes to the pixel to the image directly.
        /// </summary>
        /// <typeparam name="T">the pixel format of the image</typeparam>
        /// <param name="img">the image to use</param>
        /// <param name="pixelFunction">the function to execute for every pixel</param>
        /// <returns>the modified image (equal to img param)</returns>
        public static Image<Rgba32> DirectChangeEachPixel(this Image<Rgba32> img, PixelFunc<Rgba32> pixelFunction)
        {
            for (int px = 0; px < img.Width - 1; px++)
            {
                for (int py = 0; py < img.Height - 1; py++)
                {
                    img[px, py] = pixelFunction(px, py, img[px, py]);
                }
            }

            return img;
        }

        /// <summary>
        /// Execute a function for every pixel in the image and apply changes to the pixel to a copy of the image.
        /// </summary>
        /// <typeparam name="T">the pixel format of the image</typeparam>
        /// <param name="img">the image to use</param>
        /// <param name="pixelFunction">the function to execute for every pixel</param>
        ///  <param name="disposeOld">if true, the image img is disposed before the function returns the new image</param>
        /// <returns>the modified image</returns>
        public static Image<Rgba32> ChangeEachPixel(this Image<Rgba32> img, PixelFunc<Rgba32> pixelFunction, bool disposeOld)
        {
            //create output image
            Image<Rgba32> output = new Image<Rgba32>(img.Width, img.Height);

            //enumerate all pixels
            for (int px = 0; px < img.Width - 1; px++)
            {
                for (int py = 0; py < img.Height - 1; py++)
                {
                    output[px, py] = pixelFunction(px, py, img[px, py]);
                }
            }

            //dispose old image
            if (disposeOld)
            {
                img.Dispose();
            }
            return output;
        }

        /// <summary>
        /// Execute a function for every pixel in the image and apply changes to the pixel to a copy of the image.
        /// </summary>
        /// <remarks>uses Parallel.For to use multi- core- processors better</remarks>
        /// <typeparam name="T">the pixel format of the image</typeparam>
        /// <param name="img">the image to use</param>
        /// <param name="pixelFunction">the function to execute for every pixel</param>
        /// <param name="disposeOld">if true, the image img is disposed before the function returns the new image</param>
        /// <returns>the modified image</returns>
        public static Image<Rgba32> ChangeEachPixelParallel(this Image<Rgba32> img, PixelFunc<Rgba32> pixelFunction, bool disposeOld)
        {
            //create output image
            Image<Rgba32> output = new Image<Rgba32>(img.Width, img.Height);

            //enumerate all pixels
            Parallel.For(0, img.Width - 1, (px) =>
            {
                for (int py = 0; py < img.Height - 1; py++)
                {
                    output[px, py] = pixelFunction(px, py, img[px, py]);
                }
            });

            //dispose old image
            if (disposeOld)
            {
                img.Dispose();
            }
            return output;
        }
        #endregion
    }
}
