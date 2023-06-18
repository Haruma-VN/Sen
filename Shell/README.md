# Shell

`Shell` using [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) for long term support, create an interface for users to interact with the tool and contains various functions to use.

## Project development

If you wish to compile the project yourself, you would need these:

-   [Microsoft Visual Studio 2022](https://visualstudio.microsoft.com/)
-   [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

The compiled project is compiled to `onefile` to remove the `.NET 8.0 Requirement`, but if you have it on your local machine, you can compile the project yourself to reduce the size of `Shell`

To compile the project, first open the `Sen.csproj` with `Microsoft Visual Studio 2022`, right click on `Sen` > `publish` and compile the project, the new executable will appears on your local machine without any issues.

## Third Dependencies

-   [JavaScriptEngineSwitcher.Jint 1.16.0](https://github.com/Taritsyn/JavaScriptEngineSwitcher): The JS Engine used by the `Shell`, used to parse JS which supports the `Shell` to read and process `Script`.

-   [DotNetZip 1.16.0](https://github.com/haf/DotNetZip.Semverd): Compression library Sen uses, mostly for ZLIB.

-   [SixLabors.ImageSharp 3.0.1](https://github.com/SixLabors/ImageSharp): The image library of `Sen`, used to create image, composite, resize,...
