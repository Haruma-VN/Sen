project(
	Rijndael
	LANGUAGES C CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./Rijndael.h
	./Rijndael.cpp
)


# Set Kind

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
target_compile_features(${PROJECT_NAME} PUBLIC cxx_std_20)

# Disable Narrowing

if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-narrowing")
endif()

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()


set_target_properties(Rijndael PROPERTIES POSITION_INDEPENDENT_CODE ON)
