using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sen.Shell.Modules.Standards
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

        protected string _file_path { get; set; }

        public RuntimeException(string message, string file_path) : base(message)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.RuntimeException;
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
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.RTONException;
        }
    }

    public class PAMException : RuntimeException
    {
        public PAMException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.PAMException;
        }
    }

    public class PAMEncodeException : RuntimeException
    {
        public PAMEncodeException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.PAMEncodeException;
        }
    }

    public class PAMDecodeException : RuntimeException
    {
        public PAMDecodeException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.PAMDecodeException;
        }
    }

    public class ZlibException : RuntimeException
    {
        public ZlibException(string message, string errorCode) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.ZlibException;
        }
    }

    public class RTONDecodeException : RTONException
    {

        private Sen.Shell.Modules.Support.PvZ2.RTON.RTONListException _Exception;
        public Sen.Shell.Modules.Support.PvZ2.RTON.RTONListException exception
        {
            get { return this._Exception; }
            set { this._Exception = value; }
        }

        public string expected;

        public RTONDecodeException(string message, string errorCode, string expected, Sen.Shell.Modules.Support.PvZ2.RTON.RTONListException exception) : base(message, errorCode)
        {
            this._errorCode = Sen.Shell.Modules.Standards.StandardsException.RTONDecodeException;
            this._Exception = exception;
            this.expected = expected;
        }
    }
}
