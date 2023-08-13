#pragma once

using uint8 = unsigned char;
using uint16 = unsigned short;
using int16 = short;

void compressFile(char * srcfile, char * dstfile);
void compressImageFile(uint8 * img, uint8 * alphaimg, int width, int height, char * dstfile, int expandedwidth, int expandedheight);

void compressBlockETC2Fast(uint8 * img, uint8 * alphaimg, uint8 * imgdec, int width, int height, int startx, int starty, unsigned int & compressed1, unsigned int & compressed2);
void compressBlockETC2Exhaustive(uint8 * img, uint8 * imgdec, int width, int height, int startx, int starty, unsigned int & compressed1, unsigned int & compressed2);

double compressBlockDiffFlipFast(uint8 * img, uint8 * imgdec, int width, int height, int startx, int starty, unsigned int & compressed1, unsigned int & compressed2);
void compressBlockETC1Exhaustive(uint8 * img, uint8 * imgdec, int width, int height, int startx, int starty, unsigned int & compressed1, unsigned int & compressed2);
void compressBlockETC1ExhaustivePerceptual(uint8 * img, uint8 * imgdec, int width, int height, int startx, int starty, unsigned int & compressed1, unsigned int & compressed2);

void decompressBlockETC2(unsigned int block_part1, unsigned int block_part2, uint8 * img, int width, int height, int startx, int starty);
