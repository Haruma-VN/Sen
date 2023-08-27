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
		auto arr = new T[vec.size()];
		for (auto i = 0; i < vec.size(); ++i) {
			arr[i] = vec.at(i);
		}
		return arr;
	}


	inline auto byte_list_to_unsigned_char_list(
		std::vector<std::uint8_t> &vec
	) -> std::vector<unsigned char> {
		auto result = std::vector<unsigned char>();
		for (auto &b : vec) {
			result.push_back(b);
		}
		return result;
	}


	inline auto cast_uint8_vector_to_uint16(
		const std::vector<uint8_t>& data
	) -> std::vector<uint16_t> {
		auto result = std::vector<uint16_t>(data.size() / 2);
		for (auto i = 0; i < result.size(); ++i) {
			result[i] = static_cast<uint16_t>(data[2 * static_cast<std::vector<uint8_t, std::allocator<uint8_t>>::size_type>(i)]) | (static_cast<uint16_t>(data[2 * static_cast<std::vector<uint8_t, std::allocator<uint8_t>>::size_type>(i) + 1]) << 8);
		}
		return result;
	}

	template<typename T>
	inline auto cast_uint8_vector_to_uint(
		const std::vector<uint8_t>& data
	) -> std::vector<T> {
		auto result = std::vector<T>(data.size() / sizeof(T));
		for (auto i = 0; i < result.size(); ++i) {
			auto value = 0;
			for (auto j = 0; j < sizeof(T); ++j) {
				value |= static_cast<T>(data[i * sizeof(T) + j]) << (8 * j);
			}
			result[i] = value;
		}
		return result;
	}

}
