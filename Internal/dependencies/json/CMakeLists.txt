project(
	json
	VERSION 3.11.2
	HOMEPAGE_URL https://github.com/nlohmann/json
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} INTERFACE
	./json_fwd.hpp
	./json.hpp
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

set_target_properties(${PROJECT_NAME} PROPERTIES LINKER_LANGUAGE CXX)