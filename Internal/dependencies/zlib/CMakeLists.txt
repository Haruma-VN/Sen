project(
	zlib
	VERSION 1.2.13
	HOMEPAGE_URL https://www.zlib.net/
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} STATIC
	./zconf.h
	./zlib.h
	./crc32.h
	./deflate.h
	./gzguts.h
	./inffast.h
	./inffixed.h
	./inflate.h
	./inftrees.h
	./trees.h
	./zutil.h
	./adler32.c
	./compress.c
	./crc32.c
	./deflate.c
	./gzclose.c
	./gzlib.c
	./gzread.c
	./gzwrite.c
	./inflate.c
	./infback.c
	./inftrees.c
	./inffast.c
	./trees.c
	./uncompr.c
	./zutil.c
)

set_target_properties(zlib PROPERTIES POSITION_INDEPENDENT_CODE ON)
