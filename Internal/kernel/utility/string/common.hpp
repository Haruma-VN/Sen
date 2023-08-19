#pragma once

#include <iostream>
#include <string>
#include <string.h>
#include <vector>

namespace Sen::Internal::Kernel::Utility::String
{

	using Boolean = bool;

	using std::vector;

	using std::string;

	using std::wstring;
	
	inline auto replace(
		string& str, 
		const string& from, 
		const string& to
	) -> Boolean 
	{
		auto start_pos = str.find(from);
		if (start_pos == string::npos)
		{
			return false;
		}
		str.replace(start_pos, from.length(), to);
		return true;
	}

	inline auto replace(
		wstring& str, 
		const wstring& from, 
		const wstring& to
	) -> Boolean
	{
		auto start_pos = str.find(from);
		if (start_pos == string::npos)
		{
			return false;
		}
		str.replace(start_pos, from.length(), to);
		return true;
	}

	 inline auto split(
		 const string& str,
		 const string& delimiter
	 ) -> vector<string> 
	 {
		auto result = vector<string>();
		auto start = 0;
		auto end = str.find(delimiter);
		while (end != string::npos) {
			result.push_back(str.substr(start, end - start));
			start = end + delimiter.length();
			end = str.find(delimiter, start);
		}
		result.push_back(str.substr(start));
		return result;
	}

	 inline auto split(
		 const wstring& str,
		 const wstring& delimiter
	 ) -> vector<wstring> 
	 {
		 auto result = vector<wstring>();
		 auto start = 0;
		 auto end = str.find(delimiter);
		 while (end != string::npos) {
			 result.push_back(str.substr(start, end - start));
			 start = end + delimiter.length();
			 end = str.find(delimiter, start);
		 }
		 result.push_back(str.substr(start));
		 return result;
	 }

	 inline auto join(
		 const vector<string>& list, 
		 const string& delimimer
	 ) -> string
	 {
		 auto str = (string) "";
		 for (auto &c: list) {
			 str += c;
		 }
		 return str;
	 }

	 inline auto join(
		 const vector<wstring>& list,
		 const wstring& delimimer
	 ) -> std::wstring
	 {
		 wstring str = L"";
		 for (auto& c : list) {
			 str += c;
		 }
		 return str;
	 }
}