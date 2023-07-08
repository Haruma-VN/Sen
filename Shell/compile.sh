#!/bin/bash

echo "Start compilation"

# Windows
dotnet publish -c Release -r win-x64 --self-contained true
dotnet publish -c Release -r win-x86 --self-contained true
dotnet publish -c Release -r win-arm --self-contained true
dotnet publish -c Release -r win-arm64 --self-contained true

# Macintosh
dotnet publish -c Release -r osx-x64 --self-contained true
dotnet publish -c Release -r osx-arm64 --self-contained true

# Linux
dotnet publish -c Release -r linux-x64 --self-contained true
dotnet publish -c Release -r linux-arm --self-contained true
dotnet publish -c Release -r linux-arm64 --self-contained true

# Rename and remove directories
publishPath="./bin/Release/net8.0"
movePath="./bin/Release/net8.0/"

platforms=("win-x64" "win-x86" "win-arm64" "osx-x64" "osx-arm64" "linux-x64" "linux-arm" "linux-arm64")

for platform in "${platforms[@]}"; do
    directoryPath="$publishPath/$platform"
    targetDirectory="$directoryPath/publish"

    if [[ -d $targetDirectory ]]; then
        newDirectoryName="shell.$platform"

        mv -f "$targetDirectory" "$directoryPath/$newDirectoryName"
        mv -f "$movePath$newDirectoryName" "$directoryPath"
        rm -rf "$directoryPath"
    fi
done

function CompressFolder {
    folderPath=$1
    directoryName=$(basename "$folderPath")
    zipFileName="$directoryName.zip"

    zip -r "$zipFileName" "$folderPath"

    echo "Folder '$folderPath' compressed to '$zipFileName'."
}

for platform in "${platforms[@]}"; do
    directoryPath="$publishPath/shell.$platform"
    CompressFolder "$directoryPath"
done

echo "All commands executed!"
