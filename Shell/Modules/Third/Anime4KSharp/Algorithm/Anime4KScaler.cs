using Anime4k.Util;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.IO;

namespace Anime4k.Algorithm
{
    public class Anime4KScaler
    {
        /// <summary>
        /// The Implementation of Anime4K this scaler uses
        /// </summary>
        IAnime4KImplementation anime4K;

        /// <summary>
        /// Create the scaler with anime4K 0.9
        /// </summary>
        public Anime4KScaler() : this(new Anime4K09())
        {
        }

        /// <summary>
        /// Create the scaler with the given implementation of Anime4K
        /// </summary>
        /// <param name="anime4k">the version of anime4k to use</param>
        public Anime4KScaler(IAnime4KImplementation anime4k)
        {
            anime4K = anime4k;
        }

        /// <summary>
        /// Create the scaler with the given version of Anime4K
        /// </summary>
        /// <param name="algorithm">the version of anime4k to use</param>
        public Anime4KScaler(Anime4KAlgorithmVersion algorithm)
        {
            switch (algorithm)
            {
                case Anime4KAlgorithmVersion.v10RC2:
                    anime4K = new Anime4K010RC2();
                    break;
                case Anime4KAlgorithmVersion.v09:
                default:
                    anime4K = new Anime4K09();
                    break;
            }
        }

        /// <summary>
        /// Scale a image up and apply Anime4K to the upscaled image. 
        /// Automatically calculates strength factors based on scale.
        /// </summary>
        /// <remarks>the source image is NOT changed</remarks>
        /// <param name="img">the source image to scale</param>
        /// <param name="scaleFactor">how much the image should be scaled up (0.5 = half size, 2 = double size)</param>
        /// <param name="passes">how many times the algorithm should be executed on the image (more = sharper)</param>
        /// <param name="debugSavePhases">if true, each phase of the pushing algorithm is saved to ./debug/</param>
        /// <returns>the upscaled image</returns>
        public Image<Rgba32> Scale(Image<Rgba32> img, float scaleFactor, int passes = 2, bool debugSavePhases = false)
        {
            //calculate push strenght (range 0-1)
            float strengthColor = Utility.Clamp(scaleFactor / 6f, 0f, 1f);
            float strengthGradient = Utility.Clamp(scaleFactor / 2f, 0f, 1f);

            //apply anime4k
            return Scale(img, scaleFactor, passes, strengthColor, strengthGradient, debugSavePhases);
        }

        /// <summary>
        /// Scale a image up and apply Anime4K to the upscaled image. 
        /// Automatically calculates strength factors based on scale.
        /// </summary>
        /// <remarks>the source image is NOT changed</remarks>
        /// <param name="img">the source image to scale</param>
        /// <param name="newWidth">the width of the scaled image</param>
        /// <param name="newHeight">the height of the scaled image</param>
        /// <param name="passes">how many times the algorithm should be executed on the image (more = sharper)</param>
        /// <param name="debugSavePhases">if true, each phase of the pushing algorithm is saved to ./debug/</param>
        /// <returns>the upscaled image</returns>
        public Image<Rgba32> Scale(Image<Rgba32> img, int newWidth, int newHeight, int passes = 2, bool debugSavePhases = false)
        {
            //calculate scale
            float scaleW = newWidth / img.Width;
            float scaleH = newHeight / img.Height;
            float scale = Math.Min(scaleW, scaleH);

            //calculate push strenght (range 0-1)
            float strengthColor = Utility.Clamp(scale / 6f, 0f, 1f);
            float strengthGradient = Utility.Clamp(scale / 2f, 0f, 1f);

            //apply anime4k
            return Scale(img, newWidth, newHeight, passes, strengthColor, strengthGradient, debugSavePhases);
        }

        /// <summary>
        /// Scale a image up and apply Anime4K to the upscaled image. 
        /// </summary>
        /// <remarks>the source image is NOT changed</remarks>
        /// <param name="img">the source image to scale</param>
        /// <param name="scaleFactor">how much the image should be scaled up (0.5 = half size, 2 = double size)</param>
        /// <param name="passes">how many times the algorithm should be executed on the image (more = sharper)</param>
        /// <param name="strengthColor">how strong color push operations should be (scale / 6, range from 0-1)</param>
        /// <param name="strengthGradient">how strong gradient push operations should be (scale / 2, range from 0-1)</param>
        /// <param name="debugSavePhases">if true, each phase of the pushing algorithm is saved to ./debug/</param>
        /// <returns>the upscaled image</returns>
        public Image<Rgba32> Scale(Image<Rgba32> img, float scaleFactor, int passes, float strengthColor, float strengthGradient, bool debugSavePhases = false)
        {
            int w = (int)Math.Floor(img.Width * scaleFactor);
            int h = (int)Math.Floor(img.Height * scaleFactor);
            return Scale(img, w, h, passes, strengthColor, strengthGradient, debugSavePhases);
        }

        /// <summary>
        /// Scale a image up and apply Anime4K to the upscaled image. 
        /// </summary>
        /// <remarks>the source image is NOT changed</remarks>
        /// <param name="img">the source image to scale</param>
        /// <param name="newWidth">the width of the scaled image</param>
        /// <param name="newHeight">the height of the scaled image</param>
        /// <param name="passes">how many times the algorithm should be executed on the image (more = sharper)</param>
        /// <param name="strengthColor">how strong color push operations should be (scale / 6, range from 0-1)</param>
        /// <param name="strengthGradient">how strong gradient push operations should be (scale / 2, range from 0-1)</param>
        /// <param name="debugSavePhases">if true, each phase of the pushing algorithm is saved to ./debug/</param>
        /// <returns>the upscaled image</returns>
        public Image<Rgba32> Scale(Image<Rgba32> img, int newWidth, int newHeight, int passes, float strengthColor, float strengthGradient, bool debugSavePhases = false)
        {
            //check new dimensions are valid
            if (newWidth <= 0 || newHeight <= 0)
            {
                throw new InvalidOperationException("Scaled Dimensions cannot be smaller than 0!");
            }

            //check passes count is ok (miniumum is 1)
            if (passes < 1)
            {
                throw new InvalidOperationException("Anime4K needs at least 1 pass to be executed!");
            }

            //check strenghts are valid
            if (strengthColor < 0 || strengthGradient < 0)
            {
                throw new InvalidOperationException("Anime4K Push Strenght has to be larger than or equal 0!");
            }

            //create ./debug/ if needed
            if (debugSavePhases && !Directory.Exists("./debug/"))
            {
                Directory.CreateDirectory("./debug/");
            }

            //Upscale image
            Image<Rgba32> imgScaled = img.Clone((i) => i.Resize(newWidth, newHeight, KnownResamplers.Bicubic));

            //save upscaled image to ./debug/
            if (debugSavePhases) imgScaled.Save($@"./debug/0-0_scale-up.png");

            //apply anime4k
            return Push(imgScaled, strengthColor, strengthGradient, passes, debugSavePhases);
        }

        /// <summary>
        /// Apply the anime4K algorithm to the image without scaling the image first.
        /// </summary>
        /// <remarks>this function may modify the input image "img"</remarks>
        /// <param name="img">the image to apply the algorithm to</param>
        /// <param name="strengthColor">how strong color push operations should be (scale / 6, range from 0-1)</param>
        /// <param name="strengthGradient">how strong gradient push operations should be (scale / 2, range from 0-1)</param>
        /// <param name="passes">how many times the algorithm should be executed on the image (more = sharper, but slower)</param>
        /// <param name="debugSavePhases">if true, each phase of the pushing algorithm is saved to the specified debug directory path</param>
        /// <returns>the processed image</returns>
        public Image<Rgba32> Push(Image<Rgba32> img, float strengthColor, float strengthGradient, int passes = 2, bool debugSavePhases = false)
        {
            //check that we have a anime4k implementation
            if (anime4K == null) throw new InvalidOperationException("Anime4K Implementation not specified!");

            //push using anime4k
            return anime4K.Push(img, strengthColor, strengthGradient, passes, debugSavePhases);
        }
    }
}
