using SixLabors.ImageSharp;
using Anime4k.Algorithm;

namespace Sen.Shell.Modules.Standards.Misc
{
    public abstract class Miscellaneous
    {
        public abstract void Upscaler(string fileInput, string fileOuput, int scaleRatio, string algorithm);
    }

    public class MiscFunctions : Miscellaneous
    {
        public override void Upscaler(string fileInput, string fileOuput, int scaleRatio, string algorithm = "v10RC2")
        {
            Anime4KAlgorithmVersion algorithmVersion = Anime4KAlgorithmVersion.v10RC2;
            switch (algorithm)
            {
                case "v09":
                    algorithmVersion = Anime4KAlgorithmVersion.v09;
                    break;
                case "v10RC2":
                default:
                    break;
            }
            var image = Image.Load<Rgba32>(fileInput);
            var anime4K = new Anime4KScaler(algorithmVersion);
            var output = anime4K.Scale(image, scaleRatio);
            output.SaveAsPng(fileOuput);
            return;
        }
    }
}


