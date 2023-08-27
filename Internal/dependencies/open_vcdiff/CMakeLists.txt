project(
	open_vcdiff
	VERSION 0.8.4
	HOMEPAGE_URL https://github.com/google/open-vcdiff
	LANGUAGES C
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

target_include_directories(
	${PROJECT_NAME} PUBLIC
	../zlib
)

target_link_libraries(
	${PROJECT_NAME} PUBLIC
	zlib
)

set_target_properties(open_vcdiff PROPERTIES POSITION_INDEPENDENT_CODE ON)
