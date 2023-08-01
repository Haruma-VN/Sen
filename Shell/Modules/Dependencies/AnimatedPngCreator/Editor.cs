using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CMK.AnimatedPng;
using Image = System.Drawing.Image;

namespace CMK
{
    internal class Editor : EngineBase
    {
        private AnimatedPng animatedPng;

        public Editor(string filePath)
        {
            animatedPng = new AnimatedPng
            {
                FilePath = filePath,
                Frames = new List<Frame>()
            };
            load();
        }

        public Editor(Stream stream, string filePath)
        {
            animatedPng = new AnimatedPng
            {
                FilePath = filePath,
                Frames = new List<Frame>()
            };
            load(stream);
        }

        private void load()
        {
            var stream = File.OpenRead(animatedPng.FilePath);
            load(stream);
        }

        private void load(Stream stream)
        {
            var acTL = find(stream, "acTL".ToCharArray());

            var signature = SIGNATURE;
            var IHDR = find_IHDR(stream)[0];
            var IDAT = find_IDAT(stream);
            var idatSize = 0;
            foreach (var idat in IDAT) idatSize += idat.Length;
            var IDATArray = new byte[idatSize];
            var iend = IEND;
            var size = signature.Length + IHDR.Length + idatSize + iend.Length;
            var firstFrameStream = new MemoryStream(size);
            firstFrameStream.Write(signature, 0, signature.Length);
            firstFrameStream.Write(IHDR, signature.Length, signature.Length + IHDR.Length);
            firstFrameStream.Write(IDATArray, signature.Length + IHDR.Length, signature.Length + IHDR.Length + idatSize);
            firstFrameStream.Write(iend, signature.Length + IHDR.Length + idatSize, size);
            Image firstImage = new Bitmap(firstFrameStream);



            stream.Dispose();
        }

        private Frame getFrame()
        {
            return null;
        }
    }
}
