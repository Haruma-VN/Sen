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


set_target_properties(json PROPERTIES LINKER_LANGUAGE CXX)