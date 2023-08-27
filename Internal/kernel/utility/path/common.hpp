#pragma once

#include <filesystem>
#include <cstdarg>
#include "../../kernel/utility/string/common.hpp"

namespace Sen::Internal::Kernel::Utility::Path
{
	
	using std::string;

	namespace fs = std::filesystem;

	namespace ss = Sen::Internal::Kernel::Utility::String;

	typedef size_t Size;

	struct ParsedPath {

	protected:
		#pragma region Area
		string _name;
		string _name_without_extension;
		string _extension;
		string _parent_directory;
		string _parent_directories;
		#pragma endregion
	public:
		#pragma region Constructor
		ParsedPath(
			string name, 
			string name_without_extension, 
			string extension,
			string parent_directory,
			string parent_directories
			)
		{
			this->_name = name;
			this->_name_without_extension = name_without_extension;
			this->_extension = extension;
			this->_parent_directory = parent_directory;
			this->_parent_directories = parent_directories;
		}

		auto name() -> std::string
		{
			return this->_name;
		}

		auto name_without_extension() -> std::string
		{
			return this->_name_without_extension;
		}

		auto extension() -> std::string
		{
			return this->_extension;
		}

		auto parent_directory() -> std::string
		{
			return this->_parent_directory;
		}

		auto parent_directories() -> std::string
		{
			return this->_parent_directories;
		}
		

		~ParsedPath()
		{

		}

		#pragma endregion
	};

	inline const std::string backslash = "\\";

	inline const std::string  slash = "/";

	#pragma region path


	inline auto resolve(
		const std::string &path
	) -> std::string
	{
		return fs::canonical(path).generic_string();
	}

	inline auto resolve(
		const std::wstring& path
	) -> std::string
	{
		return fs::canonical(path).generic_string();
	}

	inline auto parent_directories(
		const std::string& path
	) -> std::string
	{
		fs::path p = {path};
		return p.parent_path().string();
	}

	inline auto parent_directories(
		const std::wstring& path
	) -> std::string
	{
		fs::path p = { path };
		return p.parent_path().string();
	}

	inline auto root_path(
		const std::string& path
	) -> std::string
	{
		return fs::current_path().root_path().string();
	}

	inline auto root_path(
		const std::wstring& path
	) -> std::string
	{
		return fs::current_path().root_path().string();
	}

	inline auto parent_directory(
		const std::string& path
	) -> std::string
	{
		auto c = parent_directories(path);
		ss::replace(
			c,
			backslash,
			slash
		);
		return ss::split(c, slash).at(-2);
	}

	inline auto parent_directory(
		const std::wstring& path
	) -> std::string
	{
		auto c = parent_directories(path);
		ss::replace(
			c,
			backslash,
			slash
		);
		return ss::split(c, slash).at(-2);
	}

	inline auto filename(
		const std::wstring& path
	) -> std::string
	{
		return fs::path(path).filename().string();
	}

	inline auto filename(
		const std::string& path
	) -> std::string
	{
		return fs::path(path).filename().string();
	}

	inline auto extension(
		const std::wstring& path
	) -> std::string
	{
		return fs::path(path).extension().string();
	}

	inline auto extension(
		const std::string& path
	) -> std::string
	{
		return fs::path(path).extension().string();
	}

	inline auto file_name_only(
		const std::string& path
	) -> std::string
	{
		return fs::path(path).stem().string();
	}

	inline auto file_name_only(
		const std::wstring& path
	) -> std::string
	{
		return fs::path(path).stem().string();
	}

	inline auto parse(
		const std::string& path
	) -> Path::ParsedPath*
	{
		return new ParsedPath(
			filename(path),
			file_name_only(path),
			extension(path),
			parent_directory(path),
			parent_directories(path)
		);
	}

	inline auto parse(
		const std::wstring& path
	) -> Path::ParsedPath*
	{
		return new ParsedPath(
			filename(path),
			file_name_only(path),
			extension(path),
			parent_directory(path),
			parent_directories(path)
		);
	}

	inline auto join(
		const std::vector<std::string>& paths
	) -> std::string {
		std::string result;
		for (const auto& path : paths) {
			if (!result.empty() && result.back() != '/' && !path.empty() && path.front() != '/') {
				result += '/';
			}
			result += path;
		}
		return result;
	}

	inline auto get_seperator(

	) -> std::string
	{
	#if _WIN32
			return "\\";
	#else
			return "/";
	#endif
	}

}