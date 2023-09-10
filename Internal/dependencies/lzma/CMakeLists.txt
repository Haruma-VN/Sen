project(
	lzma
	VERSION 23.01
	HOMEPAGE_URL https://github.com/mcmilk/7-Zip-zstd
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} STATIC
	./7zTypes.h
	./7zWindows.h
	./Alloc.h
	./Compiler.h
	./CpuArch.h
	./LzFind.h
	./LzFindMt.h
	./LzHash.h
	./LzmaDec.h
	./LzmaEnc.h
	./LzmaLib.h
	./Precomp.h
	./Threads.h
	./Alloc.c
	./CpuArch.c
	./LzFind.c
	./LzFindMt.c
	./LzFindOpt.c
	./LzmaDec.c
	./LzmaEnc.c
	./LzmaLib.c
	./Threads.c
)

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(lzma PROPERTIES POSITION_INDEPENDENT_CODE ON)
