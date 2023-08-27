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
# Set Kind

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set_target_properties(tinyxml2 PROPERTIES POSITION_INDEPENDENT_CODE ON)

