#!/bin/sh
cd ./
mkdir ./build
cd ./build

if [ "$(uname)" = "Linux" ]; then
    cmake -DCMAKE_BUILD_TYPE=Release ..
elif [ "$(uname)" = "Darwin" ]; then
    cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=/usr/bin/clang-16 -DCMAKE_CXX_COMPILER=/usr/bin/clang++-16 ..
fi

make
