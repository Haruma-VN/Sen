#pragma once
#include <filesystem>

namespace Sen::Internal::Utility::Path
{
	
	using std::string;

	namespace fs = std::filesystem;

	struct ParsedPath {
	public:
		string name;
		string name_without_extension;
		string extension;
		string parent_directory;
		string parent_directories;

		#pragma region Declaration

		ParsedPath()
		{

		}
		

		~ParsedPath()
		{

		}

		#pragma endregion
	};

	#pragma region path


	inline auto resolve(const std::string &path) -> std::string
	{
		return fs::canonical(path).generic_string();
	}

	inline auto resolve(const std::wstring& path) -> std::string
	{
		return fs::canonical(path).generic_string();
	}

	inline auto parent_directories(const std::string& path) -> std::string
	{
		fs::path p = {path};
		return p.parent_path().string();
	}

	inline auto parent_directories(const std::wstring& path) -> std::string
	{
		fs::path p = { path };
		return p.parent_path().string();
	}

	inline auto root_path(const std::string& path) -> std::string
	{
		return fs::current_path().root_path().string();
	}

	inline auto root_path(const std::wstring& path) -> std::string
	{
		return fs::current_path().root_path().string();
	}

	#pragma endregion
}