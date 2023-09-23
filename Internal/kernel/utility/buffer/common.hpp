#pragma once

#include <vector>
#include <cstdint>
#include <fstream>
#include <filesystem>
#include <cstring>

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
            std::vector<uint8_t> data
        ) : position(
            0
        ) 
        {
            this->data = data;
        }

        Buffer(
            uint8_t* data,
            size_t size
        ) : position(
            0
        ) {
            for (auto i = 0; i < size; ++i) {
                this->data.push_back(data[i]);
            }
        }

        Buffer
        (
            const std::string& filepath
        ) : position(0) 
        {
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

        inline auto get(

        ) -> std::vector<uint8_t>
        {
            return this->data;
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

        inline auto outFile
        (
            const std::string& path
        ) -> void
        {
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

        ) -> size_t 
        {
            return this->data.size();
        }

        inline auto toBytes
        (

        ) -> uint8_t*
        {
            return this->data.data();
        }

        inline auto readUint8
        (
    
        ) -> uint8_t 
        {
            return this->readLE<uint8_t>();
        }

        inline auto readUint16LE
        (
    
        ) -> uint16_t 
        {
            return this->readLE<uint16_t>();
        }

        inline auto readUint32LE
        (
    
        ) -> uint32_t 
        {
            return this->readLE<uint32_t>();
        }

        inline auto readUint64LE
        (
    
        ) -> uint64_t 
        {
            return this->readLE<uint64_t>();
        }

        inline auto readInt8
        (
    
        ) -> int8_t 
        {
            return this->readLE<int8_t>();
        }

        inline auto readInt16LE
        (
    
        ) -> int16_t 
        {
            return this->readLE<int16_t>();
        }

        inline auto readInt32LE
        (
    
        ) -> int32_t 
        {
            return this->readLE<int32_t>();
        }

        inline auto readInt64LE
        (
    
        ) -> int64_t 
        {
            return this->readLE<int64_t>();
        }

        inline auto readUint16BE
        (
    
        ) -> uint16_t
        {
            return this->readBE<uint16_t>();
        }

        inline auto readUint32BE
        (
    
        ) -> uint32_t 
        {
            return this->readBE<uint32_t>();
        }

        inline auto readUint64BE
        (
    
        ) -> uint64_t 
        {
            return this->readBE<uint64_t>();
        }

        inline auto readInt16BE
        (
    
        ) -> int16_t 
        {
            return this->readBE<int16_t>();
        }

        inline auto readInt32BE
        (
    
        ) -> int32_t 
        {
            return this->readBE<int32_t>();
        }

        inline auto readInt64BE
        (
    
        ) -> int64_t 
        {
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
        ) -> void 
        {
            this->writeLE_has<uint32_t>(value, 3);
            return;
        }

        inline auto writeInt24LE
        (
            int32_t value
        ) -> void 
        {
            this->writeLE_has<int32_t>(value, 3);
            return;
        }

        inline auto writeUint24BE
        (
            uint32_t value
        ) -> void 
        {
            this->writeBE_has<uint32_t>(value, 3);
            return;
        }

        inline auto writeInt24BE
        (
            int32_t value
        ) -> void 
        {
            this->writeBE_has<int32_t>(value, 3);
            return;
        }

        inline auto readUint24LE
        (
    
        ) -> uint32_t 
        {
            return this->readLE_has<uint32_t>(3);
        }

        inline auto readInt24LE
        (
    
        ) -> int32_t
        {
            return this->readLE_has<int32_t>(3);
        }

        inline auto readUint24BE
        (
    
        ) -> uint32_t 
        {
            return this->readBE_has<uint32_t>(3);
        }

        inline auto readInt24BE
        (
    
        ) -> int32_t 
        {
            return this->readBE_has<int32_t>(3);
        }

        inline auto flush
        (
    
        ) -> void 
        {
            this->position = 0;
            return;
        }

        inline auto close
        (
    
        ) -> void 
        {
            this->data.clear();
            this->position = 0;
            return;
        }

        inline auto writeFloatLE
        (
            float value
        ) -> void 
        {
            this->writeBytesLE(reinterpret_cast<uint8_t*>(&value), sizeof(float));
            return;
        }

        inline auto writeDoubleLE
        (
            double value
        ) -> void 
        {
            this->writeBytesLE(reinterpret_cast<uint8_t*>(&value), sizeof(double));
            return;
        }

        inline auto writeFloatBE
        (
            float value
        ) -> void
        {
            this->writeBytesBE(reinterpret_cast<uint8_t*>(&value), sizeof(float));
            return;
        }

        inline auto writeDoubleBE
        (
            double value
        ) -> void 
        {
            this->writeBytesBE(reinterpret_cast<uint8_t*>(&value), sizeof(double));
            return;
        }

        inline auto readFloatLE
        (
        
        ) -> float 
        {
            return this->readBytesLE<float>(sizeof(float));
        }

        inline auto readDoubleLE
        (
        
        ) -> double 
        {
            return this->readBytesLE<double>(sizeof(double));
        }

        inline auto readFloatBE
        (
        
        ) -> float 
        {
            return this->readBytesBE<float>(sizeof(float));
        }

        inline auto readDoubleBE
        (
        
        ) -> double 
        {
            return this->readBytesBE<double>(sizeof(double));
        }

        inline auto writeChar
        (
            char value
        ) -> void 
        {
            this->data.push_back(static_cast<uint8_t>(value));
            return;
        }

        inline auto readChar
        (
        
        ) -> char 
        {
            auto value = static_cast<char>(this->data[this->position]);
            this->position += 1;
            return value;
        }

        inline auto writeZigZag32
        (
            int32_t value
        ) -> void {
            auto zigzagEncoded = (uint32_t)((value << 1) ^ (value >> 31));
            this->writeUint32LE(zigzagEncoded);
            return;
        }

        inline auto readZigZag32
        (
        
        ) -> int32_t 
        {
            auto zigzagEncoded = this->readUint32LE();
            auto decoded = (int32_t)((zigzagEncoded >> 1) ^ -(zigzagEncoded & 1));
            return decoded;
        }

        inline auto writeZigZag64
        (
            int64_t value
        ) -> void 
        {
            auto zigzagEncoded = (uint64_t)((value << 1) ^ (value >> 63));
            this->writeUint64LE(zigzagEncoded);
            return;
        }

        inline auto readZigZag64
        (
        
        ) -> int64_t 
        {
            auto zigzagEncoded = (uint64_t)this->readInt64LE();
            auto decoded = (int64_t)((zigzagEncoded >> 1) ^ -(zigzagEncoded & 1));
            return decoded;
        }

        inline auto peekUInt8
        (
            size_t offset
        ) -> uint8_t 
        {
            return this->data[offset];
        }

        inline auto peekUInt16
        (
            size_t offset
        ) -> uint16_t 
        {
            return (this->data[offset] | (this->data[offset + 1] << 8));
        }

        inline auto peekUInt24
        (
            size_t offset
        ) -> uint32_t 
        {
            return (this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16));
        }

        inline auto peekUInt32
        (
            size_t offset
        ) -> uint32_t
        {
            return (this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16) | (this->data[offset + 3] << 24));
        }

        inline auto peekInt8
        (
            size_t offset
        ) -> int8_t 
        {
            return static_cast<int8_t>(this->data[offset]);
        }

        inline auto peekInt16
        (
            size_t offset
        ) -> int16_t 
        {
            return static_cast<int16_t>(this->data[offset] | (this->data[offset + 1] << 8));
        }

        inline auto peekInt24
        (
            size_t offset
        ) -> int32_t 
        {
            return static_cast<int32_t>(this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16));
        }

        inline auto peekInt32
        (
            size_t offset
        ) -> int32_t 
        {
            return static_cast<int32_t>(this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16) | (this->data[offset + 3] << 24));
        }

        inline auto peekString(
            size_t offset, 
            size_t size
        ) -> std::string 
        {
            auto str = std::string{};
            str.reserve(size);
            for (auto i = offset; i < offset + size; ++i) {
                str.push_back(static_cast<char>(this->data[i]));
            }
            return str;
        }

        inline auto peekChar
        (
            size_t offset
        ) -> char 
        {
            return static_cast<char>(this->data[offset]);
        }

        inline auto insertUInt8
        (
            size_t offset, 
            uint8_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value);
            return;
        }

        inline auto insertUInt16
        (
            size_t offset, 
            uint16_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            return;
        }

        inline auto insertUInt24
        (
            size_t offset, 
            uint32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            return;
        }

        inline auto insertUInt32
        (
            size_t offset, 
            uint32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            this->data.insert(this->data.begin() + offset + 3, (value >> 24) & 0xFF);
            return;
        }

        inline auto insertInt8
        (
            size_t offset, 
            int8_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, static_cast<uint8_t>(value));
            return;
        }

        inline auto insertInt16
        (
            size_t offset, 
            int16_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            return;
        }

        inline auto insertInt24
        (
            size_t offset, 
            int32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            return;
        }

        inline auto insertInt32
        (
            size_t offset, 
            int32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            this->data.insert(this->data.begin() + offset + 3, (value >> 24) & 0xFF);
            return;
        }

        inline auto insertString
        (
            size_t offset, 
            const std::string& str
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, str.begin(), str.end());
            return;
        }

        inline auto insertChar
        (
            size_t offset, 
            char c
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, static_cast<uint8_t>(c));
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
                this->data.push_back((value >> (i * 8)) & 0xFF);
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
                this->data.push_back((value >> ((size - 1 - i) * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        inline auto readLE
        (
        
        ) -> T 
        {
            T value = 0;
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                value |= (this->data[position++] << (i * 8));
            }
            return value;
        }

        template<typename T>
        inline auto readBE
        (
        
        ) -> T 
        {
            T value = 0;
            auto size = sizeof(T);
            for (auto i = 0; i < size; i++) {
                value |= (this->data[position++] << ((size - 1 - i) * 8));
            }
            return value;
        }

        template<typename T>
        inline auto writeLE_has
        (
            T value, 
            size_t size = sizeof(T)
        ) -> void 
        {
            for (auto i = 0; i < size; i++) {
                this->data.push_back((value >> (i * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        inline auto writeBE_has
        (
            T value, 
            size_t size = sizeof(T)
        ) -> void 
        {
            for (auto i = 0; i < size; i++) {
                this->data.push_back((value >> ((size - 1 - i) * 8)) & 0xFF);
            }
            return;
        }

        template<typename T>
        inline auto readLE_has
        (
            size_t size = sizeof(T)
        ) -> T 
        {
            T value = 0;
            for (auto i = 0; i < size; i++) {
                value |= ((T)this->data[position + i] << (i * 8));
            }
            position += size;
            return value;
        }

        template<typename T>
        inline auto readBE_has
        (
            size_t size = sizeof(T)
        ) -> T 
        {
            T value = 0;
            for (auto i = 0; i < size; i++) {
                value |= ((T)this->data[position + i] << ((size - 1 - i) * 8));
            }
            position += size;
            return value;
        }

        inline auto writeBytesLE
        (
            uint8_t* bytes, 
            size_t size
        ) -> void 
        {
            for (auto i = 0; i < size; i++) {
                this->data.push_back(bytes[i]);
            }
            return;
        }

        inline auto writeBytesBE
        (
            uint8_t* bytes,
            size_t size
        ) -> void 
        {
            for (auto i = 0; i < size; i++) {
                this->data.push_back(bytes[size - 1 - i]);
            }
            return;
        }

        template<typename T>
        inline auto readBytesLE
        (
            size_t size
        ) -> T 
        {
            auto value = T{};
            std::memcpy(&value, &this->data[position], size);
            position += size;
            return value;
        }

        template<typename T>
        inline auto readBytesBE
        (
            size_t size
        ) -> T {
            auto value = T{};
            for (auto i = 0; i < size; i++) {
                reinterpret_cast<uint8_t*>(&value)[size - 1 - i] = this->data[position + i];
            }
            position += size;
            return value;
        }
};
