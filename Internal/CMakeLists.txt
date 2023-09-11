# Require CMake version

cmake_minimum_required (VERSION 3.10)

# Project Name

project(
  Internal
  VERSION 7
  HOMEPAGE_URL https://github.com/Haruma-VN/Sen
  LANGUAGES C CXX
)

# Disable Warning Log
add_definitions(-w)

# MSVC Compiler

if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()


# UTF8 Support

if(MSVC)
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} /utf-8")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /utf-8")
endif()

if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()


# Add library

add_library(
  ${PROJECT_NAME} SHARED
  ./kernel/utility/string/common.hpp
  ./kernel/utility/array/common.hpp
  ./kernel/utility/path/common.hpp
  ./kernel/utility/filesystem/common.hpp
  ./kernel/utility/exception/common.hpp
  ./kernel/tool/diff/vcdiff.hpp
  ./kernel/tool/compress/bzip2.hpp
  ./kernel/tool/compress/lzma.hpp
  ./kernel/utility/utility.hpp
  ./Internal.hpp
  ./Internal.cpp
)

# Add dependencies

add_subdirectory("./dependencies/md5")
add_subdirectory("./dependencies/avir")
add_subdirectory("./dependencies/json")
add_subdirectory("./dependencies/tinyxml2")
add_subdirectory("./dependencies/zlib")
add_subdirectory("./dependencies/ETCPACK")
add_subdirectory("./dependencies/rg_etc1")
add_subdirectory("./dependencies/libpng")
add_subdirectory("./dependencies/lzma")
add_subdirectory("./dependencies/bzip2")
add_subdirectory("./dependencies/etcpak")
add_subdirectory("./dependencies/open_vcdiff")
add_subdirectory("./dependencies/Rijndael")
add_subdirectory("./dependencies/PVRTCCompressor")
add_subdirectory("./dependencies/brotli")
add_subdirectory("./dependencies/RectangleBinPack")


include_directories(${CMAKE_CURRENT_SOURCE_DIR}/dependencies)

# tinyfiledialogs link

if(NOT (CMAKE_SYSTEM_NAME MATCHES "iOS" OR CMAKE_SYSTEM_NAME MATCHES "Android"))
    add_subdirectory(./dependencies/tinyfiledialogs)
    target_link_libraries(${PROJECT_NAME} PRIVATE tinyfiledialogs)
endif()

# Link against dependencies

target_link_libraries(
  ${PROJECT_NAME} PRIVATE 
  md5
  avir
  json
  tinyxml2
  zlib 
  ETCPACK 
  rg_etc1 
  libpng 
  lzma
  bzip2
  etcpak
  open_vcdiff
  Rijndael
  PVRTCCompressor
  brotli
  RectangleBinPack
)

if(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    set(CMAKE_C_STANDARD 99)
    set(CMAKE_C_EXTENSIONS ON)
else()
    set(CMAKE_C_STANDARD 17)
endif()



# Symbol visibility
set(CMAKE_C_VISIBILITY_PRESET hidden)
set(CMAKE_CXX_VISIBILITY_PRESET hidden)

# Pos Independent
set(CMAKE_POSITION_INDEPENDENT_CODE true)

# Compilation definition

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
    set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" OUTPUT_NAME "Internal")
endif()

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# CMake Strict

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET ${PROJECT_NAME} PROPERTY CXX_STANDARD 20)
endif()

if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-strict-prototypes")
endif()

if(MSVC)
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        /utf-8
        /bigobj
        /permissive-
        /Zc:preprocessor
    )
    target_compile_definitions(${PROJECT_NAME} PRIVATE
        _CRT_SECURE_NO_WARNINGS
        NOMINMAX
    )
endif()

if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        -fPIC
        -fvisibility=hidden
    )
endif()

if(MSVC)
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        /w
    )
endif()

if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        -w
        -Wno-c++11-narrowing
    )
endif()

if(MSVC)
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        /Wall
        /wd4820
        /wd4100
        /wd4189
        /wd4458
        /wd4514
        /wd4710
        /wd4711
        /wd4668
        /wd4061
        /wd5264
        /wd5045
        /wd4927
        /wd4065
        /wd4946
        /wd5262
    )
endif()

if(MSVC)
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /Z7")
    set(CMAKE_EXE_LINKER_FLAGS_RELEASE "${CMAKE_EXE_LINKER_FLAGS_RELEASE} /DEBUG:NONE")
    set(CMAKE_SHARED_LINKER_FLAGS_RELEASE "${CMAKE_SHARED_LINKER_FLAGS_RELEASE} /NOIMPLIB")
    set(CMAKE_MODULE_LINKER_FLAGS_RELEASE "${CMAKE_MODULE_LINKER_FLAGS_RELEASE} /NOIMPLIB")
endif()

if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(
      ${PROJECT_NAME} PRIVATE
        -Weverything
        -Wno-c++98-compat
        -Wno-c++98-compat-pedantic
        -Wno-pre-c++14-compat
        -Wno-pre-c++17-compat
        -Wno-c++20-compat
        -Wno-c99-extensions
        -Wno-padded
        -Wno-redundant-parens
        -Wno-missing-field-initializers
        -Wno-unused-parameter
        -Wno-unused-variable
        -Wno-missing-noreturn
        -Wno-gnu-zero-variadic-macro-arguments
        -Wno-ctad-maybe-unsupported
        -Wno-global-constructors
        -Wno-exit-time-destructors
        -Wno-weak-vtables
        -Wno-self-assign
        -Wno-switch-enum
        -Wno-shadow-field 
        -Wno-shadow-field-in-constructor 
        -Wno-shadow-uncaptured-local 
        -Wno-unsafe-buffer-usage 
        -Wno-float-equal 
        -Wno-gnu-line-marker 
)

endif()
