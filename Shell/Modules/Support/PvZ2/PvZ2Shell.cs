using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;

namespace Sen.Shell.Modules.Support.PvZ2
{
    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile);

        protected abstract Task RTONTaskDecodeAsync(string inFile, string outFile);

        protected abstract Task CreateRTONTaskAsync(string[] inFiles, string[] outFiles);

        public abstract void RTONDecodeAsync(string[] inFiles, string[] outFiles);

    }

    public class PvZ2Shell : PvZ2ShellAbstract
    {
        public override void RTONDecode(string inFile, string outFile)
        {
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = RTONProcession.Decode(RtonFile, false);
            JsonFile.SaveFile(outFile);
            return;
        }

        protected override async Task RTONTaskDecodeAsync(string inFile, string outFile)
        {
            var RtonFile = new SenBuffer(inFile);
            {
                var JsonFile = await Task.Run(() => RTONProcession.Decode(RtonFile, false));
                await JsonFile.SaveFileAsync(outFile);
            }
            return;
        }

        protected override async Task CreateRTONTaskAsync(string[] inFiles, string[] outFiles)
        {
            if(inFiles.Length != outFiles.Length)
            {
                throw new Exception($"inFiles.Length != outFiles.Length");
            }
            var tasks = new List<Task>();
            for(var i = 0; i < inFiles.Length; i++)
            {
                tasks.Add(this.RTONTaskDecodeAsync(inFiles[i], outFiles[i]));
            }
            await Task.WhenAll(tasks);
            return;
        }

        public override void RTONDecodeAsync(string[] inFiles, string[] outFiles)
        {
            var task = this.CreateRTONTaskAsync(inFiles, outFiles);
            task.Wait();
            return;
        }
    }
}
