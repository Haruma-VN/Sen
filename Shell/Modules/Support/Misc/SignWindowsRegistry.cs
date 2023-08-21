using Microsoft.Win32;
using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;

namespace Sen.Shell.Modules.Support.Misc
{
    internal class SignWindowsRegistry
    {
        protected static bool IsFileExtensionAssociated(string progID, string extension)
        {
            #pragma warning disable CA1416
            #pragma warning disable CS8600
            using var key = Registry.CurrentUser.OpenSubKey($"Software\\Classes\\{extension}");
            {
                if (key is not null)
                {
                    string value = key.GetValue(null) as string;
                    return value == progID;
                }
            }

            return false;
        }

        protected static void AssociateFileExtensions(string progID, string[] extensions, string appPath)
        {
            Registry.SetValue($"HKEY_CURRENT_USER\\Software\\Classes\\{progID}\\shell\\open\\command", null, $"\"{appPath}\" \"%1\"");

            foreach (string extension in extensions)
            {
                Registry.SetValue($"HKEY_CURRENT_USER\\Software\\Classes\\{extension}", null, progID);
            }
            return;
        }

        public static void AssignExtensionWithSen()
        {
            if(Platform.CurrentPlatform() == UserPlatform.Windows)
            {
                var progID = $"Sen.FileType";
                var path = new ImplementPath();
                string[] extensions = { 
                    ".rsb", 
                    ".rsg",
                    ".pam", 
                    ".rton", 
                    ".json", 
                    ".png", 
                    ".ptx", 
                    ".js", 
                    ".obb", 
                    ".bnk", 
                    ".wem", 
                    ".txt", 
                    ".popfx", 
                    ".newton", 
                };
                var appPath = path.Resolve($"{path.Dirname(Sen.Shell.Program.Script_Directory)}/Sen.exe");
                var fs = new FileSystem();
                if(appPath is not null && fs.FileExists(appPath))
                {
                    if (!IsFileExtensionAssociated(progID, extensions[0]))
                    {
                        AssociateFileExtensions(progID, extensions, appPath);
                    }
                }
            }
            return;
        }

        protected static void DeleteFileAssociations(string progID, string[] extensions)
        {
            Registry.CurrentUser.DeleteSubKeyTree($"Software\\Classes\\{progID}\\shell\\open\\command", false);
            foreach (string extension in extensions)
            {
                Registry.CurrentUser.DeleteSubKeyTree($"Software\\Classes\\{extension}", false);
            }
            return;
        }

    }
}
