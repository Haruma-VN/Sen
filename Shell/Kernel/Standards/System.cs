using System.Runtime.InteropServices;
using System.Text;
using System.Text.Encodings.Web;
using Sen.Shell.Kernel.Internal;
using Sen.Shell.Kernel.Standards;

namespace Sen.Shell.Kernel.Standards
{

    public abstract class SystemAbstract
    {
        public abstract void Print(Sen.Shell.Kernel.Standards.ConsoleColor? color, params string[] texts);

        public abstract void Debug(ConsoleColor? color, params object[] objects);

        public abstract void Printf(Sen.Shell.Kernel.Standards.ConsoleColor? color, params string[] texts);

        public abstract string? Input<T>(Sen.Shell.Kernel.Standards.ConsoleColor? color);

        public abstract void TerminateProgram();

        public abstract string OpenFileDialog(string title, string[] filter);

        public abstract string[] OpenMultipleFileDialog(string title, string[] filter);

        public abstract string OpenDirectoryDialog(string title);

        public abstract string SaveFileDialog(string title, string[] filter);

        public abstract string ObtainCurrentArchitectureDecimalSymbols();

    }


    public class SystemImplement : SystemAbstract
    {
        public override string ObtainCurrentArchitectureDecimalSymbols() 
            => System.Globalization.CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator;


        public override unsafe string OpenFileDialog(string title, string[] filter)
        {
            IntPtr k_ptr = LotusAPI.OpenFileDialog(title, filter.Length, filter);
            var m = Marshal.PtrToStringUTF8(k_ptr)!;
            return m;
        }

        public override unsafe string[] OpenMultipleFileDialog(string title, string[] filter)
        {
            IntPtr k_ptr = LotusAPI.OpenMultipleFileDialog(title, filter.Length, filter);
            var m = Marshal.PtrToStringUTF8(k_ptr)!;
            return m.Split('|');
        }

        public override unsafe string OpenDirectoryDialog(string title)
        {
            var k_ptr = LotusAPI.OpenDirectoryDialog(title);
            var m = Marshal.PtrToStringUTF8(k_ptr)!;
            return m;
        }

        public override unsafe string SaveFileDialog(string title, string[] filter)
        {
            var k_ptr = LotusAPI.SaveFileDialog(title, filter.Length, filter);
            var m = Marshal.PtrToStringUTF8(k_ptr)!;
            return m;
        }

        public override void Print(Sen.Shell.Kernel.Standards.ConsoleColor? color, params string[] texts)
        {
            var platform = new Sen.Shell.Kernel.Standards.Platform();

            if (platform.SenShell == ShellType.Console) {
                System.Console.ForegroundColor = color switch
                {
                    Sen.Shell.Kernel.Standards.ConsoleColor.Black => System.ConsoleColor.Black,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Blue => System.ConsoleColor.Blue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => System.ConsoleColor.Cyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => System.ConsoleColor.DarkBlue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => System.ConsoleColor.DarkCyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => System.ConsoleColor.DarkGray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => System.ConsoleColor.DarkGreen,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => System.ConsoleColor.DarkMagenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => System.ConsoleColor.DarkRed,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => System.ConsoleColor.DarkYellow,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Gray => System.ConsoleColor.Gray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Green => System.ConsoleColor.Green,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => System.ConsoleColor.Magenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Red => System.ConsoleColor.Red,
                    Sen.Shell.Kernel.Standards.ConsoleColor.White => System.ConsoleColor.White,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => System.ConsoleColor.Yellow,
                    _ => System.ConsoleColor.White,
                };
            }

            var text = (platform.SenShell == ShellType.Console) ? (platform.IsUTF8Support() ? "● " : "$ ") : color switch
            {
                Sen.Shell.Kernel.Standards.ConsoleColor.Black => "\x1b[30m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Blue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => "\x1b[90m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => "\x1b[33m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Gray => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Green => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Red => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.White => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => "\x1b[33m",
                _ => "\x1b[0m"
            } + (platform.IsUTF8Support() ? "● " : "$ ");

            foreach ( var t in texts)
            {
                text += t?.ToString();
            }
            if(platform.SenShell == ShellType.GUI)
            {
                text += $"\x1b[0m";
            }
            Console.WriteLine(text);
            if(platform.SenShell == ShellType.Console)
            {
                System.Console.ResetColor();
            }
        }

        public override void Printf(Sen.Shell.Kernel.Standards.ConsoleColor? color, params string[] texts)
        {
            var platform = new Sen.Shell.Kernel.Standards.Platform();

            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ForegroundColor = color switch
                {
                    Sen.Shell.Kernel.Standards.ConsoleColor.Black => System.ConsoleColor.Black,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Blue => System.ConsoleColor.Blue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => System.ConsoleColor.Cyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => System.ConsoleColor.DarkBlue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => System.ConsoleColor.DarkCyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => System.ConsoleColor.DarkGray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => System.ConsoleColor.DarkGreen,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => System.ConsoleColor.DarkMagenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => System.ConsoleColor.DarkRed,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => System.ConsoleColor.DarkYellow,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Gray => System.ConsoleColor.Gray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Green => System.ConsoleColor.Green,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => System.ConsoleColor.Magenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Red => System.ConsoleColor.Red,
                    Sen.Shell.Kernel.Standards.ConsoleColor.White => System.ConsoleColor.White,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => System.ConsoleColor.Yellow,
                    _ => System.ConsoleColor.White,
                };
            }

            var text = (platform.SenShell == ShellType.Console) ? "" : color switch
            {
                Sen.Shell.Kernel.Standards.ConsoleColor.Black => "\x1b[30m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Blue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => "\x1b[90m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => "\x1b[33m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Gray => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Green => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Red => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.White => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => "\x1b[33m",
                _ => "\x1b[0m"
            };

            foreach (var t in texts)
            {
                text += t?.ToString();
            }
            if (platform.SenShell == ShellType.GUI)
            {
                text += $"\x1b[0m";
            }
            Console.WriteLine(text);
            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ResetColor();
            }
            return;
        }


        public override string? Input<T>(Sen.Shell.Kernel.Standards.ConsoleColor? color)
        {
#pragma warning disable CS8600
            var platform = new Sen.Shell.Kernel.Standards.Platform();

            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ForegroundColor = color switch
                {
                    Sen.Shell.Kernel.Standards.ConsoleColor.Black => System.ConsoleColor.Black,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Blue => System.ConsoleColor.Blue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => System.ConsoleColor.Cyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => System.ConsoleColor.DarkBlue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => System.ConsoleColor.DarkCyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => System.ConsoleColor.DarkGray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => System.ConsoleColor.DarkGreen,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => System.ConsoleColor.DarkMagenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => System.ConsoleColor.DarkRed,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => System.ConsoleColor.DarkYellow,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Gray => System.ConsoleColor.Gray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Green => System.ConsoleColor.Green,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => System.ConsoleColor.Magenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Red => System.ConsoleColor.Red,
                    Sen.Shell.Kernel.Standards.ConsoleColor.White => System.ConsoleColor.White,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => System.ConsoleColor.Yellow,
                    _ => System.ConsoleColor.White,
                };
            }
            var text = (platform.SenShell == ShellType.Console) ? (platform.IsUTF8Support() ? "● " : "$ ") : color switch
            {
                Sen.Shell.Kernel.Standards.ConsoleColor.Black => "\x1b[30m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Blue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => "\x1b[90m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => "\x1b[33m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Gray => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Green => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Red => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.White => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => "\x1b[33m",
                _ => "\x1b[0m"
            } + (platform.IsUTF8Support() ? "● " : "$ ");
            Console.Write(text);
            string data = Console.ReadLine();
            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ResetColor();
            }
            return data;
        }

        public override void TerminateProgram()
        {
            Console.ReadKey();
            return;
        }

        public override void Debug(ConsoleColor? color, params object[] objects)
        {
            var platform = new Sen.Shell.Kernel.Standards.Platform();

            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ForegroundColor = color switch
                {
                    Sen.Shell.Kernel.Standards.ConsoleColor.Black => System.ConsoleColor.Black,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Blue => System.ConsoleColor.Blue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => System.ConsoleColor.Cyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => System.ConsoleColor.DarkBlue,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => System.ConsoleColor.DarkCyan,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => System.ConsoleColor.DarkGray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => System.ConsoleColor.DarkGreen,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => System.ConsoleColor.DarkMagenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => System.ConsoleColor.DarkRed,
                    Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => System.ConsoleColor.DarkYellow,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Gray => System.ConsoleColor.Gray,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Green => System.ConsoleColor.Green,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => System.ConsoleColor.Magenta,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Red => System.ConsoleColor.Red,
                    Sen.Shell.Kernel.Standards.ConsoleColor.White => System.ConsoleColor.White,
                    Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => System.ConsoleColor.Yellow,
                    _ => System.ConsoleColor.White,
                };
            }

            var text = (platform.SenShell == ShellType.Console) ? (platform.IsUTF8Support() ? "● " : "$ ") : color switch
            {
                Sen.Shell.Kernel.Standards.ConsoleColor.Black => "\x1b[30m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Blue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Cyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkBlue => "\x1b[34m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkCyan => "\x1b[36m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGray => "\x1b[90m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkGreen => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkMagenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkRed => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.DarkYellow => "\x1b[33m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Gray => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Green => "\x1b[32m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Magenta => "\x1b[35m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Red => "\x1b[31m",
                Sen.Shell.Kernel.Standards.ConsoleColor.White => "\x1b[37m",
                Sen.Shell.Kernel.Standards.ConsoleColor.Yellow => "\x1b[33m",
                _ => "\x1b[0m"
            } + (platform.IsUTF8Support() ? "● " : "$ ");
            var json = new JsonImplement();
            var dotnet_type = new TypeChecker();
            foreach (var obj in objects)
            {
                var obj_type = dotnet_type.GetStrictType(obj);
                if(obj_type == "Object[]")
                {
                    text += json.StringifyJson(obj, new()
                    {
                        WriteIndented = false,
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    });
                }
                else if(obj_type == "ExpandoObject")
                {
                    text += json.StringifyJson(obj, null);
                }
                text += ", ";
            }
            if (platform.SenShell == ShellType.GUI)
            {
                text += $"\x1b[0m";
            }
            Console.WriteLine(text);
            if (platform.SenShell == ShellType.Console)
            {
                System.Console.ResetColor();
            }
            return;
        }
    }

    public abstract class TypeCheckerAbstract
    {
        public abstract string GetStrictType(object data);

        protected abstract Type GetDataType(object data);

        protected abstract string GetTypeName(Type type);
    }

    public class TypeChecker : TypeCheckerAbstract
    {

        public override string GetStrictType(object data)
        {
            return this.GetTypeName(this.GetDataType(data));
        }

        protected override Type GetDataType(object data)
        {
            return data.GetType();
        }

        protected override string GetTypeName(Type type)
        {
            if (type == typeof(bool))
            {
                return "bool";
            }
            else if (type == typeof(byte))
            {
                return "byte";
            }
            else if (type == typeof(sbyte))
            {
                return "sbyte";
            }
            else if (type == typeof(char))
            {
                return "char";
            }
            else if (type == typeof(decimal))
            {
                return "decimal";
            }
            else if (type == typeof(double))
            {
                return "double";
            }
            else if (type == typeof(float))
            {
                return "float";
            }
            else if (type == typeof(int))
            {
                return "int";
            }
            else if (type == typeof(uint))
            {
                return "uint";
            }
            else if (type == typeof(long))
            {
                return "long";
            }
            else if (type == typeof(ulong))
            {
                return "ulong";
            }
            else if (type == typeof(object))
            {
                return "object";
            }
            else if (type == typeof(short))
            {
                return "short";
            }
            else if (type == typeof(ushort))
            {
                return "ushort";
            }
            else if (type == typeof(string))
            {
                return "string";
            }
            else
            {
                return type.Name;
            }
        }
    }
}
