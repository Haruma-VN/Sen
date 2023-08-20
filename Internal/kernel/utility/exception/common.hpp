#pragma once

#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <regex>

#if _WIN32
#include <windows.h>
#endif;

namespace Sen::Internal::Kernel::Utility::Exception {
    class ExceptionX : public std::runtime_error {
        std::string msg;
    public:
        ExceptionX(const std::string& arg, const char* file, int line) :
            std::runtime_error(arg) {
            std::ostringstream o;
            std::regex re(".*(?=kernel)");
            std::string output = std::regex_replace(file, re, "");
            #if _WIN32
                SetConsoleOutputCP(CP_UTF8);
                std::wcout.imbue(std::locale("en_US.utf8"));
                HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
                SetConsoleTextAttribute(hConsole, FOREGROUND_RED);
                std::wcout << L"● Internal Exception:" << std::endl;
                SetConsoleTextAttribute(hConsole, 15);
                std::cout << "      " << arg << std::endl;
                SetConsoleTextAttribute(hConsole, FOREGROUND_RED);
                std::wcout << L"● Internal Traceback:" << std::endl;
                SetConsoleTextAttribute(hConsole, 15);
                o << "      " << output << ":" << line;
            #elif __MACH__ || __linux__
                std::cout << "\x1B[31m● Internal Exception:\033[0m\t\t" << std::endl;
                std::cout << "      " << arg << std::endl;
                std::cout << "\x1B[31m● Internal Traceback:\033[0m\t\t" << std::endl;
                o << "      " << output << ":" << line;
                std::cout << arg << std::endl;
            #else 
            // future
            #endif
            msg = o.str();
        }

        ~ExceptionX() throw() {}
        const char* what() const throw() {
            return msg.c_str();
        }
    };

}

#define throw_line(arg) throw Sen::Internal::Kernel::Utility::Exception::ExceptionX(arg, __FILE__, __LINE__);