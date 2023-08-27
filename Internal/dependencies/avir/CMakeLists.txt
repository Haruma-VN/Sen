project(
	avir
	VERSION 3.0
	HOMEPAGE_URL https://github.com/avaneev/avir
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} STATIC
	./avir.h
	./avir_dil.h
	./avir_float4_sse.h
	./avir_float8_avx.h
	./lancir.h
)

set_target_properties(${PROJECT_NAME} PROPERTIES LINKER_LANGUAGE C)

