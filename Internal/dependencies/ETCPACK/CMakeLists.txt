project(
	ETCPACK
	VERSION 2.74
	HOMEPAGE_URL https://github.com/Ericsson/ETCPACK
	LANGUAGES CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./image.h
	./etcdec.cxx
	./etcpack.cxx
	./image.cxx
)
