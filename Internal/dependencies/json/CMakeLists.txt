project(
	json
	VERSION 3.11.2
	HOMEPAGE_URL https://github.com/nlohmann/json
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./json_fwd.hpp
	./json.hpp
)

set_target_properties(${PROJECT_NAME} PROPERTIES LINKER_LANGUAGE CXX)