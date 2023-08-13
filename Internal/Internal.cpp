// Internal.cpp : Defines the entry point for the application.
//

#include "Internal.h"

#define SenInternalAPI extern "C" __declspec(dllexport) 

SenInternalAPI
inline unsigned char* ZlibCompress(const unsigned char* data, size_t dataSize, int level, size_t & compressedSize) {
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

SenInternalAPI
inline void ZlibUncompress(const uint8_t* data, int dataSize, uint8_t** uncompressedData, int* uncompressedDataSize) {
    z_stream strm;
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = dataSize;
    strm.next_in = (Bytef*)data;

    int ret = inflateInit(&strm);
    if (ret != Z_OK) {
        *uncompressedData = nullptr;
        *uncompressedDataSize = 0;
        return;
    }

    std::vector<uint8_t> outBuffer(32768);
    std::vector<uint8_t> uncompressedVector;
    do {
        strm.avail_out = outBuffer.size();
        strm.next_out = (Bytef*)outBuffer.data();
        ret = inflate(&strm, Z_NO_FLUSH);
        if (uncompressedVector.size() < strm.total_out) {
            uncompressedVector.insert(uncompressedVector.end(), outBuffer.begin(), outBuffer.begin() + strm.total_out - uncompressedVector.size());
        }
    } while (ret == Z_OK);

    inflateEnd(&strm);

    *uncompressedDataSize = uncompressedVector.size();
    *uncompressedData = new uint8_t[*uncompressedDataSize];
    memcpy(*uncompressedData, uncompressedVector.data(), *uncompressedDataSize);
}