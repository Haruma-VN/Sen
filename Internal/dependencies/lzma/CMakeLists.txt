project(
	lzma
	HOMEPAGE_URL https://sourceware.org/bzip2
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

set_target_properties(lzma PROPERTIES POSITION_INDEPENDENT_CODE ON)
