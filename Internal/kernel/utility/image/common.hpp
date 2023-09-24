#pragma once
#include <string>
#include <iostream>
#include <vector>
#include "../../dependencies/libpng/png.h"

#define RED_CHANNELS 0

#define GREEN_CHANNELS 1

#define BLUE_CHANNELS 2

#define ALPHA_CHANNELS 3

class Image {


    private:

        int width, height;

        int channels;

        png_byte color_type;

        png_byte bit_depth;

        png_bytep* row_pointers = NULL;

        inline auto getChannel(
            int channel
        ) -> std::vector<char> 
        {
            auto result = std::vector<char>(width * height);
            for (auto y = 0; y < height; y++) {
                for (auto x = 0; x < width; x++) {
                    result[static_cast<std::vector<char, std::allocator<char>>::size_type>(y) * width + x] = row_pointers[y][x * channels + channel];
                }
            }
            return result;
        }

    public:

        inline Image(
            char* buffer
        ) 
        {
            auto png = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
            if (!png)
            {
                abort();
            }
            auto info = png_create_info_struct(png);
            if (!info) {
                abort();
            }
            if (setjmp(png_jmpbuf(png)))
            {
                abort();
            }
            png_set_read_fn(png, (png_voidp)buffer, user_read_data);
            png_read_info(png, info);
            this->width = png_get_image_width(png, info);
            this->height = png_get_image_height(png, info);
            this->color_type = png_get_color_type(png, info);
            this->bit_depth = png_get_bit_depth(png, info);
            png_read_update_info(png, info);
            auto rowbytes = png_get_rowbytes(png, info);
            this->channels = rowbytes / this->width;
            this->row_pointers = (png_bytep*)malloc(sizeof(png_bytep) * this->height);
            for (auto y = 0; y < this->height; y++) {
                this->row_pointers[y] = (png_byte*)malloc(rowbytes);
            }
            png_read_image(png, this->row_pointers);
            png_destroy_read_struct(&png, &info, NULL);
            png_destroy_read_struct(&png, &info, NULL);
            return;
        }

        ~Image(
        
        ) 
        {
            for (auto y = 0; y < this->height; y++) {
                free(this->row_pointers[y]);
            }
            free(this->row_pointers);
            return;
        }

        inline auto getWidth(
        
        ) const -> int
        {
            return width;
        }

        inline auto getHeight
        (
        
        ) const -> int
        {
            return height;
        }

        inline auto getChannels(
        
        ) const -> int
        {
            return channels;
        }

        inline auto getRedChannel
        (
        
        ) -> std::vector<char> 
        {
            return this->getChannel(RED_CHANNELS);
        }

        inline auto getGreenChannel
        (
        
        ) -> std::vector<char>
        {
            return this->getChannel(GREEN_CHANNELS);
        }

        inline auto getBlueChannel
        (
        
        ) -> std::vector<char> 
        {
            return this->getChannel(BLUE_CHANNELS);
        }

        inline auto getAlphaChannel
        (
        
        ) -> std::vector<char>
        {
            return this->getChannel(ALPHA_CHANNELS);
        }


};

inline auto user_read_data(
    png_structp png_ptr, 
    png_bytep data, 
    png_size_t length
) -> void 
{
    auto ptr = (char*)png_get_io_ptr(png_ptr);
    memcpy(data, ptr, length);
    return;
}
