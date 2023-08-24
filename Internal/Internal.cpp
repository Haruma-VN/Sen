﻿#include "Internal.hpp"

InternalAPI
UnsignedByteStream ZlibCompress(
    const UnsignedByteStream data,
    ArraySize dataSize, 
    Integer level, 
    ArraySize& compressedSize
) {
    try
    {
        auto destSize = compressBound(dataSize);
        auto compressedData = new unsigned char[destSize];
        auto result = compress2(compressedData, &destSize, data, dataSize, level);
        if (result != Z_OK) {
            delete[] compressedData;
            throw_line("Compression failed");
        }
        compressedSize = destSize;
        return compressedData;
    }
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX &e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
Void ZlibUncompress(
    const Uint8Array* data, 
    Integer dataSize, 
    Uint8Array** uncompressedData, 
    Integer* uncompressedDataSize
) {
    try
    {
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
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX& e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
UnsignedByteStream GZipCompress(
    const char* data, 
    size_t data_size, 
    size_t * compressed_data_size
) {
    try
    {
        auto stream = z_stream{};
        stream.zalloc = Z_NULL;
        stream.zfree = Z_NULL;
        stream.opaque = Z_NULL;
        stream.avail_in = data_size;
        stream.next_in = reinterpret_cast<Bytef*>(const_cast<char*>(data));
        if (deflateInit2(&stream, Z_DEFAULT_COMPRESSION, Z_DEFLATED, 15 | 16, 8, Z_DEFAULT_STRATEGY) != Z_OK) {
            throw_line("Failed to initialize zlib stream");
        }
        auto compressed_data = std::vector<uint8_t>{};
        std::vector<uint8_t> buffer(1024);
        int result;
        do {
            stream.avail_out = buffer.size();
            stream.next_out = buffer.data();
            result = deflate(&stream, Z_FINISH);
            if (result == Z_STREAM_ERROR) {
                throw_line("Failed to compress data");
            }
            auto bytes_written = buffer.size() - stream.avail_out;
            compressed_data.insert(compressed_data.end(), buffer.begin(), buffer.begin() + bytes_written);
        } while (result != Z_STREAM_END);
        deflateEnd(&stream);
        *compressed_data_size = compressed_data.size();
        auto result_data = new unsigned char[compressed_data.size()];
        std::copy(compressed_data.begin(), compressed_data.end(), result_data);
        return result_data;
    }
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX& e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
UnsignedByteStream GZipUncompress(
    const char* data, 
    size_t data_size, 
    size_t * uncompressed_data_size
) {
    try
    {
        auto stream = z_stream();
        stream.zalloc = Z_NULL;
        stream.zfree = Z_NULL;
        stream.opaque = Z_NULL;
        stream.avail_in = data_size;
        stream.next_in = reinterpret_cast<Bytef*>(const_cast<char*>(data));
        if (inflateInit2(&stream, 15 | 16) != Z_OK) {
            throw_line("Failed to initialize zlib stream");
        }
        auto uncompressed_data = std::vector<uint8_t>{};
        std::vector<uint8_t> buffer(1024);
        int result;
        do {
            stream.avail_out = buffer.size();
            stream.next_out = buffer.data();
            result = inflate(&stream, Z_NO_FLUSH);
            if (result == Z_STREAM_ERROR || result == Z_NEED_DICT || result == Z_DATA_ERROR || result == Z_MEM_ERROR) {
                throw_line("Failed to uncompress data");
            }
            size_t bytes_written = buffer.size() - stream.avail_out;
            uncompressed_data.insert(uncompressed_data.end(), buffer.begin(), buffer.begin() + bytes_written);
        } while (result != Z_STREAM_END);
        inflateEnd(&stream);
        *uncompressed_data_size = uncompressed_data.size();
        auto result_data = new unsigned char[uncompressed_data.size()];
        std::copy(uncompressed_data.begin(), uncompressed_data.end(), result_data);
        return result_data;
    }
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX& e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
void DeflateCompress(
    const char* input,
    int inputSize,
    char** output,
    int* outputSize
)
{
    z_stream strm;
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = inputSize;
    strm.next_in = (Bytef*)input;

    int ret = deflateInit2(&strm, Z_DEFAULT_COMPRESSION, Z_DEFLATED, -MAX_WBITS, MAX_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    if (ret != Z_OK)
        return;

    *outputSize = deflateBound(&strm, inputSize);
    *output = new char[*outputSize];

    strm.avail_out = *outputSize;
    strm.next_out = (Bytef*)*output;

    ret = deflate(&strm, Z_FINISH);

    deflateEnd(&strm);

    if (ret == Z_STREAM_END) {
        *outputSize = strm.total_out;
        *output = (char*)realloc(*output, *outputSize);
    }
    else {
        delete[] * output;
        *output = nullptr;
        *outputSize = 0;
    }
    return;
}


InternalAPI
const char* BZip2Compress(
    const char* data,
    size_t data_size,
    size_t* compressed_data_size
) {
    try
    {
        auto inputString = std::string(data, data_size);
        auto outputVector = Sen::Internal::Kernel::Tool::Compress::Bzip2::compress_bzip2(inputString);
        auto outputData = new char[outputVector.size()];
        std::copy(outputVector.begin(), outputVector.end(), outputData);
        *compressed_data_size = outputVector.size();
        return outputData;
    }
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX& e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
Void DeflateUncompress(
    unsigned char* in,
    int in_len, 
    unsigned char** out, 
    int* out_len) 
{
    int ret;
    unsigned have;
    z_stream strm;
    unsigned char out_buf[CHUNK];
    int out_size = 0;

    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = in_len;
    strm.next_in = in;

    ret = inflateInit2(&strm, -MAX_WBITS);
    if (ret != Z_OK)
        return;

    do {
        strm.avail_out = CHUNK;
        strm.next_out = out_buf;
        ret = inflate(&strm, Z_NO_FLUSH);
        assert(ret != Z_STREAM_ERROR);
        switch (ret) {
        case Z_NEED_DICT:
            ret = Z_DATA_ERROR;
        case Z_DATA_ERROR:
        case Z_MEM_ERROR:
            (void)inflateEnd(&strm);
            return;
        }
        have = CHUNK - strm.avail_out;

        *out = (unsigned char*)realloc(*out, out_size + have);
        memcpy(*out + out_size, out_buf, have);
        out_size += have;

    } while (strm.avail_out == 0);

    (void)inflateEnd(&strm);

    *out_len = out_size;
    return;
}

InternalAPI
const char* BZip2Uncompress(
    const char* data,
    size_t data_size,
    size_t* uncompressed_data_size
) {
    try
    {
        auto inputVector = std::vector<char>(data, data + data_size);
        auto outputVector = Sen::Internal::Kernel::Tool::Compress::Bzip2::uncompress_bzip2(inputVector);
        auto outputData = new char[outputVector.size()];
        std::copy(outputVector.begin(), outputVector.end(), outputData);
        *uncompressed_data_size = outputVector.size();
        return outputData;
    }
    catch (const Sen::Internal::Kernel::Utility::Exception::ExceptionX& e)
    {
        log(e.what());
        throw 0;
    }
}

InternalAPI
Void lzmaCompress(
    unsigned char* in, 
    size_t in_len, 
    unsigned char** out, 
    size_t* out_len
) {
    size_t out_size = in_len + (in_len / 3) + 128;
    *out = (unsigned char*)malloc(out_size + LZMA_PROPS_SIZE);

    size_t props_size = LZMA_PROPS_SIZE;
    int res = LzmaCompress(*out + LZMA_PROPS_SIZE, &out_size, in, in_len, *out, &props_size, 5, 1 << 24, 3, 0, 2, 32, 1);
    if (res != SZ_OK) {
        free(*out);
        *out = NULL;
        *out_len = 0;
        return;
    }

    *out_len = out_size + LZMA_PROPS_SIZE;
}


InternalAPI
Void lzmaUncompress(
    unsigned char* in, 
    size_t in_len, 
    unsigned char** out, 
    size_t* out_len
) {
    size_t out_size = in_len * 10;
    *out = (unsigned char*)malloc(out_size);

    auto res = LzmaUncompress(*out, &out_size, in + LZMA_PROPS_SIZE, &in_len, in, LZMA_PROPS_SIZE);
    if (res != SZ_OK) {
        free(*out);
        *out = NULL;
        *out_len = 0;
        return;
    }

    *out_len = out_size;
    return;
}


InternalAPI
Architecture GetProcessorArchitecture()
{
#if defined(_WIN32)
    SYSTEM_INFO si;
    GetNativeSystemInfo(&si);

    switch (si.wProcessorArchitecture)
    {
    case PROCESSOR_ARCHITECTURE_AMD64:
        return Architecture::X64;
    case PROCESSOR_ARCHITECTURE_ARM:
        return Architecture::ARM;
    case PROCESSOR_ARCHITECTURE_IA64:
        return Architecture::INTEL;
    case PROCESSOR_ARCHITECTURE_INTEL:
        return Architecture::X86;
    default:
        return Architecture::UNKNOWN;
    }
#else
    std::array<char, 128> buffer;
    std::string result;
    FILE* pipe = popen("uname -m", "r");
    if (!pipe) throw std::runtime_error("popen() failed!");
    while (fgets(buffer.data(), 128, pipe) != nullptr) {
        result += buffer.data();
    }
    auto returnCode = pclose(pipe);

    result.erase(std::remove(result.begin(), result.end(), '\n'), result.end());

    if (result == "x86_64")
        return Architecture::X64;
    else if (result == "i686")
        return Architecture::X86;
    else if (result == "aarch64")
        return Architecture::ARM64;
    else if (result == "armv7l")
        return Architecture::ARM;
    else
        return Architecture::UNKNOWN;
#endif
}

InternalAPI
Integer InternalVersion()
{
    return MInternalVersion;
}

#if WINDOWS || LINUX || MACINTOSH
#include "dependencies/tinyfiledialogs/tinyfiledialogs.c"
InternalAPI
CString OpenFileDialog(const CString title)
{
    auto file = tinyfd_openFileDialog(
        title,
        null,
        0,
        null,
        null,
        0
    );
    return file;
}
#if WINDOWS
#pragma warning disable

inline auto utf16_to_utf8(
    std::u16string_view const& source
) -> std::u8string {
    auto converter = std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t>{};
    auto result = converter.to_bytes(
        source.data(),
        source.data() + source.size()
    );
    return reinterpret_cast<std::u8string&>(result);
}

inline auto pick_path(
    bool const& is_directory,
    bool const& is_multiply
) -> std::vector<std::string> {
    auto state_h = HRESULT{};
    auto result = std::vector<std::string>{};
    CoInitialize(nullptr);
    auto dialog = std::add_pointer_t<IFileOpenDialog>{ nullptr };
    state_h = CoCreateInstance(__uuidof(FileOpenDialog), nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(&dialog));
    auto option = FILEOPENDIALOGOPTIONS{};
    state_h = dialog->GetOptions(&option);
    option |= FOS_FORCEFILESYSTEM | FOS_NODEREFERENCELINKS | FOS_DONTADDTORECENT | FOS_FORCESHOWHIDDEN;
    if (is_directory) {
        option |= FOS_PICKFOLDERS;
    }
    if (is_multiply) {
        option |= FOS_ALLOWMULTISELECT;
    }
    state_h = dialog->SetOptions(option);
    state_h = dialog->Show(nullptr);
    if (state_h != HRESULT_FROM_WIN32(ERROR_CANCELLED)) {
        auto selection_item_list = std::add_pointer_t<IShellItemArray>{ nullptr };
        state_h = dialog->GetResults(&selection_item_list);
        auto count = DWORD{ 0 };
        state_h = selection_item_list->GetCount(&count);
        result.reserve(count);
        for (auto index = DWORD{ 0 }; index < count; ++index) {
            auto item = std::add_pointer_t<IShellItem>{ nullptr };
            auto display_name = LPWSTR{ nullptr };
            state_h = selection_item_list->GetItemAt(index, &item);
            state_h = item->GetDisplayName(SIGDN_FILESYSPATH, &display_name);
            auto display_name_8 = utf16_to_utf8(std::u16string_view{ reinterpret_cast<char16_t const*>(display_name) });
            result.emplace_back(std::move(reinterpret_cast<std::string&>(display_name_8)));
            CoTaskMemFree(display_name);
            item->Release();
        }
        selection_item_list->Release();
    }
    dialog->Release();
    return result;
}

InternalAPI
char const* OpenDirectoryDialog(
)
{
    auto path = pick_path(true, false);
    return &path[0][0];
}
#else
InternalAPI
char const* OpenDirectoryDialog(char const* title)
{
        char const* lTheSelectFolderName = tinyfd_selectFolderDialog(
            title,
            NULL
        );
    return lTheSelectFolderName;
}
#endif


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

InternalAPI
Void SendMessageBox(
    const char* title,
    const char* message,
    const char* btn_display
)
{
    tinyfd_messageBox(title, message, btn_display, "info", 1);
    return;
}
#endif

