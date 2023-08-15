# CMakeList.txt : CMake project for Internal, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.8)

project(Internal)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()


# Add source to this project's shared library.
add_library(
  Internal SHARED 
  "./dependencies/avir/avir.h"
  "./dependencies/nlohmann/json.hpp"
  "./dependencies/nlohmann/json_fwd.hpp"
  "./tool/encode/encode.hpp"
  "./Internal.h"
  "./Internal.cpp"
)

# Add dependencies
add_subdirectory("./dependencies/zlib")
add_subdirectory("./dependencies/ETCPACK")
add_subdirectory("./dependencies/rg_etc1")
add_subdirectory("./dependencies/libpng")
add_subdirectory("./dependencies/etcpak")


# Link against dependencies
target_link_libraries(Internal PUBLIC 
zlib ETCPACK rg_etc1 libpng etcpak)

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET Internal PROPERTY CXX_STANDARD 20)
endif()

