project(
	RectangleBinPack
	VERSION 1.0
	HOMEPAGE_URL https://github.com/juj/RectangleBinPack
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./Rect.h
	./Rect.cpp
    ./GuillotineBinPack.h
    ./GuillotineBinPack.cpp
    ./MaxRectsBinPack.h
    ./MaxRectsBinPack.cpp
    ./ShelfBinPack.h
    ./ShelfBinPack.cpp
    ./ShelfNextFitBinPack.h
    ./ShelfNextFitBinPack.cpp
    ./SkylineBinPack.h
    ./SkylineBinPack.cpp
)

# Set Kind

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
target_compile_features(${PROJECT_NAME} PUBLIC cxx_std_11)

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(${PROJECT_NAME} PROPERTIES POSITION_INDEPENDENT_CODE ON)
