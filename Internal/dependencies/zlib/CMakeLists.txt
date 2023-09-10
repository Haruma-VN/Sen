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

if(UNIX OR APPLE OR ANDROID)
    add_definitions(
		-DZ_HAVE_UNISTD_H 
		-D_LARGEFILE64_SOURCE=1
	)
endif()

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(zlib PROPERTIES POSITION_INDEPENDENT_CODE ON)
