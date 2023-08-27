project(
	tinyxml2
	VERSION 9.0.0
	HOMEPAGE_URL https://github.com/leethomason/tinyxml2
	LANGUAGES CXX C
)

add_library(
	${PROJECT_NAME} STATIC
	./tinyxml2.h
	./tinyxml2.cpp
)

set_target_properties(${PROJECT_NAME} PROPERTIES POSITION_INDEPENDENT_CODE ON)

