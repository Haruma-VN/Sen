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

set_target_properties(tinyfiledialogs PROPERTIES POSITION_INDEPENDENT_CODE ON)
