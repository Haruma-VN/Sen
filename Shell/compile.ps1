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



$platforms = @("win-x64", "win-x86", "win-arm64", "osx-x64", "osx-arm64", "linux-x64", "linux-arm", "linux-arm64")


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

function Compress-Folder {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]$FolderPath
    )

    $FolderPath = Resolve-Path $FolderPath
    $DirectoryName = (Get-Item $FolderPath).Name
    $ZipFileName = "$DirectoryName.zip"

    Add-Type -A 'System.IO.Compression.FileSystem'
    [System.IO.Compression.ZipFile]::CreateFromDirectory($FolderPath, $ZipFileName)

    Write-Host "Folder '$FolderPath' compressed to '$ZipFileName'."
}

foreach ($platform in $platforms) {
    $directoryPath = Join-Path -Path $publishPath -ChildPath "shell.$platform"
    Compress-Folder -FolderPath $directoryPath
}

Write-Host "All commands executed!"
