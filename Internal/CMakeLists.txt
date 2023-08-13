# CMakeList.txt : CMake project for Internal, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.8)

project(Sen.Internal)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

# Add dependencies
add_subdirectory("./dependencies/zlib")
add_subdirectory("./dependencies/ETCPACK")
add_subdirectory("./dependencies/rg_etc1")
add_subdirectory("./dependencies/libpng")

# Add source to this project's shared library.
add_library(
  Sen.Internal SHARED 
  "./dependencies/avir/avir.h"
  "./dependencies/nlohmann/json.hpp"
  "./dependencies/nlohmann/json_fwd.hpp"
  "./Internal.h"
  "./Internal.cpp"
)


# Link against dependencies
target_link_libraries(Sen.Internal PRIVATE zlib ETCPACK rg_etc1)

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET Sen.Internal PROPERTY CXX_STANDARD 20)
endif()

# TODO: Add tests and install targets if needed.
