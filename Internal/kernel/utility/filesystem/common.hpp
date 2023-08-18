#pragma once

#include <fstream>
#include <string>
#include <string.h>
#include <iostream>
#include <filesystem>
#include "../../kernel/utility/string/common.hpp"

namespace Sen::Internal::Utility::FileSystem 
{

	using Void = void;

	using WString = std::wstring;

	using String = std::string;

	using InFile = std::ifstream;

	using OutFile = std::ofstream;

	using std::getline;

	using ios = std::ios;

	inline auto write_file(WString filepath, String data) -> Void 
	{
		OutFile file(filepath, ios::out);
		file << data;
		file.close();
		return;
	}

	inline auto write_file(String filepath, String data) -> Void
	{
		OutFile file(filepath, ios::out);
		file << data;
		file.close();
		return;
	}

	inline auto read_file(WString filepath) -> String 
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

	inline auto read_file(String filepath) -> String
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

	inline auto create_directory(WString directory_path) -> Void 
	{
		std::filesystem::create_directory(directory_path);
		return;
	}

	inline auto create_directory(String directory_path) -> Void
	{
		std::filesystem::create_directory(directory_path);
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
		std::filesystem::create_directories(directory_path);
		return;
	}

	inline auto create_directories(
		String directory_path
	) -> Void
	{
		std::filesystem::create_directories(directory_path);
		return;
	}
	
	inline auto out_file(
		WString &filepath, 
		String data
	) -> Void
	{
		auto new_path = Sen::Internal::Utility::Path::resolve(filepath);
		auto constexpr delimeter = "/";
		auto constexpr backslashs = "\\";
		Sen::Internal::Utility::String::replace(new_path, backslashs, delimeter);
		auto list = Sen::Internal::Utility::String::split(new_path, delimeter);
		list.pop_back();
		Sen::Internal::Utility::FileSystem::create_directories(
			Sen::Internal::Utility::String::join(list, delimeter)
		);
		Sen::Internal::Utility::FileSystem::write_file(new_path, data);
		return;
	}

	inline auto out_file(
		String& filepath,
		String data
	) -> Void
	{
		auto new_path = Sen::Internal::Utility::Path::resolve(filepath);
		auto constexpr delimeter = "/";
		auto constexpr backslashs = "\\";
		Sen::Internal::Utility::String::replace(new_path, backslashs, delimeter);
		auto list = Sen::Internal::Utility::String::split(new_path, delimeter);
		list.pop_back();
		Sen::Internal::Utility::FileSystem::create_directories(
			Sen::Internal::Utility::String::join(list, delimeter)
		);
		Sen::Internal::Utility::FileSystem::write_file(new_path, data);
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
 
}