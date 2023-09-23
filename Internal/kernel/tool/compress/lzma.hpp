#pragma once

#include <iostream>
#include <string>
#include <vector>
#include "../../dependencies/lzma/LzmaLib.h"
#include "../../kernel/utility/exception/common.hpp"

namespace Sen::Internal::Kernel::Tool::Compress::lzma 
{
    using ByteVector = std::vector<std::uint8_t>;

    inline auto cast(
        const ByteVector& vecByte, 
        std::string& res
    ) -> bool
    {
        auto strTmp = std::string(&vecByte[0], &vecByte[0] + vecByte.size());
        res = strTmp;
        return true;
    }

    inline auto compress_lzma(
        const ByteVector& vecIn, 
        ByteVector& vecOut
    ) -> void {
        auto propsSize = (size_t)LZMA_PROPS_SIZE;
        auto destLen = vecIn.size() + vecIn.size() / 3 + 128;
        vecOut.resize(propsSize + destLen);
        auto res = LzmaCompress(
            &vecOut[LZMA_PROPS_SIZE], &destLen,
            &vecIn[0], vecIn.size(),
            &vecOut[0], &propsSize,
            -1, 0, -1, -1, -1, -1, -1);
        assert(propsSize == LZMA_PROPS_SIZE);
        assert(res == SZ_OK);
        vecOut.resize(propsSize + destLen);
        return;
    }

    inline auto uncompress_lzma(
        const ByteVector& vecIn,
        ByteVector& vecOut
    ) -> void {
        auto iLZMA_PROPS_SIZE = LZMA_PROPS_SIZE;
        vecOut.resize(vecIn.size() * 10);
        auto dstLen = vecOut.size();
        auto srcLen = vecIn.size() - iLZMA_PROPS_SIZE;
        auto res = LzmaUncompress(
            &vecOut[0], &dstLen,
            &vecIn[iLZMA_PROPS_SIZE], &srcLen,
            &vecIn[0], iLZMA_PROPS_SIZE);
        vecOut.resize(dstLen);
        return;
    }

}

