using Sen.Shell.Modules.Internal;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

#pragma warning disable

namespace Sen.Shell.Modules.Standards
{

    public enum ShellType
    {
        Console,
        GUI,
    }

    public enum UserPlatform
    {
        Windows,
        Macintosh,
        Linux,
        Android,
        iOS,
        Unknown,
    }

    public enum ConsoleColor
    {
        Black,
        Blue,
        Cyan,
        DarkBlue,
        DarkCyan,
        DarkGray,
        DarkGreen,
        DarkMagenta,
        DarkRed,
        DarkYellow,
        Gray,
        Green,
        Magenta,
        Red,
        White,
        Yellow
    }



    public abstract class Platform_Abstract
    {
        public abstract UserPlatform ThisPlatform();

        public abstract bool IsUTF8Support();

        public abstract bool IsColorSupport();

        public abstract void SupportUtf8Console();

        public abstract string CurrentUserPlatform();

        public abstract void SendNotification(string message, string title);

        public abstract void SendMessageBox(string message, string title);

        public abstract string ShellHost();

    }

    public class Platform : Platform_Abstract
    {
        // Console
        /// <summary>
        /// Windows is "windows", Linux is "linux" & "Macintosh" is "macintosh"
        /// </summary>
        /// <returns>"windows", "linux", "macintosh", "unknown"</returns>
        ///
        public override UserPlatform ThisPlatform()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return UserPlatform.Windows;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return UserPlatform.Linux;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return UserPlatform.Macintosh;
            }
            else
            {
                return UserPlatform.Unknown;
            }
        }

        public override string CurrentUserPlatform()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return "Windows";
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return "Linux";
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return "Macintosh";
            }
            else
            {
                return "Unknown";
            }
        }



#pragma warning disable CS8601

        public readonly static string CurrentDirectoryContainsShell = Path.GetDirectoryName(Environment.ProcessPath);

        public readonly ShellType SenShell = ShellType.Console;

        public Platform() { }

        public override bool IsUTF8Support()
        {
            if (this.SenShell == ShellType.Console)
            {
                Encoding utf8 = new UTF8Encoding();

                if (Console.OutputEncoding.Equals(utf8))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            return true;
        }


        public static UserPlatform CurrentPlatform()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                return UserPlatform.Windows;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                return UserPlatform.Linux;
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            {
                return UserPlatform.Macintosh;
            }
            else
            {
                return UserPlatform.Unknown;
            }
        }

        public override bool IsColorSupport()
        {
            if (this.SenShell == ShellType.Console)
            {
                bool colorSupport = false;
                if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                {
                    colorSupport = true; // Windows CMD supports color by default
                }
                else
                {
                    #pragma warning disable CS8600
                    string term = Environment.GetEnvironmentVariable("TERM");
                    if (!string.IsNullOrEmpty(term) && term.ToLower().Contains("color"))
                    {
                        colorSupport = true;
                    }
                }
                return colorSupport;
            }
            return true;

        }

        public override void SupportUtf8Console()
        {
            if (this.SenShell == ShellType.Console)
            {
                Encoding utf8 = new UTF8Encoding();
                Console.OutputEncoding = utf8;
            }
            return;
        }

        public static void SendWindowsNotification(string title, string message, string iconType)
        {
            if (string.IsNullOrEmpty(title)) title = " ";
            if (string.IsNullOrEmpty(message)) message = " ";
            if (string.IsNullOrEmpty(iconType)) iconType = "info";

            var startInfo = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-command \"& {{Add-Type -AssemblyName System.Windows.Forms; $notifyIcon = New-Object System.Windows.Forms.NotifyIcon; $notifyIcon.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon('{System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName}'); $notifyIcon.BalloonTipTitle = '{title}'; $notifyIcon.BalloonTipText = '{message}'; $notifyIcon.BalloonTipIcon = '{iconType}'; $notifyIcon.Visible = $true; $notifyIcon.ShowBalloonTip(10000);}}\"",
                UseShellExecute = false,
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };

            using var process = new Process { StartInfo = startInfo };
            process.Start();
            process.WaitForExit();
            return;
        }

        public override void SendNotification(string message, string title)
        {
            if(Platform.CurrentPlatform() == UserPlatform.Windows)
            {
                SendWindowsNotification(title, message, "info");
            }
            else
            {
                LotusAPI.SendLosNotification(title, message, "info");
            }
            return;
        }

        public override void SendMessageBox(string message, string title)
        {
            LotusAPI.SendMessageBox(title, message, "OK");
            return;
        }

        public override string ShellHost()
        {
            return "Console";
        }
    }
}
