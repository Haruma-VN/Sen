# Script

`Script` control the flows of the tool.

## Project development

If you wish to compile the project yourself, you would need these:

-   [NodeJS 18.16.0+](https://nodejs.org/en)
-   [TypeScript 4.8.0+](https://www.typescriptlang.org/)
-   [Powershell for Windows](https://learn.microsoft.com/en-us/powershell/)
-   [Ubuntu for Linux](https://ubuntu.com/tutorials/command-line-for-beginners)
-   [Shell for Macintosh](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/Introduction/Introduction.html)

After installed NodeJS on the main page, use this command to install typescript:

```nodejs
npm i typescript -g
```

Change the directory to the directory contains the `Script` by using this command:

```shell
cd [directory_contains_script]
```

> For Windows, you can use the command below with permission to the Windows Powershell to compile the `Script`
>
> ```shell
> ./link.bat
> ```

> For Linux, Macintosh, you can use this command with the terminal:
>
> ```shell
> ./link.sh
> ```

## Third Dependencies

-   [fast-sort](https://github.com/snovakovic/fast-sort): Sorting algorithm used to sort multiple arrays.

-   [maxrects-packer](https://github.com/soimy/maxrects-packer): MaxRects algorithm for packing images, used for packing atlas.
