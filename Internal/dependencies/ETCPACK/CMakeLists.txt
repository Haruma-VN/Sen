project(
	ETCPACK
	VERSION 2.74
	HOMEPAGE_URL https://github.com/Ericsson/ETCPACK
	LANGUAGES C CXX
)

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

