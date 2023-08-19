using Sen.Shell.Modules;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Internal
{
    public abstract class M_Internal
    {
        public abstract int InternalVersion();

        public abstract string GetProcessorArchitecture();
    }

    public enum Architecture
    {
        X64,
        ARM,
        INTEL,
        X86,
        UNKNOWN,
        ARM64,
    };

    public class SenAPI
    {
        private const string LibraryModule = $"./Internal";

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern int InternalVersion();

        [DllImport(LibraryModule, CallingConvention = CallingConvention.Cdecl)]
        public static extern Architecture GetProcessorArchitecture();
    }

    public class Internal : M_Internal
    {
        public override string GetProcessorArchitecture()
        {
             return SenAPI.GetProcessorArchitecture() switch
             {
                 Architecture.X64 => "x64",
                 Architecture.ARM => "ARM",
                 Architecture.INTEL => "Intel Itanium-based",
                 Architecture.X86 => "x86",
                 Architecture.UNKNOWN => "Unknown",
                 Architecture.ARM64 => "ARM64",
                 _ => throw new NotImplementedException(),
             };
        }

        public override int InternalVersion() => SenAPI.InternalVersion();
    }
}
