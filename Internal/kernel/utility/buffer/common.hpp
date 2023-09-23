#pragma once

#include <vector>
#include <cstdint>
#include <fstream>
#include <filesystem>

class Buffer {

private:
    std::vector<uint8_t> data;

    size_t position;

public:

    Buffer() : position(
        0
    ) {}

    inline ~Buffer(
    ) = default;

    Buffer
    (
        const std::string& filepath
    ) : position(0) {
        auto file = std::ifstream(
            filepath, std::ios::binary
        );
        if (file) {
            file.seekg(0, std::ios::end);
            auto fileSize = file.tellg();
            file.seekg(0, std::ios::beg);
            data.resize(fileSize);
            file.read(reinterpret_cast<char*>(data.data()), fileSize);
            file.close();
        }
        else {
            throw std::runtime_error("Could not open file: " + filepath);
        }
        return;
    }

    inline auto writeUint8
    (
        uint8_t value
    ) -> void
    {
        this->writeLE<uint8_t>(value);
		return;
	}

    inline auto changePosition
    (
        size_t pos
    ) -> void
    {
        if (pos >= 0 && pos <= data.size())
        {
            this->position = pos;
        }
        return;
    }

    inline auto writeUint16LE
    (
        uint16_t value
    ) -> void
    {
        this->writeLE<uint16_t>(value);
        return;
    }

    inline auto writeUint32LE
    (
        uint32_t value
    ) -> void
    {
        this->writeLE<uint32_t>(value);
        return;
    }

    inline auto writeUint64LE
    (
        uint64_t value
    ) -> void
    {
        this->writeLE<uint64_t>(value);
        return;
    }

    inline void outFile
    (
        const std::string& path
    ) {
        auto filePath = std::filesystem::path(path);
        if (filePath.has_parent_path()) {
            std::filesystem::create_directories(filePath.parent_path());
        }
        auto file = std::ofstream(path, std::ios::binary);
        if (file) {
            file.write(reinterpret_cast<const char*>(this->data.data()), this->size());
        }
        else {
            throw std::runtime_error("Could not open file: " + path);
        }
        return;
    }

    inline auto writeInt8
    (
        int8_t value
    ) -> void
    {
        this->writeLE<int8_t>(value);
        return;
    }

    inline auto writeInt16LE
    (
        int16_t value
    ) -> void
    {
        this->writeLE<int16_t>(value);
        return;
    }

    inline auto writeInt32LE
    (
        int32_t value
    ) -> void
    {
        this->writeLE<int32_t>(value);
        return;
    }

    inline auto writeInt64LE
    (
        int64_t value
    ) -> void
    {
        this->writeLE<int64_t>(value);
        return;
	}

    inline auto writeUint16BE
    (
        uint16_t value
    ) -> void
    {
        this->writeBE<uint16_t>(value);
        return;
    }

    inline auto writeUint32BE
    (
        uint32_t value
    ) -> void
    {
        this->writeBE<uint32_t>(value);
        return;
    }

    inline auto writeUint64BE
    (
        uint32_t value
    ) -> void
    {
        this->writeBE<uint64_t>(value);
        return;
    }

    inline auto writeInt16BE
    (
        int16_t value
    ) -> void
    {
        this->writeBE<int16_t>(value);
        return;
    }

    inline auto writeInt32BE
    (
        int32_t value
    ) -> void
    {
        this->writeBE<int32_t>(value);
        return;
    }

    inline auto writeInt64BE
    (
        int64_t value
    ) -> void
    {
        this->writeBE<int64_t>(value);
        return;
    }

    inline auto size
    (

    ) const -> size_t 
    {
        return this->data.size();
    }

    inline uint8_t* toBytes
    (

    )  {
        return this->data.data();
    }

    inline auto readUint8
    (
    
    ) -> uint8_t {
        return this->readLE<uint8_t>();
    }

    inline auto readUint16LE
    (
    
    ) -> uint16_t {
        return this->readLE<uint16_t>();
    }

    inline auto readUint32LE
    (
    
    ) -> uint32_t {
        return this->readLE<uint32_t>();
    }

    inline auto readUint64LE
    (
    
    ) -> uint64_t {
        return this->readLE<uint64_t>();
    }

    inline auto readInt8
    (
    
    ) -> int8_t {
        return this->readLE<int8_t>();
    }

    inline auto readInt16LE
    (
    
    ) -> int16_t {
        return this->readLE<int16_t>();
    }

    inline auto readInt32LE
    (
    
    ) -> int32_t {
        return this->readLE<int32_t>();
    }

    inline auto readInt64LE
    (
    
    ) -> int64_t {
        return this->readLE<int64_t>();
    }

    inline auto readUint16BE
    (
    
    ) -> uint16_t {
        return this->readBE<uint16_t>();
    }

    inline auto readUint32BE
    (
    
    ) -> uint32_t {
        return this->readBE<uint32_t>();
    }

    inline auto readUint64BE
    (
    
    ) -> uint64_t {
        return this->readBE<uint64_t>();
    }

    inline auto readInt16BE
    (
    
    ) -> int16_t {
        return this->readBE<int16_t>();
    }

    inline auto readInt32BE
    (
    
    ) -> int32_t {
        return this->readBE<int32_t>();
    }

    inline auto readInt64BE
    (
    
    ) -> int64_t {
        return this->readBE<int64_t>();
    }

    inline auto readBoolean(

    ) -> bool
    {
        return this->readInt8() == 0x01;
    }

    inline auto readString
    (
        size_t size
    ) -> std::string
    {
        std::string c = "";
        for (auto i = 0; i < size; ++i) {
            c += (char)this->readInt8();
        }
        return c;
    }

    inline auto writeString
    (
        std::string str
    ) -> void
    {
        for (auto& c : str) {
            this->writeInt8((int)c);
        }
        return;
    }

    inline auto writeBoolean
    (
        bool val
    ) -> void 
    {
        if (val) {
            this->writeUint8(0x01);
        }
        else {
            this->writeUint8(0x00);
        }
        return;
    }

    inline auto writeUint24LE
    (
        uint32_t value
    ) -> void {
        writeLE_has<uint32_t>(value, 3);
        return;
    }

    inline auto writeInt24LE
    (
        int32_t value
    ) -> void {
        writeLE_has<int32_t>(value, 3);
        return;
    }

    inline auto writeUint24BE
    (
        uint32_t value
    ) -> void {
        writeBE_has<uint32_t>(value, 3);
        return;
    }

    inline auto writeInt24BE
    (
        int32_t value
    ) -> void {
        writeBE_has<int32_t>(value, 3);
        return;
    }

    inline auto readUint24LE
    (
    
    ) -> uint32_t {
        return readLE_has<uint32_t>(3);
    }

    inline auto readInt24LE
    (
    
    ) -> int32_t {
        return readLE_has<int32_t>(3);
    }

    inline auto readUint24BE
    (
    
    ) -> uint32_t {
        return readBE_has<uint32_t>(3);
    }

    inline auto readInt24BE
    (
    
    ) -> int32_t {
        return readBE_has<int32_t>(3);
    }

    inline auto flush
    (
    
    ) -> void {
        this->position = 0;
        return;
    }

    constexpr auto close
    (
    
    ) -> void {
        this->data.clear();
        this->position = 0;
        return;
    }


private:
		template<typename T>
		inline auto writeLE
        (
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
        inline auto writeBE
        (
            T value
        ) -> void
        {
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                data.push_back((value >> ((size - 1 - i) * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        inline auto readLE
        (
        
        ) -> T {
            T value = 0;
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                value |= (data[position++] << (i * 8));
            }
            return value;
        }

        template<typename T>
        inline auto readBE
        (
        
        ) -> T {
            T value = 0;
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                value |= (data[position++] << ((size - 1 - i) * 8));
            }
            return value;
        }

        template<typename T>
        inline auto writeLE_has(
            T value, 
            size_t size = sizeof(T)
        ) -> void {
            for (auto i = 0; i < size; i++) {
                data.push_back((value >> (i * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        inline auto writeBE_has(
            T value, 
            size_t size = sizeof(T)
        ) -> void {
            for (auto i = 0; i < size; i++) {
                data.push_back((value >> ((size - 1 - i) * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        constexpr auto readLE_has(
            size_t size = sizeof(T)
        ) -> T {
            T value = 0;
            for (auto i = 0; i < size; i++) {
                value |= ((T)data[position + i] << (i * 8));
            }
            position += size;
            return value;
        }

        template<typename T>
        constexpr auto readBE_has(
            size_t size = sizeof(T)
        ) -> T {
            T value = 0;
            for (auto i = 0; i < size; i++) {
                value |= ((T)data[position + i] << ((size - 1 - i) * 8));
            }
            position += size;
            return value;
        }
};
