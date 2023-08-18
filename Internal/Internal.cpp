#include "Internal.hpp"


InternalAPI
UnsignedByteStream ZlibCompress(const UnsignedByteStream data, ArraySize dataSize, Integer level, ArraySize& compressedSize) {
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
Void ZlibUncompress(const Uint8Array* data, Integer dataSize, Uint8Array** uncompressedData, Integer* uncompressedDataSize) {
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
Integer InternalVersion()
{
    return MInternalVersion;
}

#if WINDOWS || LINUX || MACINTOSH
#include "dependencies/tinyfiledialogs/tinyfiledialogs.c"
#if WINDOWS
#include <Windows.h>
#endif

InternalAPI
CString OpenFileDialog(const CString title)
{
    auto file = tinyfd_openFileDialog(
        title,
        nullptr,
        0,
        NULL,
        NULL,
        0);
    return file;
}

InternalAPI
CString OpenDirectoryDialog(const CString title)
{
    auto directory = tinyfd_selectFolderDialog(
        title,
        nullptr
    );
    return directory;
}

InternalAPI
Void SendLosNotification(
    const char* title,
    const char* message, 
    const char* info
)
{
    tinyfd_notifyPopup(title, message, info);
    return;
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

