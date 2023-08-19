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
// TwinStar.ToolKit

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

