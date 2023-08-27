#pragma once

#include <vector>
#include <array>
#include <iostream>
#include <cstdint>

namespace Sen::Internal::Kernel::Utility::Array 
{

	// For API Call, cannot use Vector
	// Array must be provide and returns must be vector

	template <typename T>
	inline auto convert_array_to_vector(
		T* &arr,
		size_t &size
	) -> std::vector<T> {
		auto vec = std::vector<T>();
		for (auto i = 0; i < size; ++i)
		{
			vec.push_back(arr[i]);
		}
		return vec;
	}


	template <typename T>
	inline auto convert_vector_to_array(
		std::vector<T> &vec
	) -> T*
	{
		T* arr = new T[vec.size()];
		for (auto i = 0; i < vec.size(); ++i) {
			arr[i] = vec.at(i);
		}
		return arr;
	}


	inline auto byte_list_to_unsigned_char_list(
		std::vector<std::uint8_t> &vec
	) -> std::vector<unsigned char> {
		std::vector<unsigned char> result;
		for (auto &b : vec) {
			result.push_back(b);
		}
		return result;
	}


	inline auto cast_uint8_vector_to_uint16(
		const std::vector<uint8_t>& data
	) -> std::vector<uint16_t> {
		std::vector<uint16_t> result(data.size() / 2);
		for (size_t i = 0; i < result.size(); ++i) {
			result[i] = static_cast<uint16_t>(data[2 * i]) | (static_cast<uint16_t>(data[2 * i + 1]) << 8);
		}
		return result;
	}

	template<typename T>
	inline auto cast_uint8_vector_to_uint(
		const std::vector<uint8_t>& data
	) -> std::vector<T> {
		std::vector<T> result(data.size() / sizeof(T));
		for (size_t i = 0; i < result.size(); ++i) {
			T value = 0;
			for (size_t j = 0; j < sizeof(T); ++j) {
				value |= static_cast<T>(data[i * sizeof(T) + j]) << (8 * j);
			}
			result[i] = value;
		}
		return result;
	}

}
