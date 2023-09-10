project(
	Rijndael
	LANGUAGES C CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./Rijndael.h
	./Rijndael.cpp
)

set_target_properties(Rijndael PROPERTIES POSITION_INDEPENDENT_CODE ON)
