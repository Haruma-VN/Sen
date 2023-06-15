using System.Text;

namespace Sen.Shell.Modules.Standards.IOModule
{

    public enum EncodingType
    {
        UTF8,
        ASCII,
        LATIN1,
        UNICODE,
    }

    public abstract class File_System_Abstract
    {
        public abstract string ReadText(string file_path, EncodingType encoding);

        public abstract void WriteText(string file_path, string data, EncodingType encoding);

        public abstract void CreateDirectory(string file_path);

        public abstract void DeleteDirectory(string[] file_path);

        public abstract Task<string> ReadTextAsync(string file_path, EncodingType encoding);

        public abstract bool DirectoryExists(string file_path);

        public abstract bool FileExists(string file_path);

        public abstract Task WriteTextAsync(string filepath, string data, EncodingType encoding);

        public abstract Generic_T ReadJson<Generic_T>(string filepath);

        public abstract void WriteJson<Generic_T>(string output_path, Generic_T json_object);

        public abstract Task<Generic_T> ReadJsonAsync<Generic_T>(string filepath);

        public abstract Task WriteJsonAsync<Generic_T>(string output_path, Generic_T json_object);

        public abstract void OutFile<Generic_T>(string output_path, Generic_T data);

        public abstract Task OutFileAsync<Generic_T>(string output_path, Generic_T data);

        public abstract void WriteFile<Generic_T>(string output_file, Generic_T data);

        public abstract Task WriteFileAsync<Generic_T>(string output_file, Generic_T data);

        protected abstract void WriteBufferToFile(string filePath, byte[] buffer);

        public abstract string[] ReadDirectory(string directory, Sen.Shell.Modules.Standards.IOModule.ReadDirectory ReadOption);

        public abstract byte[] ReadBytes(string filepath);

        public abstract void WriteBytes(string filepath, byte[] data);

        public abstract Task WriteBytesAsync(string filepath, byte[] data);

        public abstract void DeleteFile(string filePath);

        public abstract void MoveFile(string filePath, string outpath);

        public abstract void MoveDirectory(string filePath, string outpath);

        public abstract void RenameFile(string filePath, string newName);

        public abstract void RenameDirectory(string filePath, string newName);

    }

    public enum ReadDirectory
    {
        OnlyCurrentDirectory,
        AllNestedDirectory,
    }

    public class FileSystem : File_System_Abstract
    {

        public FileSystem() { }



        public override void DeleteFile(string filePath)
        {
            if(this.FileExists(filePath))
            {
                File.Delete(filePath);
            }
            return;
        }

        protected override void WriteBufferToFile(string filePath, byte[] buffer)
        {
            using var fileStream = new FileStream(filePath, FileMode.Create);
            {
                fileStream.Write(buffer, 0, buffer.Length);
            }
            return;
        }

        public override void WriteFile<Generic_T>(string filePath, Generic_T data)
        {
            if (data is string)
            {
                #pragma warning disable CS8600
                string dataString = data as string;

                #pragma warning disable CS8604
                byte[] buffer = Encoding.UTF8.GetBytes(dataString);
                this.WriteBufferToFile(filePath, buffer);
            }
            else if (data is IList<byte> byteArrays)
            {
                using var fileStream = new FileStream(filePath, FileMode.Create);

                foreach (byte byteArray in byteArrays)
                {
                    fileStream.WriteByte(byteArray);
                }
            }
            else
            {
                throw new Sen.Shell.Modules.Standards.RuntimeException($"Invalid data type. Expecting string or collection of bytes.", "undefined");
            }
            return;
        }


        public override async Task WriteFileAsync<Generic_T>(string filePath, Generic_T data)
        {
            await Task.Run(() =>
            {
                if (data is string)
                {
                    string dataString = data as string;
                    byte[] buffer = Encoding.UTF8.GetBytes(dataString);
                    this.WriteBufferToFile(filePath, buffer);
                }
                else if (data is IList<byte> byteArrays)
                {
                    using var fileStream = new FileStream(filePath, FileMode.Create);

                    foreach (byte byteArray in byteArrays)
                    {
                        fileStream.WriteByte(byteArray);
                    }
                }
                else
                {
                    throw new ArgumentException($"Invalid data type. Expecting string or collection of bytes.");
                }
            });
            return;
        }


        public override void CreateDirectory(string path) {
            if (path == null)
            {
                throw new ArgumentNullException(path);
            }
            if(!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return;
        }

        public override void DeleteDirectory(string[] directories)
        {
            if(directories == null)
            {
                #pragma warning disable CA2208
                throw new ArgumentNullException($"directories must not be null");
            }
            foreach(var directory in directories)
            {
                if (Directory.Exists(directory))
                {
                    Directory.Delete(directory, true);
                }
            }
            return;
        }

        public override bool DirectoryExists(string file_path) => Directory.Exists(file_path);

        public override bool FileExists(string file_path) => File.Exists(file_path);


        public override Generic_T ReadJson<Generic_T>(string filepath)
        {
            var json_library = new Sen.Shell.Modules.Standards.JsonImplement();
            return json_library.ParseJson<Generic_T>(this.ReadText(filepath, EncodingType.UTF8));
        }

        public override async Task<Generic_T> ReadJsonAsync<Generic_T>(string filepath)
        {
            Generic_T json_object = await Task.Run(()=>this.ReadJson<Generic_T>(filepath));
            return json_object;
        }

        public override string ReadText(string file_path, EncodingType encoding)
        {
            return encoding switch
            {
                EncodingType.UTF8 => File.ReadAllText(file_path, encoding: Encoding.UTF8),
                EncodingType.ASCII => File.ReadAllText(file_path, encoding: Encoding.ASCII),
                EncodingType.LATIN1 => File.ReadAllText(file_path, encoding: Encoding.Latin1),
                EncodingType.UNICODE => File.ReadAllText(file_path, encoding: Encoding.Unicode),
                _ => File.ReadAllText(file_path, encoding: Encoding.Default),
            } ;
        }

        public override Task<string> ReadTextAsync(string file_path, EncodingType encoding)
        {
            return encoding switch
            {
                EncodingType.UTF8 => File.ReadAllTextAsync(file_path, encoding: Encoding.UTF8),
                EncodingType.ASCII => File.ReadAllTextAsync(file_path, encoding: Encoding.ASCII),
                EncodingType.LATIN1 => File.ReadAllTextAsync(file_path, encoding: Encoding.Latin1),
                EncodingType.UNICODE => File.ReadAllTextAsync(file_path, encoding: Encoding.Unicode),
                _ => File.ReadAllTextAsync(file_path, encoding: Encoding.Default),
            };
        }

        public override void WriteJson<Generic_T>(string output_path, Generic_T json_object)
        {
            var json_library = new Sen.Shell.Modules.Standards.JsonImplement();
            var serialize_json = json_library.StringifyJson<Generic_T>(json_object, null);
            this.OutFile(output_path, serialize_json);
            return;
        }

        public override async Task WriteJsonAsync<Generic_T>(string output_path, Generic_T json_object)
        {
            await Task.Run(()=>this.WriteJson<Generic_T>(output_path, json_object));
            return;
        }

        public override void WriteText(string filepath, string data, EncodingType encoding)
        {
            switch(encoding)
            {
                case EncodingType.UTF8:
                    {
                        File.WriteAllText(filepath, data, encoding: Encoding.UTF8);
                        break;
                    }
                case EncodingType.ASCII:
                    {
                        File.WriteAllText(filepath, data, encoding: Encoding.ASCII);
                        break;
                    }
                case EncodingType.LATIN1:
                    {
                        File.WriteAllText(filepath, data, encoding: Encoding.Latin1);
                        break;
                    }

                case EncodingType.UNICODE:
                    {
                        File.WriteAllText(filepath, data, encoding: Encoding.Unicode);
                        break;
                    }

                default:
                    {
                        File.WriteAllText(filepath, data, encoding: Encoding.Default);
                        break;
                    }

            }
            return;
        }

        public override async Task WriteTextAsync(string filepath, string data, EncodingType encoding)
        {
            switch (encoding)
            {
                case EncodingType.UTF8:
                    await File.WriteAllTextAsync(filepath, data, Encoding.UTF8);
                    break;
                case EncodingType.ASCII:
                    await File.WriteAllTextAsync(filepath, data, Encoding.ASCII);
                    break;
                case EncodingType.LATIN1:
                    await File.WriteAllTextAsync(filepath, data, Encoding.Latin1);
                    break;
                case EncodingType.UNICODE:
                    await File.WriteAllTextAsync(filepath, data, Encoding.Unicode);
                    break;
                default:
                    await File.WriteAllTextAsync(filepath, data, Encoding.Default);
                    break;
            }
        }

        public override void OutFile<Generic_T>(string output_path, Generic_T data)
        {
            var path = new Sen.Shell.Modules.Standards.IOModule.ImplementPath();
            if (!this.DirectoryExists(path.GetDirectoryName(output_path)))
            {
                this.CreateDirectory(path.GetDirectoryName(output_path));
            }
            this.WriteFile<Generic_T>(output_path, data);
            return;
        }

        public override async Task OutFileAsync<Generic_T>(string output_path, Generic_T data)
        {
            var path = new Sen.Shell.Modules.Standards.IOModule.ImplementPath();
            if (!this.DirectoryExists(path.GetDirectoryName(output_path)))
            {
                this.CreateDirectory(path.GetDirectoryName(output_path));
            }
            await this.WriteFileAsync<Generic_T>(output_path, data);
            return;
        }

        public override string[] ReadDirectory(string directory, Sen.Shell.Modules.Standards.IOModule.ReadDirectory ReadOption)
        {
            return ReadOption switch
            {
                Sen.Shell.Modules.Standards.IOModule.ReadDirectory.OnlyCurrentDirectory => Directory.GetFiles(directory, "*", SearchOption.TopDirectoryOnly),
                Sen.Shell.Modules.Standards.IOModule.ReadDirectory.AllNestedDirectory => Directory.GetFiles(directory, "*", SearchOption.AllDirectories),
                _ => throw new Exception(null),
            };
        }

        public override byte[] ReadBytes(string filepath)
        {
            return File.ReadAllBytes(filepath);
        }

        public override void WriteBytes(string filepath, byte[] data)
        {
            File.WriteAllBytes(filepath, data);
            return;
        }

        public override async Task WriteBytesAsync(string filepath, byte[] data)
        {
            await File.WriteAllBytesAsync(filepath, data);
            return;
        }

        public override void MoveFile(string filePath, string outpath)
        {
            File.Move(filePath, outpath); 
            return;
        }

        public override void MoveDirectory(string filePath, string outpath)
        {
            Directory.Move(filePath, outpath);
            return;
        }

        public override void RenameFile(string filePath, string newName)
        {
            var path = new ImplementPath();
            string directoryPath = path.GetDirectoryName(filePath);
            string newFilePath = path.Join(directoryPath, newName);
            File.Move(filePath, newFilePath);
            return;
        }

        public override void RenameDirectory(string filePath, string newName)
        {
            #pragma warning disable CS8602
            var path = new ImplementPath();
            string parentDirectoryPath = Directory.GetParent(filePath).FullName;
            string newDirectoryPath = path.Join(parentDirectoryPath, newName);
            Directory.Move(filePath, newDirectoryPath);
            return;
        }
    }


    public class FormatRecords
    {
        private string _root;

        private string _dir;

        private string _basename;

        private string _extname;

        private string _name;

        #pragma warning disable IDE1006
        public string root
        {
            get { return this._root; }

            set
            {
                if (value != null)
                {
                    this._root = value;
                }
            }
        }

        public string dir
        {
            get { return this._dir; }
            set
            {
                if (value != null)
                {
                    this._dir = value;
                }
            }
        }

        public string basename
        {
            get { return this._basename; }
            set
            {
                if (value != null)
                {
                    this._basename = value;
                }
            }
        }

        public string extname
        {
            get { return this._extname; }
            set
            {
                if (value != null)
                {
                    this._extname = value;
                }
            }
        }

        public string name
        {
            get { return this._name; }
            set
            {
                if (value != null)
                {
                    this._name = value;
                }
            }
        }

        #pragma warning disable CS8618
        public FormatRecords()
        {
        }
        #pragma warning disable CS8618
        public FormatRecords(string root, string dir, string basename, string extname, string name)
        {
            if (root != null)
            {
                this._root = root;
            }
            if (dir != null)
            {
                this._dir = dir;
            }
            if (basename != null)
            {
                this._basename = basename;
            }
            if (extname != null)
            {
                this._extname = extname;
            }
            if (name != null)
            {
                this._name = name;
            }
        }



        public override string ToString()
        {
            var json_library = new JsonImplement();
            return json_library.StringifyJson<FormatRecords>(this, null);
        }

    }





    public class ParsedPath
    {

        #pragma warning disable IDE1006
        public string name { get; set; }
        public string dir { get; set; }
        public string ext { get; set; }
        public string basename { get; set; }
        public string name_without_extension { get; set; }
    }

    public abstract class Path_Abstract
    // BASED ON https://nodejs.org/api/path.html with NodeJS 20.2.0 :: JS
    {
        /// <summary>
        ///  Example: "index.html" returns "index"
        /// </summary>
        /// <param name="path">File path of the file or directory in local machine</param>
        /// <param name="suffix">The replacer data</param>
        /// <returns>Returns basename of file or directory path</returns>
        public abstract string Basename(string path, params string[] suffix);

        /// <summary>
        /// Provides the platform-specific path delimiter:
        /// `;` for Windows
        /// `:` for POSIX
        /// </summary>
        /// <returns></returns>

        public abstract string Delimiter();

        /// <summary>
        /// Example: "/test/st/sf/main.js" returns "/test/st/sf"
        /// </summary>
        /// <param name="path">File path or directory path</param>
        /// <returns>Returns directory contains the file or directory</returns>
        public abstract string Dirname(string path);


        /// <summary>
        /// Example "main.js" returns ".js"
        /// </summary>
        /// <param name="path">File path or directory path</param>
        /// <returns>Returns file extension</returns>
        public abstract string Extname(string path);


        public abstract FormatRecords Format(string dir, string root, string basename, string name, string ext);



        public abstract bool IsAbsolute(string path);



        public abstract string Join(params string[] paths);



        public abstract string Normalize(string path);


        public abstract ParsedPath Parse(string filePath);



        public abstract string Relative(string from, string to);


        public abstract string Resolve(string path);


        public abstract string Sep();

        public abstract string GetFileName(string path);

        public abstract string GetDirectoryName(string path);

        public abstract string GetFileNameWithoutExtension(string filepath);
    }


    public class ImplementPath : Path_Abstract
    {
        public override string Basename(string path, params string[] suffixes)
        {
            if (suffixes.Length == 0)
            {
                return Path.GetFileName(path);
            }
            else
            {
                var basenameWithoutExtension = Path.GetFileNameWithoutExtension(path);
                foreach (var suffix in suffixes)
                {
                    if (basenameWithoutExtension.EndsWith(suffix, StringComparison.OrdinalIgnoreCase))
                    {
                        basenameWithoutExtension = basenameWithoutExtension[..^suffix.Length];
                    }
                }
                return basenameWithoutExtension;
            }
        }

        public override string Delimiter() => Path.PathSeparator.ToString();

        #pragma warning disable CS8603

        public override string Dirname(string path) => Path.GetDirectoryName(path);

        public override string Extname(string path) => Path.GetExtension(path);

        public override FormatRecords Format(string dir, string root, string baseName, string name, string ext) =>
            new (root, dir, baseName, ext, name);

        public override bool IsAbsolute(string path) => Path.IsPathRooted(path);

        public override string Join(params string[] paths) => Path.Combine(paths);

        public override string Normalize(string path) => Path.GetFullPath(path);

        public override ParsedPath Parse(string filePath) => new()
        {
            name = this.GetFileName(filePath),
            dir = this.GetDirectoryName(filePath),
            ext = this.Extname(filePath),
            basename = this.Basename(filePath),
            name_without_extension = this.GetFileNameWithoutExtension(filePath),
        };

        public override string Relative(string from, string to) => Path.GetRelativePath(from, to);

        public override string Resolve(string path) => Path.GetFullPath(path);

        public static string FullPath(string path) => Path.GetFullPath(path);

        public override string Sep() => Path.DirectorySeparatorChar.ToString();

        public override string GetFileName(string path) => Path.GetFileName(path);

        public override string GetDirectoryName(string path) => Path.GetDirectoryName(path);

        public override string GetFileNameWithoutExtension(string filepath) => Path.GetFileNameWithoutExtension(filepath);
    }
}
