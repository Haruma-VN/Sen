#pragma once

#pragma region version

inline constexpr auto MInternalVersion = 4;

#pragma endregion

#pragma region Standards

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <math.h>
#include <stdexcept>
#include <filesystem>
#include <fstream>
#include <cstdint>
#include <regex>
#include <version>
#include <stdio.h>
#include <future>
#include <map>
#include <stack>
#include <list>
#include <stdlib.h>
#include <string.h>
#include <array>
#include <cstdio>
#include <cstring>
#include <exception>
#if defined(_WIN32)
#include <windows.h>
#include <codecvt>
#endif


#include "../../dependencies/zlib/zlib.h"
#include "../../dependencies/rg_etc1/rg_etc1.h"
#include "../../dependencies/rg_etc1/rg_etc1.cpp"
#include "../../dependencies/libpng/png.h"
#include "../../dependencies/avir/avir.h"
#include "../../dependencies/bzip2/bzlib.h"
#include "../../dependencies/etcpak/ProcessRGB.hpp"


#include "kernel/utility/utility.hpp"

#pragma endregion


#pragma region Compilation

#ifdef _MSC_VER
#pragma warning(disable:4996)
#endif

#define CRT_SECURE_NO_WARNINGS

#define thiz (*this)

#define CHUNK_SIZE 1024

#define CHUNK 16384

#define log(...)\
	std::cout << __VA_ARGS__ << std::endl;

#define null NULL

#pragma endregion

#pragma region API

#ifdef WINDOWS
#define InternalAPI extern "C" __declspec(dllexport)
#else
#define InternalAPI extern "C" __attribute__((visibility("default")))
#endif

#pragma endregion

#pragma region Platforms

enum Architecture {
    X64,
    ARM,
    INTEL,
    X86,
    UNKNOWN,
    ARM64,
};

#define WINDOWS _WIN32

#define LINUX __linux__

#define ANDROID __ANDROID__

#define APPLE __APPLE__

#define IPHONE TARGET_OS_IPHONE

#define MACINTOSH __MACH__

#pragma endregion

#pragma region Definition


typedef void Void;

typedef unsigned char* UnsignedByteStream;

typedef int Integer;

typedef size_t ArraySize;

typedef uLongf ZlibUnsignedLongFloat;

typedef uint8_t Uint8Array;

typedef std::string String;

typedef Bytef FloatByte;

typedef float Float;

typedef std::wstring UTF8;

typedef char* CString;

typedef wchar_t* UTF8String;

typedef std::exception Exception;

#pragma endregion