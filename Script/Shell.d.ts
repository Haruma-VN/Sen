declare namespace Sen {
    /**
     * @abstract Double
     */

    declare type double = number;

    /**
     * @abstract Data type for long number
     */

    declare type unsigned_long_long = number;

    /**
     * @abstract Data type for integer number
     */

    declare type int = number;

    /**
     * @abstract Data type for float number
     */

    declare type float = number;

    declare namespace Shell {
        /**
         * @param args - Arguments pass from DotNet will be send to Script
         * @implements Hold arguments and do process with arguments
         */

        declare const argument: Array<string>;

        /**
         * Buffer
         */

        export class SenBuffer {
            /**
             *
             * @param n - File path | Size | Array Buffer
             */

            constructor(n?: string | bigint | Array<bigint>): void;
            readUInt8(): bigint;
            readUInt8(offset: bigint): bigint;
            readUInt16LE(offset: bigint): bigint;
            readUInt16LE(): bigint;
            readUInt24LE(offset: bigint): bigint;
            readUInt24LE(): bigint;
            readUInt32LE(offset: bigint): bigint;
            readUInt32LE(): bigint;
            readBigUInt64LE(offset: bigint): bigint;
            readBigUInt64LE(): bigint;
            readUInt16BE(offset: bigint): bigint;
            readUInt16BE(): bigint;
            readUInt24BE(offset: bigint): bigint;
            readUInt24BE(): bigint;
            readUInt32BE(offset: bigint): bigint;
            readUInt32BE(): bigint;
            readBigUInt64BE(offset: bigint): bigint;
            readBigUInt64BE(): bigint;
            readVarUInt32(offset: bigint): bigint;
            readVarUInt32(): bigint;
            readVarUInt64(offset: bigint): bigint;
            readVarUInt64(): bigint;
            readInt8(): bigint;
            readInt8(offset: bigint): bigint;
            readInt16LE(): bigint;
            readInt16LE(offset: bigint): bigint;
            readInt24LE(): bigint;
            readInt24LE(offset: bigint): bigint;
            readInt32LE(): bigint;
            readInt32LE(offset: bigint): bigint;
            readBigInt64LE(): bigint;
            readBigInt64LE(offset: bigint): bigint;
            readBigInt64BE(): bigint;
            readBigInt64BE(offset: bigint): bigint;
            readString(count: bigint): string;
            readString(count: bigint, offset: bigint): string;
            readString(count: bigint, offset: bigint, encodingType: string): string;
            readBytes(count: bigint): Array<bigint>;
            readBytes(count: bigint, offset: bigint): Array<bigint>;
            readVarInt32(offset: bigint): bigint;
            readVarInt32(): bigint;
            readVarInt64(offset: bigint): bigint;
            readVarInt64(): bigint;
            readZigZag32(): bigint;
            readZigZag32(offset: bigint): bigint;
            readZigZag64(): bigint;
            readZigZag64(offset: bigint): bigint;
            readFloatLE(): float;
            readFloatLE(offset: bigint): float;
            readFloatBE(): float;
            readFloatBE(offset: bigint): float;
            readDoubleLE(): double;
            readDoubleLE(offset: bigint): double;
            readDoubleBE(): double;
            readDoubleBE(offset: bigint): double;
            readBool(): boolean;
            readBool(offset: bigint): boolean;
            readStringByEmpty(): string;
            readStringByEmpty(offset: bigint): string;
            getStringByEmpty(): string;
            getStringByEmpty(offset: bigint): string;
            readStringByInt16LE(): string;
            readStringByInt16LE(offset: bigint): string;
            readStringByVarInt32(): string;
            readStringByVarInt32(offset: bigint): string;
            writeBytes(array: Array<bigint>): void;
            writeBytes(array: Array<bigint>, offset: bigint): void;
            writeString(str: string): void;
            writeString(str: string, offset: bigint): void;
            writeString(str: string, offset: bigint, encodingType: string = "UTF-8"): void;
            writeStringByEmpty(str: string): void;
            writeStringByEmpty(str: string, offset: bigint): void;
            writeNull(count: bigint): void;
            writeNull(count: bigint, offset: bigint): void;
            writeStringFourByte(str: string): void;
            writeStringFourByte(str: string, offset: bigint): void;
            setBytes(array: Array<bigint>, offset: bigint, overwriteOffset: boolean): void;
            writeUInt8(num: bigint): void;
            writeUInt8(num: bigint, offset: bigint): void;
            writeUInt16LE(num: bigint): void;
            writeUInt16LE(num: bigint, offset: bigint): void;
            writeUInt16BE(num: bigint): void;
            writeUInt16BE(num: bigint, offset: bigint): void;
            writeUInt24LE(num: bigint): void;
            writeUInt24LE(num: bigint, offset: bigint): void;
            writeUInt24BE(num: bigint): void;
            writeUInt24BE(num: bigint, offset: bigint): void;
            writeUInt32LE(num: bigint): void;
            writeUInt32LE(num: bigint, offset: bigint): void;
            writeUInt32BE(num: bigint): void;
            writeUInt32BE(num: bigint, offset: bigint): void;
            writeBigUInt64LE(num: bigint): void;
            writeBigUInt64LE(num: bigint, offset: bigint): void;
            writeBigUInt64BE(num: bigint): void;
            writeBigUInt64BE(num: bigint, offset: bigint): void;
            writeFloatLE(num: float): void;
            writeFloatLE(num: float, offset: bigint): void;
            writeFloatBE(num: float): void;
            writeFloatBE(num: float, offset: bigint): void;
            writeDoubleLE(num: double): void;
            writeDoubleLE(num: double, offset: bigint): void;
            writeDoubleBE(num: double): void;
            writeDoubleBE(num: double, offset: bigint): void;
            writeUVarInt32(num: bigint): void;
            writeUVarInt32(num: bigint, offset: bigint): void;
            writeUVarInt64(num: bigint): void;
            writeUVarInt64(num: bigint, offset: bigint): void;
            writeInt8(num: bigint): void;
            writeInt8(num: bigint, offset: bigint): void;
            writeInt16LE(num: bigint): void;
            writeInt16LE(num: bigint, offset: bigint): void;
            writeInt16BE(num: bigint): void;
            writeInt16BE(num: bigint, offset: bigint): void;
            writeInt24LE(num: bigint): void;
            writeInt24LE(num: bigint, offset: bigint): void;
            writeInt24BE(num: bigint): void;
            writeInt24BE(num: bigint, offset: bigint): void;
            writeInt32LE(num: bigint): void;
            writeInt32LE(num: bigint, offset: bigint): void;
            writeInt32BE(num: bigint): void;
            writeInt32BE(num: bigint, offset: bigint): void;
            writeBigInt64LE(num: bigint): void;
            writeBigInt64LE(num: bigint, offset: bigint): void;
            writeBigInt64BE(num: bigint): void;
            writeBigInt64BE(num: bigint, offset: bigint): void;
            writeVarInt32(num: bigint): void;
            writeVarInt32(num: bigint, offset: bigint): void;
            writeVarInt64(num: bigint): void;
            writeVarInt64(num: bigint, offset: bigint): void;
            writeBool(val: boolean): void;
            writeBool(val: boolean, offset: bigint): void;
            writeZigZag32(val: bigint): void;
            writeZigZag32(val: bigint, offset: bigint): void;
            writeZigZag64(val: bigint): void;
            writeZigZag64(val: bigint, offset: bigint): void;
            writeStringByInt16LE(): void;
            writeStringByInt16LE(str: string): void;
            writeStringByInt16LE(str: string, offset: bigint): void;
            writeStringByVarInt32(): void;
            writeStringByVarInt32(str: string): void;
            writeStringByVarInt32(str: string, offset: bigint): void;
            writeSenBuffer(sen: SenBuffer): void;
            writeSenBuffer(sen: SenBuffer, offset: bigint): void;
            toBytes(): Array<bigint>;
            toString(): string;
            toString(encodingType: string): string;
            BackupReadOffset(): void;
            RestoreReadOffset(): void;
            BackupWriteOffset(): void;
            RestoreWriteOffset(): void;
            CreateDirectory(outpath: string): void;
            OutFile(outpath: string): void;
            SaveFile(outpath: string): void;
            async SaveFileAsync(path: string): Promise<void>;
            async OutFileAsync(path: string): Promise<void>;
            Close(): void;
            Flush(): void;
            SerializeJson<T>(json: T): string;
            SerializeJson<T>(json: T, indent: bigint | string): string;
            readInt16BE(): bigint;
            readInt16BE(offset: bigint): bigint;
            peekUInt8(): bigint;
            peekUInt8(offset: bigint): bigint;
            peekInt8(): bigint;
            peekInt8(offset: bigint): bigint;
            peekUInt16LE(): bigint;
            peekUInt16LE(offset: bigint): bigint;
            peekUInt16BE(): bigint;
            peekUInt16BE(offset: bigint): bigint;
            peekUInt24LE(): bigint;
            peekUInt24LE(offset: bigint): bigint;
            peekUInt24BE(): bigint;
            peekUInt24BE(offset: bigint): bigint;
            peekUInt32LE(): bigint;
            peekUInt32LE(offset: bigint): bigint;
            peekUInt32BE(): bigint;
            peekUInt32BE(offset: bigint): bigint;
            peekInt16LE(): bigint;
            peekInt16LE(offset: bigint): bigint;
            peekInt16BE(): bigint;
            peekInt16BE(offset: bigint): bigint;
            peekInt24LE(): bigint;
            peekInt24LE(offset: bigint): bigint;
            peekInt24BE(): bigint;
            peekInt24BE(offset: bigint): bigint;
            peekInt32LE(): bigint;
            peekInt32LE(offset: bigint): bigint;
            peekInt32BE(): bigint;
            peekInt32BE(offset: bigint): bigint;
            peekString(count: bigint): string;
            peekString(count: bigint, offset: bigint): string;
            peekString(count: bigint, offset: bigint, encodingType: string): string;
            size(): bigint;
            current(): bigint;
            readInt24BE(): bigint;
            readInt24BE(offset: bigint): bigint;
            readInt32BE(): bigint;
            readInt32BE(offset: bigint): bigint;
            slice(begin: bigint, end: bigint): void;
        }

        declare namespace ChatGPT {
            export function AskChatGPT(api: string, question: string): string;
        }

        /**
         * @package Platform implementing system for DotNet using JS
         */

        declare namespace DotNetPlatform {
            /**
             * @returns The platform that the user is using right now
             */
            export function CurrentPlatform(): Sen.Script.Modules.Platform.Constraints.ShellType.Console;

            /**
             * @returns The current Sen is Console or GUI
             */
            export const SenShell = "console" | "gui";

            /**
             * @returns Check if the UTF8 is supported by User Console
             */

            export function IsUTF8Support(): boolean;

            /**
             * @returns Check if the color is supported by User Console
             */

            export function IsColorSupport(): boolean;

            /**
             * @returns Make the User's terminal support UTF8
             */

            export function SupportUtf8Console(): void;

            /**
             * @returns current user platform
             */

            export function CurrentUserPlatform(): "Linux" | "Windows" | "Macintosh";

            /**
             *
             * @param message - Send message here
             * @param title - Send title here
             * Sending notification message through multiple platform
             */

            export function SendNotification(message: string, title: string): void;

            /**
             * Shell that host this tool
             */
            export function ShellHost(): string;
            /**
             *
             * @param message - Send message here
             * @param title - Send title here
             * Sending notification message through multiple platform
             */

            export function SendMessageBox(message: string, title: string): void;
        }

        /**
         * @package Implementing for Console & MaUI project
         */

        declare namespace Console {
            /**
             *
             * @param params - Pass any things here and the tool will console out the input value.
             */

            export function Print<T extends any>(color: Sen.Script.Modules.Platform.Constraints.ConsoleColor | null, ...params: Array<T>): void;
            /**
             *
             * @param params - Pass any things here and the tool will console out the input value.
             */

            export function Printf<T extends any>(color: Sen.Script.Modules.Platform.Constraints.ConsoleColor | null, ...params: Array<T>): void;

            /**
             * @returns Input argument as string
             */

            export function Input(color: Sen.Script.Modules.Platform.Constraints.ConsoleColor | null): string;

            /**
             * @param - Console.ReadKey()
             */

            export function TerminateProgram(): void;
            /**
             * @returns Test error thrown from C# Sen
             */

            export function TestError(): DotNetSystem.Exception;
            /**
             *
             * @param params - Pass object or array here to continue
             */

            export function Debug<T extends Array<any> | object>(color: Sen.Script.Modules.Platform.Constraints.ConsoleColor | null, ...params: Array<T>): void;
            /**
             * @returns Dialog
             */

            export function OpenFileDialog(title: string, filter: Array<string>): string;
            /**
             * @returns Dialogs
             */

            export function OpenMultipleFileDialog(title: string, filter: Array<string>): Array<string>;
            /**
             * @returns Dialog
             */

            export function OpenDirectoryDialog(title: string): string;
            /**
             * @returns Dialog
             */

            export function SaveFileDialog(title: string, filter: Array<string>): string;

            /**
             * Current machine decimal symbols
             */

            export function ObtainCurrentArchitectureDecimalSymbols(): string;
        }
        /**
         * @packages Implementing File System based on C# & JS
         * @access Script can have access to File System through Sen
         */

        declare namespace FileSystem {
            /**
             *
             * @param file_path - Provide file path here, must be file path.
             * @param encoding - Choose one encoding type.
             */

            export function ReadText(file_path: string, encoding: Sen.Script.Modules.FileSystem.Constraints.EncodingType): string;
            /**
             *
             * @param file_path - Provide file path to write.
             * @param data - Provide file data.
             * @param encoding - Provide encoding type (can choose from enum).
             */
            export function WriteText(file_path: string, data: string, encoding: Sen.Script.Modules.FileSystem.Constraints.EncodingType): void;
            /**
             *
             * @param directory_path - Provide directory path to create.
             * @returns Created Directory.
             */
            export function CreateDirectory(directory_path: string): void;
            /**
             *
             * @param directory_path - Provide directories path to delete. should pass array
             * @returns Deleted Directory.
             */
            export function DeleteDirectory(directories: Array<string>): void;
            /**
             *
             * @param file_path - Provide directory to read.
             * @param encoding - Provide encoding from const enum.
             * @returns ASYNCHRONOUS read text file, please provide an await to make the function synchronous.
             */
            export async function ReadTextAsync(file_path: string, encoding: Sen.Script.Modules.FileSystem.Constraints.EncodingType): Promise<string>;
            /**
             *
             * @param directory_path - Provide Directory path.
             * @returns If exists return true, else false.
             */
            export function DirectoryExists(directory_path: string): boolean;
            /**
             *
             * @param file_path - Provide File path.
             * @returns If exists return true, else false.
             */
            export function FileExists(file_path: string): boolean;
            /**
             *
             * @param file_path - Provide file path to write file.
             * @param data - Provide data to write.
             * @param encoding - Provide Encoding Type to Write file.
             * @returns Asynchronous Write file, please provide ES6 async await to make the function synchronous.
             */
            export async function WriteTextAsync(file_path: string, data: string, encoding: Sen.Script.Modules.FileSystem.Constraints.EncodingType): Promise<void>;
            /**
             *
             * @param output_path - Output file expected.
             * @param data - Pass data to write in.
             * @returns Writed file.
             */
            export function OutFile<Generic_T>(output_path: string, data: Generic_T): void;
            /**
             *
             * @param output_path - Output file expected.
             * @param data - Pass data to write in.
             * @returns Writed file, but this function is asynchronous. You need to provide await from ES6 to handle asynchronous function.
             */
            export async function OutFileAsync<Generic_T>(output_path: string, data: Generic_T): Promise<void>;
            /**
             *
             * @param output_file - Normal File System Write file
             * @param data - Data to write
             * @returns Writed data to file
             */
            export function WriteFile<Generic_T>(output_file: string, data: Generic_T): void;
            /**
             *
             * @param output_file - Normal File System Write file
             * @param data - Data to write
             * @returns Writed data to file, but this function is asynchronous. You need to provide await from ES6 to handle asynchronous function.
             */
            export async function WriteFileAsync<Generic_T>(output_file: string, data: Generic_T): Promise<void>;

            /**
             *
             * @param directory - Provide directory needs to read
             * @param ReadOption - Provide read option
             * @returns Readed directory
             */

            export function ReadDirectory(directory: string, ReadOption: Sen.Script.Modules.FileSystem.Constraints.ReadDirectory): Array<string>;

            /**
             *
             * @param filePath - Pass file path here
             * @returns Deleted file
             */

            export function DeleteFile(filePath: string): void;

            /**
             *
             * @param input - Pass file path to move
             * @param output - Pass output path
             * @returns Move file success
             */

            export function MoveFile(input: string, output: string): void;
            /**
             *
             * @param input - Pass dir path to move
             * @param output - Pass output path
             * @returns Move dir success
             */

            export function MoveDirectory(input: string, output: string): void;
            /**
             *
             * @param input - Pass file path to rename
             * @param new_name - New name
             * @returns Rename file success
             */

            export function RenameFile(input: string, new_name: string): void;
            /**
             *
             *
             * @param input - Pass directory path to rename
             * @param new_name - New name
             * @returns Rename directory success
             */

            export function RenameDirectory(input: string, new_name: string): void;
            /**
             *
             * @param filePath - Pass file path here
             * @param outPath - Pass out path here
             * @returns Copied file
             */

            export function CopyFile(filePath: string, outPath: string): void;

            /**
             *
             * @param outpath - Pass output
             * @param data - Pass data to write
             */

            export function WriteBytesJS(outpath: string, data: int[]): void;

            /**
             *
             * @param path - Provide file path
             */

            export function GetModifyTimeUTC(path: string): string;
        }

        declare namespace TypeChecker {
            /**
             *
             * @param data - Provide any variable here
             * @returns - Variable type
             */
            export function GetStrictType(data: any): string;
        }
        /**
         * @package Self implement Records
         */

        declare interface FormatRecords {
            root: string;
            name: string;
            dir: string;
            extname: string;
            basename: string;
        }

        /**
 * @package Path.Parse('/home/user/dir/file.txt');
// Returns:
// {

//   @param dir: '/home/user/dir',
//  @param  base: 'file.txt',
//  @param  ext: '.txt',
//   @param name: 'file' }
 */

        declare interface ParsedPath {
            name: string;
            dir: string;
            ext: string;
            basename: string;
            name_without_extension: string;
            type: "directory" | "file" | "unknown";
        }

        /**
         * @package Self implementing Path based on NodeJS & C# Path System
         */

        declare namespace Path {
            export function Basename(path: string, ...suffix: Array<string>): string;

            /**
             * @returns - Provides the platform-specific path delimiter:
             * `;` for Windows
             * `:` for POSIX
             */
            export function Delimiter(): string;

            /**
             * Example: "/test/st/sf/main.js" returns "/test/st/sf"
             * @param path File path or directory path
             * @returns Returns directory containing the file or directory
             */
            export function Dirname(path: string): string;

            /**
             * Example: "main.js" returns ".js"
             * @param path File path or directory path
             * @returns Returns file extension
             */
            export function Extname(path: string): string;

            /**
             *
             * @param dir - Current Directory
             * @param root - Root directory
             * @param basename - Basename
             * @param name - Current name
             * @param ext - Current extension
             */

            export function Format(dir: string, root: string, basename: string, name: string, ext: string): FormatRecords;

            /**
             *
             * @param path - Provide path
             * @returns Is rooted path (true or false)
             */

            export function IsAbsolute(path: string): boolean;

            /**
             *
             * @param paths - Provide path array
             * @returns Joined path
             */

            export function Join(...paths: Array<string>): string;

            /**
             *
             * @param path - Provide file path
             * @returns Normalized path
             */

            export function Normalize(path: string): string;

            /**
             *
             * @param filePath - Provide file path
             * @returns Implemented NodeJs Parsed Path
             */

            export function Parse(filePath: string): ParsedPath;

            /**
             *
             * @param from - From
             * @param to - To
             * @returns Concat from & to
             */

            export function Relative(from: string, to: string): string;

            /**
             *
             * @param path - Input file path
             * @returns Full file path
             */

            export function Resolve(path: string): string;

            /**
             * @returns Current platform sep
             */

            export function Sep(): string;

            /**
             *
             * @param path - File path
             * @returns Current file name
             */

            export function GetFileName(path: string): string;

            /**
             *
             * @param path - Provide directory path
             * @returns Directory name
             */

            export function GetDirectoryName(path: string): string;

            /**
             *
             * @param path - Provide file path
             * @returns Filename without extension
             */

            export function GetFileNameWithoutExtension(path: string): string;
        }

        declare type Image<Argb32> = Uint8Array;

        declare namespace DotNetBitmap {
            /**
             *
             * @param imagePath - Provide image path
             * @returns width & height of the provided image
             */

            export function GetDimension<Generic_T>(imagePath: string): Sen.Script.Modules.BitMap.Constraints.ImageInfo<Generic_T>;

            /**
             *
             * @param imagePath - Provide image path
             * @returns alpha channel
             */

            export function ExtractAlphaChannel(imagePath: string): Uint8Array;

            /**
             *
             * @param imagePath - Provide image path
             * @returns red channel
             */

            export function ExtractRedChannel(imagePath: string): Uint8Array;

            /**
             *
             * @param imagePath - Provide image path
             * @returns green channel
             */

            export function ExtractGreenChannel(imagePath: string): Uint8Array;

            /**
             *
             * @param imagePath - Provide image path
             * @returns blue channel
             */

            export function ExtractBlueChannel(imagePath: string): Uint8Array;

            /**
             *
             * @param images - Provide image<RGBA32> Array
             * @param width - Provide expected output width
             * @param height - Provide expected output height
             * @returns New Image as Buffer
             */

            export function JoinImages(images: Image<Rgba32>[], width: number, height: number): Image<Rgba32>;

            /**
             *
             * @param new_width - Pass new width
             * @param new_height - Pass new height
             * @param file_path - Pass old file path
             * @param outpath - Pass output path
             */

            export function ResizeImage(new_width: int, new_height: int, file_path: string, outpath: string): void;

            /**
             *
             * @param imagePath - Pass image to save
             * @param imageByte - Pass Byte image
             * @returns Images saved
             */

            export function SaveImage(imagePath: string, imageByte: Image<Rgba32>): void;

            /**
             *
             * @param alphaBuffer - Pass alpha channel
             * @param redBuffer  - Pass red channel
             * @param greenBuffer  - Pass green channel
             * @param blueBuffer  - Pass blue channel
             * @param width  - Pass image width
             * @param height  - Pass image height
             * @returns Rgba Image as Buffer
             */

            export function CreateRgbaImage(alphaBuffer: Uint8Array, redBuffer: Uint8Array, greenBuffer: Uint8Array, blueBuffer: Uint8Array, width: number, height: number): Image<Rgba32>;

            /**
             *
             * @param alphaBuffer - Pass alpha channel
             * @param redBuffer  - Pass red channel
             * @param greenBuffer  - Pass green channel
             * @param blueBuffer  - Pass blue channel
             * @param width  - Pass image width
             * @param height  - Pass image height
             * @returns Argb Image as Buffer
             */

            export function CreateArgbImage(alphaBuffer: Uint8Array, redBuffer: Uint8Array, greenBuffer: Uint8Array, blueBuffer: Uint8Array, width: number, height: number): Image<Argb32>;

            /**
             *
             * @param imagePath - Provide image path
             * @param outputPath - Provide output image path
             * @param degrees
             */

            export function RotateImage(imagePath: string, outputPath: string, degrees: number): void;

            /**
             *
             * @param pngImagePath - Provide png in path
             * @param jpegImagePath - Provide Jpeg out path
             * @returns PNG TO JPEG
             */

            export function ConvertPngToJpeg(pngImagePath: string, jpegImagePath: string): void;

            /**
             *
             * @param pngImagePath - Provide png out path
             * @param jpegImagePath - Provide Jpeg in path
             * @returns   JPEG TO PNG
             */

            export function ConvertJpegToPng(jpegImagePath: string, pngImagePath: string): void;

            /**
             *
             * @param gifImagePath - Input gif path
             * @param outputDirectory - Output directory contains images
             * @param frameName - name for frames
             * @returns All gif frames exported to PNGs
             */

            export function ExportGifToPngs(gifImagePath: string, outputDirectory: string, frameName: string): void;

            /**
             *
             * @param imagePath - Provide image path
             * @param imageByte - Provide image buffer
             * @async Requires to handle asynchronous function
             * @returns Asynchrnous write image
             */

            export async function SaveImageAsync(imagePath: string, imageByte: Image<Rgba32>): Promise<void>;

            /**
             *
             * @param objArray - Send the array of JS Object with width, height, x, y and file_path
             * @param filename - File name for composite image
             * @param output_directory - Output directory
             * @param width - Input width
             * @param height - Input height
             * @returns Written image
             */

            export function CompositeImages<
                T extends {
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                    file_path: string;
                }
            >(objArray: Array<T>, filename: string, output_directory: string, width: int, height: int): void;

            /**
             *
             * @param sourceImagePath - The image to extract
             * @param outputImagePath - Output image
             * @param x - The coordinate x
             * @param y - The coordinate y
             * @param width - Width of extracted image
             * @param height - Height of extracted image
             * @returns Extracted image
             */

            export function CropAndSaveImage(sourceImagePath: string, outputImagePath: string, x: int, y: int, width: int, height: int): void;

            /**
             *
             * @param sourceImagePath - The image to extract
             * @param outputImagePath - Output image
             * @param x - The coordinate x
             * @param y - The coordinate y
             * @param width - Width of extracted image
             * @param height - Height of extracted image
             * @async This function is a promise, please catch it with an await from ES6
             * @returns Extracted image
             */

            export async function CropAndSaveImageAsync(sourceImagePath: string, outputImagePath: string, x: int, y: int, width: int, height: int): Promise<void>;

            /**
             *
             * @param images - Provide the images array of JS Object
             */

            export async function CropAndSaveImagesAsync(images: Array<AsyncTaskImageSplit>): Promise<void>;

            /**
             *
             * @param images Provide array of images
             */

            export function CropAndSaveImages(images: Array<AsyncTaskImageSplit>): void;

            /**
             * Structure
             */

            export interface AnimatedGifOption {
                width: bigint;
                height: bigint;
                images: Array<string>;
                outputPath: string;
                frame_delay: bigint;
            }

            /**
             *
             * @param option - Pass option
             * @returns Splitted GIF
             */

            export function ExportAnimatedGif(option: AnimatedGifOption): void;

            /**
             * Structure
             */

            export interface GenerateAPNG {
                imageList: Array<string>;
                outFile: string;
                framesPerSecond: bigint;
            }

            /**
             *
             * @param g_option - Pass option
             * @returns Output APNG
             */

            export function CreateAPNG(g_option: GenerateAPNG): void;

            /**
             * Structure
             */

            export interface Dimension {
                width: bigint;
                height: bigint;
            }

            /**
             *
             * @param inFile - Pass in file
             * @param outFile - Pass out file
             * @param dimension - Dimension
             */

            export function ExpandImage(inFile: string, outFile: string, dimension: Dimension): void;
        }

        declare namespace TextureHandler {
            // Decode
            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_A8_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ARGB1555_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ARGB4444_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_L8_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_LA44_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_LA88_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGB565_Decode(input_file: string, output_file: string, width: number, height: number): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGB565_Block_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGBA4444_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGBA4444_Block_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGBA5551_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGBA5551_Block_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ARGB8888_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_RGBA8888_Decode(input_file: string, output_file: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ETC1_RGB_Decode(path_in: string, path_out: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ETC1_RGB_A8_Decode(path_in: string, path_out: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_ETC1_RGB_A_Palette_Decode(path_in: string, path_out: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_PVRTC1_4BPP_RGB_Decode(path_in: string, path_out: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_PVRTC1_4BPP_RGBA_Decode(path_in: string, path_out: string, width: int, height: int): void;

            /**
             *
             * @param input_file - Pass PTX in
             * @param output_file - Pass output png
             * @param width - Pass width
             * @param height - Pass height
             * @returns Decoded PNG
             */
            export function Create_PVRTC1_4BPP_RGBA_A8_Decode(path_in: string, path_out: string, width: int, height: int): void;

            // Encode

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_A8_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ARGB1555_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ARGB4444_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGBA8888_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_L8_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_LA44_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_LA88_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGB565_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGB565_Block_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGBA4444_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGBA4444_Block_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGBA5551_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_RGBA5551_Block_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ARGB8888_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ETC1_RGB_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ETC1_RGB_A8_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_ETC1_RGB_A_Palette_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_PVRTC1_4BPP_RGB_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_PVRTC1_4BPP_RGBA_Encode(input_file: string, output_file: string): void;

            /**
             *
             * @param input_file - Provide file path as image in
             * @param output_file - Provide file path out
             */
            export function Create_PVRTC1_4BPP_RGBA_A8_Encode(input_file: string, output_file: string): void;
        }

        declare namespace TextureHandlerPromise {
            /**
             * Dynamic interface uses in the Runtime
             */

            declare interface Dynamic {
                source: string;
                output: string;
            }

            /**
             *
             * @param images - Pass array of images need to encode
             * @param format - Pass encode format
             */

            export function EncodeAsyncImages(images: Array<Dynamic>, format: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial): void;

            /**
             * Extends from Dynamic
             */

            declare interface DecodeDynamic extends TextureHandlerPromise.Dynamic {
                width: int;
                height: int;
            }

            /**
             *
             * @param images - Pass array of images need to encode
             * @param format - Pass encode format
             */

            export function DecodeAsyncImages(images: Array<DecodeDynamic>, format: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial): void;
        }

        declare interface AsyncTaskImageSplit {
            sourceImagePath: string;
            outputImagePath: string;
            x: int;
            y: int;
            width: int;
            height: int;
        }

        namespace DotNetCrypto {
            /**
             *
             * @param data - Provide data to hash as string
             * @returns Hashed data
             */
            export function ComputeMD5Hash(data: string): string;

            /**
             *
             * @param data - Provide data to hash as string
             * @returns Hashed data
             */
            export function ComputeSha1Hash(data: string): string;

            /**
             *
             * @param data - Provide data to hash as string
             * @returns Hashed data
             */
            export function ComputeSha256Hash(data: string): string;

            /**
             *
             * @param data - Provide data to hash as string
             * @returns Hashed data
             */
            export function ComputeSha384Hash(data: string): string;

            /**
             *
             * @param data - Provide data to hash as string
             * @returns Hashed data
             */
            export function ComputeSha512Hash(data: string): string;

            /**
             *
             * @param plainText - Pass plain text
             * @param password - Pass password
             * @param saltValue - Pass salt value
             * @param rijndaelMode - Rijndael Mode, choose one
             * @param rijndaelPadding - Rijndael Padding, choose one
             * @returns encrypted Uint8Array
             */

            export function RijndaelEncrypt(
                plainText: string,
                password: string,
                saltValue: string,
                rijndaelMode: Sen.Script.Modules.Crypto.Constraints.RijndaelMode,
                rijndaelPadding: Sen.Script.Modules.Crypto.Constraints.RijndaelPadding
            ): Uint8Array;

            /**
             *
             * @param encryptedBytes - Encrypted Uint8Array
             * @param password  - Pass password
             * @param saltValue - Pass salt value
             * @param rijndaelMode - Rijndael Mode, choose one
             * @param rijndaelPadding - Rijndael Padding, choose one
             * @returns decrypted Uint8Array
             */

            export function RijndaelDecrypt(
                encryptedBytes: Uint8Array,
                password: string,
                saltValue: string,
                rijndaelMode: Sen.Script.Modules.Crypto.Constraints.RijndaelMode,
                rijndaelPadding: Sen.Script.Modules.Crypto.Constraints.RijndaelPadding
            ): Uint8Array;
        }

        /**
         * @package Self implement compression based on DotNetZip
         * @requires https://www.nuget.org/packages/DotNetZip/
         */

        declare namespace DotNetCompress {
            /**
             *
             * @param zip_output - Created zip output path
             * @param files - File array, pass an empty array if nothing were added
             * @param directories - Directory array, pass an empty array if nothing were added
             * @returns Created zip
             */
            export function CompressZip(zip_output: string, files: Array<string>, directories: Array<string>): void;
            /**
             *
             * @param zip_output - Created zip output path
             * @param files - File array, pass an empty array if nothing were added
             * @param directories - Directory array, pass an empty array if nothing were added
             * @returns Created zip, this function is asynchronous, please provide await from ES6
             */

            export async function CompressZipAsync(zip_output: string, files?: Array<string>, directories?: Array<string>): Promise<void>;

            /**
             *
             * @param zip_input - Zip path
             * @param extracted_directory - Extracted directory expected
             * @returns Extracted zip
             */

            export function UncompressZip(zip_input: string, extracted_directory: string): void;

            /**
             *
             * @param zip_input - Zip path
             * @param extracted_directory - Extracted directory expected
             * @returns Extracted zip as asynchronous function, please use ES6 Async/Await to make it synchronous
             */

            export async function UncompressZipAsync(zip_input: string, extracted_directory: string): Promise<void>;

            /**
             *
             * @param data - Pass data to do compression
             * @param compression_level - Pass Zlib Level
             * @returns Zlib out
             */

            export function CompressZlibBytes<Generic_T, Generic_U>(data: Generic_T, compression_level: Sen.Script.Modules.Compression.Constraints.ZlibLevel): Generic_U;

            /**
             *
             * @param zlibData - Pass data to do uncompression
             * @returns Uncompressed Zlib out
             */

            export function UncompressZlibBytes<Generic_T, Generic_U>(zlibData: Generic_T): Generic_U;
        }

        /**
         * @returns Current place contains Script directory
         */
        declare const MainScriptDirectory: string;

        /**
         * @returns All scripts loaded by the Sen program
         */

        declare const ScriptModules: Array<string>;

        /**
         * @package Dependencies Jint from DotNet
         * @requires https://github.com/sebastienros/jint
         */

        declare namespace JavaScriptCoreEngine {
            /**
             *
             * @param js_string_to_evaluate - Pass JS to Evaluate as string
             * @returns Finished evaluate, can be undefined
             */
            export function Evaluate(js_string_to_evaluate: string, source: string): void;
            /**
             *
             * @param js_string_to_execute - Pass JS to Evaluate as string
             * @returns Add engine to the Sen
             */
            export function Execute(js_string_to_execute: string, source: string): void;
            /**
             *
             * @param specifier - Pass specifier
             * @param code - Pass code
             * @returns Added module JS import/export to the Sen
             */
            export function AddModule(specifier: string, code: string): void;
        }

        declare namespace DotNetLocalization {
            /**
             *
             * @param property - Property to get
             * @param ScriptDirectory - The script directory contains "main.js"
             * @param Language - Language to get
             * @returns STRING if exists in Language, else returns property
             */
            export function Get(property: string, ScriptDirectory: string, Language: string): string;
        }

        declare namespace DotNetSystem {
            class Exception {
                constructor(message?: string);

                message: string;
                readonly stackTrace: string | null;
                readonly innerException: Exception | null;
                readonly source: string | null;
                readonly helpLink: string | null;
                readonly errorCode: Sen.Script.Modules.Exceptions.StandardsException;

                toString(): string;
            }

            class RuntimeException extends Exception {
                constructor(public message?: string, public file_path?: string): void;
            }

            class RTONDecodeException extends RuntimeException {
                constructor(public message: string, public file_path: string, public expected: string, public exception: Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONListException): void;
            }
        }

        declare const DotNetExceptionArg: any;

        /**
         * PvZ2 Shell
         */

        declare namespace LotusModule {
            /**
             *
             * @param object - Object
             * @param indent - Indent
             * @param allow_null - Write null or not
             */
            export function SerializeJson<T>(object: T, indent?: string | number, allow_null?: boolean): string;

            /**
             * Decode REANIM
             * @param inFile In file REANIM
             *
             */
            export function ReanimToReanimJson(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim;

            /**
             * Encode REANIM
             * @param reanim - Deserialize REANIM
             * @param version - Version
             * @param outFile - Out file
             */

            export function ReanimFromReanimJson(reanim: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim, version: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Version, outFile: string): void;

            /**
             * JSON to XML
             * @param reanim - Deserialize REANIM
             * @param outFile - Out file
             */

            export function ReanimToXML(reanim: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim, outFile: string): void;

            /**
             * JSON from XML
             * @param inFile In file REANIM XML
             *
             */
            export function ReanimFromXML(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim;

            /**
             * JSON to Flash
             * @param reanim - REANIM Deserialize
             * @param out_dir - Out directory
             */

            export function ReanimJsonToFlashXfl(reanim: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim, out_dir: string): void;

            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             * @param encryptionKey - Key
             */

            export function DecodeCompiledText(inFile: string, outFile: string, encryptionKey: string, use_64_bit_variant: boolean): void;
            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             * @param encryptionKey - Key
             */

            export function EncodeCompiledText(inFile: string, outFile: string, encryptionKey: string, use_64_bit_variant: boolean): void;

            /**
             * Flash to JSON
             * @param inDir - In directory
             */

            export function ReaimJsonFromFlashXfl(inDir: string): Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim;

            /**
             * REANIM to Flash
             * @param inFile - In file
             * @param outDir - Out directory
             */

            export function ReanimToFlashXfl(inFile: string, outDir: string): void;

            /**
             * Reanim from Flash
             * @param inDir - In directory
             * @param outFile - Out file
             */

            export function ReanimFromFlashXfl(inDir: string, outFile: string, version: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Version): void;

            /**
             *
             * @param inFile - Pass RTON
             * @param outFile - Out RTON
             * @param decryptRTON - RTON Cipher
             */

            export function RTONEncrypt(inFile: string, outFile: string, decryptRTON: RTONCipher): void;
            /**
             *
             * @param inFile - Pass RTON
             * @param outFile - Out RTON
             * @param decryptRTON - RTON Cipher
             */

            export function RTONDecrypt(inFile: string, outFile: string, decryptRTON: RTONCipher): void;

            /**
             *
             * @param inFile - Pass RTON file here
             * @param outFile - Pass JSON output here
             * @returns RTON2JSON
             */
            export function RTONDecode(inFile: string, outFile: string, decryptRTON: RTONCipher): void;

            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             */

            export function DecodeNewtonResource(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             * @param key - Provide key
             */

            export function CryptDataEncrypt(inFile: string, outFile: string, key: string): void;
            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             * @param key - Provide key
             */

            export function CryptDataDecrypt(inFile: string, outFile: string, key: string): void;
            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             */

            export function EncodeNewtonResource(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass JSON file here
             * @param outFile - Pass RTON output here
             * @returns JSON2RTON
             */

            export function RTONEncode(inFile: string, outFile: string, encryptRTON: RTONCipher): void;
            /**
             *
             * @param inFile - Pass PAM file here
             * @param outFile - Pass PAM JSON output here
             * @returns Pam to Pam Json
             */

            export function PAMtoPAMJSON(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson;
            /**
             *
             * @param inFile - Pass JSON file here
             * @param outFile - Pass PAM output here
             * @returns PAM Json to Pam
             */

            export function PAMJSONtoPAM(PamJson: string, outFile: string): void;
            /**
             *
             * @param package_n - FlashRequest
             * @param outFolder - Out dir
             * @param resolution - Pass resize resolution
             */

            export function CreatePamFlashEmpty(package_n: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.FlashRequest): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo;

            /**
             *
             * @param inFile - PAM JSON
             * @param outFolder - Out dir
             * @param resolution - Pass resize resolution
             */

            export function PAMJSONtoFlashAnimation(PAMJson: string, outFolder: string, resolution: int): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo;

            /**
             *
             * @param inFolder - .XFL
             * @param outFolder - Out PAM JSON
             */

            export function FlashAnimationtoPAMJSON(inDirectory: string, extra_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson;

            /**
             *
             * @param inFile - PAM
             * @param outFolder - Out dir
             * @param resolution - Pass resize resolution
             */

            export function PAMtoFlashAnimation(inFile: string, outFolder: string, resolution: int): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo;
            /**
             *
             * @param inFolder - .XFL
             * @param outFolder - Out PAM
             */

            export function FlashAnimationtoPAM(inFolder: string, outFile: string, extra_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraInfo): void;

            /**
             *
             * @param inFile - Pass RSG file path
             * @param outFolder - Out directory
             * @param useResDirectory - Want to use res dir or not
             */

            export function RSGUnpack(inFile: string, outFolder: string, useResDirectory: boolean = true): Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo;
            /**
             *
             * @param inDirectory - Pass RSG packet directory path
             * @param outFile - Out File
             */

            export function RSGPack(inDirectory: string, outFile: string, packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo, useResDirectory: boolean = true): void;
            /**
             *
             * @param inFile - Pass RSB file path
             * @param outFolder - Out directory unpacked
             */

            export function RSBUnpack(inFile: string, outFolder: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo;
            /**
             *
             * @param inDirectory - Pass RSB bundle directory path
             * @param outFile - Out RSB
             */

            export function RSBPack(inDirectory: string, outFile: string, manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo): void;

            /**
             *
             * @param base - Pass zlib base
             * @param outFile - Pass outfile
             */

            export function PopCapZlibCompress(Ripefile: string, Use64variant: boolean, outFile: string, zlibLevel: Sen.Script.Modules.Compression.Constraints.ZlibLevel): void;
            /**
             *
             * @param base - Pass zlib base
             * @param outFile - Pass outfile
             */

            export function PopCapZlibUncompress(Ripefile: string, Use64variant: boolean, outFile: string): void;
            /**
             *
             * @param inRSG - Pass RSG base
             */

            export function GetRSBPacketInfo(inRSG: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBPacketInfo;

            /**
             *
             * @param inRSB - Pass RSB base
             */

            export function ProcessRSBData(inRSB: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBHead;
            /**
             *
             * @param inRTON - Pass RTON
             */

            export function ProcessRTONData(inRTON: string): Sen.Script.Modules.Support.PopCap.PvZ2.RTON.Encode.RTONHead;
            /**
             *
             * @param inPAM - Pass PAM
             */

            export function ProcessPAMData(inPAM: string): Sen.Script.Modules.Support.PopCap.PvZ2.Animation.PAMHeader;

            /**
             *
             * @param inWEM - Pass wem path
             * @param outOGG - Pass OGG output path
             */

            export function WemToOGG(inWEM: string, outOGG: string, destination: string, inlineCodebook: boolean, inlineSetup: boolean): void;
            /**
             *
             * @param inFile - Pass RSB file path
             * @param outRsb - Out RSB
             */

            export function RSBObfuscate(inFile: string, outRsb: string): void;

            /**
             *
             * @param bnk_in - Pass BNK in
             * @param bnk_dir_out - Pass dir out
             */

            export function WWiseSoundBankDecode(bnk_in: string, bnk_dir_out: string): Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple;

            /**
             *
             * @param soundbank_dir - Pass BNK dir in
             * @param out_bnk - Pass BNK out
             * @param information - Pass soundbank json deserialized
             */

            export function WWiseSoundBankEncode(soundbank_dir: string, out_bnk: string, information: Sen.Script.Modules.Support.WWise.Soundbank.Encode.WWiseInfoSimple): void;

            /**
             *
             * @param inDir - Pass directory
             * @param resolution - Pass resolution
             * @returns Flash animation resize
             */

            export function FlashAnimationResize(inDir: string, resolution: int): void;
            /**
             *
             * @param inFile - Pass RSB file path
             * @param outFolder - Out directory unpacked
             */

            export function RSBUnpackByLooseConstraints(inFile: string, outFolder: string, version: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.Version): Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.ManifestInfo;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function ConvertOGGtoWAV(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function ZlibCompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function ZlibUncompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function GZipCompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function GZipUncompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function DeflateCompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function DeflateUncompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function Bzip2Compress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function Bzip2Uncompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function LzmaCompress(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - Pass input path
             * @param outFile - Pass output file
             */

            export function LzmaUncompress(inFile: string, outFile: string): void;

            /**
             *
             * @param AnimationJson - Pass animation json as deserialize
             * @param outFolder - out dir
             * @param mediaPath - media path
             * @param setting - settings
             */

            export function GenerateImageSequence(AnimationJson: string, outFolder: string, mediaPath: string, setting: Sen.Shell.AnimationHelperSetting): Record<string, [bigint, bigint]>;

            /**
             *
             * @param RSBOriginalFilePath - RSB Original
             * @param RSBModFilePath - RSB Mod
             * @param RSBPatchOutFile - After compare
             * @returns RSB Patch Decode
             */

            export function CreateRSBPatch(RSBOriginalFilePath: string, RSBModFilePath: string, RSBPatchOutFile: string): void;

            /**
             *
             * @param RSBOriginalFilePath - RSB Original
             * @param RSBPatchFilePath - Patch file
             * @param RSBOutFilePath - After Patch
             */

            export function ApplyRSBPatch(RSBOriginalFilePath: string, RSBPatchFilePath: string, RSBOutFilePath: string): void;

            /**
             *
             * @param OldFile - Old file
             * @param NewFile - New file
             * @param PatchOutFile - Output patch
             * @param interleaved
             */

            export function VCDiffEncode(OldFile: string, NewFile: string, PatchOutFile: string, interleaved: boolean): void;

            /**
             *
             * @param OldFile - Pass old file
             * @param PatchFile - Patch file
             * @param NewFile - Output
             *
             */

            export function VCDiffDecode(OldFile: string, PatchFile: string, NewFile: string): void;

            /**
             *
             * @param inFile - Pass file path
             * @returns True/false
             */

            export function IsPopCapRSG(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.RSGAbnormal;

            /**
             *
             * @param resource - Pass Official
             */

            export function RewriteSlot(resource: Resources_Group_Structure_Template, outfile: string): void;

            // export function RSGPack(inDirectory: string, outFile: string, packet_info: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo, useResDirectory: boolean = true): void;

            /**
             * Structure
             */

            export interface RSGPackTemplate {
                inFolder: string;

                outFile: string;

                readonly useResDirectory: false;

                packet: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Pack.PacketInfo;
            }

            /**
             *
             * @param kn - RSG n
             */

            export function RSGPackAsync(...kn: Array<RSGPackTemplate>): void;

            /**
             * Structure
             */

            export interface RSGUnpackTemplate {
                inFile: string;

                outFolder: string;

                readonly useResDirectory: false;
            }

            /**
             *
             * @param kn - RSG n
             */

            export function RSGUnpackAsync(...kn: Array<RSGUnpackTemplate>): void;
            /**
             *
             * @param resource - Pass Official
             */

            export function ConvertResourceGroupToResInfo(resource: Resources_Group_Structure_Template, version: Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.ExpandPath, outFile: string): void;

            /**
             *
             * @param outFile - Output file
             * @param inFile - Input file
             */

            export function ConvertResInfoToResourceGroup(outFile: string, inFile: string): void;

            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             */

            export function PopcapRenderEffectDecode(inFile: string, outFile: string): void;
            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             */

            export function PopcapRenderEffectEncode(inFile: string, outFile: string): void;

            /**
             *
             * @param inFile - In file
             */

            export function ParticlesToJson(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles;

            /**
             *
             * @param particle - Particles
             * @param version - Version
             * @param outFile - Output file
             */

            export function ParticlesFromJson(particle: Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles, version: Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Version, outFile: string): void;

            /**
             *
             * @param inFile - Input file
             * @param outfile - Output file
             */

            export function ParticlesToXML(inFile: string, outfile: string): void;

            /**
             *
             * @param inFile - Input file
             */

            export function ParticlesFromXML(inFile: string): Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles;

            /**
             *
             * @param inFile - In file
             * @param outFile - Out file
             */

            export function DecodeCFW2(inFile: string, outFile: string): void;

            /**
             *
             * @param inFile - in file
             * @param outFile - out file
             */

            export function EncodeCFW2(inFile: string, outFile: string): void;

            /**
             *
             * @param inFile - in file
             * @param out_dir - out directory
             */

            export function UnpackPackage(inFile: string, out_dir: string): void;

            /**
             *
             * @param inDirectory - In directory
             * @param outFile - Out file
             */

            export function PackPackage(inDirectory: string, outFile: string): void;
        }

        /**
         * Strictly checking version
         */

        declare namespace ShellVersion {
            /**
             * Shell version of the current Shell
             */

            export const ShellVersion: int;

            /**
             * Script version of the current Script
             */

            export const ScriptRequirement: int;
        }

        /**
         * ADB Helper
         */

        declare namespace ADBHelper {
            /**
             * Structure
             */

            export interface SendADBCommand {
                Command: string;
                Path: string;
            }

            /**
             *
             * @param adb - Send ADB Command
             */

            export function ADBSendConnect(fileName: string, Command: string): string;

            /**
             *
             * @param time - Pass time to sleep
             */

            export function Sleep(time: bigint): void;
        }

        /**
         * Download update
         */

        declare namespace ShellUpdate {
            /**
             *
             * @param url - Provide link
             * @param user_agent - Provide User Agent
             * @returns context string
             */

            export function SendGetRequest(url: string, user_agent: string): GitHubReleases;

            /**
             *
             * @param save_dir - Provide shell directory
             * @param link - Provide download link to GitHub API
             * @param index - Provide index
             * @param shell_name - Provide download shell: shell.exe for example
             */

            export function DownloadShell(save_dir: string, link: string, index: int, shell_name: string): void;

            /**
             * @returns If the user provide admin permission to execute
             */

            export function HasAdmin(): boolean;

            /**
             *
             * @param fileUrl - Pass URL here
             * @param filePath - Pass output path
             * @param user_agent - Pass User agent
             */

            export function DownloadFromServer(fileUrl: string, filePath: string, user_agent: string): void;

            /**
             *
             * @param fileUrls - Pass URL here
             * @param filePaths - Pass output path
             * @param user_agent - Pass User agent
             */

            export function DownloadFromMultipleThread(fileUrls: Array<string>, filePaths: Array<string>, user_agent: string): void;
        }

        declare interface GitHubReleases {
            url: string;
            assets_url: string;
            upload_url: string;
            html_url: string;
            id: number;
            author: {
                login: string;
                id: number;
                node_id: string;
                avatar_url: string;
                gravatar_id: string;
                url: string;
                html_url: string;
                followers_url: string;
                following_url: string;
                gists_url: string;
                starred_url: string;
                subscriptions_url: string;
                organizations_url: string;
                repos_url: string;
                events_url: string;
                received_events_url: string;
                type: string;
                site_admin: boolean;
            };
            node_id: string;
            tag_name: string;
            target_commitish: string;
            name: string;
            draft: boolean;
            prerelease: boolean;
            created_at: string;
            published_at: string;
            assets: Array<{
                url: string;
                id: number;
                node_id: string;
                name: string;
                label: null | string;
                uploader: {
                    login: string;
                    id: number;
                    node_id: string;
                    avatar_url: string;
                    gravatar_id: string;
                    url: string;
                    html_url: string;
                    followers_url: string;
                    following_url: string;
                    gists_url: string;
                    starred_url: string;
                    subscriptions_url: string;
                    organizations_url: string;
                    repos_url: string;
                    events_url: string;
                    received_events_url: string;
                    type: string;
                    site_admin: boolean;
                };
                content_type: string;
                state: string;
                size: number;
                download_count: number;
                created_at: string;
                updated_at: string;
                browser_download_url: string;
            }>;
            tarball_url: string;
            zipball_url: string;
            body: string;
        }

        /**
         * Buffer Compare
         */

        declare enum BufferCompare {
            same = 0,
            larger = 1,
            smaller = -1,
        }

        /**
         * Buffer implemented from .NET
         */

        declare namespace Buffer {
            /**
             *
             * @param size - Pass size to allocate
             */
            export function Alloc(size: bigint): Buffer.JSBuffer;

            /**
             *
             * @param otherBuffer - Pass other Buffer here to compare
             */

            export function Compare(otherBuffer: Buffer.JSBuffer): BufferCompare;

            /**
             *
             * @param input - Pass string to create buffer
             */

            export function From(input: string): Buffer.JSBuffer;

            /**
             *
             * @param otherBuffer - Check if it's included
             */

            export function Includes(otherBuffer: Buffer.JSBuffer): boolean;

            /**
             *
             * @param value - Val find
             * @param startIndex - Start index
             * @param endIndex - End index
             */

            export function IndexOf(value: Buffer.JSBuffer, startIndex: int = 0, endIndex: bigint? = null): bigint;

            /**
             *
             * @param value - Val find
             * @param startIndex - Start index
             * @param endIndex - End index
             */

            export function LastIndexOf(value: Buffer.JSBuffer, startIndex: bigint = 0, endIndex: bigint? = null): bigint;

            /**
             *
             * @param startIndex - Start slice
             * @param endIndex - End slice
             */

            export function Slice(startIndex: bigint = 0, endIndex: bigint? = null): Buffer.JSBuffer;

            /**
             * JS Buffer
             */

            export interface JSBuffer {
                ToString(): string;
                readonly Length: bigint;
                ToArray(): Array<bigint>;
            }
        }

        /**
         * Animation Helper
         */

        export interface AnimationHelperSetting {
            frameName: string = "frame";
            imageByPath: bool = false;
            appendWidth: int = 0;
            appendHeight: int = 0;
            posX: int = 0;
            posY: int = 0;
            disableSprite: Array<int> = new Array<int>(0);
            output_animation_render: bigint;
        }

        /**
         * Lawnstrings
         */

        namespace PvZ2Lawnstrings {
            /**
             * Structure
             */
            export interface JsonMap {
                objects: [
                    {
                        aliases: ["LawnStringsData"];
                        objclass: "LawnStringsData";
                        objdata: {
                            LocStringValues: Record<string, string>;
                        };
                    }
                ];
                version: 1n;
            }
            /**
             * Structure
             */
            export interface JsonText {
                objects: [
                    {
                        aliases: ["LawnStringsData"];
                        objclass: "LawnStringsData";
                        objdata: {
                            LocStringValues: Array<string>;
                        };
                    }
                ];
                version: 1n;
            }
            /**
             *
             * @param filepath - Pass file path
             * @returns Stream read file
             */
            export function ReadUTF16Le(filepath: string): string;
            /**
             *
             * @param filepath - Out path to write
             * @param data - Data to write
             */
            export function WriteUTF16Le(filepath: string, data: string): void;
            /**
             *
             * @param inpath - Input file path
             * @returns Json Map Object
             */
            export function ConvertJsonTextToJsonMap(inpath: string): Sen.Shell.PvZ2Lawnstrings.JsonMap;
            /**
             *
             * @param inpath - Input file path
             * @returns Json Text Object
             */
            export function ConvertJsonMapToJsonText(inpath: string): Sen.Shell.PvZ2Lawnstrings.JsonText;
            /**
             *
             * @param filepath - Pass file path
             * @returns Stream read file
             */
            export function ReadUTF8Bom(filepath: string): string;
            /**
             *
             * @param filepath - Out path to write
             * @param data - Data to write
             */
            export function WriteUTF8Bom(filepath: string, data: string): void;
        }

        /**
         * XML namespace for PopCap Animation Animate Adobe XML
         */

        namespace PvZ2XML {
            /**
             *
             * @param index - Start index
             * @param transform - Transform
             * @param outpath - Output path
             */
            export function WriteImageDocument(index: int, name: string, size: [int, int], transform: [double, double, double, double, double, double], outpath: string): void;
            /**
             *
             * @param index - Start index
             * @param name - Name of image
             * @param outpath - Output path
             */

            export function WriteSourceDocument(index: int, name: string, size: int[], transform: double[], resolution: int, outpath: string): void;

            /**
             * Structure
             */

            export interface DOMDocumentAddon {
                media: Array<string>;
                sprite: Array<string>;
                source: Array<string>;
                image: Array<string>;
            }

            /**
             *
             * @param data - Pass data to insert (media, sprite, source, image)
             * @param xml - Pass xml read as string
             * @param outFile - Pass output file
             */

            export function InsertDOMDocumentData(data: PvZ2XML.DOMDocumentAddon, xml: string, outFile: string): void;

            /**
             *
             * @param sprite_index - Sprite index
             * @param duration - Pass duration (should always be 1)
             * @param image_index - Image index
             * @param transform - Transformation
             * @param color - Color
             * @param outFile - File output
             */

            export function WriteSpriteDocument(sprite_index: int, duration: int, image_index: int, transform: [double, double, double, double, double, double], color: [double, double, double, double], outFile: string): void;

            /**
             *
             * @param inFile - Pass file path
             * @param transform - Pass transformation
             * @param color - Pass color information
             * @param image_index - Pass image index to insert
             */

            export function AddImageToSpriteDocument(inFile: string, transform: [double, double, double, double, double, double], color: [double, double, double, double], image_index: int): void;

            /**
             * Structure
             */

            export interface SerializeOption {
                json: string;
            }

            export function SerializeXML(option: SerializeOption): string;
            /**
             * Structure
             */

            export interface DeserializeOption {
                xml: string;
            }

            export function DeserializeXML(option: DeserializeOption): string;
        }

        /**
         * XML Helper
         */

        namespace XMLHelper {
            /**
             *
             * @param xml - Pass XML string
             */
            export function Deserialize<T>(xml: string): T;

            /**
             *
             * @param obj - Pass obj
             * @param out - Pass output path
             */

            export function Serialize<T>(obj: T, out: string): string;
        }
    }

    // Script

    declare namespace Script {
        /**
         * Structure
         */
        declare type res_json = {
            expand_path: "string" | "array";
            groups: subgroup_parent;
        };

        /**
         * Structure
         */

        declare type subgroup_parent = {
            [x: string]: {
                is_composite: boolean;
                subgroup: subgroup_children;
            };
        };

        /**
         * Structure
         */

        declare type composite_object = {
            type: "composite";
            id: string;
            subgroups: Array<{
                id: string;
                res?: string;
            }>;
        };

        /**
         * Structure
         */

        declare type subgroup_children = {
            [x: string]: {
                [x: string]: packet_data;
            };
        };

        /**
         * Structure
         */

        declare type sprite_data = {
            [subgroup_children_name: string]: {
                type: resolution;
                packet: {
                    [parent_name: string]: {
                        dimension: {
                            width: number;
                            height: number;
                        };
                        type: string;
                        path: Array<string>;
                        data: {
                            [each_sprite_id: string]: {
                                default: {
                                    ax?: number;
                                    ay?: number;
                                    ah?: number;
                                    aw?: number;
                                    x?: number;
                                    y?: number;
                                    cols?: number;
                                };
                                type: string;
                                path: Array<string>;
                            };
                        };
                    };
                };
            };
        };

        /**
         * Structure
         */

        declare type ResInfoSubgroupStandard = {
            type: resolution;
            packet: {
                [parent_name: string]: {
                    dimension: {
                        width: number;
                        height: number;
                    };
                    type: string;
                    path: Array<string>;
                    data: {
                        [each_sprite_id: string]: {
                            default: {
                                ax?: number;
                                ay?: number;
                                ah?: number;
                                aw?: number;
                                x?: number;
                                y?: number;
                                cols?: number;
                            };
                            type: string;
                            path: Array<string>;
                        };
                    };
                };
            };
        };

        /**
         * Structure
         */

        declare type resolution = "1536" | "768" | "384" | "1200" | "640" | null;

        /**
         * Structure
         */

        declare type packet_data = {
            [x: string]: {
                path?: Array<string>;
                type: string;
                dimension?: {
                    width: number;
                    height: number;
                };
                [x: string]: children_data_inside_packet;
                data?: children_data_inside_packet;
            };
        };

        /**
         * Structure
         */

        declare type children_data_inside_packet = {
            [x: string]: {
                path: Array<string>;
                type: string;
                default?: {
                    ax: number;
                    ay: number;
                    aw: number;
                    ah: number;
                    x: number;
                    y: number;
                    cols?: number;
                    forceOriginalVectorSymbolSize?: boolean;
                };
            };
        };

        /**
         * Structure
         */

        declare type PopCap_Subgroup_Parent = {
            type: string;
            id: string;
            subgroups: Array<{
                id: string;
                res?: string;
            }>;
        };

        /**
         * Structure
         */

        declare type Resource_Structure_Template = {
            id: string;
            parent: string;
            res?: string;
            resources: Array<{
                slot: number;
                id: string;
                path: Array<string> | string;
                type?: string;
                atlas?: boolean;
                width?: number;
                height?: number;
                runtime?: boolean;
                parent?: string;
                ah?: number;
                aw?: number;
                ax?: number;
                ay?: number;
                x?: number;
                y?: number;
                forceOriginalVectorSymbolSize?: boolean;
                cols?: number;
                srcpath?: string | Array<string>;
            }>;
            type: string;
        };

        /**
         * Structure
         */

        declare type Resources_Group_Structure_Template = {
            groups: Array<any & Resource_Structure_Template>;
            slot_count: number;
        };

        /**
         * Structure
         */

        declare type using_subgroup = {
            type: string;
            id: string;
            subgroups: Array<{
                id: string;
                res?: string;
            }>;
        };

        /**
         * Structure
         */

        declare type resource_atlas_and_sprites = {
            id: string;
            parent: string;
            res: string;
            resources: Array<{
                slot?: number;
                id: string;
                path: string | Array<string>;
                type: string;
                atlas?: boolean;
                width?: number;
                height?: number;
                runtime?: boolean;
                parent?: string;
                ah?: number;
                aw?: number;
                ax?: number;
                ay?: number;
                x?: number;
                y?: number;
                cols?: number;
            }>;
            type: string;
        };

        /**
         * Structure
         */

        declare type Resource_File_Bundle = {
            id: string;
            parent?: string;
            resources: Array<{
                slot: number;
                id: string;
                path: string;
                type: string;
                forceOriginalVectorSymbolSize?: boolean;
                srcpath?: string | Array<string>;
            }>;
            type: string;
        };

        /**
         * Structure
         */

        declare type blank_slot = {
            slot: number;
        };

        /**
         * Structure
         */

        declare type Output_Value = {
            information: {
                expand_path: "string" | "array";
            };
            groups: {
                [x: string]: res_json_children;
            };
        };

        /**
         * Structure
         */

        declare type res_json_children = {
            is_composite: boolean;
            subgroup: subgroup_children;
        };

        /**
         * Structure
         */

        declare type small_bundle_info_json = {
            is_composite: boolean;
            subgroups: Array<string>;
        };

        /**
         * PvZ2 functions from the Shell
         */

        declare interface RTONCipher {
            crypt: boolean;
            key: string;
        }
    }

    /**
     * Internal Project
     */

    export namespace Internal {
        /**
         * Version
         */

        export class Version {
            /**
             * Version of Internal
             */

            public static InternalVersion(): number;

            /**
             * Give current architecture
             */

            public static GetProcessorArchitecture(): string;
        }

        export class Crypto {
            public static MD5Hash(str: string): string;
        }

        /**
         * Compress
         */

        export class Compress {
            /**
             *
             * @param data - Data Stream
             * @param level - Zlib Level
             */

            public static Zlib<T>(data: Array<bigint>, level?: Sen.Script.Modules.Compression.Constraints.ZlibLevel): Array<T>;

            /**
             *
             * @param data Data Stream
             */

            public static Gzip<T>(data: Array<bigint>): Array<T>;

            /**
             *
             * @param data Data Stream
             */

            public static Deflate<T>(data: Array<bigint>): Array<T>;
        }

        /**
         * Open-VCDiff | Google
         */

        export class VCDiff {
            /**
             *
             * @param before - file before in
             * @param after - file after in
             * @param patch - file patch out
             */
            public static Encode(before: string, after: string, patch: string): void;

            /**
             *
             * @param before - Before Buffer
             * @param after - After Buffer
             * @returns Patch Buffer
             */

            public static Encode(before: Array<bigint>, after: Array<bigint>): Array<bigint>;

            /**
             *
             * @param before - before file in
             * @param patch - patch file in
             * @param after - after file out
             */

            public static Decode(before: string, patch: string, after: string): void;

            /**
             *
             * @param before - Before Buffer
             * @param patch - Patch Buffer
             * @returns After Buffer
             */

            public static Decode(before: Array<bigint>, patch: Array<bigint>): Array<bigint>;
        }

        /**
         * Uncompress
         */

        export class Uncompress {
            /**
             *
             * @param data Data Stream
             */

            public static Zlib<T>(data: Array<bigint>): Array<T>;

            /**
             *
             * @param data Data Stream
             */

            public static Gzip<T>(data: Array<bigint>): Array<T>;

            /**
             *
             * @param data Data Stream
             */

            public static Deflate<T>(data: Array<bigint>): Array<T>;
        }
    }
}
