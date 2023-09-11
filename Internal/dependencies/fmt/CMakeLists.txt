project(
	fmt
	VERSION 10.0.0
	HOMEPAGE_URL https://github.com/fmtlib/fmt
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} INTERFACE
	./include/fmt/args.h
	./include/fmt/chrono.h
	./include/fmt/color.h
	./include/fmt/compile.h
	./include/fmt/core.h
	./include/fmt/format-inl.h
	./include/fmt/format.h
	./include/fmt/os.h
	./include/fmt/ostream.h
	./include/fmt/printf.h
	./include/fmt/ranges.h
	./include/fmt/std.h
	./include/fmt/xchar.h
)

# Definition

target_compile_definitions(${PROJECT_NAME} INTERFACE FMT_HEADER_ONLY)

target_include_directories(${PROJECT_NAME} INTERFACE "${CMAKE_CURRENT_SOURCE_DIR}/include") 

set_target_properties(fmt PROPERTIES LINKER_LANGUAGE CXX)
