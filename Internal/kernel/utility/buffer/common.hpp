#pragma once

#include <vector>
#include <cstdint>

class Buffer {

private:
    std::vector<uint8_t> data;
    size_t position;

public:
    Buffer() : position(0) {}

    constexpr ~Buffer(
    ) = default;

    constexpr auto writeUint8(
        uint8_t value
    ) -> void
    {
        writeLE<uint8_t>(value);
		return;
	}

    constexpr auto writeUint16LE(
        uint16_t value
    ) -> void
    {
        writeLE<uint16_t>(value);
        return;
    }

    constexpr auto writeUint32LE(
        uint32_t value
    ) -> void
    {
        writeLE<uint32_t>(value);
        return;
    }

    constexpr auto writeUint64LE(
        uint64_t value
    ) -> void
    {
        writeLE<uint64_t>(value);
        return;
    }

    constexpr auto writeInt8(
        int8_t value
    ) -> void
    {
        writeLE<int8_t>(value);
        return;
    }

    constexpr auto writeInt16LE(
        int16_t value
    ) -> void
    {
        writeLE<int16_t>(value);
        return;
    }

    constexpr auto writeInt32LE(
        int32_t value
    ) -> void
    {
        writeLE<int32_t>(value);
        return;
    }

    constexpr auto writeInt64LE(
        int64_t value
    ) -> void
    {
        writeLE<int64_t>(value);
        return;
	}

    constexpr auto writeUint16BE(
        uint16_t value
    ) -> void
    {
        writeBE<uint16_t>(value);
        return;
    }

    constexpr auto writeUint32BE(
        uint32_t value
    ) -> void
    {
        writeBE<uint32_t>(value);
        return;
    }

    constexpr auto writeUint64BE(
        uint32_t value
    ) -> void
    {
        writeBE<uint64_t>(value);
        return;
    }

    constexpr auto writeInt16BE(
        int16_t value
    ) -> void
    {
        writeBE<int16_t>(value);
        return;
    }

    constexpr auto writeInt32BE(
        int32_t value
    ) -> void
    {
        writeBE<int32_t>(value);
        return;
    }

    constexpr auto writeInt64BE(
        int64_t value
    ) -> void
    {
        writeBE<int64_t>(value);
        return;
    }

    constexpr auto size(

    ) const -> size_t 
    {
        return this->data.size();
    }

    uint8_t* toBytes(

    )  {
        return data.data();
    }

private:
		template<typename T>
		constexpr auto writeLE(
		    T value	
        ) -> void 
        {
			auto size = sizeof(T);
			for(auto i = 0; i < size; i++) {
				data.push_back((value >> (i * 8)) & 0xFF);
			}
			return;
		}

        template<typename T>
        constexpr auto writeBE(
            T value
        ) -> void
        {
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                data.push_back((value >> ((size - 1 - i) * 8)) & 0xFF);
            }
            return;
        }
};
