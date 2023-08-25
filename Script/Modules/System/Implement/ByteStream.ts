namespace Sen.Script.Modules {
    /**
     * Structure
     */

    export type DotNetBuffer = Sen.Shell.SenBuffer;

    /**
     * Structure
     */

    export type ByteListStream = ByteStream;

    /**
     * Constructor
     */

    export interface Constructor {
        data?: string | bigint | Array<bigint> | Uint8Array;
        use_little_endian?: boolean;
    }

    /**
     * Byte Stream for View Buffer
     */

    export class ByteStream {
        /**
         * Sen Buffer
         * Only use with Script
         */

        private m_data: DotNetBuffer;

        /**
         * Little Endian use
         */

        private use_little_endian: boolean;

        /**
         *
         * @param wrapper - Provide Wrapper
         * @returns
         */

        public constructor(wrapper?: Sen.Script.Modules.Constructor) {
            // JavaScript does not support overload so it must be this
            if (wrapper) {
                if (wrapper.data instanceof Uint8Array) {
                    this.m_data = new Sen.Shell.SenBuffer(Array.from(wrapper.data as Uint8Array as any));
                } else if (typeof wrapper.data === "bigint" || typeof wrapper.data === "string" || Array.isArray(wrapper.data)) {
                    this.m_data = new Sen.Shell.SenBuffer(wrapper.data);
                } else {
                    this.m_data = new Sen.Shell.SenBuffer();
                }
                this.use_little_endian = wrapper.use_little_endian ?? true;
            } else {
                this.m_data = new Sen.Shell.SenBuffer();
                this.use_little_endian = true;
            }
            return;
        }

        /**
         * Size
         * @returns Current Array Size
         */

        public size(): bigint {
            return BigInt(this.m_data.size());
        }

        /**
         * Current Array Length
         */

        get length(): number {
            return Number(this.m_data.size());
        }

        // Constructor end

        // Read Begin

        /**
         * @param offset - Offset to read
         * @returns Read U8 & move pos
         */

        public readU8(offset?: bigint): bigint {
            // Offset should be checked if it's null
            if (offset) {
                return BigInt(this.m_data.readUInt8(offset));
            }
            return BigInt(this.m_data.readUInt8());
        }

        /**
         * @param offset - Offset to read
         * @returns Read I8 & Move pos
         */

        public readI8(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readUInt8(offset));
            }
            return BigInt(this.m_data.readUInt8());
        }

        /**
         *
         * @returns Current Offset read Data View
         */

        public current(): bigint {
            return BigInt(this.m_data.current());
        }

        /**
         * Return the current position
         */

        public get position(): number {
            return Number(this.current());
        }

        /**
         * @param offset - Offset to read
         * @returns Read U16 & Move pos
         */

        public readU16(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readUInt16LE(offset)) : BigInt(this.m_data.readUInt16BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readUInt16LE()) : BigInt(this.m_data.readUInt16BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read I16 & Move pos
         */

        public readI16(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readInt16LE(offset)) : BigInt(this.m_data.readInt16BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readInt16LE()) : BigInt(this.m_data.readInt16BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read U24 & Move pos
         */

        public readU24(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readUInt24LE(offset)) : BigInt(this.m_data.readUInt24BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readUInt24LE()) : BigInt(this.m_data.readUInt24BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read I24 & Move pos
         */

        public readI24(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readInt24LE(offset)) : BigInt(this.m_data.readInt24BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readInt24LE()) : BigInt(this.m_data.readInt24BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read U32 & Move pos
         */

        public readU32(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readUInt32LE(offset)) : BigInt(this.m_data.readUInt32BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readUInt32LE()) : BigInt(this.m_data.readUInt32BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read I32 & Move pos
         */

        public readI32(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readInt32LE(offset)) : BigInt(this.m_data.readInt32BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readInt32LE()) : BigInt(this.m_data.readInt32BE());
        }
        /**
         * @param offset - Offset to read
         * @returns Read U64 & Move pos
         */

        public readU64(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readBigUInt64LE(offset)) : BigInt(this.m_data.readBigUInt64BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readBigUInt64LE()) : BigInt(this.m_data.readBigUInt64BE());
        }

        /**
         * @param offset - Offset to read
         * @returns Read I64 & Move pos
         */

        public readI64(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? BigInt(this.m_data.readBigInt64LE(offset)) : BigInt(this.m_data.readBigInt64BE(offset));
            }
            return this.use_little_endian ? BigInt(this.m_data.readBigInt64LE()) : BigInt(this.m_data.readBigInt64BE());
        }

        /**
         *
         * @param offset - Offset to read
         * @returns Boolean
         */

        public readBool(offset?: bigint): boolean {
            if (offset) {
                return Boolean(this.m_data.readBool(offset));
            }
            return Boolean(this.m_data.readUInt8());
        }

        /**
         * ?????
         * ?????
         * @param offset - Offset to read
         * @returns Read VarU32 & Move pos
         */

        public readVarU32(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readVarUInt32(offset));
            }
            return BigInt(this.m_data.readVarUInt32());
        }

        /**
         * @param offset - Offset to read
         * @returns Read VarI32 & Move pos
         */

        public readVarI32(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readVarInt32(offset));
            }
            return BigInt(this.m_data.readVarInt32());
        }
        /**
         * @param offset - Offset to read
         * @returns Read VarU64 & Move pos
         */

        public readVarU64(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readVarUInt64(offset));
            }
            return BigInt(this.m_data.readVarUInt64());
        }

        /**
         * @param offset - Offset to read
         * @returns Read VarI64 & Move pos
         */

        public readVarI64(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readVarInt64(offset));
            }
            return BigInt(this.m_data.readVarInt64());
        }

        /**
         *
         * @param count - How much byte to read
         * @param offset - from
         * @param encodingType - Encoding Type
         * @returns String
         */

        public readString(count: bigint, offset?: bigint, encodingType?: string): string {
            if (offset) {
                if (encodingType) {
                    return this.m_data.readString(count, offset, encodingType);
                }
                return this.m_data.readString(count, offset);
            }
            return this.m_data.readString(count);
        }

        /**
         * Give char
         * @param offset - Offset to read
         * @returns Read char and move 1 pos
         */

        public readChar(offset?: bigint): string {
            if (offset) {
                return String.fromCharCode(Number(this.readU8(offset)));
            }
            return String.fromCharCode(Number(this.readU8()));
        }
        /**
         * @param offset - Offset to read
         * @returns Read Zig Zag & Move pos
         */

        public readZ32(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readZigZag32(offset));
            }
            return BigInt(this.m_data.readZigZag32());
        }

        /**
         * @param offset - Offset to read
         * @returns Read Zig Zag & Move pos
         */

        public readZ64(offset?: bigint): bigint {
            if (offset) {
                return BigInt(this.m_data.readZigZag64(offset));
            }
            return BigInt(this.m_data.readZigZag64());
        }

        /**
         *
         * @param offset - Provide offset
         * @returns float num & move pos
         */

        public readF32(offset?: bigint): number {
            if (offset) {
                return this.use_little_endian ? this.m_data.readFloatLE(offset) : this.m_data.readFloatBE(offset);
            }
            return this.use_little_endian ? this.m_data.readFloatLE() : this.m_data.readFloatBE();
        }
        /**
         *
         * @param offset - Provide offset
         * @returns double num & move pos
         */

        public readF64(offset?: bigint): number {
            if (offset) {
                return this.use_little_endian ? this.m_data.readDoubleLE(offset) : this.m_data.readDoubleBE(offset);
            }
            return this.use_little_endian ? this.m_data.readDoubleLE() : this.m_data.readDoubleBE();
        }

        /**
         *
         * @param out_path - Out file
         * @returns
         */

        public out_fs(out_path: string): void {
            return this.m_data.OutFile(out_path);
        }

        /**
         *
         * @param offset Offset
         * @returns ???
         */

        public readStringByEmpty(offset?: bigint): string {
            if (offset) {
                return this.m_data.readStringByEmpty(offset);
            }
            return this.m_data.readStringByEmpty();
        }

        /**
         *
         * @param offset Offset
         * @returns ???
         */

        public getStringByEmpty(offset?: bigint): string {
            if (offset) {
                return this.m_data.getStringByEmpty(offset);
            }
            return this.m_data.getStringByEmpty();
        }

        // Read End

        // Write Begin

        /**
         *
         * @param array - Array to write
         * @param offset - Pass offset
         * @returns
         */

        public writeBytes(array: Array<bigint> | Uint8Array, offset?: bigint): void {
            if (array instanceof Uint8Array) {
                if (offset) {
                    this.m_data.writeBytes(Array.from(array as unknown & any & Array<number>), offset);
                    return;
                }
                this.m_data.writeBytes(Array.from(array as unknown & any & Array<number>));
                return;
            } else {
                if (offset) {
                    this.m_data.writeBytes(array, offset);
                    return;
                }
                this.m_data.writeBytes(array);
                return;
            }
        }

        /**
         *
         * @param str - String to write
         * @param offset - Offset to write
         * @param encodingType - Encoding Type
         * @returns
         */

        public writeString(str: string, offset?: bigint, encodingType?: string): void {
            if (offset) {
                if (encodingType) {
                    this.m_data.writeString(str, offset, encodingType);
                    return;
                }
                this.m_data.writeString(str, offset);
                return;
            }
            this.m_data.writeString(str);
            return;
        }

        /**
         *
         * @param str - String to write
         * @param offset - Offset to write
         * @returns
         */

        public writeStringByEmpty(str: string, offset?: bigint): void {
            if (offset) {
                this.m_data.writeStringByEmpty(str, offset);
                return;
            }
            this.m_data.writeStringByEmpty(str);
            return;
        }

        /**
         *
         * @param count - How much byte to write
         * @param offset - Offset
         * @returns
         */

        public writeNull(count: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeNull(count, offset);
                return;
            }
            this.m_data.writeNull(count);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeU8(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeUInt8(num, offset);
                return;
            }
            this.m_data.writeUInt8(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeI8(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeInt8(num, offset);
                return;
            }
            this.m_data.writeInt8(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeU16(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeUInt16LE(num, offset);
                    return;
                }
                this.m_data.writeUInt16BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeUInt16LE(num);
                return;
            }
            this.m_data.writeUInt16BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeI16(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeInt16LE(num, offset);
                    return;
                }
                this.m_data.writeInt16BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeInt16LE(num);
                return;
            }
            this.m_data.writeInt16BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeU24(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeUInt24LE(num, offset);
                    return;
                }
                this.m_data.writeUInt24BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeUInt24LE(num);
                return;
            }
            this.m_data.writeUInt24BE(num);
            return;
        }
        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeI24(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeInt24LE(num, offset);
                    return;
                }
                this.m_data.writeInt24BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeInt24LE(num);
                return;
            }
            this.m_data.writeInt24BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeU32(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeUInt32LE(num, offset);
                    return;
                }
                this.m_data.writeUInt32BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeUInt32LE(num);
                return;
            }
            this.m_data.writeUInt32BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeI32(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeInt32LE(num, offset);
                    return;
                }
                this.m_data.writeInt32BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeInt32LE(num);
                return;
            }
            this.m_data.writeInt32BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeU64(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeBigUInt64LE(num, offset);
                    return;
                }
                this.m_data.writeBigUInt64BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeBigUInt64LE(num);
                return;
            }
            this.m_data.writeBigUInt64BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeI64(num: bigint, offset?: bigint): void {
            if (offset) {
                if (this.use_little_endian) {
                    this.m_data.writeBigInt64LE(num, offset);
                    return;
                }
                this.m_data.writeBigInt64BE(num, offset);
                return;
            }
            if (this.use_little_endian) {
                this.m_data.writeBigInt64LE(num);
                return;
            }
            this.m_data.writeBigInt64BE(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeVarU32(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeUVarInt32(num, offset);
                return;
            }
            this.m_data.writeUVarInt32(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeVarI32(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeVarInt32(num, offset);
                return;
            }
            this.m_data.writeVarInt32(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeVarU64(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeUVarInt64(num, offset);
                return;
            }
            this.m_data.writeUVarInt64(num);
            return;
        }

        /**
         *
         * @param num - Num to write
         * @param offset - Offset
         * @returns
         */

        public writeVarI64(num: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeVarInt64(num, offset);
                return;
            }
            this.m_data.writeVarInt64(num);
            return;
        }

        /**
         *
         * Boolean
         *
         * @param val - Value to write
         * @param offset - Offset
         * @returns
         */

        public writeBool(val: boolean, offset?: bigint): void {
            if (offset) {
                this.m_data.writeBool(val, offset);
                return;
            }
            this.m_data.writeBool(val);
            return;
        }

        /**
         *
         * ZigZag32
         *
         * @param val - Value to write
         * @param offset - Offset
         * @returns
         */

        public writeZ32(val: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeZigZag32(val, offset);
                return;
            }
            this.m_data.writeZigZag32(val);
            return;
        }

        /**
         *
         * ZigZag64
         *
         * @param val - Value to write
         * @param offset - Offset
         * @returns
         */

        public writeZ64(val: bigint, offset?: bigint): void {
            if (offset) {
                this.m_data.writeZigZag64(val, offset);
                return;
            }
            this.m_data.writeZigZag64(val);
            return;
        }

        /**
         * Should work with current Jint
         * Cast to Byte[]
         * @returns
         */

        public toByte(): Array<bigint> {
            return this.m_data.toBytes();
        }

        /**
         * Convert Buffer to String
         * @param encodingType - Encoding type
         * @returns
         */

        public toString(encodingType?: string): string {
            if (encodingType) {
                return this.m_data.toString(encodingType);
            }
            return this.m_data.toString();
        }

        /**
         * Save File
         * @param outpath - Save path
         * @returns
         */

        public save_fs(outpath: string): void {
            return this.m_data.SaveFile(outpath);
        }

        /**
         *
         * Close current
         * @returns
         */

        public close(): void {
            return this.m_data.Close();
        }

        /**
         * Flush current
         * @returns
         */

        public flush(): void {
            return this.m_data.Flush();
        }

        // Peek Begin

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekI8(offset?: bigint): bigint {
            if (offset) {
                return this.m_data.peekInt8(offset);
            }
            return this.m_data.peekInt8();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekU8(offset?: bigint): bigint {
            if (offset) {
                return this.m_data.peekUInt8(offset);
            }
            return this.m_data.peekUInt8();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekI16(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekInt16LE(offset) : this.m_data.peekInt16BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekInt16LE() : this.m_data.peekInt16BE();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekU16(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekUInt16LE(offset) : this.m_data.peekUInt16BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekUInt16LE() : this.m_data.peekUInt16BE();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekI24(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekInt24LE(offset) : this.m_data.peekInt24BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekInt24LE() : this.m_data.peekInt24BE();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekU24(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekUInt24LE(offset) : this.m_data.peekUInt24BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekUInt24LE() : this.m_data.peekUInt24BE();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekI32(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekInt32LE(offset) : this.m_data.peekInt32BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekInt32LE() : this.m_data.peekInt32BE();
        }

        /**
         * Peek
         * @param offset - Pass Offset to Peek
         * @returns
         */

        public peekU32(offset?: bigint): bigint {
            if (offset) {
                return this.use_little_endian ? this.m_data.peekUInt32LE(offset) : this.m_data.peekUInt32BE(offset);
            }
            return this.use_little_endian ? this.m_data.peekUInt32LE() : this.m_data.peekUInt32BE();
        }

        /**
         * Peek
         * @param count - How much to Peek
         * @param offset - Offset
         * @param encodingType - Encoding type
         * @returns
         */

        public peekString(count: bigint, offset?: bigint, encodingType?: string): string {
            if (offset) {
                if (encodingType) {
                    return this.m_data.peekString(count, offset, encodingType);
                }
                return this.m_data.peekString(count, offset);
            }
            return this.m_data.peekString(count);
        }

        /**
         * [0x01n, 0x02n, 0x03n, 0x04n]
         * sen.slice(0n, 2n)
         * -> [0x01n, 0x02n]
         * @param begin - Begin
         * @param count - End
         * @returns
         */

        public slice(begin: bigint, count: bigint): void {
            this.m_data.slice(begin, count);
            return;
        }
    }
}
