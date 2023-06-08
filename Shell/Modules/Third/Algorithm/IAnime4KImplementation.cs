using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace Anime4k.Algorithm
{
    /// <summary>
    /// A Generic Implementation of a Anime4K algorithm.
    /// </summary>
    public interface IAnime4KImplementation
    {
        /// <summary>
        /// The Directory that sub- phase images may be saved to for debugging
        /// </summary>
        string DebugDirectory { get; set; }

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
        Image<Rgba32> Push(Image<Rgba32> img, float strengthColor, float strengthGradient, int passes = 2, bool debugSavePhases = false);
    }
}
