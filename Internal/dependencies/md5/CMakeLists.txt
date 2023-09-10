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

set_target_properties(md5 PROPERTIES POSITION_INDEPENDENT_CODE ON)
