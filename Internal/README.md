# Internal

`Internal` provide additional function to the `Shell`.

## Project development

If you wish to compile the project yourself, you would need these:

-   [CMAKE 3.8+](https://cmake.org/)
-   [TypeScript 4.8.0+](https://www.typescriptlang.org/)
-   [Powershell for Windows](https://learn.microsoft.com/en-us/powershell/)
-   [Ubuntu for Linux](https://ubuntu.com/tutorials/command-line-for-beginners)
-   [Terminal for Macintosh](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/Introduction/Introduction.html)
-   [MSVC 19.36 with MSVC for Windows](https://visualstudio.microsoft.com/downloads/)

-   [Clang 16.0 for Linux](https://llvm.org/)

-   [Clang 16.0 for Macintosh](https://llvm.org/)

-   [Clang 14.0 for Android (NDK 25.2)](https://developer.android.com/ndk/downloads)

-   [Clang 16.0 for iPhone](https://llvm.org/)

Change the directory to the directory contains the `Internal` by using this command:

```shell
cd [directory_contains_cmake_project]
```

> For Windows, you can use the command below with permission to the Windows Powershell to compile the `Internal`
>
> ```shell
> ./build.ps1
> ```

> For Linux, Macintosh, you can use this command with the terminal:
>
> ```shell
> ./build.sh
> ```

## Third Dependencies

-   [etcpak](https://github.com/wolfpld/etcpak): ETC Encode
-   [zlib.h](https://github.com/intel/zlib): Zlib Compress & Uncompress
-   [avir](https://github.com/avaneev/avir): Resize image
-   [rg_etc1](https://github.com/richgel999/rg-etc1): ETC Encode
-   [json](https://github.com/nlohmann/json): JSON Library
-   [tinyfiledialogs](https://sourceforge.net/projects/tinyfiledialogs): forwarding interactive
-   [ETCPACK](https://github.com/Ericsson/ETCPACK): ETC Decode
