#pragma once
#include "../../dependencies/etcpak/ProcessRGB.hpp"

void Encode()
{
	int width = ...;
	int height = ...;
	unsigned char* imageData = ...;

	// Compress image data using ETC1 format
	unsigned char* compressedData = compress(imageData, width, height, ETC1);
}