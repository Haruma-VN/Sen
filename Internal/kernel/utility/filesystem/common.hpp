#pragma once

#include <fstream>
#include <string>
#include <string.h>
#include <iostream>
#include <filesystem>
#include "../../kernel/utility/string/common.hpp"
#include "../../kernel/utility/path/common.hpp"

namespace Sen::Internal::Kernel::Utility::FileSystem
{

	using Void = void;

	using WString = std::wstring;

	using String = std::string;

	using InFile = std::ifstream;

	using OutFile = std::ofstream;

	using std::getline;

	using ios = std::ios;

	typedef size_t Size;

	typedef void* VoidPtr;

	typedef char* CharPtr;

	namespace fs = std::filesystem;

	inline auto write_file(
		WString filepath, 
		String data
	) -> Void 
	{
		OutFile file(filepath, ios::out);
		file << data;
		file.close();
		return;
	}

	inline auto write_file(
		String filepath, 
		String data
	) -> Void
	{
		OutFile file(filepath, ios::out);
		file << data;
		file.close();
		return;
	}

	inline auto read_file(
		WString filepath
	) -> String 
	{
		InFile file(filepath, ios::in);
		String line;
		String data;
		while(getline(file, line)){
			data += line;
		}
		file.close();
		return data;
	}

	inline auto read_file(
		String filepath
	) -> String
	{
		InFile file(filepath, ios::in);
		String line;
		String data;
		while (getline(file, line)) {
			data += line;
		}
		file.close();
		return data;
	}

	/// <summary>
	/// Create directory, if existed, will raise an exception
	/// </summary>
	/// <param name="directory_path">Pass directory path</param>
	/// <returns>Created directory</returns>

	inline auto create_directory(
		WString directory_path
	) -> Void 
	{
		fs::create_directory(directory_path);
		return;
	}

	inline auto create_directory(
		String directory_path
	) -> Void
	{
		fs::create_directory(directory_path);
		return;
	}

	/// <summary>
	/// Create directories, if existed, will not raise exception
	/// </summary>
	/// <param name="directory_path"></param>
	/// <returns>Created many directories</returns>

	inline auto create_directories(
		WString directory_path
	) -> Void
	{
		fs::create_directories(directory_path);
		return;
	}

	inline auto create_directories(
		String directory_path
	) -> Void
	{
		fs::create_directories(directory_path);
		return;
	}
	
	inline auto out_file(
		WString &filepath, 
		String data
	) -> Void
	{
		auto new_path = Sen::Internal::Kernel::Utility::Path::resolve(filepath);
		auto constexpr delimeter = "/";
		auto constexpr backslashs = "\\";
		Sen::Internal::Kernel::Utility::String::replace(new_path, backslashs, delimeter);
		auto list = Sen::Internal::Kernel::Utility::String::split(new_path, delimeter);
		list.pop_back();
		Sen::Internal::Kernel::Utility::FileSystem::create_directories(
			Sen::Internal::Kernel::Utility::String::join(list, delimeter)
		);
		Sen::Internal::Kernel::Utility::FileSystem::write_file(new_path, data);
		return;
	}

	inline auto out_file(
		String& filepath,
		String data
	) -> Void
	{
		auto new_path = Sen::Internal::Kernel::Utility::Path::resolve(filepath);
		auto constexpr delimeter = "/";
		auto constexpr backslashs = "\\";
		Sen::Internal::Kernel::Utility::String::replace(new_path, backslashs, delimeter);
		auto list = Sen::Internal::Kernel::Utility::String::split(new_path, delimeter);
		list.pop_back();
		Sen::Internal::Kernel::Utility::FileSystem::create_directories(
			Sen::Internal::Kernel::Utility::String::join(list, delimeter)
		);
		Sen::Internal::Kernel::Utility::FileSystem::write_file(new_path, data);
		return;
	}

	inline auto read_buffer(
		const std::string& filename
	) -> std::vector<unsigned char> {
		InFile file(filename, std::ios::binary | std::ios::ate);
		auto size = file.tellg();
		file.seekg(0, std::ios::beg);
		std::vector<unsigned char> buffer(size);
		return buffer;
	}

	template <typename T>
	inline auto write_file(
		const CharPtr filename, 
		const std::vector<T>& buffer
	) -> Void {
		if (std::FILE* f = std::fopen(filename, "wb")) {
			std::fwrite(buffer.data(), sizeof(T), buffer.size(), f);
			std::fclose(f);
		}
		return;
	}

	template <typename T>
	inline auto out_file(
		const CharPtr filepath,
		const std::vector<T>& buffer
	) -> Void
	{
		auto new_path = Sen::Internal::Kernel::Utility::Path::resolve(filepath);
		auto constexpr delimeter = "/";
		auto constexpr backslashs = "\\";
		Sen::Internal::Kernel::Utility::String::replace(new_path, backslashs, delimeter);
		auto list = Sen::Internal::Kernel::Utility::String::split(new_path, delimeter);
		list.pop_back();
		Sen::Internal::Kernel::Utility::FileSystem::create_directories(
			Sen::Internal::Kernel::Utility::String::join(list, delimeter)
		);
		Sen::Internal::Kernel::Utility::FileSystem::write_file<T>(new_path, buffer);
		return;
	}
 
}