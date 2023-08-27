cmake_minimum_required (VERSION 3.8)
project(
  Internal
  VERSION 4
  HOMEPAGE_URL https://github.com/Haruma-VN/Sen
  LANGUAGES CXX
)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()


# Add source to this project's shared library.
add_library(
  Internal SHARED 
  "./dependencies/avir/avir.h"
  "./dependencies/json/json.hpp"
  "./dependencies/json/json_fwd.hpp"
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

# Add dependencies
add_subdirectory("./dependencies/zlib")
add_subdirectory("./dependencies/ETCPACK")
add_subdirectory("./dependencies/rg_etc1")
add_subdirectory("./dependencies/libpng")
add_subdirectory("./dependencies/etcpak")
add_subdirectory("./dependencies/lzma")
add_subdirectory("./dependencies/bzip2")
add_subdirectory("./dependencies/open_vcdiff")

# tinyfiledialogs link

if(NOT (CMAKE_SYSTEM_NAME MATCHES "iOS" OR CMAKE_SYSTEM_NAME MATCHES "Android"))
    add_subdirectory("./dependencies/tinyfiledialogs")
    target_link_libraries(Internal PRIVATE tinyfiledialogs)
endif()

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
)


if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET Internal PROPERTY CXX_STANDARD 20)
endif()

if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-strict-prototypes")
endif()
