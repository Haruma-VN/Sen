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

set_target_properties(bzip2 PROPERTIES POSITION_INDEPENDENT_CODE ON)
