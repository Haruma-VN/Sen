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

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

set_target_properties(tinyxml2 PROPERTIES POSITION_INDEPENDENT_CODE ON)

