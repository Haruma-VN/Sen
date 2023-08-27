#pragma once

#include <iostream>
#include <string>
#include <vector>
#include "dependencies/bzip2/bzlib.h"

namespace Sen::Internal::Kernel::Tool::Compress::Bzip2 
{
    inline auto compress_bzip2(
        const std::string& data
    ) -> std::vector<char> {
        auto stream = bz_stream();
        stream.bzalloc = nullptr;
        stream.bzfree = nullptr;
        stream.opaque = nullptr;
        stream.avail_in = data.size();
        stream.next_in = const_cast<char*>(data.data());
        if (BZ2_bzCompressInit(&stream, 9, 0, 0) != BZ_OK) {
            throw_line("Failed to initialize bzlib stream");
        }
        auto compressed_data = std::vector<char>{};
        std::vector<char> buffer(1024);
        int result;
        do {
            stream.avail_out = buffer.size();
            stream.next_out = buffer.data();
            result = BZ2_bzCompress(&stream, BZ_FINISH);
            if (result == BZ_SEQUENCE_ERROR || result == BZ_PARAM_ERROR || result == BZ_MEM_ERROR || result == BZ_DATA_ERROR) {
                throw_line("Failed to compress data");
            }
            size_t bytes_written = buffer.size() - stream.avail_out;
            compressed_data.insert(compressed_data.end(), buffer.begin(), buffer.begin() + bytes_written);
        } while (result != BZ_STREAM_END);
        BZ2_bzCompressEnd(&stream);
        return compressed_data;
    }

    inline auto uncompress_bzip2(
        const std::vector<char>& data
    ) -> std::vector<char> {
        auto stream = bz_stream();
        stream.bzalloc = nullptr;
        stream.bzfree = nullptr;
        stream.opaque = nullptr;
        stream.avail_in = data.size();
        stream.next_in = const_cast<char*>(data.data());
        if (BZ2_bzDecompressInit(&stream, 0, 0) != BZ_OK) {
            throw_line("Failed to initialize bzlib stream");
        }
        auto uncompressed_data = std::vector<char>{};
        std::vector<char> buffer(1024);
        int result;
        do {
            stream.avail_out = buffer.size();
            stream.next_out = buffer.data();
            result = BZ2_bzDecompress(&stream);
            if (result == BZ_SEQUENCE_ERROR || result == BZ_PARAM_ERROR || result == BZ_MEM_ERROR || result == BZ_DATA_ERROR) {
                throw_line("Failed to uncompress data");
            }
            size_t bytes_written = buffer.size() - stream.avail_out;
            uncompressed_data.insert(uncompressed_data.end(), buffer.begin(), buffer.begin() + bytes_written);
        } while (result != BZ_STREAM_END);
        BZ2_bzDecompressEnd(&stream);
        return uncompressed_data;
    }


}