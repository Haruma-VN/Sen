using System.Drawing;
using Color = System.Drawing.Color;
using Image = System.Drawing.Image;

namespace CMK
{
    internal class ImageChangeAnalyser
    {
        private Bitmap oldImage = null;

        private bool isB = false;
        public Image BlackoutImage(Image newImage)
        {
            int s = 0;// isB ? 1 : 0;
            isB = !isB;
            var newImageBmp = new Bitmap(newImage);
            var x = newImage.Width;
            var y = newImage.Height;
            var newImage2 = new Bitmap(newImageBmp);
            if (oldImage != null)
            {
                for (int i = 0; i < x - 4; i += 4)
                {
                    for (int j = 0; j < y - 4; j += 4)
                    {
                        Color a = oldImage.GetPixel(i + s, j + s);
                        Color b = newImageBmp.GetPixel(i + s, j + s);
                        if (isColorEqual(a, b))
                        {
                            set_transparent(newImageBmp, i, j);
                        }
                    }
                }
            }
            oldImage = newImage2;
            return newImageBmp;
        }

        private void set_transparent(Bitmap bmp, int x, int y)
        {
            for (int i = 0; i < 4; i++)
            {
                for (int j = 0; j < 4; j++)
                {
                    bmp.SetPixel(i + x, j + y, Color.Transparent);
                }
            }
        }

        public Image BlackoutImage(Image newImage, out bool equal)
        {
            equal = false;
            if (newImage == null)
                return null;
            var newImageBmp = new Bitmap(newImage);
            var x = newImage.Width;
            var y = newImage.Height;
            var pixelCount = x * y;
            var changeCount = 0;
            var newImage2 = new Bitmap(newImageBmp);
            if (oldImage != null)
            {
                for (int i = 0; i < x; i++)
                {
                    for (int j = 0; j < y; j++)
                    {
                        Color a = oldImage.GetPixel(i, j);
                        Color b = newImageBmp.GetPixel(i, j);
                        if (isColorEqual(a, b))
                        {
                            changeCount++;
                            newImageBmp.SetPixel(i, j, Color.Transparent);
                        }
                    }
                }
            }
            oldImage = newImage2;
            equal = changeCount == pixelCount;
            return newImageBmp;
        }

        private bool isColorEqual(Color a, Color b)
        {
            return
                a.R == b.R &&
                a.G == b.G &&
                a.B == b.B;
        }
    }
}
