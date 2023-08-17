#include "Internal.hpp"


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
    strm.next_in = (FloatByte*)data;
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
        strm.next_out = (FloatByte*)outBuffer.data();
        ret = inflate(&strm, Z_NO_FLUSH);
        if (uncompressedVector.size() < strm.total_out) {
            uncompressedVector.insert(uncompressedVector.end(), outBuffer.begin(), outBuffer.begin() + strm.total_out - uncompressedVector.size());
        }
    } while (ret == Z_OK);
    inflateEnd(&strm);
    *uncompressedDataSize = uncompressedVector.size();
    *uncompressedData = new Uint8Array[*uncompressedDataSize];
    memcpy(*uncompressedData, uncompressedVector.data(), *uncompressedDataSize);
    return;
}

InternalAPI
inline auto InternalVersion() -> Integer
{
    return MInternalVersion;
}

#if WINDOWS || LINUX || MACINTOSH
#include "dependencies/tinyfiledialogs/tinyfiledialogs.c"

InternalAPI
inline auto OpenFileDialog(const CString title) -> String
{
    auto file = tinyfd_openFileDialog(
        title,
        "",
        0,
        NULL,
        NULL,
        0);
    return (String) file;
}

InternalAPI
inline auto OpenDirectoryDialog(const CString title) -> String
{
    auto directory = tinyfd_selectFolderDialog(
        title,
        ""
    );
    return (String) directory;
}

#else
InternalAPI
inline auto OpenFile(const CString title) -> Integer
{
    return 0;
}
inline auto OpenDirectory(const CString title) -> Integer
{
    return 0;
}
#endif

