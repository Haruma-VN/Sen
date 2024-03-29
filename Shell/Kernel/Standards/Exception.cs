﻿namespace Sen.Shell.Kernel.Standards
{

    public enum StandardsException
    {
        RuntimeException,
        RTONException,
        RTONDecodeException,
        PAMException,
        PAMEncodeException,
        PAMDecodeException,
        ZlibException,
    }

    public class RuntimeException : System.Exception
    {

        #pragma warning disable IDE1006

        protected StandardsException _errorCode { get; set; }

        public string _file_path { get; set; }

        public RuntimeException(string message, string file_path) : base(message)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.RuntimeException;
            this._file_path = file_path;
        }

        public StandardsException ErrorCode
        {
            get { return this._errorCode; }
            set
            {
                if (this._errorCode != value)
                {
                    this._errorCode = value;
                }
            }
        }

        public string file_path
        {
            get { return this._file_path; }
            set
            {
                if (this._file_path != value)
                {
                    this._file_path = value;
                }
            }
        }
    }

    public class RTONException : RuntimeException
    {

        public RTONException(string message, string file_path) : base(message, file_path)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.RTONException;
        }
    }

    public class PAMException : RuntimeException
    {
        public PAMException(string message, string errorCode, string filepath) : base(Localization.GetString(message), errorCode)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.PAMException;
            var system = new SystemImplement();
            if(errorCode != "undefined" && errorCode != "")
            {
                system.Print(ConsoleColor.Red, Localization.GetString("popcap_animation_error_detected"));
                system.Printf(ConsoleColor.White, $"      {errorCode}");
            }
            system.Print(ConsoleColor.Red, Localization.GetString("popcap_animation_error_detected"));
            system.Printf(ConsoleColor.White, $"      {filepath}");
        }
    }

    public class RSBException : Exception
    {
        public RSBException(string message, string manifest, string rsgPath) : base(message) 
        {
            var system = new SystemImplement();
            system.Print(ConsoleColor.Red, Localization.GetString("in_manifest_file"));
            system.Printf(ConsoleColor.White, $"      {manifest}");
            system.Print(ConsoleColor.Red, Localization.GetString("rsg_error_path"));
            system.Printf(ConsoleColor.White, $"      {rsgPath}");
        }
    }

    public class PAMEncodeException : RuntimeException
    {
        public PAMEncodeException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.PAMEncodeException;
        }
    }

    public class PAMDecodeException : RuntimeException
    {
        public PAMDecodeException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.PAMDecodeException;
        }
    }

    public class ZlibException : RuntimeException
    {
        public ZlibException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.ZlibException;
        }
    }

    public class RTONDecodeException : RTONException
    {

        private Sen.Shell.Kernel.Support.PvZ2.RTON.RTONListException _Exception;
        public Sen.Shell.Kernel.Support.PvZ2.RTON.RTONListException exception
        {
            get { return this._Exception; }
            set { this._Exception = value; }
        }

        public string expected;

        public RTONDecodeException(string message, string errorCode, string expected, Sen.Shell.Kernel.Support.PvZ2.RTON.RTONListException exception) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Kernel.Standards.StandardsException.RTONDecodeException;
            this._Exception = exception;
            this.expected = expected;
        }
    }
}
