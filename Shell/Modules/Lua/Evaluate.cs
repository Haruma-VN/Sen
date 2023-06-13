using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MoonSharp.Interpreter;

namespace Sen.Shell.Modules.Lua
{
    internal class Evaluate
    {
        public static void test()
        {

            // Create a new Lua script instance
            Script lua = new Script();

            // Load and execute a Lua script
            lua.DoFile("test.lua");

            // Access the customization object
            DynValue customizationValue = lua.Globals.Get("customization");
            Table customizationTable = customizationValue.Table;

            // Retrieve the 'default' table
            DynValue defaultValue = customizationTable.Get("default");
            Table defaultTable = defaultValue.Table;

            // Retrieve the 'language' value from the 'default' table
            string language = defaultTable.Get("language").String;

            // Use the retrieved values in your C# code
            Console.WriteLine("Default language: " + language);
        }
    }
}
