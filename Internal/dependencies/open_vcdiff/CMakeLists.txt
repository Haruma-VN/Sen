project(
	open_vcdiff
	VERSION 0.8.4
	HOMEPAGE_URL https://github.com/google/open-vcdiff
	LANGUAGES C CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./google/format_extension_flags.h
	./google/output_string.h
	./addrcache.h
	./blockhash.h
	./checksum.h
	./codetable.h
	./codetablewriter_interface.h
	./compile_assert.h
	./config.h
	./decodetable.h
	./encodetable.h
	./headerparser.h
	./instruction_map.h
	./jsonwriter.h
	./logging.h
	./rolling_hash.h
	./unique_ptr.h
	./varint_bigendian.h
	./vcdiff_defs.h
	./vcdiffengine.h
	./addrcache.cc
	./blockhash.cc
	./codetable.cc
	./decodetable.cc
	./encodetable.cc
	./headerparser.cc
	./instruction_map.cc
	./jsonwriter.cc
	./logging.cc
	./varint_bigendian.cc
	./vcdecoder.cc
	./vcdiffengine.cc
	./vcencoder.cc
	
)

# Set Kind

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

target_include_directories(
	${PROJECT_NAME} PUBLIC
	../zlib
)

target_include_directories(
    ${PROJECT_NAME} PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(
	${PROJECT_NAME} PUBLIC
	zlib
)

# Set Kind

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set_target_properties(open_vcdiff PROPERTIES POSITION_INDEPENDENT_CODE ON)
