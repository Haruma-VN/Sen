# Adapted third from TwinStar ToolKit Source

project(
	md5
	VERSION 1.0
	HOMEPAGE_URL https://github.com/JieweiWei/md5
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./md5.h
	./md5.cpp
)

# Set Kind

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
target_compile_features(${PROJECT_NAME} PUBLIC cxx_std_20)

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(md5 PROPERTIES POSITION_INDEPENDENT_CODE ON)
