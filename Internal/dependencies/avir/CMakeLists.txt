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

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(avir PROPERTIES LINKER_LANGUAGE C)
