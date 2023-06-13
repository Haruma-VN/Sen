$source = "$PSScriptRoot".Replace('\', '/')
$target = Join-Path $source "../Scripts"

# Copy JSON files
Get-ChildItem $source -recurse -Filter "*.json" | ForEach-Object {
    $item = $_.FullName.Replace('\', '/')
    $relativePath = $_.FullName.Substring($source.Length).Replace('\', '/')
    $destination = Join-Path $target $relativePath
    if (-not ($relativePath -eq "/tsconfig.json")) {
        Write-Host "Copying: $relativePath"
        $destinationDir = Split-Path -Path $destination
        if (!(Test-Path -Path $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force
        }
        Copy-Item -Path $item -Destination $destination
    }
}

# Copy XML files
Get-ChildItem $source -recurse -Filter "*.xml" | ForEach-Object {
    $item = $_.FullName.Replace('\', '/')
    $relativePath = $_.FullName.Substring($source.Length).Replace('\', '/')
    $destination = Join-Path $target $relativePath
    Write-Host "Copying: $relativePath"
    $destinationDir = Split-Path -Path $destination
    if (!(Test-Path -Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force
    }
    Copy-Item -Path $item -Destination $destination
}

# Copy Lua files
Get-ChildItem $source -recurse -Filter "*.lua" | ForEach-Object {
    $item = $_.FullName.Replace('\', '/')
    $relativePath = $_.FullName.Substring($source.Length).Replace('\', '/')
    $destination = Join-Path $target $relativePath
    Write-Host "Copying: $relativePath"
    $destinationDir = Split-Path -Path $destination
    if (!(Test-Path -Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force
    }
    Copy-Item -Path $item -Destination $destination
}

# Run tsc
Write-Host "Transpiling TS to JS"
& tsc

# Finish

Write-Host "All commands executed!"
