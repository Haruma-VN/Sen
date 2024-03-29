#pragma once

#include <vector>
#include <string>
#include "../../dependencies/open_vcdiff/google/vcdecoder.h"
#include "../../dependencies/open_vcdiff/google/vcencoder.h"
#include "../../dependencies/open_vcdiff/google/output_string.h"
#include "../../kernel/utility/utility.hpp"

namespace Sen::Internal::Kernel::Tool::Diff::VCDiff 
{

     inline auto encode(
        const std::vector<char>& dictionary,
        const std::vector<char>& target
     ) -> std::vector<char>
     {
         auto encoding = std::string{};
        auto encoder = open_vcdiff::VCDiffEncoder(dictionary.data(), dictionary.size());
        encoder.SetFormatFlags(open_vcdiff::VCD_FORMAT_INTERLEAVED);
        if (!encoder.Encode(target.data(), target.size(), &encoding)) {
            throw_exception("VCDiff Encode failed");
        }
        return std::vector<char>(encoding.begin(), encoding.end());
     }

     inline auto decode(
         const std::vector<char>& dictionary,
         const std::vector<char>& delta
     ) -> std::vector<char>
     {
         auto target = std::string{};
         auto decoder = open_vcdiff::VCDiffStreamingDecoder();
         decoder.StartDecoding(dictionary.data(), dictionary.size());
         if (!decoder.DecodeChunk(delta.data(), delta.size(), &target)) {
             throw_exception("VCDiff Decode failed");
         }
         return std::vector<char>(target.data(), target.data() + target.size());
     }

}