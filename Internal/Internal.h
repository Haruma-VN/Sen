#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <stdexcept>
#include "dependencies/zlib/zlib.h"
#include <filesystem>
#include <fstream>
#include "dependencies/rg_etc1/rg_etc1.h"
#include "dependencies/rg_etc1/rg_etc1.cpp"
#include <cstdint>
#include <regex>
#include "dependencies/libpng/png.h"
#include "dependencies/avir/avir.h"

#define thiz (*this)

#define log(...)\
	std::cout << __VA_ARGS__ << std::endl;

#define MInternalVersion 1

#ifdef _WIN32
#define InternalAPI extern "C" __declspec(dllexport)
#else
#define InternalAPI extern "C" __attribute__((visibility("default")))
#endif
