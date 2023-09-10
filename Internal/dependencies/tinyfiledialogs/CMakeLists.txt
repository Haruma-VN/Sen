project(
	tinyfiledialogs
	VERSION 3.13.3
	HOMEPAGE_URL https://sourceforge.net/projects/tinyfiledialogs/
	LANGUAGES C
)

add_library(
	${PROJECT_NAME} STATIC
	./tinyfiledialogs.h
	./tinyfiledialogs.c
)

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(tinyfiledialogs PROPERTIES POSITION_INDEPENDENT_CODE ON)
