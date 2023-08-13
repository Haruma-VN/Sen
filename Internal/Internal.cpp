// Internal.cpp : Defines the entry point for the application.
//

#include "Internal.h"

typedef void Void;

typedef unsigned char* UnsignedByteStream;

typedef int Integer;

typedef size_t ArraySize;

typedef uLongf ZlibUnsignedLongFloat;

typedef uint8_t Uint8Array;

typedef std::string String;


#define InternalAPI extern "C" __declspec(dllexport) 

InternalAPI
inline auto ZlibCompress(const UnsignedByteStream data, ArraySize dataSize, Integer level, ArraySize& compressedSize) -> UnsignedByteStream {
    auto destSize = compressBound(dataSize);
    auto compressedData = new unsigned char[destSize];
    auto result = compress2(compressedData, &destSize, data, dataSize, level);
    if (result != Z_OK) {
        delete[] compressedData;
        throw std::runtime_error("Compression failed");
    }
    compressedSize = destSize;
    return compressedData;
}

InternalAPI
inline auto ZlibUncompress(const Uint8Array* data, Integer dataSize, Uint8Array** uncompressedData, Integer* uncompressedDataSize) -> Void {
    z_stream strm{};
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = dataSize;
    strm.next_in = (Bytef*)data;
    auto ret = inflateInit(&strm);
    if (ret != Z_OK) {
        *uncompressedData = nullptr;
        *uncompressedDataSize = 0;
        return;
    }
    std::vector<Uint8Array> outBuffer(32768);
    std::vector<Uint8Array> uncompressedVector;
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
    return;
}
