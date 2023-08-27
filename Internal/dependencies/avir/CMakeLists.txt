project(
	avir
	VERSION 3.0
	HOMEPAGE_URL https://github.com/avaneev/avir
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} INTERFACE
	./avir.h
	./avir_dil.h
	./avir_float4_sse.h
	./avir_float8_avx.h
	./lancir.h
)

set_target_properties(avir PROPERTIES LINKER_LANGUAGE C)
