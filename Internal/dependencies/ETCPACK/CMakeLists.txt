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

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(${PROJECT_NAME} PROPERTIES POSITION_INDEPENDENT_CODE ON)

