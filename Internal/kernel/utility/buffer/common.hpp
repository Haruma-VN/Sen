#pragma once

#include <vector>
#include <cstdint>
#include <fstream>
#include <filesystem>
#include <cstring>

class Buffer {

    private:

        std::vector<std::uint8_t> data;

        std::size_t position;

    public:

        Buffer() : position(
            0
        ) {}

        ~Buffer(
        ) = default;

        Buffer
        (
            std::vector<std::uint8_t> data
        ) : position(
            0
        ) 
        {
            this->data = data;
        }

        Buffer(
            std::uint8_t* data,
            std::size_t size
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
                file.seekg(
                    0, std::ios::end
                );
                auto fileSize = file.tellg();
                file.seekg(
                    0, std::ios::beg
                );
                this->data.resize(fileSize);
                file.read(
                    reinterpret_cast<char*>(this->data.data()), fileSize
                );
                file.close();
            }
            else {
                throw std::runtime_error("Could not open file: " + filepath);
            }
            return;
        }

        inline auto get
        (

        ) -> std::vector<std::uint8_t>
        {
            return this->data;
        }

        inline auto writeUint8
        (
            std::uint8_t value
        ) -> void
        {
            this->writeLE<std::uint8_t>(value);
		    return;
	    }

        inline auto changePosition
        (
            std::size_t pos
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
            std::uint16_t value
        ) -> void
        {
            this->writeLE<std::uint16_t>(value);
            return;
        }

        inline auto writeUint32LE
        (
            std::uint32_t value
        ) -> void
        {
            this->writeLE<std::uint32_t>(value);
            return;
        }

        inline auto writeUint64LE
        (
            std::uint64_t value
        ) -> void
        {
            this->writeLE<std::uint64_t>(value);
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
            std::int8_t value
        ) -> void
        {
            this->writeLE<std::int8_t>(value);
            return;
        }

        inline auto writeInt16LE
        (
            std::int16_t value
        ) -> void
        {
            this->writeLE<std::int16_t>(value);
            return;
        }

        inline auto writeInt32LE
        (
            std::int32_t value
        ) -> void
        {
            this->writeLE<std::int32_t>(value);
            return;
        }

        inline auto writeInt64LE
        (
            std::int64_t value
        ) -> void
        {
            this->writeLE<std::int64_t>(value);
            return;
	    }

        inline auto writeUint16BE
        (
            std::uint16_t value
        ) -> void
        {
            this->writeBE<std::uint16_t>(value);
            return;
        }

        inline auto writeUint32BE
        (
            std::uint32_t value
        ) -> void
        {
            this->writeBE<std::uint32_t>(value);
            return;
        }

        inline auto writeUint64BE
        (
            std::uint32_t value
        ) -> void
        {
            this->writeBE<std::uint64_t>(value);
            return;
        }

        inline auto writeInt16BE
        (
            std::int16_t value
        ) -> void
        {
            this->writeBE<std::int16_t>(value);
            return;
        }

        inline auto writeInt32BE
        (
            std::int32_t value
        ) -> void
        {
            this->writeBE<std::int32_t>(value);
            return;
        }

        inline auto writeInt64BE
        (
            std::int64_t value
        ) -> void
        {
            this->writeBE<std::int64_t>(value);
            return;
        }

        inline auto size
        (

        ) -> std::size_t
        {
            return this->data.size();
        }

        inline auto toBytes
        (

        ) -> std::uint8_t*
        {
            return this->data.data();
        }

        inline auto readUint8
        (
    
        ) -> std::uint8_t 
        {
            return this->readLE<std::uint8_t>();
        }

        inline auto readUint16LE
        (
    
        ) -> std::uint16_t 
        {
            return this->readLE<std::uint16_t>();
        }

        inline auto readUint32LE
        (
    
        ) -> std::uint32_t 
        {
            return this->readLE<std::uint32_t>();
        }

        inline auto readUint64LE
        (
    
        ) -> std::uint64_t 
        {
            return this->readLE<std::uint64_t>();
        }

        inline auto readInt8
        (
    
        ) -> std::int8_t
        {
            return this->readLE<std::int8_t>();
        }

        inline auto readInt16LE
        (
    
        ) -> std::int16_t
        {
            return this->readLE<std::int16_t>();
        }

        inline auto readInt32LE
        (
    
        ) -> std::int32_t
        {
            return this->readLE<std::int32_t>();
        }

        inline auto readInt64LE
        (
    
        ) -> std::int64_t
        {
            return this->readLE<std::int64_t>();
        }

        inline auto readUint16BE
        (
    
        ) -> std::uint16_t
        {
            return this->readBE<std::uint16_t>();
        }

        inline auto readUint32BE
        (
    
        ) -> std::uint32_t 
        {
            return this->readBE<std::uint32_t>();
        }

        inline auto readUint64BE
        (
    
        ) -> std::uint64_t 
        {
            return this->readBE<std::uint64_t>();
        }

        inline auto readInt16BE
        (
    
        ) -> std::int16_t
        {
            return this->readBE<std::int16_t>();
        }

        inline auto readInt32BE
        (
    
        ) -> std::int32_t
        {
            return this->readBE<std::int32_t>();
        }

        inline auto readInt64BE
        (
    
        ) -> std::int64_t
        {
            return this->readBE<std::int64_t>();
        }

        inline auto readBoolean(

        ) -> bool
        {
            return this->readInt8() == 0x01;
        }

        inline auto readString
        (
            std::size_t size
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
            std::uint32_t value
        ) -> void 
        {
            this->writeLE_has<std::uint32_t>(value, 3);
            return;
        }

        inline auto writeInt24LE
        (
            std::int32_t value
        ) -> void 
        {
            this->writeLE_has<std::int32_t>(value, 3);
            return;
        }

        inline auto writeUint24BE
        (
            std::uint32_t value
        ) -> void 
        {
            this->writeBE_has<std::uint32_t>(value, 3);
            return;
        }

        inline auto writeInt24BE
        (
            std::int32_t value
        ) -> void 
        {
            this->writeBE_has<std::int32_t>(value, 3);
            return;
        }

        inline auto readUint24LE
        (
    
        ) -> std::uint32_t 
        {
            return this->readLE_has<std::uint32_t>(3);
        }

        inline auto readInt24LE
        (
    
        ) -> std::int32_t
        {
            return this->readLE_has<std::int32_t>(3);
        }

        inline auto readUint24BE
        (
    
        ) -> std::uint32_t 
        {
            return this->readBE_has<std::uint32_t>(3);
        }

        inline auto readInt24BE
        (
    
        ) -> std::int32_t
        {
            return this->readBE_has<std::int32_t>(3);
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
            this->writeBytesLE(
                reinterpret_cast<std::uint8_t*>(&value), 
                sizeof(float)
            );
            return;
        }

        inline auto writeDoubleLE
        (
            double value
        ) -> void 
        {
            this->writeBytesLE(
                reinterpret_cast<std::uint8_t*>(&value), 
                sizeof(double)
            );
            return;
        }

        inline auto writeFloatBE
        (
            float value
        ) -> void
        {
            this->writeBytesBE(
                reinterpret_cast<std::uint8_t*>(&value), 
                sizeof(float)
            );
            return;
        }

        inline auto writeDoubleBE
        (
            double value
        ) -> void 
        {
            this->writeBytesBE(
                reinterpret_cast<std::uint8_t*>(&value), 
                sizeof(double)
            );
            return;
        }

        inline auto readFloatLE
        (
        
        ) -> float 
        {
            return this->readBytesLE<float>(
                sizeof(float)
            );
        }

        inline auto readDoubleLE
        (
        
        ) -> double 
        {
            return this->readBytesLE<double>(
                sizeof(double)
            );
        }

        inline auto readFloatBE
        (
        
        ) -> float 
        {
            return this->readBytesBE<float>(
                sizeof(float)
            );
        }

        inline auto readDoubleBE
        (
        
        ) -> double 
        {
            return this->readBytesBE<double>(
                sizeof(double)
            );
        }

        inline auto writeChar
        (
            char value
        ) -> void 
        {
            this->data.push_back(
                static_cast<std::uint8_t>(value)
            );
            return;
        }

        inline auto readChar
        (
        
        ) -> char 
        {
            auto value = static_cast<char>(
                this->data[this->position]
                );
            this->position++;
            return value;
        }

        inline auto writeZigZag32
        (
            std::int32_t value
        ) -> void {
            auto zigzagEncoded = (std::uint32_t)((value << 1) ^ (value >> 31));
            this->writeUint32LE(zigzagEncoded);
            return;
        }

        inline auto readZigZag32
        (
        
        ) -> std::int32_t
        {
            auto zigzagEncoded = this->readUint32LE();
            auto decoded = (std::int32_t)((zigzagEncoded >> 1) ^ -(zigzagEncoded & 1));
            return decoded;
        }

        inline auto writeZigZag64
        (
            std::int64_t value
        ) -> void 
        {
            auto zigzagEncoded = (std::uint64_t)((value << 1) ^ (value >> 63));
            this->writeUint64LE(zigzagEncoded);
            return;
        }

        inline auto readZigZag64
        (
        
        ) -> std::int64_t
        {
            auto zigzagEncoded = (std::uint64_t)this->readInt64LE();
            auto decoded = (std::int64_t)((zigzagEncoded >> 1) ^ -(zigzagEncoded & 1));
            return decoded;
        }

        inline auto peekUInt8
        (
            std::size_t offset
        ) -> std::uint8_t 
        {
            return this->data[offset];
        }

        inline auto peekUInt16
        (
            std::size_t offset
        ) -> std::uint16_t 
        {
            return (this->data[offset] | (this->data[offset + 1] << 8));
        }

        inline auto peekUInt24
        (
            std::size_t offset
        ) -> std::uint32_t 
        {
            return (this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16));
        }

        inline auto peekUInt32
        (
            std::size_t offset
        ) -> std::uint32_t
        {
            return (this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16) | (this->data[offset + 3] << 24));
        }

        inline auto peekInt8
        (
            std::size_t offset
        ) -> std::int8_t
        {
            return static_cast<std::int8_t>(this->data[offset]);
        }

        inline auto peekInt16
        (
            std::size_t offset
        ) -> std::int16_t
        {
            return static_cast<std::int16_t>(this->data[offset] | (this->data[offset + 1] << 8));
        }

        inline auto peekInt24
        (
            std::size_t offset
        ) -> std::int32_t
        {
            return static_cast<std::int32_t>(this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16));
        }

        inline auto peekInt32
        (
            std::size_t offset
        ) -> std::int32_t
        {
            return static_cast<std::int32_t>(this->data[offset] | (this->data[offset + 1] << 8) | (this->data[offset + 2] << 16) | (this->data[offset + 3] << 24));
        }

        inline auto peekString(
            std::size_t offset,
            std::size_t size
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
            std::size_t offset
        ) -> char 
        {
            return static_cast<char>(this->data[offset]);
        }

        inline auto insertUInt8
        (
            std::size_t offset,
            std::uint8_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value);
            return;
        }

        inline auto insertUInt16
        (
            std::size_t offset,
            std::uint16_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            return;
        }

        inline auto insertUInt24
        (
            std::size_t offset,
            std::uint32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            return;
        }

        inline auto insertUInt32
        (
            std::size_t offset,
            std::uint32_t value
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
            std::size_t offset,
            std::int8_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, static_cast<std::uint8_t>(value));
            return;
        }

        inline auto insertInt16
        (
            std::size_t offset,
            std::int16_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            return;
        }

        inline auto insertInt24
        (
            std::size_t offset,
            std::int32_t value
        ) -> void 
        {
            this->data.insert(this->data.begin() + offset, value & 0xFF);
            this->data.insert(this->data.begin() + offset + 1, (value >> 8) & 0xFF);
            this->data.insert(this->data.begin() + offset + 2, (value >> 16) & 0xFF);
            return;
        }

        inline auto insertInt32
        (
            std::size_t offset,
            std::int32_t value
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
            std::size_t offset,
            const std::string& str
        ) -> void 
        {
            this->data.insert(
                this->data.begin() + offset, 
                str.begin(),
                str.end()
            );
            return;
        }

        inline auto insertChar
        (
            std::size_t offset,
            char c
        ) -> void 
        {
            this->data.insert(
                this->data.begin() + offset, 
                static_cast<std::uint8_t>(c)
            );
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
            std::size_t size = sizeof(T)
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
            std::size_t size = sizeof(T)
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
            std::size_t size = sizeof(T)
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
            std::size_t size = sizeof(T)
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
            std::uint8_t* bytes, 
            std::size_t size
        ) -> void 
        {
            for (auto i = 0; i < size; i++) {
                this->data.push_back(bytes[i]);
            }
            return;
        }

        inline auto writeBytesBE
        (
            std::uint8_t* bytes,
            std::size_t size
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
            std::size_t size
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
            std::size_t size
        ) -> T {
            auto value = T{};
            for (auto i = 0; i < size; i++) {
                reinterpret_cast<std::uint8_t*>(&value)[size - 1 - i] = this->data[position + i];
            }
            position += size;
            return value;
        }
};
