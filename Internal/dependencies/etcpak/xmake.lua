-- etcpak
-- 1.0 153f0e04a18b93c277684b577365210adcf8e11c
-- https://github.com/wolfpld/etcpak

target('third.etcpak', function()
	set_group('source/third')
	set_kind('static')
	add_headerfiles(
		'./lz4/lz4.h',
		'./getopt/getopt.h',
		'./Bitmap.hpp',
		'./BitmapDownsampled.hpp',
		'./BlockData.hpp',
		'./ColorSpace.hpp',
		'./DataProvider.hpp',
		'./Debug.hpp',
		'./Dither.hpp',
		'./Error.hpp',
		'./ForceInline.hpp',
		'./Math.hpp',
		'./MipMap.hpp',
		'./mmap.hpp',
		'./ProcessCommon.hpp',
		'./ProcessDxtc.hpp',
		'./ProcessRGB.hpp',
		'./Semaphore.hpp',
		'./System.hpp',
		'./Tables.hpp',
		'./TaskDispatch.hpp',
		'./Timing.hpp',
		'./Vector.hpp',
		{ install = false }
	)
	add_files(
		'./lz4/lz4.c',
		'./getopt/getopt.c',
		'./Bitmap.cpp',
		'./BitmapDownsampled.cpp',
		'./BlockData.cpp',
		'./ColorSpace.cpp',
		'./DataProvider.cpp',
		'./Debug.cpp',
		'./Dither.cpp',
		'./Error.cpp',
		'./mmap.cpp',
		'./ProcessDxtc.cpp',
		'./ProcessRGB.cpp',
		'./System.cpp',
		'./Tables.cpp',
		'./TaskDispatch.cpp',
		'./Timing.cpp',
		'./Application.cpp',
		{}
	)
	add_includedirs(
		'..',
		{ public = true }
	)
	add_deps(
		'third.libpng',
		{}
	)
	on_load(function(target)
		import('custom')
		custom.apply_compiler_option_basic(target)
		custom.apply_compiler_option_warning_disable(target)
	end)
end)
