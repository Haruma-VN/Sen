#include <vector>
#include <array>
#include <iostream>

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
		std::vector<byte> &vec
	) -> std::vector<unsigned char> {
		std::vector<unsigned char> result;
		for (auto &b : vec) {
			result.push_back(b);
		}
		return result;
	}

}
