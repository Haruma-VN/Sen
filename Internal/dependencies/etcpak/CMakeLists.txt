project(
	etcpak
	VERSION 1.0.0
	HOMEPAGE_URL https://github.com/wolfpld/etcpak
	LANGUAGES C CXX
)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


add_library(
	${PROJECT_NAME} STATIC
	./lz4/lz4.h
	./lz4/lz4.c
	./getopt/getopt.h
	./getopt/getopt.c
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

target_include_directories(
	${PROJECT_NAME} PUBLIC
	../zlib
)

target_include_directories(
	${PROJECT_NAME} PUBLIC
	../libpng
)

target_link_libraries(
	${PROJECT_NAME} PRIVATE
	zlib
)

target_link_libraries(
	${PROJECT_NAME} PRIVATE
	libpng
)

set_target_properties(etcpak PROPERTIES POSITION_INDEPENDENT_CODE ON)
