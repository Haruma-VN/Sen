project(
	bzip2
	VERSION 1.0.8
	HOMEPAGE_URL https://sourceware.org/bzip2
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} STATIC
	./bzlib.h
	./bzlib_private.h
	./blocksort.c
	./huffman.c
	./crctable.c
	./randtable.c
	./compress.c
	./decompress.c
	./bzlib.c
	./bzip2.c
	./bzip2recover.c
	
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
