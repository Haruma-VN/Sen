#pragma once

#include <iostream>
#include <string>
#include <vector>
#include "../../dependencies/lzma/LzmaLib.h"
#include "../../kernel/utility/exception/common.hpp"

namespace Sen::Internal::Kernel::Tool::Compress::lzma 
{
    using ByteVector = std::vector<byte>;

    inline auto cast(
        const ByteVector& vecByte, 
        std::string& res
    ) -> bool
    {
        std::string strTmp(&vecByte[0], &vecByte[0] + vecByte.size());
        res = strTmp;
        return true;
    }

    inline auto cast(
        const std::string& strVal, 
        ByteVector& vecByte
    ) -> bool
    {
        vecByte = std::vector<BYTE>(&strVal[0], &strVal[0] + strVal.length());
        return true;
    }

    inline auto compress_lzma(
        _In_ const ByteVector& vecIn, 
        _Out_ ByteVector& vecOut
    ) -> void {
        auto propsSize = (size_t)LZMA_PROPS_SIZE;
        auto destLen = vecIn.size() + vecIn.size() / 3 + 128;
        vecOut.resize(propsSize + destLen);
        int res = LzmaCompress(
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
        _In_ const ByteVector& vecIn,
        _Out_ ByteVector& vecOut
    ) -> void {
        auto iLZMA_PROPS_SIZE = LZMA_PROPS_SIZE;
        vecOut.resize(vecIn.size() * 10);
        size_t dstLen = vecOut.size();
        size_t srcLen = vecIn.size() - iLZMA_PROPS_SIZE;
        SRes res = LzmaUncompress(
            &vecOut[0], &dstLen,
            &vecIn[iLZMA_PROPS_SIZE], &srcLen,
            &vecIn[0], iLZMA_PROPS_SIZE);
        vecOut.resize(dstLen);
        return;
    }

}

