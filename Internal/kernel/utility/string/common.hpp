#pragma once

#include <iostream>
#include <string>
#include <string.h>
#include <vector>

namespace Sen::Internal::Kernel::Utility::String
{

	using Boolean = bool;
	
	inline auto replace(
		std::string& str, 
		const std::string& from, 
		const std::string& to
	) -> Boolean 
	{
		auto start_pos = str.find(from);
		if(start_pos == std::string::npos)
			return false;
		str.replace(start_pos, from.length(), to);
		return true;
	}

	inline auto replace(
		std::wstring& str, 
		const std::wstring& from, 
		const std::wstring& to
	) -> Boolean
	{
		auto start_pos = str.find(from);
		if (start_pos == std::string::npos)
			return false;
		str.replace(start_pos, from.length(), to);
		return true;
	}

	 inline auto split(
		 const std::string& str,
		 const std::string& delimiter
	 ) -> std::vector<std::string> 
	 {
		auto result = std::vector<std::string>();
		auto start = 0;
		auto end = str.find(delimiter);
		while (end != std::string::npos) {
			result.push_back(str.substr(start, end - start));
			start = end + delimiter.length();
			end = str.find(delimiter, start);
		}
		result.push_back(str.substr(start));
		return result;
	}

	 inline auto split(
		 const std::wstring& str,
		 const std::wstring& delimiter
	 ) -> std::vector<std::wstring> 
	 {
		 auto result = std::vector<std::wstring>();
		 auto start = 0;
		 auto end = str.find(delimiter);
		 while (end != std::string::npos) {
			 result.push_back(str.substr(start, end - start));
			 start = end + delimiter.length();
			 end = str.find(delimiter, start);
		 }
		 result.push_back(str.substr(start));
		 return result;
	 }

	 inline auto join(
		 const std::vector<std::string>& list, 
		 const std::string& delimimer
	 ) -> std::string
	 {
		 auto str = (std::string) "";
		 for (auto &c: list) {
			 str += c;
		 }
		 return str;
	 }

	 inline auto join(
		 const std::vector<std::wstring>& list,
		 const std::wstring& delimimer
	 ) -> std::wstring
	 {
		 std::wstring str = L"";
		 for (auto& c : list) {
			 str += c;
		 }
		 return str;
	 }
}