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

target_include_directories(
	${PROJECT_NAME} PRIVATE
	../zlib
)

target_include_directories(
    ${PROJECT_NAME} PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(
	${PROJECT_NAME} PRIVATE
	zlib
)

# Set Kind

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_compile_definitions(_HAS_AUTO_PTR_ETC=1)

set_target_properties(${PROJECT_NAME} PROPERTIES POSITION_INDEPENDENT_CODE ON)

# UTF8 Support
if(MSVC)
  add_compile_options(/utf-8)
  add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
  add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")
else()
  add_compile_options(-finput-charset=UTF-8)
endif()

# LLVM clang
if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(${PROJECT_NAME} PRIVATE -Wno-deprecated-declarations)
endif()
