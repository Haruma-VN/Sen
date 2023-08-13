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
#include <corecrt_io.h>
#include <regex>

#define thiz (*this)

#define log(...)\
	std::cout << ... << std::endl;