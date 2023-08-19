#include <iostream>
#include <string>
#include <vector>
#include "../../dependencies/lzma/LzmaLib.c"

namespace Sen::Internal::Kernel::Tool::Compress::lzma 
{

    inline auto compress_lzma(
        const std::vector<uint8_t>& data
    ) -> std::vector<uint8_t> {
        auto compressed_data_size = data.size() + (data.size() / 3) + 128;
        std::vector<uint8_t> compressed_data(compressed_data_size);
        size_t props_size = LZMA_PROPS_SIZE;
        auto result = LzmaCompress(compressed_data.data() + LZMA_PROPS_SIZE, &compressed_data_size,
            data.data(), data.size(),
            compressed_data.data(), &props_size,
            5, 1 << 24, 3, 0, 2, 32, 1);
        if (result != SZ_OK) {
            throw std::runtime_error("Failed to compress data");
        }
        compressed_data.resize(compressed_data_size + LZMA_PROPS_SIZE);
        return compressed_data;
    }

    inline auto uncompress_lzma(
        const std::vector<uint8_t>& data
    ) -> std::vector<uint8_t> {
        auto uncompressed_data_size = (static_cast<uint64_t>(data[5]) << 32) |
            (static_cast<uint64_t>(data[6]) << 24) |
            (static_cast<uint64_t>(data[7]) << 16) |
            (static_cast<uint64_t>(data[8]) << 8) |
            static_cast<uint64_t>(data[9]);
        if (uncompressed_data_size == static_cast<uint64_t>(-1)) {
            throw std::runtime_error("Failed to determine uncompressed data size");
        }
        std::vector<uint8_t> uncompressed_data(uncompressed_data_size);
        size_t src_len = data.size() - LZMA_PROPS_SIZE;
        auto result = LzmaUncompress(uncompressed_data.data(), &uncompressed_data_size,
            data.data() + LZMA_PROPS_SIZE, &src_len,
            data.data(), LZMA_PROPS_SIZE);
        if (result != SZ_OK) {
            throw std::runtime_error("Failed to uncompress data");
        }
        uncompressed_data.resize(uncompressed_data_size);
        return uncompressed_data;
    }

}

