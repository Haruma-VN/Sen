project(
	ETCPACK
	VERSION 2.74
	HOMEPAGE_URL https://github.com/Ericsson/ETCPACK
	LANGUAGES C CXX
)

# Set Kind

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


add_library(
	${PROJECT_NAME} STATIC
	./image.h
	./etcdec.cxx
	./etcpack.cxx
	./image.cxx
)

target_link_libraries(
	${PROJECT_NAME} PRIVATE
	zlib
)

set_target_properties(ETCPACK PROPERTIES POSITION_INDEPENDENT_CODE ON)

