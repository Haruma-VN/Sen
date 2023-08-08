using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Sen.Shell.Modules.Support.Misc.ADBHelper;

namespace Sen.Shell.Modules.Support.Misc
{

    public abstract class ADBHelperVirtual
    {
        public abstract string ADBSendConnect(string fileName, string Command);

        public abstract void Sleep(uint miliseconds);


    }

    public class ADBHelper : ADBHelperVirtual
    {
        public struct SendADBCommand
        {
            public string Command;

            public string Path;
        }

        public unsafe sealed override string ADBSendConnect(string fileName, string Command)
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = Command,
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };
            using var process = Process.Start(startInfo)!;
            var output = process.StandardOutput.ReadToEnd();
            return output;
           
        }

        public unsafe sealed override void Sleep(uint miliseconds)
        {
            Thread.Sleep((int)miliseconds);
            return;
        }
    }
}
