#!/bin/bash

source=$(dirname "$(realpath "$0")")
target="$source/../Scripts"

# Copy JSON files
find "$source" -type f -name "*.json" -print0 | while IFS= read -r -d '' item; do
    relativePath=${item#"$source"}
    destination="$target$relativePath"
    if [ "$relativePath" != "/tsconfig.json" ]; then
        echo "Copying: $relativePath"
        destinationDir=$(dirname "$destination")
        mkdir -p "$destinationDir"
        cp "$item" "$destination"
    fi
done

# Copy XML files
find "$source" -type f -name "*.xml" -print0 | while IFS= read -r -d '' item; do
    relativePath=${item#"$source"}
    destination="$target$relativePath"
    echo "Copying: $relativePath"
    destinationDir=$(dirname "$destination")
    mkdir -p "$destinationDir"
    cp "$item" "$destination"
done

# Copy Lua files
find "$source" -type f -name "*.lua" -print0 | while IFS= read -r -d '' item; do
    relativePath=${item#"$source"}
    destination="$target$relativePath"
    echo "Copying: $relativePath"
    destinationDir=$(dirname "$destination")
    mkdir -p "$destinationDir"
    cp "$item" "$destination"
done

# Copy Png files
find "$source" -type f -name "*.png" -print0 | while IFS= read -r -d '' item; do
    relativePath=${item#"$source"}
    destination="$target$relativePath"
    echo "Copying: $relativePath"
    destinationDir=$(dirname "$destination")
    mkdir -p "$destinationDir"
    cp "$item" "$destination"
done

# Copy Bin files
find "$source" -type f -name "*.bin" -print0 | while IFS= read -r -d '' item; do
    relativePath=${item#"$source"}
    destination="$target$relativePath"
    echo "Copying: $relativePath"
    destinationDir=$(dirname "$destination")
    mkdir -p "$destinationDir"
    cp "$item" "$destination"
done

# Run tsc
echo "Transpiling TS to JS"
tsc

# Finish

echo "All commands executed!"
