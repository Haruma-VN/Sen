cmake_minimum_required(VERSION 3.8)

project(
	brotli 
	HOMEPAGE_URL https://github.com/google/brotli/tree/master
	VERSION 1.0 
	LANGUAGES C
)

set(
	brotli_sources
    ./common/constants.h
    ./common/context.h
    ./common/dictionary.h
    ./common/platform.h
    ./common/transform.h
    ./dec/bit_reader.h
    ./dec/huffman.h
    ./dec/state.h
    ./enc/backward_references.h
    ./enc/backward_references_hq.h
    ./enc/bit_cost.h
    ./enc/block_splitter.h
    ./enc/brotli_bit_stream.h
    ./enc/cluster.h
    ./enc/command.h
    ./enc/compress_fragment.h
    ./enc/compress_fragment_two_pass.h
    ./enc/dictionary_hash.h
    ./enc/encoder_dict.h
    ./enc/entropy_encode.h
    ./enc/fast_log.h
    ./enc/histogram.h
    ./enc/literal_cost.h
    ./enc/memory.h
    ./enc/metablock.h
    ./enc/static_dict.h
    ./enc/utf8_util.h
    ./common/constants.c
    ./common/context.c
    ./common/dictionary.c
    ./common/platform.c
    ./common/transform.c
    ./dec/bit_reader.c
    ./dec/decode.c
    ./dec/huffman.c
    ./dec/state.c
    ./enc/backward_references.c
    ./enc/backward_references_hq.c
    ./enc/bit_cost.c
    ./enc/block_splitter.c
    ./enc/brotli_bit_stream.c
    ./enc/cluster.c
    ./enc/command.c
    ./enc/compress_fragment.c
    ./enc/compress_fragment_two_pass.c
    ./enc/dictionary_hash.c
    ./enc/encode.c
    ./enc/encoder_dict.c
    ./enc/entropy_encode.c
    ./enc/fast_log.c
    ./enc/histogram.c
    ./enc/literal_cost.c
    ./enc/memory.c
    ./enc/metablock.c
    ./enc/static_dict.c
    ./enc/utf8_util.c
)

add_library(brotli STATIC ${brotli_sources})

target_include_directories(brotli PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)

if(${CMAKE_SYSTEM_NAME} MATCHES "Linux")
  target_compile_definitions(brotli PRIVATE OS_LINUX)
elseif(${CMAKE_SYSTEM_NAME} MATCHES "FreeBSD")
  target_compile_definitions(brotli PRIVATE OS_FREEBSD)
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
  target_compile_definitions(brotli PRIVATE OS_MACOSX)
endif()

target_link_libraries(brotli PRIVATE)

set_target_properties(brotli PROPERTIES POSITION_INDEPENDENT_CODE ON)
