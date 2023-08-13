// Internal.cpp : Defines the entry point for the application.
//

#include "Internal.h"

#define SenInternalAPI extern "C" __declspec(dllexport) 

SenInternalAPI
inline unsigned char* compress_zlib(const unsigned char* data, size_t dataSize, int level, size_t & compressedSize) {
    uLongf destSize = compressBound(dataSize);
    unsigned char* compressedData = new unsigned char[destSize];

    int result = compress2(compressedData, &destSize, data, dataSize, level);
    if (result != Z_OK) {
        delete[] compressedData;
        throw std::runtime_error("Compression failed");
    }

    compressedSize = destSize;
    return compressedData;
}