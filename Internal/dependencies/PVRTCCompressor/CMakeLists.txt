# PVRTCCompressor Third, but adapted from TwinStar ToolKit for the fix

project(
	PVRTCCompressor
	HOMEPAGE_URL https://github.com/brenwill/PVRTCCompressor
	LANGUAGES C CXX
)

add_library(
	${PROJECT_NAME} STATIC
	./AlphaBitmap.h
	./Bitmap.h
	./BitScale.h
	./BitUtility.h
	./ColorRgba.h
	./Interval.h
	./MortonTable.h
	./Point2.h
	./PvrTcDecoder.h
	./PvrTcEncoder.h
	./PvrTcPacket.h
	./RgbaBitmap.h
	./RgbBitmap.h
	./BitScale.cpp
	./MortonTable.cpp
	./PvrTcDecoder.cpp
	./PvrTcEncoder.cpp
	./PvrTcPacket.cpp
	./main.cpp
)

set_target_properties(PVRTCCompressor PROPERTIES POSITION_INDEPENDENT_CODE ON)
