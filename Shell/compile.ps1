Write-Host "Start compilation"

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
$publishPath = "./bin/Release/net8.0"
$movePath = "./bin/Release/net8.0/"

$platforms = @("win-x64", "win-x86", "win-arm", "win-arm64", "osx-x64", "osx-arm64", "linux-x64", "linux-arm", "linux-arm64")

foreach ($platform in $platforms) {
    $directoryPath = Join-Path -Path $publishPath -ChildPath $platform
    $targetDirectory = Join-Path -Path $directoryPath -ChildPath "publish"

    if (Test-Path -Path $targetDirectory) {
        $newDirectoryName = "shell.$platform"

        Rename-Item -Path $targetDirectory -NewName $newDirectoryName -ErrorAction SilentlyContinue
        Move-Item -Path (Join-Path -Path $directoryPath -ChildPath $newDirectoryName) -Destination $movePath -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $directoryPath -Force -Recurse -ErrorAction SilentlyContinue
    }
}

Write-Host "All commands executed!"
