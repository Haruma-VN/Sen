project(
	rg_etc1
	VERSION 0 # none
	HOMEPAGE_URL https://github.com/richgel999/rg-etc1
	LANGUAGES C CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./rg_etc1.h
	./rg_etc1.cpp
)

set_target_properties(rg_etc1 PROPERTIES POSITION_INDEPENDENT_CODE ON)
