cmake_minimum_required (VERSION 3.8)

project(
  Internal
  VERSION 4
  HOMEPAGE_URL https://github.com/Haruma-VN/Sen
  LANGUAGES C CXX
)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

# Disable Warning Log
add_definitions(-w)


# Add source to this project's shared library.
add_library(
  Internal SHARED
  "./kernel/tool/compress/bzip2.hpp"
  "./kernel/tool/compress/lzma.hpp"
  "./kernel/utility/string/common.hpp"
  "./kernel/utility/array/common.hpp"
  "./kernel/utility/path/common.hpp"
  "./kernel/utility/filesystem/common.hpp"
  "./kernel/utility/exception/common.hpp"
  "./kernel/tool/diff/vcdiff.hpp"
  "./kernel/utility/utility.hpp"
  "./Internal.hpp"
  "./Internal.cpp"
)


# C++ Standards
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add dependencies
add_subdirectory("./dependencies/avir")
add_subdirectory("./dependencies/json")
add_subdirectory("./dependencies/zlib")
add_subdirectory("./dependencies/ETCPACK")
add_subdirectory("./dependencies/rg_etc1")
add_subdirectory("./dependencies/libpng")
add_subdirectory("./dependencies/lzma")
add_subdirectory("./dependencies/bzip2")
add_subdirectory("./dependencies/open_vcdiff")
add_subdirectory("./dependencies/etcpak")
add_subdirectory("./dependencies/tinyxml2")

# tinyfiledialogs link

if(NOT (CMAKE_SYSTEM_NAME MATCHES "iOS" OR CMAKE_SYSTEM_NAME MATCHES "Android"))
    add_subdirectory("./dependencies/tinyfiledialogs")
    target_link_libraries(Internal PRIVATE tinyfiledialogs)
endif()

# Set compiler

if(APPLE)
    target_compile_options(Internal PRIVATE -Wno-implicit-function-declaration)
    set(CMAKE_C_COMPILER "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang")
    set(CMAKE_CXX_COMPILER "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang++")
elseif(UNIX AND NOT APPLE)
    set(CMAKE_C_COMPILER "clang")
    set(CMAKE_CXX_COMPILER "clang++")
elseif(WIN32)
    set(CMAKE_C_COMPILER "cl.exe")
    set(CMAKE_CXX_COMPILER "cl.exe")
endif()

# Link against dependencies
target_link_libraries(
  Internal PUBLIC 
  zlib 
  ETCPACK 
  rg_etc1 
  libpng 
  etcpak
  lzma
  bzip2
  open_vcdiff
  avir
  json
  tinyxml2
)

# symbol visibility
set(CMAKE_C_VISIBILITY_PRESET hidden)
set(CMAKE_CXX_VISIBILITY_PRESET hidden)

# position independent code
set(CMAKE_POSITION_INDEPENDENT_CODE true)

# Compilation define

target_compile_definitions( 
    ${PROJECT_NAME} PRIVATE 
    _SILENCE_CXX17_CODECVT_HEADER_DEPRECATION_WARNING 
) 
  
target_compile_definitions( 
    ${PROJECT_NAME} PRIVATE 
    CONFIG_BIGNUM 
)

# Output name
if(UNIX OR ANDROID OR APPLE OR IOS)
    set_target_properties(Internal PROPERTIES PREFIX "" OUTPUT_NAME "Internal")
endif()

# CMake Strict

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET Internal PROPERTY CXX_STANDARD 20)
endif()

if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-strict-prototypes")
endif()
