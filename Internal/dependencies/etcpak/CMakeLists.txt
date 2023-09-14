project(
	etcpak
	VERSION 1.0.0
	HOMEPAGE_URL https://github.com/wolfpld/etcpak
)


add_library(
	${PROJECT_NAME} STATIC
	./lz4/lz4.h
	./getopt/getopt.h
	./Bitmap.hpp
	./BitmapDownsampled.hpp
	./BlockData.hpp
	./ColorSpace.hpp
	./DataProvider.hpp
	./Debug.hpp
	./Dither.hpp
	./Error.hpp
	./ForceInline.hpp
	./Math.hpp
	./MipMap.hpp
	./mmap.hpp
	./ProcessCommon.hpp
	./ProcessDxtc.hpp
	./ProcessRGB.hpp
	./Semaphore.hpp
	./System.hpp
	./Tables.hpp
	./TaskDispatch.hpp
	./Timing.hpp
	./Vector.hpp
	./lz4/lz4.c
	./getopt/getopt.c
	./Bitmap.cpp
	./BitmapDownsampled.cpp
	./BlockData.cpp
	./ColorSpace.cpp
	./DataProvider.cpp
	./Debug.cpp
	./Dither.cpp
	./Error.cpp
	./mmap.cpp
	./ProcessDxtc.cpp
	./ProcessRGB.cpp
	./System.cpp
	./Tables.cpp
	./TaskDispatch.cpp
	./Timing.cpp
	./Application.cpp
)

target_include_directories(${PROJECT_NAME} PUBLIC ..)


target_include_directories(
	${PROJECT_NAME} PRIVATE
	../libpng
)

target_link_libraries(
	${PROJECT_NAME} PRIVATE
	libpng
)

if(CMAKE_SYSTEM_NAME STREQUAL "Windows" AND CMAKE_SIZEOF_VOID_P EQUAL 4)
    add_definitions(-DNOMINMAX)
endif()

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()


set_target_properties(${PROJECT_NAME} PROPERTIES POSITION_INDEPENDENT_CODE ON)
